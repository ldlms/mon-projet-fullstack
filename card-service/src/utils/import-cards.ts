import { Color, CardType, CardSupertype, DeckFormat } from '../prisma/client';
import * as fs from 'fs';
import { prisma } from '../config/prisma';
import { chain } from 'stream-chain';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';

interface ScryfallCard {
  id: string;
  oracle_id: string;
  name: string;
  mana_cost?: string;
  cmc: number;
  colors?: string[];
  color_identity?: string[];
  type_line: string;
  supertypes?: string[];
  subtypes?: string[];
  power?: string;
  toughness?: string;
  loyalty?: string;
  defense?: string;
  legalities?: Record<string, string>;
  image_uris?: Record<string, string>;
  printings?: string[];
  oracle_text?: string;
}

function parseManaCost(manaCost: string): Partial<Record<Color | 'colorless', number>> {
  if (!manaCost) return {};
  const manaCounts: Partial<Record<Color | 'colorless', number>> = {};
  const regex = /\{([^}]+)\}/g;
  let match;
  while ((match = regex.exec(manaCost)) !== null) {
    const symbol = match[1];
    if (!symbol) continue;
    if (['W', 'U', 'B', 'R', 'G'].includes(symbol)) {
      const colorKey = symbol as Color;
      manaCounts[colorKey] = (manaCounts[colorKey] || 0) + 1;
    } else if (!isNaN(Number(symbol))) {
      manaCounts['colorless'] = (manaCounts['colorless'] || 0) + Number(symbol);
    }
  }
  return manaCounts;
}

function mapColors(colors?: string[]): Color[] {
  if (!colors) return [];
  return colors.filter(c => ['W','U','B','R','G'].includes(c)) as Color[];
}

function mapTypes(typeLine: string): CardType[] {
  if (!typeLine) return [];
  const types = (typeLine.split('—')[0] || '').trim().split(' ');
  return types.filter(t => ['Artifact','Creature','Enchantment','Instant','Land','Planeswalker','Sorcery','Battle'].includes(t)) as CardType[];
}

function mapSupertypes(typeLine: string): CardSupertype[] {
  if (!typeLine) return [];
  const types = (typeLine.split('—')[0] || '').trim().split(' ');
  return types.filter(t => ['Legendary','Basic','Snow'].includes(t)) as CardSupertype[];
}

function mapLegalities(legalities?: Record<string,string>): Array<{format: DeckFormat; legal: boolean}> {
  if (!legalities) return [];
  const map: Record<string, DeckFormat> = {
    'standard':'Standard','pioneer':'Pioneer','modern':'Modern','legacy':'Legacy','vintage':'Vintage',
    'commander':'Commander','pauper':'Pauper','historic':'Historic'
  };
  return Object.entries(legalities)
    .map(([format, status]) => {
      if (!map[format]) return null;
      return { format: map[format], legal: status.toLowerCase()==='legal' };
    })
    .filter((x): x is {format: DeckFormat; legal:boolean} => !!x);
}

async function importFromScryfallDump(scryfallFile: string, batchSize = 50) {
  console.log('📖 Lecture du dump Scryfall...');
  
  const oracleMap: Record<string, ScryfallCard> = {};
  const pipeline = chain([
    fs.createReadStream(scryfallFile),
    parser(),
    streamArray()
  ]);

  pipeline.on('data', ({value}: any) => {
    if (value.oracle_id) {
      oracleMap[value.oracle_id] = value;
    }
  });

  await new Promise<void>((resolve) => {
    pipeline.on('end', () => resolve());
  });

  console.log(`✅ Dump chargé. Cartes uniques: ${Object.keys(oracleMap).length}`);

  const allOracleIds = Object.keys(oracleMap);
  let imported = 0;
  let errors = 0;

  for (let i = 0; i < allOracleIds.length; i += batchSize) {
    const batchIds = allOracleIds.slice(i, i + batchSize);
    const results = await Promise.allSettled(batchIds.map(async (oracleId) => {
      const card = oracleMap[oracleId];
      if (!card) throw new Error(`Card not found for oracle id: ${oracleId}`);
      const cardId = card.id; // UUID Scryfall spécifique à la carte
      
      const manaCostParsed = parseManaCost(card.mana_cost || '');
      const legalities = mapLegalities(card.legalities);

      const cardData = {
        name: card.name,
        oracleText: card.oracle_text || null,
        manaValue: Math.floor(card.cmc || 0),
        types: mapTypes(card.type_line),
        supertypes: mapSupertypes(card.type_line),
        subtypes: card.subtypes || [],
        colors: mapColors(card.colors),
        colorIdentity: mapColors(card.color_identity),
        power: card.power || null,
        toughness: card.toughness || null,
        loyalty: card.loyalty || null,
        defense: card.defense || null,
        imageUrl: card.image_uris?.border_crop || null,
        scryfallOracleId: card.oracle_id,
      };

      await prisma.card.upsert({
        where: { id: cardId },
        update: {
          ...cardData,
          manaCost: {
            deleteMany: {},
            create: Object.entries(manaCostParsed).map(([color, amount]) => ({
              color: color==='colorless'?null:(color as Color),
              amount
            }))
          },
          legalities: {
            deleteMany: {},
            create: legalities
          }
        },
        create: {
          id: cardId,
          ...cardData,
          manaCost: {
            create: Object.entries(manaCostParsed).map(([color, amount]) => ({
              color: color==='colorless'?null:(color as Color),
              amount
            }))
          },
          legalities: {
            create: legalities
          }
        }
      });
    }));

    results.forEach((res, idx) => {
      if (res.status === 'fulfilled') imported++;
      else { errors++; console.error(`❌ Erreur pour ${batchIds[idx]}:`, res.reason); }
    });

    console.log(`✅ Lot ${Math.floor(i/batchSize)+1} traité (${imported} importées, ${errors} erreurs)`);
  }

  console.log(`\n🎉 Import terminé! ${imported} cartes importées, ${errors} erreurs`);
}


const scryfallFile = process.argv[2] || './scryfall-default-cards.json';
if (!fs.existsSync(scryfallFile)) {
  console.error(`❌ Fichier non trouvé: ${scryfallFile}`);
  process.exit(1);
}

importFromScryfallDump(scryfallFile)
  .catch(err => { console.error('💥 Erreur fatale:', err); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

import { Color, CardType, CardSupertype, DeckFormat } from '../prisma/client';
import * as fs from 'fs';
import { prisma } from '../config/prisma';

// Mappage des couleurs JSON vers enum Prisma
const colorMap: Record<string, Color> = {
  'W': 'W',
  'U': 'U',
  'B': 'B',
  'R': 'R',
  'G': 'G'
};

// Mappage des types JSON vers enum Prisma
const typeMap: Record<string, CardType> = {
  'Artifact': 'Artifact',
  'Creature': 'Creature',
  'Enchantment': 'Enchantment',
  'Instant': 'Instant',
  'Land': 'Land',
  'Planeswalker': 'Planeswalker',
  'Sorcery': 'Sorcery',
  'Battle': 'Battle'
};

// Mappage des supertypes JSON vers enum Prisma
const supertypeMap: Record<string, CardSupertype> = {
  'Basic': 'Basic',
  'Legendary': 'Legendary',
  'Snow': 'Snow'
};

// Mappage des formats de légalité
const formatMap: Record<string, DeckFormat> = {
  'standard': 'Standard',
  'pioneer': 'Pioneer',
  'modern': 'Modern',
  'legacy': 'Legacy',
  'vintage': 'Vintage',
  'commander': 'Commander',
  'pauper': 'Pauper',
  'historic': 'Historic'
};

interface MTGCard {
  name: string;
  text?: string;
  manaCost?: string;
  manaValue: number;
  types: string[];
  supertypes?: string[];
  subtypes?: string[];
  colors?: string[];
  colorIdentity?: string[];
  power?: string;
  toughness?: string;
  loyalty?: string;
  defense?: string;
  legalities?: Record<string, string>;
}

interface MTGJsonData {
  data: Record<string, MTGCard[]>;
}

function parseManaCost(manaCost: string): Partial<Record<Color | 'colorless', number>> {
  if (!manaCost) return {};
  
  const manaCounts: Partial<Record<Color | 'colorless', number>> = {};
  const regex = /\{([^}]+)\}/g;
  let match;
  
  while ((match = regex.exec(manaCost)) !== null) {
    const symbol = match[1];
    if (!symbol) continue;
    
    // Symboles de couleur simple (W, U, B, R, G)
    if (['W', 'U', 'B', 'R', 'G'].includes(symbol)) {
      const colorKey = symbol as Color;
      manaCounts[colorKey] = (manaCounts[colorKey] || 0) + 1;
    }
    // Symboles hybrides (W/U, B/R, etc.)
    else if (symbol.includes('/')) {
      const colors = symbol.split('/');
      const firstColor = colors[0];
      if (firstColor && ['W', 'U', 'B', 'R', 'G'].includes(firstColor)) {
        const colorKey = firstColor as Color;
        manaCounts[colorKey] = (manaCounts[colorKey] || 0) + 1;
      }
    }
    // Symboles de Phyrexian (W/P, U/P, etc.)
    else if (symbol.includes('/P')) {
      const color = symbol.replace('/P', '');
      if (['W', 'U', 'B', 'R', 'G'].includes(color)) {
        const colorKey = color as Color;
        manaCounts[colorKey] = (manaCounts[colorKey] || 0) + 1;
      }
    }
    // Mana incolore (chiffres, X, etc.)
    else {
      const amount = parseInt(symbol);
      if (!isNaN(amount)) {
        manaCounts['colorless'] = (manaCounts['colorless'] || 0) + amount;
      }
    }
  }
  
  return manaCounts;
}

function mapColors(colors?: string[]): Color[] {
  if (!colors || colors.length === 0) return [];
  return colors.map(c => colorMap[c]).filter((c): c is Color => c !== undefined);
}

function mapTypes(types?: string[]): CardType[] {
  if (!types || types.length === 0) return [];
  return types.map(t => typeMap[t]).filter((t): t is CardType => t !== undefined);
}

function mapSupertypes(supertypes?: string[]): CardSupertype[] {
  if (!supertypes || supertypes.length === 0) return [];
  return supertypes.map(st => supertypeMap[st]).filter((st): st is CardSupertype => st !== undefined);
}

function mapLegalities(legalities?: Record<string, string>): Array<{ format: DeckFormat; legal: boolean }> {
  if (!legalities) return [];
  
  return Object.entries(legalities)
    .map(([format, status]) => {
      const mappedFormat = formatMap[format.toLowerCase()];
      if (!mappedFormat) return null;
      
      return {
        format: mappedFormat,
        legal: status.toLowerCase() === 'legal'
      };
    })
    .filter((item): item is { format: DeckFormat; legal: boolean } => item !== null);
}

async function importCards(jsonFilePath: string, batchSize = 50) {
  console.log('📖 Lecture du fichier JSON...');
  
  const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
  const jsonData: MTGJsonData = JSON.parse(fileContent);
  
  console.log('✅ Fichier JSON chargé');
  
  const allCards: MTGCard[] = [];
  
  // Extraction de toutes les cartes (première variation uniquement)
  for (const [cardName, variations] of Object.entries(jsonData.data)) {
    if (variations && variations.length > 0 && variations[0]) {
      allCards.push(variations[0]);
    }
  }
  
  console.log(`📊 Total de cartes à importer: ${allCards.length}`);
  
  let imported = 0;
  let errors = 0;
  
  // Import par lots
  for (let i = 0; i < allCards.length; i += batchSize) {
    const batch = allCards.slice(i, i + batchSize);
    
    console.log(`⏳ Import du lot ${Math.floor(i / batchSize) + 1}/${Math.ceil(allCards.length / batchSize)} (${i + 1}-${Math.min(i + batchSize, allCards.length)}/${allCards.length})...`);
    
    const results = await Promise.allSettled(
      batch.map(async (card) => {
        // Génération d'un ID unique basé sur le nom
        const cardId = card.name.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Retire les accents
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        
        const manaCostParsed = parseManaCost(card.manaCost || '');
        const legalities = mapLegalities(card.legalities);
        
        await prisma.card.upsert({
          where: { id: cardId },
          update: {
            name: card.name,
            oracleText: card.text || null,
            manaValue: Math.floor(card.manaValue || 0),
            types: mapTypes(card.types),
            supertypes: mapSupertypes(card.supertypes),
            subtypes: card.subtypes || [],
            colors: mapColors(card.colors),
            colorIdentity: mapColors(card.colorIdentity),
            power: card.power || null,
            toughness: card.toughness || null,
            loyalty: card.loyalty || null,
            defense: card.defense || null,
            manaCost: {
              deleteMany: {},
              create: Object.entries(manaCostParsed).map(([color, amount]) => ({
                color: color === 'colorless' ? null : (color as Color),
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
            name: card.name,
            oracleText: card.text || null,
            manaValue: Math.floor(card.manaValue || 0),
            types: mapTypes(card.types),
            supertypes: mapSupertypes(card.supertypes),
            subtypes: card.subtypes || [],
            colors: mapColors(card.colors),
            colorIdentity: mapColors(card.colorIdentity),
            power: card.power || null,
            toughness: card.toughness || null,
            loyalty: card.loyalty || null,
            defense: card.defense || null,
            manaCost: {
              create: Object.entries(manaCostParsed).map(([color, amount]) => ({
                color: color === 'colorless' ? null : (color as Color),
                amount
              }))
            },
            legalities: {
              create: legalities
            }
          }
        });
      })
    );
    
    // Comptage des résultats
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        imported++;
      } else {
        errors++;
        console.error(`❌ Erreur pour ${batch[index]?.name}:`, result.reason?.message || result.reason);
      }
    });
    
    console.log(`✅ Lot ${Math.floor(i / batchSize) + 1} traité (${imported} importées, ${errors} erreurs)`);
  }
  
  console.log(`\n🎉 Import terminé !`);
  console.log(`✅ ${imported} cartes importées avec succès`);
  console.log(`❌ ${errors} erreurs`);
}

// Exécution
const jsonPath = process.argv[2] || './cards.json';

if (!fs.existsSync(jsonPath)) {
  console.error(`❌ Fichier non trouvé: ${jsonPath}`);
  process.exit(1);
}

importCards(jsonPath)
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import * as fs from 'fs';
import { prisma } from '../config/prisma.ts';
import type { CardSupertype, CardType, Color, DeckFormat } from '../../generated/prisma/enums.ts';

// Mappage des couleurs
const colorMap: Record<string, Color> = {
  'W': 'W',
  'U': 'U',
  'B': 'B',
  'R': 'R',
  'G': 'G'
};

// Mappage des types - Scryfall utilise type_line
const typeKeywords = {
  'Artifact': 'Artifact',
  'Creature': 'Creature',
  'Enchantment': 'Enchantment',
  'Instant': 'Instant',
  'Land': 'Land',
  'Planeswalker': 'Planeswalker',
  'Sorcery': 'Sorcery',
  'Battle': 'Battle'
} as const;

const supertypeKeywords = {
  'Basic': 'Basic',
  'Legendary': 'Legendary',
  'Snow': 'Snow'
} as const;

// Mappage des formats
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

interface ScryfallCard {
  id: string;
  name: string;
  oracle_text?: string;
  mana_cost?: string;
  cmc: number;
  type_line: string;
  colors?: string[];
  color_identity?: string[];
  power?: string;
  toughness?: string;
  loyalty?: string;
  defense?: string;
  legalities?: Record<string, string>;
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
    png?: string;
    art_crop?: string;
    border_crop?: string;
  };
}

function parseTypeLine(typeLine: string): {
  types: CardType[];
  supertypes: CardSupertype[];
  subtypes: string[];
} {
  const types: CardType[] = [];
  const supertypes: CardSupertype[] = [];
  const subtypes: string[] = [];

  // Séparer la ligne de type par " — " pour obtenir types et subtypes
  const parts = typeLine.split(' — ');
  const typesPart = parts[0] || '';
  const subtypesPart = parts[1] || '';

  // Parser les types et supertypes
  const typeWords = typesPart.split(' ');
  for (const word of typeWords) {
    if (word in supertypeKeywords) {
      supertypes.push(supertypeKeywords[word as keyof typeof supertypeKeywords]);
    } else if (word in typeKeywords) {
      types.push(typeKeywords[word as keyof typeof typeKeywords]);
    }
  }

  // Parser les subtypes
  if (subtypesPart) {
    subtypes.push(...subtypesPart.split(' ').filter(Boolean));
  }

  return { types, supertypes, subtypes };
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
    }
    else if (symbol.includes('/')) {
      const colors = symbol.split('/');
      const firstColor = colors[0];
      if (firstColor && ['W', 'U', 'B', 'R', 'G'].includes(firstColor)) {
        const colorKey = firstColor as Color;
        manaCounts[colorKey] = (manaCounts[colorKey] || 0) + 1;
      }
    }
    else if (symbol.includes('/P')) {
      const color = symbol.replace('/P', '');
      if (['W', 'U', 'B', 'R', 'G'].includes(color)) {
        const colorKey = color as Color;
        manaCounts[colorKey] = (manaCounts[colorKey] || 0) + 1;
      }
    }
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

async function importScryfallCards(jsonFilePath: string, batchSize = 50) {
  console.log('📖 Lecture du fichier Scryfall JSON...');
  
  const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
  
  let allCards: ScryfallCard[] = [];
  
  // Essayer de parser comme JSON Lines (NDJSON)
  try {
    const lines = fileContent.split('\n').filter(line => line.trim());
    allCards = lines.map(line => JSON.parse(line));
    console.log('✅ Format détecté: JSON Lines (NDJSON)');
  } catch (error) {
    // Si ça échoue, essayer comme JSON standard
    try {
      const jsonData: { data: unknown } = JSON.parse(fileContent);

      // Si c'est un tableau
      if (Array.isArray(jsonData)) {
        allCards = jsonData;
      }
      // Si c'est un objet avec une propriété data (comme MTGJson)
      else if (jsonData.data) {
        allCards = Object.values(jsonData.data as Record<string, ScryfallCard[]>).flat();
      }
      console.log('✅ Format détecté: JSON standard');
    } catch (parseError) {
      console.error('❌ Impossible de parser le fichier JSON');
      throw parseError;
    }
  }
  
  console.log('✅ Fichier JSON chargé');
  console.log(`📊 Total de cartes à importer: ${allCards.length}`);
  
  let imported = 0;
  let errors = 0;
  
  // Import par lots (séquentiel)
  for (let i = 0; i < allCards.length; i += batchSize) {
    const batch = allCards.slice(i, i + batchSize);
    
    console.log(`⏳ Import du lot ${Math.floor(i / batchSize) + 1}/${Math.ceil(allCards.length / batchSize)} (${i + 1}-${Math.min(i + batchSize, allCards.length)}/${allCards.length})...`);
    
    // Traiter les cartes une par une
    for (const card of batch) {
      try {
        // Utiliser l'ID Scryfall ou générer un ID à partir du nom
        const cardId = card.id || card.name.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        
        const { types, supertypes, subtypes } = parseTypeLine(card.type_line);
        const manaCostParsed = parseManaCost(card.mana_cost || '');
        const legalities = mapLegalities(card.legalities);
        
        // Récupérer l'URL de l'image border_crop
        const imageUri = card.image_uris?.border_crop || 
                        card.image_uris?.large || 
                        card.image_uris?.normal || 
                        null;
        
        await prisma.card.upsert({
          where: { id: cardId },
          update: {
            name: card.name,
            oracleText: card.oracle_text || null,
            manaValue: Math.floor(card.cmc || 0),
            types,
            supertypes,
            subtypes,
            imageUri,
            colors: mapColors(card.colors),
            colorIdentity: mapColors(card.color_identity),
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
            oracleText: card.oracle_text || null,
            manaValue: Math.floor(card.cmc || 0),
            types,
            supertypes,
            subtypes,
            imageUri,
            colors: mapColors(card.colors),
            colorIdentity: mapColors(card.color_identity),
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
        
        imported++;
      } catch (error: any) {
        errors++;
        console.error(`❌ Erreur pour ${card.name}:`, error?.message || error);
      }
    }
    
    console.log(`✅ Lot ${Math.floor(i / batchSize) + 1} traité (${imported} importées, ${errors} erreurs)`);
  }
  
  console.log(`\n🎉 Import terminé !`);
  console.log(`✅ ${imported} cartes importées avec succès`);
  console.log(`❌ ${errors} erreurs`);
}

// Exécution
const jsonPath = process.argv[2] || './scryfall-cards.json';

if (!fs.existsSync(jsonPath)) {
  console.error(`❌ Fichier non trouvé: ${jsonPath}`);
  process.exit(1);
}

importScryfallCards(jsonPath)
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
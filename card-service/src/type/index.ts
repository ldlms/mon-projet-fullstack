export interface Card{
    id: String,
    name: String,
    oracleText?: String | null,
    manaValue: number,
    types: CardType[],
    supertypes: CardSupertype[],
    subtypes: String[],
    imageKey?: String,
    colors: Color[],
    colorIdentity: Color[],
    power?: String,
    toughness?: String,
    loyalty?: String,
    defense?: String,
    manaCost?: CardMana[],
    legalities?: CardLegality[],
    createdAt: Date,
}

export enum CardType{
    Creature,
    Sorcery,
    Instant,
    Artifact,
    Enchantment,
    Land,
    Planeswalker,
    Battle
}

export interface CardMana {
    id: String,
    cardId: String,
    color?: Color,
    amount: number,
    isGeneric: boolean
}

export interface CardLegality {
    cardId: String,
    format: DeckFormat,
    legal: Boolean
}

export enum CardSupertype {
  Legendary,
  Basic,
  Snow
}

export enum Color {
  W,
  U,
  B,
  R,
  G
}

export enum DeckFormat {
  Standard,
  Pioneer,
  Modern,
  Legacy,
  Vintage,
  Commander,
  Pauper,
  Historic
}


import { CardType, CardSupertype, Color, DeckFormat} from "../prisma/enums.js";


export interface Card{
    id: String,
    name: String,
    oracleText?: String | null,
    manaValue: number,
    types: CardType[],
    supertypes: CardSupertype[],
    subtypes: String[],
    imageKey?: String | null,
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




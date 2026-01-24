
export interface Deck {
  id: string;
  name: string;
  format: string;
  currentCount: number;
  maxCount: number;
  colors: string[];
  imageUri: string;
  cards: DeckCard[];
}

export interface DeckCard {
  id: string;
  scryFallId: string;
  name: string;
  quantity: number;
  cost: string;
  imageUri:string;
}

export interface DeckProp{
  id:string;
  name: string;
  format: string;
  currentCount: number;
  maxCount: number;
  colors: string[];
  cards: DeckCard[];
  imageUri:string;
}









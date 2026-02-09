
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

export type User = {
  id: string;
  email: string;
  username?: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};










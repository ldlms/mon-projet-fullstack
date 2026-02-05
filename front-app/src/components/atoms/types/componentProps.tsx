import { ComponentPropsWithoutRef } from "react";
import { Deck, DeckCard } from "./props";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
};

export type InputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export interface NavLinkProps extends ComponentPropsWithoutRef<'a'>  {
  isActive?: boolean;
  isDisabled?:boolean;
}

export type NavItem = {
  label: string;
  href: string;
  isDisabled?: boolean;
};

export interface NavBarProps {
  items: NavItem[];
  activeHref?: string; 
  className?: string;
}

export type ManaDotProp = {
  color: string;
}

export type CardRowProp = {
  card: DeckCardComponentProps;
  onRemove: () => void;
  onPreview: () => void;
}

export interface DeckCardComponentProps {
  deck: Deck;
  isSelected: boolean;
  onSelectDeck: (deck: Deck) => void;
}

export type DeckListProps = {
  decks: Deck[];
  selectedDeckId?: string;
  onSelectDeck: (deck: Deck) => void;
};

export interface DeckHeaderProp{
  deck:Deck;
  onEdit: () => void;
  onToggleSideBoard: () => void;
}

export interface CardProp{
  id:string;
  imageUri:string;
  onClick?: (e:any) => void;
}

export type CardListProps = {
  cards: DeckCard[];
  onAddCard: (card: DeckCard) => void;
  onPreviewCard?: (card: DeckCard) => void;
};

export type DeckSideBarProps = {
  deck: Deck | null;
  onRemoveCard: (cardId: string) => void;
  onPreviewCard?: (card: DeckCard) => void;
  onClose?: () => void;
};

export interface CardItemProps extends CardProp {
  id: string;
  imageUri: string;
  onClick: (e: React.MouseEvent) => void;
  onAddCard?: () => void;
}
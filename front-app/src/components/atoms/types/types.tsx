import { ComponentPropsWithoutRef } from "react";

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
  card: Card;
}

export interface Card {
  id: string;
  name: string;
  quantity: number;
  cost: string;
}

export interface Deck{
  name: string;
  format: string;
  currentCount: number;
  maxCount: number;
  colors: string[];
  cards: Card[];
}

export interface DeckHeaderProp{
  deck:Deck;
  onEdit: () => void;
  onToggleSideBoard: () => void;
}





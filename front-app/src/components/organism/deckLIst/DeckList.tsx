import React from 'react';
import DeckCard from '../../molecule/Deck.tsx';

const decks = [
  { name: 'Deck Rouge', format: 'Standard', cardCount: 40, imageUrl: 'https://via.placeholder.com/200x70/ff4d4d' },
  { name: 'Deck Bleu', format: 'Modern', cardCount: 60, imageUrl: 'https://via.placeholder.com/200x70/4d79ff' },
  { name: 'Deck Vert', format: 'Commander', cardCount: 100, imageUrl: 'https://via.placeholder.com/200x70/4dff88' },
  { name: 'Deck Noir', format: 'Standard', cardCount: 45, imageUrl: 'https://via.placeholder.com/200x70/333333' },
  { name: 'Deck Blanc', format: 'Legacy', cardCount: 60, imageUrl: 'https://via.placeholder.com/200x70/ffffff' },
  { name: 'Deck Multicolore', format: 'Modern', cardCount: 75, imageUrl: 'https://via.placeholder.com/200x70/ffcc00' },
];

const DeckList = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {decks.map((deck, index) => (
        <DeckCard
          key={index}
          name={deck.name}
          format={deck.format}
          cardCount={deck.cardCount}
          imageUrl={deck.imageUrl}
        />
      ))}
    </div>
  );
};

export default DeckList;
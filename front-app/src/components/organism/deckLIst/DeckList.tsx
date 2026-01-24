import DeckCard from '../../molecule/Deck.tsx';

const decks = [
  { name: 'Deck Rouge', format: 'Standard', cardCount: 40, imageUrl: 'https://cards.scryfall.io/art_crop/front/0/0/0002ab72-834b-4c81-82b1-0d2760ea96b0.jpg?1596250027' },
  { name: 'Deck Bleu', format: 'Modern', cardCount: 60, imageUrl: 'https://cards.scryfall.io/art_crop/front/0/0/0002ab72-834b-4c81-82b1-0d2760ea96b0.jpg?1596250027' },
  { name: 'Deck Vert', format: 'Commander', cardCount: 100, imageUrl: 'https://cards.scryfall.io/art_crop/front/0/0/0002ab72-834b-4c81-82b1-0d2760ea96b0.jpg?1596250027' },
  { name: 'Deck Noir', format: 'Standard', cardCount: 45, imageUrl: 'https://cards.scryfall.io/art_crop/front/0/0/0002ab72-834b-4c81-82b1-0d2760ea96b0.jpg?1596250027' },
  { name: 'Deck Blanc', format: 'Legacy', cardCount: 60, imageUrl: 'https://cards.scryfall.io/art_crop/front/0/0/0002ab72-834b-4c81-82b1-0d2760ea96b0.jpg?1596250027' },
  { name: 'Deck Multicolore', format: 'Modern', cardCount: 75, imageUrl: 'https://cards.scryfall.io/art_crop/front/0/0/0002ab72-834b-4c81-82b1-0d2760ea96b0.jpg?1596250027' },
];

const DeckList = () => {
  return (
    <div className="
      flex flex-col
      md:flex-row md:flex-wrap
      gap-4
    ">
      {decks.map((deck, index) => (
        <DeckCard key={index} {...deck} />
      ))}
    </div>
  );
};

export default DeckList;
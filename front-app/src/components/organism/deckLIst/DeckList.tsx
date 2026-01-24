import DeckCard from '../../molecule/DeckCard.tsx';
import {DeckListProps} from "../../atoms/types/componentProps.tsx"


const DeckList = ({ decks, onSelectDeck, selectedDeckId }: DeckListProps) => {
  return (
    <div className="
      flex flex-col
      md:flex-row md:flex-wrap
      gap-4
    ">
      {decks.map(deck => (
        <DeckCard
          key={deck.id}
          deck={deck}
          isSelected={deck.id === selectedDeckId}
          onSelectDeck={onSelectDeck}
        />
      ))}
    </div>
  );
};

export default DeckList;
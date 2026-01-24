import {DeckCardComponentProps} from "../atoms/types/componentProps.tsx"


const DeckCard = ({ deck, isSelected, onSelectDeck }: DeckCardComponentProps) => {
  return (
    <div
      onClick={() => onSelectDeck(deck)}
      className={`
        cursor-pointer
        rounded-lg
        transition-all
        ${isSelected
          ? 'ring-2 ring-indigo-500'
          : 'hover:shadow-lg'}
      `}
    >
      <img src={deck.imageUri} alt={deck.name} />
      <div className="p-4">
        <h3>{deck.name}</h3>
        <p>{deck.format}</p>
        <p>{deck.currentCount} cartes</p>
      </div>
    </div>
  );
};

export default DeckCard;
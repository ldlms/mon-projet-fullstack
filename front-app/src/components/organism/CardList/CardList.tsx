import CardItem from "../../molecule/CardItem.tsx";
import { CardListProps } from "../../atoms/types/componentProps.tsx";

const CardList = ({ cards, onAddCard, onPreviewCard }: CardListProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cards.map(card => (
        <CardItem
          key={card.id}
          id={card.id}
          imageUri={card.imageUri}
          onClick={(e) => {
            // Clic gauche = prévisualisation
            if (e.button === 0) {
              onPreviewCard?.(card);
            }
          }}
          onAddCard={() => onAddCard(card)}
        />
      ))}
    </div>
  );
};

export default CardList;
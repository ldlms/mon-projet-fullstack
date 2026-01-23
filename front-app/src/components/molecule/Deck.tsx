import './DeckCard.css';
import { DeckProp } from '../atoms/types/types';

const DeckCard = ({ name, format, cardCount, imageUrl }:DeckProp) => {
  return (
    <div className="deck-card">
      <img src={imageUrl} alt={name} className="deck-image" />
      <div className="deck-info">
        <h3>{name}</h3>
        <p>{format}</p>
        <p>{cardCount} cartes</p>
      </div>
    </div>
  );
};

export default DeckCard;

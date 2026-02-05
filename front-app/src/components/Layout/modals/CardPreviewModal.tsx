import { DeckCard } from "../../atoms/types/props";

interface CardPreviewModalProps {
  card: DeckCard | null;
  onClose: () => void;
}

function CardPreviewModal({ card, onClose }: CardPreviewModalProps) {
  if (!card) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold"
          aria-label="Fermer"
        >
          ✕
        </button>

        {/* Image de la carte */}
        <img
          src={card.imageUri}
          alt={card.name}
          className="w-full h-auto rounded-lg shadow-2xl"
        />

        {/* Informations supplémentaires (optionnel) */}
        <div className="mt-4 text-center text-white">
          <h3 className="text-xl font-bold">{card.name}</h3>
          <p className="text-sm text-gray-300 mt-1">{card.cost}</p>
        </div>
      </div>
    </div>
  );
}

export default CardPreviewModal;
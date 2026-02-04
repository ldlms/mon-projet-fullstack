import { DeckCard } from "../../atoms/types/props";

interface CardPreviewModalProps {
  card: DeckCard | null;
  onClose: () => void;
}

function CardPreviewModal({ card, onClose }: CardPreviewModalProps) {
  if (!card) return null;

  return (
    <div>le modal</div>
  );
}

export default CardPreviewModal;

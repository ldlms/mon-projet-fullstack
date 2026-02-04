import { CardRowProp } from "../atoms/types/componentProps.tsx";

function CardRow({ card, onRemove, onPreview }: CardRowProp) {
  return (
    <div
      onClick={onPreview}
      className="
        flex items-center bg-white rounded-full px-4 py-2 mb-2
        shadow-sm text-sm border border-gray-200
        hover:bg-gray-50 transition cursor-pointer
      "
    >
      <span className="font-bold text-gray-700 w-10">
        x{card.quantity}
      </span>

      <span className="flex-grow text-center font-medium text-gray-800 truncate px-2">
        {card.name}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation(); 
          onRemove();
        }}
        className="ml-2 text-red-500 hover:text-red-700 font-bold"
        title="Retirer une carte"
      >
        −
      </button>
    </div>
  );
}

export default CardRow;
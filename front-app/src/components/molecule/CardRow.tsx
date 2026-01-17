import { CardRowProp } from "../atoms/types/types";

function CardRow({
    card,
}:CardRowProp){
    return (
    <div className="flex items-center bg-white rounded-full px-4 py-2 mb-2 shadow-sm text-sm border border-gray-200 hover:bg-gray-50 transition">
      <span className="font-bold text-gray-700 w-10 text-left">
        x{card.quantity}
      </span>

      <span className="flex-grow text-center font-medium text-gray-800 truncate px-2">
        {card.name}
      </span>

      <span className="text-gray-500 text-xs w-16 text-right">
        {card.cost}
      </span>
    </div>
  );
}

export default CardRow;
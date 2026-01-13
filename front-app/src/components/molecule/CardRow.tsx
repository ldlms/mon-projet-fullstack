import { CardRowProp } from "../atoms/types/types";

function CardRow({
    card,
}:CardRowProp){
    return(
        <div className="flex justify-between items-center bg-white rounded-full px-4 py-2 mb-2 shadow-sm text-sm border border-gray-200">
            <span className="font-bold text-grey-700 w-8">X {card.quantity}</span>
            <span className="flex-grow text-center font-medium text-grey-800 truncate px-2">{card.name}</span>
            <span className="text-grey-500 text-xs w-16 text-right">{card.cost}</span>
        </div>
    )
}

export default CardRow;
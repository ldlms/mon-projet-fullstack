import { DeckHeaderProp } from "../../atoms/types/props.tsx";
import Button from "../../atoms/buttons/button.tsx";
import ManaDot from "../../atoms/manaDot/manaDot.tsx";

function DeckHeader({
    deck,
    onEdit,
    onToggleSideBoard
}:DeckHeaderProp){
    return (
    <div className="bg-gray-600 px-3 py-2 text-white shadow-md ">

      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-300 uppercase tracking-wide">
          {deck.format}
        </span>
        <Button variant="primary" onClick={onEdit}>
          Edit
        </Button>
      </div>

      <div className="flex items-center mb-2">
        <h2 className="text-xl font-bold mr-3 truncate">
          {deck.name}
        </h2>
        <div className="flex gap-1">
          {deck.colors.map((color, index) => (
            <ManaDot key={index} color={color} />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-light">
          {deck.currentCount} / {deck.maxCount}
        </span>
      </div>

      <button
        onClick={onToggleSideBoard}
        className="flex items-center justify-center gap-2 w-full bg-gray-500 hover:bg-gray-400 transition rounded-full py-2 text-sm font-medium"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        Sideboard
      </button>
    </div>
  );
}

export default DeckHeader;
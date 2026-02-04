import DeckHeader from "../../organism/DeckHeader/DeckHeader.tsx";
import CardRow from "../../molecule/CardRow.tsx";
import { useState } from "react";
import {CardRowProp, DeckSideBarProps} from "../../atoms/types/componentProps.tsx"



function DeckSidebar({ deck, onRemoveCard }: DeckSideBarProps) {
  const [isSideboardOpen, setIsSideboardOpen] = useState(false);

  if (!deck) {
    return (
      <aside className="
        bg-gray-700 flex items-center justify-center
        w-full h-[45vh]
        md:w-80 md:h-full
        border-t md:border-l border-gray-600
        text-gray-300
      ">
        Sélectionne un deck
      </aside>
    );
  }

  return (
    <aside className="
      bg-gray-700 flex flex-col
      w-full h-[45vh]
      md:w-80 md:h-full
      border-t md:border-t-0 md:border-l border-gray-600
    ">
      <DeckHeader
        deck={deck}
        onEdit={() => console.log("edit")}
        onToggleSideBoard={() =>
          setIsSideboardOpen(prev => !prev)
        }
      />

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {deck.cards.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Aucune carte dans le deck
          </p>
        ) : (
          deck.cards.map((card) => (
            <CardRow
              key={card.id}
              card={card}
              onRemove={() => onRemoveCard(card.id)}
          />
          ))
        )}
      </div>

      {isSideboardOpen && (
        <div className="border-t border-gray-600 p-3">
          Sideboard ici
        </div>
      )}
    </aside>
  );
}

export default DeckSidebar;

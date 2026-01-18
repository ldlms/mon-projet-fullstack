import { useEffect, useState } from "react";
import DeckHeader from "../../organism/DeckHeader/DeckHeader.tsx";
import CardRow from "../../molecule/CardRow.tsx";
import { Deck } from "../../atoms/types/types.tsx";

function DeckSidebar() {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isSideboardOpen, setIsSideboardOpen] = useState(false);

  useEffect(() => {

    setDeck({
      name: "Nom du deck",
      format: "Commander",
      currentCount: 98,
      maxCount: 100,
      colors: ["G", "U"],
      cards: [
        {
          id: "1",
          name: "Nom de la carte",
          quantity: 2,
          cost: "1G",
        },
        {
          id: "2",
          name: "Nom de la carte",
          quantity: 3,
          cost: "2U",
        },
      ],
    });
  }, []);

  if (!deck) return null;

  return (
    <aside className="
    bg-gray-700 flex flex-col
    w-full
    h-[45vh] sm:h-[50vh]
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

      {/* Main Deck */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {deck.cards.map(card => (
          <CardRow key={card.id} card={card} />
        ))}
      </div>

      {/* Sideboard (plus tard) */}
      {isSideboardOpen && (
        <div className="border-t border-gray-600 p-3">
          Sideboard ici
        </div>
      )}
    </aside>
  );
}

export default DeckSidebar;

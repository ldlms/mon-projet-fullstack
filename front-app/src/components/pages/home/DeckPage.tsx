import { useState } from "react";
import Header from "../../Layout/header/Header.tsx";
import DeckSidebar from "../../Layout/sideBar/DeckSideBar.tsx";
import DeckList from "../../organism/deckList/DeckList.tsx";
import { Deck } from "../../atoms/types/props.tsx";
import CardList from "../../organism/CardList/CardList.tsx";
import Button from "../../atoms/buttons/button.tsx";
import CreateDeckModal from "../../Layout/modals/DeckCreationModal.tsx";
import CardPreviewModal from "../../Layout/modals/CardPreviewModal.tsx";
import { DeckCard } from "../../atoms/types/props.tsx";
import { useDecks } from "../../../hooks/useDecks.ts";
import { useCards } from "../../../hooks/useCards.ts";
import { useDeckCards } from "../../../hooks/useDeckCards.ts";

function DeckPage() {
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewCard, setPreviewCard] = useState<DeckCard | null>(null);

  const { decks, loading: loadingDecks, refetchDecks, setDecks } = useDecks();
  const { availableCards, loading, hasMore, loadMore } = useCards(selectedDeck);
  const { addCardToDeck, removeCardFromDeck } = useDeckCards(
    selectedDeck,
    setSelectedDeck,
    setDecks
  );

  const handleDeckCreated = async () => {
    await refetchDecks();
    setIsModalOpen(false);
  };

  const handleSelectDeck = (deck: Deck) => {
    setSelectedDeck(deck);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4">
          {loadingDecks ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-400">Chargement des decks...</p>
            </div>
          ) : !selectedDeck ? (
            <>
              <div className="mb-4">
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Créer un deck
                </Button>
              </div>
              <DeckList
                decks={decks}
                selectedDeckId={undefined}
                onSelectDeck={handleSelectDeck}
              />
            </>
          ) : (
            <>
              <CardList
                cards={availableCards}
                onAddCard={addCardToDeck}
                onPreviewCard={setPreviewCard}
              />
              
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <p className="text-gray-400">Chargement...</p>
                </div>
              )}
              
              {!loading && hasMore && availableCards.length > 0 && (
                <div className="flex items-center justify-center py-4">
                  <button
                    onClick={loadMore}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Charger plus de cartes
                  </button>
                </div>
              )}
              
              {!loading && !hasMore && availableCards.length > 0 && (
                <div className="flex items-center justify-center py-4">
                  <p className="text-gray-400">Toutes les cartes ont été chargées</p>
                </div>
              )}
            </>
          )}
        </main>

        {selectedDeck && (
          <aside className="bg-gray-700 flex flex-col fixed md:relative bottom-0 left-0 right-0 md:w-80 h-[50vh] md:h-full border-t md:border-t-0 md:border-l border-gray-600 transition-transform duration-300 z-40">
            <DeckSidebar
              deck={selectedDeck}
              onRemoveCard={removeCardFromDeck}
              onPreviewCard={setPreviewCard}
              onClose={() => setSelectedDeck(null)}
            />
          </aside>
        )}
      </div>

      <CreateDeckModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeckCreated={handleDeckCreated}
      />
      <CardPreviewModal
        card={previewCard}
        onClose={() => setPreviewCard(null)}
      />
    </div>
  );
}

export default DeckPage;
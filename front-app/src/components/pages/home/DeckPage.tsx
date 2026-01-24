import { useEffect, useState, useCallback } from "react";
import Header from "../../Layout/header/Header.tsx";
import DeckSidebar from "../../Layout/sideBar/DeckSideBar.tsx";
import DeckList from "../../organism/deckList/DeckList.tsx";
import { DeckProp } from "../../atoms/types/props.tsx";
import CardList from "../../organism/CardList/CardList.tsx"
import {DeckCard} from "../../atoms/types/props.tsx";

function DeckPage() {

    const [selectedDeck, setSelectedDeck] = useState<DeckProp | null>(null); 
    const [availableCards, setAvailableCards] = useState<DeckCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
      if (!selectedDeck) {
        setAvailableCards([]);
        setCursor(null);
        setHasMore(true);
        return;
      }

      setAvailableCards([]);
      setCursor(null);
      setHasMore(true);
      fetchCards(null, true);
    }, [selectedDeck]);

    const fetchCards = async (currentCursor: string | null = null, reset: boolean = false) => {
      if (!selectedDeck || loading) return;
      
      setLoading(true);
      try {
        const params = new URLSearchParams({
        colors: selectedDeck.colors.join(','),
        limit: '50',
        ...(currentCursor && { cursor: currentCursor })
        });
        const response = await fetch(`http://localhost:5000/cards/deck?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des cartes');
        }

        const data = await response.json();
        
        if (reset) {
          setAvailableCards(data.cards);
        } else {
          setAvailableCards(prev => [...prev, ...data.cards]);
        }
        
        setCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error('Erreur:', error);
        if (reset) {
          setAvailableCards([]);
        }
      } finally {
        setLoading(false);
      }
    };

    const loadMore = useCallback(() => {
      if (hasMore && !loading && cursor) {
        fetchCards(cursor, false);
      }
    }, [cursor, hasMore, loading]);

    const decks: DeckProp[] = [
      {
        id: '1',
        name: 'Deck Rouge',
        format: 'Standard',
        currentCount: 40,
        maxCount: 60,
        colors: ['R'],
        imageUri: 'https://cards.scryfall.io/art_crop/front/0/0/0002ab72-834b-4c81-82b1-0d2760ea96b0.jpg',
        cards: []
      },
      {
        id: '2',
        name: 'Deck Bleu',
        format: 'Modern',
        currentCount: 60,
        maxCount: 60,
        colors: ['U'],
        imageUri: 'https://cards.scryfall.io/art_crop/front/0/0/0002ab72-834b-4c81-82b1-0d2760ea96b0.jpg',
        cards: []
      }
    ];

    // Dans DeckPage.tsx

const addCardToDeck = async (card: DeckCard) => {
  if (!selectedDeck) return;

  try {
    // 1. Mise à jour optimiste (UI réactive)
    setSelectedDeck(prev => {
      if (!prev) return prev;

      const existingCard = prev.cards.find(c => c.id === card.id);
      let updatedCards;

      if (existingCard) {
        updatedCards = prev.cards.map(c =>
          c.id === card.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        updatedCards = [...prev.cards, { ...card, quantity: 1 }];
      }

      return {
        ...prev,
        cards: updatedCards,
        currentCount: prev.currentCount + 1
      };
    });

    // 2. Appel API pour persister
    const response = await fetch(
      `http://localhost:5000/users/deck/${selectedDeck.id}/${card.id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout de la carte');
    }

    // 3. (Optionnel) Resynchroniser avec le serveur
    const updatedDeck = await response.json();
    setSelectedDeck(updatedDeck);

  } catch (error) {
    console.error('Erreur:', error);
    
    // 4. Rollback en cas d'erreur
    setSelectedDeck(prev => {
      if (!prev) return prev;

      const existingCard = prev.cards.find(c => c.id === card.id);
      let updatedCards;

      if (existingCard && existingCard.quantity > 1) {
        updatedCards = prev.cards.map(c =>
          c.id === card.id ? { ...c, quantity: c.quantity - 1 } : c
        );
      } else {
        updatedCards = prev.cards.filter(c => c.id !== card.id);
      }

      return {
        ...prev,
        cards: updatedCards,
        currentCount: prev.currentCount - 1
      };
    });

    // Notification d'erreur à l'utilisateur
    alert('Impossible d\'ajouter la carte au deck');
  }
};

const removeCardFromDeck = async (cardId: string) => {
  if (!selectedDeck) return;

  const cardToRemove = selectedDeck.cards.find(c => c.id === cardId);
  if (!cardToRemove) return;

  try {
    // Mise à jour optimiste
    setSelectedDeck(prev => {
      if (!prev) return prev;

      let updatedCards;
      if (cardToRemove.quantity > 1) {
        updatedCards = prev.cards.map(c =>
          c.id === cardId ? { ...c, quantity: c.quantity - 1 } : c
        );
      } else {
        updatedCards = prev.cards.filter(c => c.id !== cardId);
      }

      return {
        ...prev,
        cards: updatedCards,
        currentCount: prev.currentCount - 1
      };
    });

    // Appel API
    const response = await fetch(
      `http://localhost:5000/deck/${selectedDeck.id}/${cardId}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de la carte');
    }

  } catch (error) {
    console.error('Erreur:', error);
    
    // Rollback
    setSelectedDeck(prev => {
      if (!prev) return prev;

      const existingCard = prev.cards.find(c => c.id === cardId);
      let updatedCards;

      if (existingCard) {
        updatedCards = prev.cards.map(c =>
          c.id === cardId ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        updatedCards = [...prev.cards, { ...cardToRemove, quantity: 1 }];
      }

      return {
        ...prev,
        cards: updatedCards,
        currentCount: prev.currentCount + 1
      };
    });

    alert('Impossible de retirer la carte du deck');
  }
};

    return (
      <div className="h-screen flex flex-col">
        <Header />

        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4">
            {!selectedDeck ? (
              <DeckList
                decks={decks}
                selectedDeckId={undefined}
                onSelectDeck={setSelectedDeck}
              />
            ) : (
              <>
                <CardList
                  cards={availableCards}
                  onAddCard={addCardToDeck}
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
            <aside
              className="
                bg-gray-700 flex flex-col
                fixed md:relative
                bottom-0 left-0 right-0
                md:w-80
                h-[50vh] md:h-full
                border-t md:border-t-0 md:border-l border-gray-600
                transition-transform duration-300
                z-40
              "
            >
              <DeckSidebar
                deck={selectedDeck}
                onRemoveCard={removeCardFromDeck}
                onClose={() => setSelectedDeck(null)}
              />
            </aside>
          )}
        </div>
      </div>
    );
}

export default DeckPage;
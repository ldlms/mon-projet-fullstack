import { useEffect, useState, useCallback } from "react";
import Header from "../../Layout/header/Header.tsx";
import DeckSidebar from "../../Layout/sideBar/DeckSideBar.tsx";
import DeckList from "../../organism/deckList/DeckList.tsx";
import { Deck } from "../../atoms/types/props.tsx";
import CardList from "../../organism/CardList/CardList.tsx"
import {DeckCard} from "../../atoms/types/props.tsx";
import Button from "../../atoms/buttons/button.tsx";
import CreateDeckModal from "../../Layout/modals/DeckCreationModal.tsx"
import CardPreviewModal from "../../Layout/modals/CardPreviewModal.tsx";

// Fonction utilitaire pour récupérer le token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Fonction utilitaire pour récupérer l'utilisateur
const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

function DeckPage() {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null); 
    const [availableCards, setAvailableCards] = useState<DeckCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingDecks, setLoadingDecks] = useState(true);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewCard, setPreviewCard] = useState<DeckCard | null>(null);

    // Fonction pour charger les decks depuis l'API
    const fetchDecks = async () => {
      setLoadingDecks(true);
      const token = getAuthToken();
      const user = getUser();
      
      if (!token || !user || !user.id) {
        console.error('Pas de token ou utilisateur ou ID manquant');
        setLoadingDecks(false);
        // Rediriger vers login si pas d'authentification valide
        window.location.href = '/login';
        return;
      }

      try {
        // Utiliser la route GET /users/deck/:userId
        const userId = user.id;
        console.log('Requête vers:', `http://localhost:5000/users/deck/${userId}`);
        const response = await fetch(`http://localhost:5000/users/deck/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return;
          }
          throw new Error('Erreur lors de la récupération des decks');
        }

        const data = await response.json();
        
        console.log('Données reçues du backend:', data);
        
        // Vérifier que data est bien un tableau
        if (!Array.isArray(data)) {
          console.error('La réponse n\'est pas un tableau:', data);
          setDecks([]);
          setLoadingDecks(false);
          return;
        }
        
        // Si aucun deck, retourner un tableau vide
        if (data.length === 0) {
          console.log('Aucun deck trouvé');
          setDecks([]);
          setLoadingDecks(false);
          return;
        }
        
        // Transformer les données backend en format frontend
        const transformedDecks: Deck[] = await Promise.all(
          data.map(async (deck: any) => {
            console.log('Traitement du deck:', deck.name, 'couleurs:', deck.colors);
            console.log('=== TRANSFORMATION DECK ===');
    console.log('Deck name:', deck.name);
    console.log('deck.colors AVANT transformation:', deck.colors);
    console.log('Type:', typeof deck.colors);
    console.log('Is Array:', Array.isArray(deck.colors));
            // Si le deck n'a pas de cartes, retourner un deck avec les couleurs stockées
            if (!deck.cards || deck.cards.length === 0) {
              return {
                id: deck.id,
                name: deck.name,
                format: deck.format,
                currentCount: 0,
                maxCount: deck.format === 'Commander' ? 100 : 60,
                colors: deck.colors || [], // Utiliser les couleurs stockées en BDD
                imageUri: deck.imageUri || 'https://cards.scryfall.io/art_crop/front/0/0/0002ab72-834b-4c81-82b1-0d2760ea96b0.jpg',
                cards: []
              };
            }

            // Récupérer les détails des cartes pour chaque deck
            const cardsWithDetails = await Promise.all(
              deck.cards.map(async (deckCard: any) => {
                try {

                  
                  const cardResponse = await fetch(`http://localhost:5000/cards/${deckCard.cardId}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });

                  
                  if (cardResponse.ok) {
                    const cardData = await cardResponse.json();
                    console.log('✅ Card data reçue:', cardData);
                    return {
                      ...cardData,
                      quantity: deckCard.quantity
                    };
                  } else {
                    const errorText = await cardResponse.text();
                    console.error('❌ Erreur HTTP:', cardResponse.status, errorText);
                  }
                } catch (error) {
                  console.error('❌ Exception lors de la récupération:', error);
                }
                return null;
              })
            );


            const validCards = cardsWithDetails.filter(c => c !== null);
            
            // Utiliser les couleurs du deck stockées en BDD, ou calculer depuis les cartes en fallback
            const colors = deck.colors || [];
            
            const currentCount = validCards.reduce((sum, card) => sum + (card.quantity || 0), 0);

              const finalDeck = {
              id: deck.id,
              name: deck.name,
              format: deck.format,
              currentCount: currentCount,
              maxCount: deck.format === 'Commander' ? 100 : 60,
              colors: colors,
              imageUri: deck.imageUri || validCards[0]?.imageUri || '...',
              cards: validCards
            };
            
            console.log('Deck APRÈS transformation:', finalDeck);
            console.log('Colors finales:', finalDeck.colors);
            console.log('=== FIN TRANSFORMATION ===');
            
            return finalDeck;
            })
        );

        setDecks(transformedDecks);
      } catch (error) {
        console.error('Erreur lors du chargement des decks:', error);
        setDecks([]);
      } finally {
        setLoadingDecks(false);
      }
    };

    // Charger les decks au montage du composant
    useEffect(() => {
      fetchDecks();
    }, []);

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
      
      const token = getAuthToken();
      if (!token) return;
      
      console.log('Selected deck:', selectedDeck);
      console.log('Deck colors:', selectedDeck.colors);
      
      // Si le deck n'a pas de couleurs définies, on ne peut pas chercher de cartes
      if (!selectedDeck.colors || selectedDeck.colors.length === 0) {
        console.warn('Aucune couleur définie pour ce deck, impossible de charger des cartes');
        setAvailableCards([]);
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const params = new URLSearchParams({
          colors: selectedDeck.colors.join(','),
          limit: '50',
          ...(currentCursor && { cursor: currentCursor })
        });
        
        const url = `http://localhost:5000/cards/deckColors?${params}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
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

    const addCardToDeck = async (card: DeckCard) => {
      if (!selectedDeck) return;

      const token = getAuthToken();
      if (!token) return;

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


        const response = await fetch(
          `http://localhost:5000/users/deck/${selectedDeck.id}/cards/${card.id}`,
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout de la carte');
        }

        // 3. Resynchroniser avec le serveur
        const updatedDeckData = await response.json();
        
        // Récupérer les détails complets des cartes
        const cardsWithDetails = await Promise.all(
          updatedDeckData.cards.map(async (deckCard: any) => {
            const cardResponse = await fetch(`http://localhost:5000/cards/${deckCard.cardId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (cardResponse.ok) {
              const cardData = await cardResponse.json();
              return { ...cardData, quantity: deckCard.quantity };
            }
            return null;
          })
        );

        const validCards = cardsWithDetails.filter(c => c !== null);

        const updatedDeck = {
          ...selectedDeck,
          cards: validCards,
          currentCount: validCards.reduce((sum, c) => sum + c.quantity, 0),
          colors: selectedDeck.colors
        };

        setSelectedDeck(updatedDeck);

        // 4. Mettre à jour le deck dans la liste des decks
        setDecks(prev => prev.map(d => 
          d.id === selectedDeck.id ? updatedDeck : d
        ));

      } catch (error) {
        console.error('Erreur:', error);
        
        // Rollback en cas d'erreur
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

        alert('Impossible d\'ajouter la carte au deck');
      }
    };

    const removeCardFromDeck = async (cardId: string) => {
      if (!selectedDeck) return;

      const token = getAuthToken();
      if (!token) return;

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

        // Appel API - Route DELETE /users/deck/:deckId/card/:cardId
        const response = await fetch(
          `http://localhost:5000/users/deck/${selectedDeck.id}/cards/${cardId}`,
          {
            method: 'DELETE',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          }
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de la carte');
        }

        // Resynchroniser
        const updatedDeckData = await response.json();
        
        const cardsWithDetails = await Promise.all(
          updatedDeckData.cards.map(async (deckCard: any) => {
            const cardResponse = await fetch(`http://localhost:5000/cards/${deckCard.cardId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (cardResponse.ok) {
              const cardData = await cardResponse.json();
              return { ...cardData, quantity: deckCard.quantity };
            }
            return null;
          })
        );

        const validCards = cardsWithDetails.filter(c => c !== null);
        const colors = [...new Set(validCards.flatMap(c => c.colors || []))];

        const updatedDeck = {
          ...selectedDeck,
          cards: validCards,
          currentCount: validCards.reduce((sum, c) => sum + c.quantity, 0),
          colors: colors
        };

        setSelectedDeck(updatedDeck);
        setDecks(prev => prev.map(d => 
          d.id === selectedDeck.id ? updatedDeck : d
        ));

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

    // Callback appelé après la création d'un deck
    const handleDeckCreated = async () => {
      await fetchDecks();
      setIsModalOpen(false);
    };

    // Gérer la sélection d'un deck
    const handleSelectDeck = (deck: Deck) => {
      console.log('=== DECK SÉLECTIONNÉ ===');
  console.log('Deck complet:', deck);
  console.log('Colors:', deck.colors);
  console.log('Type:', typeof deck.colors);
  console.log('Is Array:', Array.isArray(deck.colors));
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

        {/* Modal de création de deck */}
        <CreateDeckModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDeckCreated={handleDeckCreated}
        />
        <CardPreviewModal
          card={previewCard}
          onClose={() => setPreviewCard(null)}/>
      </div>
    );
}

export default DeckPage;
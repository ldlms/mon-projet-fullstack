import { useCallback } from 'react';
import { Deck, DeckCard } from '../components/atoms/types/props';
import { useAuth } from './useAuth.ts';

const API_URL = 'http://localhost:5000';

export const useDeckCards = (
  selectedDeck: Deck | null,
  setSelectedDeck: React.Dispatch<React.SetStateAction<Deck | null>>,
  setDecks: React.Dispatch<React.SetStateAction<Deck[]>>
) => {
  const { getAuthToken } = useAuth();

  const addCardToDeck = useCallback(async (card: DeckCard) => {
    if (!selectedDeck) return;

    const token = getAuthToken();
    if (!token) return;

    try {
      // Mise à jour optimiste
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
        `${API_URL}/users/deck/${selectedDeck.id}/cards/${card.id}`,
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

      const updatedDeckData = await response.json();
      
      const cardsWithDetails = await Promise.all(
        updatedDeckData.cards.map(async (deckCard: any) => {
          const cardResponse = await fetch(`${API_URL}/cards/${deckCard.cardId}`, {
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
      setDecks(prev => prev.map(d => 
        d.id === selectedDeck.id ? updatedDeck : d
      ));

    } catch (error) {
      console.error('Erreur:', error);
      
      // Rollback
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
  }, [selectedDeck, getAuthToken, setSelectedDeck, setDecks]);

  const removeCardFromDeck = useCallback(async (cardId: string) => {
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

      const response = await fetch(
        `${API_URL}/users/deck/${selectedDeck.id}/cards/${cardId}`,
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

      const updatedDeckData = await response.json();
      
      const cardsWithDetails = await Promise.all(
        updatedDeckData.cards.map(async (deckCard: any) => {
          const cardResponse = await fetch(`${API_URL}/cards/${deckCard.cardId}`, {
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
  }, [selectedDeck, getAuthToken, setSelectedDeck, setDecks]);

  return { addCardToDeck, removeCardFromDeck };
};
import { useState, useEffect, useCallback } from 'react';
import { Deck } from '../components/atoms/types/props';
import { useAuth } from './useAuth.ts';

const API_URL = 'http://localhost:5000';

export const useDecks = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAuthToken, getUser, redirectToLogin } = useAuth();

  const fetchDecks = useCallback(async () => {
    setLoading(true);
    const token = getAuthToken();
    const user = getUser();
    
    if (!token || !user?.id) {
      console.error('Pas de token ou utilisateur ou ID manquant');
      setLoading(false);
      redirectToLogin();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/deck/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          redirectToLogin();
          return;
        }
        throw new Error('Erreur lors de la récupération des decks');
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.error('La réponse n\'est pas un tableau:', data);
        setDecks([]);
        return;
      }

      // Transformer les données backend en format frontend
      const transformedDecks: Deck[] = await Promise.all(
        data.map(async (deck: any) => {
          if (!deck.cards || deck.cards.length === 0) {
            return {
              id: deck.id,
              name: deck.name,
              format: deck.format,
              currentCount: 0,
              maxCount: deck.format === 'Commander' ? 100 : 60,
              colors: deck.colors || [],
              imageUri: deck.imageUri || 'https://cards.scryfall.io/art_crop/front/0/0/0002ab72-834b-4c81-82b1-0d2760ea96b0.jpg',
              cards: []
            };
          }

          const cardsWithDetails = await Promise.all(
            deck.cards.map(async (deckCard: any) => {
              try {
                const cardResponse = await fetch(`${API_URL}/cards/${deckCard.cardId}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });

                if (cardResponse.ok) {
                  const cardData = await cardResponse.json();
                  return { ...cardData, quantity: deckCard.quantity };
                }
              } catch (error) {
                console.error('Erreur lors de la récupération de la carte:', error);
              }
              return null;
            })
          );

          const validCards = cardsWithDetails.filter(c => c !== null);
          const currentCount = validCards.reduce((sum, card) => sum + (card.quantity || 0), 0);

          return {
            id: deck.id,
            name: deck.name,
            format: deck.format,
            currentCount,
            maxCount: deck.format === 'Commander' ? 100 : 60,
            colors: deck.colors || [],
            imageUri: deck.imageUri || validCards[0]?.imageUri || '...',
            cards: validCards
          };
        })
      );

      setDecks(transformedDecks);
    } catch (error) {
      console.error('Erreur lors du chargement des decks:', error);
      setDecks([]);
    } finally {
      setLoading(false);
    }
  }, [getAuthToken, getUser, redirectToLogin]);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  return { decks, loading, refetchDecks: fetchDecks, setDecks };
};
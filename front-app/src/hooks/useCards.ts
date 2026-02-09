import { useState, useEffect, useCallback } from 'react';
import { DeckCard, Deck } from '../components/atoms/types/props';
import { useAuth } from './useAuth.ts';

const API_URL = 'http://localhost:5000';

export const useCards = (selectedDeck: Deck | null) => {
  const [availableCards, setAvailableCards] = useState<DeckCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { getAuthToken } = useAuth();

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

  const fetchCards = useCallback(async (
    currentCursor: string | null = null, 
    reset: boolean = false
  ) => {
    if (!selectedDeck || loading) return;
    
    const token = getAuthToken();
    if (!token) return;
    
    if (!selectedDeck.colors || selectedDeck.colors.length === 0) {
      console.warn('Aucune couleur définie pour ce deck');
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
      
      const response = await fetch(`${API_URL}/cards/deckColors?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
  }, [selectedDeck, loading, getAuthToken]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading && cursor) {
      fetchCards(cursor, false);
    }
  }, [cursor, hasMore, loading, fetchCards]);

  return { availableCards, loading, hasMore, loadMore };
};
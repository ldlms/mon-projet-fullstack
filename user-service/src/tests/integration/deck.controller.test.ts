import { describe, it, beforeEach, expect } from 'vitest';
import { createUserAndLogin } from './helper/auth';

const API = 'http://api_gateway:5000';

describe('DeckController – intégration', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await fetch('http://user_app:5001/__test__/reset-db', {
      method: 'POST',
    });

    token = await createUserAndLogin();

    const res = await fetch(`${API}/users/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const users = await res.json();
    userId = users[0].id;
  });

  it('POST /deck', async () => {
    const res = await fetch(`${API}/deck`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'My Deck',
        format: 'Commander',
        ownerId: userId,
        cards: [],
        colors: ['G', 'U'],
      }),
    });

    expect(res.status).toBe(201);

    const deck = await res.json();
    expect(deck.name).toBe('My Deck');
    expect(deck.colors).toContain('G');
  });

  it('GET /deck/:id (user decks)', async () => {
    const res = await fetch(`${API}/deck/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status).toBe(200);

    const decks = await res.json();
    expect(Array.isArray(decks)).toBe(true);
  });
});

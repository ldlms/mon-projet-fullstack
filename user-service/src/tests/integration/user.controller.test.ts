import { describe, it, beforeEach, expect } from 'vitest';
import { createUserAndLogin } from './helper/auth';

const API = 'http://api_gateway:5000';

describe('UserController – intégration', () => {
  let token: string;

  beforeEach(async () => {
    await fetch('http://user_app:5001/__test__/reset-db', {
      method: 'POST',
    });
    token = await createUserAndLogin();
  });

  it('GET /users/all', async () => {
    const res = await fetch(`${API}/users/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(res.status).toBe(200);

    const users = await res.json();
    expect(users.length).toBe(1);
    expect(users[0].email).toBe('test@test.com');
  });
});

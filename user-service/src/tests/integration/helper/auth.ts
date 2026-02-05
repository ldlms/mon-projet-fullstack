export async function createUserAndLogin() {
  const baseUrl = 'http://api_gateway:5000';

  await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@test.com',
      password: 'password',
      name: 'Test',
    }),
  });

  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@test.com',
      password: 'password',
    }),
  });

  const body = await res.json();
  return body.token;
}

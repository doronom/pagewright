import { requireEnv } from '@core/env';
import { UnknownUserFactory } from '../../data/factories/UnknownUserFactory';
import { test, expect } from '../../fixtures';

test.describe('Auth API', () => {
  // An email that doesn't exist, never a wrong password: Toolshop locks a demo account after repeated failures.
  test('rejects login for an unknown user', async ({ api }) => {
    const { email, password } = new UnknownUserFactory().build();
    const { status } = await api.post('/users/login', { email, password }, { expectError: true });
    expect(status).toBe(401);
  });

  test('logs in and reads the current user', async ({ api }) => {
    const email = requireEnv('APP_EMAIL');
    const login = await api.login(email, requireEnv('APP_PASSWORD'));
    expect(login.status).toBe(200);
    expect(login.data).toMatchObject({
      access_token: expect.any(String),
      token_type: 'bearer',
      expires_in: expect.any(Number),
    });

    api.setAuthToken(login.data.access_token);
    const me = await api.getMe();
    expect(me.status).toBe(200);
    expect(me.data.email).toBe(email);
  });
});

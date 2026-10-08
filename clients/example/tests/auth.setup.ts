import { clientName, requireEnv, storageStatePath } from '@core/env';
import { test as setup, expect } from '../fixtures';

setup('authenticate', async ({ page, client }) => {
  const { auth } = client;
  if (!auth) {
    return setup.skip(true, `Client "${client.name}" has no auth strategy`);
  }
  await auth.login(page, { user: requireEnv('APP_USERNAME'), password: requireEnv('APP_PASSWORD') });
  await expect.poll(() => auth.isLoggedIn(page)).toBe(true);
  await page.context().storageState({ path: storageStatePath(clientName) });
});

import { requireEnv } from '@core/env';
import { test, expect } from '../../fixtures';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('valid credentials land on the inventory page', async ({ page, dynamicPage }) => {
    await dynamicPage.goto('login');
    await dynamicPage.executeSection('form', {
      username: requireEnv('APP_USERNAME'),
      password: requireEnv('APP_PASSWORD'),
      submit: true,
    });

    await expect(page).toHaveURL(/inventory\.html/);
    await dynamicPage.goto('inventory', { skipNavigation: true });
    await dynamicPage.assertElementHasText(dynamicPage.getLocator('header', 'title'), 'Products');
  });

  test('locked out user sees an error', async ({ dynamicPage }) => {
    await dynamicPage.goto('login');
    await dynamicPage.executeSection('form', {
      username: requireEnv('APP_LOCKED_USERNAME'),
      password: requireEnv('APP_PASSWORD'),
      submit: true,
    });

    await dynamicPage.assertElementHasText(
      dynamicPage.getLocator('form', 'error'),
      'Epic sadface: Sorry, this user has been locked out.',
    );
  });
});

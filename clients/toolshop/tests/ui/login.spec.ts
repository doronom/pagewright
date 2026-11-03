import { requireEnv } from '@core/env';
import { UnknownUserFactory } from '../../data/factories/UnknownUserFactory';
import { test, expect } from '../../fixtures';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('valid credentials land on the account page', async ({ page, dynamicPage }) => {
    await dynamicPage.goto('login');
    await dynamicPage.executeSection('form', {
      email: requireEnv('APP_EMAIL'),
      password: requireEnv('APP_PASSWORD'),
      submit: true,
    });

    await expect(page).toHaveURL(/\/account$/);
    await dynamicPage.goto('account', { skipNavigation: true });
    await dynamicPage.assertElementHasText(dynamicPage.getLocator('overview', 'title'), 'My account');
  });

  // Never a wrong password for a demo account: Toolshop locks it after repeated failures.
  test('an unknown user sees an error', async ({ page, dynamicPage }) => {
    const { email, password } = new UnknownUserFactory().build();
    await dynamicPage.goto('login');
    await dynamicPage.executeSection('form', { email, password, submit: true });

    await dynamicPage.assertElementHasText(
      dynamicPage.getLocator('form', 'error'),
      'Invalid email or password',
    );
    await expect(page).toHaveURL(/\/auth\/login$/);
  });
});

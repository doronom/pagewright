import { Page } from '@playwright/test';
import { PageConfig } from '@core/page/types';

export const loginPage = (page: Page): PageConfig => ({
  url: '/',
  sections: {
    form: {
      fields: {
        username: { locator: page.locator('[data-test="username"]'), actions: [{ action: 'fill' }] },
        password: { locator: page.locator('[data-test="password"]'), actions: [{ action: 'fill' }] },
        submit: { locator: page.locator('[data-test="login-button"]'), actions: [{ action: 'click' }] },
        error: { locator: page.locator('[data-test="error"]'), actions: [] },
      },
    },
  },
});

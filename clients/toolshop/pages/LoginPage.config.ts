import { Page } from '@playwright/test';
import { PageConfig } from '@core/page/types';

export const loginPage = (page: Page): PageConfig => ({
  url: '/auth/login',
  sections: {
    form: {
      fields: {
        email: { locator: page.locator('[data-test="email"]'), actions: [{ action: 'fill' }] },
        password: { locator: page.locator('[data-test="password"]'), actions: [{ action: 'fill' }] },
        submit: { locator: page.locator('[data-test="login-submit"]'), actions: [{ action: 'click' }] },
        error: { locator: page.locator('[data-test="login-error"]'), actions: [] },
      },
    },
  },
});

import { Page } from '@playwright/test';
import { PageConfig } from '@core/page/types';

export const cartPage = (page: Page): PageConfig => ({
  url: '/cart.html',
  sections: {
    cart: {
      fields: {
        title: { locator: page.locator('[data-test="title"]'), actions: [] },
        itemNames: { locator: page.locator('[data-test="inventory-item-name"]'), actions: [] },
      },
    },
  },
});

import { Page } from '@playwright/test';
import { PageConfig } from '@core/page/types';

export const inventoryPage = (page: Page): PageConfig => ({
  url: '/inventory.html',
  sections: {
    header: {
      fields: {
        title: { locator: page.locator('[data-test="title"]'), actions: [] },
        cartBadge: { locator: page.locator('[data-test="shopping-cart-badge"]'), actions: [] },
        cartLink: {
          locator: page.locator('[data-test="shopping-cart-link"]'),
          actions: [{ action: 'click' }],
        },
      },
    },
    products: {
      fields: {
        addBackpack: {
          locator: page.locator('[data-test="add-to-cart-sauce-labs-backpack"]'),
          actions: [{ action: 'click' }],
        },
        addBikeLight: {
          locator: page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]'),
          actions: [{ action: 'click' }],
        },
      },
    },
  },
});

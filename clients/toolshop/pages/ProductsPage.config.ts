import { Page } from '@playwright/test';
import { PageConfig } from '@core/page/types';
import { header } from './sections/header';

export const productsPage = (page: Page): PageConfig => ({
  url: '/',
  sections: {
    header: header(page),
    list: {
      fields: {
        // Skips cards marked out of stock: their detail page disables quantity and add-to-cart.
        firstProduct: {
          locator: page
            .locator('a[data-test^="product-"]')
            .filter({ hasNot: page.locator('[data-test="out-of-stock"]') })
            .first(),
          actions: [{ action: 'click' }],
        },
      },
    },
    search: {
      fields: {
        query: { locator: page.locator('[data-test="search-query"]'), actions: [{ action: 'fill' }] },
        submit: { locator: page.locator('[data-test="search-submit"]'), actions: [{ action: 'click' }] },
        caption: { locator: page.locator('[data-test="search-caption"]'), actions: [] },
      },
    },
  },
});

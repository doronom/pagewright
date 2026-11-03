import { Page } from '@playwright/test';
import { PageConfig } from '@core/page/types';
import { header } from './sections/header';

export const cartPage = (page: Page): PageConfig => ({
  url: '/checkout',
  sections: {
    header: header(page),
    cart: {
      fields: {
        itemTitles: { locator: page.locator('[data-test="product-title"]'), actions: [] },
        quantity: { locator: page.locator('[data-test="product-quantity"]'), actions: [] },
        total: { locator: page.locator('[data-test="cart-total"]'), actions: [] },
      },
    },
  },
});

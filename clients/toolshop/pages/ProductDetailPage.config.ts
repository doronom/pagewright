import { Page } from '@playwright/test';
import { PageConfig } from '@core/page/types';
import { header } from './sections/header';

export const productDetailPage = (page: Page): PageConfig => ({
  url: '/product/${productId}',
  sections: {
    header: header(page),
    purchase: {
      fields: {
        name: { locator: page.locator('[data-test="product-name"]'), actions: [] },
        quantity: { locator: page.locator('[data-test="quantity"]'), actions: [{ action: 'fill' }] },
        addToCart: { locator: page.locator('[data-test="add-to-cart"]'), actions: [{ action: 'click' }] },
      },
    },
  },
});

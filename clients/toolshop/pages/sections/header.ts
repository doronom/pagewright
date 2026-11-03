import { Page } from '@playwright/test';
import { SectionConfig } from '@core/page/types';

/** The site header, shared by every page config. `cartLink` and `cartQuantity` only exist once the cart has items. */
export const header = (page: Page): SectionConfig => ({
  fields: {
    cartLink: { locator: page.locator('[data-test="nav-cart"]'), actions: [{ action: 'click' }] },
    cartQuantity: { locator: page.locator('[data-test="cart-quantity"]'), actions: [] },
    userMenu: { locator: page.locator('[data-test="nav-menu"]'), actions: [] },
    signIn: { locator: page.locator('[data-test="nav-sign-in"]'), actions: [] },
  },
});

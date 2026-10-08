import { test, expect } from '../../fixtures';

test.describe('Cart', () => {
  test('adds two items to the cart', async ({ dynamicPage }) => {
    await dynamicPage.goto('inventory');
    await dynamicPage.executeSection('products', { addBackpack: true, addBikeLight: true });
    await dynamicPage.assertElementHasText(dynamicPage.getLocator('header', 'cartBadge'), '2');

    await dynamicPage.executeSection('header', { cartLink: true });
    await dynamicPage.goto('cart', { skipNavigation: true });

    await expect(dynamicPage.getLocator('cart', 'itemNames')).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);
  });
});

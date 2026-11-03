import { test } from '../../fixtures';

test.describe('Cart', () => {
  test('adds a product to the cart', async ({ dynamicPage }) => {
    await dynamicPage.goto('products');
    await dynamicPage.executeSection('list', { firstProduct: true });

    await dynamicPage.goto('productDetail', { skipNavigation: true });
    await dynamicPage.executeSection('purchase', { quantity: '2', addToCart: true });

    await dynamicPage.assertElementHasText(dynamicPage.getLocator('header', 'cartQuantity'), '2');
  });
});

import { test, expect } from '../../fixtures';

test.describe('Cart', () => {
  test('adds a product to the cart', async ({ dynamicPage, api, sharedData }) => {
    // Stock and product ids change on the shared demo site, and the list endpoint can report a product as in stock
    // while its detail endpoint does not. Pick one both agree on.
    const { status, data: products } = await api.getProducts();
    expect(status).toBe(200);
    let productId: string | undefined;
    for (const item of products.data.filter((p) => p.in_stock)) {
      const { data: detail } = await api.getProduct(item.id);
      if (detail.in_stock) {
        productId = item.id;
        break;
      }
    }
    if (!productId) {
      throw new Error('No product on page 1 of /products is in stock in both its list and detail data');
    }
    sharedData.set('productId', productId);

    await dynamicPage.goto('productDetail');
    await dynamicPage.executeSection('purchase', { quantity: '2', addToCart: true });

    await dynamicPage.assertElementHasText(dynamicPage.getLocator('header', 'cartQuantity'), '2');
  });
});

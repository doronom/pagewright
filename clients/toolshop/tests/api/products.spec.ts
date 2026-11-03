import { test, expect } from '../../fixtures';

const productShape = {
  id: expect.any(String),
  name: expect.any(String),
  price: expect.any(Number),
  in_stock: expect.any(Boolean),
  category: expect.objectContaining({ id: expect.any(String), name: expect.any(String) }),
  brand: expect.objectContaining({ id: expect.any(String), name: expect.any(String) }),
};

test.describe('Products API', () => {
  test('lists products one page at a time', async ({ api }) => {
    const { status, data } = await api.getProducts();

    expect(status).toBe(200);
    expect(data).toMatchObject({
      current_page: 1,
      per_page: expect.any(Number),
      last_page: expect.any(Number),
      total: expect.any(Number),
    });
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data.length).toBeLessThanOrEqual(data.per_page);
    expect(data.total).toBeGreaterThanOrEqual(data.data.length);
    expect(data.data[0]).toMatchObject(productShape);
  });

  // Product ids change whenever the demo data is reset, so the id comes from the list.
  test('gets one product by id', async ({ api }) => {
    const [first] = (await api.getProducts()).data.data;

    const { status, data } = await api.getProduct(first.id);

    expect(status).toBe(200);
    expect(data).toMatchObject({ ...productShape, id: first.id, name: first.name });
    expect(Array.isArray(data.specs)).toBe(true);
  });

  test('searches products by name', async ({ api }) => {
    const { status, data } = await api.searchProducts('hammer');

    expect(status).toBe(200);
    expect(data.total).toBeGreaterThan(0);
    for (const product of data.data) expect(product.name).toMatch(/hammer/i);
  });

  test('returns 404 for a missing product', async ({ api }) => {
    const { status, data } = await api.get<{ message: string }>('/products/does-not-exist', {
      expectError: true,
    });

    expect(status).toBe(404);
    expect(data.message).toBe('Requested item not found');
  });
});

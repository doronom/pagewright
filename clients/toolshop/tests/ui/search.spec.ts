import { test, expect } from '../../fixtures';

test.describe('Search', () => {
  test('finds products by name', async ({ dynamicPage }) => {
    await dynamicPage.goto('products');
    await dynamicPage.executeSection('search', { query: 'hammer', submit: true });

    await dynamicPage.assertElementHasText(
      dynamicPage.getLocator('search', 'caption'),
      'Searched for: hammer',
    );
    // The caption appears before the list refreshes, so wait for a matching card, not just any card.
    await expect(dynamicPage.getLocator('list', 'firstProduct')).toContainText(/hammer/i);
  });
});

import { test, expect } from '@playwright/test';

test('unknown URLs show the 404 page with working links', async ({ page }) => {
  const response = await page.goto('this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByTestId('page-title')).toHaveText('Page not found');

  await page.getByTestId('not-found-articles').click();
  await expect(page).toHaveURL(/\/articles\/$/);
  await expect(page.getByTestId('page-title')).toHaveText('Articles');

  await page.goBack();
  await page.getByTestId('not-found-home').click();
  await expect(page.getByTestId('hero-section')).toBeVisible();
});

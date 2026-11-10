import { test, expect } from '@playwright/test';
import { requiredRoutes, sitemapPaths } from './helpers';

// Runs in both projects: every page in that build's sitemap (production or drafts-included).
test('every route returns 200 and renders its main heading', async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  const routes = sitemapPaths(String(testInfo.project.metadata.distDir));
  expect(routes.length).toBeGreaterThan(5);
  expect(routes).toEqual(expect.arrayContaining(requiredRoutes(testInfo)));
  for (const route of routes) {
    await test.step(`/${route}`, async () => {
      const response = await page.goto(route);
      expect(response?.status(), `/${route}`).toBe(200);
      await expect(page.getByTestId('page-title')).toHaveCount(1);
      await expect(page.getByTestId('page-title')).toBeVisible();
      await expect(page.getByTestId('page-title')).not.toBeEmpty();
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }
});

test('RSS feed and sitemap are served', async ({ request }) => {
  const rss = await request.get('rss.xml');
  expect(rss.status()).toBe(200);
  expect(await rss.text()).toContain('<rss');
  const sitemap = await request.get('sitemap-index.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('<sitemapindex');
});

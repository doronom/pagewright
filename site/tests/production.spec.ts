import { test, expect } from '@playwright/test';
import { sitemapPaths } from './helpers';

// Production build only (the "site" project).
test('production build contains no draft pages', async ({ request }) => {
  const articleRoutes = sitemapPaths('dist').filter((r) => r.startsWith('articles/'));
  expect(articleRoutes.filter((r) => !r.startsWith('articles/page/'))).toEqual([
    'articles/',
    'articles/dynamicpage-and-actions/',
    'articles/why-config-driven/',
  ]);
  expect((await request.get('articles/placeholder-article/')).status()).toBe(404);
  const rss = await (await request.get('rss.xml')).text();
  expect(rss).not.toContain('placeholder-article');
});

test('test numbers render only together (badge, telemetry, footer line)', async ({ page }) => {
  await page.goto('');
  const counts = await Promise.all(
    ['test-status-link', 'suite-telemetry', 'footer-test-line'].map((id) => page.getByTestId(id).count()),
  );
  expect(counts).toEqual(counts[0] ? [1, 1, 1] : [0, 0, 0]);
  if (counts[0]) {
    await expect(page.getByTestId('telemetry-passed')).toHaveText(/^\s*\d+ passed\s*$/);
  }
});

test('series parts 1 and 2 are published and linked in order', async ({ page }) => {
  await page.goto('series/config-driven-framework/');
  for (const part of ['1', '2']) {
    await expect(page.locator(`[data-test="series-part-row"][data-test-part="${part}"]`)).toHaveAttribute(
      'data-test-status',
      'published',
    );
  }
  await page.goto('articles/why-config-driven/');
  await page.getByTestId('series-nav-next').click();
  await expect(page).toHaveURL(/\/articles\/dynamicpage-and-actions\/$/);
  await expect(page.getByTestId('page-title')).toHaveText('DynamicPage and the actions layer');
  await expect(page.getByTestId('series-nav-prev')).toHaveAttribute('href', /\/articles\/why-config-driven\/$/);
});

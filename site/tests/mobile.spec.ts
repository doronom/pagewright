import { test, expect } from '@playwright/test';
import { requiredRoutes, sitemapPaths } from './helpers';

test.use({ viewport: { width: 360, height: 780 } });

test('no page scrolls horizontally at 360px', async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  const routes = [...sitemapPaths(String(testInfo.project.metadata.distDir)), 'does-not-exist/'];
  expect(routes).toEqual(expect.arrayContaining(requiredRoutes(testInfo)));
  const overflowing: string[] = [];
  await page.goto('');
  for (const theme of ['dark', 'light'] as const) {
    // The site defaults to dark; a saved choice is how a visitor gets light.
    await page.evaluate((t) => localStorage.setItem('theme', t), theme);
    for (const route of routes) {
      await page.goto(route);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      if (scrollWidth > clientWidth) overflowing.push(`/${route} (${theme}): ${scrollWidth} > ${clientWidth}`);
    }
  }
  expect(overflowing, overflowing.join('\n')).toEqual([]);
});

test('mobile menu holds the navigation and the theme toggle', async ({ page }) => {
  await page.goto('');
  await expect(page.getByTestId('nav-desktop')).toBeHidden();
  await expect(page.getByTestId('mobile-menu')).toBeHidden();

  await page.getByTestId('menu-toggle').click();
  await expect(page.getByTestId('mobile-menu')).toBeVisible();
  await page.getByTestId('theme-toggle-mobile').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.getByTestId('nav-mobile-series').click();
  await expect(page).toHaveURL(/\/series\/$/);
  await expect(page.getByTestId('page-title')).toHaveText('Series');
  await expect(page.getByTestId('mobile-menu')).toBeHidden();
});

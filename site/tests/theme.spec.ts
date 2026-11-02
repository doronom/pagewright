import { test, expect } from '@playwright/test';

test.describe('theme toggle', () => {
  test('defaults to the system setting', async ({ browser }) => {
    for (const scheme of ['light', 'dark'] as const) {
      const context = await browser.newContext({ colorScheme: scheme, baseURL: test.info().project.use.baseURL });
      const page = await context.newPage();
      await page.goto('');
      await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
      await context.close();
    }
  });

  test('switches and persists across reloads and pages', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    const background = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const darkBackground = await background();

    await page.getByTestId('theme-toggle').click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    expect(await background()).not.toBe(darkBackground);

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await page.getByTestId('nav-articles').click();
    await expect(page).toHaveURL(/\/articles\/$/);
    await expect(html).toHaveAttribute('data-theme', 'light');

    await page.getByTestId('theme-toggle').click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });
});

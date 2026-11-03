import { test, expect, type Page } from '@playwright/test';

async function setTheme(page: Page, theme: 'dark' | 'light') {
  await page.goto('about/');
  await page.evaluate((t) => localStorage.setItem('theme', t), theme);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
}

for (const theme of ['dark', 'light'] as const) {
  test(`about photo loads and sits beside the bio on desktop (${theme})`, async ({ page }) => {
    const failed: string[] = [];
    page.on('response', (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });
    page.on('requestfailed', (r) => failed.push(`failed ${r.url()}`));
    await setTheme(page, theme);

    const photo = page.getByTestId('about-photo');
    await expect(photo).toBeVisible();
    await expect(photo).toHaveAttribute('alt', 'Doron Omer');
    await expect(photo).toHaveAttribute('width', '160');
    await expect(photo).toHaveAttribute('height', '160');
    await expect(photo).toHaveAttribute('srcset', /\.webp 1x, .+\.webp 2x/);
    await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);

    const photoBox = (await photo.boundingBox())!;
    const bioBox = (await page.getByTestId('about-body').boundingBox())!;
    expect(photoBox.x + photoBox.width).toBeLessThanOrEqual(bioBox.x);
    expect(failed, failed.join('\n')).toEqual([]);
  });

  test(`about photo is centered above the bio at 360px (${theme})`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await setTheme(page, theme);

    const photo = page.getByTestId('about-photo');
    await expect(photo).toBeVisible();
    const photoBox = (await photo.boundingBox())!;
    const bioBox = (await page.getByTestId('about-body').boundingBox())!;
    expect(photoBox.y + photoBox.height).toBeLessThanOrEqual(bioBox.y);
    const viewportCenter = 360 / 2;
    expect(Math.abs(photoBox.x + photoBox.width / 2 - viewportCenter)).toBeLessThan(2);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });
}

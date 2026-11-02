import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

// Runs against the drafts-included build (dist-drafts), which is never deployed.
const ARTICLE = 'articles/placeholder-article/';

test.describe('article layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ARTICLE);
  });

  test('header shows series badge, meta and tags', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toHaveText('Placeholder article');
    await expect(page.getByTestId('series-badge')).toHaveText(/Part 1 of 6/);
    await expect(page.getByTestId('article-date')).toBeVisible();
    await expect(page.getByTestId('reading-time')).toHaveText(/^\d+ min read$/);
    await expect(page.getByTestId('article-tags').getByTestId('tag-chip')).toHaveCount(2);
  });

  test('RepoCode quotes the real file with line numbers and a repo link', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const repoCode = page.getByTestId('repo-code');
    await expect(repoCode).toHaveAttribute('data-test-file', 'core/page/DynamicPage.ts');
    await expect(repoCode.getByTestId('code-file')).toHaveText('core/page/DynamicPage.ts:58-75');
    await expect(repoCode.getByTestId('view-in-repo')).toHaveAttribute(
      'href',
      /\/blob\/main\/core\/page\/DynamicPage\.ts#L58-L75$/,
    );
    const lines = repoCode.locator('[data-line]');
    await expect(lines).toHaveCount(18);
    await expect(lines.first()).toHaveAttribute('data-line', '58');

    const expected = fs
      .readFileSync(path.resolve('..', 'core/page/DynamicPage.ts'), 'utf8')
      .split('\n')
      .slice(57, 75)
      .join('\n');
    await repoCode.getByTestId('copy-code').click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
  });

  test('fenced code block copies its code', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const block = page.locator('[data-test="code-block"][data-test-file="example.ts"]');
    await block.getByTestId('copy-code').click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      "const greeting = 'placeholder';\nconsole.log(greeting);",
    );
  });

  test('renders all callout types, a table and a diagram', async ({ page }) => {
    for (const type of ['note', 'tip', 'warning']) {
      await expect(page.locator(`[data-test="callout"][data-test-type="${type}"]`)).toBeVisible();
    }
    await expect(page.getByTestId('table')).toBeVisible();
    await expect(page.locator('[data-test="diagram-frame"][data-test-caption="figure-1"]')).toBeVisible();
  });

  test('table of contents lists the headings and highlights the current one', async ({ page }) => {
    const headings = page.getByTestId('article-body').locator('h2, h3');
    const links = page.getByTestId('toc-link');
    await expect(links).toHaveCount(await headings.count());
    await expect(links.first()).toHaveAttribute('aria-current', 'true');

    const last = links.last();
    await last.click();
    await expect(last).toHaveAttribute('aria-current', 'true');
    await expect(links.first()).toHaveAttribute('aria-current', 'false');
  });

  test('series navigation links to the series and shows the next part', async ({ page }) => {
    const nav = page.getByTestId('series-nav');
    await expect(nav.getByTestId('series-nav-next')).toHaveAttribute('data-test-status', 'coming-soon');
    await nav.getByTestId('series-nav-index').click();
    await expect(page).toHaveURL(/\/series\/config-driven-framework\/$/);
    await expect(page.locator('[data-test="series-part-row"][data-test-part="1"]')).toHaveAttribute(
      'data-test-status',
      'published',
    );
  });

  test('share copies the article link', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByTestId('share-copy-link').click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/\/articles\/placeholder-article\/$/);
  });
});

test.describe('article layout at 360px', () => {
  test.use({ viewport: { width: 360, height: 780 } });

  test('table of contents is collapsible and wide content scrolls inside its frame', async ({ page }) => {
    await page.goto(ARTICLE);
    const toggle = page.getByTestId('toc-toggle');
    const firstLink = page.getByTestId('toc-link').first();
    await expect(firstLink).toBeHidden();
    await toggle.click();
    await expect(firstLink).toBeVisible();

    const scroller = page.getByTestId('diagram-scroll');
    const overflows = await scroller.evaluate((el) => el.scrollWidth > el.clientWidth);
    expect(overflows).toBe(true);
    const pageScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(pageScroll).toBe(false);
  });
});

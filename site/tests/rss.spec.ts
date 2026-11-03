import { test, expect } from '@playwright/test';
import { site } from '../src/config/site';

const feedUrl = new URL(`${site.base === '/' ? '' : site.base}/rss.xml`, site.url).toString();

test('the RSS button opens a subscribe page that gives the feed address', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('');
  await page.getByTestId('link-rss').click();
  await expect(page).toHaveURL(/\/rss\/$/);
  await expect(page.getByTestId('page-title')).toHaveText('RSS feed');
  await expect(page.getByTestId('rss-feed-url')).toHaveText(feedUrl);

  await page.getByTestId('rss-subscribe').getByTestId('copy-code').click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(feedUrl);
  await expect(page.getByTestId('rss-raw-link')).toHaveAttribute('href', /\/rss\.xml$/);
});

test('the feed links back to the site under its base path', async ({ request }) => {
  const xml = await (await request.get('rss.xml')).text();
  const channelLink = /<channel>.*?<link>([^<]+)<\/link>/s.exec(xml)?.[1];
  expect(channelLink).toBe(new URL(`${site.base === '/' ? '' : site.base}/`, site.url).toString());
});

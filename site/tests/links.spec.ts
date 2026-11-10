import { test, expect, type APIRequestContext } from '@playwright/test';
import { requiredRoutes, sitemapPaths, toRelative } from './helpers';

test('no broken internal links', async ({ page, request, baseURL }, testInfo) => {
  test.setTimeout(120_000);
  const origin = new URL(baseURL!).origin;
  const queue = [...sitemapPaths(String(testInfo.project.metadata.distDir)), '404.html'];
  const visited = new Set<string>();
  const checked = new Map<string, number>();
  const broken: string[] = [];

  async function status(req: APIRequestContext, target: string): Promise<number> {
    if (!checked.has(target)) checked.set(target, (await req.get(target)).status());
    return checked.get(target)!;
  }

  while (queue.length) {
    const route = queue.shift()!;
    if (visited.has(route)) continue;
    visited.add(route);
    await page.goto(route);
    const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).href));
    const ids = new Set(await page.locator('[id]').evaluateAll((els) => els.map((e) => e.id)));

    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin !== origin) continue;
      const target = toRelative(url.pathname);
      const samePage = url.pathname === new URL(page.url()).pathname;
      if (samePage && url.hash && !ids.has(decodeURIComponent(url.hash.slice(1)))) {
        broken.push(`/${route} -> ${url.hash} (no element with that id)`);
        continue;
      }
      const code = await status(request, target);
      if (code !== 200) broken.push(`/${route} -> /${target} (${code})`);
      if (code === 200 && !target.match(/\.(xml|svg|png|txt)$/) && !visited.has(target)) queue.push(target);
    }
  }

  expect(broken, broken.join('\n')).toEqual([]);
  expect(visited.size).toBeGreaterThan(5);
  expect([...visited]).toEqual(expect.arrayContaining(requiredRoutes(testInfo)));
});

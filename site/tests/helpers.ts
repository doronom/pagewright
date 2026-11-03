import fs from 'node:fs';
import path from 'node:path';
import type { TestInfo } from '@playwright/test';
import { site } from '../src/config/site';

const base = site.base === '/' ? '' : site.base;

/** Build output directory for the current project (dist or dist-drafts). */
export function distDir(testInfo: TestInfo): string {
  return String(testInfo.project.metadata.distDir ?? 'dist');
}

/**
 * Paths (relative to the base URL, no leading slash) of every page in the build's sitemap.
 * Read synchronously so specs can generate one test per route.
 */
export function sitemapPaths(dir: string): string[] {
  const sitemapDir = path.resolve(dir);
  if (!fs.existsSync(sitemapDir)) {
    throw new Error(`${dir} does not exist; run the build first`);
  }
  const files = fs.readdirSync(sitemapDir).filter((f) => /^sitemap-\d+\.xml$/.test(f));
  const urls = files.flatMap((f) =>
    [...fs.readFileSync(path.join(sitemapDir, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
  );
  return urls.map((url) => toRelative(new URL(url).pathname)).sort();
}

/** Strips the base path and the leading slash: "/pagewright/articles/" becomes "articles/". */
export function toRelative(pathname: string): string {
  const withoutBase = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return withoutBase.replace(/^\//, '');
}

export function relativeLuminance(hex: string): number {
  const value = hex.trim().replace('#', '');
  const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(foreground: string, background: string): number {
  const [l1, l2] = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

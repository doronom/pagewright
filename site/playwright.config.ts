import { defineConfig, devices } from '@playwright/test';
import { site } from './src/config/site';

// The site is served from the built output (dist/ and the drafts-included dist-drafts/) by
// scripts/serve.mjs, which mimics GitHub Pages, under the same base path as production.
const base = site.base === '/' ? '' : site.base;
const PORT = 4321;
const DRAFTS_PORT = 4322;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }], ['./tests/summary-reporter.ts']],
  use: {
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'site',
      testIgnore: ['article-layout.spec.ts', 'flow-walkthrough.spec.ts'],
      use: { ...devices['Desktop Chrome'], baseURL: `http://127.0.0.1:${PORT}${base}/` },
      metadata: { distDir: 'dist' },
    },
    {
      name: 'drafts',
      testMatch: [
        'article-layout.spec.ts',
        'flow-walkthrough.spec.ts',
        'routes.spec.ts',
        'links.spec.ts',
        'mobile.spec.ts',
        'contrast.spec.ts',
      ],
      use: { ...devices['Desktop Chrome'], baseURL: `http://127.0.0.1:${DRAFTS_PORT}${base}/` },
      metadata: { distDir: 'dist-drafts' },
    },
  ],
  webServer: [
    {
      command: `node scripts/serve.mjs dist ${PORT} ${site.base}`,
      url: `http://127.0.0.1:${PORT}${base}/`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `node scripts/serve.mjs dist-drafts ${DRAFTS_PORT} ${site.base}`,
      url: `http://127.0.0.1:${DRAFTS_PORT}${base}/`,
      reuseExistingServer: !process.env.CI,
    },
  ],
});

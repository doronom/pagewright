import { defineConfig, devices, ReporterDescription } from '@playwright/test';
import { loadClient } from './core/client/loadClient';
import { clientName, storageStatePath, testEnv } from './core/env';

const client = loadClient();

const reporters: ReporterDescription[] = [['list'], ['html', { open: 'never' }]];
if (process.env.ALLURE === 'true') {
  reporters.push(['allure-playwright']);
}

export default defineConfig({
  testDir: `clients/${clientName}/tests`,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: reporters,
  use: {
    baseURL: client.baseUrl(testEnv),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: 'auth.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'ui',
      testMatch: 'ui/**/*.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: client.auth ? storageStatePath(clientName) : undefined,
      },
    },
    {
      name: 'api',
      testMatch: 'api/**/*.spec.ts',
    },
  ],
});

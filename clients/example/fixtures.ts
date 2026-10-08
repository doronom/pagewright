import { test as base } from '@core/fixtures';
import { ExampleApiClient } from './api/ExampleApiClient';

export const test = base.extend<{ api: ExampleApiClient }>({
  api: async ({ client, logger }, use) => use(new ExampleApiClient(client, logger)),
});

export { expect } from '@core/fixtures';

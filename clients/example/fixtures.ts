import { test as base } from '@core/fixtures';
import { ExampleApiClient } from './api/ExampleApiClient';

export const test = base.extend<{ api: ExampleApiClient }>({
  api: async ({ apiClient }, use) => {
    if (!(apiClient instanceof ExampleApiClient)) {
      throw new Error('apiClient is not an ExampleApiClient (check CLIENT env)');
    }
    await use(apiClient);
  },
});

export { expect } from '@core/fixtures';

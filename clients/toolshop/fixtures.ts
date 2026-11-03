import { test as base } from '@core/fixtures';
import { ToolshopApiClient } from './api/ToolshopApiClient';

export const test = base.extend<{ api: ToolshopApiClient }>({
  api: async ({ apiClient }, use) => {
    if (!(apiClient instanceof ToolshopApiClient)) {
      throw new Error('apiClient is not a ToolshopApiClient (check CLIENT env)');
    }
    await use(apiClient);
  },
});

export { expect } from '@core/fixtures';

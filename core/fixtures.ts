import { test as base } from '@playwright/test';
import { BaseApiClient } from './api/BaseApiClient';
import { ClientDefinition } from './client/ClientDefinition';
import { loadClient } from './client/loadClient';
import { Logger } from './Logger';
import { DynamicPage } from './page/DynamicPage';
import { SharedData } from './SharedData';

interface Fixtures {
  client: ClientDefinition;
  logger: Logger;
  sharedData: SharedData;
  dynamicPage: DynamicPage;
  apiClient: BaseApiClient;
}

export const test = base.extend<Fixtures>({
  client: async ({}, use) => use(loadClient()),
  logger: async ({}, use, testInfo) => use(new Logger(testInfo.title)),
  sharedData: async ({}, use) => use(new SharedData()),
  dynamicPage: async ({ page, client, logger, sharedData }, use) =>
    use(new DynamicPage(page, client, logger, sharedData)),
  apiClient: async ({ client, logger }, use) => {
    if (!client.createApiClient) {
      throw new Error(`Client "${client.name}" does not define createApiClient`);
    }
    await use(client.createApiClient(logger));
  },
});

export { expect } from '@playwright/test';

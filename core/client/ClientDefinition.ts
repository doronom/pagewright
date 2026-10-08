import { Page } from '@playwright/test';
import { BaseApiClient } from '../api/BaseApiClient';
import { AuthStrategy } from '../auth/AuthStrategy';
import { Logger } from '../Logger';
import { ActionFunction, PageConfig } from '../page/types';

export interface ClientDefinition {
  name: string;
  baseUrl: (env: string) => string;
  apiBaseUrl?: (env: string) => string;
  defaultHeaders?: Record<string, string>;
  pages: Record<string, (page: Page) => PageConfig>;
  auth?: AuthStrategy;
  actions?: Record<string, ActionFunction>;
  onPageInit?: (page: Page) => Promise<void>;
  createApiClient?: (logger: Logger) => BaseApiClient;
}

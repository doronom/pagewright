import { Page } from '@playwright/test';

export interface AuthStrategy {
  login(page: Page, creds: { user: string; password: string }): Promise<void>;
  isLoggedIn(page: Page): Promise<boolean>;
}

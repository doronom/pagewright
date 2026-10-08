import { Page } from '@playwright/test';
import { AuthStrategy } from '@core/auth/AuthStrategy';
import { loadClient } from '@core/client/loadClient';
import { Logger } from '@core/Logger';
import { DynamicPage } from '@core/page/DynamicPage';
import { SharedData } from '@core/SharedData';
import { inventoryPage } from '../pages/InventoryPage.config';

export class ExampleAuth implements AuthStrategy {
  async login(page: Page, creds: { user: string; password: string }): Promise<void> {
    const dynamicPage = new DynamicPage(page, loadClient(), new Logger('auth'), new SharedData());
    await dynamicPage.goto('login');
    await dynamicPage.executeSection('form', {
      username: creds.user,
      password: creds.password,
      submit: true,
    });
  }

  async isLoggedIn(page: Page): Promise<boolean> {
    return inventoryPage(page).sections.header.fields.title.locator.isVisible();
  }
}

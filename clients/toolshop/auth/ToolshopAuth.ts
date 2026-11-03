import { Page } from '@playwright/test';
import { AuthStrategy } from '@core/auth/AuthStrategy';
import { ClientDefinition } from '@core/client/ClientDefinition';
import { Logger } from '@core/Logger';
import { DynamicPage } from '@core/page/DynamicPage';
import { SharedData } from '@core/SharedData';
import { accountPage } from '../pages/AccountPage.config';

export class ToolshopAuth implements AuthStrategy {
  constructor(private readonly getClient: () => ClientDefinition) {}

  async login(page: Page, creds: { user: string; password: string }): Promise<void> {
    const { user: email, password } = creds;
    const dynamicPage = new DynamicPage(page, this.getClient(), new Logger('auth'), new SharedData());
    await dynamicPage.goto('login');
    await dynamicPage.executeSection('form', { email, password, submit: true });
  }

  async isLoggedIn(page: Page): Promise<boolean> {
    return accountPage(page).sections.overview.fields.title.locator.isVisible();
  }
}

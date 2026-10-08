import { expect, Locator } from '@playwright/test';
import { Logger } from '../Logger';

export class WaitAndAssertActions {
  constructor(private readonly logger: Logger) {}

  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    this.logger.debug(`Waiting for ${locator}`);
    await locator.waitFor({ state: 'visible', timeout });
  }

  async isVisible(locator: Locator, timeout = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async assertText(locator: Locator, expected: string): Promise<void> {
    await expect(locator).toHaveText(expected);
  }
}

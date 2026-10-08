import { expect, Locator } from '@playwright/test';
import { Logger } from '../Logger';

export class InputActions {
  constructor(private readonly logger: Logger) {}

  async fillText(locator: Locator, text: string): Promise<void> {
    this.logger.debug(`Filling ${locator}`);
    await locator.fill(text);
    await expect(locator).toHaveValue(text);
  }
}

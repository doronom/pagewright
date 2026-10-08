import { Locator } from '@playwright/test';
import { Logger } from '../Logger';

export class ElementActions {
  constructor(private readonly logger: Logger) {}

  async click(locator: Locator): Promise<void> {
    this.logger.debug(`Clicking ${locator}`);
    await locator.click();
  }

  async setChecked(locator: Locator, checked: boolean): Promise<void> {
    this.logger.debug(`Setting ${locator} checked=${checked}`);
    await locator.setChecked(checked);
  }

  async toggle(locator: Locator, on: boolean): Promise<void> {
    this.logger.debug(`Toggling ${locator} to ${on ? 'on' : 'off'}`);
    if ((await locator.isChecked()) !== on) {
      await locator.click();
    }
  }

  async selectRadio(locator: Locator, label?: string): Promise<void> {
    this.logger.debug(`Selecting radio ${label ?? locator}`);
    await (label ? locator.getByLabel(label, { exact: true }) : locator).check();
  }

  async selectOption(locator: Locator, value: string | string[]): Promise<void> {
    this.logger.debug(`Selecting option ${value} in ${locator}`);
    await locator.selectOption(value);
  }

  async getText(locator: Locator): Promise<string> {
    return (await locator.innerText()).trim();
  }
}

import { Locator, Page } from '@playwright/test';
import { ElementActions } from '../actions/ElementActions';
import { FileUploadActions } from '../actions/FileUploadActions';
import { InputActions } from '../actions/InputActions';
import { WaitAndAssertActions } from '../actions/WaitAndAssertActions';
import { ClientDefinition } from '../client/ClientDefinition';
import { testEnv } from '../env';
import { Logger } from '../Logger';
import { retry } from '../RetryHelper';
import { SharedData } from '../SharedData';
import { ActionFunction, FieldConfig, PageConfig } from './types';

export class DynamicPage {
  readonly elementActions: ElementActions;
  readonly inputActions: InputActions;
  readonly waitAndAssertActions: WaitAndAssertActions;
  readonly fileUploadActions: FileUploadActions;
  private readonly actions: Map<string, ActionFunction>;
  private currentConfig?: PageConfig;
  private initialized = false;

  constructor(
    readonly page: Page,
    private readonly client: ClientDefinition,
    private readonly logger: Logger,
    private readonly sharedData: SharedData,
  ) {
    this.elementActions = new ElementActions(logger);
    this.inputActions = new InputActions(logger);
    this.waitAndAssertActions = new WaitAndAssertActions(logger);
    this.fileUploadActions = new FileUploadActions(logger);

    const builtIn: Record<string, ActionFunction> = {
      fill: (locator, value) => this.inputActions.fillText(locator, String(value)),
      click: (locator) => this.elementActions.click(locator),
      check: (locator, value) => this.elementActions.setChecked(locator, Boolean(value)),
      radio: (locator, value) =>
        this.elementActions.selectRadio(locator, typeof value === 'string' ? value : undefined),
      toggle: (locator, value) => this.elementActions.toggle(locator, Boolean(value)),
      selectOption: (locator, value) => this.elementActions.selectOption(locator, value as string | string[]),
      upload: (locator, value) => this.fileUploadActions.uploadFile(locator, value as string | string[]),
      waitForElement: (locator, value) =>
        this.waitAndAssertActions.waitForElement(locator, typeof value === 'number' ? value : undefined),
      getText: async (locator, value) => {
        const text = await this.elementActions.getText(locator);
        if (typeof value === 'string') {
          this.sharedData.set(value, text);
        }
        return text;
      },
    };
    this.actions = new Map(Object.entries({ ...builtIn, ...client.actions }));
  }

  registerAction(name: string, fn: ActionFunction): void {
    this.actions.set(name, fn);
  }

  async goto(pageName: string, options: { skipNavigation?: boolean } = {}): Promise<void> {
    const configFactory = this.client.pages[pageName];
    if (!configFactory) {
      throw new Error(`Page "${pageName}" is not defined for client "${this.client.name}"`);
    }
    this.currentConfig = configFactory(this.page);

    if (!this.initialized) {
      await this.client.onPageInit?.(this.page);
      this.initialized = true;
    }

    if (options.skipNavigation) {
      return;
    }
    if (!this.currentConfig.url) {
      throw new Error(`Page "${pageName}" has no url`);
    }

    const url = new URL(
      this.replacePlaceholders(this.currentConfig.url),
      this.client.baseUrl(testEnv),
    ).toString();
    this.logger.info(`Navigating to ${pageName}: ${url}`);
    await retry(
      () => this.page.goto(url, { waitUntil: 'domcontentloaded' }),
      `Navigation to ${url}`,
      this.logger,
    );
  }

  async executeSection(sectionName: string, data: Record<string, unknown>): Promise<void> {
    for (const [fieldName, value] of Object.entries(data)) {
      const field = this.getField(sectionName, fieldName);
      for (const actionConfig of field.actions) {
        const action = this.actions.get(actionConfig.action);
        if (!action) {
          throw new Error(`Unsupported action "${actionConfig.action}" on ${sectionName}.${fieldName}`);
        }
        this.logger.info(`${sectionName}.${fieldName}: ${actionConfig.action}`);
        await action(field.locator, actionConfig.value ?? value);
      }
    }
  }

  getLocator(sectionName: string, fieldName: string): Locator {
    return this.getField(sectionName, fieldName).locator;
  }

  isElementVisible(locator: Locator, timeout?: number): Promise<boolean> {
    return this.waitAndAssertActions.isVisible(locator, timeout);
  }

  assertElementVisible(locator: Locator): Promise<void> {
    return this.waitAndAssertActions.assertVisible(locator);
  }

  assertElementHasText(locator: Locator, expected: string): Promise<void> {
    return this.waitAndAssertActions.assertText(locator, expected);
  }

  private getField(sectionName: string, fieldName: string): FieldConfig {
    if (!this.currentConfig) {
      throw new Error('No page configuration loaded. Call goto() first.');
    }
    const field = this.currentConfig.sections[sectionName]?.fields[fieldName];
    if (!field) {
      throw new Error(`Field "${fieldName}" not found in section "${sectionName}"`);
    }
    return field;
  }

  private replacePlaceholders(url: string): string {
    return url.replace(/\$\{(\w+)\}/g, (match, key: string) => {
      if (!this.sharedData.has(key)) {
        throw new Error(`No shared data value for URL placeholder "${match}"`);
      }
      return String(this.sharedData.get(key));
    });
  }
}

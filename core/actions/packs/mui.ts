import { expect, Locator } from '@playwright/test';
import { ActionFunction } from '../../page/types';

async function pickOption(input: Locator, option: string): Promise<void> {
  await input.click();
  await input.fill(option);
  await input.page().getByRole('option', { name: option, exact: true }).click();
}

export const muiActions: Record<string, ActionFunction> = {
  muiAutocomplete: async (locator, value) => {
    await pickOption(locator, String(value));
    await expect(locator).toHaveValue(String(value));
  },
  muiMultiAutocomplete: async (locator, value) => {
    for (const option of value as string[]) {
      await pickOption(locator, option);
    }
  },
};

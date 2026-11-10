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
    // MUI clears uncommitted text on blur (unless freeSolo is on),
    // so after blur the value survives only if an option was really selected.
    await locator.blur();
    await expect(locator).toHaveValue(String(value));
  },
  muiMultiAutocomplete: async (locator, value) => {
    const root = locator.locator('xpath=ancestor::*[contains(@class, "MuiAutocomplete-root")][1]');
    for (const option of value as string[]) {
      await pickOption(locator, option);
      // A selected option in a multi autocomplete becomes a chip.
      await expect(root.getByRole('button', { name: option })).toBeVisible();
    }
  },
};

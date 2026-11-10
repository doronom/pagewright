import path from 'path';
import { buildSync } from 'esbuild';
import { test, expect, Locator, Page } from '@playwright/test';
import { muiActions } from '../mui';

// These tests run the MUI pack against real MUI Autocompletes. The harness app is bundled in memory
// at test time, so there is no committed bundle and no network access.
const FIXTURE = path.join(__dirname, 'fixtures', 'mui-app.jsx');

let bundle: string;

test.beforeAll(() => {
  const result = buildSync({
    entryPoints: [FIXTURE],
    bundle: true,
    write: false,
    format: 'iife',
    platform: 'browser',
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'silent',
  });
  bundle = result.outputFiles[0].text;
});

test.beforeEach(async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.setContent('<div id="root"></div>');
  await page.addScriptTag({ content: bundle });
  await expect(
    combobox(page, 'Currency'),
    `harness failed to render: ${pageErrors.join('; ')}`,
  ).toBeVisible();
});

// MUI 9 no longer forwards inputProps to the input, so inputs are found by role and label.
function combobox(page: Page, name: string): Locator {
  return page.getByRole('combobox', { name, exact: true });
}

async function failureOf(action: Promise<unknown>): Promise<string> {
  const error = await action.then(
    () => undefined,
    (e: unknown) => e,
  );
  expect(error, 'the action should have failed').toBeInstanceOf(Error);
  // Strip terminal colour codes so the message can be matched as plain text.
  // eslint-disable-next-line no-control-regex
  const message = (error as Error).message.replace(/\u001b\[[0-9;]*m/g, '');
  await test.info().attach('failure message', { body: message, contentType: 'text/plain' });
  return message;
}

test('assumption: MUI clears uncommitted input text on blur', async ({ page }) => {
  const input = combobox(page, 'Currency');
  await input.click();
  await input.fill('USD');
  await expect(input).toHaveValue('USD');
  await input.blur();
  await expect(input).toHaveValue('');
});

test('muiAutocomplete selects a real option', async ({ page }) => {
  const input = combobox(page, 'Currency');
  await muiActions.muiAutocomplete(input, 'EUR');
  await expect(input).toHaveValue('EUR');
});

test('the old muiAutocomplete passes on a rejected selection (false positive)', async ({ page }) => {
  // The implementation before the fix, kept here only to prove it was wrong: it checks the value
  // while the typed text is still in the input, before MUI has a chance to clear it.
  async function oldMuiAutocompleteBeforeFix(locator: Locator, value: unknown): Promise<void> {
    await locator.click();
    await locator.fill(String(value));
    await locator
      .page()
      .getByRole('option', { name: String(value), exact: true })
      .click();
    await expect(locator).toHaveValue(String(value));
  }

  const input = combobox(page, 'Rejecting');
  await oldMuiAutocompleteBeforeFix(input, 'EUR');
  // The old action passed, but nothing was selected: the text is gone after blur.
  await input.blur();
  await expect(input).toHaveValue('');
});

test('muiAutocomplete fails on a rejected selection', async ({ page }) => {
  const message = await failureOf(muiActions.muiAutocomplete(combobox(page, 'Rejecting'), 'EUR'));
  expect(message).toContain('toHaveValue');
  expect(message).toContain('Expected: "EUR"');
  expect(message).toContain('Received: ""');
});

test('muiMultiAutocomplete creates a chip per option', async ({ page }) => {
  const input = combobox(page, 'Currencies');
  await muiActions.muiMultiAutocomplete(input, ['USD', 'ILS']);
  // Only this autocomplete has chips on the page, so the chip buttons can be found page-wide.
  await expect(page.getByRole('button', { name: 'USD', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'ILS', exact: true })).toBeVisible();
});

test('muiMultiAutocomplete fails on a rejected selection', async ({ page }) => {
  const message = await failureOf(
    muiActions.muiMultiAutocomplete(combobox(page, 'Rejecting multi'), ['USD']),
  );
  expect(message).toContain('toBeVisible');
  expect(message).toContain("getByRole('button', { name: 'USD' })");
});

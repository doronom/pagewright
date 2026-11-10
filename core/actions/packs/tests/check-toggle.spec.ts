import { test, expect, Page } from '@playwright/test';
import { ClientDefinition } from '../../../client/ClientDefinition';
import { Logger } from '../../../Logger';
import { DynamicPage } from '../../../page/DynamicPage';
import { SharedData } from '../../../SharedData';

// The built-in check and toggle actions, run through DynamicPage against real checkboxes. They take
// only a real boolean: a string such as 'false' or a missing value must fail, not guess.
const client: ClientDefinition = {
  name: 'check-toggle-harness',
  baseUrl: () => 'about:blank',
  pages: {
    form: (page: Page) => ({
      sections: {
        form: {
          fields: {
            terms: { locator: page.getByRole('checkbox', { name: 'Terms' }), actions: [{ action: 'check' }] },
            alerts: {
              locator: page.getByRole('switch', { name: 'Alerts' }),
              actions: [{ action: 'toggle' }],
            },
          },
        },
      },
    }),
  },
};

async function openForm(page: Page): Promise<DynamicPage> {
  await page.setContent(`
    <label><input type="checkbox"> Terms</label>
    <label><input type="checkbox" role="switch"> Alerts</label>
  `);
  const dynamicPage = new DynamicPage(page, client, new Logger('check-toggle'), new SharedData());
  await dynamicPage.goto('form', { skipNavigation: true });
  return dynamicPage;
}

for (const [action, field, role, name] of [
  ['check', 'terms', 'checkbox', 'Terms'],
  ['toggle', 'alerts', 'switch', 'Alerts'],
] as const) {
  test(`${action} sets true and false`, async ({ page }) => {
    const dynamicPage = await openForm(page);
    const box = page.getByRole(role, { name });

    await dynamicPage.executeSection('form', { [field]: true });
    await expect(box).toBeChecked();
    await dynamicPage.executeSection('form', { [field]: false });
    await expect(box).not.toBeChecked();
  });

  test(`${action} rejects the string 'false'`, async ({ page }) => {
    const dynamicPage = await openForm(page);
    await expect(dynamicPage.executeSection('form', { [field]: 'false' })).rejects.toThrow(
      `Action "${action}" expects true or false, got "false"`,
    );
    await expect(page.getByRole(role, { name })).not.toBeChecked();
  });

  test(`${action} rejects a missing value`, async ({ page }) => {
    const dynamicPage = await openForm(page);
    await expect(dynamicPage.executeSection('form', { [field]: undefined })).rejects.toThrow(
      `Action "${action}" expects true or false, got undefined`,
    );
    await expect(page.getByRole(role, { name })).not.toBeChecked();
  });
}

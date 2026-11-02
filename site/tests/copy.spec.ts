import { test, expect } from '@playwright/test';

test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

test('copy button copies the quick-start commands', async ({ page }) => {
  await page.goto('');
  const block = page.getByTestId('project-card').getByTestId('code-block');
  const button = block.getByTestId('copy-code');
  await button.click();
  await expect(button).toHaveAttribute('data-state', 'copied');
  await expect(button).toContainText('copied');
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toBe('npm install\nCLIENT=toolshop npm test');
  await expect(button).toHaveAttribute('data-state', 'idle', { timeout: 5000 });
});

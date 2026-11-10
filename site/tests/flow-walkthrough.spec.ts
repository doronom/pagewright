import { test, expect, type Page } from '@playwright/test';

// Runs against the drafts-included build (dist-drafts): the article is still a draft.
const ARTICLE = 'articles/why-config-driven/';
const PLAY_INTERVAL_MS = 2800;
const UI_STEPS = 10;

function panel(page: Page, id: 'ui' | 'api' | 'auth') {
  return page.locator(`[data-test="flow-panel"][data-flow-panel="${id}"]`);
}

function tab(page: Page, id: 'ui' | 'api' | 'auth') {
  return page.locator(`[data-test="flow-tab"][data-flow-tab="${id}"]`);
}

test.describe('flow walkthrough', () => {
  test('starts on step 1 and Next moves to step 2', async ({ page }) => {
    await page.goto(ARTICLE);
    const ui = panel(page, 'ui');
    const steps = ui.getByTestId('flow-step');
    await expect(steps).toHaveCount(UI_STEPS);
    await expect(steps.nth(0)).toBeVisible();
    for (let i = 1; i < UI_STEPS; i++) await expect(steps.nth(i)).toBeHidden();
    await expect(ui.getByTestId('flow-prev')).toBeDisabled();
    await expect(ui.locator('[data-test="flow-node"][data-node="spec"]')).toHaveClass(/\bis-current\b/);

    await ui.getByTestId('flow-next').click();
    await expect(steps.nth(1)).toBeVisible();
    await expect(steps.nth(0)).toBeHidden();
    await expect(ui.getByTestId('flow-prev')).toBeEnabled();
    await expect(ui.locator('[data-test="flow-node"][data-node="clientFx"]')).toHaveClass(/\bis-current\b/);
    await expect(ui.locator('[data-test="flow-node"][data-node="spec"]')).toHaveClass(/\bis-visited\b/);
    await expect(ui.locator('[data-test="flow-node"][data-node="spec"]')).not.toHaveClass(/\bis-current\b/);
  });

  test('a step dot jumps to the last step, which shows success', async ({ page }) => {
    await page.goto(ARTICLE);
    const ui = panel(page, 'ui');
    await ui.getByTestId('flow-step-dot').last().click();
    const last = ui.getByTestId('flow-step').last();
    await expect(last).toBeVisible();
    await expect(last).toHaveAttribute('data-status', 'success');
    await expect(ui.locator('[data-test="flow-node"][data-node="browser"]')).toHaveClass(/\bis-success\b/);
    await expect(ui.getByTestId('flow-step-dot').last()).toHaveAttribute('aria-current', 'step');
    await expect(ui.getByTestId('flow-next')).toBeDisabled();
  });

  test('Play advances on its own and Pause stops it', async ({ page }) => {
    await page.clock.install();
    await page.goto(ARTICLE);
    const ui = panel(page, 'ui');
    const steps = ui.getByTestId('flow-step');
    const play = ui.getByTestId('flow-play');

    await play.click();
    await expect(play).toHaveText('Pause');
    await expect(play).toHaveAttribute('aria-pressed', 'true');
    await page.clock.runFor(PLAY_INTERVAL_MS);
    await expect(steps.nth(1)).toBeVisible();

    await play.click();
    await expect(play).toHaveText('Play');
    await expect(play).toHaveAttribute('aria-pressed', 'false');
    await page.clock.runFor(PLAY_INTERVAL_MS * 3);
    await expect(steps.nth(1)).toBeVisible();
    await expect(steps.nth(2)).toBeHidden();
  });

  test('ArrowRight inside a panel advances a step', async ({ page }) => {
    await page.goto(ARTICLE);
    const ui = panel(page, 'ui');
    await ui.getByTestId('flow-diagram-scroll').focus();
    await page.keyboard.press('ArrowRight');
    await expect(ui.getByTestId('flow-step').nth(1)).toBeVisible();
    await expect(ui.getByTestId('flow-step').nth(0)).toBeHidden();
  });

  test('tabs switch panels, and ArrowRight moves to the next tab', async ({ page }) => {
    await page.goto(ARTICLE);
    await tab(page, 'api').click();
    await expect(tab(page, 'api')).toHaveAttribute('aria-selected', 'true');
    await expect(panel(page, 'api')).toBeVisible();
    await expect(panel(page, 'ui')).toBeHidden();
    await expect(panel(page, 'api').getByTestId('flow-step').first()).toBeVisible();

    await tab(page, 'api').focus();
    await page.keyboard.press('ArrowRight');
    await expect(tab(page, 'auth')).toBeFocused();
    await expect(tab(page, 'auth')).toHaveAttribute('aria-selected', 'true');
    await expect(tab(page, 'api')).toHaveAttribute('aria-selected', 'false');
    await expect(panel(page, 'auth')).toBeVisible();
    await expect(panel(page, 'api')).toBeHidden();
  });
});

test.describe('flow walkthrough at 360px', () => {
  test.use({ viewport: { width: 360, height: 780 } });

  test('the page does not scroll sideways and the diagram follows the dot', async ({ page }) => {
    await page.goto(ARTICLE);
    const pageScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(pageScroll).toBe(false);

    const ui = panel(page, 'ui');
    const scroller = ui.getByTestId('flow-diagram-scroll');
    expect(await scroller.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
    expect(await scroller.evaluate((el) => el.scrollLeft)).toBe(0);

    // Step 3 is core/fixtures.ts, the right-hand node of the top row.
    await ui.getByTestId('flow-step-dot').nth(2).click();
    await expect(ui.locator('[data-test="flow-node"][data-node="coreFx"]')).toHaveClass(/\bis-current\b/);
    await expect.poll(() => scroller.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  });
});

test.describe('flow walkthrough without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('every UI step is visible and the controls are hidden', async ({ page }) => {
    await page.goto(ARTICLE);
    const ui = panel(page, 'ui');
    const steps = ui.getByTestId('flow-step');
    await expect(steps).toHaveCount(UI_STEPS);
    for (let i = 0; i < UI_STEPS; i++) await expect(steps.nth(i)).toBeVisible();
    await expect(ui.getByTestId('flow-controls')).toBeHidden();
    await expect(page.getByTestId('flow-controls')).toHaveCount(3);
    for (const controls of await page.getByTestId('flow-controls').all()) await expect(controls).toBeHidden();
  });
});

// Series part 2 has two walkthroughs on one page. Each keeps its own tab and step, and the
// "goto: missing value" tab ends in a failure at step 3.
test.describe('two flow walkthroughs on one page', () => {
  const PART_2 = 'articles/dynamicpage-and-actions/';

  function walkthrough(page: Page, id: 'dynamicpage-flows' | 'autocomplete-flows') {
    return page.locator(`[data-test="flow-walkthrough"][data-test-id="${id}"]`);
  }

  function panelIn(root: ReturnType<typeof walkthrough>, id: string) {
    return root.locator(`[data-test="flow-panel"][data-flow-panel="${id}"]`);
  }

  function tabIn(root: ReturnType<typeof walkthrough>, id: string) {
    return root.locator(`[data-test="flow-tab"][data-flow-tab="${id}"]`);
  }

  test('both render, each with its own tabs', async ({ page }) => {
    await page.goto(PART_2);
    await expect(page.getByTestId('flow-walkthrough')).toHaveCount(2);
    await expect(walkthrough(page, 'dynamicpage-flows').getByTestId('flow-tab')).toHaveText([
      'goto',
      'goto: missing value',
      'executeSection',
    ]);
    await expect(walkthrough(page, 'autocomplete-flows').getByTestId('flow-tab')).toHaveText([
      'Before the fix',
      'After the fix',
    ]);
  });

  test('stepping one walkthrough leaves the other where it was', async ({ page }) => {
    await page.goto(PART_2);
    const first = walkthrough(page, 'dynamicpage-flows');
    const second = walkthrough(page, 'autocomplete-flows');
    const goto = panelIn(first, 'goto');
    const before = panelIn(second, 'before');

    await goto.getByTestId('flow-next').click();
    await goto.getByTestId('flow-next').click();
    await expect(goto.getByTestId('flow-step').nth(2)).toBeVisible();
    await expect(before.getByTestId('flow-step').nth(0)).toBeVisible();
    await expect(before.getByTestId('flow-prev')).toBeDisabled();

    await before.getByTestId('flow-next').click();
    await expect(before.getByTestId('flow-step').nth(1)).toBeVisible();
    await expect(goto.getByTestId('flow-step').nth(2)).toBeVisible();

    await tabIn(second, 'after').click();
    await expect(panelIn(second, 'after')).toBeVisible();
    await expect(before).toBeHidden();
    await expect(tabIn(first, 'goto')).toHaveAttribute('aria-selected', 'true');
    await expect(goto).toBeVisible();
  });

  test('the "goto: missing value" tab ends in a failure at step 3', async ({ page }) => {
    await page.goto(PART_2);
    const first = walkthrough(page, 'dynamicpage-flows');
    await tabIn(first, 'goto-missing').click();
    const missing = panelIn(first, 'goto-missing');
    await expect(missing).toBeVisible();
    await expect(missing.getByTestId('flow-step')).toHaveCount(3);

    await missing.getByTestId('flow-step-dot').nth(2).click();
    const step3 = missing.getByTestId('flow-step').nth(2);
    await expect(step3).toBeVisible();
    await expect(step3).toHaveAttribute('data-status', 'failure');
    await expect(missing.locator('[data-test="flow-node"][data-node="shared"]')).toHaveClass(/\bis-failure\b/);
    await expect(missing.getByTestId('flow-next')).toBeDisabled();
    // The other walkthrough is untouched.
    const before = panelIn(walkthrough(page, 'autocomplete-flows'), 'before');
    await expect(before.getByTestId('flow-step').nth(0)).toBeVisible();
  });
});

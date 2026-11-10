import { test, expect, type Page, type TestInfo } from '@playwright/test';
import { contrastRatio, distDir } from './helpers';

// WCAG AA for normal text is 4.5:1. Checks the token values the built CSS actually ships, then the
// rendered text of every flow walkthrough on the page. Runs in both projects: the production build
// checks the home page, the drafts build checks series parts 1 and 2, which have the walkthroughs.
const AA = 4.5;
const FOREGROUNDS = ['--text', '--text-muted', '--text-faint', '--primary'];
const BACKGROUNDS = ['--bg', '--surface-lowest', '--surface-low', '--surface'];
const THEMES = ['dark', 'light'] as const;

function routes(testInfo: TestInfo): string[] {
  return distDir(testInfo) === 'dist-drafts'
    ? ['articles/why-config-driven/', 'articles/dynamicpage-and-actions/']
    : [''];
}

test('text tokens meet WCAG AA in both themes', async ({ page }, testInfo) => {
  await page.goto(routes(testInfo)[0]);
  const rows: string[] = [];
  const failures: string[] = [];
  for (const theme of THEMES) {
    const tokens = await page.evaluate(
      ({ theme, names }) => {
        document.documentElement.setAttribute('data-theme', theme);
        const style = getComputedStyle(document.documentElement);
        return Object.fromEntries(names.map((n) => [n, style.getPropertyValue(n).trim()]));
      },
      { theme, names: [...FOREGROUNDS, ...BACKGROUNDS, '--on-primary'] },
    );
    const pairs = FOREGROUNDS.flatMap((fg) => BACKGROUNDS.map((bg) => [fg, bg]));
    pairs.push(['--on-primary', '--primary']);
    for (const [fg, bg] of pairs) {
      const background = bg === '--primary' ? tokens['--primary'] : tokens[bg];
      const ratio = contrastRatio(tokens[fg], background);
      const line = `${theme.padEnd(5)} ${fg.padEnd(13)} ${tokens[fg]} on ${bg.padEnd(16)} ${background}  ${ratio.toFixed(2)}:1`;
      rows.push(line);
      if (ratio < AA) failures.push(line);
    }
  }
  console.log(`\nContrast ratios (AA = ${AA}:1)\n${rows.join('\n')}`);
  await test.info().attach('contrast.txt', { body: rows.join('\n'), contentType: 'text/plain' });
  expect(failures, failures.join('\n')).toEqual([]);
});

interface TextSample {
  label: string;
  fg: string;
  bg: string;
}

/**
 * Every visible text node inside the walkthroughs, with its color and the color actually behind it
 * (translucent and color-mix() backgrounds composited on a canvas). SVG labels sit on their node's rect.
 * Code blocks are left out: their colors are the Shiki tokens. Disabled buttons are exempt in WCAG.
 */
async function walkthroughText(page: Page): Promise<TextSample[]> {
  return page.evaluate(async () => {
    // Read the settled colors, not a frame in the middle of a theme or step transition. With two
    // walkthroughs on a page, one can still be animating while the other is being stepped.
    const transitions = document.getAnimations().filter((animation) => animation instanceof CSSTransition);
    // A transition that is cancelled by the next change rejects; that is settled too.
    await Promise.all(transitions.map((transition) => transition.finished.catch(() => undefined)));
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    const hex = (layers: string[]): string => {
      ctx.clearRect(0, 0, 1, 1);
      for (const color of layers) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
      }
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
    };
    const alpha = (color: string): number => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      return ctx.getImageData(0, 0, 1, 1).data[3];
    };
    const backgroundOf = (el: Element): string => {
      const layers: string[] = [];
      for (let node: Element | null = el; node; node = node.parentElement) {
        const color = getComputedStyle(node).backgroundColor;
        if (alpha(color) === 0) continue;
        layers.unshift(color);
        if (alpha(color) === 255) break;
      }
      return hex([getComputedStyle(document.body).backgroundColor, ...layers]);
    };

    const samples: { label: string; fg: string; bg: string }[] = [];
    for (const root of document.querySelectorAll('[data-test="flow-walkthrough"]')) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let text = walker.nextNode(); text; text = walker.nextNode()) {
        const el = text.parentElement;
        if (!el || !text.textContent?.trim() || el.closest('pre, title')) continue;
        if (!el.getClientRects().length || el.closest('[hidden]')) continue;
        if ((el.closest('button') as HTMLButtonElement | null)?.disabled) continue;
        const style = getComputedStyle(el);
        if (style.visibility === 'hidden') continue;
        const label = `${el.tagName.toLowerCase()} "${text.textContent.trim().slice(0, 40)}"`;
        if (el instanceof SVGTextElement) {
          const rect = el.parentElement?.querySelector('rect');
          const surface = backgroundOf(el);
          samples.push({
            label,
            fg: hex([style.fill]),
            bg: hex([surface, rect ? getComputedStyle(rect).fill : surface]),
          });
        } else {
          samples.push({ label, fg: hex([style.color]), bg: backgroundOf(el) });
        }
      }
    }
    return samples;
  });
}

test('flow walkthrough text meets WCAG AA in both themes', async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  const rows: string[] = [];
  const failures: string[] = [];
  let roots = 0;
  for (const path of routes(testInfo)) {
    await page.goto(path);
    const walkthroughs = await page.getByTestId('flow-walkthrough').all();
    roots += walkthroughs.length;
    for (const theme of THEMES) {
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      for (const root of walkthroughs) {
        for (const tab of await root.getByTestId('flow-tab').all()) {
          const id = String(await tab.getAttribute('data-flow-tab'));
          await tab.click();
          const panel = root.locator(`[data-test="flow-panel"][data-flow-panel="${id}"]`);
          // First step (current node) and last step (success or failure node).
          for (const state of ['first', 'last'] as const) {
            await panel.getByTestId('flow-step-dot')[state]().click();
            for (const s of await walkthroughText(page)) {
              const ratio = contrastRatio(s.fg, s.bg);
              const line = `${theme.padEnd(5)} ${id.padEnd(12)} ${state.padEnd(5)} ${s.fg} on ${s.bg} ${ratio.toFixed(2)}:1  ${s.label}`;
              rows.push(line);
              if (ratio < AA) failures.push(line);
            }
          }
        }
      }
    }
  }
  await test.info().attach('walkthrough-contrast.txt', {
    body: rows.join('\n') || 'no walkthrough',
    contentType: 'text/plain',
  });
  if (roots) expect(rows.length).toBeGreaterThan(0);
  expect(failures, failures.join('\n')).toEqual([]);
});

// Gradient buttons: the solid background-color under the gradient is only a fallback, so measure the text
// against every color stop of the gradient that is actually rendered, at rest and on hover.
const GRADIENT_BUTTONS = ['cta-read-series', 'project-deep-dive', 'flow-play'];

test('gradient buttons meet WCAG AA at every color stop in both themes', async ({ page }, testInfo) => {
  await page.goto(routes(testInfo)[0]);
  const rows: string[] = [];
  const failures: string[] = [];
  for (const theme of THEMES) {
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    for (const id of GRADIENT_BUTTONS) {
      const button = page.getByTestId(id).first();
      if (!(await button.count()) || !(await button.isVisible())) continue;
      for (const state of ['rest', 'hover'] as const) {
        await button.scrollIntoViewIfNeeded();
        if (state === 'hover') await button.hover();
        else await page.mouse.move(0, 0);
        const { color, stops } = await button.evaluate(async (el) => {
          // Read the settled colors, not a frame in the middle of the theme or hover transition.
          await Promise.all(el.getAnimations().map((animation) => animation.finished));
          const toHex = (rgb: string) =>
            `#${(rgb.match(/\d+(\.\d+)?/g) ?? [])
              .slice(0, 3)
              .map((n) => Math.round(Number(n)).toString(16).padStart(2, '0'))
              .join('')}`;
          const style = getComputedStyle(el);
          return {
            color: toHex(style.color),
            stops: (style.backgroundImage.match(/rgba?\([^)]*\)/g) ?? []).map(toHex),
          };
        });
        expect(stops.length, `${id} (${theme}, ${state}) has no gradient`).toBeGreaterThan(1);
        for (const stop of stops) {
          const ratio = contrastRatio(color, stop);
          const line = `${theme.padEnd(5)} ${id.padEnd(17)} ${state.padEnd(5)} ${color} on ${stop} ${ratio.toFixed(2)}:1`;
          rows.push(line);
          if (ratio < AA) failures.push(line);
        }
      }
    }
  }
  await test.info().attach('gradient-contrast.txt', { body: rows.join('\n'), contentType: 'text/plain' });
  expect(rows.length, 'no gradient button found on the page').toBeGreaterThan(0);
  expect(failures, failures.join('\n')).toEqual([]);
});

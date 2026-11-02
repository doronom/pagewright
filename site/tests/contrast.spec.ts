import { test, expect } from '@playwright/test';
import { contrastRatio } from './helpers';

// WCAG AA for normal text is 4.5:1. Checks the token values the built CSS actually ships.
const AA = 4.5;
const FOREGROUNDS = ['--text', '--text-muted', '--text-faint', '--primary'];
const BACKGROUNDS = ['--bg', '--surface-lowest', '--surface-low', '--surface'];

test('text tokens meet WCAG AA in both themes', async ({ page }) => {
  await page.goto('');
  const rows: string[] = [];
  const failures: string[] = [];
  for (const theme of ['dark', 'light'] as const) {
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

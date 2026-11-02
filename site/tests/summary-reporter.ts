import fs from 'node:fs';
import path from 'node:path';
import type { FullResult, Reporter, Suite } from '@playwright/test/reporter';

// Writes src/data/test-summary.json after a full run (`npm test` sets SITE_WRITE_TEST_SUMMARY=1;
// ad-hoc `npx playwright test <file>` runs do not overwrite it). The next build reads it to show
// the header badge, the Home telemetry strip, the footer test line and the Testing page numbers.
export default class SummaryReporter implements Reporter {
  private suite?: Suite;

  onBegin(_config: unknown, suite: Suite): void {
    this.suite = suite;
  }

  onEnd(result: FullResult): void {
    if (process.env.SITE_WRITE_TEST_SUMMARY !== '1') return;
    const tests = this.suite?.allTests() ?? [];
    const count = (outcome: string) => tests.filter((t) => t.outcome() === outcome).length;
    const summary = {
      passed: count('expected'),
      failed: count('unexpected'),
      flaky: count('flaky'),
      skipped: count('skipped'),
      total: tests.length,
      durationMs: Math.round(result.duration),
      date: result.startTime.toISOString(),
    };
    const file = path.resolve('src/data/test-summary.json');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, `${JSON.stringify(summary, null, 2)}\n`);
  }
}

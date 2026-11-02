import fs from 'node:fs';
import path from 'node:path';

export interface TestSummary {
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  total: number;
  durationMs: number;
  date: string;
}

export const TEST_SUMMARY_PATH = 'src/data/test-summary.json';

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

/**
 * Returns the summary written by the site's own Playwright run, or null when it does not exist.
 * Components that show test numbers render nothing when this returns null.
 */
export function loadTestSummary(): TestSummary | null {
  const file = path.join(__SITE_ROOT__, TEST_SUMMARY_PATH);
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file, 'utf8')) as Partial<TestSummary>;
  const { passed, failed, skipped, flaky, total, durationMs, date } = data;
  if (
    ![passed, failed, skipped, flaky, total, durationMs].every(isNumber) ||
    typeof date !== 'string' ||
    Number.isNaN(Date.parse(date))
  ) {
    throw new Error(`${TEST_SUMMARY_PATH} is malformed; delete it or rerun the site tests`);
  }
  return data as TestSummary;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${Math.round(seconds % 60)}s`;
}

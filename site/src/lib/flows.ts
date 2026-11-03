import fs from 'node:fs';
import path from 'node:path';

/** Extensions whose files a step may quote with `code`. Anything else (folders, Markdown, images) may not. */
const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.yml', '.yaml', '.sh']);

export interface FlowSourceStep {
  where?: string;
  code?: string;
}

export interface FlowSource {
  id: string;
  steps: FlowSourceStep[];
}

const squash = (text: string) => text.replace(/\s+/g, '');

/**
 * Checks a walkthrough's steps against the repository at build time, the way RepoCode's `match` does:
 * every `where` must exist, every `code` must appear in its `where` file (ignoring whitespace), and a
 * `where` that is a folder or a non-code file is only allowed on a step without `code`.
 * Throws, and so fails the build, on the first problem.
 */
export function validateFlowSources(setId: string, flows: FlowSource[]): void {
  for (const flow of flows) {
    flow.steps.forEach((step, index) => {
      if (!step.where) return;
      const context = `FlowWalkthrough "${setId}/${flow.id}" step ${index + 1}`;
      if (path.isAbsolute(step.where)) {
        throw new Error(`${context}: where must be relative to the repository root (got ${step.where})`);
      }
      const absolute = path.resolve(__REPO_ROOT__, step.where);
      if (absolute !== __REPO_ROOT__ && !absolute.startsWith(__REPO_ROOT__ + path.sep)) {
        throw new Error(`${context}: ${step.where} resolves outside the repository`);
      }
      if (!fs.existsSync(absolute)) {
        throw new Error(`${context}: ${step.where} does not exist`);
      }
      if (step.code === undefined) return;
      const isCodeFile = fs.statSync(absolute).isFile() && CODE_EXTENSIONS.has(path.extname(absolute));
      if (!isCodeFile) {
        throw new Error(`${context}: ${step.where} is a folder or a non-code file, so the step cannot quote code`);
      }
      if (!squash(fs.readFileSync(absolute, 'utf8')).includes(squash(step.code))) {
        throw new Error(`${context}: ${step.where} does not contain "${step.code}"`);
      }
    });
  }
}

import fs from 'node:fs';
import path from 'node:path';
import { site } from '../config/site';
import { parseLineList } from './shiki';

export interface RepoSnippet {
  file: string;
  code: string;
  startLine: number;
  endLine: number;
  totalLines: number;
  lang: string;
  url: string;
}

const LANGS: Record<string, string> = {
  ts: 'ts',
  tsx: 'tsx',
  js: 'js',
  mjs: 'js',
  cjs: 'js',
  json: 'json',
  yml: 'yaml',
  yaml: 'yaml',
  md: 'md',
  sh: 'bash',
};

/**
 * Reads a file (or a line range) from the repository at build time.
 * Throws, and so fails the build, when the file or the range does not exist.
 */
export function readRepoLines(file: string, lines?: string): RepoSnippet {
  const context = `RepoCode file="${file}"${lines ? ` lines="${lines}"` : ''}`;
  if (path.isAbsolute(file)) {
    throw new Error(`${context}: path must be relative to the repository root`);
  }
  const absolute = path.resolve(__REPO_ROOT__, file);
  if (!absolute.startsWith(__REPO_ROOT__ + path.sep)) {
    throw new Error(`${context}: path resolves outside the repository`);
  }
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    throw new Error(`${context}: file not found (looked for ${absolute})`);
  }

  const all = fs.readFileSync(absolute, 'utf8').replace(/\r\n/g, '\n').replace(/\n$/, '').split('\n');
  let startLine = 1;
  let endLine = all.length;
  if (lines !== undefined) {
    const match = /^\s*(\d+)\s*(?:-\s*(\d+))?\s*$/.exec(lines);
    if (!match) {
      throw new Error(`${context}: lines must be "N" or "N-M"`);
    }
    startLine = Number(match[1]);
    endLine = match[2] ? Number(match[2]) : startLine;
    if (startLine < 1 || endLine < startLine) {
      throw new Error(`${context}: invalid range`);
    }
    if (endLine > all.length) {
      throw new Error(`${context}: file has ${all.length} lines, requested ${startLine}-${endLine}`);
    }
  }

  const relative = path.relative(__REPO_ROOT__, absolute).split(path.sep).join('/');
  const ext = path.extname(relative).slice(1);
  return {
    file: relative,
    code: all.slice(startLine - 1, endLine).join('\n'),
    startLine,
    endLine,
    totalLines: all.length,
    lang: LANGS[ext] ?? 'text',
    url: githubUrl(relative, lines ? { startLine, endLine } : undefined),
  };
}

/**
 * Throws, and so fails the build, when `match` is set and the snippet does not contain it.
 * Catches a line range that no longer points at the code the article talks about.
 */
export function assertSnippetContains(snippet: RepoSnippet, match: string | undefined): void {
  if (match === undefined) return;
  if (snippet.code.includes(match)) return;
  const wholeFile = snippet.startLine === 1 && snippet.endLine === snippet.totalLines;
  const subject = wholeFile
    ? `${snippet.file} does`
    : snippet.startLine === snippet.endLine
      ? `${snippet.file} line ${snippet.startLine} does`
      : `${snippet.file} lines ${snippet.startLine}-${snippet.endLine} do`;
  throw new Error(`RepoCode: ${subject} not contain "${match}"`);
}

export function validateHighlight(spec: string | undefined, snippet: RepoSnippet): number[] {
  if (!spec) return [];
  const context = `RepoCode file="${snippet.file}" highlight="${spec}"`;
  const lines = parseLineList(spec, context);
  const outside = lines.filter((n) => n < snippet.startLine || n > snippet.endLine);
  if (outside.length) {
    throw new Error(
      `${context}: lines ${outside.join(', ')} are outside ${snippet.startLine}-${snippet.endLine}`,
    );
  }
  return lines;
}

export function githubUrl(file: string, range?: { startLine: number; endLine: number }): string {
  const base = `${site.repoUrl}/blob/${site.repoBranch}/${file}`;
  if (!range) return base;
  return range.startLine === range.endLine
    ? `${base}#L${range.startLine}`
    : `${base}#L${range.startLine}-L${range.endLine}`;
}

export function githubTreeUrl(dir: string): string {
  return `${site.repoUrl}/tree/${site.repoBranch}/${dir}`;
}

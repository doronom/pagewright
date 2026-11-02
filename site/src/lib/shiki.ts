import type { ShikiTransformer } from 'shiki';

export interface CodeOptions {
  /** Number shown for the first line. */
  startLine?: number;
  /** Absolute line numbers (as shown in the gutter) to highlight. */
  highlight?: number[];
}

/** Parses "3,5-7" into [3, 5, 6, 7]. Throws on malformed input. */
export function parseLineList(spec: string, context: string): number[] {
  const result: number[] = [];
  for (const part of spec.split(',').map((p) => p.trim()).filter(Boolean)) {
    const match = /^(\d+)(?:-(\d+))?$/.exec(part);
    if (!match) {
      throw new Error(`${context}: invalid line spec "${part}" (expected N or N-M)`);
    }
    const from = Number(match[1]);
    const to = match[2] ? Number(match[2]) : from;
    if (to < from) {
      throw new Error(`${context}: invalid line range "${part}" (end before start)`);
    }
    for (let n = from; n <= to; n++) result.push(n);
  }
  return result;
}

function metaValue(meta: string, key: string): string | undefined {
  const match = new RegExp(`${key}=(?:"([^"]*)"|'([^']*)'|(\\S+))`).exec(meta);
  return match ? (match[1] ?? match[2] ?? match[3]) : undefined;
}

/**
 * Adds line numbers (data-line), line highlighting and a data-file attribute.
 * Fenced Markdown blocks take their settings from the meta string:
 *   ```ts title="core/env.ts" {3-5} startLine=10
 */
export function codeTransformers(options: CodeOptions = {}): ShikiTransformer[] {
  return [
    {
      name: 'site-code',
      pre(node) {
        const meta = this.options.meta?.__raw ?? '';
        const title = metaValue(meta, 'title');
        if (title) node.properties['data-file'] = title;
        const classes = String(node.properties.class ?? '');
        node.properties.class = `${classes} code-lines`.trim();
      },
      line(node, line) {
        const meta = this.options.meta?.__raw ?? '';
        const start = options.startLine ?? Number(metaValue(meta, 'startLine') ?? 1);
        const highlightSpec = /\{([\d,\s-]+)\}/.exec(meta)?.[1];
        const highlight = options.highlight ?? (highlightSpec ? parseLineList(highlightSpec, 'code block') : []);
        const number = start + line - 1;
        node.properties['data-line'] = String(number);
        if (highlight.includes(number)) {
          this.addClassToHast(node, 'highlighted');
        }
      },
    },
  ];
}

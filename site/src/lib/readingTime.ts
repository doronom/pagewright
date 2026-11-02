const WORDS_PER_MINUTE = 230;

/** Estimates reading time in minutes from raw MDX: code, imports and JSX tags are not counted. */
export function readingMinutes(body: string | undefined): number {
  if (!body) return 1;
  const prose = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s*(import|export)\s.*$/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`[\]()|-]/g, ' ');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

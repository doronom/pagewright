import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { readingMinutes } from './readingTime';
import { slugify } from './format';

export type Article = CollectionEntry<'articles'>;
export type Series = CollectionEntry<'series'>;
export type Project = CollectionEntry<'projects'>;

const RESERVED_SLUGS = new Set(['page', 'type']);

/** Drafts render in dev and in the drafts-included test build, never in the production build. */
export const includeDrafts = import.meta.env.DEV || __INCLUDE_DRAFTS__;

let cache: Promise<Article[]> | undefined;

/** Published articles, newest first. Also validates series references once per build. */
export function getArticles(): Promise<Article[]> {
  cache ??= (async () => {
    const all = await getCollection('articles', ({ data }) => includeDrafts || !data.draft);
    for (const article of all) {
      if (RESERVED_SLUGS.has(article.id)) {
        throw new Error(`Article slug "${article.id}" is reserved; rename the file`);
      }
    }
    await validateSeriesParts(all);
    return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  })();
  return cache;
}

async function validateSeriesParts(articles: Article[]): Promise<void> {
  const seen = new Map<string, string>();
  for (const article of articles) {
    const ref = article.data.series;
    if (!ref) continue;
    const series = await getEntry(ref);
    if (!series) {
      throw new Error(`Article "${article.id}" references unknown series "${ref.id}"`);
    }
    const part = article.data.seriesPart!;
    if (!series.data.parts.some((p) => p.part === part)) {
      throw new Error(
        `Article "${article.id}" is part ${part} of "${ref.id}", which plans ${series.data.plannedParts} parts`,
      );
    }
    const key = `${ref.id}#${part}`;
    if (seen.has(key)) {
      throw new Error(`Articles "${seen.get(key)}" and "${article.id}" both claim ${key}`);
    }
    seen.set(key, article.id);
  }
}

export function minutesFor(article: Article): number {
  return readingMinutes(article.body);
}

export interface TagInfo {
  name: string;
  slug: string;
  count: number;
}

export async function getTags(): Promise<TagInfo[]> {
  const counts = new Map<string, TagInfo>();
  for (const article of await getArticles()) {
    for (const name of article.data.tags) {
      const slug = slugify(name);
      const info = counts.get(slug) ?? { name, slug, count: 0 };
      info.count++;
      counts.set(slug, info);
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function getTypes(): Promise<{ type: Article['data']['type']; count: number }[]> {
  const counts = new Map<Article['data']['type'], number>();
  for (const article of await getArticles()) {
    counts.set(article.data.type, (counts.get(article.data.type) ?? 0) + 1);
  }
  return [...counts.entries()].map(([type, count]) => ({ type, count }));
}

export interface PartStatus {
  part: number;
  title: string;
  summary: string;
  article?: Article;
}

export interface SeriesStatus {
  series: Series;
  parts: PartStatus[];
  published: number;
  latestDate?: Date;
}

export async function getSeriesStatus(series: Series): Promise<SeriesStatus> {
  const articles = await getArticles();
  const parts = series.data.parts.map((p) => ({
    ...p,
    article: articles.find((a) => a.data.series?.id === series.id && a.data.seriesPart === p.part),
  }));
  const dates = parts.flatMap((p) => (p.article ? [p.article.data.date] : []));
  return {
    series,
    parts,
    published: dates.length,
    latestDate: dates.length ? new Date(Math.max(...dates.map((d) => d.valueOf()))) : undefined,
  };
}

/** All series with status, ordered by their most recent published part (unpublished last). */
export async function getAllSeriesStatus(): Promise<SeriesStatus[]> {
  const all = await getCollection('series');
  const statuses = await Promise.all(all.map(getSeriesStatus));
  return statuses.sort((a, b) => (b.latestDate?.valueOf() ?? 0) - (a.latestDate?.valueOf() ?? 0));
}

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || a.data.title.localeCompare(b.data.title));
}

/** The series that references a project, used for the project's "Deep dive" link. */
export async function seriesForProject(project: Project): Promise<Series | undefined> {
  const all = await getCollection('series');
  return all.find((s) => s.data.project?.id === project.id);
}

/** Same series first (nearest part), then most shared tags, then newest. */
export async function getRelated(article: Article, limit = 3): Promise<Article[]> {
  const others = (await getArticles()).filter((a) => a.id !== article.id);
  const tags = new Set(article.data.tags.map(slugify));
  const score = (a: Article) => {
    const sameSeries = article.data.series && a.data.series?.id === article.data.series.id;
    const distance = sameSeries ? Math.abs((a.data.seriesPart ?? 0) - (article.data.seriesPart ?? 0)) : 0;
    const shared = a.data.tags.filter((t) => tags.has(slugify(t))).length;
    return { sameSeries: sameSeries ? 1 : 0, distance, shared };
  };
  return others
    .map((a) => ({ a, s: score(a) }))
    .filter(({ s }) => s.sameSeries || s.shared > 0)
    .sort(
      (x, y) =>
        y.s.sameSeries - x.s.sameSeries ||
        x.s.distance - y.s.distance ||
        y.s.shared - x.s.shared ||
        y.a.data.date.valueOf() - x.a.data.date.valueOf(),
    )
    .slice(0, limit)
    .map(({ a }) => a);
}

export async function getPage(id: string) {
  const page = await getEntry('pages', id);
  if (!page) throw new Error(`Missing content file src/content/pages/${id}.(yaml|mdx)`);
  return page;
}

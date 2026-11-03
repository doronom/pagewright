import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../config/site';
import { getArticles } from '../lib/content';
import { href } from '../lib/url';

export async function GET(context: APIContext) {
  const articles = await getArticles();
  return rss({
    title: site.title,
    description: site.description,
    // The channel link is the site's home page, including the base path (context.site is only the origin).
    site: new URL(href('/'), context.site ?? site.url).toString(),
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.date,
      link: href(`/articles/${article.id}/`),
      categories: article.data.tags,
    })),
  });
}

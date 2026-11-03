// Single source for site-wide settings. Values marked PLACEHOLDER must be replaced.
// SITE_URL, SITE_BASE, REPO_URL and REPO_BRANCH environment variables override the defaults
// (the deploy workflow sets SITE_URL and SITE_BASE from actions/configure-pages).

const env = typeof process !== 'undefined' ? process.env : {};

function normalizeBase(base: string): string {
  const trimmed = base.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}` : '/';
}

export const site = {
  /** Author and site name shown in the header, footer and metadata. */
  name: 'Doron Omer',
  /** Default <title> suffix and RSS title. */
  title: 'Doron Omer',
  /** Default meta description. PLACEHOLDER */
  description: 'PLACEHOLDER: technical articles on test automation architecture.',
  /** Origin the site is deployed to, without the base path. */
  url: env.SITE_URL || 'https://doronom.github.io',
  /** Base path, e.g. "/pagewright" for a GitHub project page, "/" for a custom domain. */
  base: normalizeBase(env.SITE_BASE || '/pagewright'),
  /** Repository used by RepoCode and the Testing page links. */
  repoUrl: (env.REPO_URL || 'https://github.com/doronom/pagewright').replace(/\/+$/, ''),
  repoBranch: env.REPO_BRANCH || 'main',
  /** Footer and About links. */
  links: {
    github: 'https://github.com/doronom',
    linkedin: 'https://www.linkedin.com/in/doron-omer-63b14b11/',
    email: 'Doron.omer@gmail.com',
  },
  articlesPerPage: 10,
};

export type SiteConfig = typeof site;

import { href } from './url';

export function articlePageUrl(page: number): string {
  return page <= 1 ? href('/articles/') : href(`/articles/page/${page}/`);
}

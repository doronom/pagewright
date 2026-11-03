const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Prefixes an internal path with the configured base path. */
export function href(pathname: string): string {
  if (/^[a-z]+:/i.test(pathname) || pathname.startsWith('#')) return pathname;
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${clean}`;
}

/** Strips the base path, so "/pagewright/articles/" becomes "/articles/". */
export function stripBase(pathname: string): string {
  return base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
}

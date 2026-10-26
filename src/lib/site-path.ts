/** Prefix an internal route or public asset with Astro's configured base path. */
export function withBase(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path)) return path;

  const base = import.meta.env.BASE_URL;
  const cleanPath = path.replace(/^\/+/, '');
  const cleanBase = base.replace(/^\/+/, '');
  const relativePath = cleanBase && cleanPath.startsWith(cleanBase)
    ? cleanPath.slice(cleanBase.length)
    : cleanPath;

  return `${base}${relativePath}`;
}

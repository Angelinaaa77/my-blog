import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Page = CollectionEntry<'pages'>;
export type RecentEntry = CollectionEntry<'recently'>;

/**
 * Drafts are visible while running `astro dev` and dropped from every
 * production output. `import.meta.env.DEV` is only true for the dev server,
 * so `astro build` never emits one.
 */
export const SHOW_DRAFTS = import.meta.env.DEV;

/**
 * Loads one page of the site. Returns `null` when the page is a draft and we
 * are building for production — callers turn that into a skipped route.
 */
export async function getPage(id: string): Promise<Page | null> {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Missing page: src/content/pages/${id}.md`);
  if (entry.data.draft && !SHOW_DRAFTS) return null;
  return entry;
}

/** Every page, drafts included only in dev, most recently revised first. */
export async function getPages(): Promise<Page[]> {
  const pages = await getCollection('pages', ({ data }) => SHOW_DRAFTS || !data.draft);
  return pages.sort((a, b) => b.data.updated.valueOf() - a.data.updated.valueOf());
}

/** Published pages only — used by RSS, which must never carry a draft. */
export async function getPublishedPages(): Promise<Page[]> {
  const pages = await getCollection('pages', ({ data }) => !data.draft);
  return pages.sort((a, b) => b.data.updated.valueOf() - a.data.updated.valueOf());
}

/**
 * Log entries, newest first. Entries sharing a date keep the order they appear
 * in the file.
 */
export async function getRecent(limit?: number): Promise<RecentEntry[]> {
  const entries = await getCollection('recently');
  entries.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.data.order - b.data.order,
  );
  return typeof limit === 'number' ? entries.slice(0, limit) : entries;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Compact form for the log, where the date is a label rather than a sentence. */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * getStaticPaths body for a section that lives at a fixed URL.
 *
 * A plain `index.astro` is always written out, and returning a 404 from it
 * just makes Astro write its own 404 page to that path. A rest route with a
 * single `undefined` param renders at exactly the same URL but goes through
 * getStaticPaths, so returning an empty array removes the page from the build
 * — and therefore from the sitemap — when it is a draft.
 */
export async function sectionPaths(id: string) {
  const page = await getPage(id);
  return page ? [{ params: { slug: undefined }, props: { page } }] : [];
}

/**
 * Nav entries, in the order set by NAV_ORDER. A draft is dropped from the nav
 * in production for the same reason its page is dropped from the build — the
 * link would go nowhere — and is marked rather than hidden in dev.
 */
export async function getNavItems(order: readonly string[]) {
  const available = new Map((await getPages()).map((page) => [page.id, page]));
  return order.flatMap((id) => {
    const page = available.get(id);
    return page
      ? [{ href: `/${id}`, label: page.data.title, draft: page.data.draft }]
      : [];
  });
}

export type Book = CollectionEntry<'library' | 'antilibrary'>;

/** One shelf of books, in the order they appear in src/data/books.json. */
export async function getShelf(name: 'library' | 'antilibrary'): Promise<Book[]> {
  const books = await getCollection(name);
  return books.sort((a, b) => a.data.order - b.data.order);
}

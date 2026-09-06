import rss from '@astrojs/rss';
import { getPublishedPages, getRecent } from '../lib/content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../config';

/**
 * Nothing here is published in the usual sense, so the feed carries two kinds
 * of item: a page whenever it is revised (pubDate = its `updated` date), and
 * each entry in the Recently log. getPublishedPages() filters drafts
 * unconditionally, so the feed never carries one even in dev.
 */
export async function GET(context) {
  const pages = await getPublishedPages();
  const recent = await getRecent();

  const pageItems = pages.map((page) => ({
    title: `${page.data.title} (updated)`,
    description: page.data.description,
    pubDate: page.data.updated,
    // A page's collection id is its path: 'philosophy/library' -> /philosophy/library/
    link: `/${page.id}/`,
  }));

  const logItems = recent.map((entry) => ({
    title: `Recently — ${entry.data.date.toISOString().slice(0, 10)}`,
    description: (entry.body ?? '').replace(/\s+/g, ' ').trim(),
    pubDate: entry.data.date,
    link: `/otium/recently/#${entry.data.anchor}`,
  }));

  const items = [...pageItems, ...logItems].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf(),
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
  });
}

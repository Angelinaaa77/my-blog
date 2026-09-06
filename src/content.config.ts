import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { recentlyLog } from './lib/recently-loader';

/**
 * The long-lived pages of the site. These are revised rather than published,
 * so they carry `updated` instead of a publish date.
 */
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
    /** Full-bleed banner, served from `public/`. Only /existence uses one. */
    banner: z.string().optional(),
    bannerAlt: z.string().default(''),
    /** Displayed as an epigraph above the prose. */
    questions: z.array(z.string()).optional(),
  }),
});

/** The running log on /otium — one Markdown file, one entry per date heading. */
const recently = defineCollection({
  loader: recentlyLog('./src/content/recently.md'),
  schema: z.object({
    date: z.coerce.date(),
    anchor: z.string(),
    order: z.number(),
  }),
});

/**
 * Both shelves come from the single file src/data/books.json, so adding a book
 * is one entry in one place. The id is the cover filename without its
 * extension — unique by construction, since two books cannot share a file.
 */
const shelf = (key: 'library' | 'antilibrary') =>
  file('src/data/books.json', {
    parser: (text) =>
      (JSON.parse(text)[key] ?? []).map((book: Record<string, unknown>, index: number) => ({
        ...book,
        id: String(book.cover).replace(/\.[^.]+$/, ''),
        order: index,
      })),
  });

const bookSchema = z.object({
  title: z.string(),
  author: z.string(),
  /** Filename inside public/images/books/ */
  cover: z.string(),
  url: z.string().url(),
  /** Optional one-liner. Most books will not have one. */
  note: z.string().optional(),
  /** Position in books.json, so the page order matches the file order. */
  order: z.number(),
});

const library = defineCollection({ loader: shelf('library'), schema: bookSchema });
const antilibrary = defineCollection({ loader: shelf('antilibrary'), schema: bookSchema });

export const collections = { pages, recently, library, antilibrary };

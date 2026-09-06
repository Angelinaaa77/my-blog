# Personal site

A text-first Astro site of long-lived pages, revised rather than published.
Every page shows when it was last updated; there is no chronological feed.

## Commands

| Command           | Does                                              |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Dev server at `localhost:4321` (drafts visible)   |
| `npm run build`   | Production build to `./dist` (drafts excluded)    |
| `npm run preview` | Serve the production build locally                |

## Structure

| URL                | Source                            |
| ------------------ | --------------------------------- |
| `/` → `/existence` | redirect, set in `astro.config.mjs` |
| `/existence`       | `src/content/pages/existence.md`  |
| `/philosophy`      | `src/content/pages/philosophy.md` |
| `/philosophy/library`     | `src/content/pages/philosophy/library.md` + `src/data/books.json` |
| `/philosophy/antilibrary` | `src/content/pages/philosophy/antilibrary.md` + `src/data/books.json` |
| `/otium`           | `src/content/pages/otium.md` + the 10 newest log entries |
| `/otium/recently`  | the full log                      |
| `/rss.xml`         | page revisions + log entries      |

## Editing a page

Pages are Markdown in `src/content/pages/`. The filename is the URL.

```yaml
---
title: 'Philosophy'
description: 'One line — used for meta tags and the RSS item.'
updated: 2026-09-05 # shown as "Last updated"; also the RSS pubDate
draft: false # optional
---
```

Bump `updated` when you revise a page — that is what puts it back in the feed.

Two optional fields, currently only used by `/existence`:

```yaml
banner: '/images/banner.jpg' # full-bleed image, served from public/
bannerAlt: 'Description'
questions: # rendered as the page heading
  - 'Who am I?'
```

`/philosophy` builds its table of contents from its own `##` headings, so
adding a section adds a TOC entry and an anchor (`/philosophy#ethics`)
automatically. Slugs come from Astro's heading ids.

## Adding a book

Both shelves read from one file, `src/data/books.json`. Adding a book is one
entry under `library` or `antilibrary`:

```json
{
  "title": "Seeing Like a State",
  "author": "James C. Scott",
  "cover": "seeing-like-a-state.jpg",
  "url": "https://example.com/the-books-page",
  "note": "Optional. Most books will not have one."
}
```

Drop the cover into `public/images/books/` and use its filename. Order in the
file is the order on the page. The entry is schema-checked at build time, so a
missing field or a malformed URL fails the build rather than the page.

Covers are deliberately not forced to a common aspect ratio: each one is sized
by its own proportions inside a fixed 2:3 cell and sits on the cell's bottom
edge, so a square cover and a tall one line up along a shared baseline without
either being stretched or cropped.

Title and author are always in the markup inside the link — hover and focus
only change their opacity. That keeps them available to screen readers, and
`@media (hover: none)` leaves them permanently visible on touch devices.

The six seeded books are placeholders, covers included; their URLs point at
Open Library searches. Replace them.

## Adding a log entry

Open `src/content/recently.md`, add a date heading and a line or two:

```markdown
## 2026-09-06

Reread the Borges. Shorter than I remembered.
```

Position in the file does not matter — entries are sorted by date, newest
first. Several entries can share a date; each gets its own anchor
(`2026-09-06`, `2026-09-06-2`). The ten newest appear on `/otium`, all of them
on `/otium/recently`, and each one is an item in the feed.

The parser and loader are `src/lib/recently-loader.ts`.

## Drafts

Add `draft: true` to a page's front matter. In the dev server it renders with a
notice at the top, a **Draft** badge in the title, and an asterisk in the nav.
In `astro build` the route is not generated at all, so it is absent from the
site, the sitemap, the nav, the cross-page links and the RSS feed.

The mechanism is `getStaticPaths` returning an empty array — see
`sectionPaths()` in `src/lib/content.ts`. A plain `index.astro` cannot opt out
of being written, which is why each section is a rest route.

## Before deploying

- `astro.config.mjs` — set `site` to your real domain. RSS and the sitemap need
  it for absolute URLs.
- `public/robots.txt` — same domain.
- `src/config.ts` — site title, your name, email, social links, nav order, and
  how many log entries show on `/otium`. Everything you are likely to edit.
- `public/images/banner.jpg` — replace the placeholder. Roughly 2.7:1; it is
  centre-cropped on narrow viewports, so keep the subject near the middle.

## Footer

Site-wide, rendered by `src/components/Footer.astro` on every page: an RSS
invitation, a row of social icons, and the copyright line. It deliberately does
not repeat the nav — there are three sections and they are already in the
header.

The name, email and social links all come from `src/config.ts`. To change a
link, edit the `SOCIAL` array; to add a service, add an entry there and a
matching path in `src/components/SocialIcon.astro`. Each icon's `aria-label`
and `title` are built from the label plus the destination, so a screen reader
hears "GitHub, github.com/you" rather than "link", and hovering shows the same.

The icons are 24x24 single-path marks that inherit `currentColor`, so dark mode
and the hover state need no separate rules.

## Typography

All styling is `src/styles/global.css`, tokens at the top. Body is a system
serif stack at a ~65-character measure with 1.7 line height. Light and dark
palettes are the same token names redefined; the toggle writes `data-theme` on
`<html>` and an inline script resolves it before first paint.

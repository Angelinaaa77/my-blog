# Personal site

A text-first Astro site of long-lived pages, revised rather than published.
Every page shows when it was last updated; there is no chronological feed.

Live at **https://angelinaaa77.github.io/my-blog/**

## Commands

| Command           | Does                                            |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Dev server at `localhost:4321` (drafts visible) |
| `npm run build`   | Production build to `./dist` (drafts excluded)  |
| `npm run preview` | Serve the production build locally              |

## Structure

Pages are Markdown in `src/content/pages/` — the filename is the URL.
Site identity, links, and nav order live in `src/config.ts`.
Styling is in `src/styles/global.css`.

## Publishing

Push to `main` and the GitHub Actions workflow builds and deploys automatically.

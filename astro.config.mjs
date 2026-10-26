// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const deployingToGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: 'https://angelinaaa77.github.io',
  base: deployingToGitHubPages ? '/my-blog' : '/',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !['/', '/my-blog/'].includes(new URL(page).pathname),
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});

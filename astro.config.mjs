// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { irisDividerPlugin } from './src/lib/iris-divider-plugin.mjs';

// Change `site` to your real domain before deploying — RSS and the sitemap
// both need an absolute URL to generate correct links.
export default defineConfig({
  site: 'https://example.com',
  // /existence is the landing page. Static builds emit a meta-refresh here;
  // on a host that reads _redirects or vercel.json you can make it a real 301.
  redirects: {
    '/': '/existence',
  },
  integrations: [sitemap()],
  markdown: {
    // `---` in a page becomes the iris divider rather than a horizontal rule.
    processor: satteri({ hastPlugins: [irisDividerPlugin] }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});

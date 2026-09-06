// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});

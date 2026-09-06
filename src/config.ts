/**
 * Everything you are likely to want to edit lives here: who you are, what the
 * nav contains, and where the footer links point.
 */

export const SITE_TITLE = 'Your Name';
export const SITE_DESCRIPTION =
  'A personal site: where I come from, what I think, and what I have been paying attention to.';

/** Shown in the footer copyright line. */
export const AUTHOR = 'Your Name';

export const EMAIL = 'you@example.com';

/**
 * Nav order. Each id must match a file in src/content/pages/; a page that is a
 * draft in the current build drops out of the nav automatically.
 */
export const NAV_ORDER = ['existence', 'philosophy', 'otium'] as const;

/** How many log entries appear on /otium before the rest move to /otium/recently. */
export const RECENT_ON_OTIUM = 10;

/**
 * Footer social links. `label` names the service; the accessible name and the
 * hover title are built from it plus the destination, so a screen reader hears
 * "GitHub, github.com/you" rather than just "link".
 * `icon` must be one of the keys in src/components/SocialIcon.astro.
 */
export const SOCIAL = [
  { icon: 'github', label: 'GitHub', href: 'https://github.com/you' },
  { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/you' },
  { icon: 'twitter', label: 'Twitter', href: 'https://twitter.com/you' },
  { icon: 'email', label: 'Email', href: `mailto:${EMAIL}` },
] as const;

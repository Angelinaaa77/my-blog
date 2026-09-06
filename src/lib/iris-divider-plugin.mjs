import { IRIS, irisMarkup } from './iris.mjs';

/**
 * Replaces every <hr> in Markdown with the iris divider, so writing `---` in a
 * page gives the motif instead of a rule.
 *
 * The drawing comes from the shared module rather than a second copy of the
 * SVG, so replacing public/images/fleur-de-lis.svg changes this too.
 *
 * role="separator" keeps the thematic break an <hr> would have announced; the
 * drawing itself is aria-hidden, because the motif carries no information.
 */
const markup = () =>
  `<div class="iris-divider" role="separator">` +
  `<svg class="iris" viewBox="${IRIS.viewBox}" height="24" fill="currentColor" ` +
  `aria-hidden="true" focusable="false">${irisMarkup()}</svg>` +
  `</div>`;

/** A Sätteri hast plugin: Astro 7's default Markdown processor. */
export const irisDividerPlugin = {
  name: 'iris-divider',
  element: {
    filter: ['hr'],
    visit(node, ctx) {
      ctx.replaceNode(node, { type: 'raw', value: markup() });
    },
  },
};

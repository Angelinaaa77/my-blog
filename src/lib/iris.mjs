import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The iris motif — a fleur-de-lis, the heraldic stylisation of the iris.
 *
 * The drawing lives in exactly one place: public/images/fleur-de-lis.svg.
 * This module reads that file at build time and hands the geometry to its
 * three consumers — the Astro components, the Markdown plugin loaded from
 * astro.config.mjs, and the icon generator in scripts/. Replace the SVG and
 * every use follows; re-run `npm run icons` afterwards to rebuild the favicon
 * files, which are rasterised and so cannot update themselves.
 *
 * The file keeps its own metadata (including its C2PA manifest). Only the
 * geometry is inlined into pages — the metadata block is far larger than the
 * drawing and has no business in every HTML response.
 */
/**
 * Anchored on the project root rather than on import.meta.url: this module is
 * bundled into dist/ for the prerender pass, where a path relative to the
 * module would resolve to dist/public/... and fail. Walking up to the nearest
 * package.json is correct whether the module runs from src/, from dist/, or
 * from a plain `node scripts/...` process.
 */
function projectRoot() {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (;;) {
    if (existsSync(join(dir, 'package.json'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) throw new Error('Could not locate the project root from ' + import.meta.url);
    dir = parent;
  }
}

const SOURCE = join(projectRoot(), 'public', 'images', 'fleur-de-lis.svg');

function readDrawing() {
  const svg = readFileSync(SOURCE, 'utf-8');

  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error(`No viewBox in ${SOURCE}`);

  const paths = [...svg.matchAll(/<path\b[^>]*?\sd="([^"]+)"[^>]*>/g)].map((match) => ({
    d: match[1],
    // Preserved per path: on the <svg> it would also cancel wherever two
    // shapes overlap, which is not what an evenodd drawing means.
    evenOdd: /fill-rule="evenodd"/.test(match[0]),
  }));
  if (paths.length === 0) throw new Error(`No <path> found in ${SOURCE}`);

  return { viewBox, paths };
}

export const IRIS = readDrawing();

/**
 * Short digest of the drawing, appended to the favicon URLs.
 *
 * Browsers cache favicons hard — often past a normal reload — and a fixed URL
 * gives them no reason to refetch. Keying the URL to the file's contents means
 * a new drawing is a new URL, so the tab icon updates on its own instead of
 * needing the reader (or you) to clear anything.
 */
export const IRIS_VERSION = createHash('sha256')
  .update(readFileSync(SOURCE))
  .digest('hex')
  .slice(0, 8);

/** Muted navy. Light first, then the tint that stays visible on near-black. */
export const IRIS_COLOR = { light: '#1f2a5e', dark: '#96a4dc' };

/**
 * The inner markup of the drawing. Every consumer builds its SVG from this, so
 * none of them carries a second copy.
 */
export function irisMarkup() {
  return IRIS.paths
    .map(({ d, evenOdd }) => `<path d="${d}"${evenOdd ? ' fill-rule="evenodd"' : ''}/>`)
    .join('');
}

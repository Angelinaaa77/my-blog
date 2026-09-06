import type { Loader, LoaderContext } from 'astro/loaders';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ENTRY_HEADING = /^##[ \t]+(\d{4}-\d{2}-\d{2})[ \t]*$/gm;

interface RawEntry {
  date: string;
  anchor: string;
  order: number;
  body: string;
}

/**
 * Splits the log into entries. An entry starts at a `## YYYY-MM-DD` heading and
 * runs until the next one, so appending is a two-line edit anywhere in the file
 * — ordering comes from the dates, not from the position in the file.
 * Anything before the first heading (a title, a note to self) is ignored.
 */
export function parseRecently(raw: string): RawEntry[] {
  const entries: RawEntry[] = [];
  const seen = new Map<string, number>();
  const matches = [...raw.matchAll(ENTRY_HEADING)];

  matches.forEach((match, i) => {
    const date = match[1];
    const start = match.index + match[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : raw.length;
    const body = raw.slice(start, end).trim();
    if (!body) return;

    // Several entries can share a date; the anchor gets a counter so every
    // entry stays individually linkable.
    const n = (seen.get(date) ?? 0) + 1;
    seen.set(date, n);

    entries.push({ date, anchor: n === 1 ? date : `${date}-${n}`, order: i, body });
  });

  return entries;
}

/**
 * Content-layer loader for the single-file "Recently" log.
 * `filePath` is relative to the project root.
 */
export function recentlyLog(filePath: string): Loader {
  return {
    name: 'recently-log',
    async load({ store, parseData, renderMarkdown, config, watcher, logger }: LoaderContext) {
      const fileURL = new URL(filePath, config.root);
      const absolute = fileURLToPath(fileURL);

      const sync = async () => {
        let raw: string;
        try {
          raw = await readFile(absolute, 'utf-8');
        } catch {
          logger.warn(`Recently log not found at ${filePath} — the log will be empty.`);
          store.clear();
          return;
        }

        const parsed = parseRecently(raw);
        store.clear();

        for (const entry of parsed) {
          const data = await parseData({
            id: entry.anchor,
            data: { date: entry.date, anchor: entry.anchor, order: entry.order },
            filePath,
          });
          store.set({
            id: entry.anchor,
            data,
            body: entry.body,
            filePath,
            rendered: await renderMarkdown(entry.body, { fileURL }),
          });
        }

        logger.info(`Loaded ${parsed.length} entries from ${filePath}`);
      };

      await sync();

      // Dev only: re-read the log on save so a new entry shows up immediately.
      if (watcher) {
        watcher.add(absolute);
        watcher.on('change', async (changed) => {
          if (changed === absolute) await sync();
        });
      }
    },
  };
}

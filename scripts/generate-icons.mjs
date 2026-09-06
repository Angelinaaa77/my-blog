/**
 * Rebuilds the favicon files from the solid iris in src/lib/iris.mjs.
 *
 * The SVG favicon is written straight from the shared geometry; the raster
 * sizes are rendered by headless Chrome, which this script starts and stops
 * itself. Run it with `npm run icons` after changing the drawing — the
 * rasters are the one place the motif cannot update itself.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { IRIS, IRIS_COLOR, IRIS_VERSION, irisMarkup } from '../src/lib/iris.mjs';

const PORT = 9455;
const OUT = 'public';
const SITE_NAME = 'Your Name';
const CHROME =
  process.env.CHROME_PATH ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const paths = irisMarkup();

/** Tab icon: follows the browser's theme the same way the site does. */
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${IRIS.viewBox}">
  <style>
    path { fill: ${IRIS_COLOR.light} }
    @media (prefers-color-scheme: dark) { path { fill: ${IRIS_COLOR.dark} } }
  </style>
  ${paths}
</svg>
`;

/** A page rendering the iris at one size, for rasterising. */
const page = (size, bg, pad) => `<!doctype html><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;width:${size}px;height:${size}px;background:${bg}}
  body{display:flex;align-items:center;justify-content:center}
  svg{display:block;height:${size - pad * 2}px;width:auto}
</style><svg xmlns="http://www.w3.org/2000/svg" viewBox="${IRIS.viewBox}" fill="${IRIS_COLOR.light}">${paths}</svg>`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function session(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
    }
  });
  const ready = new Promise((r) => ws.addEventListener('open', r));
  return {
    ready,
    send: (method, params = {}) =>
      new Promise((resolve, reject) => {
        const i = ++id;
        pending.set(i, { resolve, reject });
        ws.send(JSON.stringify({ id: i, method, params }));
      }),
  };
}

/** ICO container holding PNGs — accepted by every browser that still reads .ico. */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const profile = join(tmpdir(), `iris-icons-${process.pid}`);
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    '--no-default-browser-check',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

const shutdown = async () => {
  chrome.kill();
  // Chrome finishes writing its profile after the signal; removing it too
  // eagerly throws ENOTEMPTY. A failed cleanup must never fail the build.
  await sleep(400);
  try {
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {}
};

try {
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'favicon.svg'), faviconSvg);
  console.log('favicon.svg');

  // Wait for the debugging endpoint rather than guessing at a delay.
  let target;
  for (let i = 0; i < 40; i++) {
    try {
      target = await (
        await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })
      ).json();
      break;
    } catch {
      await sleep(250);
    }
  }
  if (!target) throw new Error(`Chrome did not expose a debugging port on ${PORT}`);

  const s = session(target.webSocketDebuggerUrl);
  await s.ready;
  await s.send('Page.enable');

  const tmpPage = join(profile, 'icon.html');
  const shoot = async (size, bg, pad) => {
    writeFileSync(tmpPage, page(size, bg, pad));
    await s.send('Emulation.setDeviceMetricsOverride', {
      width: size,
      height: size,
      deviceScaleFactor: 1,
      mobile: false,
    });
    // Chrome paints an opaque page background by default, which would flatten
    // the icon onto white. Overriding it with a zero-alpha colour is what
    // makes captureScreenshot emit RGBA rather than RGB.
    if (bg === 'transparent') {
      await s.send('Emulation.setDefaultBackgroundColorOverride', {
        color: { r: 0, g: 0, b: 0, a: 0 },
      });
    } else {
      await s.send('Emulation.setDefaultBackgroundColorOverride');
    }
    await s.send('Page.navigate', { url: `${pathToFileURL(tmpPage).href}?v=${size}-${bg}` });
    await sleep(500);
    const { data } = await s.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });
    return Buffer.from(data, 'base64');
  };

  // Transparent for the tab icon; opaque for the home-screen icon, which is
  // composited onto whatever wallpaper is behind it.
  const ico = [];
  for (const size of [16, 32, 48]) {
    ico.push({ size, data: await shoot(size, 'transparent', 0) });
    console.log(`  raster ${size}x${size}`);
  }
  writeFileSync(join(OUT, 'favicon.ico'), buildIco(ico));
  console.log('favicon.ico (16, 32, 48)');

  // iOS composites this onto a home screen, so it needs an opaque ground.
  writeFileSync(join(OUT, 'apple-touch-icon.png'), await shoot(180, '#ffffff', 22));
  console.log('apple-touch-icon.png (180, padded on white)');

  // Android / installed-PWA sizes, referenced from site.webmanifest.
  for (const size of [192, 512]) {
    writeFileSync(join(OUT, `icon-${size}.png`), await shoot(size, 'transparent', Math.round(size * 0.1)));
    console.log(`icon-${size}.png`);
  }

  writeFileSync(
    join(OUT, 'site.webmanifest'),
    `${JSON.stringify(
      {
        name: SITE_NAME,
        short_name: SITE_NAME,
        icons: [
          { src: `/icon-192.png?v=${IRIS_VERSION}`, sizes: '192x192', type: 'image/png' },
          { src: `/icon-512.png?v=${IRIS_VERSION}`, sizes: '512x512', type: 'image/png' },
        ],
        display: 'browser',
      },
      null,
      2,
    )}\n`,
  );
  console.log('site.webmanifest');

  // Astro caches rendered Markdown keyed by the source file, not by the plugin
  // that transformed it — so a changed drawing leaves stale dividers in the
  // build until this is dropped. Clearing it here keeps "change the drawing,
  // run npm run icons" a complete instruction.
  for (const dir of ['.astro', 'node_modules/.astro']) {
    rmSync(dir, { recursive: true, force: true });
  }
  console.log('cleared the Markdown cache (stale dividers otherwise survive a rebuild)');
} finally {
  await shutdown();
}

/* brand-assets.mjs: the favicon set and the share image, drawn in code
   (2026-09-25, the founder's release-audit addendum, items 11 and 12).

     node .measure/brand-assets.mjs

   Writes to public/:
   - icon.svg             the V mark in machine yellow on the base colour
   - favicon.ico          16 and 32, each rendered from icon.svg at its size
   - apple-touch-icon.png 180, the same drawing
   - og.jpg               1200 x 630, JPEG quality 85

   THE MARK is the path Wordmark.jsx ships, on its 0 0 100 100 box, scaled to
   80% and centred on a full-bleed base square. Nothing is traced.

   THE SHARE IMAGE is an HTML frame rendered by Chrome: the page's neutral
   drift (base, #101012 at the middle, base), the wordmark in Clash Display
   Medium 96px bone with its machine yellow period (Plate 00), the founder's
   line under it in Clash Display Medium 32px machine yellow, and the site's
   grain at 3%. The fonts are the site's own files. Re-run after a change to
   the mark, the colours or the line; the outputs are committed. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const BASE = '#0b0b0d';
const MID = '#101012';
const YELLOW = '#f0b323';
const BONE = '#e8eaed';
const MARK = 'M7 33 29 25 50 60 78 6 94 2 54 93Z';
const LINE = 'Websites $700 flat. Live in four business days.';

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${BASE}"/><path transform="translate(10 10) scale(0.8)" d="${MARK}" fill="${YELLOW}"/></svg>\n`;
fs.writeFileSync(path.join(PUB, 'icon.svg'), iconSvg);

/* The grain, as tokens.css defines it. */
const GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
const clash = pathToFileURL(path.join(ROOT, 'src/assets/fonts/clash-display-variable.woff2')).href;

const b = await puppeteer.launch({ headless: 'new', args: ['--force-color-profile=srgb', '--allow-file-access-from-files'] });
const p = await b.newPage();

async function png(size) {
  await p.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await p.setContent(`<html><body style="margin:0">${iconSvg.replace('<svg ', `<svg width="${size}" height="${size}" style="display:block" `)}</body></html>`);
  return p.screenshot({ type: 'png', clip: { x: 0, y: 0, width: size, height: size } });
}

const p16 = await png(16);
const p32 = await png(32);
fs.writeFileSync(path.join(PUB, 'apple-touch-icon.png'), await png(180));

/* ICO with PNG-encoded entries: a 6-byte header, a 16-byte entry per image,
   then the PNG data. */
function ico(images) {
  const head = Buffer.alloc(6 + 16 * images.length);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(size, e);
    head.writeUInt8(size, e + 1);
    head.writeUInt8(0, e + 2);
    head.writeUInt8(0, e + 3);
    head.writeUInt16LE(1, e + 4);
    head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(data.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...images.map((x) => x.data)]);
}
fs.writeFileSync(path.join(PUB, 'favicon.ico'), ico([{ size: 16, data: Buffer.from(p16) }, { size: 32, data: Buffer.from(p32) }]));

/* The share image. */
await p.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(path.join(ROOT, 'index.html')).href); // a file:// origin, so the font's file:// URL loads
await p.setContent(`<!doctype html><html><head><style>
  @font-face { font-family: 'Clash Display'; font-weight: 200 700; src: url('${clash}') format('woff2'); }
  html, body { margin: 0; width: 1200px; height: 630px; }
  body {
    position: relative;
    overflow: hidden;
    background: linear-gradient(to bottom, ${BASE} 0%, ${MID} 50%, ${BASE} 100%);
    font-family: 'Clash Display', sans-serif;
    font-weight: 500;
    display: grid;
    align-content: center;
    padding: 0 96px;
    box-sizing: border-box;
  }
  body::after { content: ''; position: absolute; inset: 0; background-image: ${GRAIN}; opacity: 0.03; pointer-events: none; }
  .wm { margin: 0; font-size: 96px; line-height: 1; letter-spacing: -0.02em; text-transform: uppercase; color: ${BONE}; }
  .wm span { color: ${YELLOW}; }
  .line { margin: 32px 0 0; font-size: 32px; line-height: 40px; letter-spacing: normal; color: ${YELLOW}; }
</style></head><body>
  <p class="wm">Vexeltech<span>.</span></p>
  <p class="line">${LINE}</p>
</body></html>`, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);
const face = await p.evaluate(() => document.fonts.check("500 96px 'Clash Display'"));
if (!face) throw new Error('Clash Display did not load; the share image would render in a fallback face.');
fs.writeFileSync(path.join(PUB, 'og.jpg'), await p.screenshot({ type: 'jpeg', quality: 85, clip: { x: 0, y: 0, width: 1200, height: 630 } }));
await b.close();

for (const f of ['icon.svg', 'favicon.ico', 'apple-touch-icon.png', 'og.jpg']) {
  console.log(f, fs.statSync(path.join(PUB, f)).size, 'bytes');
}

/* costolive.mjs — does any yellow in the founder's cost-1 to cost-4 read
   OLIVE once it is screened onto the drift in What it costs you?

   Each image is shot as rendered (DPR 2, so the 192px file is read at its own
   pixels), over the real ground, and every pixel is put in HSV. The yellow
   family is hue 30 to 75 degrees, saturation 0.35 and over, value 0.15 and
   over. Machine yellow #F0B323 is hue 42.1. A yellow pixel reads OLIVE when
   its hue has walked toward green, 50 degrees and over, and it is not a
   highlight (value under 0.75): olive itself is hue 60 at half value. A DARK
   yellow that keeps its hue (35 to 45) reads amber or brown, the shade on a
   lit object, not olive; the first cut of this check counted it and flagged
   cost-3's shaded outline and its fading reflection, which are hue 35 to 41.
   A pixel next to a bright yellow one (value 0.7 and over) is the drawing's
   anti-aliased EDGE and is counted apart. Olive that is not an edge is a
   fill, and more than 1% of the yellow as fill (and over 20px) fails.

     node .measure/costolive.mjs <base> [out-dir for 4x crops] */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import fs from 'fs';
const base = process.argv[2] || 'http://localhost:4173';
const outDir = process.argv[3];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const hsv = (r, g, b) => {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) h = mx === r ? 60 * (((g - b) / d) % 6) : mx === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
  if (h < 0) h += 360;
  return [h, mx ? d / mx : 0, mx / 255];
};
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
await p.goto(base + '/', { waitUntil: 'networkidle0' });
await p.evaluate(() => document.fonts.ready);
await p.evaluate(() => document.querySelector('.fail__items').scrollIntoView({ block: 'center' }));
await wait(2000);
const n = await p.evaluate(() => document.querySelectorAll('.fail__img img').length);
console.log(`${n} of 4 cost images mounted`);
let bad = 0;
for (let k = 0; k < n; k++) {
  const el = (await p.$$('.fail__img img'))[k];
  const src = await el.evaluate((e) => e.getAttribute('src'));
  const blend = await el.evaluate((e) => getComputedStyle(e).mixBlendMode);
  const buf = await el.screenshot();
  if (outDir) fs.writeFileSync(`${outDir}/${src.split('/').pop().replace('.webp', '')}-rendered.png`, buf);
  const png = PNG.sync.read(buf);
  const { width: W, height: H, data } = png;
  const at = (x, y) => { const i = (y * W + x) * 4; return hsv(data[i], data[i + 1], data[i + 2]); };
  let yellow = 0, olive = 0, edge = 0, hueSum = 0, black = 0;
  const corners = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const [h, s, v] = at(x, y);
    if ((x < 3 || x >= W - 3) && (y < 3 || y >= H - 3)) corners.push(data.slice((y * W + x) * 4, (y * W + x) * 4 + 3));
    if (v < 0.03) black++;
    if (!(h >= 30 && h <= 75 && s >= 0.35 && v >= 0.15)) continue;
    yellow++; hueSum += h;
    if (!(h >= 50 && v < 0.75)) continue;
    let nearBright = false;
    for (let dy = -1; dy <= 1 && !nearBright; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      const [h2, s2, v2] = at(xx, yy);
      if (h2 >= 30 && h2 <= 75 && s2 >= 0.35 && v2 >= 0.7) { nearBright = true; break; }
    }
    if (nearBright) edge++; else olive++;
  }
  const c = corners[0];
  const fill = yellow ? olive / yellow * 100 : 0;
  if (fill > 1 && olive > 20) bad++;
  console.log(`  ${src}  blend ${blend}  corner rgb(${[...c]}) (the ground, not black: ${c[0] + c[1] + c[2] > 0})`);
  console.log(`     yellow px ${yellow}, mean hue ${yellow ? (hueSum / yellow).toFixed(1) : '-'} (machine yellow 42.1)`);
  console.log(`     olive: ${olive} fill px (${fill.toFixed(2)}% of the yellow) ${fill > 1 && olive > 20 ? 'OLIVE' : 'ok'}, ${edge} edge px`);
}
await b.close();
console.log(bad ? `${bad} image(s) read olive` : 'no yellow reads olive');

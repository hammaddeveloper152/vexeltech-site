/* costseam.mjs — does a What it costs you image read PASTED? Its box must
   not show on the drift. For each image, as rendered at 1280, the 2px strip
   just INSIDE each side of the 96px box is compared with the 2px strip just
   OUTSIDE it, position by position (averaged over 4px runs so noise does
   not count). The worst step on any side, in 0-255 per channel, is the
   seam. Under 3 is invisible on this ground; 6 and over draws a square.

     node .measure/costseam.mjs <base> */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
const base = process.argv[2] || 'http://localhost:4173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 900 });
await p.goto(base + '/', { waitUntil: 'networkidle0' });
await p.evaluate(() => document.fonts.ready);
await p.evaluate(() => document.querySelector('.fail__items').scrollIntoView({ block: 'center' }));
await wait(2000);
const boxes = await p.evaluate(() => [...document.querySelectorAll('.fail__img img')].map((e) => { const r = e.getBoundingClientRect(); return { src: e.getAttribute('src'), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }; }));
const shot = PNG.sync.read(await p.screenshot());
const W = shot.width, d = shot.data;
const px = (x, y) => { const k = (y * W + x) * 4; return [d[k], d[k + 1], d[k + 2]]; };
const avg = (pts) => { const s = [0, 0, 0]; for (const q of pts) for (let c = 0; c < 3; c++) s[c] += q[c]; return s.map((v) => v / pts.length); };
let bad = 0;
for (const { src, x, y, w, h } of boxes) {
  const sides = {
    top: (t, o) => [x + t, o ? y - 1 - (t % 2) : y + (t % 2)],
    bottom: (t, o) => [x + t, o ? y + h + (t % 2) : y + h - 1 - (t % 2)],
    left: (t, o) => [o ? x - 1 - (t % 2) : x + (t % 2), y + t],
    right: (t, o) => [o ? x + w + (t % 2) : x + w - 1 - (t % 2), y + t],
  };
  const res = [];
  let worst = 0;
  for (const [name, f] of Object.entries(sides)) {
    const len = name === 'top' || name === 'bottom' ? w : h;
    let m = 0;
    for (let t = 0; t + 4 <= len; t += 4) {
      const inn = [], out = [];
      for (let k = 0; k < 4; k++) for (let j = 0; j < 2; j++) { inn.push(px(...f(t + k + j * 0, false))); out.push(px(...f(t + k, true))); }
      const a = avg(inn), c = avg(out);
      m = Math.max(m, ...a.map((v, i) => Math.abs(v - c[i])));
    }
    worst = Math.max(worst, m);
    res.push(`${name} ${m.toFixed(1)}`);
  }
  if (worst >= 3) bad++;
  console.log(`  ${src}  seam: ${res.join(', ')}  -> ${worst < 3 ? 'invisible' : worst < 6 ? 'faint' : 'SQUARE'}`);
}
await b.close();
console.log(bad ? `${bad} image(s) show their box` : 'no image shows its box');

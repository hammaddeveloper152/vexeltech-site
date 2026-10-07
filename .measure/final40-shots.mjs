/* final40-shots.mjs: the captures for final40 (2026-10-08, the founder).
   Full pages at rest (reduced motion), and The Next Size alone at 1024. Writes into .measure/out/final40/.
     node .measure/final40-shots.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final40');
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new' });
const open = async (route, w) => {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 25));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 200));
  return p;
};
for (const [route, name, w] of [
  ['/', 'home-390', 390],
  ['/', 'home-1280', 1280],
  ['/about-us', 'about-us-390', 390],
  ['/services', 'services-390', 390],
]) {
  const p = await open(route, w);
  await p.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  await p.close();
}
for (const w of [1024]) {
  const p = await open('/about-us', w);
  /* The sticky bar and the skip link stand over a cropped section. */
  await p.addStyleTag({ content: '.bar, .skip { visibility: hidden !important; }' });
  const el = await p.$('section.ns');
  await el.screenshot({ path: path.join(OUT, `about-nextsize-${w}.png`) });
  await p.close();
}
await b.close();
console.log('ok');

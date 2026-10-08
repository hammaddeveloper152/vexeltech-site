/* final41-shots.mjs: the captures for FINAL41 (2026-10-08, the founder).
   What we do's four cards at rest with the answers typed (reduced motion
   paints them filled), at 1280 and 390, and the footer at 1280 and 390.
   Writes into .measure/out/final41/.
     node .measure/final41-shots.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final41');
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new' });
for (const [sel, name, w] of [
  ['.wwd', 'wwd-1280', 1280],
  ['.wwd', 'wwd-390', 390],
  ['footer.sf', 'footer-1280', 1280],
  ['footer.sf', 'footer-390', 390],
]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: '.bar, .skip { visibility: hidden !important; }' });
  const el = await p.$(sel);
  await el.screenshot({ path: path.join(OUT, `${name}.png`) });
  await p.close();
}
await b.close();
console.log('ok');

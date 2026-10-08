/* final42-shots.mjs: the captures for FINAL42 (2026-10-08, the founder),
   full pages at rest (reduced motion): /services and /pricing at 390,
   /pricing at 1280, home at 390. Writes into .measure/out/final42/.
     node .measure/final42-shots.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final42');
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new' });
for (const [route, name, w] of [
  ['/services', 'services-390', 390],
  ['/pricing', 'pricing-390', 390],
  ['/pricing', 'pricing-1280', 1280],
  ['/', 'home-390', 390],
]) {
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
  await new Promise((r) => setTimeout(r, 300));
  await p.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  await p.close();
}
await b.close();
console.log('ok');

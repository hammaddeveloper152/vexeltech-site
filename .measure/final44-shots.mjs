/* final44-shots.mjs: the captures for FINAL44 (2026-10-09, the founder),
   full pages at rest (reduced motion): About at 1280 and 390, home and
   /services at 1280. Writes into .measure/out/final44/.
     node .measure/final44-shots.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final44');
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new' });
for (const [route, name, w, part] of [
  ['/about-us', 'about-us-1280', 1280],
  ['/about-us', 'about-us-390', 390],
  ['/', 'home-1280', 1280],
  ['/services', 'services-1280', 1280],
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
  if (part) {
    const el = await p.$(`section:has(${part})`);
    await el.screenshot({ path: path.join(OUT, `${name}.png`) });
  } else await p.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  await p.close();
}
await b.close();
console.log('ok');

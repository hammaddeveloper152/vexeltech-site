/* final34-shots.mjs: home's closing section (final34, 2026-10-08). Writes
   .measure/out/final34/home-tail-1280.png and home-tail-390.png, the closing
   section to the page's foot, at rest, and prints the section's height,
   its container width and the order of its parts.
     node .measure/final34-shots.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';
const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final34');
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new' });
for (const w of [1280, 390]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: '.bar,.skip{display:none!important}' });
  const m = await p.evaluate(() => {
    const s = document.querySelector('.tail');
    const r = s.getBoundingClientRect();
    const join = s.querySelector('.join').getBoundingClientRect();
    const order = ['.tail__h', '.tail__line', '.tail__form', '.tail__steps-col', 'footer.sf'].map((q) => `${q} ${Math.round(document.querySelector(q).getBoundingClientRect().top + scrollY)}`);
    return { top: Math.round(r.top + scrollY), height: Math.round(r.height), container: Math.round(join.width), order, page: document.documentElement.scrollHeight };
  });
  console.log(`@${w}`, JSON.stringify(m));
  await p.screenshot({ path: path.join(OUT, `home-tail-${w}.png`), clip: { x: 0, y: m.top, width: w, height: m.page - m.top }, captureBeyondViewport: true });
  await p.close();
}
await b.close();

/* final16.mjs: three fixes (the founder, 2026-10-06). Home at 1280, the
   whole page and the closing call, into .measure/out/final16.

     node .measure/final16.mjs [base]

   Also prints the closing call's children (headline, paragraph, call and
   nothing else) and the cost row's rule and label colours. */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = path.join('.measure', 'out', 'final16');
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 800 });
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
await p.evaluate(() => document.fonts.ready);
/* Walk the page so anything lazy is in before the full capture. */
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await new Promise((r) => setTimeout(r, 600));
await p.screenshot({ path: path.join(OUT, 'home-1280.png'), fullPage: true });
const close = await p.$('.callband');
await close.evaluate((n) => n.scrollIntoView({ block: 'center' }));
await new Promise((r) => setTimeout(r, 400));
await close.screenshot({ path: path.join(OUT, 'home-close-1280.png') });
const r = await p.evaluate(() => {
  const cb = document.querySelector('.callband');
  const grid = getComputedStyle(document.querySelector('.cc__grid'));
  const cells = [...document.querySelectorAll('.cc__cell')];
  return {
    closing: [...cb.children].map((n) => `${n.tagName.toLowerCase()}.${n.className}`),
    phones: cb.querySelectorAll('[data-device], .phs').length,
    rule: `${grid.borderTopWidth} ${grid.borderTopColor}`,
    cellTops: [...new Set(cells.map((c) => getComputedStyle(c).borderTopWidth))],
    labels: [...new Set([...document.querySelectorAll('.cc__k')].map((n) => getComputedStyle(n).color))],
    cell3: cells[2].innerText.split('\n').filter(Boolean),
  };
});
console.log(JSON.stringify(r, null, 1));
await b.close();

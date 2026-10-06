/* final26-shots.mjs: the captures for the founder's final26 home pass
   (2026-10-07). Writes to .measure/out/final26:
     home-1280.png             full page, reduced motion (everything at rest)
     whatwedo-1280.png         the What we do section, at rest
     whatwedo-390-typing.png   one screen at 390 with the first card mid-type
   and prints the order of home's sections and the cards' measured sizes.

     node .measure/final26-shots.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final26');
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new' });

async function page(w, h, reduce) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }]);
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  return p;
}

/* 1280, at rest. */
let p = await page(1280, 800, true);
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 50));
  }
  window.scrollTo(0, 0);
});
await new Promise((r) => setTimeout(r, 600));
await p.screenshot({ path: path.join(OUT, 'home-1280.png'), fullPage: true });
const info = await p.evaluate(() => ({
  order: [...document.querySelectorAll('main > section, main > footer, main > div')].map(
    (s) => s.querySelector('h2')?.textContent.trim() || s.className.split(' ').slice(0, 3).join('.')
  ),
  cards: [...document.querySelectorAll('.wwd__card')].map((c) => {
    const r = c.getBoundingClientRect();
    return `${Math.round(r.width)}x${Math.round(r.height)}`;
  }),
}));
console.log(JSON.stringify(info, null, 1));
await p.addStyleTag({ content: '.bar{display:none!important}' });
let box = await p.$eval('.wwd', (n) => {
  const r = n.getBoundingClientRect();
  return { x: 0, y: r.top + window.scrollY, width: 1280, height: r.height };
});
await p.screenshot({ path: path.join(OUT, 'whatwedo-1280.png'), clip: box, captureBeyondViewport: true });
await p.close();

/* 390, motion on: scroll the first card into view, wait into the typing. */
p = await page(390, 844, false);
const cardSizes = await p.$$eval('.wwd__card', (cs) => cs.map((c) => Math.round(c.getBoundingClientRect().height)));
console.log('390 card heights', cardSizes.join(', '), 'viewport less bar', 844 - 52);
await p.$eval('.wwd__card', (c) => window.scrollTo(0, c.getBoundingClientRect().top + window.scrollY - 52));
/* blank 400ms, then 60ms a character: about 22 characters in. */
await new Promise((r) => setTimeout(r, 400 + 22 * 60));
const mid = await p.$eval('.wwd__fill [aria-hidden]', (n) => n.firstChild?.textContent || '');
console.log('mid-type:', JSON.stringify(mid));
await p.screenshot({ path: path.join(OUT, 'whatwedo-390-typing.png') });
await p.close();
await b.close();

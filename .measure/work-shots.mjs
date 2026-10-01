/* work-shots.mjs: the Recent work screenshots, 2026-10-02 (the founder's
   "real over drawn"). Each site in src/content/work.js is opened at
   1440 x 900, after network idle, the fonts and a settle, and its FIRST
   VIEWPORT (not the full page) is saved as a JPEG at quality 82:

     public/work/<slug>.jpg        1440 x 900, 16:10, desktop
     public/work/<slug>-720.jpg     720 x 450, the same view at half density,
                                    for phones

   And the Websites frame on /services: baseline-books.com at 390 x 844, its
   first viewport, at 2x density so it is sharp in the device frame on a
   high-density phone (780 x 1688 pixels; the layout is the 390 one):

     public/work/baseline-books-390.jpg

   Nothing on a site is clicked: a cookie or consent banner, if a site shows
   one, is in the capture as the site shows it, and is reported.

   Usage: node .measure/work-shots.mjs [slug ...]   (no slugs: all) */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { WORK } from '../src/content/work.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, '..', 'public', 'work');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const only = process.argv.slice(2);
const report = [];

async function shot(b, url, { width, height, dpr }, file) {
  const p = await b.newPage();
  await p.setViewport({ width, height, deviceScaleFactor: dpr });
  try {
    await p.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
  } catch (e) {
    report.push(`${url}: ${e.message.split('\n')[0]} (captured anyway)`);
  }
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await wait(2000);
  await p.evaluate(() => window.scrollTo(0, 0));
  await wait(300);
  const banner = await p.evaluate(() =>
    [...document.querySelectorAll('body *')].some((e) => {
      const t = (e.innerText || '').toLowerCase();
      const s = getComputedStyle(e);
      return (s.position === 'fixed' || s.position === 'sticky') && /cookie|consent|gdpr/.test(t) && e.getBoundingClientRect().height > 0;
    })
  );
  if (banner) report.push(`${url} ${width}: a cookie or consent banner is showing in the capture`);
  await p.screenshot({ path: path.join(OUT, file), type: 'jpeg', quality: 82 });
  await p.close();
}

const b = await puppeteer.launch({ headless: 'new' });
for (const w of WORK) {
  if (!w.url || (only.length && !only.includes(w.slug))) continue;
  await shot(b, w.url, { width: 1440, height: 900, dpr: 1 }, `${w.slug}.jpg`);
  await shot(b, w.url, { width: 1440, height: 900, dpr: 0.5 }, `${w.slug}-720.jpg`);
  report.push(`${w.slug}: done`);
}
if (!only.length || only.includes('baseline-books')) {
  await shot(b, 'https://www.baseline-books.com/', { width: 390, height: 844, dpr: 2 }, 'baseline-books-390.jpg');
  report.push('baseline-books-390: done');
}
await b.close();
console.log(report.join('\n'));

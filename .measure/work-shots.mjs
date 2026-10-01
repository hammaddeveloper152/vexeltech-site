/* work-shots.mjs: the Recent work screenshots, 2026-10-02 (the founder's
   "real over drawn"). Each site in src/content/work.js is opened at
   1440 x 900, after network idle, the fonts and a settle, and its FIRST
   VIEWPORT (not the full page) is saved as a JPEG at quality 82:

     public/work/<slug>.jpg        1440 x 900, 16:10, desktop
     public/work/<slug>-720.jpg     720 x 450, the same view at half density,
                                    for phones

   And the Websites evidence band on /services (2026-10-02): three phone
   captures, each the first viewport at 390 x 844 at 2x:

     public/work/<slug>-phone.jpg   (baseline-books, artiora, onesix)

   Nothing on a site is clicked: a cookie or consent banner, if a site shows
   one, is in the capture as the site shows it, and is reported.

   Usage: node .measure/work-shots.mjs [slug ... | phones]   (no args: all) */
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

async function shot(b, url, { width, height, dpr, scrollY = 0, clipH = 0 }, file) {
  const p = await b.newPage();
  await p.setViewport({ width, height, deviceScaleFactor: dpr });
  try {
    await p.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
  } catch (e) {
    report.push(`${url}: ${e.message.split('\n')[0]} (captured anyway)`);
  }
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await wait(2000);
  await p.evaluate((y) => window.scrollTo(0, y), scrollY);
  await wait(scrollY ? 1500 : 300);
  const banner = await p.evaluate(() =>
    [...document.querySelectorAll('body *')].some((e) => {
      const t = (e.innerText || '').toLowerCase();
      const s = getComputedStyle(e);
      return (s.position === 'fixed' || s.position === 'sticky') && /cookie|consent|gdpr/.test(t) && e.getBoundingClientRect().height > 0;
    })
  );
  if (banner) report.push(`${url} ${width}: a cookie or consent banner is showing in the capture`);
  /* clipH: a capture taller than the viewport, from the top of the page
     laid out at the viewport's size (the phones, so the device's hover can
     scroll the screen). */
  const clip = clipH ? { x: 0, y: 0, width, height: clipH } : undefined;
  await p.screenshot({ path: path.join(OUT, file), type: 'jpeg', quality: 82, clip, captureBeyondViewport: !!clipH });
  await p.close();
}

const b = await puppeteer.launch({ headless: 'new' });
for (const w of WORK) {
  if (!w.url || (only.length && !only.includes(w.slug))) continue;
  await shot(b, w.url, { width: 1440, height: 900, dpr: 1 }, `${w.slug}.jpg`);
  await shot(b, w.url, { width: 1440, height: 900, dpr: 0.5 }, `${w.slug}-720.jpg`);
  report.push(`${w.slug}: done`);
}
/* THE WEBSITES EVIDENCE BAND on /services (2026-10-02, the founder's two
   fixes): three phone captures, each the site laid out at 390 x 844 at 2x,
   captured 1180 tall from the top (780 x 2360 pixels): the first viewport
   and the next 336px, so the device frame's hover can scroll the screen
   (the six fixes, 2026-10-02). A phone capture and a desktop capture
   of the same site count as different images under BUILD-LAW rule 0 (the
   founder's ruling), so baseline-books and artiora appear here and in
   Recent work. They replaced Zions Caregivers' second screen. */
const PHONES = [
  ['baseline-books', 'https://www.baseline-books.com/'],
  ['artiora', 'https://artluxuryvilla.com/'],
  ['onesix', 'https://www.onesix.ai/'],
];
if (!only.length || only.includes('phones')) {
  for (const [slug, url] of PHONES) {
    await shot(b, url, { width: 390, height: 844, dpr: 2, clipH: 1180 }, `${slug}-phone.jpg`);
    report.push(`${slug}-phone: done`);
  }
}
await b.close();
console.log(report.join('\n'));

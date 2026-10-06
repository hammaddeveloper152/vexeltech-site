/* tile-shots.mjs: Recent work's tiles, fresh from the live sites (the
   founder's home brief of 2026-10-07, final25). Each shown site in
   src/content/work.js is opened at 1280 x 800, after network idle, the
   fonts and a settle, and its first viewport, above the fold in its own
   colours, is saved as WebP:

     public/work/tiles/<slug>-800.webp     800 x 500    (2x a 400px tile)
     public/work/tiles/<slug>-1600.webp   1600 x 1000   (2x a full-width
                                                         tile up to 800)

   taken at device scale 0.625 and 1.25 of the same 1280 x 800 view, so the
   two are one picture at two densities. Nothing on a site is clicked; a
   cookie banner, if a site shows one, is in the capture and reported.

     node .measure/tile-shots.mjs [slug ...] */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { WORK } from '../src/content/work.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, '..', 'public', 'work', 'tiles');
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
for (const w of WORK.filter((x) => x.name && x.shown !== false && (!only.length || only.includes(x.slug)))) {
  for (const [dpr, size] of [[0.625, 800], [1.25, 1600]]) {
    const p = await b.newPage();
    await p.setViewport({ width: 1280, height: 800, deviceScaleFactor: dpr });
    try {
      await p.goto(w.url, { waitUntil: 'networkidle2', timeout: 60000 });
      await p.evaluate(() => document.fonts && document.fonts.ready);
      await wait(2500);
      await p.evaluate(() => window.scrollTo(0, 0));
      await wait(300);
      const file = path.join(OUT, `${w.slug}-${size}.webp`);
      await p.screenshot({ path: file, type: 'webp', quality: 78, clip: { x: 0, y: 0, width: 1280, height: 800 } });
      const banner = await p.evaluate(() => !!document.querySelector('[id*="cookie" i], [class*="cookie" i], [class*="consent" i]'));
      console.log(`${w.slug}-${size}.webp ${fs.statSync(file).size} bytes${banner ? ' (a cookie or consent element is on the page)' : ''}`);
    } catch (e) {
      console.log(`${w.slug}-${size}: FAILED ${e.message}`);
    }
    await p.close();
  }
}
await b.close();

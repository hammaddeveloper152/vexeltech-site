/* final22.mjs: the final audit's captures (the founder, 2026-10-06). Every
   public route, full page, at 1280 and 390, into .measure/out/final22, with
   reduced motion (every artifact at rest, the hero on its first-second
   frame), after a walk down the page so anything lazy has loaded.

     node .measure/final22.mjs [base] */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = path.join('.measure', 'out', 'final22');
fs.mkdirSync(OUT, { recursive: true });
const ROUTES = { home: '/', services: '/services', pricing: '/pricing', about: '/about-us', contact: '/contact-us', privacy: '/privacy-policy', terms: '/terms-of-service', thanks: '/thanks', '404': '/no-such-page' };
const b = await puppeteer.launch({ headless: 'new' });
for (const w of [1280, 390]) {
  for (const [name, route] of Object.entries(ROUTES)) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: w >= 1024 ? 800 : 844 });
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 500));
    await p.screenshot({ path: path.join(OUT, `${name}-${w}.png`), fullPage: true });
    console.log(`${name}-${w}`);
    await p.close();
  }
}
await b.close();

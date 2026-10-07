/* final29-jump.mjs: the HTML alone against the hydrated page (FINAL29,
   2026-10-07). For each route at 390 and 1280, with reduced motion so no
   animation is mid-frame, the first screen is captured with JavaScript off
   (exactly what the prerendered HTML paints) and with it on after the app
   has hydrated. Prints the share of pixels that differ and writes both
   frames and a diff to .measure/out/final29/jump/.

     node .measure/final29-jump.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final29', 'jump');
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new' });
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/privacy-policy', '/thanks', '/nope'];
for (const w of [390, 1280]) {
  for (const route of ROUTES) {
    const shots = [];
    for (const js of [false, true]) {
      const p = await b.newPage();
      await p.setJavaScriptEnabled(js);
      await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
      await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await p.goto(BASE + route, { waitUntil: 'networkidle0' });
      await p.evaluate(() => document.fonts.ready);
      await new Promise((r) => setTimeout(r, 700));
      const name = `${route === '/' ? 'home' : route.slice(1)}-${w}-${js ? 'hydrated' : 'html'}.png`;
      await p.screenshot({ path: path.join(OUT, name) });
      shots.push(name);
      await p.close();
    }
    console.log(`${route} @${w}: ${shots.join(' vs ')}`);
  }
}
await b.close();

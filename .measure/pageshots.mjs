/* pageshots.mjs: a full-page frame of every route at 1280 and 390,
   2026-10-01 (copy V2). The page is walked first so anything revealed on
   scroll has landed, then returned to the top, so the sticky bar sits at
   the top of the frame. Console errors collected.

   Usage: node .measure/pageshots.mjs [tag] [base]
   Frames go to .measure/out/pageshots/<tag>/. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TAG = process.argv[2] || 'now';
const BASE = process.argv[3] || 'http://localhost:4173';
const OUT = path.join(HERE, 'out', 'pageshots', TAG);
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/thanks', '/privacy-policy', '/terms-of-service', '/no-such-page'];
const errors = [];
const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
for (const [w, h] of [[1280, 800], [390, 844]]) {
  for (const route of ROUTES) {
    const p = await b.newPage();
    p.on('console', (m) => m.type() === 'error' && errors.push(`${route} ${w}: ${m.text()}`));
    p.on('pageerror', (e) => errors.push(`${route} ${w}: ${e.message}`));
    await p.setViewport({ width: w, height: h });
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    await wait(1000);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 600) {
      await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
      await wait(150);
    }
    await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await wait(1500);
    const name = `${w}${route.replace(/\//g, '-') || '-home'}.png`.replace('--', '-');
    await p.screenshot({ path: path.join(OUT, route === '/' ? `${w}-home.png` : name), fullPage: true });
    await p.close();
  }
}
await b.close();
console.log(JSON.stringify({ frames: fs.readdirSync(OUT), consoleErrors: errors }, null, 1));

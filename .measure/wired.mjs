/* wired.mjs: the storytelling objects in their pages, 2026-10-01 (the
   founder's "wire the story"). It replaced story.mjs, which shot the
   preview route this pass deleted.

   For each public route at 1280 and 390: walked down so every reveal has
   run, a full-page frame, and a frame of each story object as it sits on
   its page (the bar and the skip link hidden for those, since a capture
   taller than the viewport pastes them mid-object). Console errors, and
   any text under 11px inside a story object or a Services frame (SVG text
   at its rendered size: font size times the drawing's scale), are listed.

   Usage: node .measure/wired.mjs [base] [out-subdir] [routes,comma,separated]
   Frames go to .measure/out/story/wired/ (or .measure/out/<out-subdir>/).
   2026-10-02 (real over drawn): the objects are CostRows (.cr), Recent work
   (.rw), the timeline (.ctl), the growth diagram (.gd), BuildAround (.ba),
   the ledger (.fl), the terms sheet (.ts) and ServiceImage (.si). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = process.argv[3] ? path.join(HERE, 'out', process.argv[3]) : path.join(HERE, 'out', 'story', 'wired');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ROUTES = process.argv[4] ? process.argv[4].split(',') : ['/', '/services', '/pricing', '/about-us', '/contact-us', '/thanks', '/privacy-policy', '/terms-of-service', '/no-such-page'];
/* The objects, by their root class. */
const OBJECTS = ['.kc', '.fl2', '.wa', '.id', '.dp', '.bm', '.tb', '.ab3-hero', '.rl', '.os', '.al', '.fc', '.tc'];
const errors = [];
const small = [];

const b = await puppeteer.launch({ headless: 'new' });
for (const [w, h] of [[1280, 800], [390, 844]]) {
  for (const route of ROUTES) {
    const p = await b.newPage();
    p.on('console', (m) => m.type() === 'error' && errors.push(`${route} ${w}: ${m.text()}`));
    p.on('pageerror', (e) => errors.push(`${route} ${w}: ${e.message}`));
    await p.setViewport({ width: w, height: h });
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 400) {
      await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
      await wait(120);
    }
    await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await wait(1200);
    const name = route === '/' ? 'home' : route.slice(1);
    await p.screenshot({ path: path.join(OUT, `${name}-${w}.png`), fullPage: true });

    const tiny = await p.evaluate((sel) =>
      [...document.querySelectorAll(sel.map((s) => `${s} *`).join(','))]
        .filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
        .map((e) => {
          const svg = e.closest('svg');
          const scale = svg && svg.viewBox.baseVal.width ? svg.getBoundingClientRect().width / svg.viewBox.baseVal.width : 1;
          return { t: e.textContent.trim().slice(0, 24), cls: e.getAttribute('class') || e.tagName, px: Math.round(parseFloat(getComputedStyle(e).fontSize) * scale * 10) / 10, w: e.getBoundingClientRect().width };
        })
        .filter((x) => x.px < 11 && x.w > 0), OBJECTS);
    tiny.forEach((x) => small.push(`${route} ${w}: "${x.t}" (${x.cls}) ${x.px}px`));

    await p.addStyleTag({ content: '.bar, .skip { visibility: hidden !important; }' });
    const found = await p.evaluate((sel) => sel.filter((s) => document.querySelector(s)), OBJECTS);
    for (const s of found) {
      const els = await p.$$(s);
      for (let k = 0; k < els.length; k += 1) {
        const file = `${name}-obj-${s.slice(1)}${els.length > 1 ? `-${k + 1}` : ''}-${w}.png`;
        await els[k].screenshot({ path: path.join(OUT, file) });
      }
    }
    await p.close();
  }
}
await b.close();
console.log(JSON.stringify({ frames: fs.readdirSync(OUT).length, consoleErrors: errors, under11px: small }, null, 1));

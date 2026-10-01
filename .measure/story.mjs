/* story.mjs: the storytelling components, each on its page ground, at 1280
   and 390, 2026-10-01 (the founder's storytelling pass).

   Each /story/<id> view is walked down so every reveal has run, then the
   component alone is captured (the union of the sections in <main>, not the
   bar or the footer). The growth diagram is also captured part-way through
   its reveal, to show it builds. Then full pages of the routes the removals
   touched. Console errors collected; any text under 11px inside a story
   component reported (BUILD-LAW Type floor).

   Usage: node .measure/story.mjs [base]
   Frames go to .measure/out/story/. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = path.join(HERE, 'out', 'story');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const VIEWS = ['cost', 'work', 'timeline', 'growth', 'around', 'fit', 'terms', 'services'];
const PAGES = ['/', '/services', '/pricing', '/about-us', '/contact-us'];
const errors = [];
const small = [];

const b = await puppeteer.launch({ headless: 'new' });
for (const [w, h] of [[1280, 800], [390, 844]]) {
  for (const id of VIEWS) {
    const p = await b.newPage();
    p.on('console', (m) => m.type() === 'error' && errors.push(`${id} ${w}: ${m.text()}`));
    p.on('pageerror', (e) => errors.push(`${id} ${w}: ${e.message}`));
    await p.setViewport({ width: w, height: h });
    await p.goto(`${BASE}/story/${id}`, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    if (id === 'growth') {
      /* Part-way through the build: a page whose viewport is short enough
         that the diagram starts below it, scrolled in, then caught at 120
         and 360ms. */
      const q = await b.newPage();
      await q.setViewport({ width: w, height: 260 });
      await q.goto(`${BASE}/story/${id}`, { waitUntil: 'networkidle0' });
      await q.evaluate(() => document.fonts.ready);
      await q.setViewport({ width: w, height: h });
      await q.evaluate(() => window.scrollTo(0, 0));
      await wait(300);
      await q.evaluate(() => document.querySelector('.gd__stops').scrollIntoView({ block: 'center' }));
      await wait(120);
      await q.screenshot({ path: path.join(OUT, `${id}-${w}-reveal-120ms.png`) });
      await wait(240);
      await q.screenshot({ path: path.join(OUT, `${id}-${w}-reveal-360ms.png`) });
      await q.close();
    }
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 400) {
      await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
      await wait(120);
    }
    await wait(1200);
    const clip = await p.evaluate(() => {
      const secs = [...document.querySelectorAll('main > section')];
      const rs = secs.map((s) => s.getBoundingClientRect());
      const top = Math.min(...rs.map((r) => r.top)) + window.scrollY;
      const bottom = Math.max(...rs.map((r) => r.bottom)) + window.scrollY;
      return { x: 0, y: Math.max(0, top), width: document.documentElement.clientWidth, height: bottom - top };
    });
    const tiny = await p.evaluate(() =>
      [...document.querySelectorAll('main section *')]
        .filter((e) => e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
        .map((e) => {
          const r = e.getBoundingClientRect();
          const fs = parseFloat(getComputedStyle(e).fontSize);
          /* SVG text: the rendered size is the font size times the drawing's
             scale. */
          const svg = e.closest('svg');
          const scale = svg && svg.viewBox.baseVal.width ? svg.getBoundingClientRect().width / svg.viewBox.baseVal.width : 1;
          return { t: e.textContent.trim().slice(0, 30), px: Math.round(fs * scale * 10) / 10, w: r.width };
        })
        .filter((x) => x.px < 11 && x.w > 0)
    );
    tiny.forEach((x) => small.push(`${id} ${w}: "${x.t}" ${x.px}px`));
    /* The sticky bar and the skip link are taken out of these frames: a
       capture taller than the viewport pastes them mid-component. */
    await p.addStyleTag({ content: '.bar, .skip { visibility: hidden !important; }' });
    await p.screenshot({ path: path.join(OUT, `${id}-${w}.png`), clip, captureBeyondViewport: true });
    await p.close();
  }
  for (const route of PAGES) {
    const p = await b.newPage();
    p.on('pageerror', (e) => errors.push(`${route} ${w}: ${e.message}`));
    await p.setViewport({ width: w, height: h });
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 600) {
      await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
      await wait(120);
    }
    await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await wait(1200);
    const name = route === '/' ? 'home' : route.slice(1);
    await p.screenshot({ path: path.join(OUT, `page-${name}-${w}.png`), fullPage: true });
    await p.close();
  }
}
await b.close();
console.log(JSON.stringify({ frames: fs.readdirSync(OUT).length, consoleErrors: errors, under11px: small }, null, 1));

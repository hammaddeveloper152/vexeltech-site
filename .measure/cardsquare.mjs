/* cardsquare.mjs: card tilt is desktop only, 2026-10-01 (the founder).

   - The four "What we do" cards on home at 390, 430, 768 and 1280: each
     card's computed rotation, its left edge, the gaps between cards, the
     badge's rotation and whether it shows. A frame of the section.
   - Every element on /, /services, /pricing, /about-us and /contact-us at
     390 whose computed transform rotates it, so nothing tilted is missed.
     A swash's stroke carries its own angle and is listed apart.
   Console errors collected.

   Usage: node .measure/cardsquare.mjs [base]   (default http://localhost:4173)
   Frames go to .measure/out/cardsquare/. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out', 'cardsquare');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.argv[2] || 'http://localhost:4173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
const open = async (w, h, route) => {
  const p = await b.newPage();
  p.on('console', (m) => m.type() === 'error' && errors.push(`${route} ${w}: ${m.text()}`));
  p.on('pageerror', (e) => errors.push(`${route} ${w}: ${e.message}`));
  await p.setViewport({ width: w, height: h });
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await wait(1200);
  return p;
};
const deg = (t) => {
  if (!t || t === 'none') return 0;
  const m = t.match(/matrix\(([^)]+)\)/);
  if (!m) return null;
  const [a, bb] = m[1].split(',').map(Number);
  return +((Math.atan2(bb, a) * 180) / Math.PI).toFixed(2);
};
const report = { cards: {}, rotated: {} };

for (const [w, h] of [[390, 844], [430, 932], [768, 1024], [1280, 800]]) {
  const p = await open(w, h, '/');
  await p.evaluate(() => document.querySelector('.services__grid').scrollIntoView({ block: 'start', behavior: 'instant' }));
  await wait(1500);
  const r = await p.evaluate((degSrc) => {
    const deg = new Function(`return ${degSrc}`)();
    const cards = [...document.querySelectorAll('.services__grid .art--colour')];
    const boxes = cards.map((c) => {
      const cs = getComputedStyle(c);
      /* The layout box, not the rotated bounding box: offsetLeft/Top. */
      const x = c.getBoundingClientRect();
      return {
        name: c.querySelector('.art__name')?.textContent.trim(),
        rot: deg(cs.transform),
        left: Math.round(c.offsetLeft + c.offsetParent.getBoundingClientRect().left),
        top: Math.round(x.top + scrollY),
        bottom: Math.round(x.bottom + scrollY),
        badge: (() => {
          const bd = c.querySelector('.badge');
          if (!bd) return 'none';
          const bs = getComputedStyle(bd);
          return bs.display === 'none' ? 'hidden' : `${deg(bs.transform)}deg`;
        })(),
      };
    });
    const gridGap = getComputedStyle(document.querySelector('.services__grid')).rowGap;
    const cols = getComputedStyle(document.querySelector('.services__grid')).gridTemplateColumns.split(' ').length;
    return { cols, gridGap, cards: boxes };
  }, deg.toString());
  /* A viewport frame with the grid scrolled into view, not a clip reaching
     past the viewport: a clip that does forces the sticky bar and the
     off-screen skip link into the picture, which is not the page. */
  await p.evaluate(() => {
    const g = document.querySelector('.services__grid').getBoundingClientRect();
    window.scrollTo({ top: g.top + scrollY - 80, behavior: 'instant' });
  });
  await wait(900);
  await p.screenshot({ path: path.join(OUT, `${w}-whatwedo.png`) });
  report.cards[w] = r;
  await p.close();
}

for (const route of ['/', '/services', '/pricing', '/about-us', '/contact-us']) {
  const p = await open(390, 844, route);
  /* Walk the page so anything revealed on scroll has landed. */
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 700) {
    await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await wait(250);
  }
  await wait(800);
  report.rotated[route] = await p.evaluate((degSrc) => {
    const deg = new Function(`return ${degSrc}`)();
    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const d = deg(cs.transform);
      if (d && Math.abs(d) > 0.01) {
        const cls = typeof el.className === 'string' ? el.className : el.className?.baseVal || '';
        out.push({ el: `${el.tagName.toLowerCase()}.${cls.trim().split(/\s+/).join('.')}`, deg: d, swash: !!el.closest('.brush') });
      }
    }
    return out;
  }, deg.toString());
  await p.close();
}

await b.close();
report.consoleErrors = errors;
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));

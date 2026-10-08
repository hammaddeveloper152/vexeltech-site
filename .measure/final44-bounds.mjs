/* final44-bounds.mjs: section boundaries (FINAL44, 2026-10-09, the founder).
   Every route at 1280 and 390, at rest (reduced motion). For each pair of
   consecutive sections: the distance from the last visible content of the
   first to the first visible content of the next, split into its parts:

     tailA  the first section's content ending short of its padding box
            (min-heights, empty rows, a column pinned to a taller sibling,
            trailing margins)
     padA   the first section's padding-bottom
     gap    space between the two boxes (margins)
     padB   the next section's padding-top
     headB  the next section's content starting below its padding box

   The rule: same ground, the boundary is one section token (128 at 1280,
   56 at 390); a ground change, at most 224 at 1280 and 112 at 390. A
   boundary over its limit names the part that carries the excess.

     node .measure/final44-bounds.mjs [base] [tag]   (4190, now) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const TAG = process.argv[3] || 'now';
const OUT = path.join('.measure', 'out', 'final44');
fs.mkdirSync(OUT, { recursive: true });
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/privacy-policy', '/terms-of-service', '/thanks', '/nope'];

const READ = () => {
  const name = (e) => {
    const cls = String(e.className.baseVal ?? e.className).trim().split(/\s+/).slice(0, 2).join('.');
    const t = (e.getAttribute('aria-label') || e.innerText || e.alt || '').replace(/\s+/g, ' ').trim().slice(0, 28);
    return `${e.tagName.toLowerCase()}${cls ? `.${cls}` : ''}${t ? ` "${t}"` : ''}`;
  };
  const shown = (e) => {
    const r = e.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    for (let n = e; n && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
      if (n !== e && cs.overflow !== 'visible') {
        const a = n.getBoundingClientRect();
        if (r.bottom <= a.top + 0.5 || r.top >= a.bottom - 0.5) return false;
      }
    }
    return !e.closest('[inert]') && !e.closest('.skip-h, .sr-only');
  };
  const paints = (e) =>
    [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) ||
    e.matches('img, svg, video, canvas, input, textarea, select, button, hr, picture, [data-artifact]');
  /* A painted ground (a card, a sheet) counts as content too: its edge is
     what the reader sees. */
  const ground = (e) => {
    for (let n = e; n; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
    }
    return getComputedStyle(document.body).backgroundColor;
  };
  const sections = [...document.querySelectorAll('main > section, main > header, main > div > section, footer.sf')].filter(shown);
  return sections.map((sec) => {
    const own = ground(sec);
    let top = Infinity;
    let bottom = -Infinity;
    let first = '';
    let last = '';
    for (const e of sec.querySelectorAll('*')) {
      const bg = getComputedStyle(e).backgroundColor;
      const painted = bg !== 'rgba(0, 0, 0, 0)' && bg !== own;
      if (!paints(e) && !painted) continue;
      if (!shown(e)) continue;
      const r = e.getBoundingClientRect();
      const t = r.top + scrollY;
      const b = r.bottom + scrollY;
      if (t < top) { top = t; first = name(e); }
      if (b > bottom) { bottom = b; last = name(e); }
    }
    const r = sec.getBoundingClientRect();
    const cs = getComputedStyle(sec);
    return {
      sec: name(sec).slice(0, 48),
      ground: own,
      boxTop: r.top + scrollY,
      boxBottom: r.bottom + scrollY,
      padTop: parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth),
      padBottom: parseFloat(cs.paddingBottom) + parseFloat(cs.borderBottomWidth),
      top, bottom, first, last,
    };
  });
};

const b = await puppeteer.launch({ headless: 'new' });
const report = {};
for (const w of [1280, 390]) {
  for (const route of ROUTES) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 20));
      }
      window.scrollTo(0, 0);
    });
    const secs = await p.evaluate(READ);
    const tok = w === 1280 ? 128 : 56;
    const cap = w === 1280 ? 224 : 112;
    const rows = [];
    for (let i = 1; i < secs.length; i += 1) {
      const A = secs[i - 1];
      const B = secs[i];
      const change = A.ground !== B.ground;
      const limit = change ? cap : tok;
      const total = Math.round(B.top - A.bottom);
      const parts = {
        tailA: Math.round(A.boxBottom - A.padBottom - A.bottom),
        padA: Math.round(A.padBottom),
        gap: Math.round(B.boxTop - A.boxBottom),
        padB: Math.round(B.padTop),
        headB: Math.round(B.top - B.boxTop - B.padTop),
      };
      rows.push({ from: A.sec, to: B.sec, change, total, limit, over: total > limit + 1, parts, last: A.last, first: B.first });
    }
    report[`${route} @${w}`] = rows;
    await p.close();
  }
}
await b.close();
fs.writeFileSync(path.join(OUT, `bounds-${TAG}.json`), JSON.stringify(report, null, 1));
let over = 0;
for (const [k, rows] of Object.entries(report)) {
  console.log(`== ${k}`);
  for (const r of rows) {
    if (r.over) over += 1;
    const pr = r.parts;
    console.log(`  ${r.over ? 'OVER' : 'ok  '} ${String(r.total).padStart(4)} (limit ${r.limit}${r.change ? ', ground changes' : ''})  tailA ${pr.tailA} padA ${pr.padA} gap ${pr.gap} padB ${pr.padB} headB ${pr.headB}`);
    console.log(`        ${r.from}  ->  ${r.to}`);
    if (r.over) console.log(`        last: ${r.last}   first: ${r.first}`);
  }
}
console.log(`\n${over} boundaries over the rule`);

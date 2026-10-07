/* anchors.mjs: BUILD-LAW Rhythm's check (the founder, final25, 2026-10-07).
   At 390 wide, every screen carries one anchor the eye lands on before any
   word; no two consecutive screens without one.

     node .measure/anchors.mjs [base] [route] [out]
       defaults: http://localhost:4173  /  .measure/out/final24

   The route is captured full page at 390 x 844 with reduced motion (every
   artifact at rest, the hero on its still), after a walk down the page so
   lazy images have loaded. The page is cut into 844px screens and each is
   read from the layout, not guessed from pixels:

     film        the hero's video or its still
     artifact    an element marked data-artifact that is an artifact (a
                 /services stage), not a section that wraps one
     colour      a filled field that is not the page's dark ground (cream,
                 yellow, a discipline colour) covering 30% of the screen
     screenshot  a real capture of a site (Recent work, the phones)
     figure      text set at 72px or larger

   An element counts on a screen when at least 160px of it, or 40% of its
   height, is inside that screen. Prints the list, writes
   anchors-390.json and the contact sheet (contact-390.png, the screens
   side by side at half size, each labelled with what it holds), and exits
   1 if two consecutive screens hold none. */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const ROUTE = process.argv[3] || '/';
const OUT = process.argv[4] || path.join('.measure', 'out', 'final24');
fs.mkdirSync(OUT, { recursive: true });
const W = 390;
const H = 844;
const name = ROUTE === '/' ? 'home' : ROUTE.replace(/\//g, '');

const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: W, height: H });
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await p.goto(BASE + ROUTE, { waitUntil: 'networkidle0' });
await p.evaluate(() => document.fonts.ready);
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 400) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await new Promise((r) => setTimeout(r, 800));
const full = path.join(OUT, `${name}-390.png`);
await p.screenshot({ path: full, fullPage: true });

const found = await p.evaluate((H) => {
  const docH = document.documentElement.scrollHeight;
  const sy = window.scrollY;
  const box = (e) => {
    const r = e.getBoundingClientRect();
    return { top: r.top + sy, bottom: r.bottom + sy, h: r.height, w: r.width };
  };
  const lum = (c) => {
    const m = c.match(/[\d.]+/g);
    if (!m) return null;
    const [r, g, bl, a = 1] = m.map(Number);
    if (a < 0.9) return null;
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl);
  };
  const items = [];
  const add = (kind, e, label) => {
    const bx = box(e);
    if (bx.h > 0 && bx.w > 0) items.push({ kind, label, ...bx });
  };
  document.querySelectorAll('.hero video, .hero .hero__spot').forEach((e) => add('film', e, 'hero film'));
  /* A section that only wraps other things (the $700 band, Recent work,
     the facts ledger) is not an artifact here; it counts by its own
     figure, colour or screenshots. */
  const WRAPPERS = ['PromiseBand', 'WorkAccordion'];
  document.querySelectorAll('[data-artifact]').forEach((e) => {
    if (!WRAPPERS.includes(e.dataset.artifact)) add('artifact', e, e.dataset.artifact);
  });
  document.querySelectorAll('.wa__shot img, .dp img').forEach((e) => add('screenshot', e, e.getAttribute('alt') || 'capture'));
  for (const e of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (own && parseFloat(cs.fontSize) >= 72) add('figure', e, `${e.textContent.trim().slice(0, 16)} (${Math.round(parseFloat(cs.fontSize))}px)`);
    const l = lum(cs.backgroundColor);
    if (l !== null && l > 0.2 && e.getBoundingClientRect().width > 300) add('colour', e, `${e.className.toString().split(' ')[0] || e.tagName.toLowerCase()} field`);
  }
  /* A RUN OF FIELDS IS ONE FIELD (2026-10-07, the founder: home's tail is
     one cream surface). Colour fields that touch top to bottom (within
     2px), each at least 300 wide, are merged into one, so a screen that
     straddles two cream sections counts the cream it shows, not the share
     of each section. */
  const fields = items.filter((it) => it.kind === 'colour').sort((a, b) => a.top - b.top);
  const runs = [];
  for (const f of fields) {
    const last = runs[runs.length - 1];
    if (last && f.top <= last.bottom + 2) {
      if (f.bottom > last.bottom) last.bottom = f.bottom;
      last.w = Math.max(last.w, f.w);
      if (!last.label.includes('run')) last.label = `${last.label.split(' ')[0]} run`;
    } else runs.push({ ...f });
  }
  for (let i = items.length - 1; i >= 0; i -= 1) if (items[i].kind === 'colour') items.splice(i, 1);
  items.push(...runs);
  const screens = [];
  for (let y = 0, n = 1; y < docH; y += H, n += 1) {
    const y2 = Math.min(y + H, docH);
    const here = [];
    for (const it of items) {
      const vis = Math.min(it.bottom, y2) - Math.max(it.top, y);
      if (vis <= 0) continue;
      const ok =
        it.kind === 'colour' ? vis * Math.min(it.w, 390) >= 0.3 * (y2 - y) * 390 : vis >= 160 || vis >= 0.4 * it.h;
      if (ok) here.push(`${it.kind}: ${it.label}`);
    }
    screens.push({ n, from: y, to: y2, anchors: [...new Set(here)] });
  }
  return { docH, screens };
}, H);

let fail = false;
const lines = found.screens.map((s, i) => {
  const none = !s.anchors.length;
  if (none && i > 0 && !found.screens[i - 1].anchors.length) fail = true;
  return `screen ${String(s.n).padStart(2, '0')} (${s.from} to ${s.to}): ${none ? 'NONE' : s.anchors.slice(0, 4).join(' | ')}`;
});
console.log(lines.join('\n'));
console.log(fail ? 'FAIL: two consecutive screens hold no anchor' : 'PASS: no two consecutive screens without an anchor');
fs.writeFileSync(path.join(OUT, `anchors-${name}-390.json`), JSON.stringify(found, null, 2));

/* The contact sheet: every screen at half size, side by side, labelled. */
const img = fs.readFileSync(full).toString('base64');
const cols = 6;
const sheet = await b.newPage();
const tw = W / 2;
const th = H / 2;
const rows = Math.ceil(found.screens.length / cols);
await sheet.setViewport({ width: cols * (tw + 12) + 12, height: rows * (th + 60) + 12 });
await sheet.setContent(
  `<html><body style="margin:0;padding:12px;background:#222;font:11px monospace;color:#ddd;display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:12px">
  ${found.screens
    .map(
      (s) => `<div><div style="width:${tw}px;height:${th}px;background-image:url(data:image/png;base64,${img});background-size:${tw}px auto;background-position:0 -${s.from / 2}px;outline:1px solid #555"></div>
      <div style="padding-top:4px;height:44px;overflow:hidden">${String(s.n).padStart(2, '0')} ${s.anchors.length ? s.anchors.map((a) => a.split(':')[0]).filter((v, i, a) => a.indexOf(v) === i).join(', ') : '<b style="color:#f66">NONE</b>'}</div></div>`
    )
    .join('')}
  </body></html>`,
  { waitUntil: 'load' }
);
await sheet.screenshot({ path: path.join(OUT, `contact-${name}-390.png`), fullPage: true });
await b.close();
process.exit(fail ? 1 : 0);

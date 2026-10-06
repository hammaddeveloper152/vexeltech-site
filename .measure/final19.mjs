/* final19.mjs: home's lit cost row and the Marketing inbox stage (the
   founder, 2026-10-06). Captures into .measure/out/final19, and checks,
   printed as JSON.

     node .measure/final19.mjs [base]

   Captures: home-costs-1280, marketing-1280, marketing-1280-pulse (the
   pulse mid-wire), marketing-390.
   Checks:
     pairs   every text element in the cost row and the inbox stage (the
             white cards included) against the first opaque ground behind
             it; the lowest four and anything under 4.5 (3.0 large)
     floor   the smallest font size in each
     hidden  anything under opacity 1 at load (reduced motion)
     wires   the number of wire paths drawn at 1280 (3 branches, 1 trunk)
     sweep   the cost row's highlight: its animation and play state, with
             motion and under reduced motion
     loop    samples through the first play: the lifted card, the pulse's
             opacity and the top row */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = path.join('.measure', 'out', 'final19');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
const report = {};

const audit = (sel) => {
  const root = document.querySelector(sel);
  const rgba = (c) => c.match(/[\d.]+/g).map(Number);
  const L = (c) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const ground = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      const m = rgba(cs.backgroundColor);
      if (m.length < 4 || m[3] >= 0.9) return m;
    }
    return [11, 11, 13];
  };
  const out = [];
  let floor = 99;
  const hidden = [];
  for (const el of root.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (!r.width || cs.display === 'none') continue;
    if (Number(cs.opacity) < 1 && !el.classList.contains('ib__pulse')) hidden.push(String(el.className.baseVal ?? el.className));
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    floor = Math.min(floor, parseFloat(cs.fontSize));
    const g = ground(el);
    const a = L(rgba(cs.color));
    const z = L(g);
    const ratio = (Math.max(a, z) + 0.05) / (Math.min(a, z) + 0.05);
    const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && Number(cs.fontWeight) >= 700);
    out.push({ t: el.textContent.trim().slice(0, 30), r: Math.round(ratio * 100) / 100, big });
  }
  out.sort((x, y) => x.r - y.r);
  return { floor, hidden: hidden.slice(0, 6), lowest: out.slice(0, 4), fails: out.filter((x) => x.r < (x.big ? 3 : 4.5)) };
};

async function open(w, route, reduced = true) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w >= 1024 ? 800 : 844 });
  if (reduced) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  return p;
}
async function shot(p, sel, name) {
  const el = await p.$(sel);
  await el.evaluate((n) => n.scrollIntoView({ block: 'start' }));
  await p.evaluate(() => window.scrollBy(0, -90));
  await wait(400);
  await el.screenshot({ path: path.join(OUT, name) });
}
const sweep = (p) => p.$eval('.cc__sweep > span', (n) => `${getComputedStyle(n).animationName} ${getComputedStyle(n).animationDuration} ${getComputedStyle(n).animationPlayState}`);

for (const w of [1280, 390]) {
  const r = (report[w] = {});
  const h = await open(w, '/');
  if (w === 1280) await shot(h, '.cc', 'home-costs-1280.png');
  r.costs = await h.evaluate(audit, '.cc');
  r.sweepReduced = await sweep(h);
  await h.close();
  const s = await open(w, '/services');
  await shot(s, '.ib', `marketing-${w}.png`);
  r.inbox = await s.evaluate(audit, '.ib');
  r.wires = await s.$$eval('.ib__wires path:not(.ib__route)', (n) => n.length);
  await s.close();
}

/* With motion, at 1280: the sweep, and the first play. */
const h = await open(1280, '/', false);
report.sweepMotion = await sweep(h);
await h.close();
const m = await open(1280, '/services', false);
const st = await m.$('.ib__stage');
await st.evaluate((n) => n.scrollIntoView({ block: 'center' }));
const t0 = Date.now();
report.loop = [];
let shotDone = false;
while (Date.now() - t0 < 8200) {
  const v = await m.evaluate(() => ({
    lift: [...document.querySelectorAll('.ib__slot')].findIndex((n) => n.classList.contains('is-lift')) + 1,
    pulse: Number(getComputedStyle(document.querySelector('.ib__pulse')).opacity),
    top: document.querySelector('.ib__row .ib__time').textContent,
    rows: document.querySelectorAll('.ib__row').length,
  }));
  report.loop.push(`${Date.now() - t0}ms lift ${v.lift || '-'} pulse ${v.pulse} top ${v.top} rows ${v.rows}`);
  if (!shotDone && v.pulse === 1 && Date.now() - t0 > 7120) {
    await (await m.$('.ib')).screenshot({ path: path.join(OUT, 'marketing-1280-pulse.png') });
    shotDone = true;
  }
  await wait(120);
}
await m.close();
await b.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));

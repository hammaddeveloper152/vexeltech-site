/* final21.mjs: the Marketing polish (the founder, 2026-10-06): final20's
   checks at 1280 and 390, plus the feed card's panel and footer, the map
   card's reviews against its foot, and the wires' stroke.
   Captures into .measure/out/final21, and checks, printed as JSON.

     node .measure/final21.mjs [base]

   Captures: marketing-1280, marketing-1280-pulse (mid-wire), marketing-1024,
   marketing-390.
   Checks, at each width:
     cards   each card's box against the stage: left inset, top and bottom
             (one baseline means the same bottom), width and height
     inbox   the rows' top against the cards' top, and the row count shown
     wires   paths drawn (0 below 600)
     clear   with motion at 1280 and 1024: the pulse sampled through one
             run; at each sample, elementFromPoint at the dot's centre must
             be the dot itself, so nothing lies over the wire
     pairs   the lowest text contrast on the stage, and any failure */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = path.join('.measure', 'out', 'final21');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
const report = {};

const geometry = () => {
  const o = document.querySelector('.ib__stage').getBoundingClientRect();
  const cards = [...document.querySelectorAll('.ib__card')].map((c) => {
    const r = c.getBoundingClientRect();
    return { left: Math.round(r.left - o.left), top: Math.round(r.top - o.top), bottom: Math.round(r.bottom - o.top), w: Math.round(r.width), h: Math.round(r.height) };
  });
  const rows = document.querySelector('.ib__rows').getBoundingClientRect();
  const shown = [...document.querySelectorAll('.ib__row')].filter((n) => {
    const r = n.getBoundingClientRect();
    return r.top >= rows.top - 1 && r.bottom <= rows.bottom + 1;
  }).length;
  const more = document.querySelector('.ib__more');
  const feed = document.querySelector('.ib__card--feed').getBoundingClientRect();
  const panel = document.querySelector('.ib__panel').getBoundingClientRect();
  const foot = document.querySelector('.ib__post-f').getBoundingClientRect();
  const map = document.querySelector('.ib__card--map').getBoundingClientRect();
  const revs = [...document.querySelectorAll('.ib__rev-t')].map((n) => n.getBoundingClientRect());
  const wire = document.querySelector('.ib__wires path');
  return {
    stage: `${Math.round(o.width)}x${Math.round(o.height)}`,
    cards,
    rowsTop: Math.round(rows.top - o.top),
    rowsShown: shown,
    wires: document.querySelectorAll('.ib__wires path:not(.ib__route)').length,
    panel: `${Math.round(panel.width)}x${Math.round(panel.height)}`,
    panelToFooter: Math.round(foot.top - panel.bottom),
    footerToCardFoot: Math.round(feed.bottom - foot.bottom),
    reviewsFit: revs.map((r) => Math.round(map.bottom - r.bottom)),
    wire: wire ? `${getComputedStyle(wire).strokeWidth} ${getComputedStyle(wire).stroke}` : 'none',
    learnMoreLines: Math.round((more.getBoundingClientRect().height - 14) / parseFloat(getComputedStyle(more).lineHeight)),
  };
};

const pairs = () => {
  const rgba = (c) => c.match(/[\d.]+/g).map(Number);
  const L = (c) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const ground = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const m = rgba(getComputedStyle(n).backgroundColor);
      if (m.length < 4 || m[3] >= 0.9) return m;
    }
    return [11, 11, 13];
  };
  const out = [];
  let floor = 99;
  for (const el of document.querySelectorAll('.ib *')) {
    const cs = getComputedStyle(el);
    if (!el.getBoundingClientRect().width || cs.display === 'none') continue;
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    floor = Math.min(floor, parseFloat(cs.fontSize));
    const a = L(rgba(cs.color));
    const z = L(ground(el));
    out.push({ t: el.textContent.trim().slice(0, 26), r: Math.round(((Math.max(a, z) + 0.05) / (Math.min(a, z) + 0.05)) * 100) / 100 });
  }
  out.sort((x, y) => x.r - y.r);
  return { floor, lowest: out.slice(0, 3), fails: out.filter((x) => x.r < 4.5) };
};

for (const w of [1280, 1024, 390]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w >= 1024 ? 800 : 844 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + '/services', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const el = await p.$('.ib');
  await el.evaluate((n) => n.scrollIntoView({ block: 'start' }));
  await p.evaluate(() => window.scrollBy(0, -90));
  await wait(400);
  await el.screenshot({ path: path.join(OUT, `marketing-${w}.png`) });
  report[w] = { ...(await p.evaluate(geometry)), ...(await p.evaluate(pairs)) };
  await p.close();
}

/* The pulse, with motion. */
for (const w of [1280]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: 800 });
  await p.goto(BASE + '/services', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.$eval('.ib__stage', (n) => n.scrollIntoView({ block: 'center' }));
  const t0 = Date.now();
  const samples = [];
  let shot = false;
  while (Date.now() - t0 < 8400) {
    const v = await p.evaluate(() => {
      const dot = document.querySelector('.ib__pulse');
      if (!dot || getComputedStyle(dot).opacity !== '1') return null;
      const r = dot.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      /* The wires take no pointer, so the hit test looks through them: the
         dot is clear when nothing of a card, a label or the inbox is
         there. */
      const top = document.elementFromPoint(x, y);
      return { x: Math.round(x), y: Math.round(y), clear: !(top && top.closest('.ib__slot, .ib__inbox')) };
    });
    if (v) {
      samples.push(v);
      if (w === 1280 && !shot && samples.length >= 4) {
        await (await p.$('.ib')).screenshot({ path: path.join(OUT, 'marketing-1280-pulse.png') });
        shot = true;
      }
    }
    await wait(60);
  }
  report[`pulse${w}`] = { samples: samples.length, covered: samples.filter((s) => !s.clear).map((s) => `${s.x},${s.y}`), path: samples.map((s) => `${s.x},${s.y}`).join(' ') };
  await p.close();
}
await b.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));

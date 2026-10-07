/* final28-shots.mjs: the captures for the founder's final28 review pass
   (2026-10-07). Writes to .measure/out/final28:
     home-tail-1280.png     How it works to the footer, at rest
     marketing-1280.png     the Marketing stage at rest
     marketing-1280-lift.png  the same, 300ms into a play: a card up 6px and
                            the new row's chip in its card's colour
     about-terms-1280.png   the contract, its section
   The 390 contact sheets are anchors.mjs's (contact-<route>-390.png), copied
   here as home-390, pricing-390 and about-390.

     node .measure/final28-shots.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final28');
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new' });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(route, reduce) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }]);
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  return p;
}
async function clip(p, sel, file, { toEnd = false, pad = 0 } = {}) {
  const box = await p.$eval(
    sel,
    (n, [toEnd, pad]) => {
      const r = n.getBoundingClientRect();
      const y = r.top + scrollY - pad;
      return { x: 0, y, width: 1280, height: toEnd ? document.documentElement.scrollHeight - y : r.height + 2 * pad };
    },
    [toEnd, pad]
  );
  await p.screenshot({ path: path.join(OUT, file), clip: box, captureBeyondViewport: true });
  return box;
}

let p = await open('/', true);
await p.addStyleTag({ content: '.bar{display:none!important}' });
const seams = await p.evaluate(() => {
  const els = ['.promise--hiw', '.callband--field', '.foot__sheet', '.foot__base'].map((s) => document.querySelector(s).getBoundingClientRect());
  return els.map((r, i) => ({ top: Math.round(r.top + scrollY), bottom: Math.round(r.bottom + scrollY), left: Math.round(r.left), width: Math.round(r.width), gapAbove: i ? Math.round(r.top - els[i - 1].bottom) : null }));
});
console.log('home tail (band, field, form, footer row):', JSON.stringify(seams));
await clip(p, '.promise--hiw', 'home-tail-1280.png', { toEnd: true });
await p.close();

p = await open('/services', true);
await p.addStyleTag({ content: '.bar{display:none!important}' });
await clip(p, '.ib', 'marketing-1280.png', { pad: 40 });
const gap = await p.evaluate(() => {
  const a = document.querySelector('.ib__places').getBoundingClientRect();
  const c = document.querySelector('.ib__inbox').getBoundingClientRect();
  return { cardsRight: Math.round(a.right), inboxLeft: Math.round(c.left), between: Math.round(c.left - a.right), wires: document.querySelectorAll('.ib__wires').length };
});
console.log('marketing:', JSON.stringify(gap));
await p.close();

/* Motion on: bring the stage half in view and wait into the first play
   (400ms soft start, 6s hold), then 300ms into it. */
p = await open('/services', false);
await p.$eval('.ib__stage', (n) => window.scrollTo(0, n.getBoundingClientRect().top + scrollY - 120));
await wait(400 + 6000 + 300);
await p.addStyleTag({ content: '.bar{display:none!important}' });
const state = await p.evaluate(() => {
  const lifted = [...document.querySelectorAll('.ib__slot')].findIndex((s) => s.classList.contains('is-lift'));
  const chip = document.querySelector('.ib__row--new .ib__chip');
  return { lifted, chip: chip && chip.textContent, ring: chip && getComputedStyle(chip, '::after').opacity };
});
console.log('mid-play:', JSON.stringify(state));
await clip(p, '.ib', 'marketing-1280-lift.png', { pad: 40 });
await p.close();

p = await open('/about-us', true);
await p.addStyleTag({ content: '.bar{display:none!important}' });
await clip(p, '.tc', 'about-terms-1280.png');
const sheet = await p.$eval('.tc__sheet', (n) => {
  const r = n.getBoundingClientRect();
  return { width: Math.round(r.width), left: Math.round(r.left), right: Math.round(1280 - r.right) };
});
console.log('terms sheet:', JSON.stringify(sheet));
await p.close();
await b.close();

for (const [from, to] of [['contact-home-390.png', 'home-390.png'], ['contact-pricing-390.png', 'pricing-390.png'], ['contact-about-us-390.png', 'about-390.png']]) {
  fs.copyFileSync(path.join(OUT, from), path.join(OUT, to));
}

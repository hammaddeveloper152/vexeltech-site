/* final23.mjs: /services, one screen per discipline (the founder's brief of
   2026-10-07; the folder is final23 as the brief names it). Captures into
   .measure/out/final23, and checks, printed as JSON.

     node .measure/final23.mjs [base]

   Captures: services-1280 and services-390 full page, and one discipline
   (Websites) at 390 with Details open.
   Checks:
     heights   at 390 (844 tall), each discipline from its artifact's top to
               its call's bottom, in px and in screens; the brief's bound is
               two screens (1688px)
     order     each band's children in order: artifact, head, facts, call,
               Details
     details   closed by default and inert; opens to its content's height
               over about 250ms; the content is in the page while closed
     promise   "A written number within one business day." once on the page
     pairs     the lowest text contrast in the bands and any under 4.5 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = path.join('.measure', 'out', 'final23');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
const report = {};

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
  for (const el of document.querySelectorAll('.svc2__head *, .svc2__facts *, .svc2__call *, .dt__btn')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el);
    const a = L(rgba(cs.color));
    const z = L(ground(el));
    out.push({ t: el.textContent.trim().slice(0, 24), r: Math.round(((Math.max(a, z) + 0.05) / (Math.min(a, z) + 0.05)) * 100) / 100 });
  }
  out.sort((x, y) => x.r - y.r);
  return { lowest: out.slice(0, 3), fails: out.filter((x) => x.r < 4.5) };
};

for (const w of [1280, 390]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w >= 1024 ? 800 : 844 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + '/services', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await wait(500);
  await p.screenshot({ path: path.join(OUT, `services-${w}.png`), fullPage: true });
  const r = (report[w] = {});
  r.heights = await p.evaluate((vh) =>
    [...document.querySelectorAll('.svc2__d')].map((s) => {
      const top = s.querySelector('.svc2__band').getBoundingClientRect().top;
      const bottom = s.querySelector('.svc2__call').getBoundingClientRect().bottom;
      const h = Math.round(bottom - top);
      return `${s.id}: ${h}px, ${(h / vh).toFixed(2)} screens`;
    }), 844);
  r.order = await p.evaluate(() =>
    [...document.querySelectorAll('.svc2__d')].map((s) => `${s.id}: ${[...s.querySelector('.svc2__in').children].map((c) => c.className.split(' ')[0]).join(' > ')}`)
  );
  r.promise = await p.evaluate(() => (document.querySelector('main').innerText.match(/A written number within one business day\./g) || []).length);
  r.pairs = await p.evaluate(pairs);
  r.closed = await p.evaluate(() =>
    [...document.querySelectorAll('.dt')].map((d) => {
      const panel = d.querySelector('.dt__panel');
      return `${d.querySelector('.dt__btn').getAttribute('aria-expanded')} ${Math.round(panel.getBoundingClientRect().height)}px inert:${panel.inert} text:${panel.textContent.length}`;
    })
  );
  await p.close();
}

/* Details open, with motion, at 390: the height over time, then the shot. */
const p = await b.newPage();
await p.setViewport({ width: 390, height: 844 });
await p.goto(BASE + '/services', { waitUntil: 'networkidle0' });
await p.evaluate(() => document.fonts.ready);
const sec = await p.$('#websites');
await p.$eval('#websites .dt__btn', (n) => n.scrollIntoView({ block: 'center' }));
await wait(300);
await p.click('#websites .dt__btn');
const t0 = Date.now();
const samples = [];
while (Date.now() - t0 < 450) {
  samples.push(`${Date.now() - t0}ms ${await p.$eval('#websites .dt__panel', (n) => Math.round(n.getBoundingClientRect().height))}px`);
  await wait(40);
}
report.open = { samples, after: await p.$eval('#websites .dt__panel', (n) => `${n.style.height} inert:${n.inert}`) };
await wait(300);
/* A clip of the full page at scroll 0, not an element shot: an element
   shot scrolls and stitches, and pastes the sticky bar into the middle. */
await p.evaluate(() => {
  document.activeElement.blur();
  window.scrollTo(0, 0);
});
await wait(300);
const box = await sec.evaluate((n) => {
  const r = n.getBoundingClientRect();
  return { x: 0, y: r.top + window.scrollY, width: document.documentElement.clientWidth, height: r.height };
});
await p.screenshot({ path: path.join(OUT, 'websites-390-details-open.png'), clip: box, captureBeyondViewport: true });
await p.close();
await b.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));

/* final18.mjs: five changes (the founder, 2026-10-06). Since final19 its
   marketing captures read the inbox stage (InboxStage.jsx), and home's
   fields are gone, so its `fields` reads none. Captures into
   .measure/out/final18 at 1280 and 390, and checks, printed as JSON.

     node .measure/final18.mjs [base]

   Captures, each at both widths: branding, branding-typed ("Marlow
   Plumbing" typed), marketing, marketing-loop (a row mid-entry),
   about-close, home-costs.
   Checks:
     pairs   every text element in the desk (all five sets), the report,
             About's close and home's cost cells, against the first opaque
             ground behind it: the lowest four and anything under 4.5 (3.0
             at 24px and up, or 18.66px bold)
     floor   the smallest font size in each
     hidden  anything under opacity 1 at load (reduced motion)
     marg    margin labels on home (should be 0) and on /services (kept)
     words   "Harbor Dental" anywhere in the rendered text of /services
     loop    the arrivals' top time and row count, sampled through an entry
     fields  the lit units in each cost field */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = path.join('.measure', 'out', 'final18');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
const report = {};

const audit = (sel) => {
  const root = document.querySelector(sel);
  if (!root) return null;
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
      if (cs.backgroundImage.includes('linear-gradient') && !cs.backgroundImage.includes('repeating')) return null;
    }
    return [11, 11, 13];
  };
  const out = [];
  let floor = 99;
  const hidden = [];
  for (const el of root.querySelectorAll('*')) {
    if (el.closest('.xf__old')) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (!r.width || cs.display === 'none') continue;
    if (Number(cs.opacity) < 1) hidden.push(String(el.className.baseVal ?? el.className));
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    floor = Math.min(floor, parseFloat(cs.fontSize));
    const g = ground(el);
    if (!g) continue;
    const a = L(rgba(cs.color));
    const z = L(g);
    const ratio = (Math.max(a, z) + 0.05) / (Math.min(a, z) + 0.05);
    const big = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && Number(cs.fontWeight) >= 700);
    out.push({ t: el.textContent.trim().slice(0, 28), r: Math.round(ratio * 100) / 100, big });
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
  return el;
}

for (const w of [1280, 390]) {
  const r = (report[w] = {});
  const s = await open(w, '/services');
  await shot(s, '.bd', `branding-${w}.png`);
  r.desk = [];
  for (let k = 0; k < 5; k += 1) {
    await s.evaluate((k) => document.querySelectorAll('.bd__set')[k].click(), k);
    await wait(450);
    r.desk.push(await s.evaluate(audit, '.bd'));
  }
  await s.evaluate(() => document.querySelectorAll('.bd__set')[0].click());
  await wait(400);
  await s.type('#bd-name', 'Marlow Plumbing');
  await wait(300);
  await shot(s, '.bd', `branding-${w}-typed.png`);
  r.typedMark = await s.$eval('.bd__sign .mg', (n) => n.textContent);
  await shot(s, '.ib', `marketing-${w}.png`);
  r.report = await s.evaluate(audit, '.ib');
  r.harbor = await s.evaluate(() => /Harbor Dental/.test(document.body.innerText));
  r.margServices = await s.$$eval('.marg', (n) => n.length);
  await s.close();

  /* The loop, with motion. */
  const m = await open(w, '/services', false);
  const mr = await m.$('.ib__inbox');
  await mr.evaluate((n) => n.scrollIntoView({ block: 'center' }));
  const t0 = Date.now();
  r.loop = [];
  let got = false;
  while (Date.now() - t0 < 1400) {
    const v = await m.evaluate(() => {
      const rows = document.querySelectorAll('.ib__row');
      return `${rows.length} rows, top ${rows[0].querySelector('.ib__time').textContent}, cycle ${document.querySelector('.ib__rows').dataset.cycle || '-'}`;
    });
    r.loop.push(`${Date.now() - t0}ms ${v}`);
    if (!got && v.startsWith('9')) {
      await (await m.$('.ib')).screenshot({ path: path.join(OUT, `marketing-${w}-loop.png`) });
      got = true;
    }
    await wait(60);
  }
  await m.close();

  const a = await open(w, '/about-us');
  await shot(a, '.ac', `about-close-${w}.png`);
  r.close = await a.evaluate(audit, '.ac');
  await a.close();

  const h = await open(w, '/');
  await shot(h, '.cc', `home-costs-${w}.png`);
  r.costs = await h.evaluate(audit, '.cc');
  r.margHome = await h.$$eval('.marg', (n) => n.length);
  r.fields = await h.$$eval('.cc__field', (fs) => fs.map((f) => `${f.querySelectorAll('.cc__base > *').length} base, ${f.querySelectorAll('.cc__lit > *').length} lit, ${Math.round(f.getBoundingClientRect().width)}x${Math.round(f.getBoundingClientRect().height)}`));
  await h.close();
}
await b.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));

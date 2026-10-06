/* final17.mjs: the two /services artifacts (the founder, 2026-10-06).
   Captures into .measure/out/final17, and checks, printed as JSON.

     node .measure/final17.mjs [base]

   Captures: branding-1280, branding-1280-set3 (the third set),
   branding-390, marketing-1280, marketing-1280-call (the strip mid-hold),
   marketing-390.
   Checks:
     pairs    every text element in both stages, in every one of the five
              sets: its colour against the first opaque ground behind it;
              the lowest five per set, and any under 4.5 (3.0 for 24px+)
     floor    the smallest font size in each stage
     hidden   elements at opacity under 1 at load (reduced motion)
     words    the platform words on the Marketing sheet: anything in the
              sheet's chrome that is not Sponsored, Places, Call, Directions
              or content (names, figures) is listed for a read
     loop     with motion: the Call pill's state, the strip's presence and
              the two figures, sampled through one play */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = path.join('.measure', 'out', 'final17');
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
      if ((m[3] === undefined || m[3] >= 0.9) && !(m.length === 4 && m[3] === 0)) return m;
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
    if (Number(cs.opacity) < 1) hidden.push(el.className.baseVal ?? el.className);
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

async function open(w, reduced = true) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w >= 1024 ? 800 : 844 });
  if (reduced) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + '/services', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  return p;
}

for (const w of [1280, 390]) {
  const r = (report[w] = {});
  const p = await open(w);
  for (const [id, sel] of [['branding', '.bd'], ['marketing', '.ssf']]) {
    const el = await p.$(sel);
    await el.evaluate((n) => n.scrollIntoView({ block: 'start' }));
    await p.evaluate(() => window.scrollBy(0, -90));
    await wait(400);
    await el.screenshot({ path: path.join(OUT, `${id}-${w}.png`) });
    r[id] = {};
    for (let s = 0; s < 5; s += 1) {
      await p.evaluate((s) => document.querySelectorAll('.bd__set')[s].click(), s);
      await wait(450);
      r[id][`set${s + 1}`] = await p.evaluate(audit, sel);
      if (w === 1280 && id === 'branding' && s === 2) await el.screenshot({ path: path.join(OUT, 'branding-1280-set3.png') });
    }
    await p.evaluate(() => document.querySelectorAll('.bd__set')[0].click());
    await wait(400);
  }
  r.words = await p.evaluate(() => {
    const chrome = ['.ss2__sp', '.ss2__places', '.ss2__pill'];
    return [...new Set(chrome.flatMap((s) => [...document.querySelectorAll(s)].map((n) => n.textContent.trim())))];
  });
  r.google = await p.evaluate(() => /google/i.test(document.querySelector('.ss2__sheet').textContent));
  await p.close();
}

/* The loop, with motion, at 1280. */
const m = await open(1280, false);
const st = await m.$('.ssf');
await st.evaluate((n) => n.scrollIntoView({ block: 'center' }));
const t0 = Date.now();
const samples = [];
let shot = false;
while (Date.now() - t0 < 5200) {
  const s = await m.evaluate(() => ({
    pressed: document.querySelector('.ss2__row--you .ss2__pill--call').classList.contains('is-pressed'),
    strip: !!document.querySelector('.xf > .ss2 .ss2__call'),
    figs: [...document.querySelectorAll('.xf > .ss2 .ss2__tick')].map((n) => n.textContent).join('/'),
  }));
  samples.push(`${Date.now() - t0}ms ${s.pressed ? 'P' : '-'} ${s.strip ? 'strip' : '     '} ${s.figs}`);
  if (!shot && s.strip && Date.now() - t0 > 1800) {
    await st.screenshot({ path: path.join(OUT, 'marketing-1280-call.png') });
    shot = true;
  }
  await wait(250);
}
report.loop = samples;
await m.close();
await b.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));

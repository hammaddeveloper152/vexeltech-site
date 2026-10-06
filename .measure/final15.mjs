/* final15.mjs: the approved frames (the founder, 2026-10-06). Captures and
   behaviour for the two /services sliders and home's cited costs, at 1280
   and 390, into .measure/out/final15.

     node .measure/final15.mjs [base]

   Captures: each slider at rest (50%, the drift held by reduced motion),
   each at 35% and 65% (set by keyboard), home's What it costs you, and the
   footer's legal row. Checks, printed as JSON:
     keys     focus the handle, ArrowRight twice: 50 to 54; End: 100
     touch    a touch drag across the stage moves the divider (CDP touch)
     drift    with motion allowed, the divider moves on its own in view
     hidden   no element in the three sections or the footer row paints at
              opacity under 1 or visibility hidden at load
     text     the smallest font size inside each section (the 11px floor)
     pairs    every text node in the sections: its colour against the
              first opaque ground behind it, the lowest ratio reported */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = path.join('.measure', 'out', 'final15');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
const report = {};

async function page(w, reduced) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w >= 1024 ? 800 : 844, deviceScaleFactor: 1, hasTouch: w < 1024 });
  if (reduced) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  return p;
}

const SECTIONS = { branding: '#branding', marketing: '#marketing', costs: '.cc', legal: '.foot__legal' };

const audit = (sel) => {
  const root = document.querySelector(sel);
  if (!root) return null;
  const lum = (c) => {
    const m = c.match(/[\d.]+/g).map(Number);
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return [0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]), m[3] === undefined ? 1 : m[3]];
  };
  const groundOf = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      const m = bg.match(/[\d.]+/g);
      if (m && (m[3] === undefined || Number(m[3]) >= 0.9) && getComputedStyle(n).backgroundImage === 'none') return bg;
      if (getComputedStyle(n).backgroundImage !== 'none') return null;
    }
    return 'rgb(11, 11, 13)';
  };
  let hidden = [];
  let minFont = 99;
  let worst = [];
  for (const el of root.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (Number(cs.opacity) < 1 || cs.visibility === 'hidden') {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) hidden.push(`${el.className} ${cs.opacity}`);
    }
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || cs.display === 'none') continue;
    minFont = Math.min(minFont, parseFloat(cs.fontSize));
    const g = groundOf(el);
    if (!g) continue;
    const [l1] = lum(cs.color);
    const [l2] = lum(g);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    worst.push({ t: el.textContent.trim().slice(0, 32), fg: cs.color, bg: g, ratio: Math.round(ratio * 100) / 100 });
  }
  worst.sort((a, z) => a.ratio - z.ratio);
  return { hidden: hidden.slice(0, 8), minFont, lowest: worst.slice(0, 5) };
};

for (const w of [1280, 390]) {
  const r = (report[w] = {});
  /* Rest, reduced motion: no drift, the divider at 50. */
  const p = await page(w, true);
  await p.goto(BASE + '/services', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await wait(400);
  for (const id of ['branding', 'marketing']) {
    const fig = await p.$(`#${id} .ba`);
    await fig.evaluate((n) => n.scrollIntoView({ block: 'center' }));
    await wait(300);
    r[`${id}-audit`] = await p.evaluate(audit, `#${id} .ba`);
    await fig.screenshot({ path: path.join(OUT, `${id}-${w}-50.png`) });
    const h = await p.$(`#${id} .ba__handle`);
    await h.focus();
    await p.keyboard.press('ArrowRight');
    await p.keyboard.press('ArrowRight');
    const v54 = await h.evaluate((n) => n.getAttribute('aria-valuenow'));
    for (let i = 0; i < 6; i += 1) await p.keyboard.press('ArrowRight');
    await fig.screenshot({ path: path.join(OUT, `${id}-${w}-65.png`) });
    for (let i = 0; i < 15; i += 1) await p.keyboard.press('ArrowLeft');
    await fig.screenshot({ path: path.join(OUT, `${id}-${w}-35.png`) });
    await p.keyboard.press('End');
    const v100 = await h.evaluate((n) => n.getAttribute('aria-valuenow'));
    await p.keyboard.press('Home');
    const v0 = await h.evaluate((n) => n.getAttribute('aria-valuenow'));
    r[`${id}-keys`] = { after2Right: v54, end: v100, home: v0 };
    await p.keyboard.press('Tab');
  }
  /* Branding with a typed name. */
  await p.$eval('#by-name', (n) => n.scrollIntoView({ block: 'center' }));
  await p.type('#by-name', 'Ridge Plumbing');
  await wait(300);
  await (await p.$('#branding .by')).screenshot({ path: path.join(OUT, `branding-${w}-typed.png`) });
  await p.close();

  /* Touch drag at 390, a mouse drag at 1280. */
  const q = await page(w, true);
  await q.goto(BASE + '/services', { waitUntil: 'networkidle0' });
  for (const id of ['branding', 'marketing']) {
    const stage = await q.$(`#${id} .ba__stage`);
    await stage.evaluate((n) => n.scrollIntoView({ block: 'center' }));
    await wait(200);
    const box = await stage.boundingBox();
    const y = box.y + box.height * 0.3;
    if (w < 1024) {
      await q.touchscreen.touchStart(box.x + box.width * 0.5, y);
      await q.touchscreen.touchMove(box.x + box.width * 0.4, y);
      await q.touchscreen.touchMove(box.x + box.width * 0.2, y);
      await q.touchscreen.touchEnd();
    } else {
      await q.mouse.move(box.x + box.width * 0.5, y);
      await q.mouse.down();
      await q.mouse.move(box.x + box.width * 0.2, y, { steps: 5 });
      await q.mouse.up();
    }
    r[`${id}-drag`] = await q.$eval(`#${id} .ba__handle`, (n) => n.getAttribute('aria-valuenow'));
  }
  await q.close();

  /* The drift, motion allowed. */
  const d = await page(w, false);
  await d.goto(BASE + '/services', { waitUntil: 'networkidle0' });
  const st = await d.$('#marketing .ba__stage');
  await st.evaluate((n) => n.scrollIntoView({ block: 'center' }));
  await d.mouse.move(1, 1);
  const xs = [];
  for (let i = 0; i < 4; i += 1) {
    await wait(1200);
    xs.push(await st.evaluate((n) => n.style.getPropertyValue('--x')));
  }
  r.drift = xs;
  await d.close();

  /* Home. */
  const h = await page(w, true);
  await h.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await h.evaluate(() => document.fonts.ready);
  r['costs-audit'] = await h.evaluate(audit, '.cc');
  const cc = await h.$('.cc');
  await cc.evaluate((n) => n.scrollIntoView({ block: 'start' }));
  await wait(300);
  await cc.screenshot({ path: path.join(OUT, `home-costs-${w}.png`) });
  const lg = await h.$('.foot__band');
  await lg.evaluate((n) => n.scrollIntoView({ block: 'center' }));
  await wait(300);
  r['legal-audit'] = await h.evaluate(audit, '.foot__legal');
  r.sources = await h.$$eval('.foot__src', (a) => a.map((n) => [n.textContent, n.href, n.target, n.rel, Math.round(n.getBoundingClientRect().height)]));
  await lg.screenshot({ path: path.join(OUT, `footer-${w}.png`) });
  await h.close();
}
await b.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));

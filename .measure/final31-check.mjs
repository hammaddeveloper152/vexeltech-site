/* final31-check.mjs: the three changes before upload (2026-10-07).
   Writes to .measure/out/final31 and prints what it measured:
     desk-autoplay-1280.png   the branding desk mid-type, then its sequence
                              of names and sets, then that a focus stops it
     desk-reduced             under reduced motion: Harbor & Vale, static
     chips-390.png, chips-1280.png   the chip row, at rest, with row counts
     home-tail-1280.png, home-tail-390.png   How it works to the footer
     chip contrast             every chip's text against the paper

     node .measure/final31-check.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final31');
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new' });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(route, w, reduce) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }]);
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  return p;
}
const state = (p) =>
  p.evaluate(() => ({
    field: document.getElementById('bd-name').value,
    sign: document.querySelector('.bd__sign-w')?.textContent.trim(),
    set: document.querySelector('.bd__set[aria-checked="true"]')?.getAttribute('aria-label'),
  }));

/* 1. The desk's autoplay, motion on. */
{
  const p = await open('/services', 1280, false);
  await p.$eval('.bd', (n) => window.scrollTo(0, n.getBoundingClientRect().top + scrollY - 40));
  const seen = [];
  for (let i = 0; i < 17; i += 1) {
    await wait(1000);
    seen.push(`${i + 1}s ${JSON.stringify(await state(p))}`);
    if (i === 8) await p.screenshot({ path: path.join(OUT, 'desk-autoplay-1280.png') });
  }
  console.log('autoplay, one reading a second:\n  ' + seen.join('\n  '));
  await p.focus('#bd-name');
  const atFocus = await state(p);
  await wait(8000);
  console.log('focused:', JSON.stringify(atFocus), '8s later:', JSON.stringify(await state(p)));
  await p.keyboard.type('Rook & Co');
  console.log('typed:', JSON.stringify(await state(p)));
  await p.close();
}
{
  const p = await open('/services', 1280, true);
  await p.$eval('.bd', (n) => window.scrollTo(0, n.getBoundingClientRect().top + scrollY - 40));
  await wait(10000);
  console.log('reduced motion, 10s in view:', JSON.stringify(await state(p)));
  await p.close();
}

/* 2. The chips. */
for (const w of [1280, 390]) {
  const p = await open('/services', w, true);
  await p.addStyleTag({ content: '.bar{display:none!important}' });
  const r = await p.$eval('.at__chips', (n) => {
    const tops = new Set([...n.querySelectorAll('.at__chip')].map((c) => Math.round(c.getBoundingClientRect().top)));
    const box = n.getBoundingClientRect();
    return { rows: tops.size, y: box.top + scrollY, h: box.height, on: n.querySelectorAll('.is-on').length };
  });
  await p.screenshot({ path: path.join(OUT, `chips-${w}.png`), clip: { x: 0, y: r.y - 30, width: w, height: r.h + 60 }, captureBeyondViewport: true });
  console.log(`chips @${w}: ${r.rows} rows, ${r.on} lit`);
  if (w === 1280) {
    const pairs = await p.$$eval('.at__chip', (cs) =>
      cs.map((c) => {
        const parse = (v) => (v.match(/[\d.]+/g) || []).map(Number);
        const lum = ([r, g, bl]) => {
          const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl);
        };
        const fg = parse(getComputedStyle(c).color);
        const paper = [244, 239, 230];
        const [x, y] = [lum(fg), lum(paper)].sort((m, n) => n - m);
        return `${c.textContent} ${((x + 0.05) / (y + 0.05)).toFixed(2)}:1`;
      })
    );
    console.log('chip text on the paper:', pairs.join(' | '));
  }
  await p.close();
}

/* 3. Home's tail. */
for (const w of [1280, 390]) {
  const p = await open('/', w, true);
  await p.addStyleTag({ content: '.bar{display:none!important}' });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
  });
  const box = await p.$eval('.promise--hiw', (n) => {
    const r = n.getBoundingClientRect();
    return { y: r.top + scrollY, h: document.documentElement.scrollHeight - (r.top + scrollY) };
  });
  await p.screenshot({ path: path.join(OUT, `home-tail-${w}.png`), clip: { x: 0, y: box.y, width: w, height: box.h }, captureBeyondViewport: true });
  const grounds = await p.evaluate(() =>
    ['.promise--hiw', '.callband--cream', '.foot__sheet'].map((s) => {
      const n = document.querySelector(s);
      const r = n.getBoundingClientRect();
      return `${s} ${getComputedStyle(n).backgroundColor} ${Math.round(r.top + scrollY)}-${Math.round(r.bottom + scrollY)}`;
    })
  );
  console.log(`tail @${w}:`, grounds.join(' | '));
  await p.close();
}
await b.close();

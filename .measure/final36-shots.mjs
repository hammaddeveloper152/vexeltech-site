/* final36-shots.mjs: the captures for final36 (2026-10-08, the founder),
   and the Monigue coverage check. Writes into .measure/out/final36/:
     home-390.png, home-1280.png, services-390.png, pricing-390.png,
     about-us-390.png                     full page, at rest
     wwd-card-press-390.png               a What we do card held in :active
   and prints every character set in Monigue on every route that the
   subset file does not carry (none is a pass).
     node .measure/final36-shots.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final36');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
const open = async (route, w) => {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 25));
    }
    window.scrollTo(0, 0);
  });
  await wait(200);
  return p;
};

/* Monigue coverage: every character in an element set in Monigue. */
const chars = new Set();
for (const route of ['/', '/services', '/pricing', '/about-us', '/contact-us', '/thanks', '/nope', '/privacy-policy', '/terms-of-service']) {
  const p = await open(route, 1280);
  const t = await p.evaluate(() =>
    [...document.querySelectorAll('body *')]
      .filter((e) => /^"?Monigue/.test(getComputedStyle(e).fontFamily) && [...e.childNodes].some((n) => n.nodeType === 3))
      .map((e) => {
        const s = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('');
        return getComputedStyle(e).textTransform === 'uppercase' ? s.toUpperCase() : s;
      })
      .join('')
  );
  for (const c of t) if (c.trim()) chars.add(c);
  await p.close();
}
const font = fs.readFileSync('public/fonts/monigue.woff2');
const p0 = await b.newPage();
await p0.goto(BASE + '/');
const missing = await p0.evaluate(
  async (b64, list) => {
    const f = new FontFace('MonigueCheck', `url(data:font/woff2;base64,${b64})`);
    await f.load();
    document.fonts.add(f);
    const c = document.createElement('canvas').getContext('2d');
    /* A character the face lacks falls to the fallback: measure it against
       two fallbacks of different widths; a covered one measures the same. */
    return list.filter((ch) => {
      c.font = '100px MonigueCheck, monospace';
      const a = c.measureText(ch).width;
      c.font = '100px MonigueCheck, serif';
      return a !== c.measureText(ch).width;
    });
  },
  font.toString('base64'),
  [...chars]
);
await p0.close();
console.log(`Monigue on the site: ${chars.size} distinct characters; missing from the subset: ${missing.length ? missing.join(' ') : 'none'}`);

for (const [route, name, w] of [
  ['/', 'home-390', 390],
  ['/', 'home-1280', 1280],
  ['/services', 'services-390', 390],
  ['/pricing', 'pricing-390', 390],
  ['/about-us', 'about-us-390', 390],
]) {
  const p = await open(route, w);
  await p.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  await p.close();
}

/* A What we do card held down: the pointer pressed on the first card and
   not released, with motion on so the press shows. */
{
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => document.querySelector('.wwd__card').scrollIntoView({ block: 'center' }));
  await wait(600);
  const r = await p.evaluate(() => {
    const e = document.querySelector('.wwd__card').getBoundingClientRect();
    return { x: e.left + e.width / 2, y: e.top + e.height / 2 };
  });
  await p.mouse.move(r.x, r.y);
  await p.mouse.down();
  await wait(400);
  const st = await p.evaluate(() => {
    const e = document.querySelector('.wwd__card');
    return { active: e.matches(':active'), transform: getComputedStyle(e).transform, shadow: getComputedStyle(e).boxShadow, after: getComputedStyle(e.parentElement, '::after').content };
  });
  console.log('card press', JSON.stringify(st));
  await p.screenshot({ path: path.join(OUT, 'wwd-card-press-390.png') });
  await p.mouse.up();
  await p.close();
}
await b.close();

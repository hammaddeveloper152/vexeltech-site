/* final40-shots.mjs: the captures for final40 (2026-10-08, the founder).
   Full pages at rest (reduced motion), The Next Size alone at 1024, and
   (addendum 2) a /pricing FAQ row under the pointer, question 2, motion on;
   (addendum 3) the hero's call under the pointer at 1280 and held down at
   390, motion on, with its transform and fill printed. Writes into .measure/out/final40/.
     node .measure/final40-shots.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final40');
fs.mkdirSync(OUT, { recursive: true });
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
  await new Promise((r) => setTimeout(r, 200));
  return p;
};
for (const [route, name, w] of [
  ['/', 'home-390', 390],
  ['/', 'home-1280', 1280],
  ['/about-us', 'about-us-390', 390],
  ['/services', 'services-390', 390],
]) {
  const p = await open(route, w);
  await p.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  await p.close();
}
for (const w of [1024]) {
  const p = await open('/about-us', w);
  /* The sticky bar and the skip link stand over a cropped section. */
  await p.addStyleTag({ content: '.bar, .skip { visibility: hidden !important; }' });
  const el = await p.$('section.ns');
  await el.screenshot({ path: path.join(OUT, `about-nextsize-${w}.png`) });
  await p.close();
}
{
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  await p.goto(BASE + '/pricing', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: '.bar, .skip { visibility: hidden !important; }' });
  const q = (await p.$$('.faq__btn'))[1];
  await q.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await new Promise((r) => setTimeout(r, 300));
  await q.hover();
  await new Promise((r) => setTimeout(r, 400));
  const st = await q.evaluate((e) => ({
    shift: getComputedStyle(e.querySelector('.faq__q-t')).transform,
    turn: getComputedStyle(e.querySelector('.faq__mark')).transform,
  }));
  console.log('faq hover', JSON.stringify(st));
  const box = await p.evaluate(() => {
    const r = document.querySelectorAll('.faq__item')[1].getBoundingClientRect();
    return { x: 0, y: Math.max(0, r.top - 120 + scrollY), width: 1280, height: r.height + 240 };
  });
  await p.screenshot({ path: path.join(OUT, 'pricing-faq-hover-1280.png'), clip: box, captureBeyondViewport: false });
  await p.close();
}
for (const [w, name, press] of [
  [1280, 'button-hover-1280', false],
  [390, 'button-press-390', true],
]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const e = document.querySelector('.hero__cta').getBoundingClientRect();
    return { x: e.left + e.width / 2, y: e.top + e.height / 2, left: e.left, top: e.top, w: e.width, h: e.height };
  });
  await p.mouse.move(r.x, r.y);
  if (press) await p.mouse.down();
  await new Promise((res) => setTimeout(res, press ? 60 : 400));
  const st = await p.evaluate(() => {
    const cs = getComputedStyle(document.querySelector('.hero__cta'));
    return { transform: cs.transform, fill: cs.backgroundColor };
  });
  console.log(name, JSON.stringify(st));
  await p.screenshot({ path: path.join(OUT, `${name}.png`), clip: { x: Math.max(0, r.left - 40), y: Math.max(0, r.top - 40), width: Math.min(w - Math.max(0, r.left - 40), r.w + 80), height: r.h + 80 }, captureBeyondViewport: false });
  if (press) {
    await p.mouse.move(1, 1);
    await p.mouse.up();
  }
  await p.close();
}
await b.close();
console.log('ok');

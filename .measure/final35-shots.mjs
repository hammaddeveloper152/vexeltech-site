/* final35-shots.mjs: the captures for final35 (2026-10-08, the founder).
   Writes into .measure/out/final35/:
     home-390.png, home-1280.png              home, full page, at rest
     footer-legal-hover-1280.png              the pointer over "Privacy"
     footer-legal-focus-390.png               keyboard focus on "Terms"
     fix-*.png                                one per fixed control, at the
                                              width where it failed; a
                                              target's box is marked by a
                                              dashed magenta frame drawn
                                              over the page for the capture
     node .measure/final35-shots.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final35');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });

const open = async (route, w, { reduce = true } = {}) => {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
  if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 25));
    }
  });
  return p;
};

/* Mark an element's hit box (its own box, or an absolute ::before's). */
const mark = (p, sel, i = 0) =>
  p.evaluate(
    (sel, i) => {
      const e = document.querySelectorAll(sel)[i];
      const r = e.getBoundingClientRect();
      const d = document.createElement('div');
      d.className = 'shot-mark';
      Object.assign(d.style, {
        position: 'absolute',
        left: `${r.left + scrollX}px`,
        top: `${r.top + scrollY}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
        outline: '1px dashed #ff00ff',
        pointerEvents: 'none',
        zIndex: 99999,
      });
      document.body.appendChild(d);
      return `${Math.round(r.width)}x${Math.round(r.height)}`;
    },
    sel,
    i
  );

/* A clip around an element, padded, inside the viewport. */
const around = (p, sel, pad = 80, i = 0) =>
  p.evaluate(
    (sel, pad, i) => {
      const e = document.querySelectorAll(sel)[i];
      const r = e.getBoundingClientRect();
      /* Page coordinates, held inside the current viewport. */
      const x = Math.max(0, r.left - pad);
      const y = Math.max(0, r.top - pad);
      return { x: x + scrollX, y: y + scrollY, width: Math.min(innerWidth - x, r.width + pad * 2), height: Math.min(innerHeight - y, r.height + pad * 2) };
    },
    sel,
    pad,
    i
  );

const center = (p, sel, i = 0) =>
  p.evaluate(
    (sel, i) => {
      document.querySelectorAll(sel)[i].scrollIntoView({ block: 'center' });
    },
    sel,
    i
  );

/* Home, full page. */
for (const w of [390, 1280]) {
  const p = await open('/', w);
  await p.evaluate(() => window.scrollTo(0, 0));
  await wait(200);
  await p.screenshot({ path: path.join(OUT, `home-${w}.png`), fullPage: true });
  await p.close();
}

/* The footer's legal row: the pointer over "Privacy" at 1280. */
{
  const p = await open('/', 1280);
  await center(p, '.sf__a--legal', 0);
  await wait(150);
  await p.hover('.sf__a--legal');
  await wait(200);
  await p.screenshot({ path: path.join(OUT, 'footer-legal-hover-1280.png'), captureBeyondViewport: false, clip: await around(p, '.sf__legal', 60) });
  await p.close();
}

/* Keyboard focus on "Terms" at 390: Tab until it is focused. */
{
  const p = await open('/', 390);
  await p.evaluate(() => window.scrollTo(0, 0));
  for (let i = 0; i < 120; i += 1) {
    await p.keyboard.press('Tab');
    const on = await p.evaluate(() => document.activeElement?.textContent.trim() === 'Terms');
    if (on) break;
  }
  await p.evaluate(() => document.activeElement.scrollIntoView({ block: 'center' }));
  await wait(150);
  await p.screenshot({ path: path.join(OUT, 'footer-legal-focus-390.png'), captureBeyondViewport: false, clip: await around(p, '.sf__legal', 40) });
  await p.close();
}

/* Fixed: "Terms" is 48 wide (38 before), 1280. */
{
  const p = await open('/', 1280);
  await center(p, '.sf__a--legal', 1);
  await wait(150);
  const box = await mark(p, '.sf__a--legal', 1);
  await p.screenshot({ path: path.join(OUT, 'fix-footer-terms-target-1280.png'), captureBeyondViewport: false, clip: await around(p, '.sf__legal', 40) });
  console.log('Terms target', box);
  await p.close();
}

/* Fixed: the cost row's dots, 48 wide (32 before), 390. */
{
  const p = await open('/', 390);
  await center(p, '.cc__dots');
  await wait(150);
  const boxes = [];
  for (let i = 0; i < 4; i += 1) boxes.push(await mark(p, '.cc__dot', i));
  await p.screenshot({ path: path.join(OUT, 'fix-cost-dots-390.png'), captureBeyondViewport: false, clip: await around(p, '.cc__dots', 120) });
  console.log('cost dots', boxes.join(' '));
  await p.close();
}

/* Fixed: /thanks' phone link, 48 tall (28 before), 390. */
{
  const p = await open('/thanks', 390);
  await center(p, '.legal__lead a');
  await wait(150);
  const box = await mark(p, '.legal__lead a');
  await p.screenshot({ path: path.join(OUT, 'fix-thanks-phone-target-390.png'), captureBeyondViewport: false, clip: await around(p, '.legal__lead', 40) });
  console.log('thanks phone', box);
  await p.close();
}

/* Fixed: a pricing card under the pointer, its button hovered: no lift,
   no scale, no glow, 1280. */
{
  const p = await open('/pricing', 1280);
  await center(p, '.pr-col__btn', 0);
  await wait(150);
  await p.hover('.pr-col__btn');
  await wait(400);
  await p.screenshot({ path: path.join(OUT, 'fix-pricing-card-hover-1280.png'), captureBeyondViewport: false, clip: await around(p, '.pr-col', 40, 0) });
  await p.close();
}

/* Fixed: an FAQ row under the pointer: the question does not slide, the
   mark does not turn, no rule draws, 1280 (/pricing). */
{
  const p = await open('/pricing', 1280);
  await center(p, '.faq__btn', 1);
  await wait(150);
  await p.hover('.faq__btn');
  await p.mouse.move(0, 0);
  const handles = await p.$$('.faq__btn');
  await handles[1].hover();
  await wait(400);
  await p.screenshot({ path: path.join(OUT, 'fix-faq-row-hover-1280.png'), captureBeyondViewport: false, clip: await around(p, '.faq__item', 40, 1) });
  await p.close();
}

/* Fixed: the Recent work accordion says which panel is open: the third
   panel focused by keyboard, aria-expanded printed on the capture, 1280. */
{
  const p = await open('/', 1280);
  await center(p, '.wa__row');
  const links = await p.$$('.wa__link');
  await links[2].focus();
  await p.keyboard.press('Space');
  await wait(700);
  const states = await p.$$eval('.wa__link', (ls) => ls.map((l) => l.getAttribute('aria-expanded')));
  await p.evaluate((s) => {
    const d = document.createElement('div');
    d.textContent = `aria-expanded: ${s.join(' ')}`;
    Object.assign(d.style, { position: 'fixed', left: '16px', top: '16px', padding: '6px 10px', background: '#ff00ff', color: '#fff', font: '13px monospace', zIndex: 99999 });
    document.body.appendChild(d);
  }, states);
  await p.screenshot({ path: path.join(OUT, 'fix-accordion-state-1280.png') });
  console.log('accordion', states.join(' '));
  await p.close();
}

/* Fixed: the underline token, hovered, on the three links that were not on
   it (the hero's question link, What we do's "See" link, the form's privacy
   link), 1280. */
for (const [sel, name] of [
  ['.hero__cta--line', 'hero-link'],
  ['.wwd__link', 'whatwedo-see-link'],
  ['.lf__privacy a', 'form-privacy-link'],
]) {
  const p = await open('/', 1280);
  await center(p, sel);
  await wait(150);
  await p.hover(sel);
  await wait(200);
  const ul = await p.$eval(sel, (e) => {
    const c = getComputedStyle(e);
    return `${c.textUnderlineOffset} ${c.textDecorationThickness}`;
  });
  await p.screenshot({ path: path.join(OUT, `fix-underline-${name}-1280.png`), captureBeyondViewport: false, clip: await around(p, sel, 40) });
  console.log(name, ul);
  await p.close();
}

await b.close();

/* split.mjs: the bundle split, 2026-10-01 (the founder's perf pass).

   1. Per route at 390: which of the animation chunks (gsap, ScrollTrigger,
      lenis) were fetched, and when, against the first contentful paint.
   2. Home: the scrubs still run (the route lights, the word drifts) and
      Lenis is on. /pricing: the Plan Builder still answers a pick.
   3. A client navigation from / to /services: the destination's h1 is in
      the document on the click's own commit.
   4. The footer's pages at 1280: how many rows, on every route.
   5. Frames of / and /services at 1280 and 390, before and after, the film
      held at 0.5s in both, and the pixels above the footer that differ
      (pngjs).

   The merged stylesheet was also checked against the eager build's
   (index-*.css then legal-*.css) byte for byte: identical but for the
   footer's 16px and its right hang, and Vite's trailing marker comment.

   Usage: node .measure/split.mjs [after-base] [before-base]
   Frames go to .measure/out/split/. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const AFTER = process.argv[2] || 'http://localhost:4173';
const BEFORE = process.argv[3] || 'http://localhost:4174';
const OUT = path.join(HERE, 'out', 'split');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us'];
const LIBS = /\/assets\/(gsap|ScrollTrigger|lenis)-/;
const errors = [];
const out = { libs: {}, home: null, pricing: null, nav: null, footer: {}, frames: {} };

const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });

/* 1 to 4 */
for (const route of ROUTES) {
  const p = await b.newPage();
  p.on('console', (m) => m.type() === 'error' && errors.push(`${route}: ${m.text()}`));
  p.on('pageerror', (e) => errors.push(`${route}: ${e.message}`));
  await p.setViewport({ width: 390, height: 844 });
  await p.goto(AFTER + route, { waitUntil: 'networkidle0' });
  await wait(800);
  out.libs[route] = await p.evaluate((src) => {
    const re = new RegExp(src);
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    return {
      fcp: fcp ? Math.round(fcp.startTime) : null,
      fetched: performance
        .getEntriesByType('resource')
        .filter((e) => re.test(e.name))
        .map((e) => `${e.name.match(re)[1]} @ ${Math.round(e.startTime)}ms`),
    };
  }, LIBS.source);

  if (route === '/') {
    const before = await p.evaluate(() => document.querySelectorAll('.route__stop[data-reached="true"]').length);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 400) {
      await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
      await wait(120);
    }
    out.home = await p.evaluate((before) => ({
      routeLitBeforeScroll: before,
      routeLitAfterScroll: document.querySelectorAll('.route__stop[data-reached="true"]').length,
      wordTransform: getComputedStyle(document.querySelector('.wordband__word')).transform,
      lenis: document.documentElement.classList.contains('lenis'),
    }), before);
  } else {
    out.libs[route].lenis = await p.evaluate(() => document.documentElement.classList.contains('lenis'));
  }

  if (route === '/pricing') {
    await p.evaluate(() => document.querySelector('.plan [data-choice]').scrollIntoView({ block: 'center' }));
    await wait(300);
    const q1 = await p.evaluate(() => document.querySelector('.plan [data-choice]').closest('[class*="plan__q"]')?.textContent.slice(0, 40));
    await p.click('.plan [data-choice]');
    await wait(500);
    out.pricing = await p.evaluate((q1) => ({
      firstQuestion: q1,
      picked: document.querySelectorAll('.plan [data-choice][aria-pressed="true"]').length,
    }), q1);
  }
  await p.close();
}

/* 3 */
{
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  await p.goto(AFTER + '/', { waitUntil: 'networkidle0' });
  await wait(5000); // the idle prefetch, 3s after load
  out.nav = await p.evaluate(
    () =>
      new Promise((resolve) => {
        const a = [...document.querySelectorAll('a[href="/services"]')][0];
        const t0 = performance.now();
        a.click();
        const check = () => {
          const h1 = document.querySelector('main h1');
          if (location.pathname === '/services' && h1 && !h1.closest('.hero')) {
            resolve({ h1InMs: Math.round(performance.now() - t0), h1: h1.textContent.trim().slice(0, 50) });
          } else requestAnimationFrame(check);
        };
        check();
      })
  );
  await p.close();
}

/* 4 */
for (const route of ROUTES) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  await p.goto(AFTER + route, { waitUntil: 'networkidle0' });
  await wait(500);
  out.footer[route] = await p.evaluate(() => {
    const links = [...document.querySelectorAll('.foot__page')];
    const rows = new Set(links.map((l) => Math.round(l.getBoundingClientRect().top + window.scrollY)));
    const ul = document.querySelector('.foot__pages');
    return {
      rows: rows.size,
      fontSize: links[0] && getComputedStyle(links[0]).fontSize,
      boxH: links[0] && links[0].getBoundingClientRect().height,
      need: Math.round(links.reduce((s, l) => s + l.getBoundingClientRect().width, 0) + 4 * (links.length - 1)),
      column: ul && Math.round(ul.parentElement.getBoundingClientRect().width),
    };
  });
  await p.close();
}

/* 5 */
async function frame(base, route, w, h, file) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(base + route, { waitUntil: 'networkidle0' });
  await wait(1000);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 600) {
    await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await wait(150);
  }
  await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  /* The film held at 0.5s in both builds, so the frame under the copy is the
     same picture and line 1 is the line. */
  await p.evaluate(async () => {
    const v = document.querySelector('video');
    if (!v) return;
    v.pause();
    v.currentTime = 0.5;
    await new Promise((r) => v.addEventListener('seeked', r, { once: true }));
  });
  /* Long enough for the swash under "Yet." to finish its draw. */
  await wait(4000);
  await p.screenshot({ path: file, fullPage: true });
  const foot = await p.evaluate(() => Math.round(document.querySelector('.foot').getBoundingClientRect().top + window.scrollY));
  await p.close();
  return foot;
}

/* Everything above the footer is compared pixel for pixel; the footer is
   the one place the pass changes, and its own height changes with it. */
function diff(a, c, footA, footC) {
  const A = PNG.sync.read(fs.readFileSync(a));
  const C = PNG.sync.read(fs.readFileSync(c));
  const res = { heights: `${A.height} -> ${C.height}`, footerTop: `${footA} -> ${footC}` };
  if (A.width !== C.width || footA !== footC) return res;
  let n = 0;
  let y0 = Infinity;
  let y1 = -1;
  const end = footA * A.width * 4;
  /* The hero (the first viewport) is reported apart: the film is a moving
     picture, so its frame differs between any two captures. */
  const heroEnd = (A.width < 1024 ? 844 : 800) * A.width * 4;
  let hero = 0;
  for (let i = 0; i < heroEnd; i += 4) {
    const d = Math.abs(A.data[i] - C.data[i]) + Math.abs(A.data[i + 1] - C.data[i + 1]) + Math.abs(A.data[i + 2] - C.data[i + 2]);
    if (d > 24) hero += 1;
  }
  res.heroDiffering = hero;
  for (let i = heroEnd; i < end; i += 4) {
    const d = Math.abs(A.data[i] - C.data[i]) + Math.abs(A.data[i + 1] - C.data[i + 1]) + Math.abs(A.data[i + 2] - C.data[i + 2]);
    if (d > 24) {
      n += 1;
      const y = Math.floor(i / 4 / A.width);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    }
  }
  return { ...res, heroToFooterDiffering: n, rows: n ? `${y0} to ${y1}` : null };
}

for (const route of ['/', '/services']) {
  for (const [w, h] of [[1280, 800], [390, 844]]) {
    const tag = `${w}${route === '/' ? '-home' : route.replace(/\//g, '-')}`;
    const fb = path.join(OUT, `${tag}-before.png`);
    const fa = path.join(OUT, `${tag}-after.png`);
    const footB = await frame(BEFORE, route, w, h, fb);
    const footA = await frame(AFTER, route, w, h, fa);
    out.frames[tag] = diff(fb, fa, footB, footA);
  }
}

await b.close();
out.consoleErrors = errors;
console.log(JSON.stringify(out, null, 1));

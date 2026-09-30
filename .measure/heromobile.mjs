/* heromobile.mjs: the static hero below 1024 and the pinned reveal above it,
   2026-09-30 (the founder's mobile hero fix).

   At 390x844, 430x932 and 768x1024: the headline's line count for each of
   the four lines, how much of the frame is on screen at scroll 0, whether
   the header, headline, offer line and call are all in the first viewport,
   the video's attributes and playback, and the sticky call at scroll 0, 400
   and past the hero. Frames at scroll 0 and 400. At 1280 and 1024: the hero
   pins. Then a 1280 load resized to 390: the pin is gone. Console errors
   are collected throughout.

   Usage: node .measure/heromobile.mjs [base]   (default http://localhost:4173)
   Frames go to .measure/out/heromobile/. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out', 'heromobile');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.argv[2] || 'http://localhost:4173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const LINES = [
  "Nobody's calling.",
  "They can't find you. Yet.",
  'We build the thing that finds them.',
  'Not a proposal. The finished thing.',
];

const errors = [];
const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
const open = async (w, h) => {
  const p = await b.newPage();
  p.on('console', (m) => m.type() === 'error' && errors.push(`${w}: ${m.text()}`));
  p.on('pageerror', (e) => errors.push(`${w}: ${e.message}`));
  await p.setViewport({ width: w, height: h });
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await wait(1200);
  return p;
};
/* Lenis owns the scroll; the native scroll is what it follows, and the
   wait lets it settle before anything is read. */
const scrollTo = async (p, y) => {
  await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
  await wait(900);
  return p.evaluate(() => Math.round(window.scrollY));
};
const sticky = (p) => p.evaluate(() => document.querySelector('.stick')?.getAttribute('data-on') ?? 'absent');

const report = {};
for (const [w, h] of [[390, 844], [430, 932], [768, 1024]]) {
  const p = await open(w, h);
  const r = await p.evaluate((LINES) => {
    const box = (s) => {
      const e = document.querySelector(s);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { top: +r.top.toFixed(1), bottom: +r.bottom.toFixed(1), h: +r.height.toFixed(1), w: +r.width.toFixed(1) };
    };
    /* Every line, set in a copy of the headline at the same width. */
    const h1 = document.querySelector('.hero__headline');
    const probe = h1.cloneNode(false);
    probe.removeAttribute('id');
    probe.style.cssText = 'position:absolute;visibility:hidden;height:auto;left:0;top:0;';
    probe.style.width = `${h1.getBoundingClientRect().width}px`;
    h1.parentElement.appendChild(probe);
    const lines = LINES.map((t) => {
      probe.textContent = t;
      const range = document.createRange();
      range.selectNodeContents(probe);
      const tops = new Set(Array.from(range.getClientRects()).map((x) => Math.round(x.top)));
      return { text: t, lines: tops.size };
    });
    probe.remove();
    const cs = getComputedStyle(h1);
    const f = document.querySelector('.hero__frame').getBoundingClientRect();
    const v = document.querySelector('.hero__spot');
    const hero = document.querySelector('.hero');
    return {
      headlineSize: cs.fontSize,
      headlineLineHeight: cs.lineHeight,
      lines,
      bar: box('.bar'),
      headline: box('.hero__headline'),
      price: box('.hero__price'),
      priceFont: `${getComputedStyle(document.querySelector('.hero__price')).fontSize} ${getComputedStyle(document.querySelector('.hero__price')).fontFamily.split(',')[0]}`,
      cta: box('.hero__actions .hero__cta'),
      frame: { ...box('.hero__frame'), ratio: +(f.width / f.height).toFixed(3), radius: getComputedStyle(document.querySelector('.hero__frame')).borderTopLeftRadius },
      frameVisibleAt0: +Math.max(0, Math.min(f.bottom, innerHeight) - Math.max(f.top, 0)).toFixed(1),
      allCopyInView: ['.bar', '.hero__headline', '.hero__price', '.hero__actions .hero__cta'].every((s) => document.querySelector(s).getBoundingClientRect().bottom <= innerHeight),
      gaps: {
        headlineToPrice: +(document.querySelector('.hero__price').getBoundingClientRect().top - document.querySelector('.hero__headline').getBoundingClientRect().bottom).toFixed(1),
        priceToCta: +(document.querySelector('.hero__actions .hero__cta').getBoundingClientRect().top - document.querySelector('.hero__price').getBoundingClientRect().bottom).toFixed(1),
        ctaToFrame: +(f.top - document.querySelector('.hero__actions .hero__cta').getBoundingClientRect().bottom).toFixed(1),
        barToHeadline: +(document.querySelector('.hero__headline').getBoundingClientRect().top - document.querySelector('.bar').getBoundingClientRect().bottom).toFixed(1),
      },
      video: v && v.tagName === 'VIDEO'
        ? { autoplay: v.autoplay, loop: v.loop, muted: v.muted, playsInline: v.playsInline, poster: !!v.getAttribute('poster'), fit: getComputedStyle(v).objectFit, paused: v.paused, t: +v.currentTime.toFixed(2) }
        : 'no video element',
      pinSpacer: !!hero.closest('.pin-spacer'),
      heroHeight: +hero.getBoundingClientRect().height.toFixed(1),
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  }, LINES);
  r.sticky0 = await sticky(p);
  await p.screenshot({ path: path.join(OUT, `${w}x${h}-scroll0.png`) });
  r.scrolled = await scrollTo(p, 400);
  r.sticky400 = await sticky(p);
  r.heroTopAt400 = await p.evaluate(() => Math.round(document.querySelector('.hero').getBoundingClientRect().top));
  await p.screenshot({ path: path.join(OUT, `${w}x${h}-scroll400.png`) });
  const heroEnd = await p.evaluate(() => Math.ceil(document.querySelector('.hero').getBoundingClientRect().bottom + window.scrollY));
  await scrollTo(p, heroEnd - 1 - h + 40);
  r.stickyHeroStillIn = await sticky(p);
  await scrollTo(p, heroEnd + 40);
  r.stickyPastHero = await sticky(p);
  report[`${w}x${h}`] = r;
  await p.close();
}

/* Desktop: the hero pins for 100vh. At 400px of scroll a pinned hero's top
   is still 0. */
for (const [w, h] of [[1280, 800], [1024, 768]]) {
  const p = await open(w, h);
  const pin = await p.evaluate(() => !!document.querySelector('.hero').closest('.pin-spacer'));
  await scrollTo(p, 400);
  const top = await p.evaluate(() => Math.round(document.querySelector('.hero').getBoundingClientRect().top));
  const scale = await p.evaluate(() => getComputedStyle(document.querySelector('.hero__frame')).transform);
  await p.screenshot({ path: path.join(OUT, `${w}x${h}-scroll400.png`) });
  report[`${w}x${h}`] = { pinSpacer: pin, heroTopAt400: top, frameTransformAt400: scale };
  await p.close();
}

/* A 1280 load resized to 390: gsap.matchMedia reverts the pin. */
{
  const p = await open(1280, 800);
  const before = await p.evaluate(() => !!document.querySelector('.hero').closest('.pin-spacer'));
  await p.setViewport({ width: 390, height: 844 });
  await wait(1200);
  const after = await p.evaluate(() => ({
    pin: !!document.querySelector('.hero').closest('.pin-spacer'),
    frameStyle: document.querySelector('.hero__frame').getAttribute('style'),
    frameTop: Math.round(document.querySelector('.hero__frame').getBoundingClientRect().top),
  }));
  await p.screenshot({ path: path.join(OUT, 'resized-1280-to-390.png') });
  report.resize = { pinBefore: before, after };
  await p.close();
}

await b.close();
report.consoleErrors = errors;
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));

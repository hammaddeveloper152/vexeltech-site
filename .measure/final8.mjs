/* final8.mjs: the founder's pre-launch pass, 2026-10-05. Frames and
   measurements to .measure/out/final8/:

     pages/<width>-<route>.png      every changed page, full, at 1280 and 390
     hero-<width>-<mode>.png        the hero in spot, and in still under
                                    reduced motion, under Save-Data and with
                                    no playable codec
     bar-<width>-<state>.png        the bar over the film and once solid

   and printed as JSON:
     hero     the mode each condition picks, and the still's image (it must
              be a first-second frame, never a last-frame poster), and that
              no canvas or shader is on the page
     bar      the bar's height, the wordmark's size, the links' size, weight
              and colour, the call's height, size and weight, the solid
              state's ground and rule, the bar's content width against the
              viewport (no overflow), at 1440, 1280, 1024, 768, 430, 390, 375
     colours  the painted colour of every discipline accent on /services and
              the home cards, for the contrast check

   Usage: node .measure/final8.mjs [base] [folder]   (default http://localhost:4173, final8) */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'http://localhost:4173';
/* The folder under out/ (final9 since the founder's content pass). */
const OUT = path.join(HERE, 'out', process.argv[3] || 'final8');
fs.mkdirSync(path.join(OUT, 'pages'), { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
const out = { hero: {}, bar: {}, colours: {} };
const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });

async function open(route, { width, height = width > 500 ? 800 : 844, reduce = false, saveData = false, noCodec = false } = {}) {
  const p = await b.newPage();
  p.on('console', (m) => m.type() === 'error' && errors.push(`${route} ${width}: ${m.text()}`));
  p.on('pageerror', (e) => errors.push(`${route} ${width}: ${e.message}`));
  await p.setViewport({ width, height });
  if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  if (saveData) {
    await p.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'connection', { value: { saveData: true, effectiveType: '4g' } });
    });
  }
  if (noCodec) {
    await p.evaluateOnNewDocument(() => {
      HTMLMediaElement.prototype.canPlayType = () => '';
    });
  }
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  return p;
}

/* ---- The hero's modes ---------------------------------------------------- */
for (const width of [1280, 390]) {
  for (const [mode, opts] of [
    ['spot', {}],
    ['reduced', { reduce: true }],
    ['savedata', { saveData: true }],
    ['nocodec', { noCodec: true }],
  ]) {
    const p = await open('/', { width, ...opts });
    await wait(mode === 'spot' ? 2500 : 800);
    out.hero[`${width}-${mode}`] = await p.evaluate(() => {
      const h = document.querySelector('.hero');
      const img = h.querySelector('picture img');
      const video = h.querySelector('video');
      return {
        mode: h.dataset.mode,
        video: !!video,
        still: img ? img.currentSrc.split('/').pop() : null,
        canvas: document.querySelectorAll('canvas').length,
        line: document.querySelector('.hero__headline').textContent.trim(),
      };
    });
    await p.screenshot({ path: path.join(OUT, `hero-${width}-${mode}.png`) });
    await p.close();
  }
}

/* ---- The bar ------------------------------------------------------------- */
const readBar = () => {
  const bar = document.querySelector('.bar');
  const inner = bar.querySelector('.bar__inner');
  const wm = bar.querySelector('.wm__word');
  const link = bar.querySelector('.bar__link:not([aria-current])');
  const cur = bar.querySelector('.bar__link[aria-current="page"]');
  const cta = bar.querySelector('.bar__inner > .bar__cta');
  const cs = (el) => (el ? getComputedStyle(el) : null);
  const after = getComputedStyle(bar, '::after');
  const kids = [...inner.children].filter((k) => getComputedStyle(k).display !== 'none');
  const right = Math.max(...kids.map((k) => k.getBoundingClientRect().right));
  return {
    barH: Math.round(bar.getBoundingClientRect().height * 100) / 100,
    over: bar.dataset.over,
    film: bar.dataset.film,
    wordmark: cs(wm).fontSize,
    link: link ? `${cs(link).fontSize} ${cs(link).fontWeight} ${cs(link).color}` : null,
    current: cur ? cs(cur).color : null,
    cta: cta && cs(cta).display !== 'none' ? `${cta.getBoundingClientRect().height}px ${cs(cta).fontSize} ${cs(cta).fontWeight}` : 'in panel',
    solidGround: bar.dataset.over === 'true' ? after.backgroundColor : cs(bar).backgroundColor,
    rule: bar.dataset.over === 'true' ? `${after.borderBottomWidth} ${after.borderBottomColor} op ${after.opacity}` : `${after.height} ${after.backgroundColor}`,
    contentRight: Math.round(right),
    viewport: window.innerWidth,
    overflow: document.documentElement.scrollWidth > window.innerWidth,
  };
};
for (const width of [1440, 1280, 1024, 768, 430, 390, 375]) {
  for (const route of ['/', '/services', '/about-us']) {
    const p = await open(route, { width });
    await wait(600);
    const top = await p.evaluate(readBar);
    let solid = null;
    if (route === '/') {
      await p.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: 'instant' }));
      await wait(700);
      solid = await p.evaluate(readBar);
      if (width === 1280 || width === 390) {
        /* A clip is in document coordinates, so it starts at the scroll. */
        const sy = await p.evaluate(() => window.scrollY);
        await p.screenshot({ path: path.join(OUT, `bar-${width}-solid.png`), clip: { x: 0, y: sy, width, height: 120 } });
        await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await wait(700);
        await p.screenshot({ path: path.join(OUT, `bar-${width}-over.png`), clip: { x: 0, y: 0, width, height: 120 } });
      }
    }
    out.bar[`${width} ${route}`] = solid ? { top, solid } : top;
    await p.close();
  }
}

/* ---- The discipline colours as painted ----------------------------------- */
{
  const p = await open('/services', { width: 1280 });
  out.colours.services = await p.evaluate(() => {
    const read = (el, prop = 'color') => (el ? getComputedStyle(el)[prop] : null);
    return [...document.querySelectorAll('.svc2__d')].map((s) => ({
      id: s.id,
      ground: read(s.querySelector('.svc2__in'), 'backgroundColor'),
      sectionGround: read(s, 'backgroundColor'),
      marg: read(s.querySelector('.marg')),
      rule: read(s.querySelector('.svc2__fig, .svc2__oncall'), 'borderLeftColor'),
      figure: read(s.querySelector('.svc2__fig, .svc2__oncall')),
      caret: read(s.querySelector('.by__caret'), 'backgroundColor'),
      palEdge: read(s.querySelector('.by__pal'), 'borderBottomColor'),
      phoneShadow: read(s.querySelector('.dp__phone'), 'boxShadow'),
      ring: s.querySelector('.sc__ring rect') ? getComputedStyle(s.querySelector('.sc__ring rect')).stroke : null,
      accept: read(s.querySelector('.sc__call-a')),
      acceptGround: read(s.querySelector('.sc__call'), 'backgroundColor'),
      sent: read(s.querySelector('.tb__msg--sent .tb__text'), 'backgroundColor'),
      sentText: read(s.querySelector('.tb__msg--sent .tb__text')),
    }));
  });
  await p.close();
  const h = await open('/', { width: 1280 });
  out.colours.cards = await h.evaluate(() =>
    [...document.querySelectorAll('.art--colour')].map((c) => ({
      cls: [...c.classList].find((k) => /art--(branding|websites|marketing|automation)/.test(k)),
      tone: getComputedStyle(c).getPropertyValue('--tone').trim(),
      ground: getComputedStyle(c, '::after').backgroundColor,
    }))
  );
  await h.close();
}

/* ---- Full pages ---------------------------------------------------------- */
for (const width of [1280, 390]) {
  for (const route of ['/', '/services', '/about-us']) {
    const p = await open(route, { width });
    await wait(800);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 600) {
      await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
      await wait(120);
    }
    await p.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await wait(1500);
    const name = route === '/' ? 'home' : route.slice(1);
    await p.screenshot({ path: path.join(OUT, 'pages', `${width}-${name}.png`), fullPage: true });
    await p.close();
  }
}

await b.close();
out.consoleErrors = errors;
console.log(JSON.stringify(out, null, 1));

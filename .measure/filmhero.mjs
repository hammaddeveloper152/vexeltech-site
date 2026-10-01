/* filmhero.mjs: the film behind the copy, 2026-09-30 (the founder): below
   1024 first, then at every width once the pinned reveal was deleted.

   CONTRAST ON PAINTED PIXELS. For each width and each of three film frames
   (0s, 2s, 4s; the film held on the frame), two captures of the same frame:
     A   the page as it is;
     B   the same, with the measured text's ink made transparent and its
         text-shadow off, every ground kept (the scrim, the swash, the call's
         yellow), and the bar's two glyphs hidden.
   A glyph pixel is one where A is within 48 of the text's own colour and A
   differs from B by more than 40 (so the ink is really there). Its contrast
   is the text colour against B at that pixel, which is what is painted
   behind that part of the letter. Reported: the minimum, the 1st percentile
   and the median, and the pixel count. The copy's text-shadow is off in
   both captures, so a pass here is conservative.

   Also: the scrim's foot stop, the bar's ground over the film, the header
   call's state, the film's source and preload, whether the hero is pinned
   (it must not be, at any width), frames at scroll 0 and 400 below 1024 and
   at 0, 300 and 700 from 1024, and the sweep for copy under a bare bar.
   Console errors.

   The ScrollTrigger count is a separate script, `.measure/herotriggers.mjs`,
   because it needs the dev server's module graph.

   Usage: node .measure/filmhero.mjs [base] [scrimFoot]
   (scrimFoot sets --scrim-foot on the hero to try a deeper foot stop.)
   Frames and report go to .measure/out/filmhero/. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out', 'filmhero');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.argv[2] || 'http://localhost:4173';
const FOOT = process.argv[3] || '';
/* SCRIM_MID=0.6 tries a different 50% stop on the desktop scrim; DESK=1 walks
   1280 and 1536 only. Both are for finding a value, not for the record. */
const MID = process.env.SCRIM_MID || '';
/* SCRIM_70=0.35 adds a stop at 70% (with SCRIM_MID), desktop only. */
const S70 = process.env.SCRIM_70 || '';
const DESK_ONLY = process.env.DESK === '1';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const lum = ([r, g, b]) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const px = (png, x, y) => {
  const i = (png.width * y + x) << 2;
  return [png.data[i], png.data[i + 1], png.data[i + 2]];
};

/* The things measured, with their declared ink. `exclude` keeps the swash's
   word out of the headline's own count; it is measured on its own. */
const TARGETS = () => {
  const out = [];
  const rgb = (s) => s.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  };
  const add = (name, el, extra = {}) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    out.push({ name, box: box(el), ink: rgb(getComputedStyle(el).color), ...extra });
  };
  const line = document.querySelector('.hero__line');
  const sw = document.querySelector('.hero__line .brush__t');
  add('headline', line, sw ? { exclude: box(sw.closest('.brush')) } : {});
  add('headline, swash word', sw);
  /* COPY V3, 2026-10-01: the sub is gone; the eyebrow and the promise line. */
  add('eyebrow', document.querySelector('.hero__eyebrow'));
  add('promise line', document.querySelector('.hero__promise'));
  add('offer line', document.querySelector('.hero__price'));
  add('call', document.querySelector('.hero__actions .hero__cta:not(.hero__cta--line)'));
  add('ask a question', document.querySelector('.hero__cta--line'));
  add('wordmark', document.querySelector('.bar .wm__word'));
  document.querySelectorAll('.bar__link').forEach((a) => add(`nav ${a.textContent.trim()}`, a));
  const menu = document.querySelector('.bar__menu');
  if (menu && menu.offsetParent) add('menu glyph', menu.querySelector('svg'), { ink: rgb(getComputedStyle(menu).color) });
  return out;
};

const HIDE = `
  .hero__line, .hero__line *, .hero__eyebrow, .hero__promise, .hero__price, .hero__actions .hero__cta, .bar .wm__word, .bar__link {
    color: transparent !important; text-shadow: none !important;
  }
  .bar__menu svg { visibility: hidden !important; }
`;

function measure(A, B, t, dpr) {
  const ratios = [];
  const fails = [];
  const x0 = Math.max(0, Math.floor(t.box.x * dpr));
  const y0 = Math.max(0, Math.floor(t.box.y * dpr));
  const x1 = Math.min(A.width, Math.ceil((t.box.x + t.box.w) * dpr));
  const y1 = Math.min(A.height, Math.ceil((t.box.y + t.box.h) * dpr));
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (t.exclude) {
        const cx = x / dpr;
        const cy = y / dpr;
        if (cx >= t.exclude.x && cx <= t.exclude.x + t.exclude.w && cy >= t.exclude.y && cy <= t.exclude.y + t.exclude.h) continue;
      }
      const a = px(A, x, y);
      const b = px(B, x, y);
      if (dist(a, t.ink) < 48 && dist(a, b) > 40) {
        const r = ratio(t.ink, b);
        ratios.push(r);
        if (r < 4.5 && fails.length < 400) fails.push([x, y, a, b]);
      }
    }
  }
  ratios.sort((p, q) => p - q);
  const at = (q) => (ratios.length ? +ratios[Math.min(ratios.length - 1, Math.floor(q * ratios.length))].toFixed(2) : null);
  /* Where the failures are, so a finding can be looked at, not argued. */
  const under = ratios.filter((r) => r < 4.5).length;
  const fx = fails.map((f) => f[0]);
  const fy = fails.map((f) => f[1]);
  return {
    pixels: ratios.length,
    min: at(0),
    p1: at(0.01),
    median: at(0.5),
    under45: under,
    failBox: fails.length ? [Math.min(...fx), Math.min(...fy), Math.max(...fx), Math.max(...fy)] : null,
    failSample: fails.slice(0, 3).map(([x, y, a, b]) => ({ x, y, A: a, B: b })),
  };
}

const errors = [];
const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
const report = { scrimFoot: FOOT || '0.92 (CSS)', sizes: {} };

for (const [w, h] of (DESK_ONLY ? [[1280, 800], [1536, 864]] : [[390, 844], [430, 932], [768, 1024], [1280, 800], [1536, 864]])) {
  const desk = w >= 1024;
  const p = await b.newPage();
  p.on('console', (m) => m.type() === 'error' && errors.push(`${w}: ${m.text()}`));
  p.on('pageerror', (e) => errors.push(`${w}: ${e.message}`));
  await p.setViewport({ width: w, height: h });
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  if (FOOT) await p.evaluate((f) => document.querySelector('.hero').style.setProperty('--scrim-foot', f), FOOT);
  if (MID && desk) {
    await p.addStyleTag({
      content: `.hero[data-mode] .hero__frame::after { background: linear-gradient(to top, rgb(11 11 13 / var(--scrim-foot, 0.9)) 0%, rgb(11 11 13 / ${MID}) 50%,${S70 ? ` rgb(11 11 13 / ${S70}) 70%,` : ''} rgb(11 11 13 / 0.1) 100%) !important; }`,
    });
  }
  await wait(1200);
  const r = {};
  r.film = await p.evaluate(() => {
    const v = document.querySelector('.hero__spot');
    const hero = document.querySelector('.hero').getBoundingClientRect();
    const fr = document.querySelector('.hero__frame').getBoundingClientRect();
    return {
      src: v.currentSrc.split('/').pop(),
      preload: v.getAttribute('preload'),
      autoplay: v.autoplay,
      loop: v.loop,
      poster: v.getAttribute('poster'),
      fit: `${getComputedStyle(v).objectFit} ${getComputedStyle(v).objectPosition}`,
      hero: [Math.round(hero.width), Math.round(hero.height)],
      frame: [Math.round(fr.left), Math.round(fr.top), Math.round(fr.width), Math.round(fr.height)],
      radius: getComputedStyle(document.querySelector('.hero__frame')).borderTopLeftRadius,
      pin: !!document.querySelector('.hero').closest('.pin-spacer'),
      bodyPadBottom: getComputedStyle(document.querySelector('.hero__body')).paddingBottom,
      gapFootToCall: Math.round(hero.bottom - document.querySelector('.hero__actions .hero__cta').getBoundingClientRect().bottom),
      callW: Math.round(document.querySelector('.hero__actions .hero__cta').getBoundingClientRect().width),
      copyLeft: Math.round(document.querySelector('.hero__headline').getBoundingClientRect().left),
      wordmarkLeft: Math.round(document.querySelector('.bar__brand .wm').getBoundingClientRect().left),
      copyW: Math.round(Math.max(...[...document.querySelectorAll('.hero__headline, .hero__support')].map((e) => e.getBoundingClientRect().width))),
      headlineSize: getComputedStyle(document.querySelector('.hero__headline')).fontSize,
      order: [...document.querySelectorAll('.hero__headline, .hero__sub, .hero__price, .hero__actions')]
        .filter((e) => e.offsetParent !== null)
        .map((e) => [e.className.split(' ')[0], Math.round(e.getBoundingClientRect().top), Math.round(e.getBoundingClientRect().bottom)]),
      askBesideCall: (() => {
        const a = document.querySelector('.hero__cta--line');
        const c = document.querySelector('.hero__actions .hero__cta:not(.hero__cta--line)');
        if (!a || !a.offsetParent) return 'hidden';
        const ar = a.getBoundingClientRect();
        const cr = c.getBoundingClientRect();
        return ar.left > cr.right && ar.top < cr.bottom && ar.bottom > cr.top;
      })(),
    };
  });
  const barState = () =>
    p.evaluate(() => {
      const bar = document.querySelector('.bar');
      return {
        film: bar.getAttribute('data-film'),
        call: bar.getAttribute('data-call'),
        groundBefore: getComputedStyle(bar, '::before').opacity,
        groundAfter: getComputedStyle(bar, '::after').opacity,
        callOpacity: getComputedStyle(document.querySelector('.bar__inner > .bar__cta')).opacity,
      };
    });
  r.bar0 = await barState();
  /* The scroll-0 frame waits for a line fully in: a line leaves over 200ms
     before each cut, and a frame caught in that fade shows no headline. */
  for (let i = 0; i < 40; i++) {
    const shown = await p.evaluate(() => {
      const l = document.querySelector('.hero__line');
      return !!l && l.getAttribute('data-leaving') !== 'true' && getComputedStyle(l).opacity === '1';
    });
    if (shown) break;
    await wait(100);
  }
  await p.screenshot({ path: path.join(OUT, `${w}-scroll0.png`) });

  /* Contrast on three frames. */
  r.contrast = {};
  for (const t of [0, 2, 4]) {
    await p.evaluate((t) => {
      const v = document.querySelector('.hero__spot');
      v.play = () => Promise.resolve();
      v.pause();
      v.currentTime = t;
    }, t);
    await wait(1800);
    const dpr = 1;
    /* The copy's soft shadow is off in BOTH captures: left on in A only, its
       darkening of bright film beside a letter read as ink (the first run
       put "Yet." at 1.49:1 while the word sat wholly on the stroke). Off,
       the text stands on the bare frame, which is the stricter test. */
    const noShadow = await p.addStyleTag({ content: '.hero__body, .hero__body * { text-shadow: none !important; }' });
    await wait(150);
    const A = PNG.sync.read(await p.screenshot());
    const targets = await p.evaluate(TARGETS);
    await p.addStyleTag({ content: HIDE }).then((hnd) => hnd.evaluate((el) => el.setAttribute('data-hide', '1')));
    await wait(200);
    const B = PNG.sync.read(await p.screenshot());
    await p.evaluate(() => document.querySelector('style[data-hide]').remove());
    await noShadow.evaluate((el) => el.remove());
    await wait(200);
    fs.writeFileSync(path.join(OUT, `${w}-t${t}.png`), PNG.sync.write(A));
    r.contrast[`${t}s`] = {
      line: await p.evaluate(() => document.querySelector('.hero__line')?.textContent),
      ...Object.fromEntries(targets.map((tg) => [tg.name, measure(A, B, tg, dpr)])),
    };
  }

  /* Scroll 400: the film scrolls with the page, the bar keeps no ground
     while the hero's call is below it. */
  await p.evaluate(() => {
    const v = document.querySelector('.hero__spot');
    delete v.play;
    v.play();
  });
  for (const y of desk ? [300, 700] : [400]) {
    await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await wait(900);
    r[`bar${y}`] = await barState();
    r[`heroTop${y}`] = await p.evaluate(() => Math.round(document.querySelector('.hero').getBoundingClientRect().top));
    await p.screenshot({ path: path.join(OUT, `${w}-scroll${y}.png`) });
  }
  /* Past the hero's call: the ground and the call come back. */
  const past = await p.evaluate(() => {
    const c = document.querySelector('.hero__actions .hero__cta').getBoundingClientRect();
    return Math.ceil(c.bottom + scrollY - 64 + 20);
  });
  await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), past);
  await wait(900);
  r.barPastCall = { scrollY: past, ...(await barState()) };

  /* THE SWEEP: nothing of the hero's copy may pass under the bar while the
     bar lacks its full ground (BUILD-LAW, the sticky element with no ground).
     10px steps from 0 to one screen. */
  let under = 0;
  let groundFrom = null;
  let callFrom = null;
  for (let y = 0; y <= h; y += 10) {
    await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await wait(320);
    const st = await p.evaluate(() => {
      const bar = document.querySelector('.bar');
      const bb = bar.getBoundingClientRect().bottom;
      const copyUnder = [...document.querySelectorAll('.hero__headline, .hero__price, .hero__actions .hero__cta')].some((e) => {
        const q = e.getBoundingClientRect();
        return q.top < bb && q.bottom > 0;
      });
      return { film: bar.getAttribute('data-film'), ground: +getComputedStyle(bar, '::after').opacity, copyUnder, call: bar.getAttribute('data-call') };
    });
    if (st.copyUnder && st.ground < 1) under += 1;
    if (groundFrom === null && st.film === 'false') groundFrom = y;
    if (callFrom === null && st.call === 'shown') callFrom = y;
  }
  r.sweep = { stepsWithCopyUnderBareBar: under, groundBackFrom: groundFrom, headerCallShownFrom: callFrom };
  report.sizes[`${w}x${h}`] = r;
  await p.close();
}

await b.close();
report.consoleErrors = errors;
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));

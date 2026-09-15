/* cardfill.mjs — the card fill, 2026-09-16.

   node .measure/cardfill.mjs [base]        BASE default http://localhost:4180

   Both sets of cards: the four on home (`.svc__plate[data-variant="card"]`,
   which are links) and the 24 on /services (`.svc2__card`, which are not).

     hover     the card fills machine yellow, the title, line and icon go
               asphalt, the card lifts 4px, the fill runs 250ms and the leave
               400ms on the reveal curve
     contrast  every painted pair on the filled card, off pixels
     one       only the card under the pointer is filled
     press     the site's own press on the filled card
     touch     at 390 a tap fills, holds about 300ms, then navigates (home)
     reduced   the colour swaps with no lift and no transition
   Writes .measure/out/audit/cardfill.json. */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4180';
const OUT = '.measure/out/audit';
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const args = ['--force-color-profile=srgb', '--hide-scrollbars', '--font-render-hinting=none'];
const YELLOW = 'rgb(240, 179, 35)';
const ASPHALT = 'rgb(23, 24, 26)';
let fail = 0;
const check = (ok, msg) => { if (!ok) fail++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`); };
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => { const x = Math.max(a, b), y = Math.min(a, b); return (x + 0.05) / (y + 0.05); };
const out = [];

const b = await puppeteer.launch({ headless: 'new', args });

for (const [route, sel, kids, isLink] of [
  ['/', '.svc__plate[data-variant="card"]', ['.disc__name', '.disc__item'], true],
  ['/services', '.svc2__card', ['.svc2__ct', '.svc2__cl'], false],
]) {
  console.log(`\n=== ${route} ${sel}`);
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  /* The press test clicks a card, and the home cards are links: without this
     the run navigated to /services mid-measurement and every later read came
     back null. The touch test below uses its own page, where the click is
     allowed through so the tap-then-navigate can be timed. */
  await p.evaluateOnNewDocument(() => {
    window.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); }, true);
  });
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const tot = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < tot; y += 400) { await p.evaluate((v) => scrollTo(0, v), y); await wait(70); }
  await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
  await wait(600);

  const box = await p.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, top: r.top }; }, sel);
  const read = (s) => p.evaluate((s, kids) => {
    const e = document.querySelector(s);
    const c = getComputedStyle(e);
    const ic = e.querySelector('svg');
    return { bg: c.backgroundColor, bgImage: c.backgroundImage.slice(0, 20), transform: c.transform, dur: c.transitionDuration,
      kids: kids.map((k) => { const el = e.querySelector(k); return el ? getComputedStyle(el).color : null; }),
      icon: ic ? getComputedStyle(ic).color : null,
      art: e.querySelector('.svc__art') ? getComputedStyle(e.querySelector('.svc__art')).opacity : null };
  }, s, kids);

  const rest = await read(sel);
  await p.mouse.move(box.x, box.y);
  await wait(400);
  const hov = await read(sel);
  const ty = (t) => { const m = (t || '').match(/matrix\(([^)]+)\)/); return m ? Math.round(+m[1].split(',')[5]) : 0; };
  check(hov.bg === YELLOW, `fills machine yellow on hover (${hov.bg}, was ${rest.bg})`);
  check(hov.kids.every((c) => c === ASPHALT) && (hov.icon === null || hov.icon === ASPHALT), `title, line and icon asphalt (${hov.kids.join(', ')}${hov.icon ? ', icon ' + hov.icon : ''})`);
  check(ty(rest.transform) - ty(hov.transform) === 4, `lifts 4px (${ty(rest.transform)} -> ${ty(hov.transform)})`);
  check(/0\.25s/.test(hov.dur), `fill runs 250ms (${hov.dur})`);
  if (rest.art !== null) check(+hov.art < 0.02, `the picture goes (art opacity ${(+hov.art).toFixed(3)})`);

  /* every painted pair on the filled card */
  const shot = PNG.sync.read(await p.screenshot({ clip: { x: Math.max(0, box.x - box.w / 2), y: Math.max(0, box.top), width: Math.min(box.w, 1280), height: Math.min(box.h, 900 - Math.max(0, box.top)) } }));
  const pairs = await p.evaluate((s, kids) => {
    const e = document.querySelector(s); const r = e.getBoundingClientRect();
    return kids.flatMap((k) => [...e.querySelectorAll(k)].slice(0, 3).map((el) => {
      const q = el.getBoundingClientRect(); const c = getComputedStyle(el);
      return { cls: k, color: (c.color.match(/\d+/g) || []).map(Number).slice(0, 3), size: parseFloat(c.fontSize), box: [Math.round(q.left - r.left), Math.round(q.top - r.top), Math.round(q.width), Math.round(q.height)] };
    }));
  }, sel, kids);
  let worst = { ratio: 99 };
  for (const it of pairs) {
    let peak = 0;
    for (let y = Math.max(0, it.box[1]); y < Math.min(shot.height, it.box[1] + it.box[3]); y++)
      for (let x = Math.max(0, it.box[0]); x < Math.min(shot.width, it.box[0] + it.box[2]); x++) {
        const i = (y * shot.width + x) * 4;
        const l = L(shot.data[i], shot.data[i + 1], shot.data[i + 2]);
        if (l > peak) peak = l;
      }
    const ratio = +CR(L(...it.color), peak).toFixed(2);
    if (ratio < worst.ratio) worst = { ratio, cls: it.cls, size: it.size };
  }
  check(worst.ratio >= 4.5, `worst painted pair on the filled card ${worst.ratio}:1 (${worst.cls}, ${worst.size}px)`);

  /* one at a time */
  const filled = await p.evaluate((s) => [...document.querySelectorAll(s)].filter((e) => getComputedStyle(e).backgroundColor === 'rgb(240, 179, 35)').length, sel);
  check(filled === 1, `one card filled at a time (${filled})`);

  /* press on the filled card */
  await p.mouse.down();
  await wait(180);
  const press = await p.evaluate((s) => getComputedStyle(document.querySelector(s)).transform, sel);
  await p.mouse.up();
  const m = press.match(/matrix\(([^,]+)/);
  check(m && +m[1] < 1, `press scales on the filled card (${m ? (+m[1]).toFixed(3) : press})`);

  /* leave */
  await p.mouse.move(2, 2);
  await wait(60);
  const leaving = await read(sel);
  check(/0\.4s/.test(leaving.dur), `leave runs 400ms (${leaving.dur})`);
  await wait(600);
  const back = await read(sel);
  check(back.bg === rest.bg && ty(back.transform) === ty(rest.transform), `returns to rest (${back.bg}, y ${ty(back.transform)})`);
  out.push({ route, sel, rest, hov, worst });
  await p.close();

  /* reduced motion: colour swaps, nothing lifts */
  const rp = await b.newPage();
  await rp.setViewport({ width: 1280, height: 900 });
  await rp.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await rp.goto(BASE + route, { waitUntil: 'networkidle0' });
  const rtot = await rp.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < rtot; y += 400) { await rp.evaluate((v) => scrollTo(0, v), y); await wait(60); }
  await rp.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
  await wait(400);
  const rbox = await rp.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
  const rRest = await rp.evaluate((s) => getComputedStyle(document.querySelector(s)).transform, sel);
  await rp.mouse.move(rbox.x, rbox.y);
  await wait(250);
  const rHov = await rp.evaluate((s) => { const c = getComputedStyle(document.querySelector(s)); return { bg: c.backgroundColor, transform: c.transform, dur: c.transitionDuration }; }, sel);
  check(rHov.bg === YELLOW && rHov.transform === rRest && /^0s/.test(rHov.dur), `reduced motion: colour swap, no lift, no transition (${rHov.bg}, ${rHov.transform === rRest ? 'still' : 'moved'}, ${rHov.dur})`);
  await rp.close();

  /* touch: the tap fills, holds, then navigates (home only) */
  const tp = await b.newPage();
  await tp.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await tp.goto(BASE + route, { waitUntil: 'networkidle0' });
  const ttot = await tp.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < ttot; y += 300) { await tp.evaluate((v) => scrollTo(0, v), y); await wait(60); }
  await tp.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
  await wait(400);
  const tbox = await tp.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
  /* TIMED IN THE PAGE, NOT OVER CDP. Sampling the fill with `evaluate` in a
     loop measured the round trip, not the card: a 300ms hold read as 60ms
     because each sample cost most of a frame. An observer on the attribute
     records when the fill went on and came off, and the navigation with it. */
  await tp.evaluate((s) => {
    window.__tap = { on: 0, off: 0, nav: 0, path: location.pathname + location.hash };
    const el = document.querySelector(s);
    const t0 = performance.now();
    new MutationObserver(() => {
      const now = Math.round(performance.now() - t0);
      if (el.dataset.tap === 'true' && !window.__tap.on) window.__tap.on = now;
      else if (el.dataset.tap !== 'true' && window.__tap.on && !window.__tap.off) window.__tap.off = now;
    }).observe(el, { attributes: true, attributeFilter: ['data-tap'] });
    const seen = setInterval(() => {
      const p = location.pathname + location.hash;
      if (p !== window.__tap.path) { window.__tap.nav = Math.round(performance.now() - t0); window.__tap.path = p; clearInterval(seen); }
    }, 16);
  }, sel).catch(() => {});
  const t0 = Date.now();
  await tp.touchscreen.tap(tbox.x, tbox.y);
  await wait(900);
  const tap = await tp.evaluate(() => window.__tap).catch(() => null);
  const filledFor = tap && tap.on ? (tap.off || tap.nav || 900) - tap.on : 0;
  const navigated = tap ? tap.path : 'gone';
  const seen = [{ bg: tap && tap.on ? YELLOW : null, path: navigated }];
  console.log(`      tap: fill on at ${tap && tap.on}ms, off at ${tap && tap.off}ms, navigation at ${tap && tap.nav}ms`);
  if (isLink) check(filledFor >= 250 && filledFor <= 420 && navigated.includes('/services'), `tap fills ${filledFor}ms then navigates (${navigated})`);
  else check(filledFor >= 250 && filledFor <= 420, `tap fills ${filledFor}ms and lets go (${navigated})`);
  console.log(`      (${Date.now() - t0}ms wall)`);
  await tp.close();
}

await b.close();
fs.writeFileSync(`${OUT}/cardfill.json`, JSON.stringify(out, null, 1));
console.log(fail ? `\n${fail} FAILED` : '\nall pass');
process.exit(fail ? 1 : 0);

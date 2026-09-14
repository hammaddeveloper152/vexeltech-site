/* spotwalk.mjs — the hero spot: its scrim, its yellow, and its frames.

   The hero's ground is a film now, and a film is 289 photographs. Every rule
   this harness already enforces on a photograph applies to each of them, and
   none of the existing walks can see a <video>: the DOM has no pixels for it,
   and a screenshot of a playing element is whichever frame happened to be up.

   So the film is HELD. The clip is paused and seeked to the middle of each
   frame in turn, the wait is in Node after `seeked` (BUILD-LAW: rAF inside
   page.evaluate is not a wait), and only then is anything read.

   ONE BROWSER PER WIDTH, and the first version of this script is why. It held
   both widths as two tabs of one browser. Opening the second put the first in
   the background, headless Chrome stops compositing a background tab, and the
   next screenshot of it never returned: `Page.captureScreenshot timed out`
   after three minutes of nothing. Bringing the tab back to the front is not a
   fix either — the hero plays the film again when its document becomes
   visible, so frames would advance between seeks. Two browsers, each page in
   front for its whole life.

   ---- scrim ----------------------------------------------------------------

   The copy plate's --scrim, walked the way `scrim.mjs` walks a band: the copy
   is hidden so the ground is all that is left, the brightest pixel inside each
   text box is the ground that pair is measured against, and the scrim rises in
   5% steps from 30 until every pair clears its bar at 1280 and 390.

   PER LINE, OVER ITS OWN SHOT. A line is only ever on screen during its shot,
   so line 1 is measured over frames 0 to 44 and not over the screen wall. The
   sub, the link and the note are on screen for all 289 frames and are
   measured over all of them. The call paints its own ground and is not a pair
   the scrim can move.

   Bars by size, as `scrim.mjs` sets them: 3.0 at 24px and over, 4.5 below.

   ---- carrier --------------------------------------------------------------

   The footage carries yellow chevrons, and one-accent-per-frame is recorded
   as excepted for them. An exception is written down with its numbers, so at
   the final scrim this counts, per frame with the copy hidden, the share of
   the hero painted machine yellow under the harness's own anti-alias
   threshold (lib.mjs), and the share resting in the olive band the mid-ramp
   rule bans — a yellow scrimmed toward asphalt is exactly how that band is
   made. The call's own share is measured once, with the copy shown.

   ---- shots ----------------------------------------------------------------

   The captures: 1280 at the middle frame of each shot, and 390 on shot 4,
   with the line settled. Also the screen wall at 1280 and 390 with the copy
   hidden, for reading whether any text on the screens is legible.

   Usage, with the site built and served at 4179:

     node .measure/spotwalk.mjs            scrim, then carrier and shots at its result
     node .measure/spotwalk.mjs shots 55   carrier and shots at a given scrim
*/
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { isAccent } from './lib.mjs';
import { CUT_FRAMES, FPS } from '../src/components/home/heroSpot.js';

const URL = 'http://localhost:4179/';
const OUT = join(process.cwd(), '.measure', 'out', 'spot');
const WIDTHS = [[1280, 800], [390, 844]];
const START = 30;
const STEP = 5;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* A lookup table, not a function per channel. The walk reads every pixel of
   every text box on every one of 289 frames at every scrim step, which at 1280
   is about 1.5 million pow() calls a frame, and the first full run spent more
   than half an hour without finishing one step. An 8-bit channel has 256
   values; the table is exact. */
const LIN = new Float64Array(256).map((_, i) => { const c = i / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
const L = (r, g, b) => 0.2126 * LIN[r] + 0.7152 * LIN[g] + 0.0722 * LIN[b];
const CR = (a, b) => { const hi = Math.max(a, b), lo = Math.min(a, b); return (hi + 0.05) / (lo + 0.05); };

/* The olive band: on the asphalt-to-yellow line, within the same 32 residual,
   at a coverage the threshold does not count as yellow but that is plainly
   not asphalt either. */
const olive = (r, g, b) => {
  const G = [23, 24, 26], A = [240, 179, 35];
  const d = [A[0] - G[0], A[1] - G[1], A[2] - G[2]];
  const q = [r - G[0], g - G[1], b - G[2]];
  const len2 = d[0] ** 2 + d[1] ** 2 + d[2] ** 2;
  const a = Math.max(0, Math.min(1, (q[0] * d[0] + q[1] * d[1] + q[2] * d[2]) / len2));
  const res = Math.hypot(q[0] - a * d[0], q[1] - a * d[1], q[2] - a * d[2]);
  return res <= 32 && a >= 0.15 && a < 0.5;
};

mkdirSync(OUT, { recursive: true });

/* Every media event on the page, so a hero that lands in the wrong mode says
   why. It did once, at 390, and did not reproduce under a separate
   diagnostic: a fallback that fires intermittently is only diagnosable from
   the run it fired in. */
const MEDIA_LOG = () => {
  window.__spotlog = [];
  const t0 = performance.now();
  const log = (s) => window.__spotlog.push(`${(performance.now() - t0).toFixed(0)}ms ${s}`);
  for (const ev of ['loadstart', 'loadedmetadata', 'loadeddata', 'playing', 'stalled', 'abort', 'emptied', 'error']) {
    document.addEventListener(ev, (e) => {
      const v = e.target.tagName === 'SOURCE' ? e.target.parentElement : e.target;
      if (!v || v.tagName !== 'VIDEO') return;
      log(`${ev} on ${e.target.tagName} net ${v.networkState} ready ${v.readyState} err ${v.error ? `${v.error.code} ${v.error.message}` : '-'}`);
    }, true);
  }
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    const pr = play.call(this);
    pr.then(() => log('play() resolved'), (e) => log(`play() rejected ${e.name}: ${e.message}`));
    return pr;
  };
};

async function open(w, h) {
  const b = await puppeteer.launch({
    headless: 'new',
    args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text',
      '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
  });
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await p.evaluateOnNewDocument(MEDIA_LOG);
  p.on('requestfailed', (r) => { if (/assets\/hero/.test(r.url())) console.log(`  ${w}: request failed ${r.url().split('/').pop()} ${r.failure() && r.failure().errorText}`); });
  await p.goto(URL, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const info = await p.evaluate(async () => {
    const hero = document.querySelector('.hero');
    const v = document.querySelector('video.hero__spot');
    if (!v) return { mode: hero && hero.dataset.mode };
    if (v.readyState < 2) await new Promise((r) => v.addEventListener('loadeddata', r, { once: true }));
    v.pause();
    return { mode: hero.dataset.mode, src: v.currentSrc.split('/').pop(), vw: v.videoWidth, vh: v.videoHeight, frames: Math.round(v.duration * 24) };
  });
  if (info.mode !== 'spot') {
    const log = await p.evaluate(() => window.__spotlog || []);
    log.forEach((l) => console.log(`  ${w}: ${l}`));
    await b.close();
    throw new Error(`${w}: hero is in "${info.mode}" mode, not spot; nothing to walk`);
  }
  return { b, p, info };
}

/* A SEEK HAS A DEADLINE. The first full run confirmed the scrim, moved on to
   the carrier stage, and then sat for over half an hour at a fraction of a
   core, printing nothing: a `seeked` that never fired, awaited with no
   timeout. A lost event must fail loudly with the frame it was waiting for,
   not wait forever and look like a slow walk. */
async function seek(p, frame, settle = 90) {
  const ok = await p.evaluate((t) => new Promise((r) => {
    const v = document.querySelector('video.hero__spot');
    const timer = setTimeout(() => r(false), 10000);
    v.addEventListener('seeked', () => { clearTimeout(timer); r(true); }, { once: true });
    v.currentTime = t;
  }), (frame + 0.5) / FPS);
  if (!ok) throw new Error(`seek to frame ${frame} did not fire 'seeked' within 10s`);
  await wait(settle);
}

const setScrim = (p, s) => p.evaluate((v) => {
  let el = document.getElementById('spotwalk-scrim');
  if (!el) { el = document.createElement('style'); el.id = 'spotwalk-scrim'; document.head.appendChild(el); }
  el.textContent = `.hero { --scrim: ${v}% !important; }`;
}, s);

const setCopy = (p, shown) => p.evaluate((on) => {
  document.querySelectorAll('.hero__body > *').forEach((e) => { e.style.visibility = on ? '' : 'hidden'; });
}, shown);

const shotOf = (f) => { let i = 0; while (i + 1 < CUT_FRAMES.length && f >= CUT_FRAMES[i + 1]) i += 1; return i; };

/* The boxes a pair is measured in. A line's box is the union of its text's own
   line boxes, taken with the line settled in the middle of its own shot. Not
   the element's box: `.hero__line` is a block the width of the measure, and a
   short line would be measured against ground to the right of its last word
   that it never covers. */
async function boxes(p, frames) {
  const items = [];
  for (let s = 0; s < CUT_FRAMES.length; s++) {
    const from = CUT_FRAMES[s], to = s + 1 < CUT_FRAMES.length ? CUT_FRAMES[s + 1] : frames;
    await seek(p, Math.floor((from + to) / 2), 900);
    const r = await p.evaluate(() => {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.hero__line'));
      const ms = [...range.getClientRects()].filter((m) => m.width > 1 && m.height > 1);
      const cs = getComputedStyle(document.querySelector('.hero__headline'));
      return { box: [Math.min(...ms.map((m) => m.left)), Math.min(...ms.map((m) => m.top)),
        Math.max(...ms.map((m) => m.right)), Math.max(...ms.map((m) => m.bottom))].map(Math.round),
      fg: cs.color, size: parseFloat(cs.fontSize), text: document.querySelector('.hero__line').textContent };
    });
    items.push({ key: `line ${s + 1}`, frames: [from, to], ...r });
  }
  for (const [key, sel] of [['sub', '.hero__sub'], ['link', '.hero__cta--line'], ['note', '.hero__note']]) {
    const r = await p.evaluate((q) => {
      const e = document.querySelector(q);
      const b = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return { box: [b.left, b.top, b.right, b.bottom].map(Math.round), fg: cs.color, size: parseFloat(cs.fontSize), text: e.textContent.trim().slice(0, 24) };
    }, sel);
    items.push({ key, frames: [0, frames], ...r });
  }
  for (const it of items) {
    const m = it.fg.match(/[\d.]+/g).map(Number);
    it.inkL = L(m[0], m[1], m[2]);
    it.need = it.size >= 24 ? 3 : 4.5;
  }
  return items;
}

async function frameImage(p) {
  return PNG.sync.read(await p.screenshot({ type: 'png', optimizeForSpeed: true }));
}

async function walkOnce(p, items, frames, scrim) {
  await setScrim(p, scrim);
  await setCopy(p, false);
  for (const it of items) { it.peak = 0; it.at = -1; }
  for (let f = 0; f < frames; f++) {
    await seek(p, f, 40);
    const im = await frameImage(p);
    for (const it of items) {
      if (f < it.frames[0] || f >= it.frames[1]) continue;
      const [x0, y0, x1, y1] = it.box;
      for (let y = Math.max(0, y0); y < Math.min(im.height, y1); y++) {
        for (let x = Math.max(0, x0); x < Math.min(im.width, x1); x++) {
          const i = (y * im.width + x) * 4;
          const l = L(im.data[i], im.data[i + 1], im.data[i + 2]);
          if (l > it.peak) { it.peak = l; it.at = f; }
        }
      }
    }
  }
  await setCopy(p, true);
  for (const it of items) it.ratio = CR(it.inkL, it.peak);
  return items.filter((it) => it.ratio < it.need);
}

const mode = process.argv[2] || 'all';
let finalScrim = mode === 'shots' ? Number(process.argv[3]) : null;
/* `scrim 55` starts the walk at 55 rather than 30. That is a RE-CHECK of a
   value already walked, for a change that moved a box but not the ground: if
   every pair still passes at 55 it stops there, and if one fails it keeps
   rising, which is the right answer either way. It is not a way to skip the
   search on a new film. */
const startAt = mode === 'scrim' && process.argv[3] ? Number(process.argv[3]) : START;

/* ---- scrim ---------------------------------------------------------------

   THE STEPS ARE COMPUTED, THE RESULT IS RENDERED. The first full walk rendered
   every step and took fifteen minutes a step: 578 held-frame screenshots, and
   the answer was six steps away. What the plate does to a pixel is arithmetic
   the browser does in 8-bit sRGB — flat asphalt over an opaque painted pixel,
   out = a * asphalt + (1 - a) * under, with the alpha quantised to 8 bits — so
   one capture at scrim 0 with the copy hidden holds everything every step
   needs. Each box keeps the DISTINCT colours it ever shows across its own
   frames (a pixel with no channel over 64 cannot be the brightest ground at a
   30% scrim or above, and is dropped to keep the set small), and each 5% step
   from 30 is the brightest of those colours composited at that alpha.

   Two checks keep that honest, and neither is optional. The computed 30% and
   35% steps are printed beside the ratios the rendered walk measured at those
   two steps, from `walk-real-30-35.log` when it is there. And the step the
   arithmetic lands on is then RENDERED, every frame at both widths, the same
   way the first walk did it; those are the numbers recorded, and if a pair
   fails there the render steps up 5% and goes again. */
const A8 = [23, 24, 26];
const alpha8 = (s) => Math.round((s / 100) * 255) / 255;

async function captureColours(p, items, frames) {
  await setScrim(p, 0);
  await setCopy(p, false);
  for (const it of items) it.colours = new Map();
  for (let f = 0; f < frames; f++) {
    await seek(p, f, 40);
    const im = await frameImage(p);
    for (const it of items) {
      if (f < it.frames[0] || f >= it.frames[1]) continue;
      const [x0, y0, x1, y1] = it.box;
      for (let y = Math.max(0, y0); y < Math.min(im.height, y1); y++) {
        for (let x = Math.max(0, x0); x < Math.min(im.width, x1); x++) {
          const i = (y * im.width + x) * 4;
          const r = im.data[i], g = im.data[i + 1], bl = im.data[i + 2];
          if (r < 64 && g < 64 && bl < 64) continue;
          const k = (r << 16) | (g << 8) | bl;
          if (!it.colours.has(k)) it.colours.set(k, f);
        }
      }
    }
  }
  await setCopy(p, true);
}

function computedStep(it, scrim) {
  const a = alpha8(scrim);
  let peak = 0, at = -1;
  for (const [k, f] of it.colours) {
    const r = Math.round(a * A8[0] + (1 - a) * (k >> 16));
    const g = Math.round(a * A8[1] + (1 - a) * ((k >> 8) & 255));
    const bl = Math.round(a * A8[2] + (1 - a) * (k & 255));
    const l = L(r, g, bl);
    if (l > peak) { peak = l; at = f; }
  }
  /* a box whose every pixel was dropped sits on ground no brighter than a
     64-level grey under a 30% plate, which is 3.4% at most */
  if (at < 0) peak = L(52, 52, 52);
  return { peak, at, ratio: CR(it.inkL, peak) };
}

if (mode === 'all' || mode === 'scrim') {
  const pages = [];
  for (const [w, h] of WIDTHS) {
    const { b, p, info } = await open(w, h);
    console.log(`${w}x${h}: ${info.src} ${info.vw}x${info.vh}, ${info.frames} frames`);
    const items = await boxes(p, info.frames);
    await captureColours(p, items, info.frames);
    console.log(`  ${w}: captured at scrim 0, ${items.map((it) => `${it.key} ${it.colours.size}`).join(', ')} distinct colours`);
    pages.push({ w, b, p, frames: info.frames, items });
  }

  /* the calibration: computed against rendered, at the two steps both exist */
  let real = '';
  try { real = (await import('node:fs')).readFileSync(join(OUT, 'walk-real-30-35.log'), 'utf8'); } catch { /* no rendered log */ }
  for (const s of [30, 35]) {
    const block = real.split(`scrim ${s}%`)[1]?.split('scrim ')[0] || '';
    for (const pg of pages) {
      for (const it of pg.items) {
        const m = block.match(new RegExp(`${pg.w}\\s+${it.key}\\s+([\\d.]+):1`));
        const c = computedStep(it, s);
        console.log(`  calibration ${s}%  ${String(pg.w).padStart(4)} ${it.key.padEnd(7)} computed ${c.ratio.toFixed(2)}:1  rendered ${m ? `${m[1]}:1` : 'passed (not listed)'}`);
      }
    }
  }

  let computed = null;
  for (let scrim = startAt; scrim <= 95; scrim += STEP) {
    const lines = [];
    let failing = 0;
    for (const pg of pages) {
      for (const it of pg.items) {
        const c = computedStep(it, scrim);
        if (c.ratio < it.need) { failing++; lines.push(`      ${String(pg.w).padStart(4)}  ${it.key.padEnd(7)} ${c.ratio.toFixed(2)}:1 (needs ${it.need})  peak ${(c.peak * 100).toFixed(1)}% at frame ${c.at}`); }
      }
    }
    console.log(`  scrim ${scrim}%  ${failing} failing pair(s), computed`);
    lines.forEach((l) => console.log(l));
    if (!failing) { computed = scrim; break; }
  }
  if (computed === null) computed = 95;

  /* the render that decides */
  for (let scrim = computed; ; scrim += STEP) {
    let failing = 0;
    const lines = [];
    for (const pg of pages) {
      const bad = await walkOnce(pg.p, pg.items, pg.frames, scrim);
      failing += bad.length;
      for (const it of bad) lines.push(`      ${String(pg.w).padStart(4)}  ${it.key.padEnd(7)} ${it.ratio.toFixed(2)}:1 (needs ${it.need})  peak ${(it.peak * 100).toFixed(1)}% at frame ${it.at}`);
    }
    console.log(`  scrim ${scrim}%  ${failing} failing pair(s), rendered`);
    lines.forEach((l) => console.log(l));
    if (!failing || scrim >= 95) { finalScrim = scrim; break; }
  }
  console.log(`\nFINAL scrim ${finalScrim}%`);
  console.log('  width  pair     size  bar   worst ratio  ground peak  at frame (shot)');
  for (const pg of pages) {
    for (const it of pg.items) {
      console.log(`  ${String(pg.w).padEnd(6)} ${it.key.padEnd(8)} ${String(Math.round(it.size)).padStart(3)}px  ${it.need.toFixed(1)}   ${it.ratio.toFixed(2).padStart(6)}:1    ${(it.peak * 100).toFixed(2).padStart(6)}%     ${it.at} (${shotOf(it.at) + 1})`);
    }
    await pg.b.close();
  }
}

/* ---- carrier and shots --------------------------------------------------- */
if (mode === 'all' || mode === 'shots') {
  if (!Number.isFinite(finalScrim)) throw new Error('no scrim to measure at');
  for (const [w, h] of WIDTHS) {
    const { b, p, info } = await open(w, h);
    await setScrim(p, finalScrim);
    const hero = await p.evaluate(() => {
      const r = document.querySelector('.hero').getBoundingClientRect();
      return [0, Math.max(0, Math.round(r.top)), Math.round(r.width), Math.min(innerHeight, Math.round(r.bottom))];
    });
    const area = (hero[2] - hero[0]) * (hero[3] - hero[1]);

    /* the call, with the copy shown, on a held frame */
    await seek(p, 22, 900);
    let im = await frameImage(p);
    const cta = await p.evaluate(() => {
      const r = document.querySelector('.hero__cta:not(.hero__cta--line)').getBoundingClientRect();
      return [r.left, r.top, r.right, r.bottom].map(Math.round);
    });
    let callPx = 0;
    for (let y = cta[1]; y < cta[3]; y++) for (let x = cta[0]; x < cta[2]; x++) {
      const i = (y * im.width + x) * 4;
      if (isAccent(im.data[i], im.data[i + 1], im.data[i + 2])) callPx++;
    }

    await setCopy(p, false);
    const per = [];
    for (let f = 0; f < info.frames; f++) {
      await seek(p, f, 40);
      im = await frameImage(p);
      let y1 = 0, o1 = 0;
      for (let y = hero[1]; y < hero[3]; y++) for (let x = hero[0]; x < hero[2]; x++) {
        const i = (y * im.width + x) * 4;
        const r = im.data[i], g = im.data[i + 1], bl = im.data[i + 2];
        if (isAccent(r, g, bl)) y1++; else if (olive(r, g, bl)) o1++;
      }
      per.push({ f, y: y1 / area * 100, o: o1 / area * 100 });
    }
    const byShot = CUT_FRAMES.map((from, s) => {
      const to = s + 1 < CUT_FRAMES.length ? CUT_FRAMES[s + 1] : info.frames;
      const rows = per.slice(from, to);
      const wy = rows.reduce((m, r) => (r.y > m.y ? r : m), rows[0]);
      const wo = rows.reduce((m, r) => (r.o > m.o ? r : m), rows[0]);
      return { s: s + 1, wy, wo };
    });
    const last = per[per.length - 1];
    console.log(`\n=== carrier ${w}, scrim ${finalScrim}%: the call alone ${(callPx / area * 100).toFixed(2)}% of the hero`);
    for (const r of byShot) {
      console.log(`  shot ${r.s}: footage yellow worst ${r.wy.y.toFixed(2)}% (frame ${r.wy.f}), olive band worst ${r.wo.o.toFixed(2)}% (frame ${r.wo.f})`);
    }
    console.log(`  held last frame: footage yellow ${last.y.toFixed(2)}%, olive band ${last.o.toFixed(2)}%`);

    /* the screen wall, copy hidden, for legibility */
    for (const f of [170, 200, 225]) {
      await seek(p, f, 120);
      writeFileSync(join(OUT, `wall-${w}-f${f}.png`), await p.screenshot({ type: 'png' }));
    }
    await setCopy(p, true);

    /* the captures */
    const mids = CUT_FRAMES.map((from, s) => Math.floor((from + (s + 1 < CUT_FRAMES.length ? CUT_FRAMES[s + 1] : info.frames)) / 2));
    for (let s = 0; s < mids.length; s++) {
      if (w !== 1280 && s !== mids.length - 1) continue;
      await seek(p, mids[s], 900);
      const name = `shot-${s + 1}-${w}.png`;
      writeFileSync(join(OUT, name), await p.screenshot({ type: 'png' }));
      console.log(`  ${name} at frame ${mids[s]}`);
    }
    await b.close();
  }
}

console.log('\nspotwalk done');

/* spotmodes.mjs — does each of the hero's three modes actually happen.

   The hero decides at mount between the spot, the still and the surface, and
   every one of those decisions is a branch a resting screenshot never takes.
   This drives each branch on the production build and reads what is painted:

     spot       nothing emulated. The film plays, each line mounts on its own
                cut, and the call and the note keep one box across all four.
     still      prefers-reduced-motion: reduce. A picture, not a video, and the
                final line with no animation running on it.
     save-data  navigator.connection.saveData, set before any script runs. The
                shader, and ZERO requests for the film or its poster.
     no video   every request for the film aborted. The spot starts, finds no
                source, and falls back to the shader.

   The clip clock is sampled in real time on a playing element, not held, so
   this is the one script that sees the lines the way a reader does: each read
   records currentTime next to the line on screen, and a line is only accepted
   if its shot contains that time.

   Usage, with the site built and served at 4179:

     node .measure/spotmodes.mjs
*/
import puppeteer from 'puppeteer';
import { CUTS, LINES } from '../src/components/home/heroSpot.js';

/* 4179 by default. A URL argument points it at another build, which is how a
   change is checked without replacing the build a long walk is reading. */
const URL = process.argv[2] || 'http://localhost:4179/';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (ok, msg) => { console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`); if (!ok) fails.push(msg); };

for (let tries = 0; ; tries++) {
  try { const r = await fetch(URL); if (r.ok) break; } catch { /* not up yet */ }
  if (tries > 60) throw new Error(`${URL} never came up`);
  await wait(500);
}

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'],
});

async function page(w, h, { reduced = false, saveData = false, blockVideo = false } = {}) {
  const p = await browser.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await p.setCacheEnabled(false);
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }]);
  if (saveData) {
    await p.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'connection', { configurable: true, get: () => ({ saveData: true, effectiveType: '4g' }) });
    });
  }
  const spotRequests = [];
  await p.setRequestInterception(true);
  p.on('request', (req) => {
    if (/\/assets\/hero\//.test(req.url())) spotRequests.push(req.url().split('/').pop());
    if (blockVideo && /\/assets\/hero\/.*\.(webm|mp4)$/.test(req.url())) req.abort();
    else req.continue();
  });
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => document.fonts.ready);
  return { p, spotRequests };
}

const state = (p) => p.evaluate(() => {
  const hero = document.querySelector('.hero');
  const v = document.querySelector('video.hero__spot');
  const line = document.querySelector('.hero__line');
  const box = (q) => { const r = document.querySelector(q).getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round).join(','); };
  return {
    mode: hero.dataset.mode,
    video: !!v, img: !!document.querySelector('img.hero__spot'), canvas: !!document.querySelector('canvas.hero__surface'),
    t: v ? v.currentTime : null, paused: v ? v.paused : null, ended: v ? v.ended : null, src: v ? v.currentSrc.split('/').pop() : null,
    line: line ? line.textContent : null, leaving: line ? line.dataset.leaving : null,
    running: document.getAnimations().filter((a) => a.playState === 'running').length,
    name: document.querySelector('#hero-h').textContent.trim(),
    cta: box('.hero__cta:not(.hero__cta--line)'), note: box('.hero__note'), sub: box('.hero__sub'),
  };
});

const shotAt = (t) => { let i = 0; while (i + 1 < CUTS.length && t >= CUTS[i + 1]) i += 1; return i; };

/* ---- spot ------------------------------------------------------------------ */
for (const [w, h, expect] of [[1280, 800, 'hero-spot.webm'], [390, 844, 'hero-spot-tall.webm']]) {
  console.log(`\n=== spot ${w}x${h}`);
  const { p } = await page(w, h);
  await p.waitForFunction(() => { const v = document.querySelector('video.hero__spot'); return v && !v.paused && v.currentTime > 0.1; }, { timeout: 20000 });
  const seen = new Map();
  const boxes = new Set();
  let wrong = 0;
  for (;;) {
    const s = await state(p);
    boxes.add(`${s.cta}|${s.note}|${s.sub}`);
    if (s.line) {
      const shot = shotAt(s.t);
      /* a read straddling a cut can see the old line with the new time for one
         frame; allow the line to be one shot behind within 60ms of a cut */
      const nearCut = CUTS.some((c) => c > 0 && Math.abs(s.t - c) < 0.06);
      const ok = s.line === LINES[shot].split(' ').join(' ') || (nearCut && s.line === LINES[Math.max(0, shot - 1)]);
      if (!ok) wrong++;
      if (!seen.has(s.line)) seen.set(s.line, s.t);
    }
    if (s.ended) break;
    await wait(50);
  }
  const end = await state(p);
  check(end.src === expect, `plays ${end.src} (expects ${expect})`);
  check(seen.size === LINES.length, `${seen.size} of ${LINES.length} lines seen: ${[...seen].map(([l, t]) => `"${l}" first at ${t.toFixed(3)}s`).join('; ')}`);
  for (let i = 1; i < LINES.length; i++) {
    const t = seen.get(LINES[i]);
    check(t !== undefined && t >= CUTS[i] && t - CUTS[i] < 0.15, `line ${i + 1} first read ${t === undefined ? 'never' : `${((t - CUTS[i]) * 1000).toFixed(0)}ms after its cut`}`);
  }
  check(wrong === 0, `${wrong} reads showed a line outside its own shot`);
  check(boxes.size === 1, `sub, call and note held ${boxes.size} distinct box set(s) across the whole spot`);
  check(end.line === LINES[LINES.length - 1] && end.leaving === 'false', `after the end the final line stays: "${end.line}", leaving ${end.leaving}`);
  check(end.name.startsWith(LINES[LINES.length - 1]), `h1 text begins with the final line`);
  await p.close();
}

/* ---- still ----------------------------------------------------------------- */
for (const [w, h] of [[1280, 800], [390, 844]]) {
  console.log(`\n=== reduced motion ${w}x${h}`);
  const { p, spotRequests } = await page(w, h, { reduced: true });
  await wait(1500);
  const s = await state(p);
  check(s.mode === 'still' && s.img && !s.video && !s.canvas, `mode ${s.mode}, picture ${s.img}, video ${s.video}, canvas ${s.canvas}`);
  check(s.line === LINES[LINES.length - 1], `line "${s.line}"`);
  check(s.running === 0, `${s.running} animations running`);
  const want = w < 768 ? 'hero-spot-tall-poster.webp' : 'hero-spot-poster.webp';
  check(spotRequests.length === 1 && spotRequests[0] === want, `hero requests: ${spotRequests.join(', ') || 'none'} (expects ${want})`);
  await p.close();
}

/* ---- save-data -------------------------------------------------------------- */
console.log('\n=== save-data 1280x800');
{
  const { p, spotRequests } = await page(1280, 800, { saveData: true });
  await wait(1500);
  const s = await state(p);
  check(s.mode === 'surface' && s.canvas && !s.video && !s.img, `mode ${s.mode}, canvas ${s.canvas}, video ${s.video}, picture ${s.img}`);
  check(s.line === LINES[LINES.length - 1], `line "${s.line}"`);
  check(spotRequests.length === 0, `hero requests: ${spotRequests.join(', ') || 'none'}`);
  await p.close();
}

/* ---- no video --------------------------------------------------------------- */
console.log('\n=== film requests aborted 1280x800');
{
  const { p } = await page(1280, 800, { blockVideo: true });
  await p.waitForFunction(() => document.querySelector('.hero').dataset.mode !== 'spot', { timeout: 15000 }).catch(() => {});
  await wait(500);
  const s = await state(p);
  check(s.mode === 'surface' && s.canvas && !s.video, `mode ${s.mode}, canvas ${s.canvas}, video ${s.video}`);
  check(s.line === LINES[LINES.length - 1], `line "${s.line}"`);
  await p.close();
}

await browser.close();
console.log(fails.length ? `\n${fails.length} check(s) failed` : '\nevery mode behaves');
process.exit(fails.length ? 1 : 0);

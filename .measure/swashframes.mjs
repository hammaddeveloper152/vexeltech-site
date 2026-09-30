/* swashframes.mjs: what a swash does while a page loads on a slow phone,
   2026-09-30 (the founder's About swash fix).

   A cold load under CPU x4 and DevTools' Fast 3G (562.5ms latency,
   1.44 Mbps down, 675 kbps up). Two records, both from navigation to 2.5s:

   - A PROBE, injected before any page script, that every 100ms writes down
     the first highlighted swash on the page (`.brush--hl`): whether Monigue
     and Clash are loaded, the stroke's width, height and box, the word's
     box, its colour, the draw state and the path's painted
     stroke-dashoffset, and the wrapper's inline margin (the hold). Page
     screenshots under a 4x CPU throttle cannot keep a 100ms cadence, so the
     probe carries the timing.
   - A SCREENCAST (CDP), every frame with its timestamp. The frame nearest
     each 100ms is saved, cropped to the word.

   Usage: node .measure/swashframes.mjs <route> <width> <height> [ms] [base] [sel]
   (Git Bash: prefix MSYS_NO_PATHCONV=1, or it rewrites the route.)
   e.g.   node .measure/swashframes.mjs /about-us 390 844
   Frames and report go to .measure/out/swashframes/<route>-<width>/. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const [route = '/about-us', W = '390', H = '844', SPAN = '6000', BASE = 'http://localhost:4173', SEL = '.brush--hl'] = process.argv.slice(2);
/* The brief asked for 0 to 2.5s; under Fast 3G a route other than home
   paints nothing before about 2.6s (it waits for the full stylesheet), so
   the window is a parameter, 6s by default. */
const SPAN_MS = Number(SPAN);
const w = Number(W);
const h = Number(H);
const OUT = path.join(HERE, 'out', 'swashframes', `${route.replace(/\//g, '') || 'home'}-${w}${process.env.FONT_DELAY ? `-fonts${process.env.FONT_DELAY}` : ''}${process.env.TAG ? `-${process.env.TAG}` : ''}`);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await b.createBrowserContext();
const p = await ctx.newPage();
const errors = [];
p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
p.on('pageerror', (e) => errors.push(e.message));
await p.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
const cdp = await p.createCDPSession();
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
/* NET=0 keeps the CPU throttle and drops Fast 3G: under Fast 3G home's film
   does not reach its second cut inside 9s, so "Yet." never mounts. */
if (process.env.NET !== '0') {
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 562.5,
    downloadThroughput: (1.44 * 1024 * 1024) / 8,
    uploadThroughput: (675 * 1024) / 8,
  });
}
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

/* FONT_DELAY=ms holds every woff2 back that long, for the case this
   throttle alone does not show: a phone whose fonts arrive after the text
   has been laid out in the fallback face. */
const FONT_DELAY = Number(process.env.FONT_DELAY || 0);
if (FONT_DELAY) {
  await p.setRequestInterception(true);
  p.on('request', (req) => {
    if (/\.woff2(\?|$)/.test(req.url())) setTimeout(() => req.continue().catch(() => {}), FONT_DELAY);
    else req.continue().catch(() => {});
  });
}

await p.evaluateOnNewDocument((SEL, SPAN_MS) => {
  const t0 = performance.now();
  window.__swash = [];
  const snap = () => {
    const t = Math.round(performance.now() - t0);
    const wrap = document.querySelector(SEL);
    const fonts = document.fonts
      ? { monigue: document.fonts.check('40px Monigue'), clash: document.fonts.check('40px "Clash Display"'), status: document.fonts.status }
      : null;
    if (!wrap) {
      window.__swash.push({ t, fonts, present: false });
      return;
    }
    const svg = wrap.querySelector('.brush__stroke');
    const word = wrap.querySelector('.brush__t');
    const wr = word.getBoundingClientRect();
    const rects = Array.from(word.getClientRects()).map((r) => [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]);
    let s = null;
    if (svg) {
      const r = svg.getBoundingClientRect();
      const cs = getComputedStyle(svg);
      const path = svg.querySelector('path');
      s = {
        attrW: Number(svg.getAttribute('width')),
        attrH: Number(svg.getAttribute('height')),
        box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
        opacity: cs.opacity,
        drawn: svg.getAttribute('data-drawn'),
        dashoffset: path ? getComputedStyle(path).strokeDashoffset : null,
      };
    }
    window.__swash.push({
      t,
      fonts,
      present: true,
      word: [Math.round(wr.left), Math.round(wr.top), Math.round(wr.width), Math.round(wr.height)],
      rects,
      wordColor: getComputedStyle(word).color,
      wordOpacity: getComputedStyle(word).opacity,
      hold: getComputedStyle(wrap).marginLeft,
      svg: s,
    });
  };
  const id = setInterval(snap, 100);
  setTimeout(() => clearInterval(id), SPAN_MS + 100);
  document.addEventListener('DOMContentLoaded', snap);
}, SEL, SPAN_MS);

const frames = [];
cdp.on('Page.screencastFrame', async (f) => {
  frames.push({ ts: f.metadata.timestamp, data: f.data });
  cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
});
await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 });
const navStart = Date.now() / 1000;
p.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
await new Promise((r) => setTimeout(r, SPAN_MS + 700));
await cdp.send('Page.stopScreencast');
const probe = await p.evaluate(() => window.__swash || []);

/* The frame nearest each 100ms after navigation. The screencast's clock is
   wall time; the probe's is the document's, which starts a little after. */
const saved = [];
for (let ms = 0; ms <= SPAN_MS; ms += 100) {
  const target = navStart + ms / 1000;
  let best = null;
  for (const f of frames) if (f.ts <= target + 0.05 && (!best || f.ts > best.ts)) best = f;
  if (best) {
    const file = `f${String(ms).padStart(4, '0')}.png`;
    fs.writeFileSync(path.join(OUT, file), Buffer.from(best.data, 'base64'));
    saved.push({ ms, file, frameAt: Math.round((best.ts - navStart) * 1000) });
  }
}

await b.close();
const report = { route, w, h, framesCaptured: frames.length, saved, probe, errors };
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));

/* A compact table: one row per probe tick. */
for (const s of probe) {
  if (!s.present) {
    console.log(String(s.t).padStart(5), 'no swash yet', s.fonts ? `monigue:${s.fonts.monigue}` : '');
    continue;
  }
  const g = s.svg;
  console.log(
    String(s.t).padStart(5),
    `mon:${s.fonts.monigue ? 'Y' : 'n'}`,
    `word ${s.word.join(',')}`,
    g ? `svg ${g.attrW}x${g.attrH} @${g.box[0]},${g.box[1]} op${g.opacity} drawn:${g.drawn} dash:${g.dashoffset}` : 'svg none',
    `hold ${s.hold}`,
    `ink ${s.wordColor}`,
    s.rects.length > 1 ? `ROWS ${s.rects.length}` : ''
  );
}
console.log('frames', frames.length, 'errors', JSON.stringify(errors));

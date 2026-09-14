/* barwalk.mjs — the bar over the hero film.

   node .measure/barwalk.mjs walk  [base]          nav contrast, shade walked
   node .measure/barwalk.mjs shots [base]          0px and 200px at 1280, states

   WALK. Ten frames spread evenly over the spot (0 to 288). Per frame, the
   film is held on that frame, the bar's text is made transparent, and the
   brightest pixel inside each nav item's own line box is that item's ground:
   the film under the gradient, at its brightest where the words sit. The four
   links and the call at 1280 (labels at 12px and the call at 18px: 4.5:1),
   the menu glyph at 390 (a graphic: 3:1). The wordmark is the identity's and
   exempt. The gradient's top stop starts at 55% and rises in 5% steps until
   every item passes on every frame.

   SHOTS. The last frame held, the page at 0 and at 200px, at 1280; the bar's
   state and its layers' transition read at each, and again under reduced
   motion, where the transition must be none. */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import fs from 'node:fs';
import { FPS } from '../src/components/home/heroSpot.js';

const [mode = 'walk', base = 'http://localhost:4180/'] = process.argv.slice(2);
const out = '.measure/out/bar';
fs.mkdirSync(out, { recursive: true });
const FRAMES = Array.from({ length: 10 }, (_, i) => Math.round((i * 288) / 9));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

async function open(w, h, reduce = false) {
  const b = await puppeteer.launch({ headless: 'new',
    args: ['--force-color-profile=srgb', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(base, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  return { b, p };
}

const hold = (p, f) => p.evaluate(async (t) => {
  const v = document.querySelector('video.hero__spot');
  if (!v) return false;
  if (v.readyState < 2) {
    await new Promise((r) => { const tm = setTimeout(r, 15000); v.addEventListener('loadeddata', () => { clearTimeout(tm); r(); }, { once: true }); });
  }
  v.pause();
  return new Promise((r) => { const tm = setTimeout(() => r(false), 10000); v.addEventListener('seeked', () => { clearTimeout(tm); r(true); }, { once: true }); v.currentTime = t; });
}, (f + 0.5) / FPS);

const barState = (p) => p.evaluate(() => {
  const bar = document.querySelector('.bar');
  const before = getComputedStyle(bar, '::before');
  const after = getComputedStyle(bar, '::after');
  return {
    over: bar.dataset.over, solid: bar.dataset.solid, y: Math.round(window.scrollY),
    gradient: +before.opacity, solidLayer: +after.opacity,
    hairline: after.borderBottomWidth + ' ' + after.borderBottomColor,
    transition: after.transitionDuration + ' ' + after.transitionTimingFunction,
    heroTop: document.querySelector('.hero, .abt__top')
      ? Math.round(document.querySelector('.hero, .abt__top').getBoundingClientRect().top + window.scrollY)
      : null,
    barH: Math.round(bar.getBoundingClientRect().height),
  };
});

if (mode === 'walk') {
  for (const [w, h] of [[1280, 800], [390, 844]]) {
    const { b, p } = await open(w, h);
    const st = await barState(p);
    console.log(`\n=== ${w}x${h}  bar over=${st.over} solid=${st.solid}; hero top ${st.heroTop}, bar ${st.barH}px`);
    await p.addStyleTag({ content: '.bar-ink-off .bar__link, .bar-ink-off .bar__cta { color: transparent !important } .bar-ink-off .bar__menu svg { visibility: hidden }' });
    const targets = await p.evaluate(() => {
      const list = [];
      for (const el of document.querySelectorAll('.bar__link, .bar__inner > .bar__cta, .bar__menu')) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || !el.getClientRects().length) continue;
        if (el.classList.contains('bar__menu')) {
          const r = el.querySelector('svg').getBoundingClientRect();
          list.push({ label: 'menu glyph', need: 3, color: cs.color, rects: [[r.left, r.top, r.width, r.height]] });
        } else {
          const rg = document.createRange();
          rg.selectNodeContents(el);
          list.push({ label: el.textContent.trim(), need: parseFloat(cs.fontSize) >= 24 ? 3 : 4.5, color: cs.color,
            rects: [...rg.getClientRects()].map((r) => [r.left, r.top, r.width, r.height]) });
        }
      }
      return list;
    });

    let shade = 55;
    let result;
    for (;;) {
      await p.evaluate((s) => document.querySelector('.bar').style.setProperty('--bar-shade', `${s}%`), shade);
      const worst = targets.map((t) => ({ ...t, ratio: Infinity, at: null, ground: null }));
      for (const f of FRAMES) {
        if (!(await hold(p, f))) { console.log(`  could not hold frame ${f}`); continue; }
        await wait(250);
        await p.evaluate(() => document.documentElement.classList.add('bar-ink-off'));
        await wait(60);
        const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
        await p.evaluate(() => document.documentElement.classList.remove('bar-ink-off'));
        for (const t of worst) {
          const [r, g, bl] = (t.color.match(/[\d.]+/g) || []).map(Number);
          const ink = L(r, g, bl);
          let max = 0, px = null;
          for (const [x0, y0, rw, rh] of t.rects) {
            for (let y = Math.max(0, Math.floor(y0)); y < Math.min(im.height, Math.ceil(y0 + rh)); y++) {
              for (let x = Math.max(0, Math.floor(x0)); x < Math.min(im.width, Math.ceil(x0 + rw)); x++) {
                const i = (y * im.width + x) * 4;
                const l = L(im.data[i], im.data[i + 1], im.data[i + 2]);
                if (l > max) { max = l; px = `rgb(${im.data[i]},${im.data[i + 1]},${im.data[i + 2]})`; }
              }
            }
          }
          const ratio = CR(ink, max);
          if (ratio < t.ratio) { t.ratio = ratio; t.at = f; t.ground = px; }
        }
      }
      const fails = worst.filter((t) => t.ratio < t.need);
      console.log(`  top stop ${shade}%: ${fails.length ? `${fails.length} failing` : 'every item passes'} — ` +
        worst.map((t) => `${t.label} ${t.ratio.toFixed(2)}:1 f${t.at} over ${t.ground}`).join('; '));
      if (!fails.length || shade >= 100) { result = { shade, pass: !fails.length }; break; }
      shade += 5;
    }
    console.log(`RESULT ${w} ${JSON.stringify(result)}`);
    await b.close();
  }
}

if (mode === 'shots') {
  const { b, p } = await open(1280, 800);
  await hold(p, 288);
  await wait(900);
  console.log('0px  ', JSON.stringify(await barState(p)));
  await p.screenshot({ path: `${out}/header-0.png` });
  await p.evaluate(() => window.scrollTo(0, 200));
  await wait(800);
  console.log('200px', JSON.stringify(await barState(p)));
  await p.screenshot({ path: `${out}/header-200.png` });
  await p.evaluate(() => window.scrollTo(0, 60));
  await wait(800);
  console.log('60px ', JSON.stringify(await barState(p)));
  await p.evaluate(() => window.scrollTo(0, 81));
  await wait(800);
  console.log('81px ', JSON.stringify(await barState(p)));
  await b.close();

  const r = await open(1280, 800, true);
  console.log('reduced 0px  ', JSON.stringify(await barState(r.p)));
  await r.p.evaluate(() => window.scrollTo(0, 200));
  await wait(400);
  console.log('reduced 200px', JSON.stringify(await barState(r.p)));
  await r.b.close();

  for (const route of ['about-us', 'pricing']) {
    const o = await open(1280, 800);
    await o.p.goto(base + route, { waitUntil: 'networkidle0' });
    console.log(`/${route} 0px`, JSON.stringify(await barState(o.p).catch(() => null)) || '');
    await o.b.close();
  }
}

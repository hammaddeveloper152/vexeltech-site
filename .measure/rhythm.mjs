/* rhythm.mjs — the carrier rule, frame by frame, with grounds and objects out.

   2026-09-14 the page took two colour bands with objects on them, and the
   user amended the carrier rule the same day in two ways:

     - A GROUND IS NOT A CARRIER. The yellow Failures band and the yellow
       pricing panel lay down a ground; they are not the frame's accent.
     - A BRAND OBJECT IS NOT A CARRIER, like the wordmark: the mascot, the
       handset and the four icons, however much yellow is drawn into them.

   Everything else that paints machine yellow is still counted — the calls,
   the work grid's Branding tags, the counter row's lead figure, the tab pill —
   and BUILD-LAW's rule is still per VIEWPORT: two carriers in one frame is a
   finding, however briefly the scroll holds them together.

   So a share of yellow is not the answer. Each yellow REGION is attributed to
   the element that paints it — the nearest element whose own background,
   whose ::before or ::after background, or whose text colour is the accent,
   or which is an image, video or canvas — and that element is either exempt
   (a ground, an object, the hero film, the wordmark) or a carrier named by its
   class. A frame with two distinct carriers is reported.

   Regions under 24px are anti-alias dust and glyph fringes, not objects.

   `shots` mode takes the full-page captures instead.

     node .measure/rhythm.mjs walk <base> <route>...
     node .measure/rhythm.mjs shots <base> <route>:<name>...
*/
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { isAccent } from './lib.mjs';

const [mode = 'walk', base = 'http://localhost:4180', ...routes] = process.argv.slice(2);
const OUT = join(process.cwd(), '.measure', 'out', 'rhythm');
mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* Exempt, and why, and HOW each is matched — which is the part that was wrong.

   A GROUND IS EXEMPT ONLY WHEN IT IS THE PAINTER. The first run matched every
   exemption against the painter OR ANY ANCESTOR, so the pricing page's active
   tab pill and its lead card's solid call — carriers standing on the yellow
   panel, inside its box — were exempted as the panel, and the page reported
   one carrier where it has three. A ground's own descendants are not the
   ground. `self` matches the painter alone; `within` matches it or an
   ancestor, which is right for the wordmark, whose yellow is painted by a
   child of `.wm`, and harmless for an image or a video, which have none. */
const EXEMPT = [
  ['.fail', 'ground: the Failures band', 'self'],
  ['.tabs', 'ground: the pricing panel', 'self'],
  ['img[src*="/assets/objects/"]', 'brand object', 'within'],
  ['.hero__spot', 'the hero film, recorded exception', 'within'],
  ['.svc__art-img', 'Services tile, generated artwork (BUILD-LAW 2026-09-15)', 'within'],
  /* The whole ticker, not the strike: mid-draw and at its anti-aliased edges
     the strike's pixels resolve to the phrase or the view as their painter. */
  ['.ticker', 'the strike ticker, exempt as a ticker (DESIGN 2026-09-15)', 'within'],
  ['.wm', 'the wordmark', 'within'],
];

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text', '--hide-scrollbars',
    '--autoplay-policy=no-user-gesture-required', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});

async function open(route, w, h) {
  const p = await browser.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await p.goto(base + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await wait(800);
  /* walk once so every reveal has arrived, then come back */
  const tot = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < tot; y += Math.round(h / 2)) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await wait(120);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await wait(600);
  return p;
}

function regions(im) {
  const { width: w, height: h, data } = im;
  const mask = new Uint8Array(w * h);
  for (let px = 0, i = 0; px < w * h; px++, i += 4) if (isAccent(data[i], data[i + 1], data[i + 2])) mask[px] = 1;
  const out = [];
  const st = [];
  for (let px = 0; px < w * h; px++) {
    if (mask[px] !== 1) continue;
    let n = 0, x0 = w, y0 = h, x1 = -1, y1 = -1, sx = 0, sy = 0;
    st.push(px); mask[px] = 2;
    while (st.length) {
      const q = st.pop();
      const qx = q % w, qy = (q - qx) / w;
      if (n === 0 || (n < 64 && (qx + qy) % 7 === 0)) { sx = qx; sy = qy; }
      n++;
      if (qx < x0) x0 = qx; if (qx > x1) x1 = qx; if (qy < y0) y0 = qy; if (qy > y1) y1 = qy;
      if (qx > 0 && mask[q - 1] === 1) { mask[q - 1] = 2; st.push(q - 1); }
      if (qx < w - 1 && mask[q + 1] === 1) { mask[q + 1] = 2; st.push(q + 1); }
      if (qy > 0 && mask[q - w] === 1) { mask[q - w] = 2; st.push(q - w); }
      if (qy < h - 1 && mask[q + w] === 1) { mask[q + w] = 2; st.push(q + w); }
    }
    if (n >= 24) out.push({ n, box: [x0, y0, x1, y1], at: [sx, sy] });
  }
  return out;
}

async function attribute(p, regs) {
  return p.evaluate((rs, EX) => {
    const isY = (s) => { const m = (s || '').match(/[\d.]+/g); if (!m) return false; const [r, g, b, a = 1] = m.map(Number); return a > 0.5 && Math.abs(r - 240) < 20 && Math.abs(g - 179) < 20 && Math.abs(b - 35) < 30; };
    const name = (e) => { const c = e.className; const s = typeof c === 'string' ? c : (c && c.baseVal) || ''; return s.split(' ').filter(Boolean)[0] || e.tagName.toLowerCase(); };
    return rs.map((r) => {
      let e = document.elementFromPoint(r.at[0], r.at[1]);
      if (!e) return { ...r, owner: 'nothing', exempt: null };
      let painter = null;
      for (let a = e; a && a !== document.documentElement; a = a.parentElement) {
        if (['IMG', 'VIDEO', 'CANVAS'].includes(a.tagName)) { painter = a; break; }
        const cs = getComputedStyle(a);
        if (isY(cs.backgroundColor) || isY(getComputedStyle(a, '::before').backgroundColor) ||
            isY(getComputedStyle(a, '::after').backgroundColor) || isY(cs.color) || isY(cs.borderTopColor) || isY(cs.outlineColor)) { painter = a; break; }
        if (a.tagName === 'svg' || a.closest('svg')) { const s = a.closest('svg'); if (isY(getComputedStyle(s).color) || isY(getComputedStyle(s).fill)) { painter = s; break; } }
      }
      painter = painter || e;
      for (const [sel, why, how] of EX) {
        const hit = how === 'self' ? painter.matches(sel) : painter.closest(sel);
        if (hit) return { ...r, owner: name(painter), exempt: why };
      }
      return { ...r, owner: name(painter), exempt: null };
    });
  }, regs, EXEMPT);
}

if (mode === 'walk') {
  for (const route of routes) {
    for (const [w, h] of [[1280, 800], [390, 844]]) {
      const p = await open(route, w, h);
      const tot = await p.evaluate(() => document.documentElement.scrollHeight);
      const step = Math.round(h / 4);
      let shared = 0;
      const exemptSeen = new Map();
      const carriersSeen = new Map();
      console.log(`\n=== ${route} at ${w}x${h}, ${tot}px, every ${step}px`);
      for (let y = 0; y <= tot - h; y += step) {
        await p.evaluate((v) => { document.scrollingElement.scrollTop = v; }, y);
        await wait(200);
        const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
        const regs = await attribute(p, regions(im));
        const carriers = new Map();
        for (const r of regs) {
          if (r.exempt) { exemptSeen.set(r.exempt, (exemptSeen.get(r.exempt) || 0) + 1); continue; }
          carriers.set(r.owner, (carriers.get(r.owner) || 0) + r.n);
        }
        for (const [k, n] of carriers) carriersSeen.set(k, Math.max(carriersSeen.get(k) || 0, n / (w * h) * 100));
        if (carriers.size > 1) {
          shared++;
          console.log(`  ${String(y).padStart(6)}  TWO CARRIERS  ${[...carriers].map(([k, n]) => `${k} ${(n / (w * h) * 100).toFixed(2)}%`).join('  +  ')}`);
        }
      }
      console.log(`  carriers met, worst share of a frame: ${[...carriersSeen].map(([k, v]) => `${k} ${v.toFixed(2)}%`).join(', ') || 'none'}`);
      console.log(`  exempt regions seen: ${[...exemptSeen].map(([k, v]) => `${k} (${v})`).join(', ') || 'none'}`);
      console.log(`  ${shared ? `${shared} frame(s) hold two carriers` : 'no frame holds two carriers'}`);
      await p.close();
    }
  }
}

if (mode === 'shots') {
  for (const spec of routes) {
    const [route, label] = spec.split(':');
    const p = await open(route, 1280, 800);
    const file = join(OUT, `${label}-1280-full.png`);
    writeFileSync(file, await p.screenshot({ type: 'png', fullPage: true }));
    console.log(`${route} -> ${file}`);
    await p.close();
  }
}

await browser.close();

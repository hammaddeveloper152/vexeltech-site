/* spotshade.mjs — the hero spot's shade and the shadow under its copy, walked.

   2026-09-14 the copy plate came out. The film is never dimmed edge to edge:
   contrast is bought UNDER THE COPY. Three attempts are recorded, and this file
   keeps all three so every number in DESIGN.md can be re-derived.

     need    THE SINGLE SHADE, as first briefed: asphalt at the left edge to
             nothing at 62%. For every pixel in every text box on every frame,
             solve the left-edge opacity that pixel needs at its x. Result at
             1280: lines 2 to 4, the sub and the note needed over 100%, because
             the headline runs past the shade and the film has near-white
             pixels under the copy. `--inject` applies that shade in the page,
             since it no longer exists in the build.
     halo    THE SINGLE SHADE plus a tight shadow under every glyph, stepped to
             double full strength. Failed at both widths at the strongest step:
             the lights sit right beside the letters. Needs `--inject` too.
     zones   THE ZONED SHADE AS BUILT: a headline zone to the headline's right
             edge + 24px, a copy zone to 62%, each walked on its own pairs in 5%
             steps from 55, with the soft shadows drawn.

   ---- How a ground is read once a shadow is part of it --------------------

   Hiding the copy to read the ground hides its shadow with it. So `halo` and
   `zones` take each line's glyphs as a mask — rendered white on a blank page —
   dilate it into a RING (3px for the headline, 2px for the smaller copy), and on
   every frame render the page with the ink transparent and the shadows still
   drawn. The brightest pixel in a ring is that pair's ground. Captures are
   clipped to the copy block.

     node .measure/spotshade.mjs zones
     node .measure/spotshade.mjs need --inject
     node .measure/spotshade.mjs halo --inject
*/
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import { CUT_FRAMES, FPS } from '../src/components/home/heroSpot.js';

const args = process.argv.slice(2);
const mode = args[0] || 'zones';
const INJECT = args.includes('--inject');
const URL = process.env.SPOT_URL || 'http://localhost:4179/';
const ONLY = process.env.SPOT_WIDTH ? Number(process.env.SPOT_WIDTH) : null;
const STOP = 0.62;
const LAYER = 0.6;
const ASPHALT = [23, 24, 26];
const WIDTHS = [[1280, 800], [390, 844]].filter(([w]) => !ONLY || w === ONLY);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const LIN = new Float64Array(256).map((_, i) => { const c = i / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
const L = (r, g, b) => 0.2126 * LIN[r] + 0.7152 * LIN[g] + 0.0722 * LIN[b];
const CR = (a, b) => { const hi = Math.max(a, b), lo = Math.min(a, b); return (hi + 0.05) / (lo + 0.05); };
const shotOf = (f) => { let i = 0; while (i + 1 < CUT_FRAMES.length && f >= CUT_FRAMES[i + 1]) i += 1; return i + 1; };

/* The single shade the first two attempts measured, for `--inject`: no plate,
   no zones, no bottom fade, one layer over the left 60% ending at 62%. */
const INJECT_CSS = `
  .hero__body::before, .hero__headline::before, .hero__support::before { display: none !important; }
  .hero__spot { mask-image: none !important; -webkit-mask-image: none !important; }
  .hero::after {
    content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 60%;
    z-index: 1; pointer-events: none;
    background: linear-gradient(to right, rgb(23 24 26 / var(--shade)) 0%, rgb(23 24 26 / 0%) 103.3333%);
  }
  .hero__headline { text-shadow: 0 0 3px rgb(0 0 0 / var(--copy-halo)), 0 0 3px rgb(0 0 0 / var(--copy-halo-2)), 0 2px 24px rgb(0 0 0 / 60%) !important; }
  .hero__sub, .hero__note, .hero__cta--line { text-shadow: 0 0 2px rgb(0 0 0 / var(--copy-halo)), 0 0 2px rgb(0 0 0 / var(--copy-halo-2)), 0 1px 12px rgb(0 0 0 / 60%) !important; }
`;

async function open(w, h) {
  const b = await puppeteer.launch({ headless: 'new',
    args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await p.goto(URL, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  if (INJECT) await p.addStyleTag({ content: INJECT_CSS });
  const info = await p.evaluate(async () => {
    const v = document.querySelector('video.hero__spot');
    const hero = document.querySelector('.hero');
    if (!v) return { mode: hero.dataset.mode };
    if (v.readyState < 2) {
      const ok = await new Promise((r) => { const t = setTimeout(() => r(false), 15000); v.addEventListener('loadeddata', () => { clearTimeout(t); r(true); }, { once: true }); });
      if (!ok) return { mode: hero.dataset.mode, error: 'loadeddata never fired' };
    }
    v.pause();
    const box = (e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round); };
    const cs = getComputedStyle(v);
    /* 24fps, the clip's own rate */
    return { mode: hero.dataset.mode, src: v.currentSrc.split('/').pop(), frames: Math.round(v.duration * 24),
      section: box(hero), film: box(v), fit: cs.objectFit, mask: cs.maskImage || cs.webkitMaskImage, vw: innerWidth, vh: innerHeight };
  }).catch((e) => ({ error: String(e) }));
  return { b, p, info };
}

async function seek(p, frame, settle) {
  const ok = await p.evaluate((t) => new Promise((r) => {
    const v = document.querySelector('video.hero__spot');
    const tm = setTimeout(() => r(false), 10000);
    v.addEventListener('seeked', () => { clearTimeout(tm); r(true); }, { once: true });
    v.currentTime = t;
  }), (frame + 0.5) / FPS);
  if (!ok) throw new Error(`seek to frame ${frame} did not fire 'seeked'`);
  await wait(settle);
}

const styleTag = (p, id, css) => p.evaluate(([i, c]) => {
  let el = document.getElementById(i);
  if (!el) { el = document.createElement('style'); el.id = i; document.head.appendChild(el); }
  el.textContent = c;
}, [id, css]);

const setVars = (p, vars) => styleTag(p, 'spotshade-vars',
  `.hero { ${Object.entries(vars).map(([k, v]) => `${k}: ${v} !important;`).join(' ')} }`);

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
      fg: cs.color, size: parseFloat(cs.fontSize) };
    });
    items.push({ key: `line ${s + 1}`, zone: 'head', frames: [from, to], ...r });
  }
  for (const [key, sel] of [['sub', '.hero__sub'], ['link', '.hero__cta--line'], ['note', '.hero__note']]) {
    const r = await p.evaluate((q) => {
      const e = document.querySelector(q);
      const b = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return { box: [b.left, b.top, b.right, b.bottom].map(Math.round), fg: cs.color, size: parseFloat(cs.fontSize),
        lines: Math.round(b.height / parseFloat(cs.lineHeight)) };
    }, sel);
    items.push({ key, zone: 'copy', frames: [0, frames], ...r });
  }
  for (const it of items) {
    const m = it.fg.match(/[\d.]+/g).map(Number);
    it.inkL = L(m[0], m[1], m[2]);
    it.need = it.size >= 24 ? 3 : 4.5;
    it.maxL = (it.inkL + 0.05) / it.need - 0.05;
  }
  return items;
}

/* ---- rings -------------------------------------------------------------- */

const MASK_CSS = `
  .hero__spot, .hero__grain { visibility: hidden !important; }
  .hero::after, .hero__headline::before, .hero__support::before, .hero__body::before { display: none !important; }
  .hero__headline, .hero__sub, .hero__note, .hero__cta--line { text-shadow: none !important; color: #fff !important; }
  .hero__cta:not(.hero__cta--line) { visibility: hidden !important; }
`;
const RENDER_CSS = `
  .hero__headline, .hero__sub, .hero__note, .hero__cta--line { color: transparent !important; -webkit-text-fill-color: transparent !important; text-decoration-color: transparent !important; }
  .hero__cta:not(.hero__cta--line) { visibility: hidden !important; }
`;

async function buildRings(p, items, w, h) {
  await styleTag(p, 'spotshade-state', MASK_CSS);
  const clip = { x0: w, y0: h, x1: 0, y1: 0 };
  const masks = new Map();
  const grab = async (it) => {
    const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
    const [x0, y0, x1, y1] = it.box;
    const R = it.zone === 'head' ? 3 : 2;
    const bw = x1 - x0 + 2 * R, bh = y1 - y0 + 2 * R, ox = x0 - R, oy = y0 - R;
    const glyph = new Uint8Array(bw * bh);
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      const X = ox + x, Y = oy + y;
      if (X < 0 || Y < 0 || X >= im.width || Y >= im.height) continue;
      const i = (Y * im.width + X) * 4;
      if (L(im.data[i], im.data[i + 1], im.data[i + 2]) >= 0.5) glyph[y * bw + x] = 1;
    }
    const ring = [];
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      if (glyph[y * bw + x]) continue;
      let near = false;
      for (let dy = -R; dy <= R && !near; dy++) for (let dx = -R; dx <= R; dx++) {
        if (dx * dx + dy * dy > R * R) continue;
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < bw && yy < bh && glyph[yy * bw + xx]) { near = true; break; }
      }
      if (!near) continue;
      const X = ox + x, Y = oy + y;
      if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
      ring.push([X, Y]);
      if (X < clip.x0) clip.x0 = X; if (Y < clip.y0) clip.y0 = Y;
      if (X > clip.x1) clip.x1 = X; if (Y > clip.y1) clip.y1 = Y;
    }
    masks.set(it.key, ring);
  };
  for (const it of items.filter((i) => i.zone === 'head')) {
    await seek(p, Math.floor((it.frames[0] + it.frames[1]) / 2), 900);
    await grab(it);
  }
  for (const it of items.filter((i) => i.zone === 'copy')) await grab(it);
  const cw = clip.x1 - clip.x0 + 1;
  const ch = clip.y1 - clip.y0 + 1;
  /* indices into the clipped capture's pixel array */
  const rings = new Map();
  for (const [k, ring] of masks) rings.set(k, Int32Array.from(ring.map(([X, Y]) => ((Y - clip.y0) * cw + (X - clip.x0)) * 4)));
  console.log(`  ring pixels: ${items.map((it) => `${it.key} ${rings.get(it.key).length / 1}`).join(', ')}; capture clip ${cw}x${ch} at ${clip.x0},${clip.y0}`);
  return { rings, clip: { x: clip.x0, y: clip.y0, width: cw, height: ch } };
}

async function renderRings(p, items, rings, clip, frames, vars) {
  await styleTag(p, 'spotshade-state', RENDER_CSS);
  await setVars(p, vars);
  for (const it of items) { it.peak = 0; it.at = -1; }
  for (let f = 0; f < frames; f++) {
    await seek(p, f, 40);
    const im = PNG.sync.read(await p.screenshot({ type: 'png', optimizeForSpeed: true, clip }));
    for (const it of items) {
      if (f < it.frames[0] || f >= it.frames[1]) continue;
      const ring = rings.get(it.key);
      for (let k = 0; k < ring.length; k++) {
        const i = ring[k];
        const l = L(im.data[i], im.data[i + 1], im.data[i + 2]);
        if (l > it.peak) { it.peak = l; it.at = f; }
      }
    }
  }
  return items.map((it) => ({ key: it.key, zone: it.zone, need: it.need, ratio: CR(it.inkL, it.peak), peak: it.peak, at: it.at, lines: it.lines }));
}

const row = (r) => `    ${r.key.padEnd(8)} bar ${r.need.toFixed(1)}  ${r.ratio.toFixed(2)}:1  ring peak ${(r.peak * 100).toFixed(2)}% at f${r.at} (shot ${shotOf(r.at)})${r.ratio < r.need ? '  FAILS' : ''}`;

/* ---- the walk ------------------------------------------------------------ */

for (const [w, h] of WIDTHS) {
  const { b, p, info } = await open(w, h);
  console.log(`\n=== ${w}x${h}  ${mode}${INJECT ? ', injected single shade' : ', as built'}`);
  console.log(`  viewport ${info.vw}x${info.vh}; section ${JSON.stringify(info.section)}; film ${JSON.stringify(info.film)}; object-fit ${info.fit}; mask ${info.mask}`);
  if (info.error || info.mode !== 'spot') { console.log(`  cannot walk: ${JSON.stringify(info)}`); await b.close(); continue; }
  const frames = info.frames;
  const items = await boxes(p, frames);
  const W = w;

  if (mode === 'need') {
    await setVars(p, { '--shade': '0%' });
    await styleTag(p, 'spotshade-state', `.hero__body > * { visibility: hidden !important; }`);
    const alphaNeeded = (r, g, bl, maxL) => {
      let lo = 0, hi = 1;
      for (let k = 0; k < 14; k++) {
        const a = (lo + hi) / 2;
        const l = L(Math.round(a * ASPHALT[0] + (1 - a) * r), Math.round(a * ASPHALT[1] + (1 - a) * g), Math.round(a * ASPHALT[2] + (1 - a) * bl));
        if (l <= maxL) hi = a; else lo = a;
      }
      return hi;
    };
    for (const it of items) { it.needS = 0; it.needAt = null; it.unfix = 0; it.unfixWorst = Infinity; it.unfixAt = null; }
    for (let f = 0; f < frames; f++) {
      await seek(p, f, 40);
      const im = PNG.sync.read(await p.screenshot({ type: 'png', optimizeForSpeed: true }));
      for (const it of items) {
        if (f < it.frames[0] || f >= it.frames[1]) continue;
        const [x0, y0, x1, y1] = it.box;
        for (let y = Math.max(0, y0); y < Math.min(im.height, y1); y++) for (let x = Math.max(0, x0); x < Math.min(im.width, x1); x++) {
          const i = (y * im.width + x) * 4;
          const r = im.data[i], g = im.data[i + 1], bl = im.data[i + 2];
          const l0 = L(r, g, bl);
          if (l0 <= it.maxL) continue;
          const frac = x < LAYER * W ? Math.max(0, 1 - (x + 0.5) / (STOP * W)) : 0;
          const a = alphaNeeded(r, g, bl, it.maxL);
          if (frac <= 0 || a / frac > 1) {
            it.unfix++;
            const ratio0 = CR(it.inkL, l0);
            if (ratio0 < it.unfixWorst) { it.unfixWorst = ratio0; it.unfixAt = { f, x }; }
            continue;
          }
          if (a / frac > it.needS) { it.needS = a / frac; it.needAt = { f, x }; }
        }
      }
    }
    for (const it of items) {
      console.log(`  ${it.key.padEnd(8)} bar ${it.need.toFixed(1)}  needs ${(it.needS * 100).toFixed(1)}%${it.needAt ? ` at f${it.needAt.f}, x ${it.needAt.x}` : ''}  unfixable ${it.unfix}${it.unfix ? `, worst ${it.unfixWorst.toFixed(2)}:1 at f${it.unfixAt.f}, x ${it.unfixAt.x}` : ''}`);
    }
  }

  if (mode === 'halo') {
    const { rings, clip } = await buildRings(p, items, w, h);
    const STEPS = [[0.6, 0], [0.7, 0], [0.8, 0], [0.9, 0], [1, 0], [1, 0.5], [1, 1]];
    const run = async ([a1, a2]) => {
      const rows = await renderRings(p, items, rings, clip, frames, { '--copy-halo': a1, '--copy-halo-2': a2, '--shade': '55%' });
      const fails = rows.filter((r) => r.ratio < r.need);
      console.log(`  halo ${a1}${a2 ? ` + ${a2}` : ''}: ${fails.length ? `${fails.length} failing — ` + fails.map((r) => `${r.key} ${r.ratio.toFixed(2)}:1 f${r.at}`).join(', ') : 'every pair passes'}`);
      return { rows, pass: !fails.length };
    };
    let lo = -1, hi = STEPS.length - 1, best = null;
    const top = await run(STEPS[hi]);
    if (!top.pass) console.log(`  ${w}: EVEN THE STRONGEST STEP FAILS — the shadow under the copy cannot carry this width.`);
    else {
      best = { i: hi, ...top };
      while (hi - lo > 1) { const mid = Math.floor((lo + hi) / 2); const r = await run(STEPS[mid]); if (r.pass) { hi = mid; best = { i: mid, ...r }; } else lo = mid; }
      console.log(`  ${w}: LOWEST PASSING STEP halo ${STEPS[best.i].join(' + ')}`);
      best.rows.forEach((r) => console.log(row(r)));
    }
  }

  /* ---- zones: two left edges, found in sequence, then confirmed -----------

     THE ZONES OVERLAP NOW, by 64px at the headline's baseline, where one fades
     out as the other fades in, so each zone darkens a little of the other's
     pairs and one render can no longer settle both. The headline zone is found
     first with the copy zone at 55%, the least it will ever be, so the headline
     value never leans on help it might not get. The copy zone is found next
     with the headline zone at that value, which is exactly what will ship above
     it. A last render at both values is the one recorded.

     Each search starts at 100%: a zone that fails there cannot be fixed by its
     shade. More shade only darkens, so the steps are bisected. */
  if (mode === 'zones') {
    const { rings, clip } = await buildRings(p, items, w, h);
    const STEPS = [55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
    const run = async (hv, cv, zone) => {
      const rows = await renderRings(p, items, rings, clip, frames, { '--shade-head': `${hv}%`, '--shade-copy': `${cv}%` });
      const zr = zone ? rows.filter((r) => r.zone === zone) : rows;
      const fl = zr.filter((r) => r.ratio < r.need);
      console.log(`  head ${hv}%, copy ${cv}%${zone ? ` (${zone} pairs)` : ' (all pairs)'}: ${fl.length ? `${fl.length} failing — ` + fl.map((r) => `${r.key} ${r.ratio.toFixed(2)}:1 f${r.at}`).join(', ') : 'every pair passes'}`);
      return { rows: zr, all: rows, pass: !fl.length };
    };
    const search = async (zone, fixed) => {
      const val = (i) => STEPS[i];
      const trial = (i) => (zone === 'head' ? run(val(i), fixed, 'head') : run(fixed, val(i), 'copy'));
      const top = await trial(STEPS.length - 1);
      if (!top.pass) return { dead: true, value: 100, rows: top.rows };
      let lo = -1, hi = STEPS.length - 1, best = top;
      while (hi - lo > 1) {
        const mid = Math.floor((lo + hi) / 2);
        const r = await trial(mid);
        if (r.pass) { hi = mid; best = r; } else lo = mid;
      }
      return { dead: false, value: STEPS[hi], rows: best.rows };
    };
    /* SPOT_HEAD_<width> takes a headline zone value already walked at that
       width instead of searching it again: set when only the copy zone's shape
       changed, since the copy zone fades in below the baseline and can only
       help the headline's pairs. The confirming render below still checks every
       pair at both values. */
    const given = process.env[`SPOT_HEAD_${w}`];
    const head = given
      ? { dead: false, value: Number(given), rows: [] }
      : await search('head', 55);
    console.log(`  ${w}: HEAD ZONE ${head.dead ? 'FAILS EVEN AT 100%' : `LEFT EDGE ${head.value}%`}${given ? ' (given, walked earlier)' : ''}`);
    const copy = await search('copy', head.value);
    console.log(`  ${w}: COPY ZONE ${copy.dead ? 'FAILS EVEN AT 100%' : `LEFT EDGE ${copy.value}%`}`);
    const final = await run(head.value, copy.value, null);
    console.log(`  ${w}: CONFIRMED AT head ${head.value}%, copy ${copy.value}% — ${final.pass ? 'every pair passes' : 'NOT every pair passes'}`);
    final.all.forEach((r) => console.log(row(r) + (r.key === 'sub' ? `  (${r.lines} lines)` : '')));
  }

  await b.close();
}
console.log('\nspotshade done');

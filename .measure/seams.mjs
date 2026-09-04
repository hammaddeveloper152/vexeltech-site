import { open, isAccent, FRAMES } from './lib.mjs';
import { PNG } from 'pngjs';

/* Exact seam ranges.

   A carrier occupies a band [top, bottom] in document coordinates. It is in
   frame at scroll y when top < y + H and bottom > y. Two carriers are in the
   same frame for some y exactly when

     max(topA, topB) - min(bottomA, bottomB) < H

   and the range of y that does it is
     ( max(topA,topB) - H , min(bottomA,bottomB) )

   which is arithmetic, not a sweep, so no overlap can be stepped over.

   Services and Process are read from the page instead: the first is pinned and
   its cards move under scroll, the second lights its numerals progressively.
   Both are measured by pixel at the positions the arithmetic proposes. */

const W = Number(process.argv[2]);
const H = Number(process.argv[3]);
const { browser, page } = await open(W, H);
const doc = await page.evaluate(() => document.documentElement.scrollHeight);

const CARRIERS = FRAMES.filter((f) => f.carrier);

/* Document band of every carrier, at rest. */
const bands = {};
for (const f of CARRIERS) {
  const b = await page.evaluate((sel) => {
    const els = Array.from(document.querySelectorAll(sel));
    if (!els.length) return null;
    let top = Infinity, bottom = -Infinity;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      top = Math.min(top, r.top + window.scrollY);
      bottom = Math.max(bottom, r.bottom + window.scrollY);
    }
    return Number.isFinite(top) ? { top, bottom, n: els.length } : null;
  }, f.carrier);
  bands[f.name] = b;
}

/* For the two dynamic frames, take the band of the SECTION instead: any part
   of it can be showing a lit numeral or a discipline name. */
for (const name of ['Services', 'Process']) {
  const sel = FRAMES.find((f) => f.name === name).section;
  bands[name] = await page.evaluate((s) => {
    const r = document.querySelector(s).getBoundingClientRect();
    return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY, dynamic: true };
  }, sel);
}

console.log(`\n#### ${W} x ${H} — carrier bands, document coordinates ####`);
for (const f of CARRIERS) {
  const b = bands[f.name];
  console.log(`  ${f.name.padEnd(13)} ${b ? `${Math.round(b.top)}..${Math.round(b.bottom)}${b.dynamic ? '  (whole section: dynamic carrier)' : ''}` : 'none'}`);
}

console.log(`\n#### seams: every pair that can share one ${H}px frame ####`);
const pairs = [];
for (let i = 0; i < CARRIERS.length; i += 1) {
  for (let j = i + 1; j < CARRIERS.length; j += 1) {
    const A = bands[CARRIERS[i].name], B = bands[CARRIERS[j].name];
    if (!A || !B) continue;
    const lo = Math.max(A.top, B.top) - H;
    const hi = Math.min(A.bottom, B.bottom);
    if (lo >= hi) continue;
    pairs.push({
      a: CARRIERS[i].name, b: CARRIERS[j].name,
      lo: Math.max(0, Math.round(lo)), hi: Math.min(doc - H, Math.round(hi)),
      dynamic: !!(A.dynamic || B.dynamic),
    });
  }
}

/* Confirm each by pixel at the middle of its range, splitting the frame at the
   boundary between the two sections. */
for (const p of pairs) {
  const y = Math.round((p.lo + p.hi) / 2);
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await new Promise((r) => setTimeout(r, 250));
  const g = await page.evaluate((names) => {
    const map = {};
    for (const [n, sel] of names) {
      const r = document.querySelector(sel).getBoundingClientRect();
      map[n] = { top: r.top, bottom: r.bottom };
    }
    const wm = document.querySelector('.wm').getBoundingClientRect();
    return { map, wm: { x: wm.x, y: wm.y, w: wm.width, h: wm.height } };
  }, [[p.a, FRAMES.find((f) => f.name === p.a).section], [p.b, FRAMES.find((f) => f.name === p.b).section]]);

  const png = PNG.sync.read(await page.screenshot({ type: 'png', captureBeyondViewport: false }));
  const tally = (band) => {
    let n = 0;
    const y0 = Math.max(0, Math.floor(band.top)), y1 = Math.min(H, Math.ceil(band.bottom));
    for (let yy = y0; yy < y1; yy += 1) for (let xx = 0; xx < W; xx += 1) {
      if (xx >= g.wm.x - 2 && xx <= g.wm.x + g.wm.w + 2 && yy >= g.wm.y - 2 && yy <= g.wm.y + g.wm.h + 2) continue;
      const i = (yy * W + xx) * 4;
      if (isAccent(png.data[i], png.data[i + 1], png.data[i + 2])) n += 1;
    }
    return n;
  };
  const na = tally(g.map[p.a]), nb = tally(g.map[p.b]);
  const real = na > 12 && nb > 12;
  console.log(
    `  ${real ? 'CONFIRMED' : 'not painted'}  ${p.a} + ${p.b}` +
    `   y ${p.lo}..${p.hi} (${p.hi - p.lo}px of scroll, ${((p.hi - p.lo) / H * 100).toFixed(0)}% of a screen)` +
    `   at y=${y}: ${p.a} ${na}px, ${p.b} ${nb}px${p.dynamic ? '  [dynamic]' : ''}`
  );
  if (real) await page.screenshot({ path: `.measure/seam-${W}-${p.a.replace(/\W/g, '')}-${p.b.replace(/\W/g, '')}.png` });
}
await browser.close();

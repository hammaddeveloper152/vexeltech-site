/* bandpos.mjs — solve `background-position` so a photograph's bright centre
   lands behind a named element.

   "Centred behind the heading" is not `background-position: center`. With
   `background-size: cover` the image is larger than the band in at least one
   axis, so a percentage does not place a point — it distributes the overflow.
   `50%` puts the image's centre at the BAND's centre, and the heading is not
   there: it is at the left of a band whose right side is a button.

   The arithmetic, for one axis. Container C, rendered image R (R >= C after
   cover), position p as a fraction:

       offset = (C - R) * p
       an image point at fraction f lands at  x = offset + f * R
       so to land it at target T:   p = (T - f * R) / (C - R)

   f comes from the image itself: the luminance centroid, weighted to the
   fourth power so the bright core dominates and the field around it does not
   drag the answer toward the middle of the frame.

   The script prints p for each width. One CSS value has to serve both, so it
   also prints where the centre actually lands at each width for the value it
   recommends — a band is wide and short, the image is scaled by height, and
   the horizontal slack is usually enough that one number is close enough at
   both. When it is not, the output says so and the rule takes a breakpoint.
*/
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const ROUTE = process.argv[2] || '/';
const BAND = process.argv[3] || '.band-burst';
const TARGET = process.argv[4] || '.callband__h';
const IMG = process.argv[5];
/* `cover`, `200w` (width = 200% of the band) or `200h` (height = 200%).

   COVER OFTEN LEAVES NO SLACK IN THE AXIS THAT MATTERS, and that is the whole
   reason this argument exists. A wide short band takes a landscape image at
   exactly its own width, so the horizontal position has nothing to distribute
   and every percentage resolves to the same picture — the solver returns
   Infinity, which is the honest answer to "where do I put a thing that cannot
   move". Oversizing the layer buys the slack back. */
const SIZE = process.argv[6] || 'cover';

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });

/* ---- 1. the image's bright centroid, as a fraction of its own box ------- */
const probe = await b.newPage();
await probe.goto('http://localhost:4179' + ROUTE, { waitUntil: 'domcontentloaded' });
/* THE BANDS ARE GATED ON `data-near` NOW, so at load their computed
   `background-image` is `none` and there is no URL to read. Every band is
   marked near before anything is measured. */
await probe.evaluate(() => document.querySelectorAll('[class*="band-"], .scratched')
  .forEach((e) => { e.dataset.near = 'true'; }));
await new Promise((r) => setTimeout(r, 600));
const src = IMG || await probe.evaluate((sel) => {
  const bg = getComputedStyle(document.querySelector(sel)).backgroundImage;
  return (bg.match(/url\(["']?([^"')]+)/) || [])[1];
}, BAND);

const centre = await probe.evaluate(async (url) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = url;
  await img.decode();
  const w = 400, h = Math.round(img.naturalHeight * (w / img.naturalWidth));
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.drawImage(img, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data;
  let sx = 0, sy = 0, sw = 0;
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const k = (j * w + i) * 4;
      const l = (0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2]) / 255;
      const wt = l ** 4;
      sx += i * wt; sy += j * wt; sw += wt;
    }
  }
  return { fx: sx / sw / w, fy: sy / sw / h, nw: img.naturalWidth, nh: img.naturalHeight };
}, src);
await probe.close();

console.log(`${src.split('/').pop()}  ${centre.nw}x${centre.nh}  bright centre at ` +
            `${(centre.fx * 100).toFixed(1)}% ${(centre.fy * 100).toFixed(1)}%`);

/* ---- 2. the band and the target, at each width ------------------------- */
const solved = [];
/* WIDTHS=768,1280 overrides the pair. A rule that takes a breakpoint has to be
   solved at the breakpoint as well as either side of it. */
const WIDTHS = (process.env.WIDTHS || '1280,390').split(',')
  .map((v) => [Number(v), Number(v) === 390 ? 844 : 900]);
for (const [W, H] of WIDTHS) {
  const p = await b.newPage();
  await p.setViewport({ width: W, height: H });
  await p.goto('http://localhost:4179' + ROUTE, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2200));

  await p.evaluate(() => document.querySelectorAll('[class*="band-"], .scratched')
    .forEach((e) => { e.dataset.near = 'true'; }));
  await new Promise((r) => setTimeout(r, 400));

  const geo = await p.evaluate((bandSel, tSel) => {
    const band = document.querySelector(bandSel);
    const t = document.querySelector(tSel);
    if (!band || !t) return null;
    band.scrollIntoView({ block: 'center' });
    const br = band.getBoundingClientRect();
    const tr = t.getBoundingClientRect();
    return {
      C: [br.width, br.height],
      /* the target's centre, in the band's own coordinates */
      T: [tr.left + tr.width / 2 - br.left, tr.top + tr.height / 2 - br.top],
    };
  }, BAND, TARGET);
  await p.close();
  if (!geo) { console.log(`  ${W}: band or target not on this route`); continue; }

  const [C, H2] = [geo.C[0], geo.C[1]];
  let R;
  if (SIZE.endsWith('w')) {
    const rw = C * parseFloat(SIZE) / 100;
    R = [rw, rw * centre.nh / centre.nw];
  } else if (SIZE.endsWith('h')) {
    const rh = H2 * parseFloat(SIZE) / 100;
    R = [rh * centre.nw / centre.nh, rh];
  } else {
    const scale = Math.max(C / centre.nw, H2 / centre.nh);
    R = [centre.nw * scale, centre.nh * scale];
  }
  if (R[0] < C - 0.5 || R[1] < H2 - 0.5) {
    console.log(`  ${String(W).padStart(4)}  WARNING: ${SIZE} does not cover this band ` +
                `(${Math.round(R[0])}x${Math.round(R[1])} on ${Math.round(C)}x${Math.round(H2)})`);
  }
  const px = (geo.T[0] - centre.fx * R[0]) / (C - R[0]);
  const py = (geo.T[1] - centre.fy * R[1]) / (H2 - R[1]);
  solved.push({ W, C, H2, R, px, py, T: geo.T });
  console.log(
    `  ${String(W).padStart(4)}  band ${Math.round(C)}x${Math.round(H2)}` +
    `  image renders ${Math.round(R[0])}x${Math.round(R[1])}` +
    `  target centre ${Math.round(geo.T[0])},${Math.round(geo.T[1])}` +
    `  ->  background-position: ${(px * 100).toFixed(0)}% ${(py * 100).toFixed(0)}%`
  );
}

/* ---- 3. one value for both, and what it costs -------------------------- */
if (solved.length === 2) {
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const px = clamp((solved[0].px + solved[1].px) / 2);
  const py = clamp((solved[0].py + solved[1].py) / 2);
  console.log(`\n  one value for both: background-position: ${(px * 100).toFixed(0)}% ${(py * 100).toFixed(0)}%`);
  for (const s of solved) {
    const landX = (s.C - s.R[0]) * px + centre.fx * s.R[0];
    const landY = (s.H2 - s.R[1]) * py + centre.fy * s.R[1];
    console.log(
      `    at ${String(s.W).padStart(4)} the centre lands ${Math.round(landX)},${Math.round(landY)}` +
      `  (target ${Math.round(s.T[0])},${Math.round(s.T[1])};` +
      ` off by ${Math.round(Math.abs(landX - s.T[0]))},${Math.round(Math.abs(landY - s.T[1]))}px)`
    );
  }
}
/* ---- 4. WHERE IT ACTUALLY LANDS, OFF THE PAINTED BAND ------------------

   Everything above is arithmetic on the image's own centroid. That is a claim
   about the file, not about the section, and the two can disagree: the scrim
   is not linear in luminance, the band crops a slice of the image, and a
   fourth-power centroid over the WHOLE frame is pulled by scattered highlights
   that the crop may not even include.

   So the band is rendered with its type hidden and the centroid of what is
   actually painted is measured, in the band's own coordinates, against the
   heading's box. If this disagrees with the solve, this is the one that is
   right — and the correction is linear, so the delta can be pushed straight
   back through the same formula. */
console.log(`
  as painted:`);
for (const [W, H] of WIDTHS) {
  const p = await b.newPage();
  await p.setViewport({ width: W, height: H });
  await p.goto('http://localhost:4179' + ROUTE, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2200));
  await p.evaluate(() => document.querySelectorAll('[class*="band-"], .scratched')
    .forEach((e) => { e.dataset.near = 'true'; }));
  const box = await p.evaluate((bandSel) => {
    const el = document.querySelector(bandSel);
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    /* the type would dominate any luminance measure of a band */
    el.querySelectorAll('*').forEach((e) => { e.style.visibility = 'hidden'; });
    return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
  }, BAND);
  const tgt = await p.evaluate((tSel, bandSel) => {
    const t = document.querySelector(tSel).getBoundingClientRect();
    const br = document.querySelector(bandSel).getBoundingClientRect();
    return [Math.round(t.left + t.width / 2 - br.left), Math.round(t.top + t.height / 2 - br.top)];
  }, TARGET, BAND);
  await new Promise((r) => setTimeout(r, 500));
  const png = PNG.sync.read(await p.screenshot({ type: 'png' }));
  await p.close();

  const [bx, by, bw, bh] = box;
  let sx = 0, sy = 0, sw = 0;
  for (let j = Math.max(0, by); j < Math.min(png.height, by + bh); j++) {
    for (let i = Math.max(0, bx); i < Math.min(png.width, bx + bw); i++) {
      const k = (j * png.width + i) * 4;
      const l = (0.2126 * png.data[k] + 0.7152 * png.data[k + 1] + 0.0722 * png.data[k + 2]) / 255;
      const wt = l ** 4;
      sx += (i - bx) * wt; sy += (j - by) * wt; sw += wt;
    }
  }
  const cx = sx / sw, cy = sy / sw;
  console.log(
    `    ${String(W).padStart(4)}  painted core at ${Math.round(cx)},${Math.round(cy)}` +
    `  target ${tgt[0]},${tgt[1]}  off by ${Math.round(cx - tgt[0])},${Math.round(cy - tgt[1])}px`
  );
}
await b.close();

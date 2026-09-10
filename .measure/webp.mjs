/* webp.mjs — encode a source image to webp at a fixed width and a byte budget.

   THERE IS NO ENCODER ON THIS MACHINE. No PIL, no cwebp, no sharp. What there
   is, is a browser: Chrome's canvas has a webp encoder behind `toBlob`, and
   puppeteer already ships one. So the source is drawn to a canvas at the target
   width and the quality is binary-searched until the blob fits.

   THE PRE-BLUR IS THE POINT, and the marble is why it is here. Untouched, that
   photograph only met a 400 KB budget at QUALITY 0.054 — visible blocking,
   because every byte was going on grain the scrim would bury anyway. Half a
   pixel of blur first moved it to quality 0.526 at the same byte count: about
   ten times the quality for the same weight. A ground under a heavy scrim needs
   TONE, NOT DETAIL, and detail was all that was costing.

   So the search runs twice when it has to: once clean, and again with the blur
   if the clean pass had to drop below the floor to fit. Both results print, so
   the trade is visible rather than assumed.

   Usage: node .measure/webp.mjs <in> <out> [width] [kb] [blurPx]
*/
import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { extname, basename } from 'node:path';

const [IN, OUT] = process.argv.slice(2);
const W = Number(process.argv[4]) || 2560;
const BUDGET = (Number(process.argv[5]) || 400) * 1024;
const BLUR = process.argv[6] === undefined ? 0.5 : Number(process.argv[6]);
/* Below this the encoder is throwing away structure, not noise. */
const FLOOR = 0.35;

const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
               '.webp': 'image/webp' }[extname(IN).toLowerCase()];
const dataUri = `data:${mime};base64,${readFileSync(IN).toString('base64')}`;

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });
const p = await b.newPage();
await p.goto('about:blank');

const run = async (blur, levels) => p.evaluate(async (uri, w, budget, blurPx, alphaLevels) => {
  const img = new Image();
  img.src = uri;
  await img.decode();
  const h = Math.round(img.naturalHeight * (w / img.naturalWidth));
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  /* No fill first: a source with alpha keeps it. */
  if (blurPx) ctx.filter = `blur(${blurPx}px)`;
  ctx.drawImage(img, 0, 0, w, h);
  ctx.filter = 'none';

  /* does the source actually carry alpha? */
  const d = ctx.getImageData(0, 0, Math.min(w, 600), Math.min(h, 600)).data;
  let alpha = false;
  for (let i = 3; i < d.length; i += 4) if (d[i] < 250) { alpha = true; break; }

  /* ALPHA IS NOT LOSSY IN WEBP, and that is the whole problem with a cut-out.
     The quality slider only touches colour; the alpha channel is stored
     losslessly whatever it is set to. A 2560px cut-out of anti-aliased line
     art therefore costs the same at quality 0.02 as at 0.98 — the search runs
     the full range and every rung comes back identical.

     Quantising alpha is the lever the slider is not. Rounding it to a fixed
     number of levels turns a smooth gradient into flat runs, which is what a
     lossless coder is good at, and the cost is banding on the EDGES OF A MASK
     rather than in an image anyone looks at directly. */
  if (alphaLevels) {
    const im = ctx.getImageData(0, 0, w, h);
    const step = 255 / (alphaLevels - 1);
    for (let i = 3; i < im.data.length; i += 4) {
      im.data[i] = Math.round(Math.round(im.data[i] / step) * step);
    }
    ctx.putImageData(im, 0, 0);
  }

  const size = (q) => new Promise((res) =>
    c.toBlob((bl) => bl.arrayBuffer().then((a) => res(a)), 'image/webp', q));

  /* binary search the highest quality that fits */
  let lo = 0.02, hi = 0.98, best = null, bestQ = 0;
  for (let i = 0; i < 12; i++) {
    const q = (lo + hi) / 2;
    const buf = await size(q);
    if (buf.byteLength <= budget) { best = buf; bestQ = q; lo = q; } else hi = q;
  }
  if (!best) { best = await size(0.02); bestQ = 0.02; }
  /* CHUNKED. `String.fromCharCode(...bytes)` spreads 400,000 arguments onto
     the call stack and throws RangeError long before it gets there. */
  const u8 = new Uint8Array(best);
  let bin = '';
  for (let i = 0; i < u8.length; i += 8192) {
    bin += String.fromCharCode.apply(null, u8.subarray(i, i + 8192));
  }
  return { w, h, alpha, q: bestQ, bytes: best.byteLength, fits: best.byteLength <= budget, b64: btoa(bin) };
}, dataUri, W, BUDGET, blur, levels || 0);

const clean = await run(0, 0);
let pick = clean, used = 0, lv = 0;

/* 1. the pre-blur, when the clean pass had to go below the floor to fit */
if (clean.fits && clean.q < FLOOR && BLUR > 0) {
  const blurred = await run(BLUR, 0);
  if (blurred.q > clean.q) { pick = blurred; used = BLUR; }
}

/* 2. alpha quantising, when NOTHING fits — which only happens on a cut-out,
      where the quality slider has no effect at all. Coarser in steps, and it
      stops at the first level that fits rather than going as coarse as it can. */
if (!clean.fits && clean.alpha) {
  for (const levels of [64, 32, 16, 8, 4]) {
    const r = await run(BLUR, levels);
    if (r.fits) { pick = r; used = BLUR; lv = levels; break; }
  }
}

writeFileSync(OUT, Buffer.from(pick.b64, 'base64'));
const src = statSync(IN).size;
const note = [
  used ? `blur ${used}px` : null,
  lv ? `alpha ${lv} levels` : null,
  (used && !lv) ? `clean pass needed q ${clean.q.toFixed(3)}` : null,
  (lv) ? `full alpha did not fit at any quality (${(clean.bytes / 1024).toFixed(0)} KB)` : null,
].filter(Boolean).join('; ');
console.log(
  `${basename(IN).padEnd(16)} ${pick.w}x${pick.h}` +
  `${pick.alpha ? ' alpha' : ''}` +
  `  q ${pick.q.toFixed(3)}${note ? ` (${note})` : ''}` +
  `  ${(src / 1024 / 1024).toFixed(1)} MB -> ${(pick.bytes / 1024).toFixed(0)} KB` +
  `${pick.fits ? '' : '  OVER BUDGET'}  ${basename(OUT)}`
);
await b.close();

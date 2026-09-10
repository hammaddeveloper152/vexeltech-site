/* seamwalk.mjs — the accent across a run of sections, frame by frame.

   The carrier rule is per FRAME, and a frame is whatever a viewport happens to
   hold at some scroll position — not a section. Two sections that each pass on
   their own can put a solid call and a full-bleed field in one viewport at the
   seam between them, and no per-section measurement will ever see it.

   So this steps the viewport down a named run in half-viewport increments and
   reports, for every frame: the share of it that is machine yellow, the
   largest CONTIGUOUS yellow region as a share of the frame, and which named
   elements are in view. A field is not a share, it is a shape — 2% of a frame
   spread over five 3px bars is five bars, and 2% in one blob is a plate of
   colour — so the contiguous figure is the one that answers "is there a solid
   yellow field in this frame".

   Usage: node .measure/seamwalk.mjs [width]
*/
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const W = Number(process.argv[2]) || 1280;
const H = W === 1280 ? 800 : 844;
const FROM = '.hero';
const TO = '.services';
/* what a frame is allowed to hold, and what it is not */
const WATCH = ['.hero__cta', '.svc__plate', '.services__head', '.fail'];

const yellow = (r, g, b) =>
  Math.abs(r - 240) < 24 && Math.abs(g - 179) < 26 && Math.abs(b - 35) < 34;

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });
const p = await b.newPage();
await p.setViewport({ width: W, height: H });
await p.goto('http://localhost:4179/', { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 2500));

/* Walk once so every reveal and every plate has arrived, then come back. */
const tot = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < tot; y += 450) {
  await p.evaluate((v) => window.scrollTo(0, v), y);
  await new Promise((r) => setTimeout(r, 110));
}

const span = await p.evaluate((f, t) => {
  const a = document.querySelector(f).getBoundingClientRect();
  const z = document.querySelector(t).getBoundingClientRect();
  return [Math.round(a.top + scrollY), Math.round(z.bottom + scrollY)];
}, FROM, TO);

console.log(`${W}: ${FROM} to ${TO}, ${span[0]} to ${span[1]}px, in ${H / 2}px steps\n`);
console.log('  scroll   yellow   largest blob   owned by         in frame');

let worstBlob = 0, worstAt = 0, bad = 0;
for (let y = span[0]; y <= span[1] - H / 2; y += H / 2) {
  await p.evaluate((v) => { document.scrollingElement.scrollTop = v; }, y);
  await new Promise((r) => setTimeout(r, 260));

  const inFrame = await p.evaluate((sels) => {
    const out = [];
    for (const s of sels) {
      const n = [...document.querySelectorAll(s)].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.bottom > 0 && r.top < innerHeight && r.width > 0;
      }).length;
      if (n) out.push(`${s.replace('.', '')}x${n}`);
    }
    return out.join(' ');
  }, WATCH);

  const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
  const w = im.width, h = im.height;
  const mask = new Uint8Array(w * h);
  let total = 0;
  for (let i = 0, px = 0; px < w * h; px++, i += 4) {
    if (yellow(im.data[i], im.data[i + 1], im.data[i + 2])) { mask[px] = 1; total++; }
  }

  /* largest connected region, 4-neighbour, iterative so a full-bleed field
     cannot blow the stack */
  let best = 0, bestBox = null;
  const stack = [];
  for (let px = 0; px < w * h; px++) {
    if (mask[px] !== 1) continue;
    let n = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    stack.push(px);
    mask[px] = 2;
    while (stack.length) {
      const q = stack.pop();
      n++;
      const qx = q % w, qy = (q - qx) / w;
      if (qx < x0) x0 = qx; if (qx > x1) x1 = qx;
      if (qy < y0) y0 = qy; if (qy > y1) y1 = qy;
      if (qx > 0 && mask[q - 1] === 1) { mask[q - 1] = 2; stack.push(q - 1); }
      if (qx < w - 1 && mask[q + 1] === 1) { mask[q + 1] = 2; stack.push(q + 1); }
      if (qy > 0 && mask[q - w] === 1) { mask[q - w] = 2; stack.push(q - w); }
      if (qy < h - 1 && mask[q + w] === 1) { mask[q + w] = 2; stack.push(q + w); }
    }
    if (n > best) { best = n; bestBox = [x0, y0, x1, y1]; }
  }

  const share = (total / (w * h)) * 100;
  const blob = (best / (w * h)) * 100;
  if (blob > worstBlob) { worstBlob = blob; worstAt = y; }

  /* WHAT THE BLOB IS, NOT HOW BIG IT IS. A call and a field are both solid
     yellow blobs, and the first version separated them by area alone — with a
     threshold guessed from a CTA size that was wrong. The hero's call is
     498x94 at 1280, 4.04% of the frame, and it was reported as a FIELD twice.

     So the blob is attributed to the element that owns it. A blob that maps to
     one element is that element: a call, a bar, a marker. A field is a blob
     that no single element accounts for, or one that runs most of the frame's
     width, which is what a full-bleed ground does and what a control never
     does. */
  const owner = bestBox ? await p.evaluate((bx) => {
    let hit = null, hitA = 0;
    for (const e of document.querySelectorAll('body *')) {
      const r = e.getBoundingClientRect();
      if (r.width < 3 || r.height < 3) continue;
      const ox = Math.min(r.right, bx[2]) - Math.max(r.left, bx[0]);
      const oy = Math.min(r.bottom, bx[3]) - Math.max(r.top, bx[1]);
      if (ox <= 0 || oy <= 0) continue;
      /* the tightest element that contains the blob */
      const covers = r.left <= bx[0] + 2 && r.right >= bx[2] - 2 &&
                     r.top <= bx[1] + 2 && r.bottom >= bx[3] - 2;
      if (!covers) continue;
      const a = r.width * r.height;
      if (!hit || a < hitA) { hit = (e.className || e.tagName).toString().split(' ')[0]; hitA = a; }
    }
    return hit;
  }, bestBox) : null;

  const wide = bestBox && (bestBox[2] - bestBox[0]) > w * 0.7;
  const field = !owner || wide;
  if (field) bad++;
  console.log(
    `  ${String(y).padStart(6)}   ${share.toFixed(2).padStart(5)}%   ${blob.toFixed(2).padStart(6)}%  ${(owner || 'UNATTRIBUTED').padEnd(16)}${field ? 'FIELD  ' : '       '}${inFrame}`
  );
}

console.log(
  bad
    ? `\n${bad} frame(s) hold a solid yellow field.`
    : `\nNo frame holds a solid yellow field. Largest contiguous region ${worstBlob.toFixed(2)}% at ${worstAt}px.`
);
await b.close();

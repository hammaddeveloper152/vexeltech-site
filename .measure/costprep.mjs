/* costprep.mjs — the founder's cost-1 to cost-4 renders (2048px on black,
   in public/assets/objects, untracked) to the 192px WebPs What it costs you
   mounts, MOLDED so the screen blend leaves no square on the drift
   (2026-09-22). Two steps, both toward pure black, so nothing is added:

   1. A TOE on luma: under 4/255 goes to black, eased back to full by 28/255
      (smoothstep). The renders' flat haze (13 to 22) is what lifted a square
      off the ground under screen; the objects' shading sits above it.
   2. An EDGE FEATHER, per side, smoothstep to black: bottom 22% (the floor
      reflections run into the frame), left and right 10%, top 3% (the phone's
      top is at 4%, and nothing but haze reaches the top).

   Halved step by step to 192px in Chrome's canvas, WebP at 0.9.

     node .measure/costprep.mjs */
import puppeteer from 'puppeteer';
import fs from 'fs';
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
for (const i of [1, 2, 3, 4]) {
  const src = 'data:image/png;base64,' + fs.readFileSync(`public/assets/objects/cost-${i}. png.png`).toString('base64');
  const out = await p.evaluate(async (src) => {
    const img = new Image(); img.src = src; await img.decode();
    let c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    while (c.width > 192) {
      const n = Math.max(192, Math.round(c.width / 2));
      const d = document.createElement('canvas'); d.width = d.height = n;
      const x = d.getContext('2d'); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
      x.drawImage(c, 0, 0, n, n); c = d;
    }
    const ctx = c.getContext('2d'), N = c.width;
    const id = ctx.getImageData(0, 0, N, N), px = id.data;
    const ss = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const k = (y * N + x) * 4;
      const luma = (0.2126 * px[k] + 0.7152 * px[k + 1] + 0.0722 * px[k + 2]) / 255;
      const u = x / (N - 1), v = y / (N - 1);
      const edge = ss(0, 0.03, v) * ss(0, 0.22, 1 - v) * ss(0, 0.10, u) * ss(0, 0.10, 1 - u);
      const m = ss(4 / 255, 28 / 255, luma) * edge;
      px[k] *= m; px[k + 1] *= m; px[k + 2] *= m;
    }
    ctx.putImageData(id, 0, 0);
    return c.toDataURL('image/webp', 0.9);
  }, src);
  fs.writeFileSync(`public/assets/cost-${i}.webp`, Buffer.from(out.split(',')[1], 'base64'));
  console.log(`cost-${i}.webp`, fs.statSync(`public/assets/cost-${i}.webp`).size, 'bytes');
}
await b.close();

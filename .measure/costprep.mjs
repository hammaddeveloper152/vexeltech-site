/* SUPERSEDED 2026-09-23. DO NOT RUN THIS.

   It molds the cost renders for `mix-blend-mode: screen` - a toe to black
   under 4/255 easing back by 28/255, and a per-side edge feather - so that
   their black ground would drop into the page under the blend.

   THE BLEND IS GONE. It flashed a black square on reveal, because screen over
   a parent that is mid-fade is not the same composite as screen over a
   settled one. The objects are cut to real alpha now by `.measure/deskcut.py`
   and mounted as plain images.

   Kept, not deleted, because DESIGN.md cites the toe and the feather by
   number and a script that produced recorded numbers is part of the record.
   Running it would overwrite the cut WebPs with molded ones and put the flash
   back.

const TARGET = Number(process.argv[2] || 560);
import puppeteer from 'puppeteer';
import fs from 'fs';
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
for (const i of [1, 2, 3, 4]) {
  const src = 'data:image/png;base64,' + fs.readFileSync(`public/assets/objects/cost-${i}. png.png`).toString('base64');
  const out = await p.evaluate(async (src, TARGET) => {
    const img = new Image(); img.src = src; await img.decode();
    let c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    while (c.width > TARGET) {
      const n = Math.max(TARGET, Math.round(c.width / 2));
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
  }, src, TARGET);
  fs.writeFileSync(`public/assets/cost-${i}.webp`, Buffer.from(out.split(',')[1], 'base64'));
  console.log(`cost-${i}.webp`, fs.statSync(`public/assets/cost-${i}.webp`).size, 'bytes');
}
await b.close();

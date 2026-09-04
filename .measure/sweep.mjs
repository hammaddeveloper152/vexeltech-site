import { open, isAccent, FRAMES } from './lib.mjs';
import { PNG } from 'pngjs';
import fs from 'node:fs';

const STEP = Number(process.env.STEP || 100);

async function sweep(W, H) {
  const { browser, page } = await open(W, H);

  const doc = await page.evaluate(() => document.documentElement.scrollHeight);
  const results = [];

  for (let y = 0; y <= doc - H; y += STEP) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 120));

    const geom = await page.evaluate((sels) => {
      const out = {};
      for (const [name, sel] of sels) {
        const el = document.querySelector(sel);
        if (!el) { out[name] = null; continue; }
        const r = el.getBoundingClientRect();
        out[name] = { top: r.top, bottom: r.bottom, height: r.height };
      }
      const wm = document.querySelector('.wm');
      const w = wm ? wm.getBoundingClientRect() : null;
      return {
        sections: out,
        wordmark: w ? { x: w.x, y: w.y, w: w.width, h: w.height } : null,
        scrollY: Math.round(window.scrollY),
      };
    }, FRAMES.map((f) => [f.name, f.section]));

    const png = PNG.sync.read(await page.screenshot({ type: 'png', captureBeyondViewport: false }));

    /* The wordmark is exempt from the count by definition: it is the
       identity's yellow, in every frame because the bar is sticky, and it is
       not any frame's carrier. Its own box is taken out before anything is
       attributed. */
    const wm = geom.wordmark;
    const inWm = (x, y2) =>
      wm && x >= wm.x - 2 && x <= wm.x + wm.w + 2 && y2 >= wm.y - 2 && y2 <= wm.y + wm.h + 2;

    const bands = {};
    for (const f of FRAMES) {
      const g = geom.sections[f.name];
      if (!g) continue;
      const a = Math.max(0, Math.floor(g.top));
      const b = Math.min(H, Math.ceil(g.bottom));
      if (b <= a) continue;
      bands[f.name] = { y0: a, y1: b, visible: b - a, sectionH: Math.round(g.height) };
    }

    const counts = {};
    for (const name of Object.keys(bands)) counts[name] = 0;
    let wmPx = 0;

    for (let py = 0; py < H; py += 1) {
      for (let px = 0; px < W; px += 1) {
        const i = (py * W + px) * 4;
        if (!isAccent(png.data[i], png.data[i + 1], png.data[i + 2])) continue;
        if (inWm(px, py)) { wmPx += 1; continue; }
        for (const name of Object.keys(bands)) {
          const b = bands[name];
          if (py >= b.y0 && py < b.y1) { counts[name] += 1; break; }
        }
      }
    }

    results.push({ y: geom.scrollY, bands, counts, wmPx });
    process.stderr.write('.');
  }

  await browser.close();
  return { doc, H, W, results };
}

const W = Number(process.argv[2]);
const H = Number(process.argv[3]);
const out = await sweep(W, H);
fs.writeFileSync(`.measure/sweep-${W}.json`, JSON.stringify(out));
console.log(`\nsweep ${W}x${H}: ${out.results.length} positions, doc ${out.doc}px`);

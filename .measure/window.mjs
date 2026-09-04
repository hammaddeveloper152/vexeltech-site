import { open, isAccent, FRAMES } from './lib.mjs';
import { PNG } from 'pngjs';
import fs from 'node:fs';

/* THE SETTLED WINDOW.

   Denominator: the carrying section's area INSIDE ONE VIEWPORT.
   Position:    where the section is fully populated —
                  section shorter than the viewport -> the whole section in view
                  section taller  than the viewport -> a full screen of it
   Reported:    the worst ratio among the positions that qualify.

   Measured at the exact qualifying scroll positions rather than on a grid: a
   section six pixels shorter than the viewport is fully in view for six pixels
   of scroll, and a sweep steps straight over it. */

const W = Number(process.argv[2]);
const H = Number(process.argv[3]);
const SAMPLES = 9;

const { browser, page } = await open(W, H);
const doc = await page.evaluate(() => document.documentElement.scrollHeight);

async function at(y) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await new Promise((r) => setTimeout(r, 200));
  const g = await page.evaluate(() => {
    const wm = document.querySelector('.wm');
    const w = wm && wm.getBoundingClientRect();
    return {
      y: Math.round(window.scrollY),
      wm: w ? { x: w.x, y: w.y, w: w.width, h: w.height } : null,
    };
  });
  const png = PNG.sync.read(await page.screenshot({ type: 'png', captureBeyondViewport: false }));
  return { g, png };
}

function count(png, wm, y0, y1) {
  let n = 0;
  const a = Math.max(0, Math.floor(y0)), b = Math.min(png.height, Math.ceil(y1));
  for (let y = a; y < b; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      if (wm && x >= wm.x - 2 && x <= wm.x + wm.w + 2 && y >= wm.y - 2 && y <= wm.y + wm.h + 2) continue;
      const i = (y * png.width + x) * 4;
      if (isAccent(png.data[i], png.data[i + 1], png.data[i + 2])) n += 1;
    }
  }
  return n;
}

const out = [];
for (const f of FRAMES) {
  const geo = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, h: r.height };
  }, f.section);
  if (!geo) { out.push({ name: f.name, missing: true }); continue; }

  const SH = geo.h;
  let lo, hi;
  if (SH <= H) { lo = geo.top + SH - H; hi = geo.top; }        // whole section in view
  else { lo = geo.top; hi = geo.top + SH - H; }                 // a full screen of it
  lo = Math.max(0, Math.min(lo, doc - H));
  hi = Math.max(0, Math.min(hi, doc - H));
  if (hi < lo) [lo, hi] = [hi, lo];

  let best = null;
  for (let k = 0; k < SAMPLES; k += 1) {
    const y = Math.round(lo + ((hi - lo) * k) / (SAMPLES - 1 || 1));
    const { g, png } = await at(y);
    // the section's band in this frame, re-read live (pins move)
    const band = await page.evaluate((sel) => {
      const r = document.querySelector(sel).getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, h: r.height };
    }, f.section);
    const y0 = Math.max(0, band.top), y1 = Math.min(H, band.bottom);
    const vis = Math.max(0, y1 - y0);
    if (vis <= 0) continue;
    const n = count(png, g.wm, y0, y1);
    const area = W * vis;
    const pct = (100 * n) / area;
    if (!best || pct > best.pct) best = { y: g.y, vis: Math.round(vis), n, area: Math.round(area), pct };
    if (hi === lo) break;
  }
  out.push({ name: f.name, sectionH: Math.round(SH), range: [Math.round(lo), Math.round(hi)], ...best });
  process.stderr.write('*');
}

await browser.close();
fs.writeFileSync(`.measure/window-${W}.json`, JSON.stringify(out, null, 1));

console.log(`\n#### ${W} x ${H} — the accent in its window ####`);
for (const r of out) {
  if (r.missing) { console.log(`  ${r.name} MISSING`); continue; }
  const over = r.pct > 5 ? '   <<<< OVER 5%' : '';
  const none = r.n < 12 ? '   [no carrier]' : '';
  console.log(
    `  ${r.name.padEnd(13)} sectionH ${String(r.sectionH).padStart(5)}  ` +
    `y ${String(r.range[0]).padStart(5)}..${String(r.range[1]).padEnd(5)}  ` +
    `worst @ ${String(r.y).padStart(5)}  visible ${String(r.vis).padStart(4)}  ` +
    `denom ${String(r.area).padStart(8)}  accent ${String(r.n).padStart(6)}  ` +
    `${r.pct.toFixed(2)}%${over}${none}`
  );
}

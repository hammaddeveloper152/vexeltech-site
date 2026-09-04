import { open, isAccent, FRAMES } from './lib.mjs';
import { PNG } from 'pngjs';

const W = Number(process.argv[2]), H = Number(process.argv[3]);
const PAIRS = JSON.parse(process.argv[4]); // [[a,b,lo,hi], ...]
const STEP = Number(process.argv[5] || 20);

const { browser, page } = await open(W, H);
const sec = (n) => FRAMES.find((f) => f.name === n).section;

for (const [a, b, lo, hi] of PAIRS) {
  const hits = [];
  for (let y = lo; y <= hi; y += STEP) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 110));
    const g = await page.evaluate((args) => {
      const [sa, sb] = args;
      const rb = (s) => { const r = document.querySelector(s).getBoundingClientRect(); return { top: r.top, bottom: r.bottom }; };
      const wm = document.querySelector('.wm').getBoundingClientRect();
      return { A: rb(sa), B: rb(sb), wm: { x: wm.x, y: wm.y, w: wm.width, h: wm.height }, y: Math.round(window.scrollY) };
    }, [sec(a), sec(b)]);
    const png = PNG.sync.read(await page.screenshot({ type: 'png', captureBeyondViewport: false }));
    const tally = (band) => {
      let n = 0;
      for (let yy = Math.max(0, Math.floor(band.top)); yy < Math.min(H, Math.ceil(band.bottom)); yy += 1)
        for (let xx = 0; xx < W; xx += 1) {
          if (xx >= g.wm.x - 2 && xx <= g.wm.x + g.wm.w + 2 && yy >= g.wm.y - 2 && yy <= g.wm.y + g.wm.h + 2) continue;
          const i = (yy * W + xx) * 4;
          if (isAccent(png.data[i], png.data[i + 1], png.data[i + 2])) n += 1;
        }
      return n;
    };
    const na = tally(g.A), nb = tally(g.B);
    if (na > 12 && nb > 12) hits.push({ y: g.y, na, nb, sum: na + nb });
  }
  if (!hits.length) { console.log(`  ${a} + ${b}: no frame holds both`); continue; }
  const worst = hits.reduce((p, q) => (q.sum > p.sum ? q : p));
  console.log(
    `  ${a} + ${b}  y ${hits[0].y}..${hits[hits.length - 1].y}` +
    `  (${hits[hits.length - 1].y - hits[0].y + STEP}px of scroll, ${(((hits[hits.length - 1].y - hits[0].y + STEP) / H) * 100).toFixed(0)}% of a screen)` +
    `  worst @${worst.y}: ${a} ${worst.na}px + ${b} ${worst.nb}px = ${(100 * worst.sum / (W * H)).toFixed(2)}% of the frame`
  );
  await page.evaluate((v) => window.scrollTo(0, v), worst.y);
  await new Promise((r) => setTimeout(r, 250));
  await page.screenshot({ path: `.measure/seam-${W}-${a.replace(/\W/g, '')}-${b.replace(/\W/g, '')}.png` });
}
await browser.close();

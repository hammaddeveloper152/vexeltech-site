import { open, isAccent } from './lib.mjs';
import { PNG } from 'pngjs';

/* Full-viewport shot, indexed by the element's viewport rect. Puppeteer's
   `clip` is document-relative on this version, which silently returned bands
   from elsewhere on the page; a full frame and an index cannot do that. */
async function shot(page) {
  return PNG.sync.read(await page.screenshot({ type: 'png', captureBeyondViewport: false }));
}

async function ink(page, sel) {
  await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (el) el.scrollIntoView({ block: 'center' });
  }, sel);
  await new Promise((r) => setTimeout(r, 400));
  const b = await page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, fs: getComputedStyle(el).fontSize };
  }, sel);
  if (!b) return null;
  const png = await shot(page);
  const x0 = Math.max(0, Math.floor(b.x)), x1 = Math.min(png.width, Math.ceil(b.x + b.w));
  const y0 = Math.max(0, Math.floor(b.y)), y1 = Math.min(png.height, Math.ceil(b.y + b.h));
  let top = Infinity, bot = -1, left = Infinity, right = -1, n = 0;
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const i = (y * png.width + x) * 4;
      if (isAccent(png.data[i], png.data[i + 1], png.data[i + 2])) {
        n += 1;
        if (y < top) top = y; if (y > bot) bot = y;
        if (x < left) left = x; if (x > right) right = x;
      }
    }
  }
  return {
    fontSize: b.fs,
    lineBox: Math.round(b.h),
    inkH: bot >= 0 ? bot - top + 1 : 0,
    inkW: right >= 0 ? right - left + 1 : 0,
    accentPx: n,
  };
}

for (const [W, H] of [[1280, 800], [390, 844]]) {
  const { browser, page } = await open(W, H);
  console.log(`\n=== ${W}x${H} ===`);
  for (const [label, sel] of [
    ['testimonial mark   ', '.quotes__slide[data-active="true"] .quotes__mark'],
    ['counter lead figure', '.counters__item:first-child .counters__n'],
    ['failures lead      ', '.fail__item--lead .fail__s'],
    ['FAQ heading        ', '.faq__h'],
    ['work heading       ', '.work__h'],
  ]) {
    console.log(label, await ink(page, sel));
  }
  await browser.close();
}

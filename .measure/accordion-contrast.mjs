/* accordion-contrast.mjs (the final pass, 2026-10-03): the accordion's
   captions over the captures. contrast.mjs cannot see a photograph under
   text, so each caption is hidden, the panel shot, and the BRIGHTEST pixel
   in its box taken as the ground (the worst case). Each panel is made
   active in turn, at 1280 and 390, under reduced motion (the capture at the
   top of its page). A box under the fixed header bar measures the bar, not
   the panel; read its row with that in mind.
   Usage: node .measure/accordion-contrast.mjs */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const BONE = lum(0xe8, 0xea, 0xed), LIFT = lum(0x9b, 0xa1, 0xa9);
const b = await puppeteer.launch({ headless: 'new' });
for (const [w, h] of [[1280, 800], [390, 844]]) {
  const p = await b.newPage(); await p.setViewport({ width: w, height: h });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle0' }); await p.bringToFront();
  for (let i = 0; i < 6; i++) {
    await p.evaluate((n) => { const ps = document.querySelectorAll('.wa__panel'); ps[n].scrollIntoView({ block: 'center' }); ps.forEach((x, j) => x.dataset.on = j === n ? 'true' : 'false'); }, i);
    await new Promise((r) => setTimeout(r, 400));
    // worst case for the active capture: its top and its scrolled foot; reduced motion shows the top
    await p.addStyleTag({ content: '.wa__name,.wa__where,.wa__side{color:transparent!important}' });
    const boxes = await p.evaluate(() => [...document.querySelectorAll('.wa__panel')].map((x) => {
      const on = x.dataset.on === 'true';
      const els = on ? [x.querySelector('.wa__name'), x.querySelector('.wa__where')] : [x.querySelector('.wa__side')];
      return els.map((e) => { const r = e.getBoundingClientRect(); return { on, cls: e.className, x: r.x, y: r.y, w: r.width, h: r.height }; });
    }).flat());
    const buf = await p.screenshot();
    const png = PNG.sync.read(buf);
    let worst = {};
    for (const bx of boxes) {
      let max = 0;
      for (let y = Math.max(0, Math.floor(bx.y)); y < Math.min(png.height, bx.y + bx.h); y++) for (let x = Math.max(0, Math.floor(bx.x)); x < Math.min(png.width, bx.x + bx.w); x++) { const k = (y * png.width + x) * 4; max = Math.max(max, lum(png.data[k], png.data[k + 1], png.data[k + 2])); }
      const fg = bx.cls === 'wa__where' ? LIFT : BONE;
      const r = ratio(fg, max); if (r < 4.5) console.log("  low", bx.cls, bx.on, Math.round(bx.x), Math.round(bx.y), Math.round(bx.w), Math.round(bx.h));
      if (!worst[bx.cls] || r < worst[bx.cls]) worst[bx.cls] = Math.round(r * 100) / 100;
    }
    console.log(w, 'active', i, JSON.stringify(worst));
    await p.reload({ waitUntil: 'networkidle0' });
  }
  await p.close();
}
await b.close();

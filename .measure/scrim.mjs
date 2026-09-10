/* scrim.mjs — the marble bands' text values over the image's BRIGHTEST region.

   A photograph is not a flat ground. Averaging it and measuring against the
   average is how a value passes a walk and fails on the screen: the bright
   veins are where the type actually breaks, and they are a small share of the
   pixels, so an average hides them completely.

   So every text element on a band is measured against the brightest patch of
   ground INSIDE ITS OWN BOX — the worst case it can actually sit on — and the
   scrim is raised in 5% steps until every pair clears its bar.
*/
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => { const l1 = Math.max(a, b), l2 = Math.min(a, b); return (l1 + 0.05) / (l2 + 0.05); };

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });

async function walk(scrim) {
  const bad = [];
  const rows = [];
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h });
    await p.goto('http://localhost:4179/', { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2200));
    await p.addStyleTag({ content: `.band-marble { --scrim: ${scrim}% }` });
    await new Promise((r) => setTimeout(r, 300));

    for (const sel of ['.counters', '.faq']) {
      const band = await p.evaluate((s2) => {
        const e = document.querySelector(s2);
        if (!e) return null;
        document.scrollingElement.scrollTop = e.getBoundingClientRect().top + scrollY;
        return true;
      }, sel);
      if (!band) { await p.close(); continue; }
      await new Promise((r) => setTimeout(r, 400));

      const items = await p.evaluate((s2) => {
        const px = (v) => (v.match(/[\d.]+/g) || []).map(Number);
        const out = [];
        for (const el of document.querySelector(s2).querySelectorAll('*')) {
          const txt = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())
            .map((n) => n.textContent.trim()).join(' ');
          if (!txt) continue;
          const c = getComputedStyle(el);
          if (c.visibility === 'hidden' || c.display === 'none' || +c.opacity < 0.05) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > innerHeight) continue;
          const size = parseFloat(c.fontSize);
          const bold = parseInt(c.fontWeight, 10) >= 700;
          out.push({
            cls: (el.className || '').toString().split(' ')[0] || el.tagName,
            fg: px(c.color).slice(0, 3), size: Math.round(size),
            need: (size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5,
            box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
            txt: txt.slice(0, 22),
          });
        }
        return out;
      }, sel);

      /* THE GROUND IS MEASURED WITH THE TEXT HIDDEN, and the first version of
         this did not do that. It sampled inside each element's own box and
         tried to exclude the ink by luminance — which cannot work for WHITE
         type on a photograph: the anti-aliased edge of a white glyph is a
         bright pixel a hair off pure white, so the walk read the type as the
         brightest part of its own ground and reported 1.02:1 at every scrim
         value including 90%. Hiding the copy leaves the ground and nothing
         else, and the brightest pixel in the box is then the worst ground that
         text can actually sit on. */
      await p.evaluate((s2) => {
        document.querySelectorAll(s2 + ' *').forEach((e) => {
          if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))
            e.style.visibility = 'hidden';
        });
      }, sel);
      await new Promise((r) => setTimeout(r, 250));
      const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
      await p.evaluate((s2) => {
        document.querySelectorAll(s2 + ' *').forEach((e) => { e.style.visibility = ''; });
      }, sel);

      for (const it of items) {
        const [x, y, bw, bh] = it.box;
        const inkL = L(...it.fg);
        let peak = 0;
        for (let yy = Math.max(0, y); yy < Math.min(im.height, y + bh); yy++) {
          for (let xx = Math.max(0, x); xx < Math.min(im.width, x + bw); xx++) {
            const i = (yy * im.width + xx) * 4;
            const l = L(im.data[i], im.data[i + 1], im.data[i + 2]);
            if (l > peak) peak = l;
          }
        }
        const ratio = CR(inkL, peak);
        const row = { w, sel, ...it, peak, ratio: +ratio.toFixed(2) };
        rows.push(row);
        if (ratio < it.need) bad.push(row);
      }
    }
    await p.close();
  }
  return { bad, rows };
}

let scrim = 40;
let result;
for (;;) {
  result = await walk(scrim);
  console.log(`\nscrim ${scrim}%  —  ${result.bad.length} failing pair(s) over the brightest region`);
  for (const r of result.bad) {
    console.log(`  ${String(r.ratio).padStart(5)} (needs ${r.need})  ${r.w}  ${r.cls.padEnd(18)} "${r.txt}"  peak ${(r.peak * 100).toFixed(1)}%`);
  }
  if (!result.bad.length || scrim >= 90) break;
  scrim += 5;
}
console.log(`\nFINAL SCRIM: ${scrim}%`);
const worst = result.rows.slice().sort((a, c) => a.ratio - c.ratio).slice(0, 6);
console.log('tightest pairs at that value:');
for (const r of worst) {
  console.log(`  ${String(r.ratio).padStart(5)} (needs ${r.need})  ${r.w}  ${r.cls.padEnd(18)} "${r.txt}"  peak ${(r.peak * 100).toFixed(1)}%`);
}
await b.close();

/* scrim.mjs — every band's text values over its image's BRIGHTEST region.

   A photograph is not a flat ground. Averaging it and measuring against the
   average is how a value passes a walk and fails on the screen: the bright part
   is where the type actually breaks, and it is a small share of the pixels, so
   an average hides it completely.

   So every text element on a band is measured against the brightest patch of
   ground INSIDE ITS OWN BOX — the worst case it can actually sit on — and each
   band's scrim is raised in 5% steps until every pair on it clears its bar.

   EACH BAND IS WALKED ON ITS OWN. They are different photographs with different
   ranges, and one number for all of them would be the darkest band's number
   imposed on the lightest, which throws away the material on four bands to fix
   one. The floor column is not a contrast number: it is a design rule that the
   walk may raise but never lower — see `.band-glass` in lit.css.

   THE GROUND IS MEASURED WITH THE TEXT HIDDEN, and the first version of this
   did not do that. It sampled inside each element's own box and tried to
   exclude the ink by luminance — which cannot work for WHITE type on a
   photograph: the anti-aliased edge of a white glyph is a bright pixel a hair
   off pure white, so the walk read the type as the brightest part of its own
   ground and reported 1.02:1 at every scrim value including 90%. Hiding the
   copy leaves the ground and nothing else.
*/
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => { const l1 = Math.max(a, b), l2 = Math.min(a, b); return (l1 + 0.05) / (l2 + 0.05); };

/* Every band on the site, where it lives, and where its walk starts.

   The call band is walked on THREE routes because it is the one band that
   repeats and its copy is different on each: a heading and a note that differ
   in length change which words land on the bright part of the burst. */
const BANDS = [
  { key: 'marble', cls: 'band-marble', start: 45, floor: 0,
    at: [['/', '.counters'], ['/about-us', '.counters']] },
  { key: 'burst', cls: 'band-burst', start: 45, floor: 0,
    at: [['/about-us', '.callband'], ['/services', '.callband'], ['/pricing', '.callband']] },
  { key: 'cubes', cls: 'band-cubes', start: 45, floor: 0,
    at: [['/', '.faq']] },
  { key: 'glass', cls: 'band-glass', start: 45, floor: 70,
    at: [['/', '.fail']] },
];

const only = process.argv[2];
const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });

async function walk(band, scrim) {
  const bad = [], rows = [];
  for (const [route, sel] of band.at) {
    for (const [w, h] of [[1280, 900], [390, 844]]) {
      const p = await b.newPage();
      await p.setViewport({ width: w, height: h });
      await p.goto('http://localhost:4179' + route, { waitUntil: 'domcontentloaded' });
      await new Promise((r) => setTimeout(r, 2200));
      await p.addStyleTag({ content: `.${band.cls} { --scrim: ${scrim}% }` });
      await new Promise((r) => setTimeout(r, 300));

      const ok = await p.evaluate((s2) => {
        const e = document.querySelector(s2);
        if (!e) return false;
        document.scrollingElement.scrollTop = e.getBoundingClientRect().top + scrollY;
        return true;
      }, sel);
      if (!ok) { await p.close(); continue; }
      await new Promise((r) => setTimeout(r, 400));

      const items = await p.evaluate((s2) => {
        const px = (v) => (v.match(/[\d.]+/g) || []).map(Number);
        const out = [];
        for (const el of document.querySelector(s2).querySelectorAll('*')) {
          const txt = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())
            .map((n) => n.textContent.trim()).join(' ');
          /* ICONS COUNT, AND THIS WALK USED TO MISS THEM ENTIRELY.

             It selected elements with a TEXT NODE, so the FAQ's plus mark — a
             span with an SVG in it, taking `currentColor` — was invisible to
             the walk. The band passed at 50% and the mark was landing on a
             specular cube edge at 1.38:1 against a 3.0 bar. A control's
             affordance is a contrast pair whether or not it is made of
             letters. */
          const icon = !txt && el.querySelector(':scope > svg');
          if (!txt && !icon) continue;
          const c = getComputedStyle(el);
          if (c.visibility === 'hidden' || c.display === 'none' || +c.opacity < 0.05) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > innerHeight) continue;
          /* AN ELEMENT THAT PAINTS ITS OWN GROUND IS NOT ON THE BAND.

             The call band's button is asphalt on machine yellow. Hiding it to
             read the ground hides its yellow with it, so the walk measured
             asphalt ink against the SCRIMMED BAND behind the button — 1.14:1,
             and no scrim could ever fix it, because the reader is not looking
             at that ground. The button carries its own contrast and the
             general walk already checks it. */
          const bgv = px(c.backgroundColor);
          if ((bgv.length === 4 ? bgv[3] : 1) > 0.95) continue;
          const size = parseFloat(c.fontSize);
          const bold = parseInt(c.fontWeight, 10) >= 700;
          out.push({
            cls: ((el.className || '').toString().split(' ')[0] || el.tagName) + (icon ? ' (icon)' : ''),
            fg: px(c.color).slice(0, 3), size: Math.round(size),
            /* Non-text contrast is 3:1, the same bar large text takes. */
            need: icon ? 3 : ((size >= 24 || (size >= 18.66 && bold)) ? 3 : 4.5),
            box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
            txt: txt ? txt.slice(0, 22) : 'icon',
          });
        }
        return out;
      }, sel);

      await p.evaluate((s2) => {
        document.querySelectorAll(s2 + ' *').forEach((e) => {
          if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
              || e.querySelector(':scope > svg'))
            e.style.visibility = 'hidden';
        });
      }, sel);
      await new Promise((r) => setTimeout(r, 250));
      const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
      await p.close();

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
        const row = { w, route, ...it, peak, ratio: +ratio.toFixed(2) };
        rows.push(row);
        if (ratio < it.need) bad.push(row);
      }
    }
  }
  return { bad, rows };
}

const finals = [];
for (const band of BANDS) {
  if (only && only !== band.key) continue;
  let scrim = Math.max(band.start, band.floor);
  let result;
  console.log(`\n=== ${band.key} — ${band.at.map((a) => a[0] + ' ' + a[1]).join(', ')}` +
              `${band.floor ? `, floor ${band.floor}%` : ''} ===`);
  for (;;) {
    result = await walk(band, scrim);
    console.log(`  scrim ${String(scrim).padStart(2)}%  ${result.bad.length} failing pair(s) over the brightest region`);
    for (const r of result.bad.slice(0, 5)) {
      console.log(`      ${String(r.ratio).padStart(5)} (needs ${r.need})  ${String(r.w).padStart(4)}  ` +
                  `${r.cls.padEnd(18)} "${r.txt}"  peak ${(r.peak * 100).toFixed(1)}%`);
    }
    if (!result.bad.length || scrim >= 95) break;
    scrim += 5;
  }
  const worst = result.rows.slice().sort((a, c) => a.ratio - c.ratio)[0];
  finals.push({ key: band.key, scrim, worst, pairs: result.rows.length, failed: result.bad.length });
  console.log(`  FINAL ${band.key}: ${scrim}%` +
              (worst ? `  binding pair ${worst.cls} at ${worst.w} — ${worst.ratio}:1 (needs ${worst.need})` : ''));
}

console.log('\n  band     scrim   pairs   binding pair                    ratio  bar');
for (const f of finals) {
  const wst = f.worst;
  console.log(`  ${f.key.padEnd(8)} ${String(f.scrim + '%').padEnd(7)} ${String(f.pairs).padEnd(7)} ` +
              `${wst ? `${wst.cls} at ${wst.w}`.padEnd(31) : ''.padEnd(31)}` +
              `${wst ? String(wst.ratio).padStart(5) : ''}  ${wst ? wst.need.toFixed(1) : ''}` +
              `${f.failed ? '   STILL FAILING' : ''}`);
}
await b.close();

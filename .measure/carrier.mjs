/* carrier.mjs — machine yellow as a share of the FRAME, off painted pixels.

   The DOM walk in `pageaccent.mjs` counts elements whose computed colour is
   the accent. It cannot see a pseudo-element, a gradient stop or a canvas, and
   three of the four things this measures are exactly that: the plate's left
   bar is `::after`, the corner glow is a radial, and the work numerals are
   `::before` content. So this one counts pixels.

   The ceiling is DESIGN.md's: one carrier per frame, under 5% of the surface
   it sits on. A glow is not a carrier — it is the key falling on a plane, it
   is never flat, and it says nothing about what to act on — but it paints
   yellow, so it is counted here and named rather than excluded quietly. */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

/* the accent itself, and the glow's own composite band, counted separately */
const solid = (r, g, b) => Math.abs(r - 240) < 20 && Math.abs(g - 179) < 20 && Math.abs(b - 35) < 30;
const anyY = (r, g, b) => r > g && g > b && r - b > 18 && r > 30;
/* THE ARC FIELD RULE, re-walked. DESIGN.md: arc works as an accent and fails
   as a ground, and the two-light model puts a 240px arc radial on every object
   and a 900px one on every dark section. The question that rule asks is
   whether arc has become a FIELD, so this counts the share of the frame
   carrying arc above what the plane already has — lit-near is #1E1F22 and
   already runs 4 points of blue over red before anything is painted. */
const arcish = (r, g, b) => (b - r) > 12 && b > 24;

/* [route, what to scroll to, label, the OBJECTS whose own surface is measured,
    open a plate first] — two numbers per row, because the rule has two halves:
    the share of the frame, and the share of the surface the accent sits on.
    The services row is why: that section's GROUND is machine yellow, so its
    frame reads 43% and none of it is a carrier. What matters there is what the
     cards themselves carry.

     ARC IS COUNTED TOO. The two-light model puts an arc rim on every object
     and an arc bloom on every dark section, and DESIGN.md's standing rule is
     that arc works as an accent and fails as a ground. So the same walk asks
     whether it has become a field: the share of the frame, and of the object's
     own surface, carrying arc ABOVE what the plane already has. */
const FRAMES = [
  ['/', '.services__card', 'services cards', '.services__card'],
  ['/', '.work__list', 'work grid', '.work__plate'],
  ['/about-us', '.plates', 'about plates, at rest', '.plate'],
  ['/about-us', '.plates', 'about plates, one open', '.plate', true],
  ['/pricing', '.cards', 'pricing, branding', '.card'],
  ['/services', '.svc__plate', 'services plates', '.svc__plate'],
  ['/services', '.svc__index', 'services index', '.svc__index-n'],
];

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });

for (const [w, h] of [[1280, 800], [390, 844]]) {
  console.log(`\n=== ${w} ===`);
  for (const [route, sel, label, objSel, open] of FRAMES) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h });
    await p.goto('http://localhost:4179' + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2200));
    const found = await p.evaluate((s) => {
      const e = document.querySelector(s);
      if (!e) return false;
      window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 120);
      return true;
    }, sel);
    if (!found) { console.log(`  ${label.padEnd(24)} not on the page`); await p.close(); continue; }
    await new Promise((r) => setTimeout(r, 400));
    if (open) {
      await p.evaluate(() => document.querySelector('.plate').click());
      await new Promise((r) => setTimeout(r, 500));
    }
    /* THE VISIBLE BOX, NOT THE LAYOUT BOX. The services cards are an 870px
       rail inside a clipped container: the first card's layout box starts at
       -80 while its painted edge is at 64, so 144px of the section's yellow
       ground sat inside a box the card does not paint and the frame read 10.7%
       carrier where the card carries almost none. Every box is intersected
       with each clipping ancestor before anything is counted. */
    const boxes = await p.evaluate((q) => [...document.querySelectorAll(q)]
      .map((e) => {
        const r = e.getBoundingClientRect();
        let box = [r.left, r.top, r.right, r.bottom];
        for (let a = e.parentElement; a && a !== document.documentElement; a = a.parentElement) {
          const c = getComputedStyle(a);
          if (c.overflowX === 'visible' && c.overflowY === 'visible' && c.clipPath === 'none') continue;
          const ar = a.getBoundingClientRect();
          box = [Math.max(box[0], ar.left), Math.max(box[1], ar.top),
                 Math.min(box[2], ar.right), Math.min(box[3], ar.bottom)];
        }
        box = [Math.max(box[0], 0), Math.max(box[1], 0),
               Math.min(box[2], innerWidth), Math.min(box[3], innerHeight)];
        return box.map(Math.round);
      })
      .filter((r) => r[2] > r[0] && r[3] > r[1]), objSel);

    const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
    let s = 0, n = 0, os = 0, on = 0, a = 0, oa = 0;
    const inObj = (x, y) => boxes.some((r) => x >= r[0] && x < r[2] && y >= r[1] && y < r[3]);
    for (let y = 0; y < im.height; y++) for (let x = 0; x < im.width; x++) {
      const i = (y * im.width + x) * 4;
      const R = im.data[i], G = im.data[i + 1], B = im.data[i + 2];
      const hit = solid(R, G, B);
      if (hit) s++;
      if (arcish(R, G, B)) a++;
      n++;
      if (inObj(x, y)) { on++; if (hit) os++; if (arcish(R, G, B)) oa++; }
    }
    const objPct = on ? (os / on * 100) : 0;
    const arcObj = on ? (oa / on * 100) : 0;
    console.log(`  ${label.padEnd(22)} yellow: frame ${(s / n * 100).toFixed(2).padStart(5)}%  object ${objPct.toFixed(2).padStart(5)}% ${objPct <= 5 ? 'ok ' : 'OVER'}   arc: frame ${(a / n * 100).toFixed(2).padStart(5)}%  object ${arcObj.toFixed(2).padStart(5)}% ${arcObj <= 25 ? 'glow' : 'FIELD'}`);
    await p.close();
  }
}
await b.close();

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
const ONLY = process.env.ONLY || '';
const FRAMES = [
  /* THE BANDS ARE HERE BECAUSE THEY PAINT LIGHT THE PAGE DID NOT PUT THERE.

     Four of the five new materials are photographs of light: orange sparks, a
     blue flash, specular edges on metal, gold veins. Every one of those lands
     in one of the two counters below without a single declaration naming the
     accent or the arc, which is exactly the case a DOM walk cannot see and the
     reason this one counts pixels.

     The glass band is the one the rule was re-walked for. It is an arc-blue
     flash across a whole section, and the question is not whether arc appears
     - it does, that is the picture - but whether it has stopped being a moment
     and become the ground. */
  /* FAILURES IS NOT WALKED HERE, 2026-09-14. It is a machine yellow GROUND now,
     so this counter would report most of its frame as accent, which is the
     ground doing its job rather than a carrier. Carriers on and around it are
     attributed element by element in `.measure/rhythm.mjs`, which knows a
     ground from a carrier. It was ['/', '.fail', 'failures, glass band',
     '.fail__item']. */
  /* Glass on Process since 2026-09-16. The frame-by-frame arc share against
     the 20.5% ceiling is `.measure/arcwalk.mjs`; this row reads one position. */
  ['/', '.process', 'process, glass band', '.process'],
  ['/', '.faq', 'faq, cubes band', '.faq__item'],
  ['/', '.counters', 'counters, marble band', '.counters__item'],
  ['/', '.marquee', 'marquee, rays', '.marquee__track'],
  /* THE OBJECT HERE IS THE BAND, NOT `.callband__in`. The rule is a share of
     THE SURFACE THE CARRIER SITS ON, and the carrier is the button: measuring
     it against the inner content box measures the button against a box it is
     itself half of, which reports 7.78% at every scrim value and is a fact
     about the grid rather than about the ground.

     Against the band, with the burst at 90%: 3.35% at 1280 and 8.24% at 390.
     With the image switched off entirely: 3.26% and 7.98%. The ground's own
     contribution is a quarter of a point — the rest is the button, and at 390
     a 48px full-width control on a 460px band is 8% by geometry before
     anything is painted. */
  /* Since 2026-09-16 the burst is Pricing's call only, About's call is the
     spotlight, and Services closes on the plain dark call. */
  ['/pricing', '.callband', 'call band, burst', '.callband'],
  ['/about-us', '.callband', 'call band, spot', '.callband'],
  ['/services', '.callband', 'call band, plain', '.callband'],
  ['/', '.services__grid', 'home services plates', '.svc__plate'],
  ['/', '.work__list', 'work grid', '.work__plate'],
  ['/about-us', '.plates', 'about plates, at rest', '.plate'],
  ['/about-us', '.plates', 'about plates, one open', '.plate', true],
  /* THE BOARD AND THE QUOTE, 2026-09-22: /pricing on an arc ground. The
     ladder's '.cards' row is gone with the ladder. The founder's pricing
     exception names the yellow here: the tab underline, the "Most picked"
     tag, the bundle card, the total strip and "Send this to us". */
  ['/pricing', '.pb__tabs', 'pricing board, branding', '.pb__card'],
  ['/pricing', '.pb__quote', 'pricing quote, empty', '.pb__receipt'],
  ['/services', '.svc__plate', 'services plates', '.svc__plate'],
  ['/services', '.svc__index', 'services index', '.svc__index-n'],
];

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });

for (const [w, h] of [[1280, 800], [390, 844]]) {
  console.log(`\n=== ${w} ===`);
  for (const [route, sel, label, objSel, open] of FRAMES.filter((f) => !ONLY || f[0] === ONLY)) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h });
    await p.goto((process.env.BASE || 'http://localhost:4179') + route, { waitUntil: 'domcontentloaded' });
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

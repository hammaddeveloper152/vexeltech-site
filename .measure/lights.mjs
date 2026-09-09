/* lights.mjs — the two-light model, measured at all FOUR corners.

   Two corners were not enough. Sampling only the key corner and the rim corner
   says how strong each light is and says nothing about whether the object
   reads as lit from ONE direction: a pair of radials that both bled across the
   whole face would give the same two numbers as a pair that stays in its
   corners. The off-axis corners — top right and bottom left — are the control.
   They should be close to the object's own centre, and a light that has
   reached them has stopped being a light and become a wash.

   THREE NUMBERS, NOT TWO, AND THE THIRD IS THE POINT.

   WARMTH is red minus blue and ARC is blue minus red, each against the
   object's own centre so the plane's colour cancels. But chroma alone
   understates the key and always will: warm white #FFF1CC carries 51 points of
   red over blue, arc #0D47BD carries 176 of blue over red — **3.5 times the
   chroma at the same alpha.** The key is not a weak light, it is a nearly
   neutral one, and what it actually spends is LUMINANCE. So LUM is reported
   too, as a percentage-point delta against the centre.

   Read them as a pair of jobs: the key lightens the plane, the rim tints it.

   Sampled 12px inside the VISIBLE box — intersected with every clipping
   ancestor, per BUILD-LAW — because a rail card's layout corner can be off
   screen and a rotated plate's bounding-box corner is outside the plate. */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const OBJ = [
  ['/pricing', '.card', 'pricing card'],
  ['/pricing', '.card--lead', 'pricing pick'],
  ['/about-us', '.plate', 'about plate'],
  ['/services', '.svc__plate', 'services plate'],
  ['/', '.services__card', 'home services card'],
  ['/', '.faq__item[data-open="true"]', 'faq open row'],
];

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });

console.log('                        key TL      off TR      off BL      rim BR');
for (const [route, sel, label] of OBJ) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  await p.goto('http://localhost:4179' + route, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2200));
  if (sel.includes('faq')) {
    await p.evaluate(() => { const e = document.querySelector('.faq__item'); if (e) e.scrollIntoView({ block: 'center' }); });
    await new Promise((r) => setTimeout(r, 400));
    await p.evaluate(() => { const q = document.querySelector('.faq__q button'); if (q) q.click(); });
    await new Promise((r) => setTimeout(r, 500));
  }
  const ok = await p.evaluate((q) => {
    const e = document.querySelector(q);
    if (!e) return false;
    document.scrollingElement.scrollTop = e.getBoundingClientRect().top + scrollY - 150;
    return true;
  }, sel);
  if (!ok) { console.log(`${label.padEnd(20)} not found`); await p.close(); continue; }
  await new Promise((r) => setTimeout(r, 500));

  const bx = await p.evaluate((q) => {
    const e = document.querySelector(q); const r = e.getBoundingClientRect();
    let b2 = [r.left, r.top, r.right, r.bottom];
    for (let a = e.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const c = getComputedStyle(a);
      if (c.overflowX === 'visible' && c.overflowY === 'visible' && c.clipPath === 'none') continue;
      const ar = a.getBoundingClientRect();
      b2 = [Math.max(b2[0], ar.left), Math.max(b2[1], ar.top), Math.min(b2[2], ar.right), Math.min(b2[3], ar.bottom)];
    }
    b2 = [Math.max(b2[0], 0), Math.max(b2[1], 0), Math.min(b2[2], innerWidth), Math.min(b2[3], innerHeight)];
    return b2.map(Math.round);
  }, sel);

  const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
  /* a 5x5 median-ish mean, so a stray glyph or hairline pixel cannot be the
     reading — the failure mode that made an earlier sample report the work
     plate's numeral as its key */
  const at = (x, y) => {
    let r = 0, g = 0, bl = 0, n = 0;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const i = ((y + dy) * im.width + (x + dx)) * 4;
      r += im.data[i]; g += im.data[i + 1]; bl += im.data[i + 2]; n++;
    }
    return [r / n, g / n, bl / n];
  };
  const d = 20; /* clears a 1.5 degree tilt's corner displacement */
  const mid = at(Math.round((bx[0] + bx[2]) / 2), Math.round((bx[1] + bx[3]) / 2));
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const L = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const warm = (c) => (c[0] - c[2]) - (mid[0] - mid[2]);
  const arc = (c) => (c[2] - c[0]) - (mid[2] - mid[0]);
  const lum = (c) => (L(c) - L(mid)) * 100;
  const tl = at(bx[0] + d, bx[1] + d), tr = at(bx[2] - d, bx[1] + d);
  const bll = at(bx[0] + d, bx[3] - d), br = at(bx[2] - d, bx[3] - d);
  const f = (v) => (v >= 0 ? '+' : '') + v.toFixed(1);
  console.log(
    `${label.padEnd(20)} warm ${f(warm(tl)).padStart(6)}  ${f(warm(tr)).padStart(6)}  ${f(warm(bll)).padStart(6)}  ${f(warm(br)).padStart(6)}`
  );
  console.log(
    `${''.padEnd(20)}  arc ${f(arc(tl)).padStart(6)}  ${f(arc(tr)).padStart(6)}  ${f(arc(bll)).padStart(6)}  ${f(arc(br)).padStart(6)}`
  );
  console.log(
    `${''.padEnd(20)}  lum ${f(lum(tl)).padStart(6)}  ${f(lum(tr)).padStart(6)}  ${f(lum(bll)).padStart(6)}  ${f(lum(br)).padStart(6)}`
  );
  await p.close();
}
await b.close();

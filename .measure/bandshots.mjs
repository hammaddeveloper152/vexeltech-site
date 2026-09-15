/* bandshots.mjs — every band on the site, at 1280.

   Each is a document-space clip, so the page is never scrolled to the section
   and nothing depends on where a scroll settles. The FAQ is shot twice: at
   rest, and with the first row open, because the open row is the only lit
   object in that section and four closed rows do not show it.

   The footer is here because it carries the scratches overlay, which is the
   one material that is not a band — it needs to be looked at on a surface that
   is not a photograph, where there is nothing else for it to hide behind.
*/
import puppeteer from 'puppeteer';

const W = Number(process.argv[2]) || 1280;
const OUT = '.measure/out/agency';

const SHOTS = [
  ['/', '.counters', 'band-counters', 'marble, and the scratches overlay'],
  ['/', '.marquee', 'band-marquee', 'rays at 35%'],
  ['/', '.fail', 'band-failures', 'glass'],
  ['/', '.faq', 'band-faq', 'no ground, the rig'],
  ['/about-us', '.callband', 'band-call-about', 'spot on a black scrim'],
  ['/pricing', '.callband', 'band-call-pricing', 'burst on a black scrim'],
  ['/about-us', 'footer.foot', 'band-footer', 'the scratches overlay on the rig'],
];

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb',
         '--font-render-hinting=none'] });

let last = null, p = null;
for (const [route, sel, name, note] of SHOTS) {
  if (route !== last) {
    if (p) await p.close();

/* ---- the seams, cropped across the join --------------------------------

   A band's gap is a number the eye reads as one thing or another: a run of
   plain ground, or the previous section growing a floor. The rule says 96px at
   1280 from the last object to the band's edge, so the crop starts 96px above
   that object and ends 96px into the band, and the join sits in the middle of
   the frame with the measurement either side of it. */
for (const [route, sel, name] of [['/pricing', '.band-burst', 'seam-pricing'],
                                  ['/about-us', '.band-spot', 'seam-about'],
                                  ['/', '.band-marble', 'seam-counters']]) {
  const sp = await b.newPage();
  await sp.setViewport({ width: W, height: 900 });
  await sp.goto((process.env.BASE || 'http://localhost:4179') + route, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2400));
  await sp.evaluate(() => document.querySelectorAll('[class*="band-"], .scratched')
    .forEach((e) => { e.dataset.near = 'true'; }));
  const tot = await sp.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < tot; y += 400) {
    await sp.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 90));
  }
  await sp.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 400));
  const clip = await sp.evaluate((s) => {
    const r = document.querySelector(s).getBoundingClientRect();
    const top = r.top + scrollY;
    return { x: 0, y: Math.round(top - 220), width: innerWidth, height: 420 };
  }, sel);
  await sp.screenshot({ path: `${OUT}/${name}.png`, clip });
  console.log(`  ${(name + '.png').padEnd(22)} ${clip.width}x${clip.height}   the join, 220px either side`);
  await sp.close();
}
    p = await b.newPage();
    await p.setViewport({ width: W, height: 900 });
    await p.goto((process.env.BASE || 'http://localhost:4179') + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2400));
    await p.evaluate(() => document.fonts.ready);
    /* one walk so every reveal, every count and every rail draw has run */
    const tot = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < tot; y += 400) {
      await p.evaluate((v) => window.scrollTo(0, v), y);
      await new Promise((r) => setTimeout(r, 90));
    }
    await p.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 400));
    last = route;
  }
  const clip = await p.evaluate((s) => {
    const e = document.querySelector(s);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { x: 0, y: Math.round(r.top + scrollY), width: innerWidth, height: Math.round(r.height) };
  }, sel);
  if (!clip) { console.log(`  ${name}: ${sel} not on ${route}`); continue; }
  await p.screenshot({ path: `${OUT}/${name}.png`, clip });
  console.log(`  ${(name + '.png').padEnd(22)} ${clip.width}x${clip.height}   ${note}`);

  if (name === 'band-faq') {
    await p.evaluate(() => document.querySelector('.faq__btn').click());
    await new Promise((r) => setTimeout(r, 700));
    const c2 = await p.evaluate((s) => {
      const r = document.querySelector(s).getBoundingClientRect();
      return { x: 0, y: Math.round(r.top + scrollY), width: innerWidth, height: Math.round(r.height) };
    }, sel);
    await p.screenshot({ path: `${OUT}/band-faq-open.png`, clip: c2 });
    console.log(`  ${'band-faq-open.png'.padEnd(22)} ${c2.width}x${c2.height}   the lit row on the cubes`);
  }
}
if (p) await p.close();

/* one material, one band — counted rather than asserted */
const audit = await b.newPage();
await audit.setViewport({ width: W, height: 900 });
const seen = {};
for (const route of ['/', '/services', '/pricing', '/about-us', '/contact-us',
                     '/portfolio', '/case-studies', '/resources']) {
  await audit.goto((process.env.BASE || 'http://localhost:4179') + route, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 1600));
  const found = await audit.evaluate(() => {
    const out = {};
    for (const el of document.querySelectorAll('[class*="band-"], .scratched')) {
      for (const c of el.className.toString().split(' ')) {
        if (c.startsWith('band-') || c === 'scratched') out[c] = (out[c] || 0) + 1;
      }
    }
    return out;
  });
  for (const [k, v] of Object.entries(found)) {
    seen[k] = seen[k] || {};
    seen[k][route] = v;
  }
}
console.log('\n  material          mounts');
for (const [k, routes] of Object.entries(seen)) {
  const total = Object.values(routes).reduce((a, c) => a + c, 0);
  console.log(`  ${k.padEnd(17)} ${String(total).padStart(2)}   ${Object.keys(routes).join(' ')}`);
}
await b.close();

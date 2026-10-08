/* final40-cards.mjs (FINAL40, addendum 4, 2026-10-08, the founder): the
   /pricing cards and the bundle under the pointer at 1280, in a real
   browser. For each: its transform and its glow's and face's opacity at
   rest and under the pointer, and the price's transform (it must not
   scale); then keyboard focus within the first card; then the same hover
   under reduced motion, where only the light may change. Writes
   pricing-hover-1280.png with the pointer over the Websites card.
     node .measure/final40-cards.mjs [base]   (default http://localhost:4190) */
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final40');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
let fail = 0;
for (const reduce of [false, true]) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + '/pricing', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: '.bar, .skip { visibility: hidden !important; }' });
  const read = (sel, i) =>
    p.evaluate(
      (sel, i) => {
        const c = document.querySelectorAll(sel)[i];
        const g = c.querySelector('.pr-col__glow, .pr-bundle__glow');
        const f = c.querySelector('.pr-col__bg, .pr-bundle__bg');
        const price = c.querySelector('.pr-col__price, .pr-bundle__price');
        return {
          tf: getComputedStyle(c).transform,
          glow: getComputedStyle(g).opacity,
          face: getComputedStyle(f).opacity,
          price: getComputedStyle(price).transform,
          name: (c.querySelector('h3') || c).textContent.trim().slice(0, 22),
        };
      },
      sel,
      i
    );
  const targets = [...[0, 1, 2, 3].map((i) => ['.pr-col', i]), ['.pr-bundle', 0]];
  for (const [sel, i] of targets) {
    await p.evaluate((sel, i) => document.querySelectorAll(sel)[i].scrollIntoView({ block: 'center' }), sel, i);
    await p.mouse.move(1, 1);
    await wait(300);
    const rest = await read(sel, i);
    const box = await p.evaluate((sel, i) => {
      const r = document.querySelectorAll(sel)[i].querySelector('h3').getBoundingClientRect();
      return { x: r.left + 10, y: r.top + r.height / 2 };
    }, sel, i);
    await p.mouse.move(box.x, box.y);
    await wait(350);
    const hov = await read(sel, i);
    const rise = (t) => (t === 'none' ? 0 : Number(t.match(/matrix\(([^)]+)\)/)[1].split(',')[5]));
    const d = rise(hov.tf) - rise(rest.tf);
    const ok = (reduce ? d === 0 : Math.abs(d + 4) < 0.5) && Number(hov.glow) >= 0.45 - 0.01 && hov.face === '1' && hov.price === 'none';
    if (!ok) fail += 1;
    console.log(`${reduce ? 'reduced ' : ''}${rest.name.padEnd(22)} rest ${rest.tf} glow ${rest.glow} face ${rest.face} | hover ${hov.tf} glow ${hov.glow} face ${hov.face} price ${hov.price} | rise ${d}px ${ok ? 'PASS' : 'FAIL'}`);
    if (!reduce && sel === '.pr-col' && i === 1) {
      const clip = await p.evaluate(() => {
        const g = document.querySelector('.pr-col').parentElement.getBoundingClientRect();
        return { x: 0, y: Math.max(0, g.top - 40 + scrollY), width: 1280, height: g.height + 80 };
      });
      await p.screenshot({ path: path.join(OUT, 'pricing-hover-1280.png'), clip, captureBeyondViewport: true });
    }
  }
  if (!reduce) {
    /* Keyboard: focus the first card's button. */
    await p.mouse.move(1, 1);
    await p.evaluate(() => document.querySelector('.pr-col .pr-col__btn').focus());
    await wait(300);
    const f = await read('.pr-col', 0);
    console.log(`focus within Branding: ${f.tf} glow ${f.glow} face ${f.face}`);
  }
  await p.close();
}
await b.close();
process.exit(fail ? 1 : 0);

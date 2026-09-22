/* routescroll.mjs — the route's draw, verified under a REAL scroll.

   WHY NOT `window.scrollTo`. Lenis eases toward a target and ScrollTrigger is
   driven off Lenis's own scroll event, so a programmatic jump sets the
   position without ever producing the frames in between. The line would land
   at its final value and every intermediate state — which is the whole
   device — would go unmeasured. `page.mouse.wheel` posts real wheel events,
   Lenis smooths them, and gsap's ticker advances the scrub exactly as it does
   for a reader.

   It walks the route in wheel steps, samples `--drawn` and the lit numerals
   at each, and captures the section at roughly half drawn.

     node .measure/routescroll.mjs [base]
*/
import fs from 'node:fs';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = '.measure/out';
fs.mkdirSync(OUT, { recursive: true });

const b = await puppeteer.launch({
  headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'],
});
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 800 });
await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
await p.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 1200));

const read = () =>
  p.evaluate(() => {
    const list = document.querySelector('.route');
    const sec = document.querySelector('.route-band');
    if (!list || !sec) return null;
    const stops = [...document.querySelectorAll('.route__stop')];
    const yellow = 'rgb(240, 179, 35)';
    return {
      drawn: Number(getComputedStyle(list).getPropertyValue('--drawn') || 0),
      lit: stops.filter((s) => s.getAttribute('data-reached') === 'true').length,
      painted: stops.filter((s) => getComputedStyle(s.querySelector('.route__n')).color === yellow).length,
      top: Math.round(sec.getBoundingClientRect().top),
      /* The line's painted height, off the element rather than off the token. */
      line: Math.round(list.getBoundingClientRect().height * Number(getComputedStyle(list).getPropertyValue('--drawn') || 0)),
    };
  });

/* Wheel down in real steps until the route has been crossed. */
let half = null;
const rows = [];
for (let i = 0; i < 90; i += 1) {
  await p.mouse.wheel({ deltaY: 120 });
  await new Promise((r) => setTimeout(r, 55));
  const s = await read();
  if (!s) continue;
  rows.push(s);
  if (!half && s.drawn >= 0.45 && s.drawn <= 0.6) {
    await new Promise((r) => setTimeout(r, 350));
    const el = await p.$('.route-band');
    if (el) await el.screenshot({ path: `${OUT}/route-half-drawn.png` });
    half = await read();
  }
  if (s.drawn >= 0.999 && s.lit >= 5) break;
}

const seen = [];
let last = -1;
for (const r of rows) {
  if (r.lit !== last) {
    seen.push(r);
    last = r.lit;
  }
}

console.log('drawn / lit / painted-yellow, at each change of state:');
for (const r of seen) {
  console.log(`  drawn ${r.drawn.toFixed(3)}  lit ${r.lit}  painted ${r.painted}  sectionTop ${r.top}`);
}
const end = rows[rows.length - 1];
console.log(`\nfinal      drawn ${end.drawn.toFixed(3)}  lit ${end.lit}  painted ${end.painted}`);
console.log(half ? `half frame drawn ${half.drawn.toFixed(3)}  lit ${half.lit}  -> ${OUT}/route-half-drawn.png` : 'half frame NOT captured');

/* Monotonic: a stop that lit must never go dark again. */
let mono = true;
for (let i = 1; i < rows.length; i += 1) if (rows[i].lit < rows[i - 1].lit) mono = false;
console.log(`lit is monotonic under a real scroll: ${mono ? 'yes' : 'NO'}`);
/* THE COLOUR IS COMPARED AFTER A SETTLE, and the reason is worth keeping: a
   numeral's colour transitions over `--d-drop` (250ms), and this harness
   samples 55ms after each wheel step. Reading `getComputedStyle().color` mid
   transition returns an INTERPOLATED value, not the target, so the painted
   count trails the lit count by one for the whole walk and looks like an
   off-by-one in the component. It is the transition in flight. Settle, then
   compare. */
await new Promise((r) => setTimeout(r, 600));
const settled = await read();
console.log(`after a settle: lit ${settled.lit}  painted ${settled.painted}  -> ${settled.lit === settled.painted ? 'match' : 'MISMATCH'}`);

await b.close();

/* spotdivisor.mjs — the hero headline's divisor, derived from the spot's lines.

   DESIGN.md derives the display size from the STRING against the measure.
   With one line per shot there are four strings, and each is set on two lines,
   so what binds a line is the wider half of its best two-line split. The
   binding line is the widest of those four, and the divisor is that over 0.98,
   the recorded 2% of slack.

   It checks itself first: THE FINISHED THING must measure 5.944em, the figure
   recorded while it was the rotating headline. A face that has not loaded, or
   a fallback, fails that check before it can produce a divisor.

   Usage, with any server rendering the home page:

     node .measure/spotdivisor.mjs http://localhost:4179/
*/
import puppeteer from 'puppeteer';
import { LINES } from '../src/components/home/heroSpot.js';

const URL = process.argv[2] || 'http://localhost:4179/';
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
await p.goto(URL, { waitUntil: 'networkidle0' });
await p.evaluate(() => document.fonts.ready);

const out = await p.evaluate((LINES) => {
  const h1 = document.querySelector('.hero__headline');
  const cs = getComputedStyle(h1);
  const c = document.createElement('canvas').getContext('2d');
  c.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;
  const em = (s) => c.measureText(s.toUpperCase()).width / 100;
  return {
    check: em('The finished thing'),
    rows: LINES.map((line) => {
      const w = line.split(' ');
      let best = { em: Infinity };
      for (let k = 1; k < w.length; k++) {
        const a = w.slice(0, k).join(' ');
        const z = w.slice(k).join(' ');
        const m = Math.max(em(a), em(z));
        if (m < best.em) best = { em: m, a, z };
      }
      return { line, ...best };
    }),
  };
}, LINES);
await b.close();

if (Math.abs(out.check - 5.944) > 0.01) {
  console.error(`THE FINISHED THING measured ${out.check.toFixed(3)}em, not 5.944: the face is not Monigue.`);
  process.exit(1);
}
let bind = 0;
for (const r of out.rows) {
  bind = Math.max(bind, r.em);
  console.log(`  ${r.em.toFixed(3)}em  ${r.a.toUpperCase()} / ${r.z.toUpperCase()}`);
}
console.log(`binding ${bind.toFixed(3)}em, divisor ${(bind / 0.98).toFixed(3)}`);

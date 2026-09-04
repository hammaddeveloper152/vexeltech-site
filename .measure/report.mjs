import fs from 'node:fs';
import { FRAMES } from './lib.mjs';

const W = Number(process.argv[2]);
const d = JSON.parse(fs.readFileSync(`.measure/sweep-${W}.json`, 'utf8'));
const H = d.H;
const NOISE = 12; // a dozen stray pixels is not a carrier in frame

console.log(`\n########  ${d.W} x ${H}   doc ${d.doc}px   ${d.results.length} positions, ${Math.round(d.doc / (d.results.length - 1))}px apart  ########`);

/* ---- 1. the seam walk: where do two carriers share one frame? ---------- */
console.log('\n--- SEAMS: positions where two or more carriers are in one frame ---');
const runs = [];
let cur = null;
for (const r of d.results) {
  const live = Object.entries(r.counts).filter(([, n]) => n > NOISE).map(([k, n]) => `${k} ${n}px`);
  if (live.length >= 2) {
    const key = live.map((s) => s.split(' ')[0]).join(' + ');
    if (cur && cur.key === key) { cur.to = r.y; cur.samples.push(live); }
    else { if (cur) runs.push(cur); cur = { key, from: r.y, to: r.y, samples: [live] }; }
  } else if (cur) { runs.push(cur); cur = null; }
}
if (cur) runs.push(cur);
if (!runs.length) console.log('  none.');
for (const r of runs) {
  console.log(`  scrollY ${r.from}..${r.to}  ${r.key}`);
  console.log(`     worst: ${r.samples[Math.floor(r.samples.length / 2)].join(' | ')}`);
}

/* The carrier areas are NOT reported here, deliberately.

   This script reads a fixed-step sweep, and a fixed-step sweep cannot find the
   position where a section is fully populated: a section six pixels shorter
   than the viewport is fully in view for six pixels of scroll and any usable
   step walks straight over it. An earlier version of this file did report
   areas from this data and produced 9.81% for the hero and 11.55% for the
   failures section — the degenerate reading, both off by more than double.

   BUILD-LAW records the window and says to compute the qualifying range and go
   to it. `window.mjs` does that. Use it for every number that gets written
   down; this script is for seams only. */

/* ---- 3. the wordmark, exempt, for the record -------------------------- */
const wmMax = Math.max(...d.results.map((r) => r.wmPx));
console.log(`\n  wordmark (exempt)  worst ${wmMax}px = ${(100 * wmMax / (d.W * H)).toFixed(3)}% of the viewport`);

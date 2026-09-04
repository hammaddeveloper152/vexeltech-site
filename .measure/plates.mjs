import { open } from './lib.mjs';

/* The work plates' painted geometry, measured rather than quoted.

   Both documents carry a plate list whose ratio LABELS and pixel numbers
   disagree with each other, so neither is usable as a source for an asset
   spec. This reads the boxes off the page at every breakpoint the grid has. */
const WIDTHS = [[390, 844], [768, 1024], [1024, 768], [1280, 800], [1600, 900]];

const rows = {};
for (const [W, H] of WIDTHS) {
  const { browser, page } = await open(W, H);
  const g = await page.evaluate(() => {
    document.querySelector('.work').scrollIntoView();
    return Array.from(document.querySelectorAll('.work__link')).map((el, i) => {
      const r = el.getBoundingClientRect();
      const item = el.closest('.work__item');
      return {
        n: i + 1,
        w: Math.round(r.width),
        h: Math.round(r.height),
        ar: +(r.width / r.height).toFixed(4),
        declared: getComputedStyle(item).getPropertyValue('--ar').trim(),
      };
    });
  });
  rows[W] = g;
  console.log(`\n=== ${W} ===`);
  for (const p of g) console.log(`  plate ${p.n}  ${String(p.w).padStart(4)} x ${String(p.h).padStart(4)}  ar ${p.ar}  declared ${p.declared}`);
  await browser.close();
}

console.log('\n=== widest painted width per plate, across every breakpoint ===');
for (let n = 1; n <= 6; n += 1) {
  const all = WIDTHS.map(([W]) => ({ W, p: rows[W][n - 1] })).filter((x) => x.p);
  const widest = all.reduce((a, b) => (b.p.w > a.p.w ? b : a));
  const ars = [...new Set(all.map((x) => x.p.ar))];
  console.log(
    `  plate ${n}  widest ${widest.p.w}px at viewport ${widest.W}  ` +
    `ratios in play ${ars.join(', ')}  (min ${Math.min(...ars)}, max ${Math.max(...ars)})`
  );
}

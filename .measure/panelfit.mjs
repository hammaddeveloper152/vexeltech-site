/* panelfit.mjs — the pricing panel wraps its ladder, 2026-09-21.

   For every tab at 1280, 768 and 390: the yellow panel's height must be its
   padding, the tab row, the 32px gap and the tallest card in the checked tab,
   and nothing else; and no card may overflow its own box or the panel's
   content box.

     node .measure/panelfit.mjs <base> */
import puppeteer from 'puppeteer';
const base = process.argv[2] || 'http://localhost:4173';
const b = await puppeteer.launch({ headless: 'new' });
let bad = 0;
for (const w of [1280, 768, 390]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: 900 });
  await p.goto(base + '/pricing', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  for (const tab of ['branding', 'websites', 'marketing', 'automation']) {
    await p.evaluate((t) => document.getElementById(`tab-${t}`).click(), tab);
    await new Promise((r) => setTimeout(r, 700));
    const m = await p.evaluate((t) => {
      const panel = document.querySelector('.tabs');
      const cs = getComputedStyle(panel);
      const pt = parseFloat(cs.paddingTop), pb = parseFloat(cs.paddingBottom);
      const pl = parseFloat(cs.paddingLeft), pr = parseFloat(cs.paddingRight);
      const P = panel.getBoundingClientRect();
      const row = document.querySelector('.tabs__row').getBoundingClientRect();
      const cards = [...document.querySelectorAll(`.tabs__panel[data-tab="${t}"] .card`)];
      const rects = cards.map((c) => c.getBoundingClientRect());
      const top = Math.min(...rects.map((r) => r.top));
      const tallest = Math.max(...rects.map((r) => r.bottom)) - top;
      const gap = top - row.bottom;
      const expected = pt + row.height + gap + tallest + pb;
      const overflow = cards
        .map((c, i) => ({ i, over: c.scrollHeight - c.clientHeight, right: rects[i].right - (P.right - pr), left: P.left + pl - rects[i].left }))
        .filter((o) => o.over > 1 || o.right > 1 || o.left > 1);
      return { h: P.height, expected, excess: P.height - expected, gap, pt, pb, n: cards.length, overflow };
    }, tab);
    const ok = Math.abs(m.excess) <= 1 && Math.abs(m.gap - 32) <= 1 && !m.overflow.length;
    if (!ok) bad++;
    console.log(`${w} ${tab.padEnd(10)} panel ${m.h.toFixed(0)} = pad ${m.pt}+${m.pb} + row + gap ${m.gap.toFixed(0)} + tallest; excess ${m.excess.toFixed(1)}px; ${m.n} cards; overflow ${m.overflow.length ? JSON.stringify(m.overflow) : 'none'} ${ok ? 'OK' : 'FAIL'}`);
  }
  await p.close();
}
await b.close();
console.log(bad ? `${bad} failing` : 'all pass');

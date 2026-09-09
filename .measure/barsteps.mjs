/* What the bar's call measures at each candidate type step, with the REAL
   labels, against the budget the real navigation leaves it. Re-runs the
   table recorded in Header.css, which was derived with placeholder labels
   and a different call string. */
import puppeteer from 'puppeteer';

const URL = process.env.URL || 'http://localhost:5173/hero-preview.html';
const STEPS = [
  ['label  12/16', '--t-label-size', '--t-label-line'],
  ['small  14/20', '--t-small-size', '--t-small-line'],
  ['body   18/28', '--t-body-size', '--t-body-line'],
  ['h3     27/32', '--t-h3-size', '--t-h3-line'],
  ['h2     40/44', '--t-h2-size', '--t-h2-line'],
];

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

for (const W of [1024, 1280]) {
  await page.setViewport({ width: W, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 300));

  const rows = await page.evaluate((steps) => {
    const px = (v) => Math.round(v * 100) / 100;
    const inner = document.querySelector('.bar__inner');
    const cs = getComputedStyle(inner);
    const cta = document.querySelector('.bar__cta');
    const brand = document.querySelector('.bar__brand');
    const nav = document.querySelector('.bar__nav');
    const box = inner.getBoundingClientRect();
    const gap = parseFloat(cs.columnGap || cs.gap);
    const contentBox = px(box.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight));
    const budget = px(contentBox - brand.getBoundingClientRect().width - nav.getBoundingClientRect().width - gap * 2);

    const original = { size: cta.style.fontSize, line: cta.style.lineHeight };
    const out = [];
    for (const [name, sv, lv] of steps) {
      cta.style.fontSize = `var(${sv})`;
      cta.style.lineHeight = `var(${lv})`;
      const w = px(cta.getBoundingClientRect().width);
      out.push({ step: name, call: w, over: px(w - budget) });
    }
    cta.style.fontSize = original.size;
    cta.style.lineHeight = original.line;
    return { budget, label: cta.textContent.trim(), rows: out };
  }, STEPS);

  console.log(`\n=== ${W} ===  call label ${JSON.stringify(rows.label)}   budget ${rows.budget}px`);
  for (const r of rows.rows) {
    const verdict = r.over > 0 ? `${r.over} OVER` : `${-r.over} under`;
    console.log(`  ${r.step}   call ${String(r.call).padStart(7)}px   ${verdict}`);
  }
}
await browser.close();

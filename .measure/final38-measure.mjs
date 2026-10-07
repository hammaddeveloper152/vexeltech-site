/* final38-measure.mjs (2026-10-08, the founder): The Next Size's three
   step heights at 1024, 1280 and 1440 (they must rise), and every heading
   the audience sweep changed, at 390: its line count and whether a word
   overflows its box.
     node .measure/final38-measure.mjs [base]   (default http://localhost:4190) */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const b = await puppeteer.launch({ headless: 'new' });
const open = async (route, w) => {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: 844 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  return p;
};
for (const w of [1024, 1280, 1440]) {
  const p = await open('/about-us', w);
  const h = await p.evaluate(() => [...document.querySelectorAll('.ns__step')].map((e) => Math.round(e.getBoundingClientRect().height)));
  console.log(`steps @${w}: ${h.join(' / ')}  ${h[0] < h[1] && h[1] < h[2] ? 'rising' : 'NOT RISING'}`);
  await p.close();
}
const CHANGED = {
  '/': ['h1'],
  '/services': ['h1', '.svc2__name'],
  '/about-us': ['h1', '#ab-problem'],
  '/pricing': ['.faq__q-t'],
};
for (const w of [390, 430]) {
  for (const [route, sels] of Object.entries(CHANGED)) {
    const p = await open(route, w);
    const rows = await p.evaluate((sels) => {
      const out = [];
      for (const sel of sels) {
        for (const e of document.querySelectorAll(sel)) {
          if (!e.getBoundingClientRect().height) continue;
          const lh = parseFloat(getComputedStyle(e).lineHeight);
          const lines = Math.round(e.getBoundingClientRect().height / lh);
          const over = e.scrollWidth > e.clientWidth + 1;
          out.push(`${lines} line${lines > 1 ? 's' : ''}${over ? ' OVERFLOW' : ''}${lines > 3 ? ' OVER THREE' : ''}  ${getComputedStyle(e).fontSize}  "${e.textContent.trim().slice(0, 70)}"`);
        }
      }
      return out;
    }, sels);
    console.log(`== ${route} @${w}`);
    rows.forEach((r) => console.log(`   ${r}`));
    await p.close();
  }
}
await b.close();

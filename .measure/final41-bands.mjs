/* final41-bands.mjs (FINAL41 part 3, 2026-10-08, the founder): the four
   /services discipline bands' heights at 1280 and 390, in px and in
   screens, and the header rows' columns at 1280.
     node .measure/final41-bands.mjs [base]   (default http://localhost:4190) */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const b = await puppeteer.launch({ headless: 'new' });
for (const [w, h] of [[1280, 800], [390, 844]]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + '/services', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate((h) => {
    const bands = [...document.querySelectorAll('section.svc2__d')].map((s) => {
      const hh = s.getBoundingClientRect().height;
      return `${s.id} ${Math.round(hh)}px (${(hh / h).toFixed(2)} screens)`;
    });
    const heads = [...document.querySelectorAll('.bh')].map((e) => {
      const l = e.querySelector('.bh__l').getBoundingClientRect();
      const r = e.querySelector('.bh__r').getBoundingClientRect();
      const st = e.querySelector('.bh__head').getBoundingClientRect();
      return `${e.closest('section').id}: left ${Math.round(l.left)} to ${Math.round(l.right)}, right from ${Math.round(r.left)} (${Math.round(r.width)} wide), statement top ${Math.round(st.top + scrollY)}, paragraph top ${Math.round(e.querySelector('.bh__p').getBoundingClientRect().top + scrollY)}, row ${Math.round(e.getBoundingClientRect().height)}px`;
    });
    return { bands, heads };
  }, h);
  console.log(`== @${w}`);
  r.bands.forEach((x) => console.log(`   ${x}`));
  r.heads.forEach((x) => console.log(`   ${x}`));
  await p.close();
}
await b.close();

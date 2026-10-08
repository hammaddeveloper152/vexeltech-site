/* final43-nextsize.mjs (FINAL43, the founder): About's The Next Size, the
   gap from the lead's last line (its box's foot) to the caption's top, at
   1024, 1280, 1440 and 390.
     node .measure/final43-nextsize.mjs [base]   (default 4190) */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const b = await puppeteer.launch({ headless: 'new' });
for (const w of [1024, 1280, 1440, 390]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: 900 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + '/about-us', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const g = await p.evaluate(() => {
    const lead = document.querySelector('.ns__text .ab__lead').getBoundingClientRect();
    const cap = document.querySelector('.ns__cap').getBoundingClientRect();
    const steps = document.querySelector('.ns__steps').getBoundingClientRect();
    return { gap: Math.round(cap.top - lead.bottom), capBelowSteps: cap.top >= steps.bottom - 1 };
  });
  console.log(`@${w} lead to caption ${g.gap}px${g.capBelowSteps ? ' (caption under the steps)' : ''}`);
  await p.close();
}
await b.close();

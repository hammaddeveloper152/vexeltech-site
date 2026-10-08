/* final41-inview.mjs (FINAL41 part 4, the founder): rule 3 of the entrance.
   An artifact already in view at first paint stays complete and never
   plays: /services#marketing (the mosaic, by deep link) and
   /services#automation (the thread); About at 1280 x 2400, where the four
   lines and the staircase stand in the first screen. Each is watched for
   4s: any `data-leaving`, any start state, any fall in what it shows, is a
   FAIL. And with JavaScript off, every artifact is complete.
     node .measure/final41-inview.mjs [base]   (default http://localhost:4190) */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
let fail = 0;
const CASES = [
  ['/services#marketing', 1280, 800, '[data-artifact="MarketingMosaic"] .mm__stage', '.mm__tile'],
  ['/services#automation', 1280, 800, '[data-artifact="AssistantThread"] .at__stage', '.at__item'],
  ['/about-us', 1280, 2600, '.hold', '.hold__l'],
  ['/about-us', 1280, 2600, '.ns__steps', '.ns__step'],
];
for (const [route, w, h, sel, parts] of CASES) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: 'center' }), sel).catch(() => {});
  const seen = new Set();
  for (let i = 0; i < 40; i += 1) {
    seen.add(
      await p.evaluate(
        (sel, parts) => {
          const el = document.querySelector(sel);
          const shown = [...el.querySelectorAll(parts)].filter((e) => Number(getComputedStyle(e).opacity) > 0.9).length;
          return `${el.getAttribute('data-leaving') ? 'soft' : 'full'} ${el.getAttribute('data-play') || ''} ${shown}/${el.querySelectorAll(parts).length}`;
        },
        sel,
        parts
      )
    );
    await wait(100);
  }
  const states = [...seen];
  const ok = states.length === 1 && states[0].startsWith('full') && !/armed|play/.test(states[0]);
  if (!ok) fail += 1;
  console.log(`${route} ${sel.split(' ').pop()}: ${states.join(' | ')}  ${ok ? 'PASS, complete and still' : 'FAIL'}`);
  await p.close();
}
{
  const p = await b.newPage();
  await p.setJavaScriptEnabled(false);
  await p.setViewport({ width: 1280, height: 800 });
  for (const route of ['/', '/services', '/about-us']) {
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    const r = await p.evaluate(() => ({
      leaving: document.querySelectorAll('[data-leaving]').length,
      armed: document.querySelectorAll('[data-play="armed"]').length,
      wwd: [...document.querySelectorAll('.wwd__rest')].map((e) => e.textContent.length).reduce((a, x) => a + x, 0),
    }));
    const ok = !r.leaving && !r.armed && r.wwd === 0;
    if (!ok) fail += 1;
    console.log(`no JavaScript ${route}: ${JSON.stringify(r)} ${ok ? 'PASS, complete' : 'FAIL'}`);
  }
  await p.close();
}
await b.close();
process.exit(fail ? 1 : 0);

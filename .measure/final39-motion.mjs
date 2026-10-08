/* final39-motion.mjs: rest full, start soft, PLAY ONCE (final39,
   2026-10-08, the founder). For each artifact on /services (the mosaic, the
   thread, the branding desk): with motion allowed, scroll it into view and
   count its plays (each play ends its 400ms crossfade by taking off the
   data-leaving its start state set, FINAL41 part 4), wait, scroll it out and back in twice, and count again:
   one play in all is a pass. Also writes the mosaic entering view and
   resting as six frames a second apart, mosaic-rest-01..06.png.
     node .measure/final39-motion.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final39');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
let fail = 0;
for (const name of ['MarketingMosaic', 'AssistantThread', 'BrandDesk']) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  await p.goto(BASE + '/services', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: '.bar, .skip { visibility: hidden !important; }' });
  /* A play, since FINAL41 part 4: the soft start's crossfade ends (the
     `data-leaving` the start state set at load comes off). A replay would
     have to put it back and take it off again. */
  await p.evaluate((name) => {
    window.__plays = 0;
    const el = document.querySelector(`[data-artifact="${name}"]`);
    new MutationObserver((ms) => {
      for (const m of ms) if (m.attributeName === 'data-leaving' && m.oldValue === 'true' && !m.target.getAttribute('data-leaving')) window.__plays += 1;
    }).observe(el, { attributes: true, attributeOldValue: true, subtree: true, attributeFilter: ['data-leaving'] });
  }, name);
  const into = () => p.evaluate((name) => document.querySelector(`[data-artifact="${name}"]`).scrollIntoView({ block: 'center' }), name);
  const away = () => p.evaluate(() => window.scrollTo(0, 0));
  await into();
  if (name === 'MarketingMosaic') {
    for (let i = 1; i <= 6; i += 1) {
      await p.screenshot({ path: path.join(OUT, `mosaic-rest-0${i}.png`) });
      await wait(1000);
    }
  } else {
    await wait(7000);
  }
  const first = await p.evaluate(() => window.__plays);
  for (let k = 0; k < 2; k += 1) {
    await away();
    await wait(800);
    await into();
    await wait(2500);
  }
  const all = await p.evaluate(() => window.__plays);
  const ok = first === 1 && all === 1;
  if (!ok) fail += 1;
  console.log(`${name}: ${first} play on entry, ${all} after two returns  ${ok ? 'PASS' : 'FAIL'}`);
  await p.close();
}
await b.close();
process.exit(fail ? 1 : 0);

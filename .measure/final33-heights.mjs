/* final33-heights.mjs: the mobile sizing pass (final33, 2026-10-07, the
   founder). Every section's height on each route at a phone width, as a
   fraction of an 844px screen, and the tall things inside them: each
   artifact, each card, each tile. Flags anything over 0.70 of the screen
   that is not the hero film or a Recent work screenshot.

     node .measure/final33-heights.mjs [base] [width] [tag]
       defaults: http://localhost:4190  390  before
   Writes .measure/out/final33/heights-<tag>-<width>.json too. */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const W = Number(process.argv[3] || 390);
const TAG = process.argv[4] || 'before';
const H = 844;
const OUT = path.join('.measure', 'out', 'final33');
fs.mkdirSync(OUT, { recursive: true });
const ROUTES = ['/', '/services', '/pricing', '/about-us'];
const PARTS = [
  '.wwd__card', '.cc__cell', '.wa__panel', '.pb-steps', '[data-artifact]', '.mm__tile', '.mm__mosaic',
  '.at__thread', '.at__plan', '.at__tape', '.at__chips', '.svc2__facts', '.pr-col', '.pr-bundle',
  '.faq__item', '.tc__sheet', '.os__beat', '.sf__mark', '.dp', '.bd__stage',
];
const b = await puppeteer.launch({ headless: 'new' });
const all = {};
for (const route of ROUTES) {
  const p = await b.newPage();
  await p.setViewport({ width: W, height: H });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 300));
  all[route] = await p.evaluate(
    (H, PARTS) => {
      const name = (e) =>
        e.querySelector('h1, h2')?.textContent.trim().slice(0, 34) ||
        `${e.tagName.toLowerCase()}.${String(e.className).split(' ').slice(0, 2).join('.')}`;
      const secs = [...document.querySelectorAll('main > section, main > header, main > div > section, main > div:not(:has(section)), body > footer, #root > footer, footer.sf')];
      const seen = new Set();
      const sections = secs
        .filter((e) => !seen.has(e) && seen.add(e))
        .map((e) => ({ name: name(e), h: Math.round(e.getBoundingClientRect().height), screens: +(e.getBoundingClientRect().height / H).toFixed(2) }));
      const parts = [];
      for (const sel of PARTS) {
        document.querySelectorAll(sel).forEach((e, i) => {
          const hh = e.getBoundingClientRect().height;
          if (!hh) return;
          const id = sel === '[data-artifact]' ? e.dataset.artifact : `${sel}${document.querySelectorAll(sel).length > 1 ? ` #${i + 1}` : ''}`;
          parts.push({ part: id, h: Math.round(hh), screens: +(hh / H).toFixed(2) });
        });
      }
      return { docScreens: +(document.documentElement.scrollHeight / H).toFixed(1), sections, parts };
    },
    H,
    PARTS
  );
  await p.close();
}
await b.close();
fs.writeFileSync(path.join(OUT, `heights-${TAG}-${W}.json`), JSON.stringify(all, null, 1));
const EXEMPT = /hero|Recent work|WorkAccordion|wa__panel/;
for (const [route, r] of Object.entries(all)) {
  console.log(`\n== ${route} @${W}: ${r.docScreens} screens in all`);
  for (const s of r.sections) console.log(`  ${s.screens.toFixed(2).padStart(5)}  ${s.name}`);
  const over = r.parts.filter((x) => x.screens > 0.7 && !EXEMPT.test(x.part));
  if (over.length) console.log('  over 0.70:', over.map((x) => `${x.part} ${x.screens}`).join(', '));
}

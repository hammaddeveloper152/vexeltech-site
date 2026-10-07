/* final30-shots.mjs: the captures for the founder's final30 build
   (2026-10-07). Writes to .measure/out/final30:
     marketing-1280.png, marketing-390.png     the mosaic, at rest
     automation-1280.png, automation-390.png   the thread, at rest
     marketing-1280-play.png                   the mosaic mid-play (Wed lit)
     automation-1280-play.png                  the thread mid-play
     home-joins-1280.png                       a section with its rule mid-draw
   and prints each rule's width at rest and drawn. home-390 contact sheet:
   anchors.mjs (contact-home-390.png, copied as home-390.png).

     node .measure/final30-shots.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final30');
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new' });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(route, w, reduce = true) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }]);
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: '.bar{display:none!important}' });
  return p;
}
async function shoot(p, sel, file, pad = 40) {
  const box = await p.$eval(
    sel,
    (n, pad) => {
      const r = n.getBoundingClientRect();
      return { x: 0, y: Math.max(0, r.top + scrollY - pad), width: document.documentElement.clientWidth, height: r.height + 2 * pad };
    },
    pad
  );
  await p.screenshot({ path: path.join(OUT, file), clip: box, captureBeyondViewport: true });
}

for (const w of [1280, 390]) {
  const p = await open('/services', w);
  await shoot(p, '.mm', `marketing-${w}.png`);
  await shoot(p, '#automation', `automation-${w}.png`, 0);
  await p.close();
}

/* Mid-play: motion on, the stage half in view, into the play. */
for (const [sel, file, into] of [
  ['.mm__stage', 'marketing-1280-play.png', 400 + 1900],
  ['.at__stage', 'automation-1280-play.png', 400 + 2600],
]) {
  const p = await open('/services', 1280, false);
  await p.$eval(sel, (n) => window.scrollTo(0, n.getBoundingClientRect().top + scrollY - 60));
  await wait(into);
  await shoot(p, sel, file, 20);
  await p.close();
}

/* The joins. */
{
  const p = await open('/', 1280, false);
  const rest = await p.$$eval('.join', (js) => js.map((j) => getComputedStyle(j).clipPath));
  await p.$eval('.cc', (n) => window.scrollTo(0, n.getBoundingClientRect().top + scrollY - 300));
  await wait(260);
  await shoot(p, '.cc .join', 'home-joins-1280.png', 120);
  await wait(900);
  const drawn = await p.$$eval('.join', (js) => js.map((j) => `${j.closest('section').className.split(' ').slice(1, 3).join('.')} ${j.dataset.drawn} ${Math.round(j.getBoundingClientRect().width)}px`));
  console.log('joins at rest:', JSON.stringify(rest), '\nafter scrolling to the cost row:', JSON.stringify(drawn));
  await p.close();
}
await b.close();

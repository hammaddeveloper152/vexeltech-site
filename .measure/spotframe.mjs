/* spotframe.mjs — one held frame of the hero spot, captured as it ships.

   `spotwalk.mjs shots` recounts the footage's yellow on every frame before it
   captures anything, which is twenty minutes for a screenshot. This holds one
   frame and takes it, at both widths, with the copy shown and the plate's own
   value — nothing injected — so what it shows is the shipped page.

   Written to check shot 3 after its blur, and general: pass any frame.

     node .measure/spotframe.mjs 189          frame 189 at 1280x800 and 390x844
*/
import puppeteer from 'puppeteer';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { FPS } from '../src/components/home/heroSpot.js';

const FRAME = Number(process.argv[2] || 189);
const URL = process.argv[3] || 'http://localhost:4179/';
const OUT = join(process.cwd(), '.measure', 'out', 'spot');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(OUT, { recursive: true });

for (const [w, h] of [[1280, 800], [390, 844]]) {
  /* one browser per width, so the page is never a background tab */
  const b = await puppeteer.launch({ headless: 'new',
    args: ['--force-color-profile=srgb', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await p.goto(URL, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const info = await p.evaluate(async (t) => {
    const v = document.querySelector('video.hero__spot');
    if (!v) return { mode: document.querySelector('.hero').dataset.mode };
    if (v.readyState < 2) {
      const ok = await new Promise((r) => { const tm = setTimeout(() => r(false), 15000); v.addEventListener('loadeddata', () => { clearTimeout(tm); r(true); }, { once: true }); });
      if (!ok) return { mode: 'spot', error: 'loadeddata never fired' };
    }
    v.pause();
    const sought = await new Promise((r) => { const tm = setTimeout(() => r(false), 10000); v.addEventListener('seeked', () => { clearTimeout(tm); r(true); }, { once: true }); v.currentTime = t; });
    return { mode: document.querySelector('.hero').dataset.mode, src: v.currentSrc.split('/').pop(), sought };
  }, (FRAME + 0.5) / FPS);
  if (info.mode !== 'spot' || info.error || !info.sought) {
    console.log(`${w}: could not hold frame ${FRAME}: ${JSON.stringify(info)}`);
    await b.close();
    continue;
  }
  /* long enough for the line's fade-up to finish */
  await wait(900);
  const file = join(OUT, `frame-${FRAME}-${w}.png`);
  writeFileSync(file, await p.screenshot({ type: 'png' }));
  console.log(`${w}: ${info.src} frame ${FRAME} -> ${file}`);
  await b.close();
}

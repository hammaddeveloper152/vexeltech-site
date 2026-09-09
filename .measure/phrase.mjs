/* Does the rotating phrase fit under the 5% ceiling in machine yellow?

   The recorded rejection said 5 to 6% of the 1280 frame, and it was measured
   when the hero was a different composition. The phrase, the size and the
   layout have all moved since, so it is measured again rather than quoted.

   Method is the recorded one: painted colour, coverage a >= 0.5 against the
   ground-to-accent line, residual <= 32. Denominator per BUILD-LAW: the
   carrying section's area INSIDE ONE VIEWPORT at the position where the
   section is fully populated. The hero is 100svh minus the bar, so it is
   shorter than the viewport and its own area is the denominator. */
import { PNG } from 'pngjs';
import puppeteer from 'puppeteer';
import { isAccent } from './lib.mjs';

const b = await puppeteer.launch({ headless: 'new', args: ['--font-render-hinting=none'] });

for (const W of [1280, 390]) {
  const H = W === 1280 ? 800 : 844;
  const p = await b.newPage();
  await p.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 3000));

  for (const mode of ['as built', 'phrase yellow, call yellow', 'phrase yellow, call white']) {
    const geo = await p.evaluate((m) => {
      const hero = document.querySelector('.hero');
      const words = [...document.querySelectorAll('.ticker__word')];
      const call = document.querySelector('.hero__cta');
      /* `.ticker__word` sets `color: var(--c-shop-white)` itself, so the
         override has to land on the word rather than on the track. */
      words.forEach((w) => {
        w.style.color = m === 'as built' ? '' : 'var(--c-accent-text-dark)';
      });
      if (m === 'phrase yellow, call white') {
        call.style.background = 'var(--c-shop-white)';
        call.style.borderColor = 'var(--c-shop-white)';
      } else {
        call.style.background = '';
        call.style.borderColor = '';
      }
      const r = hero.getBoundingClientRect();
      return { top: Math.max(0, Math.round(r.top)), bottom: Math.round(Math.min(r.bottom, innerHeight)), area: 0 };
    }, mode);

    await new Promise((r) => setTimeout(r, 300));
    const buf = await p.screenshot({ clip: { x: 0, y: geo.top, width: W, height: geo.bottom - geo.top } });
    const png = PNG.sync.read(buf);
    let hit = 0;
    for (let i = 0; i < png.data.length; i += 4) {
      if (isAccent(png.data[i], png.data[i + 1], png.data[i + 2])) hit += 1;
    }
    const total = png.width * png.height;
    console.log(
      `${W}  ${mode.padEnd(28)} accent ${String(hit).padStart(7)} px of ${total}  = ` +
        `${((hit / total) * 100).toFixed(2)}%  ${(hit / total) > 0.05 ? 'OVER the 5% ceiling' : 'under'}`
    );
  }
  await p.close();
}
await b.close();

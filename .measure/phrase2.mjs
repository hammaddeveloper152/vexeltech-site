import { PNG } from 'pngjs';
import puppeteer from 'puppeteer';
import { isAccent } from './lib.mjs';
const PHRASES = ['whole system', 'working site', 'real build', 'finished thing'];
const b = await puppeteer.launch({ headless: 'new', args: ['--font-render-hinting=none'] });
for (const W of [1280]) {
  const H = 800;
  const p = await b.newPage();
  await p.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 3000));
  console.log(`\n=== ${W}, phrase in machine yellow, CALL GIVES UP THE YELLOW (shop white) ===`);
  for (let i = 0; i < PHRASES.length; i += 1) {
    const geo = await p.evaluate((idx) => {
      const call = document.querySelector('.hero__cta');
      call.style.background = 'var(--c-shop-white)';
      call.style.borderColor = 'var(--c-shop-white)';
      call.style.color = 'var(--c-asphalt)';
      document.querySelector('.ticker__track').style.setProperty('--i', idx);
      document.querySelector('.ticker__track').style.transition = 'none';
      [...document.querySelectorAll('.ticker__word')].forEach((w) => {
        w.style.color = 'var(--c-accent-text-dark)';
      });
      const r = document.querySelector('.hero').getBoundingClientRect();
      return { top: Math.max(0, Math.round(r.top)), bottom: Math.round(Math.min(r.bottom, innerHeight)) };
    }, i);
    await new Promise((r) => setTimeout(r, 400));
    const buf = await p.screenshot({ clip: { x: 0, y: geo.top, width: W, height: geo.bottom - geo.top } });
    const png = PNG.sync.read(buf);
    let hit = 0;
    for (let k = 0; k < png.data.length; k += 4) {
      if (isAccent(png.data[k], png.data[k + 1], png.data[k + 2])) hit += 1;
    }
    const total = png.width * png.height;
    const pct = (hit / total) * 100;
    const need = total * 0.05;
    console.log(
      `  ${PHRASES[i].padEnd(16)} ${String(hit).padStart(6)} px  ${pct.toFixed(2)}%  ` +
        `${pct > 5 ? `OVER by ${(hit - need).toFixed(0)}px (${(pct - 5).toFixed(2)} points)` : 'under'}`
    );
  }
  await p.close();
}
await b.close();

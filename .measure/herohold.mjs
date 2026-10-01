/* herohold.mjs: the hero's first cut held, 2026-10-01 (the founder's
   bundle split). Samples the h1 and the film's clock every 100ms for 15s on
   a fresh load and prints each change: line 1 should hold across cut 1
   (1.875s) on the first pass and give way to line 3 at cut 2 (6.042s); line
   2 first shows at cut 1 of the second pass.

   Usage: node .measure/herohold.mjs [base] [width] */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const W = Number(process.argv[3] || 1280);
const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage();
await p.setViewport({ width: W, height: W < 1024 ? 844 : 800 });
await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
const log = await p.evaluate(
  () =>
    new Promise((resolve) => {
      const out = [];
      let last = null;
      const t0 = performance.now();
      const id = setInterval(() => {
        const h = document.querySelector('#hero-h');
        const v = document.querySelector('.hero__spot');
        const text = h ? h.textContent.trim() : '';
        if (text !== last) {
          out.push(`page ${Math.round(performance.now())}ms  film ${v && v.currentTime != null ? v.currentTime.toFixed(2) : '-'}s  "${text}"`);
          last = text;
        }
        if (performance.now() - t0 > 15000) {
          clearInterval(id);
          resolve(out);
        }
      }, 100);
    })
);
console.log(log.join('\n'));
await b.close();

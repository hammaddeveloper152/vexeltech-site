/* final32-shots.mjs: the footer (final32, 2026-10-07). Writes
   .measure/out/final32/footer-1280.png and footer-390.png (the footer to
   the page's foot, at rest) and prints its measurements: the wordmark's
   size, width against the container, how much of its capitals the page's
   edge crops, the landmark, and each link's target.

     node .measure/final32-shots.mjs [base]   (default http://localhost:4190) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final32');
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new' });
for (const w of [1280, 390]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + '/services', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: '.bar,.skip{display:none!important}' });
  const m = await p.evaluate(() => {
    const f = document.querySelector('footer.sf');
    const inner = f.querySelector('.sf__in').getBoundingClientRect();
    const mark = f.querySelector('.sf__mark');
    const word = f.querySelector('.sf__mark-w');
    const range = document.createRange();
    range.selectNodeContents(word);
    const ink = range.getBoundingClientRect();
    const box = mark.getBoundingClientRect();
    const fs = parseFloat(getComputedStyle(mark).fontSize);
    const cap = 0.67 * fs;
    const capTop = ink.top + 0.15 * fs + (ink.height - fs) / 2;
    const shown = box.bottom - Math.max(capTop, box.top);
    const r = f.getBoundingClientRect();
    return {
      landmark: f.tagName.toLowerCase() + (f.closest('main') ? ' inside main' : ' after main'),
      footerTop: Math.round(r.top + scrollY),
      pageBottom: Math.round(document.documentElement.scrollHeight),
      footerBottom: Math.round(r.bottom + scrollY),
      container: Math.round(inner.width),
      markSize: Math.round(fs),
      markWidth: Math.round(word.scrollWidth),
      capsShown: `${Math.round((100 * shown) / cap)}%`,
      smallestTarget: Math.min(...[...f.querySelectorAll('a')].map((a) => Math.round(a.getBoundingClientRect().height))),
    };
  });
  console.log(`@${w}`, JSON.stringify(m));
  await p.screenshot({ path: path.join(OUT, `footer-${w}.png`), clip: { x: 0, y: m.footerTop - 40, width: w, height: m.pageBottom - m.footerTop + 40 }, captureBeyondViewport: true });
  await p.close();
}
await b.close();

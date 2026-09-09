/* Full-page stitched renders at the two widths asked for. A 100svh hero
   cannot be captured by growing the viewport, so each frame is a real
   viewport-height screenshot at a real scroll position. */
import fs from 'node:fs';
import puppeteer from 'puppeteer';

const URL = process.env.URL || 'http://localhost:5173/hero-preview.html';
const OUT = '.measure/out';
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new' });

for (const [W, H] of [[1280, 800], [390, 844]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  // let the entrance finish and every ScrollTrigger settle
  await new Promise((r) => setTimeout(r, 2500));

  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  const docH = await page.evaluate(() => document.documentElement.scrollHeight);
  const frames = Math.ceil(docH / H);
  console.log(`${W}x${H}  document ${docH}px  ${frames} frames`);

  for (let i = 0; i < frames; i += 1) {
    const y = Math.min(i * H, docH - H);
    await page.evaluate((to) => window.scrollTo(0, to), y);
    await new Promise((r) => setTimeout(r, 700));
    await page.screenshot({ path: `${OUT}/${W}-${String(i).padStart(2, '0')}.png` });
  }
  if (errors.length) console.log('  PAGE ERRORS:', errors);
  await page.close();
}
await browser.close();
console.log('done');

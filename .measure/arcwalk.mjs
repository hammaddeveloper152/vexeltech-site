/* arcwalk.mjs — the arc field rule, walked frame by frame across a band.

   node .measure/arcwalk.mjs <route> <band selector> <ceiling %> [scrim %]
   BASE=http://localhost:4180 to point it at a build (default 4179).

   carrier.mjs reads arc at ONE scroll position and calls it a field at 25% of
   an object. The rule set for the glass band on Process, 2026-09-16, is a share
   of the FRAME, and a band taller than the viewport is a different picture at
   every scroll position. So this steps through every position where the band
   fills at least half the viewport, a quarter screen at a time, and reports
   the worst frame against the ceiling.

   Arc is carrier.mjs's own test, so the two agree on what a pixel is: blue at
   least 12 points over red and above 24. `[scrim]` overrides the band's
   `--scrim` for a walk. */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const [ROUTE, SEL, CEIL = '20.5', SCRIM] = process.argv.slice(2);
const BASE = process.env.BASE || 'http://localhost:4179';
const arcish = (r, g, b) => (b - r) > 12 && b > 24;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb', '--hide-scrollbars'] });
let over = 0;
for (const [w, h] of [[1280, 900], [390, 844]]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(BASE + ROUTE, { waitUntil: 'networkidle0' });
  await p.evaluate((s) => document.querySelectorAll(s).forEach((e) => { e.dataset.near = 'true'; }), SEL);
  if (SCRIM) await p.addStyleTag({ content: `${SEL} { --scrim: ${SCRIM}% !important }` });
  const band = await p.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; }, SEL);
  let worst = { frame: 0, y: 0 };
  for (let y = Math.round(band.top - h / 2); y <= band.top + band.h - h / 2; y += Math.round(h / 4)) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await wait(350);
    const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
    let a = 0;
    for (let i = 0; i < im.data.length; i += 4) if (arcish(im.data[i], im.data[i + 1], im.data[i + 2])) a++;
    const frame = (a / (im.width * im.height)) * 100;
    if (frame > worst.frame) worst = { frame, y };
  }
  const ok = worst.frame < Number(CEIL);
  if (!ok) over++;
  console.log(`  ${w}  worst arc share ${worst.frame.toFixed(2)}% of the frame at scroll ${worst.y}` +
    `  (ceiling ${CEIL}%${SCRIM ? `, scrim ${SCRIM}%` : ''})  ${ok ? 'under' : 'OVER'}`);
  await p.close();
}
await b.close();
process.exit(over ? 1 : 0);

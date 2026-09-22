/* fullpage.mjs — one full-page frame per route, at one width.

   A naive `fullPage: true` is wrong on this build and the reason is already in
   BUILD-LAW: everything below the hero is scroll-driven. The reveals fire on
   an observer, the route's line is scrubbed by scroll position and stays
   drawn, and the counter counts up when it is reached. Capturing without
   walking the page first photographs a document whose sections are all at
   opacity 0 with a 0px route line, and every measurement of that capture
   would be correct about a state no reader sees.

   So: walk the whole document at half a viewport a step, let each step settle,
   walk back to the top, settle again, then capture. What has been drawn stays
   drawn, which is the property the route was built with.

   NOTHING IS FROZEN. The other rule this directory has learned twice is that
   seeking every animation to one time puts the page in a state no reader
   would see — it is what made the skip link paint across a Services capture.
   The page is at rest on its own after the walk, so there is nothing to
   freeze.

     node .measure/fullpage.mjs [base] [width]
*/
import fs from 'node:fs';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const W = Number(process.argv[3] || 1280);
const H = 800;
const OUT = '.measure/out/fullpage';
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  ['home', '/'],
  ['pricing', '/pricing'],
  ['about', '/about-us'],
];

const b = await puppeteer.launch({
  headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'],
});

for (const [name, route] of PAGES) {
  const p = await b.newPage();
  await p.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 900));

  /* Down, half a screen at a time, so nothing is stepped over: a section
     shorter than the viewport is only fully in view for its own height. */
  const docH = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < docH; y += H / 2) {
    await p.evaluate((t) => window.scrollTo(0, t), y);
    await new Promise((r) => setTimeout(r, 120));
  }
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await new Promise((r) => setTimeout(r, 400));
  await p.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 900));

  const file = `${OUT}/${W}-${name}.png`;
  await p.screenshot({ path: file, fullPage: true });
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  console.log(`${String(W).padEnd(5)} ${name.padEnd(9)} ${String(h).padStart(6)}px  ${file}`);
  await p.close();
}

await b.close();

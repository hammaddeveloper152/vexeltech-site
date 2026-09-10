/* bandshots.mjs — the counter band and the FAQ, at 1280.

   Both are document-space clips, so the page is never scrolled to the section
   and nothing depends on where a scroll settles. The FAQ is shot twice: at
   rest, and with the first row open, because the open row is the only lit
   object in the section and a shot of four closed rows does not show it.
*/
import puppeteer from 'puppeteer';

const W = Number(process.argv[2]) || 1280;
const OUT = '.measure/out/agency';

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb',
         '--font-render-hinting=none'] });
const p = await b.newPage();
await p.setViewport({ width: W, height: 900 });
await p.goto('http://localhost:4179/', { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 2400));
await p.evaluate(() => document.fonts.ready);

/* one walk so every reveal and every count has run */
const tot = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < tot; y += 400) {
  await p.evaluate((v) => window.scrollTo(0, v), y);
  await new Promise((r) => setTimeout(r, 80));
}
await p.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 400));

const boxOf = (sel) => p.evaluate((s) => {
  const r = document.querySelector(s).getBoundingClientRect();
  return { x: 0, y: Math.round(r.top + scrollY), width: innerWidth, height: Math.round(r.height) };
}, sel);

const shoot = async (sel, name) => {
  const clip = await boxOf(sel);
  await p.screenshot({ path: `${OUT}/${name}.png`, clip });
  console.log(`  ${name}.png  ${clip.width}x${clip.height}`);
};

await shoot('.counters', 'band-counters');
await shoot('.faq', 'band-faq');

/* open the first row. A click scrolls it into view, which is harmless here
   because every clip is document-space, but the row needs its animation to
   land before the shot. */
await p.evaluate(() => document.querySelector('.faq__btn').click());
await new Promise((r) => setTimeout(r, 700));
await shoot('.faq', 'band-faq-open');

console.log(`\nbands on this page: ${await p.evaluate(() => document.querySelectorAll('.band-marble').length)}`);
await b.close();

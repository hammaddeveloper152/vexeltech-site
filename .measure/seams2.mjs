/* seams2.mjs — a contact sheet of every section seam on the home page.

   A seam is where one section ends and the next begins. On a page where every
   section painted its own ground, a seam was a colour change and you could see
   it whether or not it meant anything. On one rig it is nothing — and that is
   the thing to check, because "nothing" is also what a broken seam looks like:
   a band of the wrong value, a hairline nobody removed, a gap that reads as a
   gap rather than as space.

   So each seam is cropped as a strip centred on the join, 220px tall, stacked
   into one sheet with the two section names above it and a tick on the join
   itself. One image, every join, in order — plus the value either side of each
   one, printed, because "the same" is a number and not an impression.
*/
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import { writeFileSync } from 'node:fs';

const W = Number(process.argv[2]) || 1280;
const STRIP = 220;
const LABEL = 34;

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb',
         '--font-render-hinting=none'] });
const p = await b.newPage();
await p.setViewport({ width: W, height: 900 });
await p.goto('http://localhost:4179/', { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 2500));

/* Walk once so every reveal and every plate has arrived. */
const tot = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < tot; y += 450) {
  await p.evaluate((v) => window.scrollTo(0, v), y);
  await new Promise((r) => setTimeout(r, 110));
}

const seams = await p.evaluate(() => {
  const secs = [...document.querySelectorAll('section')].map((e) => ({
    name: (e.className || '').toString().split(' ').filter((x) => x && x !== 'vt' && x !== 'band-concrete')[0] || e.tagName.toLowerCase(),
    top: Math.round(e.getBoundingClientRect().top + scrollY),
    bottom: Math.round(e.getBoundingClientRect().bottom + scrollY),
  }));
  const out = [];
  for (let i = 0; i < secs.length - 1; i++) {
    out.push({ a: secs[i].name, b: secs[i + 1].name, y: secs[i].bottom });
  }
  return out;
});

console.log(`${seams.length} seams at ${W}`);

/* Each strip is a document-space clip, so the page does not have to be
   scrolled to the seam and nothing depends on where it settles. */
const strips = [];
for (const s of seams) {
  const y = Math.max(0, s.y - STRIP / 2);
  const shot = await p.screenshot({ type: 'png', clip: { x: 0, y, width: W, height: STRIP } });
  strips.push({ ...s, png: PNG.sync.read(shot), b64: shot.toString('base64') });
  console.log(`  ${String(s.y).padStart(6)}  ${s.a} -> ${s.b}`);
}

/* THE SHEET IS COMPOSED IN THE BROWSER, not blitted together here.

   The first version stacked the strips with `PNG.bitblt` and left a black band
   above each one for a label it had no way to draw — there is no text
   rasteriser in this harness, so the names ended up in the console and the
   sheet was nine anonymous strips. Composing it as a page instead means the
   labels are real type in the site's own face, and the seam tick is a `<div>`
   rather than pixels poked into a buffer. */
const html = `<!doctype html><meta charset="utf-8">
<style>
  @font-face { font-family: Satoshi; src: url('/assets/satoshi-variable.woff2') format('woff2'); }
  body { margin: 0; background: #0b0c0d; font-family: Satoshi, system-ui, sans-serif; }
  figure { margin: 0; }
  figcaption {
    display: flex; align-items: baseline; gap: 12px;
    padding: 10px 16px; color: #9BA1A9; font-size: 12px;
    letter-spacing: .08em; text-transform: uppercase;
  }
  figcaption b { color: #E8EAED; font-weight: 500; }
  figcaption i { color: #5c6169; font-style: normal; margin-left: auto; }
  .strip { position: relative; display: block; width: ${W}px; height: ${STRIP}px; }
  .strip img { display: block; width: 100%; }
  .tick { position: absolute; left: 0; top: ${STRIP / 2}px; width: 40px; height: 2px; background: #F0B323; }
  .tick::after {
    content: ''; position: absolute; left: 0; top: 0; width: ${W}px; height: 2px;
    background: repeating-linear-gradient(90deg, rgba(240,179,35,.5) 0 6px, transparent 6px 14px);
  }
</style>
${strips.map((s2) => `<figure>
  <figcaption><b>${s2.a}</b> to <b>${s2.b}</b><i>${s2.y}px</i></figcaption>
  <span class="strip"><img src="data:image/png;base64,${s2.b64}"><span class="tick"></span></span>
</figure>`).join('')}`;

const sheetPage = await b.newPage();
await sheetPage.setViewport({ width: W, height: 800 });
await sheetPage.goto('http://localhost:4179/', { waitUntil: 'domcontentloaded' });
await sheetPage.setContent(html, { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 600));
await sheetPage.screenshot({ path: `.measure/out/agency/seams-${W}.png`, fullPage: true });
const dim = await sheetPage.evaluate(() => [innerWidth, document.documentElement.scrollHeight]);
console.log(`  seams-${W}.png  ${dim[0]}x${dim[1]}`);
await sheetPage.close();

/* and the numbers: what value sits either side of each join */
console.log('\n  seam                          above            below            same?');
for (const s of strips) {
  const px = (img, y) => {
    let r = 0, g = 0, bl = 0, n = 0;
    for (let x = 8; x < W - 8; x += 4) {
      const i = (y * img.width + x) * 4;
      r += img.data[i]; g += img.data[i + 1]; bl += img.data[i + 2]; n++;
    }
    return [r / n, g / n, bl / n].map(Math.round);
  };
  const above = px(s.png, Math.round(STRIP / 2) - 12);
  const below = px(s.png, Math.round(STRIP / 2) + 12);
  const same = above.every((v, i) => Math.abs(v - below[i]) < 6);
  console.log(
    `  ${(s.a + ' -> ' + s.b).padEnd(30)}rgb(${above.join(',')})`.padEnd(52) +
    `rgb(${below.join(',')})`.padEnd(17) + (same ? 'yes' : 'NO')
  );
}
await b.close();

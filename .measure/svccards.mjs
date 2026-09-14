/* svccards.mjs — the home Services cards: copy over a picture under a
   gradient, walked on painted pixels, and the gradient's bottom stop found.

   node .measure/svccards.mjs [base]        (default http://localhost:4180)

   The DOM walk in contrast.mjs cannot see this pair: the copy's computed
   ground is the card's lit-near, and what a reader sees under the copy is a
   picture with asphalt over it. So, per card, per width:

     1. read each line of copy's ink (the name white, the items bone) and its
        LINE BOXES from a Range, so the region is the text's own rows and not
        the card's padding;
     2. make the ink transparent and capture, so what is under the text is
        exactly the picture plus the gradient;
     3. take the BRIGHTEST pixel in each line box as that line's ground. The
        worst point is the pair, not the average;
     4. do it at rest and hovered, because hover scales the picture to 1.04
        and lights the spot, and either can put a brighter pixel under a word.

   The bottom stop starts at 85% and rises in 5% steps until every pair on
   every card passes at both states, or reaches 100% and reports what fails. */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import fs from 'node:fs';

const base = process.argv[2] || 'http://localhost:4180';
const out = '.measure/out/svc';
fs.mkdirSync(out, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

const args = ['--force-color-profile=srgb', '--font-render-hinting=none',
  '--use-gl=swiftshader', '--enable-unsafe-swiftshader'];
const result = {};

for (const [w, h] of [[1280, 900], [768, 1024], [390, 844]]) {
  const b = await puppeteer.launch({ headless: 'new', args });
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(base + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const tot = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < tot; y += h / 2) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(100); }
  await p.evaluate(() => Promise.all([...document.querySelectorAll('.svc__plate[data-variant="card"] .svc__art-img')]
    .map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))));
  await p.evaluate(() => document.querySelectorAll('.svc__plate').forEach((el) => { el.dataset.in = 'true'; }));
  await wait(500);

  const count = await p.$$eval('.svc__plate[data-variant="card"]', (e) => e.length);
  await p.addStyleTag({ content: '.svc-ink-off .svc__body, .svc-ink-off .svc__body * { color: transparent !important; }' });

  let shade = 85;
  let report;
  for (;;) {
    await p.evaluate((s) => document.querySelector('.services').style.setProperty('--card-shade', `${s}%`), shade);
    report = [];
    for (let c = 0; c < count; c++) {
      for (const hover of [false, true]) {
        await p.evaluate((c) => document.querySelectorAll('.svc__plate[data-variant="card"]')[c]
          .scrollIntoView({ block: 'center' }), c);
        await wait(250);
        const card = await p.$$('.svc__plate[data-variant="card"]').then((a) => a[c]);
        const bb = await card.boundingBox();
        if (hover) await p.mouse.move(bb.x + bb.width * 0.35, bb.y + bb.height * 0.8);
        else await p.mouse.move(2, 2);
        await wait(700);

        const lines = await p.evaluate((c) => {
          const card = document.querySelectorAll('.svc__plate[data-variant="card"]')[c];
          const els = [card.querySelector('.disc__name'), ...card.querySelectorAll('.disc__item')];
          return els.map((el) => {
            const cs = getComputedStyle(el);
            const rg = document.createRange();
            rg.selectNodeContents(el);
            const size = parseFloat(cs.fontSize);
            return {
              txt: el.textContent.trim(),
              color: cs.color,
              need: size >= 24 ? 3 : 4.5,
              rects: [...rg.getClientRects()].map((r) => [r.left, r.top, r.width, r.height]),
            };
          });
        }, c);

        await p.evaluate((c) => document.querySelectorAll('.svc__plate[data-variant="card"]')[c].classList.add('svc-ink-off'), c);
        await wait(80);
        const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
        await p.evaluate((c) => document.querySelectorAll('.svc__plate[data-variant="card"]')[c].classList.remove('svc-ink-off'), c);

        const id = await p.evaluate((c) => document.querySelectorAll('.svc__plate[data-variant="card"]')[c].id, c);
        for (const ln of lines) {
          const [r, g, bl] = (ln.color.match(/[\d.]+/g) || []).map(Number);
          const ink = L(r, g, bl);
          let max = 0;
          let at = null;
          for (const [x0, y0, rw, rh] of ln.rects) {
            for (let y = Math.max(0, Math.floor(y0)); y < Math.min(im.height, Math.ceil(y0 + rh)); y++) {
              for (let x = Math.max(0, Math.floor(x0)); x < Math.min(im.width, Math.ceil(x0 + rw)); x++) {
                const i = (y * im.width + x) * 4;
                const l = L(im.data[i], im.data[i + 1], im.data[i + 2]);
                if (l > max) { max = l; at = [x, y, im.data[i], im.data[i + 1], im.data[i + 2]]; }
              }
            }
          }
          const ratio = CR(ink, max);
          report.push({ id, hover, txt: ln.txt, need: ln.need, ratio: +ratio.toFixed(2), ground: at && `rgb(${at.slice(2).join(',')})` });
        }
      }
    }
    await p.mouse.move(2, 2);
    const fails = report.filter((r) => r.ratio < r.need);
    const worst = [...report].sort((a, b) => a.ratio / a.need - b.ratio / b.need)[0];
    console.log(`${w}: bottom stop ${shade}% — ${fails.length ? `${fails.length} failing` : 'every pair passes'}; ` +
      `binding: ${worst.id} ${worst.hover ? 'hover' : 'rest'} "${worst.txt}" ${worst.ratio}:1 (needs ${worst.need}) over ${worst.ground}`);
    for (const f of fails) console.log(`    FAIL ${f.id} ${f.hover ? 'hover' : 'rest'} "${f.txt}" ${f.ratio}:1 needs ${f.need} over ${f.ground}`);
    if (!fails.length || shade >= 100) break;
    shade += 5;
  }
  result[w] = { shade, pass: report.every((r) => r.ratio >= r.need) };
  fs.writeFileSync(`${out}/cards-${w}.json`, JSON.stringify(report, null, 1));
  await b.close();
}
console.log('RESULT', JSON.stringify(result));

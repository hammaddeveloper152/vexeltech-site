/* artifact-stills.mjs: the four /services artifacts as stills, for home's
   What we do cards (the founder's home brief, final25, 2026-10-07).

     node .measure/artifact-stills.mjs [base]    (default localhost:4173)

   Each discipline's artifact is the same component the /services page
   renders, opened there at 1280 x 800 with motion off (reduced motion, so
   every artifact is at its finished rest), and captured from its own
   stage at 2x (the desk, the phones, the cards and inbox, the phone with
   the calendar and receipt). The capture is then set, whole, centred, into a
   1:1 frame on its own band's ground (the base on a dark band, cream on a
   cream one), and saved as public/stills/<id>.webp, 720 x 720.

   WHY A STILL AND NOT THE LIVE COMPONENT IN THE CARD: the artifacts lay out
   by the viewport's media queries, so in a 300px card on a phone they
   would take their phone layout (a column taller than the screen), and
   they carry fields and buttons that cannot sit inside a card that is a
   link. The still is the component at rest at its desktop layout. Re-run
   after an artifact changes; the outputs are committed. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, '..', 'public', 'stills');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.argv[2] || 'http://localhost:4173';
const SIZE = 720;
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await p.goto(BASE + '/services', { waitUntil: 'networkidle0' });
await p.evaluate(() => document.fonts.ready);
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 40));
  }
  window.scrollTo(0, 0);
});
await new Promise((r) => setTimeout(r, 800));
const shots = {};
/* The bar, the side labels and the skip link stay out of every capture. */
await p.addStyleTag({ content: '.bar, .marg, .skip { display: none !important; }' });
/* Each artifact's own stage: the desk (not its name field and selector),
   the three phones, the cards and the inbox, the phone with the calendar
   and the receipt. */
const STAGE = { branding: '.bd__desk', websites: '.dp', marketing: '.ib__stage', automation: '.tb__stage' };
for (const id of ['branding', 'websites', 'marketing', 'automation']) {
  const band = await p.$(`#${id} ${STAGE[id]}`);
  const cream = await p.$eval(`#${id}`, (n) => n.classList.contains('svc2__d--cream'));
  const buf = await band.screenshot({ type: 'png' });
  shots[id] = { data: buf.toString('base64'), ground: cream ? '#f4f1ea' : '#0b0b0d' };
}
await p.close();

/* The frame: the capture contained in a square on its ground, 20px of air
   at 720. */
const f = await b.newPage();
await f.setViewport({ width: SIZE, height: SIZE, deviceScaleFactor: 1 });
for (const [id, { data, ground }] of Object.entries(shots)) {
  await f.setContent(
    `<html><body style="margin:0;width:${SIZE}px;height:${SIZE}px;background:${ground};display:grid;place-items:center">
      <img src="data:image/png;base64,${data}" style="max-width:${SIZE - 40}px;max-height:${SIZE - 40}px;object-fit:contain;display:block">
    </body></html>`,
    { waitUntil: 'load' }
  );
  const file = path.join(OUT, `${id}.webp`);
  await f.screenshot({ path: file, type: 'webp', quality: 80, clip: { x: 0, y: 0, width: SIZE, height: SIZE } });
  console.log(`${id}.webp ${fs.statSync(file).size} bytes`);
}
await b.close();

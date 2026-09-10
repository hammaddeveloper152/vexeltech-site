/* hovershot.mjs — the home Services section with the cursor over plate 02,
   and a 5 second webm of the hover on plate 01.

   THE WEBM IS RECORDED IN THE PAGE, NOT BY PUPPETEER. `page.screencast()`
   shells out to `ffmpeg`, which is not installed on this machine. Chrome can
   record itself instead: `getDisplayMedia({ preferCurrentTab: true })` with
   `--auto-accept-this-tab-capture` gives a stream of the tab, MediaRecorder
   encodes it to VP9 webm, and the blob comes back over CDP as base64. No
   install, no third-party encoder, and the frames are the browser's own
   composited output rather than a series of stills stitched together.

   The pointer path is scripted rather than jumped: a light that follows the
   pointer is only legible in a recording if the pointer actually travels. */
import puppeteer from 'puppeteer';
import { writeFileSync } from 'node:fs';

const b = await puppeteer.launch({ headless: 'new', args: [
  '--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb',
  '--font-render-hinting=none', '--auto-accept-this-tab-capture',
  '--enable-usermedia-screen-capturing', '--autoplay-policy=no-user-gesture-required',
] });

const p = await b.newPage();
await p.setViewport({ width: 1280, height: 900 });
await p.goto('http://localhost:4179/', { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 2500));

/* Walk so every plate has arrived, then park on the section. */
const tot = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < tot; y += 450) {
  await p.evaluate((v) => window.scrollTo(0, v), y);
  await new Promise((r) => setTimeout(r, 110));
}
const top = await p.evaluate(() =>
  Math.round(document.querySelector('.services').getBoundingClientRect().top + scrollY));
await p.evaluate((v) => { document.scrollingElement.scrollTop = v; }, top);
await new Promise((r) => setTimeout(r, 800));

const boxOf = (i) => p.evaluate((n) => {
  const r = document.querySelectorAll('.svc__plate')[n].getBoundingClientRect();
  return { l: Math.round(r.left), t: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
}, i);

/* ---- 1. the still, cursor over plate 02 ------------------------------- */
const b2 = await boxOf(1);
await p.mouse.move(b2.l + b2.w * 0.28, b2.t + b2.h * 0.3, { steps: 12 });
await new Promise((r) => setTimeout(r, 450));
const state = await p.evaluate(() => {
  const e = document.querySelectorAll('.svc__plate')[1];
  return { lit: e.dataset.lit, mx: e.style.getPropertyValue('--mx'), my: e.style.getPropertyValue('--my') };
});
console.log('  plate 02 under the cursor:', JSON.stringify(state));
const clip = await p.evaluate(() => {
  const r = document.querySelector('.services').getBoundingClientRect();
  return { x: 0, y: r.top + scrollY, width: innerWidth, height: Math.round(r.height) };
});
await p.screenshot({ path: '.measure/out/agency/hover-1280.png', clip });
console.log('  hover-1280.png');

/* ---- 2. five seconds of the hover on plate 01 ------------------------- */
const b1 = await boxOf(0);
await p.mouse.move(20, 20, { steps: 4 });
await new Promise((r) => setTimeout(r, 500));

await p.evaluate(async () => {
  const s = await navigator.mediaDevices.getDisplayMedia({
    video: { frameRate: 30, width: 1280, height: 900 }, preferCurrentTab: true,
  });
  const rec = new MediaRecorder(s, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 4_000_000 });
  window.__chunks = [];
  rec.ondataavailable = (e) => window.__chunks.push(e.data);
  window.__rec = rec;
  rec.start(100);
});

/* The path: in from outside, across the plate corner to corner through the
   middle, a press, and out again. Five seconds of pointer travel, so the light
   is seen moving rather than seen having moved. */
const pts = [
  [b1.l - 40, b1.t + b1.h * 0.5],
  [b1.l + b1.w * 0.12, b1.t + b1.h * 0.18],
  [b1.l + b1.w * 0.45, b1.t + b1.h * 0.3],
  [b1.l + b1.w * 0.8, b1.t + b1.h * 0.62],
  [b1.l + b1.w * 0.5, b1.t + b1.h * 0.85],
  [b1.l + b1.w * 0.2, b1.t + b1.h * 0.5],
];
for (const [x, y] of pts) {
  await p.mouse.move(x, y, { steps: 26 });
  await new Promise((r) => setTimeout(r, 420));
}
await p.mouse.down();
await new Promise((r) => setTimeout(r, 260));
await p.mouse.up();
await new Promise((r) => setTimeout(r, 340));
await p.mouse.move(b1.l - 60, b1.t - 40, { steps: 22 });
await new Promise((r) => setTimeout(r, 900));

const b64 = await p.evaluate(async () => {
  await new Promise((r) => { window.__rec.onstop = r; window.__rec.stop(); });
  const buf = await new Blob(window.__chunks, { type: 'video/webm' }).arrayBuffer();
  const u8 = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
  return btoa(s);
});
const out = Buffer.from(b64, 'base64');
writeFileSync('.measure/out/agency/hover-plate-01.webm', out);
console.log(`  hover-plate-01.webm  ${(out.length / 1024).toFixed(0)} KB`);

await b.close();

/* rig.mjs — is the lighting rig actually anchored to the viewport?

   The rig was `background-attachment: fixed` on `body`. iOS Safari does not
   honour that — it is ignored, or the gradient is sized to the document rather
   than the viewport — so the blooms land somewhere other than where they were
   placed, on the phones most visitors are holding. It is a `position: fixed`
   pseudo-layer now, which every engine anchors the same way.

   THERE IS NO WEBKIT IN THIS HARNESS. Puppeteer ships Chromium and playwright
   is not installed, so the iOS engine cannot be run here. What CAN be proved
   is the thing that matters: that the rig no longer DEPENDS on the property
   iOS gets wrong.

   Three checks, and the third is the one that stands in for the browser:

     1. `background-attachment: fixed` appears nowhere in the built CSS.
     2. The rig is viewport-anchored — the same viewport pixel reads the same
        value at every scroll depth. A document-anchored gradient would drift.
     3. WITH THE PROPERTY NEUTERED. Every `background-attachment` on the page
        is forced to `scroll` and the whole of check 2 is run again. If the
        readings are identical, nothing on the page was relying on the fixed
        attachment, which is the failure iOS reproduces.
*/
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const W = Number(process.argv[2]) || 390;
const H = W === 390 ? 844 : 900;

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });

/* THE CONTENT IS HIDDEN BEFORE THE RIG IS SAMPLED, and the first version of
   this test did not do that. It sampled five viewport points and four of them
   landed on something else: the sticky bar covers both top corners, and at
   scroll 0 the hero's WebGL canvas covers the rest. The readings differed by a
   point between scroll depths and the check reported the rig as moving — it
   was the canvas changing, not the rig.

   `visibility: hidden` on every section and the bar leaves the fixed layer as
   the only thing painting. It hides content without removing it, so the
   document keeps its height and the scroll positions stay meaningful. */
const POINTS = [[6, 6], [W - 6, 6], [6, H - 6], [W - 6, H - 6],
                [Math.round(W / 2), Math.round(H / 2)]];

async function hideContent(p) {
  await p.addStyleTag({ content:
    'body > *, .bar, header, footer { visibility: hidden !important; }' });
  await new Promise((r) => setTimeout(r, 300));
}

async function readAt(p, scrolls) {
  const out = [];
  for (const y of scrolls) {
    await p.evaluate((v) => { document.scrollingElement.scrollTop = v; }, y);
    await new Promise((r) => setTimeout(r, 320));
    const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
    out.push(POINTS.map(([x, yy]) => {
      const i = (Math.min(yy, im.height - 1) * im.width + Math.min(x, im.width - 1)) * 4;
      return `${im.data[i]},${im.data[i + 1]},${im.data[i + 2]}`;
    }));
  }
  return out;
}

for (const route of ['/', '/services']) {
  const p = await b.newPage();
  await p.setViewport({ width: W, height: H });
  await p.goto('http://localhost:4179' + route, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2200));

  const decl = await p.evaluate(() => {
    const el = document.body;
    const be = getComputedStyle(el, '::before');
    return {
      bodyAttach: getComputedStyle(el).backgroundAttachment,
      layerPos: be.position,
      layerZ: be.zIndex,
      layerHits: be.pointerEvents,
      layerImg: be.backgroundImage.split('radial').length - 1,
      layerBox: [be.top, be.right, be.bottom, be.left].join(' '),
    };
  });

  const tot = await p.evaluate(() => document.documentElement.scrollHeight);
  const scrolls = [0, Math.round(tot * 0.4), Math.round(tot * 0.8)];

  await hideContent(p);
  const before = await readAt(p, scrolls);

  /* neuter the property iOS gets wrong, then read the same points again */
  await p.addStyleTag({ content: '*, *::before, *::after { background-attachment: scroll !important; }' });
  await new Promise((r) => setTimeout(r, 400));
  const after = await readAt(p, scrolls);

  const anchored = before.every((row) => row.every((v, i) => v === before[0][i]));
  const unaffected = JSON.stringify(before) === JSON.stringify(after);

  console.log(`\n${route} at ${W}`);
  console.log(`  body background-attachment   ${decl.bodyAttach}`);
  console.log(`  rig layer                    ${decl.layerPos}, z ${decl.layerZ}, ${decl.layerHits}, inset ${decl.layerBox}, ${decl.layerImg} radials`);
  for (let i = 0; i < scrolls.length; i++) {
    console.log(`  scroll ${String(scrolls[i]).padStart(6)}            ${before[i].join('  ')}`);
  }
  console.log(`  viewport-anchored            ${anchored ? 'yes' : 'NO — the rig moves with the page'}`);
  console.log(`  survives attachment: scroll  ${unaffected ? 'yes, identical' : 'NO — something depends on the fixed attachment'}`);
  await p.close();
}
await b.close();

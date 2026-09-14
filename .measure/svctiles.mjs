/* svctiles.mjs — the Services tiles: geometry, hover, and the two captures.

   node .measure/svctiles.mjs [base]        (default http://localhost:4180)

   Per mount (home, /services) and width (1280, 768, 390), per plate:
     ratio     tile width / height, and it must be 1
     share     tile border-box width / plate border-box width (40% from 1024,
               60% of the plate's CONTENT width below)
     bleed     tile top above the plate top, tile right past the plate right
               (32 and 32 from 1024; 0 and inside the padding below)
     order     tile above the copy below 1024
     fit       object-fit on the image, and that the image actually decoded
   Measured on the layout box, with the plate's own rotation and lift taken
   off first, because the arrival transform is not what the rule is about.

   Hover at 1280: a real mouse move over plate 01, then the tile's computed
   transform, which must carry the 6px lift and a tilt.

   Captures at 1280 to .measure/out/svc/: the home Services section and the
   /services page, full. */
import puppeteer from 'puppeteer';
import fs from 'node:fs';

const base = process.argv[2] || 'http://localhost:4180';
const out = '.measure/out/svc';
fs.mkdirSync(out, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const args = ['--force-color-profile=srgb', '--font-render-hinting=none',
  '--use-gl=swiftshader', '--enable-unsafe-swiftshader'];
let fail = 0;

for (const [w, h] of [[1280, 900], [768, 1024], [390, 844]]) {
  const b = await puppeteer.launch({ headless: 'new', args });
  for (const route of ['/', '/services']) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h });
    await p.goto(base + route, { waitUntil: 'networkidle0' });
    const tot = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < tot; y += h / 2) {
      await p.evaluate((v) => window.scrollTo(0, v), y);
      await wait(120);
    }
    await p.evaluate(() => Promise.all([...document.querySelectorAll('.svc__art-img')]
      .map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))));
    await wait(600);

    const rows = await p.evaluate(() => [...document.querySelectorAll('.svc__plate')].map((pl) => {
      const art = pl.querySelector('.svc__art');
      if (!art) return { id: pl.id, art: false };
      const img = art.querySelector('img');
      /* Take the plate's arrival transform off so the numbers are layout. */
      const keep = pl.style.transform;
      pl.style.transition = 'none';
      pl.style.transform = 'none';
      const P = pl.getBoundingClientRect();
      const A = art.getBoundingClientRect();
      const body = pl.querySelector('.svc__body').getBoundingClientRect();
      const cs = getComputedStyle(pl);
      const content = P.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
        - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth);
      pl.style.transform = keep;
      pl.style.transition = '';
      return {
        id: pl.id, art: true,
        ratio: +(A.width / A.height).toFixed(3),
        tile: +A.width.toFixed(1), plate: +P.width.toFixed(1),
        share: +(A.width / P.width * 100).toFixed(1),
        shareContent: +(A.width / content * 100).toFixed(1),
        bleedTop: +(P.top - A.top).toFixed(1), bleedRight: +(A.right - P.right).toFixed(1),
        above: A.bottom <= body.top + 0.5,
        fit: img && getComputedStyle(img).objectFit,
        decoded: !!(img && img.naturalWidth), natural: img && img.naturalWidth,
        alt: img && img.getAttribute('alt'),
      };
    }));

    for (const r of rows) {
      if (!r.art) { console.log(`${w} ${route} ${r.id}: NO TILE`); fail++; continue; }
      const wide = w >= 1024;
      const ok = Math.abs(r.ratio - 1) < 0.01 && r.fit === 'cover' && r.decoded &&
        (wide
          ? Math.abs(r.share - 40) < 0.6 && Math.abs(r.bleedTop - 32) < 1 && Math.abs(r.bleedRight - 32) < 1
          : Math.abs(r.shareContent - 60) < 0.6 && r.bleedTop < 0 && r.bleedRight < 0 && r.above);
      if (!ok) fail++;
      console.log(`${w} ${route.padEnd(9)} ${r.id.padEnd(10)} ${ok ? 'ok  ' : 'FAIL'} ` +
        `ratio ${r.ratio} tile ${r.tile}/${r.plate} = ${r.share}% (content ${r.shareContent}%) ` +
        `bleed top ${r.bleedTop} right ${r.bleedRight} above ${r.above} fit ${r.fit} ` +
        `natural ${r.natural} alt "${r.alt}"`);
    }

    if (w === 1280) {
      /* The hover, with a real mouse. */
      const first = await p.$('.svc__plate');
      await first.scrollIntoView();
      await wait(400);
      const bb = await first.boundingBox();
      await p.mouse.move(bb.x + bb.width * 0.8, bb.y + bb.height * 0.25);
      await wait(500);
      const hov = await p.evaluate(() => {
        const pl = document.querySelector('.svc__plate');
        const m = new DOMMatrix(getComputedStyle(pl.querySelector('.svc__art')).transform);
        return { lit: pl.dataset.lit, ty: +m.m42.toFixed(2), tilted: Math.abs(m.m13) > 1e-4 || Math.abs(m.m23) > 1e-4 };
      });
      const ok = hov.lit === 'true' && Math.abs(hov.ty + 6) < 0.5 && hov.tilted;
      if (!ok) fail++;
      console.log(`${w} ${route} hover: ${ok ? 'ok' : 'FAIL'} ${JSON.stringify(hov)}`);
      await p.mouse.move(2, 2);
      await wait(700);

      if (route === '/') {
        /* NOT an element screenshot: that scrolls the section to the top of
           the viewport, under the sticky bar, and the bar paints over its
           head. From the top of the document with a clip, the bar is where a
           reader sees it, 1500px away. */
        await p.evaluate(() => window.scrollTo(0, 0));
        await wait(600);
        const r = await p.evaluate(() => {
          const b = document.querySelector('.services').getBoundingClientRect();
          return { x: 0, y: b.top + window.scrollY, width: document.documentElement.clientWidth, height: b.height };
        });
        await p.screenshot({ path: `${out}/services-tiles.png`, clip: r, captureBeyondViewport: true });
      } else {
        await p.evaluate(() => window.scrollTo(0, 0));
        await wait(600);
        await p.screenshot({ path: `${out}/services-page-tiles.png`, fullPage: true });
      }
    }
    await p.close();
  }
  await b.close();
}
console.log(fail ? `${fail} FAILED` : 'all tiles pass');
process.exit(fail ? 1 : 0);

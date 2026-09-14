/* svctiles.mjs — the Services tiles as mounted, 2026-09-15: cards on home, a
   50/50 split on /services. Geometry, hover, and the two captures.

   node .measure/svctiles.mjs [base]        (default http://localhost:4180)

   The bleeding slot this used to measure is withdrawn. Per width (1280, 768,
   390), with each plate's arrival transform taken off first:

   HOME, card
     1:1 from 1024 (a floor below it); the tile fills the card's padding box
     edge to edge; 12px radius; no yellow bar; copy bottom-left at 32px; the
     shade reaching 24 + 64px above the name.
   /services, split
     from 1024: two equal columns; the tile's box is the plate's full height and
     its right half, flush to the edges; plate height = copy content + 96.
     below 1024: the tile on top, full width, 3:2.

   Hover at 1280 on both: a real mouse move, the picture's transform must read
   scale 1.04 once the 400ms transition has run.

   Captures at 1280 to .measure/out/svc/: services-tiles2.png (the home
   section) and services-page-tiles2.png (/services, full). */
import puppeteer from 'puppeteer';
import fs from 'node:fs';

const base = process.argv[2] || 'http://localhost:4180';
const out = '.measure/out/svc';
fs.mkdirSync(out, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const args = ['--force-color-profile=srgb', '--font-render-hinting=none',
  '--use-gl=swiftshader', '--enable-unsafe-swiftshader'];
let fail = 0;
const near = (a, b, t = 1) => Math.abs(a - b) <= t;

for (const [w, h] of [[1280, 900], [768, 1024], [390, 844]]) {
  const b = await puppeteer.launch({ headless: 'new', args });
  for (const route of ['/', '/services']) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h });
    await p.goto(base + route, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    const tot = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < tot; y += h / 2) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(110); }
    await p.evaluate(() => Promise.all([...document.querySelectorAll('.svc__art-img')]
      .map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))));
    await wait(600);

    const rows = await p.evaluate(() => [...document.querySelectorAll('.svc__plate')].map((pl) => {
      const keep = pl.style.transform;
      pl.style.transition = 'none';
      pl.style.transform = 'none';
      const cs = getComputedStyle(pl);
      const P = pl.getBoundingClientRect();
      const art = pl.querySelector('.svc__art');
      const A = art ? art.getBoundingClientRect() : null;
      const body = pl.querySelector('.svc__body');
      const B = body.getBoundingClientRect();
      const bcs = getComputedStyle(body);
      const name = pl.querySelector('.disc__name').getBoundingClientRect();
      const shade = getComputedStyle(body, '::before');
      const after = getComputedStyle(pl, '::after');
      const bw = parseFloat(cs.borderLeftWidth);
      const r = {
        id: pl.id, variant: pl.dataset.variant,
        plate: [P.width, P.height].map((v) => +v.toFixed(1)),
        art: A && [A.left - P.left, A.top - P.top, A.width, A.height].map((v) => +v.toFixed(1)),
        body: [B.left - P.left, B.top - P.top, B.width, B.height].map((v) => +v.toFixed(1)),
        pad: [parseFloat(bcs.paddingTop), parseFloat(bcs.paddingLeft)],
        platePad: [parseFloat(cs.paddingLeft), parseFloat(cs.paddingBottom)],
        radius: parseFloat(cs.borderTopLeftRadius), border: bw,
        clip: cs.clipPath,
        bar: after.content !== 'none' && after.backgroundColor,
        shadeTop: shade.content !== 'none' ? +(name.top - (B.top + parseFloat(shade.top))).toFixed(1) : null,
        nameFont: getComputedStyle(pl.querySelector('.disc__name')).fontFamily.split(',')[0],
        fit: art && getComputedStyle(art.querySelector('img')).objectFit,
        decoded: !!(art && art.querySelector('img').naturalWidth),
        contentH: [...body.children].reduce((s, c) => s + c.getBoundingClientRect().height + parseFloat(getComputedStyle(c).marginTop) + parseFloat(getComputedStyle(c).marginBottom), 0),
      };
      pl.style.transform = keep;
      pl.style.transition = '';
      return r;
    }));

    const wide = w >= 1024;
    for (const r of rows) {
      const bad = [];
      if (!r.art || !r.decoded) bad.push('no decoded tile');
      else if (r.fit !== 'cover') bad.push(`fit ${r.fit}`);
      const [pw, ph] = r.plate;
      if (r.art) {
        const [ax, ay, aw, ah] = r.art;
        if (r.variant === 'card') {
          if (wide && !near(pw, ph)) bad.push(`not square ${pw}x${ph}`);
          if (!near(ax, r.border) || !near(ay, r.border) || !near(aw, pw - 2 * r.border) || !near(ah, ph - 2 * r.border)) bad.push(`tile not edge to edge ${r.art}`);
          if (r.radius !== 12) bad.push(`radius ${r.radius}`);
          if (r.bar) bad.push(`bar ${r.bar}`);
          if (r.platePad[0] !== 32 || r.platePad[1] !== 32) bad.push(`padding ${r.platePad}`);
          if (r.shadeTop !== 88) bad.push(`shade reaches ${r.shadeTop}px above the name (88)`);
          if (r.nameFont !== 'Moldie') bad.push(`name face ${r.nameFont}`);
        } else if (wide) {
          if (!near(aw, pw / 2, 1.5) || !near(ax, pw / 2, 1.5)) bad.push(`not the right half: x ${ax} w ${aw} of ${pw}`);
          if (!near(ay, 0) || !near(ah, ph)) bad.push(`not full height: y ${ay} h ${ah} of ${ph}`);
          if (!near(ph, r.contentH + 96 + 2 * r.border, 2)) bad.push(`plate ${ph} vs content ${r.contentH.toFixed(1)} + 96`);
          if (r.pad[0] !== 48) bad.push(`copy padding ${r.pad[0]}`);
        } else {
          if (!near(ay, 0) || !near(aw, pw) || !near(aw / ah, 1.5, 0.01)) bad.push(`not top/full/3:2: ${r.art}`);
          if (r.body[1] < ah - 1) bad.push('copy not below tile');
        }
      }
      if (bad.length) fail++;
      console.log(`${w} ${route.padEnd(9)} ${r.id.padEnd(10)} ${r.variant.padEnd(5)} ${bad.length ? 'FAIL ' + bad.join('; ') : 'ok'}  plate ${r.plate.join('x')} tile ${r.art ? r.art.join(',') : '-'}`);
    }

    if (w === 1280) {
      const first = await p.$('.svc__plate');
      await first.scrollIntoView();
      await wait(400);
      const bb = await first.boundingBox();
      await p.mouse.move(bb.x + bb.width * 0.7, bb.y + bb.height * 0.3);
      await wait(700);
      const hov = await p.evaluate(() => {
        const pl = document.querySelector('.svc__plate');
        const m = new DOMMatrix(getComputedStyle(pl.querySelector('.svc__art-img')).transform);
        return { lit: pl.dataset.lit, scale: +m.a.toFixed(3) };
      });
      const ok = hov.lit === 'true' && near(hov.scale, 1.04, 0.002);
      if (!ok) fail++;
      console.log(`${w} ${route} hover: ${ok ? 'ok' : 'FAIL'} ${JSON.stringify(hov)}`);
      await p.mouse.move(2, 2);
      await wait(700);

      await p.evaluate(() => window.scrollTo(0, 0));
      await wait(600);
      if (route === '/') {
        const r = await p.evaluate(() => {
          const s = document.querySelector('.services').getBoundingClientRect();
          return { x: 0, y: s.top + window.scrollY, width: document.documentElement.clientWidth, height: s.height };
        });
        await p.screenshot({ path: `${out}/services-tiles2.png`, clip: r, captureBeyondViewport: true });
      } else {
        await p.screenshot({ path: `${out}/services-page-tiles2.png`, fullPage: true });
      }
    }
    await p.close();
  }
  await b.close();
}
console.log(fail ? `${fail} FAILED` : 'all tiles pass');
process.exit(fail ? 1 : 0);

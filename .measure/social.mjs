/* social.mjs — the social row, 2026-09-16.

   node .measure/social.mjs [base]          (default http://localhost:4180)

   Home, About, Pricing at 1280 and 390: the footer carries six anchors in
   order, each a 36px tile of a 240px webp, 12px apart, each target at least
   48px, each labelled with its platform and pointing at it; hover lifts 2px.
   Contact at 1280: the 48px row sits under the form and the footer's own row
   is gone. The home footer at 1280 is captured to .measure/out/social/. */
import puppeteer from 'puppeteer';
import fs from 'node:fs';

const base = process.argv[2] || 'http://localhost:4180';
const out = '.measure/out/social';
fs.mkdirSync(out, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fail = 0;
const check = (ok, msg) => { if (!ok) fail++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`); };
const near = (a, b, t = 1) => Math.abs(a - b) <= t;
const ORDER = ['instagram', 'facebook', 'linkedin', 'x', 'tiktok', 'youtube'];

const read = (p, sel) => p.evaluate((sel) => [...document.querySelectorAll(`${sel} .social__a`)].map((a) => {
  const img = a.querySelector('img');
  const r = img.getBoundingClientRect();
  const t = a.getBoundingClientRect();
  return { href: a.getAttribute('href'), label: a.getAttribute('aria-label'), src: img.getAttribute('src'),
    natural: img.naturalWidth, w: r.width, h: r.height, left: r.left, right: r.right, top: r.top + scrollY, tw: t.width, th: t.height };
}), sel);

const b = await puppeteer.launch({ headless: 'new', args: ['--force-color-profile=srgb', '--hide-scrollbars'] });
for (const [w, h] of [[1280, 900], [390, 844]]) {
  for (const route of ['/', '/about-us', '/pricing', '/contact-us']) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h });
    await p.goto(base + route, { waitUntil: 'networkidle0' });
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await wait(700);
    /* Only the social tiles, and never forever: lazy images elsewhere on the
       page that are out of view never load, and waiting on all of them hung. */
    await p.evaluate(() => Promise.race([
      Promise.all([...document.querySelectorAll('.social__img')].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))),
      new Promise((r) => setTimeout(r, 5000)),
    ]));
    const meta = await read(p, '.foot__social');
    const under = await read(p, '.foot__social-under');
    const contact = route === '/contact-us';
    const row = contact ? under : meta;
    const size = contact ? 48 : 36;
    const gaps = row.slice(1).map((x, i) => +(x.left - row[i].right).toFixed(1));
    const sameLine = row.every((x) => near(x.top, row[0].top, 1));
    const ok = row.length === 6 && row.every((x, i) => x.src.endsWith(`social-${ORDER[i]}.webp`) && x.natural === 240 && near(x.w, size, 0.5) && x.tw >= 48 && x.th >= 48 && x.label && x.href.startsWith('https://'))
      && (!sameLine || gaps.every((g) => near(g, 12, 0.5)));
    check(ok, `${w} ${route.padEnd(11)} ${contact ? 'under the form' : 'footer'}: ${row.length} tiles at ${row[0] && row[0].w}px, gaps ${gaps.join('/')}, targets ${row[0] && row[0].tw}x${row[0] && row[0].th}, ${row.map((x) => x.label).join(' ')}`);
    if (contact) check(meta.length === 0, `${w} contact: footer row ${meta.length ? 'present' : 'absent'}`);
    if (contact && w === 1280) {
      const pos = await p.evaluate(() => {
        const f = document.querySelector('.foot__form').getBoundingClientRect();
        const s = document.querySelector('.foot__social-under').getBoundingClientRect();
        return s.top - f.bottom;
      });
      check(pos > 0, `contact: the row sits ${pos.toFixed(0)}px under the form`);
    }
    if (route === '/' && w === 1280) {
      const a = await p.$('.foot__social .social__a');
      await a.hover();
      await wait(400);
      const ty = await p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.foot__social .social__a')).transform).m42);
      check(near(ty, -2, 0.1), `hover lifts ${ty}px`);
      await p.mouse.move(2, 2);
      /* CAPTURED FROM THE TOP OF THE PAGE. Clipped at the bottom, the footer is
         taller than the viewport and the sticky bar and a focused skip link
         painted into the middle of it; from the top they sit a page away. */
      await p.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
      await wait(700);
      const clip = await p.evaluate(() => { const r = document.querySelector('.foot').getBoundingClientRect(); return { x: 0, y: r.top + scrollY, width: document.documentElement.clientWidth, height: r.height }; });
      await p.screenshot({ path: `${out}/footer-1280.png`, clip, captureBeyondViewport: true });
      const meta2 = await p.evaluate(() => { const r = document.querySelector('.foot__meta').getBoundingClientRect(); return { x: 0, y: r.top + scrollY - 40, width: document.documentElement.clientWidth, height: r.height + 120 }; });
      await p.screenshot({ path: `${out}/footer-meta-1280.png`, clip: meta2, captureBeyondViewport: true });
      console.log(`  captured ${out}/footer-1280.png and footer-meta-1280.png`);
    }
    await p.close();
  }
}
await b.close();
console.log(fail ? `\n${fail} FAILED` : '\nall pass');
process.exit(fail ? 1 : 0);

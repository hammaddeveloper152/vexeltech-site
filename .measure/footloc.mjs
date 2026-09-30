/* footloc.mjs: the tablet hero edge and the footer without its location
   line, 2026-09-30 (the founder).

   - 768 and 1023, home at scroll 0: the wordmark's left edge against the
     headline's (and the offer line's and the call's). Frame at 768.
   - /, /services, /about-us, /contact-us at 1280 and 390: the footer's meta
     column, its rows and the gaps between them, a frame of it, and every
     public route's rendered text searched for a city or state.
   Console errors collected.

   Usage: node .measure/footloc.mjs [base]   (default http://localhost:4173)
   Frames go to .measure/out/footloc/. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out', 'footloc');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.argv[2] || 'http://localhost:4173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
const open = async (w, h, route) => {
  const p = await b.newPage();
  p.on('console', (m) => m.type() === 'error' && errors.push(`${route} ${w}: ${m.text()}`));
  p.on('pageerror', (e) => errors.push(`${route} ${w}: ${e.message}`));
  await p.setViewport({ width: w, height: h });
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await wait(1300);
  return p;
};
const report = { edge: {}, footer: {}, text: {} };

for (const [w, h] of [[768, 1024], [1023, 1024], [767, 1024]]) {
  const p = await open(w, h, '/');
  report.edge[w] = await p.evaluate(() => {
    const x = (s) => Math.round(document.querySelector(s).getBoundingClientRect().left * 10) / 10;
    return { wordmark: x('.bar__brand .wm'), headline: x('.hero__headline'), offer: x('.hero__price'), call: x('.hero__actions .hero__cta'), bodyPad: getComputedStyle(document.querySelector('.hero__body')).paddingLeft };
  });
  if (w === 768) await p.screenshot({ path: path.join(OUT, '768-home-scroll0.png') });
  await p.close();
}

for (const route of ['/', '/services', '/about-us', '/contact-us']) {
  for (const [w, h] of [[1280, 800], [390, 844]]) {
    const p = await open(w, h, route);
    await p.evaluate(() => document.querySelector('.foot__band').scrollIntoView({ block: 'center', behavior: 'instant' }));
    await wait(900);
    report.footer[`${route} ${w}`] = await p.evaluate(() => {
      const kids = [...document.querySelector('.foot__meta').children].filter((e) => e.offsetParent !== null);
      const rows = kids.map((e) => ({ el: e.className || e.tagName, top: Math.round(e.getBoundingClientRect().top), bottom: Math.round(e.getBoundingClientRect().bottom) }));
      const gaps = rows.slice(1).map((r, i) => r.top - rows[i].bottom);
      return {
        rows: rows.map((r) => r.el),
        gaps,
        city: !!document.querySelector('.foot__city'),
        text: document.querySelector('.foot__band').innerText.replace(/\s+/g, ' ').slice(0, 200),
      };
    });
    const box = await p.evaluate(() => {
      const r = document.querySelector('.foot__band').getBoundingClientRect();
      return { x: 0, y: r.top + scrollY, width: innerWidth, height: Math.min(r.height, 1400) };
    });
    await p.screenshot({ path: path.join(OUT, `${route.replace(/\//g, '') || 'home'}-${w}-footer.png`), clip: box });
    await p.close();
  }
}

/* Every public route's rendered text, searched. The legal pages are left
   out on purpose: the address and the governing law stay there. */
for (const route of ['/', '/services', '/pricing', '/about-us', '/contact-us', '/thanks']) {
  const p = await open(1280, 800, route);
  report.text[route] = await p.evaluate(() => {
    const t = document.body.innerText;
    return (t.match(/[^\n]*\b(Richmond|Texas|TX|77406|Elks)\b[^\n]*/g) || []).slice(0, 5);
  });
  await p.close();
}

await b.close();
report.consoleErrors = errors;
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));

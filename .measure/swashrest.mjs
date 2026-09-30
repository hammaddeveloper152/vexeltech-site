/* swashrest.mjs: every word swash on the site at rest, 2026-09-30 (the
   founder's About swash fix).

   For /about-us, /, /pricing and /services at 390, 430, 768 and 1280, every
   `.brush` around words (not the loose marks):
     - before any scroll: ready, drawn, and whether it is in view, so a swash
       below the fold is seen holding until it is scrolled to;
     - scrolled to the middle of the screen and settled: the stroke's width
       against the words' own inline box (getClientRects) plus the 12px and
       cap reach each side, the draw state, the ink, and the gap from the
       stroke's painted box to the letter before and after it on the same
       line. A gap under 0 is the stroke over a neighbouring letter;
     - a crop of it.
   Home's "Yet." lives in the second shot's line, so the film is held on it.
   Then /about-us loaded at 1280 and resized to 390: the stroke re-measured.
   Console errors are collected throughout.

   Usage: node .measure/swashrest.mjs [base]   (default http://localhost:4173)
   Crops and report go to .measure/out/swashrest/. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out', 'swashrest');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.argv[2] || 'http://localhost:4173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });

const SIZES = [[390, 844], [430, 932], [768, 1024], [1280, 800]];
const ROUTES = ['/about-us', '/', '/pricing', '/services'];

/* Everything about one swash, read in the page. */
function read(i) {
  const wrap = document.querySelectorAll('.brush:not(.brush--mark)')[i];
  const word = wrap.querySelector('.brush__t');
  const svg = wrap.querySelector('.brush__stroke');
  const rects = Array.from(word.getClientRects());
  const wr = rects.reduce((a, r) => (r.width > a.width ? r : a), rects[0]);
  const hold = parseFloat(getComputedStyle(wrap).marginLeft) || 0;
  /* The letter either side, in the text nodes next to the swash. */
  const charRect = (node, fromEnd) => {
    while (node && node.nodeType !== 3) node = fromEnd ? node.lastChild : node.firstChild;
    if (!node) return null;
    const text = node.textContent;
    let k = fromEnd ? text.length - 1 : 0;
    while (k >= 0 && k < text.length && /\s/.test(text[k])) k += fromEnd ? -1 : 1;
    if (k < 0 || k >= text.length) return null;
    const r = document.createRange();
    r.setStart(node, k);
    r.setEnd(node, k + 1);
    return r.getBoundingClientRect();
  };
  const prev = charRect(wrap.previousSibling, true);
  const next = charRect(wrap.nextSibling, false);
  const sameLine = (r) => r && sr && r.bottom > sr.top && r.top < sr.bottom;
  const sr = svg ? svg.getBoundingClientRect() : null;
  return {
    text: word.textContent.trim(),
    hl: wrap.classList.contains('brush--hl'),
    inView: wr.top < innerHeight && wr.bottom > 0,
    drawnAttr: wrap.getAttribute('data-drawn'),
    inked: wrap.getAttribute('data-inked'),
    stroke: !!svg,
    dash: svg ? getComputedStyle(svg.querySelector('path')).strokeDashoffset : null,
    wordW: +wr.width.toFixed(1),
    rows: rects.length,
    svgW: svg ? Number(svg.getAttribute('width')) : 0,
    expectW: svg ? +(wr.width + 2 * hold).toFixed(1) : null,
    hold,
    ink: getComputedStyle(word).color,
    gapBefore: sameLine(prev) ? +(sr.left - prev.right).toFixed(1) : 'other line',
    gapAfter: sameLine(next) ? +(next.left - sr.right).toFixed(1) : 'other line',
    box: sr ? { x: sr.left, y: sr.top, w: sr.width, h: sr.height } : null,
    wordBox: { x: wr.left, y: wr.top, w: wr.width, h: wr.height },
  };
}

const report = { rest: {} };
for (const route of ROUTES) {
  for (const [w, h] of SIZES) {
    const p = await b.newPage();
    p.on('console', (m) => m.type() === 'error' && errors.push(`${route} ${w}: ${m.text()}`));
    p.on('pageerror', (e) => errors.push(`${route} ${w}: ${e.message}`));
    await p.setViewport({ width: w, height: h });
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    if (route === '/') {
      /* Hold the film on shot 2, whose line carries "Yet.". */
      await p.evaluate(() => {
        const v = document.querySelector('.hero__spot');
        if (v) {
          /* The hero's own canplaythrough handler calls play() again after a
             pause, which moves the line on and unmounts "Yet." mid-walk. */
          v.play = () => Promise.resolve();
          v.pause();
          v.currentTime = 2.6;
        }
      });
    }
    await wait(1500);
    const n = await p.evaluate(() => document.querySelectorAll('.brush:not(.brush--mark)').length);
    const rows = [];
    for (let i = 0; i < n; i++) {
      const before = await p.evaluate(read, i);
      await p.evaluate((i) => {
        document.querySelectorAll('.brush:not(.brush--mark)')[i].scrollIntoView({ block: 'center', behavior: 'instant' });
      }, i);
      await wait(1400);
      const at = await p.evaluate(read, i);
      rows.push({ before: { inView: before.inView, stroke: before.stroke, drawn: before.drawnAttr }, ...at });
      if (at.box) {
        const pad = 24;
        const x = Math.max(0, Math.min(at.box.x, at.wordBox.x) - pad);
        const y = Math.max(0, Math.min(at.box.y, at.wordBox.y) - pad);
        const right = Math.min(w, Math.max(at.box.x + at.box.w, at.wordBox.x + at.wordBox.w) + pad + 80);
        const bottom = Math.max(at.box.y + at.box.h, at.wordBox.y + at.wordBox.h) + pad;
        const sy = await p.evaluate(() => scrollY);
        await p.screenshot({
          path: path.join(OUT, `${route.replace(/\//g, '') || 'home'}-${w}-${i}.png`),
          clip: { x: x > 60 ? x - 60 : 0, y: y + sy, width: right - (x > 60 ? x - 60 : 0), height: bottom - y },
        });
      }
    }
    report.rest[`${route} ${w}`] = rows;
    await p.close();
  }
}

/* The About statement at rest, whole, at each width. */
for (const [w, h] of SIZES) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(BASE + '/about-us', { waitUntil: 'networkidle0' });
  await wait(1500);
  const box = await p.evaluate(() => {
    const r = document.querySelector('.ab3-hero__h').getBoundingClientRect();
    return { x: 0, y: Math.max(0, r.top - 24 + scrollY), width: innerWidth, height: r.height + 48 };
  });
  await p.screenshot({ path: path.join(OUT, `about-statement-${w}.png`), clip: box });
  await p.close();
}

/* Loaded wide, then narrowed: the stroke follows the word. */
{
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  await p.goto(BASE + '/about-us', { waitUntil: 'networkidle0' });
  await wait(1500);
  const wide = await p.evaluate(read, 0);
  await p.setViewport({ width: 390, height: 844 });
  await wait(1200);
  const narrow = await p.evaluate(read, 0);
  report.resize = {
    at1280: { wordW: wide.wordW, svgW: wide.svgW, expectW: wide.expectW },
    after390: { wordW: narrow.wordW, svgW: narrow.svgW, expectW: narrow.expectW, gapBefore: narrow.gapBefore, gapAfter: narrow.gapAfter },
  };
  await p.close();
}

await b.close();
report.consoleErrors = errors;
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
for (const [k, rows] of Object.entries(report.rest)) {
  for (const r of rows) {
    console.log(
      k.padEnd(15),
      r.text.padEnd(6),
      `before:${r.before.inView ? 'in' : 'out'}/${r.before.drawn}`,
      `drawn:${r.drawnAttr} inked:${r.inked} dash:${r.dash}`,
      `svg ${r.svgW} expect ${r.expectW}`,
      `gap ${r.gapBefore} | ${r.gapAfter}`,
      `rows ${r.rows}`,
      `ink ${r.ink}`
    );
  }
}
console.log('resize', JSON.stringify(report.resize));
console.log('errors', JSON.stringify(errors));

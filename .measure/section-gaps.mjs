/* section-gaps.mjs: home's section boundaries at a phone width (final35,
   2026-10-08, the founder). For each pair of neighbouring sections, the
   space from the last painted thing in the first (text, image, control) to
   the top of the next one's heading. With no lines between sections, this
   space is the only boundary, and it should be one value everywhere.

     node .measure/section-gaps.mjs [base] [width] [route]   (4190, 390, /) */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const W = Number(process.argv[3] || 390);
const ROUTE = process.argv[4] || '/';
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: W, height: 844 });
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await p.goto(BASE + ROUTE, { waitUntil: 'networkidle0' });
await p.evaluate(() => document.fonts.ready);
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 30));
  }
  window.scrollTo(0, 0);
});
const rows = await p.evaluate(() => {
  const vis = (e) => {
    const r = e.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    for (let n = e; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    }
    return true;
  };
  const painted = (e) =>
    [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) ||
    e.matches('img, video, svg, canvas, input, textarea, button, a, picture') ||
    getComputedStyle(e).backgroundColor.match(/rgba?\([^)]*\)/)?.[0].split(',').length === 3;
  const secs = [...document.querySelectorAll('main > section, main > div > section, body footer.sf')].filter(vis);
  const out = [];
  for (let i = 1; i < secs.length; i += 1) {
    const a = secs[i - 1];
    const bb = secs[i];
    let last = 0;
    let lastEl = null;
    for (const e of a.querySelectorAll('*')) {
      if (!vis(e) || !painted(e)) continue;
      const r = e.getBoundingClientRect();
      if (r.bottom > last) {
        last = r.bottom;
        lastEl = e;
      }
    }
    const h = bb.querySelector('h2, h1, .sf__talk');
    const top = h.getBoundingClientRect().top;
    const name = (s) => (s.querySelector('h1, h2, .sf__talk')?.textContent || s.className).trim().slice(0, 28);
    out.push({
      from: name(a),
      to: name(bb),
      gap: Math.round(top - last),
      lastEl: `${lastEl.tagName.toLowerCase()}.${String(lastEl.className).split(' ')[0]}`,
      padTop: getComputedStyle(bb).paddingTop,
      padBottom: getComputedStyle(a).paddingBottom,
    });
  }
  return out;
});
await b.close();
for (const r of rows) console.log(`${String(r.gap).padStart(5)}px  ${r.from}  ->  ${r.to}   (last: ${r.lastEl}; pad-bottom ${r.padBottom}, pad-top ${r.padTop})`);

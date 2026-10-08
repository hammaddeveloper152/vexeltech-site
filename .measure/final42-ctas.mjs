/* final42-ctas.mjs: every call to action on every route (FINAL42,
   2026-10-08, the founder). A call to action here is any rendered link or
   button whose words ask for the sale: "Get a custom quote", "Get a quote",
   "Ask a question", a form's submit, and any other filled or outlined
   button with words. Navigation links (the bar's, the footer's) are not
   calls. At 1280 and 390, for each: its label, where it stands (the
   nearest heading above it), and whether it is shown.

   Then, at 390, every screen of every route (one per 100px of scroll):
   how many "quote" calls are visible at once, the bar's included. More
   than one fails.

     node .measure/final42-ctas.mjs [base] [tag]   (default 4190, now) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const TAG = process.argv[3] || 'now';
const OUT = path.join('.measure', 'out', 'final42');
fs.mkdirSync(OUT, { recursive: true });
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/privacy-policy', '/terms-of-service', '/thanks', '/nope'];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const FIND = () => {
  const visible = (e) => {
    const r = e.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    for (let n = e; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    }
    return true;
  };
  const isCall = (e) => {
    if (e.closest('.sf, .bar__nav, .bar__panel nav, .skip, .wwd__card') && !e.matches('.bar__cta, .bar__cta--panel')) return false;
    const t = (e.innerText || e.value || '').replace(/\s+/g, ' ').trim();
    if (/quote|ask a question|^send\b|book a call|return to homepage/i.test(t)) return true;
    if (e.matches('[type=submit], .lf__submit')) return true;
    const cs = getComputedStyle(e);
    const filled = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
    const outlined = ['Top', 'Bottom', 'Left', 'Right'].every((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none');
    return e.tagName === 'A' && (filled || outlined) && t.length > 0 && !e.closest('[data-artifact]');
  };
  const where = (e) => {
    if (e.closest('.bar')) return 'header';
    const heads = [...document.querySelectorAll('h1, h2, h3')].filter((h) => h.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING);
    const h = heads[heads.length - 1];
    return h ? `under "${h.textContent.replace(/\s+/g, ' ').trim().slice(0, 40)}"` : 'top';
  };
  return [...document.querySelectorAll('a, button, input[type=submit]')]
    .filter(isCall)
    .map((e) => ({
      label: (e.innerText || e.value || '').replace(/\s+/g, ' ').trim(),
      where: where(e),
      shown: visible(e),
      cls: String(e.className).split(' ')[0],
    }));
};

const b = await puppeteer.launch({ headless: 'new' });
const report = {};
for (const w of [1280, 390]) {
  for (const route of ROUTES) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 20));
      }
      window.scrollTo(0, 0);
    });
    const calls = await p.evaluate(FIND);
    report[`${route} @${w}`] = { calls };
    /* At 390: the quote calls visible at once, screen by screen. */
    if (w === 390) {
      const H = await p.evaluate(() => document.documentElement.scrollHeight);
      let worst = 0;
      const doubles = [];
      for (let y = 0; y < H; y += 100) {
        await p.evaluate((y) => window.scrollTo(0, y), y);
        /* 300ms: the bar's call fades over 150ms when it is held. */
        await wait(300);
        const seen = await p.evaluate(() =>
          [...document.querySelectorAll('a, button')]
            .filter((e) => !e.closest('.wwd__card') && !e.matches('.dt__link') && /get a (custom )?quote/i.test(e.innerText || ''))
            .filter((e) => {
              const r = e.getBoundingClientRect();
              if (!r.width || r.bottom <= 0 || r.top >= innerHeight) return false;
              for (let n = e; n; n = n.parentElement) {
                const cs = getComputedStyle(n);
                if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
              }
              /* Covered (a call scrolled under the bar's ground): not seen.
                 Read at the middle of the call's part on screen. */
              const y = (Math.max(r.top, 0) + Math.min(r.bottom, innerHeight)) / 2;
              const top = document.elementFromPoint(r.left + r.width / 2, y);
              return !!top && (e === top || e.contains(top));
            })
            .map((e) => String(e.className).split(' ')[0])
        );
        worst = Math.max(worst, seen.length);
        if (seen.length > 1) doubles.push(`${y}px: ${seen.join(' + ')}`);
      }
      report[`${route} @${w}`].quoteAtOnce = worst;
      report[`${route} @${w}`].doubles = doubles;
    }
    await p.close();
  }
}
await b.close();
fs.writeFileSync(path.join(OUT, `ctas-${TAG}.json`), JSON.stringify(report, null, 1));
for (const [k, v] of Object.entries(report)) {
  const shown = v.calls.filter((c) => c.shown);
  console.log(`== ${k}: ${shown.length} calls shown${v.quoteAtOnce !== undefined ? `; most "quote" calls in one 390 screen: ${v.quoteAtOnce}` : ''}`);
  for (const c of v.calls) console.log(`   ${c.shown ? '' : '(hidden) '}"${c.label}"  ${c.where}  [${c.cls}]`);
  if (v.doubles && v.doubles.length) console.log(`   TWO AT ONCE at ${v.doubles.length} scroll positions, e.g. ${v.doubles.slice(0, 3).join('; ')}`);
}

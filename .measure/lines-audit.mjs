/* lines-audit.mjs: every line that renders on a route (the founder's lines
   audit, final34, 2026-10-08). At 1280 and 390, reduced motion, every
   element and its ::before / ::after is read for:
     - a visible border on any side (width > 0, colour alpha > 0, style not
       none), counted once per element and side
     - an <hr>
     - a painted bar: a box 0.5 to 4px tall (or wide) and 24px or more
       long, with a visible background colour or image
   Elements inside the bar's own controls and the form's line fields are
   included like everything else; the report says where each line is.
   Lines inside a [data-artifact] stage are listed as such: they are part
   of a depicted object (a receipt, a contract, a mockup).

     node .measure/lines-audit.mjs [base] [tag] [outdir]   (4190, now, final34)
   Writes .measure/out/final34/lines-<tag>.json and prints counts per
   route and the distinct lines grouped by selector. */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const TAG = process.argv[3] || 'now';
const OUT = process.argv[4] || path.join('.measure', 'out', 'final34');
fs.mkdirSync(OUT, { recursive: true });
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/privacy-policy', '/terms-of-service', '/thanks', '/nope'];
const b = await puppeteer.launch({ headless: 'new' });
const all = {};
for (const w of [1280, 390]) {
  for (const route of ROUTES) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 25));
      }
    });
    const lines = await p.evaluate(() => {
      const out = [];
      const alpha = (c) => {
        const m = c.match(/rgba?\(([^)]+)\)/);
        if (!m) return c === 'transparent' ? 0 : 1;
        const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
        return v.length > 3 ? v[3] : 1;
      };
      const label = (e, pseudo) => {
        const cls = String(e.className.baseVal ?? e.className).trim().split(/\s+/).slice(0, 2).join('.');
        return `${e.tagName.toLowerCase()}${cls ? `.${cls}` : ''}${pseudo || ''}`;
      };
      const visible = (e) => {
        const r = e.getBoundingClientRect();
        if (!r.width || !r.height) return false;
        for (let n = e; n; n = n.parentElement) {
          const cs = getComputedStyle(n);
          if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
        }
        return true;
      };
      for (const e of document.querySelectorAll('body *')) {
        if (!visible(e)) continue;
        if (e.closest('[aria-hidden="true"]') && e.closest('.skip, .lf__trap')) continue;
        const art = e.closest('[data-artifact]') ? ' [in artifact]' : '';
        const cs = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        /* A border on all four sides is a control's or a card's outline,
           not a rule between two things: listed as an outline. */
        const sides = ['Top', 'Bottom', 'Left', 'Right'].filter(
          (sd) => parseFloat(cs[`border${sd}Width`]) > 0 && cs[`border${sd}Style`] !== 'none' && alpha(cs[`border${sd}Color`]) > 0
        );
        if (sides.length === 4) {
          out.push(`${label(e)} outline${art}`);
          continue;
        }
        for (const side of ['Top', 'Bottom', 'Left', 'Right']) {
          const wv = parseFloat(cs[`border${side}Width`]);
          if (wv > 0 && cs[`border${side}Style`] !== 'none' && alpha(cs[`border${side}Color`]) > 0) {
            const len = side === 'Top' || side === 'Bottom' ? r.width : r.height;
            if (len >= 24) out.push(`${label(e)} border-${side.toLowerCase()} ${wv}px${art}`);
          }
        }
        if (e.tagName === 'HR') out.push(`hr${art}`);
        for (const pseudo of ['::before', '::after', '']) {
          const ps = pseudo ? getComputedStyle(e, pseudo) : cs;
          if (pseudo && (ps.content === 'none' || ps.content === 'normal')) continue;
          const h = pseudo ? parseFloat(ps.height) : r.height;
          const wd = pseudo ? parseFloat(ps.width) || r.width : r.width;
          const bg = alpha(ps.backgroundColor) > 0 || ps.backgroundImage !== 'none';
          if (!bg) continue;
          const thinH = h >= 0.5 && h <= 4 && wd >= 24;
          const thinW = wd >= 0.5 && wd <= 4 && h >= 24;
          if (thinH || thinW) out.push(`${label(e, pseudo)} bar ${thinH ? `${Math.round(h * 10) / 10}px tall` : `${Math.round(wd * 10) / 10}px wide`}${art}`);
        }
      }
      return out;
    });
    all[`${route} @${w}`] = lines;
    await p.close();
  }
}
await b.close();
fs.writeFileSync(path.join(OUT, `lines-${TAG}.json`), JSON.stringify(all, null, 1));
for (const [k, v] of Object.entries(all)) {
  const inArt = v.filter((x) => x.includes('[in artifact]')).length;
  console.log(`${k.padEnd(24)} ${String(v.length).padStart(4)} lines (${inArt} inside artifacts)`);
}
const tally = {};
for (const v of Object.values(all)) for (const x of v) tally[x] = (tally[x] || 0) + 1;
console.log('\ndistinct lines, with how many times each renders across all routes and widths:');
for (const [k, n] of Object.entries(tally).sort((a, b) => b[1] - a[1])) console.log(`${String(n).padStart(5)}  ${k}`);

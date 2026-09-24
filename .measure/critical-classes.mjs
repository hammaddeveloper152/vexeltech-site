/* critical-classes.mjs: which classes paint above the fold on home, at a
   phone, a tablet and a laptop, before any scroll. The build's critical-CSS
   plugin (vite.config.js) inlines the rules that use only these classes, and
   loads the full stylesheet without blocking.

     node .measure/critical-classes.mjs [base]

   Writes src/critical-classes.json, which vite.config.js reads. It is a
   build input, so it is committed in src/ (this directory ignores *.json). Re-run
   after a change to the header or the hero; if it is stale, the full
   stylesheet still arrives and styles everything, so the cost is a flash
   above the fold, never a broken page. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'http://localhost:4173';
const b = await puppeteer.launch({ headless: 'new' });
const found = new Set();
for (const [w, h] of [[390, 844], [768, 1024], [1280, 800], [1440, 900]]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1500));
  const cls = await p.evaluate(() => {
    const out = new Set();
    const vh = innerHeight;
    /* Painted, on screen: a real box inside the first viewport, not hidden,
       not transparent all the way up. A display:none element reports a zero
       box at 0,0, which is why the box must be non-empty: counting those
       inlined half of a hidden element's rules (a footer swash, a margin
       label) without the rules that hide or place it. The painted element's
       ancestors count too, since they lay it out. */
    const shown = (el) => {
      for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
      }
      return true;
    };
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0 && r.top < vh && r.bottom > 0)) continue;
      if (!shown(el)) continue;
      for (let e = el; e && e !== document.body; e = e.parentElement) for (const c of e.classList) out.add(c);
    }
    for (const c of document.documentElement.classList) out.add(c);
    for (const c of document.body.classList) out.add(c);
    return [...out];
  });
  cls.forEach((c) => found.add(c));
  await p.close();
}
await b.close();
const list = [...found].sort();
fs.writeFileSync(path.join(HERE, '..', 'src', 'critical-classes.json'), JSON.stringify(list, null, 1) + '\n');
console.log(list.length, 'classes');

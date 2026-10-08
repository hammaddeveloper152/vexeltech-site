/* final43-whitespace.mjs: the whitespace audit (FINAL43, 2026-10-09, the
   founder). Every route at 1280 and 390, at rest (reduced motion). Each
   section's content is read as blocks: every element that paints content
   (its own text, an image, a field, a control), except that an artifact
   ([data-artifact]) is one block, and anything clipped out of sight (a
   closed Details panel) is left out. Each block's gap is measured to its
   nearest block above IN ITS OWN COLUMN (the nearest block above whose
   horizontal span overlaps it), so a tall column beside a short one does
   not hide the short one's gaps. B's span is its line's: every block that
   shares B's line widens it (a link beside its icon, a note beside a
   button). A block laid over another (a label over its image) has no gap. A gap to a block in the same section is
   an inner gap; a section's first block measured to the section before
   is a boundary.

   Reported: every inner gap over 120px at 1280 or over 96px at 390, with
   the two elements either side; and every boundary, for the record.

     node .measure/final43-whitespace.mjs [base] [tag]   (4190, now) */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const TAG = process.argv[3] || 'now';
const OUT = path.join('.measure', 'out', 'final43');
fs.mkdirSync(OUT, { recursive: true });
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/privacy-policy', '/terms-of-service', '/thanks', '/nope'];

const READ = () => {
  const name = (e) => {
    const cls = String(e.className.baseVal ?? e.className).trim().split(/\s+/)[0];
    const t = (e.getAttribute('data-artifact') || e.innerText || e.alt || '').replace(/\s+/g, ' ').trim().slice(0, 30);
    return `${e.tagName.toLowerCase()}${cls ? `.${cls}` : ''}${t ? ` "${t}"` : ''}`;
  };
  const shown = (e) => {
    const r = e.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    for (let n = e; n && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
      if (n !== e && cs.overflow !== 'visible' && (cs.overflowY !== 'visible' || cs.overflowX !== 'visible')) {
        const a = n.getBoundingClientRect();
        if (r.bottom <= a.top + 0.5 || r.top >= a.bottom - 0.5) return false;
      }
    }
    return !e.closest('[inert]');
  };
  const paints = (e) =>
    [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) ||
    e.matches('img, svg, video, canvas, input, textarea, select, button, hr, picture');
  const sections = [...document.querySelectorAll('main > section, main > header, main > div > section, footer.sf')].filter(shown);
  const out = [];
  for (const sec of sections) {
    const blocks = [];
    const seen = new Set();
    for (const e of sec.querySelectorAll('*')) {
      if (!paints(e) && !e.matches('[data-artifact]')) continue;
      const art = e.closest('[data-artifact]');
      /* An inline element is read as its line: the nearest box that is not
         inline holds it. */
      let box = e;
      while (box !== sec && /^inline($|-flex|-block)?$/.test(getComputedStyle(box).display) && getComputedStyle(box).display === 'inline') box = box.parentElement;
      const unit = art && sec.contains(art) && art !== sec ? art : box;
      if (seen.has(unit)) continue;
      if (!shown(unit)) continue;
      seen.add(unit);
      const r = unit.getBoundingClientRect();
      blocks.push({ top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right, el: name(unit) });
    }
    out.push({ sec: name(sec).slice(0, 50), blocks });
  }
  return out;
};

const b = await puppeteer.launch({ headless: 'new' });
const report = {};
for (const w of [1280, 390]) {
  for (const route of ROUTES) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 20));
      }
      window.scrollTo(0, 0);
    });
    const secs = await p.evaluate(READ);
    const cap = w === 1280 ? 120 : 96;
    const inner = [];
    const bounds = [];
    const all = secs.flatMap((s, i) => s.blocks.map((bl) => ({ ...bl, si: i })));
    const seenGap = new Set();
    const over = (a, l, r) => Math.min(a.right, r) - Math.max(a.left, l) >= 8;
    for (const B of all) {
      /* Laid over another block: no gap. */
      if (all.some((c) => c !== B && c.top < B.top - 1 && c.bottom > B.top + 1 && over(c, B.left, B.right))) continue;
      /* B's line. */
      let L = B.left;
      let R = B.right;
      for (const c of all) {
        if (c.si === B.si && c.top < B.bottom - 1 && c.bottom > B.top + 1) {
          L = Math.min(L, c.left);
          R = Math.max(R, c.right);
        }
      }
      /* The nearest block above in B's column. */
      let A = null;
      for (const c of all) {
        if (c === B || c.bottom > B.top + 1) continue;
        if (!over(c, L, R)) continue;
        if (!A || c.bottom > A.bottom) A = c;
      }
      if (!A) continue;
      const g = Math.round(B.top - A.bottom);
      if (A.si === B.si) {
        const key = `${A.el}|${B.el}`;
        if (g > cap && !seenGap.has(key)) {
          seenGap.add(key);
          inner.push({ sec: secs[B.si].sec, gap: g, from: A.el, to: B.el });
        }
      } else if (B.si === A.si + 1 && !bounds.some((x) => x.si === B.si)) {
        bounds.push({ si: B.si, from: secs[A.si].sec, to: secs[B.si].sec, gap: g });
      }
    }
    report[`${route} @${w}`] = { inner, bounds };
    await p.close();
  }
}
await b.close();
fs.writeFileSync(path.join(OUT, `whitespace-${TAG}.json`), JSON.stringify(report, null, 1));
let total = 0;
for (const [k, v] of Object.entries(report)) {
  total += v.inner.length;
  console.log(`== ${k}: ${v.inner.length} inner gap${v.inner.length === 1 ? '' : 's'} over the cap`);
  for (const g of v.inner) console.log(`   ${String(g.gap).padStart(4)}px in ${g.sec}: ${g.from}  ->  ${g.to}`);
  console.log(`   boundaries: ${v.bounds.map((x) => x.gap).join(', ')}`);
}
console.log(`\n${total} inner gaps over the cap`);

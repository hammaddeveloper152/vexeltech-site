/* The budget of every remaining placeholder slot, measured on the built page.

   TWO KINDS OF SLOT, and they have to be measured differently. The first
   version of this script measured both the same way and returned "400 chars"
   for the counter figures and the marquee names, which is the binary search
   hitting its ceiling because those elements never wrap: they are sized BY
   their content, so the constraint is width, not line count.

   A: WRAPPING — the element sits in a fixed-width column and gains lines.
      Grow the text and find the last length inside the allowed line count.

   B: CONTENT-SIZED — the element grows the layout instead of wrapping.
      Freeze the width its column actually offers and find the last length
      that still fits on one line. */
import puppeteer from 'puppeteer';

const SAMPLE = 'Marketing and websites for owner run businesses that need work done properly ';
const DIGITS = '1234567890';

const SLOTS = [
  ['.fail__h',          'Failures section heading',    'wrap', 1, 'text'],
  ['.counters__h',      'Counter row section heading', 'wrap', 1, 'text'],
  ['.counters__n',      'Counter figure, each of 4',   'width', 1, 'digits'],
  ['.counters__l',      'Counter label, each of 4',    'wrap', 2, 'text'],
  ['.marquee__slot',    'Marquee client name, of 8',   'width', 1, 'text'],
  ['.work__label-t',    'Work title, each of 6',       'wrap', 2, 'text'],
  ['.work__label-m',    'Work discipline, each of 6',  'wrap', 1, 'text'],
  ['.about__statement', 'About statement',             'wrap', 4, 'text'],
  ['.about__support',   'About supporting paragraph',  'wrap', 6, 'text'],
  ['.quotes__q p',      'Testimonial quote, of 4',     'wrap', 5, 'text'],
  ['.quotes__name',     'Testimonial name',            'width', 1, 'text'],
  ['.quotes__co',       'Testimonial company',         'width', 1, 'text'],
  ['.foot__legal',      'Footer legal line',           'width', 1, 'text'],
  ['.faq__q-t',         'FAQ question, item 4',        'wrap', 2, 'text'],
];

const b = await puppeteer.launch({ headless: 'new' });

for (const W of [1280, 390]) {
  console.log(`\n================ ${W} ================`);
  const p = await b.newPage();
  await p.setViewport({ width: W, height: 900 });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 2800));

  const rows = await p.evaluate(
    ([slots, sample, digits]) => {
      const make = (k, n) =>
        k === 'digits' ? digits.repeat(40).slice(0, n) : sample.repeat(14).slice(0, n).trim();

      return slots.map(([sel, label, mode, allowed, kind]) => {
        const el = document.querySelector(sel);
        if (!el) return { label, missing: sel };
        const cs = getComputedStyle(el);
        const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
        const face = cs.fontFamily.split(',')[0].replace(/"/g, '');
        const size = Math.round(parseFloat(cs.fontSize) * 10) / 10;

        /* Only the element's own text is swapped, so any icon child stays
           and keeps costing the width it really costs. */
        const node = [...el.childNodes].find((n) => n.nodeType === 3) || el.appendChild(document.createTextNode(''));
        const orig = node.nodeValue;

        let avail;
        if (mode === 'width') {
          /* The column the element is allowed to occupy, not the width it
             has grown itself to. */
          const par = el.parentElement;
          const pcs = getComputedStyle(par);
          avail = par.getBoundingClientRect().width - parseFloat(pcs.paddingLeft) - parseFloat(pcs.paddingRight);
        }

        const fits = (n) => {
          node.nodeValue = make(kind, n);
          const r = el.getBoundingClientRect();
          return mode === 'width' ? r.width <= avail : Math.max(1, Math.round(r.height / lh)) <= allowed;
        };

        let lo = 1, hi = 300, best = 0;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          if (fits(mid)) { best = mid; lo = mid + 1; } else { hi = mid - 1; }
        }
        node.nodeValue = orig;
        return {
          label, best, size, lh: Math.round(lh), face, mode, allowed,
          avail: avail ? Math.round(avail) : Math.round(el.getBoundingClientRect().width),
        };
      });
    },
    [SLOTS, SAMPLE, DIGITS]
  );

  rows.forEach((r) => {
    if (r.missing) { console.log(`  ${r.label.padEnd(30)} NOT FOUND ${r.missing}`); return; }
    const how = r.mode === 'width' ? `1 line in ${r.avail}px` : `${r.allowed} line${r.allowed > 1 ? 's' : ''} @ ${r.avail}px`;
    console.log(`  ${r.label.padEnd(30)} ${String(r.best).padStart(3)} chars   ${how.padEnd(18)} ${r.face} ${r.size}/${r.lh}`);
  });
  await p.close();
}
await b.close();

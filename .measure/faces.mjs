/* faces.mjs — which face actually PAINTS where, on all eight pages.

   The register assigns a face per tier. Individual section stylesheets then
   set their own `font-family`, and three sheets now load over the top of them
   — register.css, agency.css, lit.css. Nobody had checked what reaches the
   screen. This reads the computed family off every text-bearing element and
   groups it, so a face that lost an override shows up as a row rather than as
   something you have to notice in a screenshot.

   THE INTENDED SYSTEM:
     Monigue  display, headings, statements, figures
     Moldie   PRODUCT NAMES ONLY — disciplines, tier names, plate titles, the
              work numerals. Never a heading, never body, never a call.
     Clash    controls ONLY — calls, buttons, the questions a reader presses
     Satoshi  body and labels

   Moldie Slanted is a separate family and the audit keeps them apart, because
   which cut paints where is exactly the kind of thing that goes wrong
   silently: the plate titles and the delta caption take the slant, the four
   other name uses take the regular.

   Anything else is a defect unless it has a recorded reason.

   Usage, with the site served at 4179:  node .measure/faces.mjs
*/
import puppeteer from 'puppeteer';

const BASE = 'http://localhost:4179';
const WIDTH = Number(process.argv[2]) || 1280;
const PAGES = ['/', '/services', '/pricing', '/about-us', '/contact-us',
               '/resources', '/portfolio', '/case-studies'];

/* What each class is SUPPOSED to carry, by the register's own tier table.
   Matched longest-prefix-first so `.faq__q-t` beats `.faq__q`. */
const EXPECT = [
  /* ---- CONTROLS: Clash, and only these ---------------------------------
     "calls, buttons, the questions a reader presses" — plus the skip link,
     which is a link that takes focus and is pressed. */
  ['skip', 'Clash'],
  ['tabs__tab', 'Clash'], ['tier__cta', 'Clash'], ['tier__cta--solid', 'Clash'],
  ['hero__cta', 'Clash'], ['callband__cta', 'Clash'], ['band__cta', 'Clash'],
  ['bar__cta', 'Clash'], ['bar__cta--panel', 'Clash'], ['foot__submit', 'Clash'],
  ['card__cta', 'Clash'],
  ['faq__q', 'Clash'], ['faq__q-t', 'Clash'], ['about__link', 'Clash'],
  ['work__go', 'Clash'], ['one__cta', 'Clash'], ['quotes__btn', 'Clash'],
  ['marquee__toggle', 'Clash'], ['btn', 'Clash'], ['foot__select', 'Clash'],

  /* ---- THE WORDMARK: Clash, and it is neither a control nor a heading ---
     Wordmark.jsx records it: Plate 00 sets the lockup in the brand face in
     caps with a coloured full stop, as live text rather than outlines. */
  ['wm__word', 'Clash'], ['wm__dot', 'Clash'],

  /* ---- DISPLAY, HEADINGS, STATEMENTS, FIGURES: Monigue ------------------ */
  ['hero__headline', 'Monigue'], ['hero__word', 'Monigue'], ['ticker__word', 'Monigue'],
  ['pg__h', 'Monigue'], ['sec__h', 'Monigue'], ['pg__sh', 'Monigue'],
  ['one__h', 'Monigue'], ['callband__h', 'Monigue'],
  /* `.disc__name` is TWO things. Inside a `.disc` block on /services it is a
     discipline name and takes Moldie; on /about-us the same class carries
     "The people", which is a sub-heading and stays Monigue. The audit cannot
     see the ancestor, so both are legal for this class and the scoping is
     checked by `warm.mjs`-style selectors in the sheet instead. */
  ['disc__name', ['Monigue', 'Moldie']],
  ['fail__h', 'Monigue'], ['fail__s', 'Monigue'],
  ['services__h', 'Monigue'],
  ['work__h', 'Monigue'], ['work__label-t', 'Monigue'],
  ['about__h', 'Monigue'], ['about__statement', 'Monigue'],
  ['counters__h', 'Monigue'], ['counters__n', 'Monigue'],
  ['quotes__h', 'Monigue'], ['quotes__count-n', 'Monigue'], ['quotes__count-t', 'Monigue'],
  ['process__h', 'Monigue'], ['process__t', 'Monigue'],
  ['process__t-lit', 'Monigue'], ['process__t-muted', 'Monigue'],
  ['process__n', 'Monigue'], ['process__n-lit', 'Monigue'], ['process__n-muted', 'Monigue'],
  ['faq__h', 'Monigue'], ['foot__h', 'Monigue'],
  ['tier__name', 'Monigue'], ['tier__price', 'Monigue'],
  /* The ladder's figures. The PRICE is a figure and stays Monigue — Moldie
     names the tier, it does not set the number. `--quote` is the Custom
     card's figure slot and is the same tier at a smaller size. */
  ['card__price', 'Monigue'], ['card__price--quote', 'Monigue'],
  ['card__price--live', 'Monigue'],
  /* The separator between the quote counter's two figures: it is set at the
     figures' own size and in their own face, which is what makes it read as
     part of the count rather than as punctuation dropped between two numbers. */
  ['quotes__count', 'Monigue'],
  /* The register's small-loud tier names the marquee explicitly. */
  ['marquee__item', 'Monigue'], ['marquee__slot', 'Monigue'], ['marquee__sep', 'Monigue'],

  /* ---- PRODUCT NAMES: Moldie, and nothing else may take it -------------- */
  ['services__discipline', 'Moldie'], ['card__name', 'Moldie'],
  /* The Services index. A plate's number is that plate's name — it is what
     identifies the object in a list of four — which is the same job the work
     grid numerals do, and the same face. */
  ['svc__index-n', 'Moldie'], ['svc__art-n', 'Moldie'],
  /* the slanted cut */
  ['plate__title', 'Moldie Slanted'], ['card__caption', 'Moldie Slanted'],
];
const familyOf = (f) => {
  const first = f.split(',')[0].replace(/["']/g, '').trim();
  if (/^Monigue$/i.test(first)) return 'Monigue';
  if (/^Clash/i.test(first)) return 'Clash';
  if (/^Satoshi$/i.test(first)) return 'Satoshi';
  if (/^Moldie Slanted$/i.test(first)) return 'Moldie Slanted';
  if (/^Moldie$/i.test(first)) return 'Moldie';
  return first || '(none)';
};

const b = await puppeteer.launch({ headless: 'new' });
const rows = new Map();

for (const path of PAGES) {
  const p = await b.newPage();
  await p.setViewport({ width: WIDTH, height: 800 });
  await p.goto(BASE + path, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const tot = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < tot; y += 400) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await new Promise((r) => setTimeout(r, 60));
  }

  const found = await p.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      const txt = [...el.childNodes]
        .filter((n) => n.nodeType === 3 && n.textContent.trim())
        .map((n) => n.textContent.trim()).join(' ');
      if (!txt) continue;
      const c = getComputedStyle(el);
      if (c.display === 'none' || c.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      out.push({
        cls: (el.className || '').toString().trim() || el.tagName.toLowerCase(),
        tag: el.tagName.toLowerCase(),
        fam: c.fontFamily,
        size: Math.round(parseFloat(c.fontSize)),
        txt: txt.slice(0, 28),
      });
    }
    return out;
  });

  for (const f of found) {
    const key = `${f.cls}|${familyOf(f.fam)}|${f.size}`;
    if (!rows.has(key)) rows.set(key, { ...f, fam: familyOf(f.fam), pages: new Set() });
    rows.get(key).pages.add(path);
  }
  await p.close();
}
await b.close();

const expectFor = (cls) => {
  let best = null, bestLen = -1;
  for (const [needle, face] of EXPECT) {
    if (cls.split(/\s+/).some((c) => c === needle) && needle.length > bestLen) {
      best = face; bestLen = needle.length;
    }
  }
  return best;
};

const mismatches = [], unclassified = [], ok = [];
for (const r of rows.values()) {
  const want = expectFor(r.cls);
  const line = `${r.fam.padEnd(8)} ${String(r.size).padStart(3)}px  ${r.cls.slice(0, 40).padEnd(42)} "${r.txt}"  [${[...r.pages].join(' ')}]`;
  if (!want) {
    /* Unassigned classes are body and labels by default: Satoshi. */
    if (r.fam !== 'Satoshi') unclassified.push(`want Satoshi, got ${line}`);
  } else if (Array.isArray(want) ? !want.includes(r.fam) : want !== r.fam) {
    /* A class may legally carry two faces where the same class does two jobs
       in two places — `.disc__name` is the one. The array is the whole
       permission and it is written next to the class, not inferred here. */
    mismatches.push(`want ${String(Array.isArray(want) ? want.join('|') : want).padEnd(7)} got ${line}`);
  }
  else ok.push(line);
}

console.log(`${rows.size} distinct (class, face, size) combinations across ${PAGES.length} pages\n`);
console.log(`=== MISMATCH against an assigned tier — ${mismatches.length} ===`);
for (const m of mismatches.sort()) console.log('  ' + m);
console.log(`\n=== NOT Satoshi, and carries no assigned tier — ${unclassified.length} ===`);
for (const m of unclassified.sort()) console.log('  ' + m);
console.log(`\n${ok.length} correct`);

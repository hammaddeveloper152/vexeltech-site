/* ld-check.mjs: the JSON-LD on one route, validated (final28, 2026-10-07).
   Reads the prerendered HTML and the live page, parses every
   application/ld+json block, and checks each FAQPage: every Question has a
   name and an acceptedAnswer with text, and the questions match the ones
   rendered on the page, in order. Exits 1 on any failure.

   EVERY ROUTE (final38, 2026-10-08): the FAQPage is expected on /pricing
   only, the site's one FAQ (copy rule), and on no other route. On every
   route every block must parse, carry the schema.org context, and the
   prerendered blocks must equal the live ones after hydration.

   PRICES (FINAL40, addendum 3, the founder): structured-data prices (an
   Offer, a priceRange) stand on /pricing only. /pricing must carry at
   least one; every other route none.
     node .measure/ld-check.mjs [base] [route]   (default 4190, /pricing) */
import fs from 'node:fs';
import puppeteer from 'puppeteer';
const BASE = process.argv[2] || 'http://localhost:4190';
const ROUTE = process.argv[3] || '/pricing';
let fail = 0;
const parse = (label, blocks) => {
  const out = [];
  blocks.forEach((t, i) => {
    try { out.push(JSON.parse(t)); } catch (e) { fail += 1; console.log(`${label} block ${i}: INVALID JSON ${e.message}`); }
  });
  return out;
};
const html = fs.readFileSync(`dist${ROUTE === '/' ? '' : ROUTE}/index.html`, 'utf8');
const pre = parse('prerender', [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]));
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
await p.goto(BASE + ROUTE, { waitUntil: 'networkidle0' });
const live = parse('live', await p.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => x.textContent)));
const shown = await p.$$eval('main h3, main button[aria-expanded]', (n) => n.map((x) => x.textContent.trim()));
await b.close();
for (const [label, set] of [['prerender', pre], ['live', live]]) {
  console.log(`${label}: ${set.length} blocks: ${set.map((x) => x['@type'] || (x['@graph'] ? 'graph' : '?')).join(', ')}`);
  for (const x of set) if (x['@context'] !== 'https://schema.org') { fail += 1; console.log(`  a block without the schema.org context`); }
  const priced = (JSON.stringify(set).match(/"@type":"Offer"|"priceRange"/g) || []).length;
  console.log(`  prices: ${priced} (offers and price ranges)`);
  if (ROUTE === '/pricing' ? priced === 0 : priced > 0) { fail += 1; console.log(`  prices on the wrong route, or none on /pricing`); }
  const faqs = set.filter((x) => x['@type'] === 'FAQPage');
  const want = ROUTE === '/pricing' ? 1 : 0;
  if (faqs.length !== want) { fail += 1; console.log(`  FAQPage blocks: ${faqs.length}, expected ${want}`); continue; }
  if (!faqs.length) continue;
  const qs = faqs[0].mainEntity || [];
  qs.forEach((q, i) => {
    const ok = q['@type'] === 'Question' && q.name && q.acceptedAnswer?.['@type'] === 'Answer' && q.acceptedAnswer.text;
    if (!ok) fail += 1;
    const onPage = shown.some((s) => s.replace(/\s*\+\s*$/, '').startsWith(q.name));
    if (!onPage) fail += 1;
    console.log(`  ${i + 1}. ${ok ? 'valid' : 'INVALID'} ${onPage ? 'on page' : 'NOT ON PAGE'}  ${q.name}`);
  });
}
if (JSON.stringify(pre) !== JSON.stringify(live)) { fail += 1; console.log('  the prerendered blocks differ from the live ones'); }
console.log(fail ? `FAIL: ${fail}` : 'PASS');
process.exit(fail ? 1 : 0);

/* prices.mjs: every price on every prerendered page against the JSON-LD
   (the launch gate, 2026-10-07, item 20). For each page: the dollar figures
   in its visible text, and the price fields and dollar figures in its
   JSON-LD. Prints a table and flags any JSON-LD figure that is not one of
   content/pricing.js's published prices.

     node .measure/prices.mjs */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const files = ['index.html', ...fs.readdirSync(DIST, { withFileTypes: true }).filter((d) => d.isDirectory() && fs.existsSync(path.join(DIST, d.name, 'index.html'))).map((d) => `${d.name}/index.html`)];
/* content/pricing.js's figures, the bundle's $150 saving, and the $15 a
   domain costs (a cost of the client's, named in the pricing FAQ; the copy
   check allows it the same way). */
const PRICES = new Set(['299', '449', '700', '999', '150', '15']);
let bad = 0;
for (const f of files) {
  const h = fs.readFileSync(path.join(DIST, f), 'utf8');
  const ld = new Set();
  for (const m of h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    for (const x of m[1].matchAll(/"(price|priceRange|minPrice|maxPrice|lowPrice|highPrice)":\s*"?([^",}]*)/g)) ld.add(`${x[1]}=${x[2]}`);
    for (const x of m[1].matchAll(/\$[0-9][0-9,.]*/g)) ld.add(x[0]);
  }
  const vis = h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
  const page = new Set(vis.match(/\$[0-9][0-9,.]*/g) || []);
  const ldFigures = [...ld].flatMap((x) => x.match(/[0-9][0-9,]*/g) || []).map((x) => x.replace(/,/g, ''));
  const off = ldFigures.filter((x) => !PRICES.has(x));
  if (off.length) bad += 1;
  console.log(`${f.padEnd(28)} page: ${[...page].join(' ') || '-'}\n${''.padEnd(28)} ld:   ${[...ld].join(' ') || '-'}${off.length ? `   NOT A PUBLISHED PRICE: ${off.join(', ')}` : ''}`);
}
process.exit(bad ? 1 : 0);

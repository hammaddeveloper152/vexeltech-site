/* grounds2.mjs — every section on the site and what it paints.

   The audit that has to come before a lighting rig. A page whose sections each
   decide their own ground has as many light sources as it has sections, and
   the only way to see that is to list them: what colour each one lays down,
   how many gradient layers it carries, and whether it draws a line at its own
   edge.

   `paints` is the question. A section that paints nothing is transparent over
   whatever is behind it, which is what a rig needs; a section that paints
   asphalt over asphalt is invisible and still a second light source.
*/
import puppeteer from 'puppeteer';

const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us',
                '/portfolio', '/case-studies', '/resources'];

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });

const rows = [];
for (const route of ROUTES) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  await p.goto('http://localhost:4179' + route, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2000));
  const tot = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < tot; y += 450) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 80));
  }

  const found = await p.evaluate(() => {
    const px = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    const named = {
      '23,24,26': 'asphalt', '30,31,34': 'lit-near', '17,18,20': 'lit-far',
      '43,45,49': 'lit-raised', '244,243,240': 'concrete', '255,255,255': 'white',
      '240,179,35': 'machine yellow', '236,234,229': 'concrete-far',
    };
    const out = [];
    for (const el of document.querySelectorAll('section, footer, header')) {
      const c = getComputedStyle(el);
      const v = px(c.backgroundColor);
      const a = v.length === 4 ? v[3] : 1;
      const key = v.slice(0, 3).map(Math.round).join(',');
      const layers = c.backgroundImage === 'none'
        ? 0 : c.backgroundImage.split(/,(?![^(]*\))/).length;
      /* a border or a box-shadow that draws a line at the section's own edge */
      const edges = ['Top', 'Right', 'Bottom', 'Left']
        .filter((s) => parseFloat(c[`border${s}Width`]) > 0 &&
                       c[`border${s}Style`] !== 'none' &&
                       (px(c[`border${s}Color`])[3] ?? 1) > 0)
        .map((s) => s[0].toLowerCase());
      const r = el.getBoundingClientRect();
      out.push({
        cls: (el.className || '').toString().split(' ').filter((x) => x && x !== 'vt')[0]
             || el.tagName.toLowerCase(),
        tag: el.tagName.toLowerCase(),
        paints: a > 0,
        colour: a > 0 ? (named[key] || `rgb(${key})`) : '—',
        alpha: a,
        layers,
        edges: edges.join('') || '—',
        h: Math.round(r.height),
      });
    }
    return out;
  });
  for (const f of found) rows.push({ route, ...f });
  await p.close();
}
await b.close();

const pad = (s, n) => String(s).padEnd(n).slice(0, n);
console.log('\nSECTION GROUNDS, SITE-WIDE\n');
console.log(`${pad('route', 14)}${pad('section', 20)}${pad('paints', 8)}${pad('colour', 16)}${pad('layers', 8)}${pad('edges', 7)}h`);
console.log('-'.repeat(80));
let lastRoute = '';
let painting = 0, layered = 0, edged = 0;
for (const r of rows) {
  if (r.route !== lastRoute) { console.log(''); lastRoute = r.route; }
  if (r.paints) painting++;
  if (r.layers) layered++;
  if (r.edges !== '—') edged++;
  console.log(
    `${pad(r.route, 14)}${pad(r.cls, 20)}${pad(r.paints ? 'yes' : 'no', 8)}${pad(r.colour, 16)}${pad(r.layers, 8)}${pad(r.edges, 7)}${r.h}`
  );
}
console.log('-'.repeat(80));
console.log(`${rows.length} sections. ${painting} paint a ground, ${layered} carry gradient layers, ${edged} draw an edge.`);

/* Every painted separator on a page: borders, and the thin painted boxes
   that act as rules. Counted from the rendered page, not from the
   stylesheet, because a declared border on a hidden element separates
   nothing and a 1px div is a rule whatever its class says. */
import puppeteer from 'puppeteer';
const BASE = process.env.BASE || 'http://localhost:5173';
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/resources', '/portfolio', '/case-studies'];
const b = await puppeteer.launch({ headless: 'new' });
const totals = {};
for (const r of ROUTES) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  await p.goto(BASE + r, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise(z => setTimeout(z, 1600));
  const o = await p.evaluate(() => {
    const out = [];
    const name = e => (e.className && e.className.baseVal !== undefined ? e.className.baseVal : String(e.className || '')) || e.tagName;
    document.querySelectorAll('*').forEach(e => {
      const rc = e.getBoundingClientRect();
      if (!rc.width || !rc.height) return;
      const c = getComputedStyle(e);
      if (c.visibility === 'hidden' || c.opacity === '0') return;
      const sides = ['Top','Right','Bottom','Left'].filter(s => {
        const w = parseFloat(c[`border${s}Width`]);
        const col = c[`border${s}Color`];
        return w > 0 && c[`border${s}Style`] !== 'none' && !/rgba\(.*,\s*0\)/.test(col);
      });
      if (sides.length) out.push({ n: name(e), k: 'border', sides: sides.join('') });
      /* A painted box 1 to 3px on one axis and long on the other is a rule. */
      const thin = (rc.height <= 3 && rc.width >= 24) || (rc.width <= 3 && rc.height >= 24);
      const bg = c.backgroundColor;
      if (thin && bg && !/rgba\(.*,\s*0\)|transparent/.test(bg)) out.push({ n: name(e), k: 'painted-rule' });
    });
    return out;
  });
  const byName = {};
  o.forEach(x => { const k = `${x.n.split(' ').slice(-1)[0]} [${x.k}${x.sides ? ' ' + x.sides : ''}]`; byName[k] = (byName[k] || 0) + 1; });
  totals[r] = o.length;
  console.log(`\n=== ${r}  TOTAL ${o.length} ===`);
  Object.entries(byName).sort((a, c) => c[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(3)}  ${k}`));
  await p.close();
}
console.log('\nSITE TOTAL', Object.values(totals).reduce((a, c) => a + c, 0), JSON.stringify(totals));
await b.close();

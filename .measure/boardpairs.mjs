/* boardpairs.mjs — every text pair on /pricing's board and quote, in EVERY
   state: each of the four tabs, the empty receipt and a full one (Advance +
   website + marketing + automation, so the bundle line shows). The generic
   contrast walk only ever sees the first tab and an empty receipt.

   Pairs are declared colours: each text element against the first ancestor
   that paints a background (arc, cream, yellow, the asphalt strip, a chip),
   alpha composited. Bars: 4.5 for text, 3 for large text (24px, or 18.66px
   bold).

     node .measure/boardpairs.mjs <base> */
import puppeteer from 'puppeteer';
const base = process.argv[2] || 'http://localhost:4173';
const b = await puppeteer.launch({ headless: 'new' });
let bad = 0;
for (const [w, h] of [[1280, 800], [390, 844]]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(base + '/pricing', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const walk = () => p.evaluate(() => {
    const px = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    const L = ([r, g, bl]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bl);
    const CR = (a, c) => { const x = L(a), y = L(c); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const ground = (el) => {
      for (let a = el; a; a = a.parentElement) {
        const v = px(getComputedStyle(a).backgroundColor);
        if (v.length && (v.length < 4 || v[3] > 0.5)) return v.slice(0, 3);
      }
      return [11, 11, 13];
    };
    const out = [];
    document.querySelectorAll('.pb *').forEach((el) => {
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own) return;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || !el.getClientRects().length) return;
      const fg = px(cs.color).slice(0, 3);
      const bg = ground(el);
      const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight, 10);
      const need = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
      out.push({ cls: String(el.className).split(' ')[0] || el.tagName, text: el.textContent.trim().slice(0, 28), ratio: CR(fg, bg), need, bg: bg.join(',') });
    });
    return out;
  });
  const all = [];
  for (const t of ['branding', 'websites', 'marketing', 'automation']) {
    await p.click(`#pb-tab-${t}`);
    await new Promise((r) => setTimeout(r, 400));
    all.push(...(await walk()).map((x) => ({ ...x, state: t })));
  }
  await p.evaluate(() => {
    const chip = (row, text) => [...document.querySelectorAll('.pb__row')].find((r) => r.querySelector('legend').textContent === row).querySelectorAll('.pb__chip');
    [...chip('Branding')].find((c) => c.textContent === 'Advance').click();
    chip('Websites')[0].click(); chip('Marketing')[0].click(); chip('Automation')[0].click();
  });
  await new Promise((r) => setTimeout(r, 900));
  all.push(...(await walk()).map((x) => ({ ...x, state: 'full receipt' })));
  const fails = all.filter((x) => x.ratio < x.need);
  bad += fails.length;
  const grounds = {};
  for (const x of all) { const k = x.bg; if (!grounds[k] || x.ratio < grounds[k].ratio) grounds[k] = x; }
  console.log(`=== ${w}: ${all.length} pairs across 4 tabs and a full receipt, ${fails.length} failing`);
  for (const [g, x] of Object.entries(grounds)) console.log(`   tightest on rgb(${g}): ${x.cls} "${x.text}" ${x.ratio.toFixed(2)}:1 (needs ${x.need}) [${x.state}]`);
  for (const f of fails) console.log(`   FAIL ${f.cls} "${f.text}" ${f.ratio.toFixed(2)}:1 on rgb(${f.bg}) [${f.state}]`);
  await p.close();
}
await b.close();
console.log(bad ? `${bad} failing` : 'every pair passes');

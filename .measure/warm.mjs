/* warm.mjs — the warm surfaces, and every text value that lands on one.

   Three questions, all answered off computed style with the ground walked up
   and alphas composited, the same machinery `contrast.mjs` uses:

     1. WHERE do the two warm surfaces actually paint? A token with a role and
        no element is the surface-2 defect DESIGN.md records.
     2. WHAT sits on them, and at what ratio? The rule is title white, body
        bone, detail steel-lift, and every value restated against the surface
        it is on rather than against the one it was written for.
     3. Is steel-dark on a SURFACE anywhere? It is the ground's secondary value
        and it is banned above the ground: 4.57:1 on surface-warm and 4.13:1
        on warm-raised, and a plate that raises on hover cannot change its
        text value at the same time.

   Hover and open states do not exist in a resting DOM, so the plates and the
   lead card are opened by script before the walk. */
import puppeteer from 'puppeteer';

const BASE = 'http://localhost:4179';
const ROUTES = ['/', '/about-us', '/pricing'];
const WARM = { '38,34,24': 'surface-warm', '46,42,30': 'surface-warm-raised' };
const COOL = { '29,30,32': 'surface-1', '34,35,38': 'surface-2', '43,45,49': 'surface-raised' };

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });

let banned = 0, cool = 0;
for (const [w, h] of [[1280, 800], [390, 844]]) {
  console.log(`\n=========== ${w} ===========`);
  for (const route of ROUTES) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h });
    await p.goto(BASE + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2000));
    /* every conditional surface, held open */
    await p.evaluate(() => {
      document.querySelectorAll('.plate').forEach((e) => e.click());
      const live = document.querySelector('.card__price--live');
      if (live) live.click();
    });
    const tot = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < tot; y += h / 2) {
      await p.evaluate((yy) => window.scrollTo(0, yy), y);
      await new Promise((r) => setTimeout(r, 80));
    }

    const rows = await p.evaluate((WARM, COOL) => {
      const px = (s) => (s.match(/[\d.]+/g) || []).map(Number);
      const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
      const L = ([r, g, bl]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bl);
      const CR = (a, bb) => { const l1 = Math.max(L(a), L(bb)), l2 = Math.min(L(a), L(bb)); return (l1 + 0.05) / (l2 + 0.05); };
      const over = (fg, a, bg) => fg.map((c, i) => c * a + bg[i] * (1 - a));
      const groundOf = (el) => {
        const stack = []; let e = el;
        while (e && e !== document.documentElement) {
          const c = getComputedStyle(e); const v = px(c.backgroundColor);
          const a = v.length === 4 ? v[3] : 1;
          if (a > 0) stack.push([[v[0], v[1], v[2]], a]);
          if (a === 1) break;
          e = e.parentElement;
        }
        let out = [23, 24, 26];
        for (let i = stack.length - 1; i >= 0; i--) out = over(stack[i][0], stack[i][1], out);
        return out;
      };
      const key = (g) => g.map(Math.round).join(',');
      const out = [];
      for (const el of document.querySelectorAll('body *')) {
        const txt = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())
          .map((n) => n.textContent.trim()).join(' ');
        if (!txt) continue;
        const c = getComputedStyle(el);
        if (c.visibility === 'hidden' || c.display === 'none') continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        const ground = groundOf(el);
        const name = WARM[key(ground)] || COOL[key(ground)];
        if (!name) continue;
        const fgv = px(c.color);
        const fg = over([fgv[0], fgv[1], fgv[2]], (fgv.length === 4 ? fgv[3] : 1), ground);
        out.push({
          cls: (el.className || '').toString().split(' ')[0] || el.tagName,
          ground: name, cool: !WARM[key(ground)],
          size: Math.round(parseFloat(c.fontSize)),
          fg: `rgb(${fgv.slice(0, 3).join(', ')})`,
          steelDark: fgv[0] === 133 && fgv[1] === 138 && fgv[2] === 146,
          ratio: +CR(fg, ground).toFixed(2),
          txt: txt.slice(0, 26),
        });
      }
      /* one row per class, not one per element */
      const seen = new Map();
      for (const r of out) { const k = r.cls + r.ground; if (!seen.has(k)) seen.set(k, r); }
      return [...seen.values()];
    }, WARM, COOL);

    console.log(`\n--- ${route} ---`);
    if (!rows.length) { console.log('  nothing sits on a named surface'); await p.close(); continue; }
    for (const r of rows) {
      const flag = r.steelDark ? '  STEEL-DARK ON A SURFACE' : r.cool ? '  COOL SURFACE' : '';
      if (r.steelDark) banned++;
      if (r.cool) cool++;
      console.log(`  ${String(r.ratio).padStart(5)}:1  ${String(r.size).padStart(3)}px  ${r.ground.padEnd(20)} ${r.cls.padEnd(22)} ${r.fg.padEnd(20)} "${r.txt}"${flag}`);
    }
    await p.close();
  }
}
console.log(`\nsteel-dark on a surface: ${banned}`);
console.log(`text still on a cool surface: ${cool}`);
await b.close();

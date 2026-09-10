/* warm.mjs — the named surfaces, every text value on one, and the 320px line.

   Three questions, all answered off computed style with the ground walked up
   and alphas composited, the same machinery `contrast.mjs` uses:

     1. WHERE do the named surfaces actually paint? A token with a role and no
        element is the surface-2 defect DESIGN.md records — and a DELETED
        surface still painting somewhere is the same defect inverted.
     2. WHAT sits on them, and at what ratio? The rule is title white, body
        bone, detail steel-lift, and every value restated against the surface
        it is on rather than against the one it was written for.
     3. Is steel-dark on a SURFACE anywhere? It is the ground's secondary value
        and it is banned above the ground: 4.57:1 on surface-warm and 4.13:1
        on warm-raised, and a plate that raises on hover cannot change its
        text value at the same time.
     4. THE 320px LINE IS WITHDRAWN. It said a warm surface was for an object
        under 320px tall. The warm pair is deleted — with two lights on a plane
        the tint under them reads as mud at any size — so there is no line left
        to check and the height column is reported for information only.

   Hover and open states do not exist in a resting DOM, so the plates and the
   lead card are opened by script before the walk. */
import puppeteer from 'puppeteer';

const BASE = 'http://localhost:4179';
const ROUTES = ['/', '/about-us', '/pricing', '/services'];
/* THE ONLY TWO SURFACES. Every card and plate on the site is one of these. */
const LIT = { '30,31,34': 'lit-near', '43,45,49': 'lit-raised' };
/* Kept empty ON PURPOSE. The warm pair used to live here; it is deleted, and
   the check that mattered — is anything still standing on one — now runs
   through GONE below. A pair with no members is the correct state and the
   walk says so rather than dropping the row. */
const WARM = {};
/* Deleted surfaces. Anything still standing on one of these is a defect. */
const GONE = {
  '29,30,32': 'surface-1', '34,35,38': 'surface-2',
  '38,34,24': 'surface-warm', '46,42,30': 'surface-warm-raised',
};

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

    const rows = await p.evaluate((WARM, LIT, GONE) => {
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
        const k = key(ground);
        const name = WARM[k] || LIT[k] || GONE[k];
        if (!name) continue;
        /* the object the text stands on, and its height */
        let host = el;
        while (host && host !== document.body) {
          const c2 = getComputedStyle(host);
          const v2 = px(c2.backgroundColor);
          if ((v2.length === 4 ? v2[3] : 1) === 1) break;
          host = host.parentElement;
        }
        const hostH = host ? Math.round(host.getBoundingClientRect().height) : 0;
        const fgv = px(c.color);
        const fg = over([fgv[0], fgv[1], fgv[2]], (fgv.length === 4 ? fgv[3] : 1), ground);
        out.push({
          cls: (el.className || '').toString().split(' ')[0] || el.tagName,
          ground: name, gone: !!GONE[k], hostH,
          /* over the line on warm, or under it on lit */
          lineBreak: false, /* the 320px rule is withdrawn; see the header */
          size: Math.round(parseFloat(c.fontSize)),
          fg: `rgb(${fgv.slice(0, 3).join(', ')})`,
          steelDark: fgv[0] === 133 && fgv[1] === 138 && fgv[2] === 146,
          ratio: +CR(fg, ground).toFixed(2),
          txt: txt.slice(0, 26),
        });
      }
      /* one row per class, not one per element */
      const seen = new Map();
      for (const r of out) { const k2 = r.cls + r.ground;
        if (!seen.has(k2) || r.hostH > seen.get(k2).hostH) seen.set(k2, r); }
      return [...seen.values()];
    }, WARM, LIT, GONE);

    console.log(`\n--- ${route} ---`);
    if (!rows.length) { console.log('  nothing sits on a named surface'); await p.close(); continue; }
    for (const r of rows) {
      const flag = r.steelDark ? '  STEEL-DARK ON A SURFACE'
        : r.gone ? '  DELETED SURFACE'
        : r.lineBreak ? `  320px LINE: host is ${r.hostH}px` : '';
      if (r.steelDark) banned++;
      if (r.gone || r.lineBreak) cool++;
      console.log(`  ${String(r.ratio).padStart(5)}:1  ${String(r.size).padStart(3)}px  ${String(r.hostH).padStart(4)}px  ${r.ground.padEnd(12)} ${r.cls.padEnd(22)} ${r.fg.padEnd(20)} "${r.txt}"${flag}`);
    }
    await p.close();
  }
}
console.log(`\nsteel-dark on a surface: ${banned}`);
console.log(`objects on a deleted surface or the wrong side of 320px: ${cool}`);
await b.close();

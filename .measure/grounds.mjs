/* grounds.mjs — which text values are painted on which ground, and whether
   they are DECLARED for it.

   This is not the contrast walk. `contrast.mjs` catches a pair that fails the
   ratio; this catches a pair that happens to pass while being wrong by rule —
   a value declared for asphalt sitting on machine yellow because nobody
   restated it when the ground changed. The arc ground exposed the class:
   steel-dark is "secondary text on asphalt ONLY" and fell to 2.28:1 on arc
   with nothing catching it.

   THE RULE IT PRODUCED, now in DESIGN.md: every ground change restates its own
   secondary text value.

   Usage, with the site served at 4179:  node .measure/grounds.mjs [width]
*/
import puppeteer from 'puppeteer';

const BASE = 'http://localhost:4179';
const WIDTH = Number(process.argv[2]) || 1280;
const PAGES = ['/', '/services', '/pricing', '/about-us', '/contact-us',
               '/resources', '/portfolio', '/case-studies'];

/* The palette, and the ground each value is declared FOR. tokens.css and
   DESIGN.md Colors are the source; the suffix convention is theirs — `-dark`
   means "the value for dark grounds". */
const DECLARED = {
  '255,255,255': { name: 'shop-white', on: ['dark'] },
  '232,234,237': { name: 'bone', on: ['dark'] },
  '133,138,146': { name: 'steel-dark', on: ['dark'] },
  '155,161,169': { name: 'steel-lift', on: ['dark'] },
  '240,179,35': { name: 'machine-yellow', on: ['dark'] },
  '23,24,26': { name: 'asphalt', on: ['light', 'yellow'] },
  '76,80,85': { name: 'steel', on: ['light'] },
  '138,99,0': { name: 'deep-amber', on: ['light', 'yellow'] },
  '13,71,189': { name: 'arc', on: ['light'] },
  '226,96,87': { name: 'error-dark', on: ['dark'] },
  '40,163,93': { name: 'success-dark', on: ['dark'] },
};

/* Classify a ground by what it is, not by its name. */
const kindOf = (rgb) => {
  const [r, g, b] = rgb;
  if (r > 200 && g > 140 && b < 90) return 'yellow';
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.5 ? 'light' : 'dark';
};

const b = await puppeteer.launch({ headless: 'new', args: ['--force-color-profile=srgb'] });
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
    const px = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    const over = (fg, a, bg) => fg.map((c, i) => c * a + bg[i] * (1 - a));
    const groundOf = (el) => {
      const stack = [];
      let e = el;
      while (e && e !== document.documentElement) {
        const c = getComputedStyle(e);
        const v = px(c.backgroundColor);
        const a = v.length === 4 ? v[3] : 1;
        if (a > 0) stack.push([[v[0], v[1], v[2]], a]);
        if (a === 1) break;
        e = e.parentElement;
      }
      let out = [23, 24, 26];
      for (let i = stack.length - 1; i >= 0; i--) out = over(stack[i][0], stack[i][1], out);
      return out.map(Math.round);
    };
    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      const txt = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim())
        .map((n) => n.textContent.trim()).join(' ');
      if (!txt) continue;
      const c = getComputedStyle(el);
      if (c.display === 'none' || c.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      if (parseFloat(c.opacity) < 0.05) continue;
      const sec = el.closest('section, footer, header');
      out.push({
        cls: (el.className || '').toString().trim().split(/\s+/)[0] || el.tagName.toLowerCase(),
        sec: sec ? (sec.className || '').toString().replace('vt ', '').split(/\s+/)[0] : '(page)',
        fg: px(c.color).slice(0, 3).map(Math.round).join(','),
        ground: groundOf(el).join(','),
        txt: txt.slice(0, 24),
      });
    }
    return out;
  });

  for (const f of found) {
    const key = `${f.sec}|${f.cls}|${f.fg}|${f.ground}`;
    if (!rows.has(key)) rows.set(key, { ...f, pages: new Set() });
    rows.get(key).pages.add(path);
  }
  await p.close();
}
await b.close();

const exposed = [], unknown = [];
for (const r of rows.values()) {
  const kind = kindOf(r.ground.split(',').map(Number));
  const d = DECLARED[r.fg];
  const line = `${kind.padEnd(6)} ground rgb(${r.ground.padEnd(13)}) <- ${(d ? d.name : 'UNDECLARED ' + r.fg).padEnd(16)} ${r.sec.padEnd(10)} ${r.cls.slice(0, 22).padEnd(24)} "${r.txt}"`;
  if (!d) unknown.push(line);
  else if (!d.on.includes(kind)) exposed.push(line);
}

console.log(`${rows.size} distinct (section, class, colour, ground) combinations at ${WIDTH}\n`);
console.log(`=== A VALUE ON A GROUND IT IS NOT DECLARED FOR — ${exposed.length} ===`);
for (const l of [...new Set(exposed)].sort()) console.log('  ' + l);
console.log(`\n=== NOT IN THE PALETTE — ${unknown.length} ===`);
for (const l of [...new Set(unknown)].sort()) console.log('  ' + l);

/* The audit is only worth its zero if it actually reached every ground. */
const byGround = new Map();
for (const r of rows.values()) {
  const kind = kindOf(r.ground.split(',').map(Number));
  const k = `${kind} rgb(${r.ground})`;
  if (!byGround.has(k)) byGround.set(k, new Set());
  byGround.get(k).add(DECLARED[r.fg] ? DECLARED[r.fg].name : r.fg);
}
console.log('\n=== GROUNDS REACHED, and what paints on each ===');
for (const [g, set] of [...byGround].sort()) {
  console.log(`  ${g.padEnd(30)} ${[...set].sort().join(', ')}`);
}

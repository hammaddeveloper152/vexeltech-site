/* planpairs.mjs — every text pair in /pricing's Plan Builder, on every
   screen: steps 1 to 4 and the result, with the ticket filled (Advance and
   the website bundled, plus Marketing). Declared colours against the first
   ancestor that paints a background, composited: the drift (arc-black under
   the builder since 2026-09-22), the answer card's veil, cream, the asphalt
   strip, the white inputs. Where the walk reaches the body, the ground is
   the drift's own colour at the element's page y, interpolated from the
   stops `useDrift` wrote into `--drift-image`.

   Then a PIXEL CHECK, because the rig's two blooms paint over the drift and
   no declared colour sees them: everything but the body's own paint is hidden, the
   section is screenshotted at every scroll position that shows it, and each
   text value is measured against the BRIGHTEST painted pixel found. Bars 4.5 for text, 3 for
   large text (24px, or 18.66px bold). Disabled controls are exempt and
   reported separately.

     node .measure/planpairs.mjs <base> */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
const base = process.argv[2] || 'http://localhost:4173';
const b = await puppeteer.launch({ headless: 'new' });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let bad = 0;

const walk = (p) => p.evaluate(() => {
  const px = (s) => (s.match(/[\d.]+/g) || []).map(Number);
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const L = ([r, g, bl]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bl);
  const CR = (a, c) => { const x = L(a), y = L(c); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  /* Composite translucent grounds up the tree onto the first opaque one. */
  const tok = (t) => px(getComputedStyle(document.body).getPropertyValue(t).trim().replace(/^#(..)(..)(..)$/, (_, r, g, b) => `${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)}`));
  const drift = (y) => {
    const img = document.body.style.getPropertyValue('--drift-image');
    const st = [...img.matchAll(/var\((--[\w-]+)\) (\d+)px/g)].map((m) => [tok(m[1]), +m[2]]);
    if (!st.length) return px(getComputedStyle(document.body).backgroundColor).slice(0, 3);
    if (y <= st[0][1]) return st[0][0];
    for (let i = 1; i < st.length; i++) if (y <= st[i][1]) {
      const t = (y - st[i - 1][1]) / (st[i][1] - st[i - 1][1]);
      return st[i][0].map((c, k) => st[i - 1][0][k] + (c - st[i - 1][0][k]) * t);
    }
    return st[st.length - 1][0];
  };
  const ground = (el) => {
    const stack = [];
    let reached = false;
    for (let a = el; a; a = a.parentElement) {
      if (a === document.body) { reached = true; break; }
      const v = px(getComputedStyle(a).backgroundColor);
      if (!v.length) continue;
      const al = v.length === 4 ? v[3] : 1;
      if (al > 0) stack.push([v.slice(0, 3), al]);
      if (al >= 1) break;
    }
    const r = el.getBoundingClientRect();
    let out = reached ? drift(r.top + r.height / 2 + scrollY) : [11, 11, 13];
    for (let i = stack.length - 1; i >= 0; i--) out = stack[i][0].map((c, k) => c * stack[i][1] + out[k] * (1 - stack[i][1]));
    return out.map(Math.round);
  };
  const out = [];
  document.querySelectorAll('.plan *').forEach((el) => {
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || !el.getClientRects().length) return;
    if (el.closest('.plan__sheet') || el.closest('.plan__bar') && innerWidth >= 1024) return;
    const fg = px(cs.color).slice(0, 3);
    const bg = ground(el);
    const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight, 10);
    const need = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
    out.push({ cls: String(el.className).split(' ')[0] || el.tagName, text: el.textContent.trim().slice(0, 30), ratio: CR(fg, bg), need, bg: bg.join(','), disabled: !!el.closest('button:disabled') });
  });
  return out;
});

for (const [w, h] of [[1280, 900], [390, 844]]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(base + '/pricing', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const pick = (t) => p.evaluate((x) => [...document.querySelectorAll('.plan [data-choice]')].find((c) => c.textContent.trim().startsWith(x)).click(), t);
  const next = async () => { await p.evaluate(() => document.querySelector('.plan__next').click()); await wait(800); };
  const all = [];
  const take = async (state) => { await wait(700); all.push(...(await walk(p)).map((x) => ({ ...x, state }))); };
  await take('step 1');
  await pick('Plumbing'); await take('step 1, chosen'); await next();
  await take('step 2'); await pick('Just starting out'); await next();
  await take('step 3'); await pick('Branding'); await wait(700); await pick('Website'); await wait(900); await pick('Marketing'); await take('step 3, filled'); await next();
  await take('step 4');
  await p.type('#plan-name', 'Test'); await p.type('#plan-email', 't@example.com'); await p.type('#plan-phone', '555');
  await next(); await take('result');
  const judged = all.filter((x) => !x.disabled);
  const fails = judged.filter((x) => x.ratio < x.need);
  bad += fails.length;
  const byGround = {};
  for (const x of judged) if (!byGround[x.bg] || x.ratio < byGround[x.bg].ratio) byGround[x.bg] = x;
  console.log(`=== ${w}: ${judged.length} pairs over five screens and a filled ticket, ${fails.length} failing (${all.length - judged.length} on disabled controls, exempt)`);
  for (const [g, x] of Object.entries(byGround)) console.log(`   tightest on rgb(${g}): ${x.cls} "${x.text}" ${x.ratio.toFixed(2)}:1 (needs ${x.need}) [${x.state}]`);
  for (const f of fails) console.log(`   FAIL ${f.cls} "${f.text}" ${f.ratio.toFixed(2)}:1 on rgb(${f.bg}) [${f.state}]`);

  /* The pixel check: the builder's painted ground with its contents hidden. */
  await p.addStyleTag({ content: 'body * { visibility: hidden !important; } .plan__bar, .plan__sheet { display: none !important; }' });
  const box = await p.evaluate(() => { const r = document.querySelector('.plan').getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; });
  let hi = null, lo = null;
  const Lum = ([r, g, bl]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl); };
  for (let y = box.top - h + 200; y < box.top + box.h; y += Math.round(h / 2)) {
    await p.evaluate((yy) => window.scrollTo(0, Math.max(0, yy)), y); await wait(900);
    const vis = await p.evaluate(() => { const r = document.querySelector('.plan').getBoundingClientRect(); return { y0: Math.max(0, r.top), y1: Math.min(innerHeight, r.bottom) }; });
    if (vis.y1 - vis.y0 < 4) continue;
    const buf = await p.screenshot({ clip: { x: 0, y: vis.y0, width: w, height: vis.y1 - vis.y0 } });
    const png = PNG.sync.read(buf);
    for (let i = 0; i < png.data.length; i += 4 * 7) {
      const c = [png.data[i], png.data[i + 1], png.data[i + 2]];
      if (!hi || Lum(c) > Lum(hi)) hi = c;
      if (!lo || Lum(c) < Lum(lo)) lo = c;
    }
  }
  const CRp = (a, c) => { const x = Lum(a), y = Lum(c); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  console.log(`   painted ground under the builder: darkest rgb(${lo}), brightest rgb(${hi})`);
  for (const [n, c, need] of [['white', [255, 255, 255], 4.5], ['bone', [232, 234, 237], 4.5], ['steel-lift', [155, 161, 169], 4.5], ['steel-dark (hairline, disabled Next)', [133, 138, 146], 3], ['yellow (fill, nodes, ring)', [240, 179, 35], 3]]) {
    const r = CRp(c, hi);
    if (r < need) bad++;
    console.log(`   ${n} on the brightest pixel: ${r.toFixed(2)}:1 (needs ${need})${r < need ? '  FAIL' : ''}`);
  }
  await p.close();
}
await b.close();
console.log(bad ? `${bad} failing` : 'every pair passes');

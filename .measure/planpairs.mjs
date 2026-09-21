/* planpairs.mjs — every text pair in /pricing's Plan Builder, on every
   screen: steps 1 to 4 and the result, with the ticket filled (Advance and
   the website bundled, plus Marketing). Declared colours against the first
   ancestor that paints a background, composited: arc, the answer card's
   veil, cream, the asphalt strip, the white inputs. Bars 4.5 for text, 3 for
   large text (24px, or 18.66px bold). Disabled controls are exempt and
   reported separately.

     node .measure/planpairs.mjs <base> */
import puppeteer from 'puppeteer';
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
  const ground = (el) => {
    const stack = [];
    for (let a = el; a; a = a.parentElement) {
      const v = px(getComputedStyle(a).backgroundColor);
      if (!v.length) continue;
      const al = v.length === 4 ? v[3] : 1;
      if (al > 0) stack.push([v.slice(0, 3), al]);
      if (al >= 1) break;
    }
    let out = [11, 11, 13];
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
  await p.close();
}
await b.close();
console.log(bad ? `${bad} failing` : 'every pair passes');

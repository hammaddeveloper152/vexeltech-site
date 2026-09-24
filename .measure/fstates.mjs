import { createRequire } from 'node:module';
const require = createRequire('C:/Users/LENOVO/Desktop/vexeltech2-src/vexeltech2-main/package.json');
const puppeteer = require('puppeteer');
const { PNG } = require('pngjs');
const W = +(process.argv[2] || 1280);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const cr = (a, b) => { const x = L(a), y = L(b); return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2); };
const parse = (c) => c.match(/[\d.]+/g).map(Number);
const over = (fg, bg) => { const a = fg[3] ?? 1; return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a)); };
const b = await puppeteer.launch({ headless: 'new', args: ['--force-color-profile=srgb'] });
const p = await b.newPage();
await p.setViewport({ width: W, height: 900 });
const rows = [];
const shot = async () => PNG.sync.read(await p.screenshot());
const px = (img, x, y) => { const i = (Math.floor(y) * W + Math.round(x)) * 4; return [img.data[i], img.data[i + 1], img.data[i + 2]]; };
const scan = (img, x, y0, y1, gnd, pick) => { const c = []; for (let y = Math.floor(y0); y <= Math.ceil(y1); y++) c.push(px(img, x, y)); return c.filter(pick || (() => true)).reduce((best, v) => (cr(v, gnd) > cr(best, gnd) ? v : best), c[0]); };
const isYellow = (v) => v[0] > 150 && v[2] < 120;
const isDark = (v) => v[0] < 80 && v[1] < 80;
const rect = (sel) => p.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, b: r.bottom }; }, sel);
const col = (sel, pseudo, prop = 'color') => p.evaluate((s, ps, pr) => getComputedStyle(document.querySelector(s), ps)[pr], sel, pseudo, prop);
const into = async (sel) => { await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel); await wait(500); };
const rec = (form, state, pair, ratio, bar) => { rows.push({ form, state, pair, ratio, bar, pass: ratio >= bar }); };
const blur = () => p.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());

async function fieldStates(form, inSel, idxSel, errSel) {
  await into(inSel);
  await blur(); await wait(200);
  let r = await rect(inSel); let img = await shot();
  const ground = px(img, r.x + r.w - 4, r.y + 3);
  const gBelow = px(img, r.x + r.w / 2, r.b + 4);
  rec(form, 'rest', 'index', cr(over(parse(await col(idxSel)), ground), ground), 4.5);
  rec(form, 'rest', 'placeholder', cr(over(parse(await col(inSel, '::placeholder')), ground), ground), 4.5);
  rec(form, 'rest', 'line 1px', cr(scan(img, r.x + r.w / 2, r.b - 3, r.b + 1, gBelow), gBelow), 3);
  await p.focus(inSel); await wait(200); img = await shot(); r = await rect(inSel);
  rec(form, 'focus', 'line 2px yellow', cr(scan(img, r.x + r.w / 2, r.b - 3, r.b, gBelow, isYellow), gBelow), 3);
  if (form.includes('plan')) rec(form, 'focus', 'asphalt 1px under the yellow', cr(scan(img, r.x + r.w / 2, r.b - 1, r.b + 2, gBelow, isDark), gBelow), 3);
  await p.keyboard.type('Jane Doe'); await wait(100);
  rec(form, 'filled', 'value', cr(over(parse(await col(inSel)), ground), ground), 4.5);
  if (errSel) {
    await p.evaluate((s) => { const e = document.querySelector(s); const set = Object.getOwnPropertyDescriptor(e.constructor.prototype, 'value').set; set.call(e, ''); e.dispatchEvent(new Event('input', { bubbles: true })); }, inSel);
    await blur(); await wait(300);
    img = await shot(); r = await rect(inSel);
    rec(form, 'error', 'line 2px red', cr(scan(img, r.x + r.w / 2, r.b - 3, r.b, gBelow, (v) => v[0] > 150 && v[1] < 120), gBelow), 3);
    rec(form, 'error', 'message', cr(over(parse(await col(errSel)), gBelow), gBelow), 4.5);
  }
}

async function sub(scope, form, state) {
  const s = `${scope} .lf__submit`;
  await into(s);
  await blur(); await p.mouse.move(0, 0); await wait(400);
  const i = await shot(); const q = await rect(s);
  const fill = px(i, q.x + 10, q.y + q.h / 2); const gg = px(i, q.x - 8, q.y + q.h / 2);
  const op = +(await col(s, null, 'opacity'));
  const txt = over([...parse(await col(s)).slice(0, 3), op], fill);
  rec(form, `submit ${state}`, `label on button (opacity ${op})`, cr(txt, fill), 4.5);
  rec(form, `submit ${state}`, 'button vs ground', cr(fill, gg), 3);
}

/* contact */
await p.goto('http://localhost:4173/contact-us', { waitUntil: 'networkidle0' }); await p.evaluate(() => document.fonts.ready);
await fieldStates('contact', '#ct-name', '.ct-form .lf__field .lf__idx', '#ct-name-err');
await into('.lf__pill');
let img = await shot(); let r = await rect('.lf__pill-face');
const g = px(img, r.x - 6, r.y + r.h / 2);
rec('contact', 'pill rest', 'text', cr(over(parse(await col('.lf__pill-face')), g), g), 4.5);
rec('contact', 'pill rest', 'border', cr(px(img, r.x + r.w / 2, r.y), g), 3);
rec('contact', 'legend', 'text', cr(over(parse(await col('.lf__legend-t')), g), g), 4.5);
await p.focus('.lf__check'); await p.keyboard.press('Space'); await wait(200);
img = await shot(); r = await rect('.lf__pill-face');
const yb = px(img, r.x + 8, r.y + r.h / 2);
rec('contact', 'pill selected', 'text on fill', cr(parse(await col('.lf__pill-face')), yb), 4.5);
rec('contact', 'pill selected', 'fill vs ground', cr(yb, g), 3);
rec('contact', 'pill focus', 'ring', cr(px(img, r.x + r.w / 2, r.y - 4), g), 3);
await sub('.ct-form', 'contact', 'not ready');
for (const [s, v] of [['#ct-name', 'Jane Doe'], ['#ct-phone', '713 555 0100'], ['#ct-email', 'jane@example.com'], ['#ct-message', 'Nobody calls.']]) { await p.focus(s); await p.keyboard.type(v); }
await sub('.ct-form', 'contact', 'ready');
await fieldStates('contact message', '#ct-message', '.lf__field--msg .lf__idx', '#ct-message-err');

/* footer form on home */
await p.goto('http://localhost:4173/', { waitUntil: 'networkidle0' }); await p.evaluate(() => document.fonts.ready);
const h = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 600) { await p.evaluate((v) => scrollTo(0, v), y); await wait(40); }
await fieldStates('footer (home)', '#ff-email', '.foot .lf__row .lf__field:nth-child(3) .lf__idx', '#ff-email-err');
await sub('.foot', 'footer (home)', 'not ready');

/* plan builder on /pricing */
await p.goto('http://localhost:4173/pricing', { waitUntil: 'networkidle0' }); await p.evaluate(() => document.fonts.ready);
for (let k = 0; k < 3; k++) {
  await p.evaluate(() => { const c = document.querySelector('.plan [data-choice]'); c && c.click(); });
  await wait(300);
  await p.evaluate(() => document.querySelector('.plan__next').click()); await wait(600);
}
if (await p.$('#plan-name')) await fieldStates('plan (cream)', '#plan-name', '.plan__field .plan__idx', null);
else console.log('plan step 3 not reached');
await b.close();
console.log(`\n${W}px`);
for (const x of rows) console.log(`${x.pass ? 'PASS' : 'FAIL'}  ${x.ratio.toFixed(2).padStart(6)} (bar ${x.bar})  ${x.form} | ${x.state} | ${x.pair}`);

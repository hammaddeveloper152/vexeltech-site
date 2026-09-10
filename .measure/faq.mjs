/* faq.mjs — the FAQ section, closed and with every row opened in turn.

   The general walk (contrast.mjs) reads the page as it loads, so it never sees
   an open row. That is exactly where the last defect hid: the section became a
   marble band, the open row kept `background-color: shop-white` from when the
   section was white, and the question text on it was ALSO shop white. Nothing
   reported it, because nothing opened it.

   It also cannot read this section's ground. The FAQ is transparent now, so
   what is behind the type is the page rig — a fixed radial fall on `body`,
   painting a different value at every scroll depth — and the open row is
   lit-near with two radial gradients on top of it. A composited stack of
   declared `background-color`s describes none of that.

   So both sides come from the same place they do in scrim.mjs: THE TEXT IS
   HIDDEN AND THE GROUND UNDER ITS OWN BOX IS SAMPLED FROM PIXELS. The worst
   pixel in the box is the one reported, not the average, because a gradient
   fails at its bright end and the average is not where type breaks.
*/
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => {
  const l1 = Math.max(L(a), L(b)), l2 = Math.min(L(a), L(b));
  return (l1 + 0.05) / (l2 + 0.05);
};
const over = (fg, a, bg) => fg.map((c, i) => c * a + bg[i] * (1 - a));

const SEL = ['.faq__h', '.faq__q-t', '.faq__mark', '.faq__a'];
const HIDE = SEL.join(', ') + ' { visibility: hidden !important; }';

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });

let fails = 0;

for (const [W, H] of [[1280, 900], [390, 844]]) {
  const p = await b.newPage();
  await p.setViewport({ width: W, height: H });
  await p.goto('http://localhost:4179/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2200));
  await p.evaluate(() => document.fonts.ready);

  /* Walk the page once so every reveal has fired, then park on the FAQ. */
  const tot = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < tot; y += 400) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 70));
  }

  const n = await p.evaluate(() => document.querySelectorAll('.faq__btn').length);
  console.log(`\n${W} — ${n} rows`);
  console.log('  state        element        ink              ground(worst)    ratio  bar');

  /* -1 is the closed state; 0..n-1 opens that row. */
  for (let open = -1; open < n; open++) {
    if (open >= 0) {
      /* Close whatever is open, then open this one. A click scrolls the
         element into view, so the section is re-parked afterwards. */
      await p.evaluate((i) => {
        document.querySelectorAll('.faq__btn').forEach((btn, j) => {
          const isOpen = btn.getAttribute('aria-expanded') === 'true';
          if ((j === i) !== isOpen) btn.click();
        });
      }, open);
      await new Promise((r) => setTimeout(r, 500));
    }

    await p.evaluate(() => {
      const el = document.querySelector('.faq');
      window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 40);
    });
    await new Promise((r) => setTimeout(r, 400));

    /* the ink: computed colour composited by its own and its ancestors' alpha */
    const inks = await p.evaluate((sels) => {
      const px = (s) => (s.match(/[\d.]+/g) || []).map(Number);
      const out = [];
      for (const sel of sels) {
        for (const el of document.querySelectorAll(sel)) {
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) continue;
          if (r.bottom < 0 || r.top > innerHeight) continue;
          const c = getComputedStyle(el);
          if (c.visibility === 'hidden' || c.display === 'none') continue;
          let a = parseFloat(c.opacity);
          for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
            a *= parseFloat(getComputedStyle(e).opacity);
          }
          const v = px(c.color);
          out.push({
            sel,
            open: !!el.closest("[data-open='true']"),
            rgb: [v[0], v[1], v[2]],
            alpha: (v.length === 4 ? v[3] : 1) * a,
            /* large text gets the 3:1 bar */
            large: parseFloat(c.fontSize) >= 24
              || (parseFloat(c.fontSize) >= 18.66 && parseInt(c.fontWeight, 10) >= 700),
            icon: sel === '.faq__mark',
            box: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)],
          });
        }
      }
      return out;
    }, SEL);

    /* the ground: same boxes, text hidden, read off the screenshot */
    const tag = await p.addStyleTag({ content: HIDE });
    await new Promise((r) => setTimeout(r, 220));
    const img = PNG.sync.read(await p.screenshot({ type: 'png' }));
    await p.evaluate((el) => el.remove(), tag);

    const state = open < 0 ? 'closed' : `open ${String(open + 1).padStart(2, '0')}`;
    const rows = [];
    for (const t of inks) {
      const [x, y, w, h] = t.box;
      let worst = null, worstCR = Infinity;
      for (let yy = Math.max(0, y); yy < Math.min(img.height, y + h); yy += 2) {
        for (let xx = Math.max(0, x); xx < Math.min(img.width, x + w); xx += 2) {
          const i = (yy * img.width + xx) * 4;
          const g = [img.data[i], img.data[i + 1], img.data[i + 2]];
          const ink = over(t.rgb, t.alpha, g);
          const cr = CR(ink, g);
          if (cr < worstCR) { worstCR = cr; worst = g; }
        }
      }
      if (!worst) continue;
      const bar = t.icon ? 3.0 : (t.large ? 3.0 : 4.5);
      const ok = worstCR >= bar;
      if (!ok) fails++;
      rows.push({ sel: t.sel + (t.open ? ' [open]' : ''), ink: over(t.rgb, t.alpha, worst).map(Math.round),
        g: worst, cr: worstCR, bar, ok });
    }

    /* one line per distinct selector — the worst instance of each */
    const seen = new Map();
    for (const r of rows) {
      const k = r.sel;
      if (!seen.has(k) || r.cr < seen.get(k).cr) seen.set(k, r);
    }
    for (const r of [...seen.values()]) {
      console.log(
        `  ${state.padEnd(12)} ${r.sel.padEnd(14)} ` +
        `rgb(${r.ink.join(',')})`.padEnd(17) +
        `rgb(${r.g.join(',')})`.padEnd(17) +
        `${r.cr.toFixed(2)}`.padStart(5) + `  ${r.bar.toFixed(1)}` + (r.ok ? '' : '   FAIL')
      );
    }
  }
  await p.close();
}

console.log(fails === 0
  ? '\nEvery FAQ pair passes, closed and with each row open.'
  : `\n${fails} FAILING pair(s).`);
await b.close();

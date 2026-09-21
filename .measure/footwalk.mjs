/* footwalk.mjs — the footer's text against the ground it is PAINTED on.

   Since 2026-09-21 the footer has no ground of its own: it sits on the
   drift's last stop (arc-black), and on home its form sits on asphalt. A
   DOM walk reads the body's declared colour, not the gradient, so each text
   element is measured against the pixels under it: the text in
   the footer is hidden, the page is captured, and the BRIGHTEST ground pixel
   inside each element's box is the pair's ground (the worst case it can sit
   on). Elements on their own opaque fill (the inputs, the submit) are left
   to contrast.mjs, which reads declared pairs correctly.

     node .measure/footwalk.mjs <base> [route...] */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const [base = 'http://localhost:4173', ...args] = process.argv.slice(2);
const routes = args.length ? args : ['/', '/services', '/about-us', '/pricing', '/contact-us'];
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

const browser = await puppeteer.launch({ headless: 'new', args: ['--force-color-profile=srgb', '--hide-scrollbars'] });
let bad = 0;
for (const route of routes) {
  for (const [w, h] of [[1280, 800], [390, 844]]) {
    const p = await browser.newPage();
    await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await p.goto(base + route, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 600));
    const subjects = await p.evaluate(() => {
      const foot = document.querySelector('footer.foot');
      const out = [];
      const hasOwnFill = (el) => {
        for (let a = el; a && a !== foot; a = a.parentElement) {
          const bg = getComputedStyle(a).backgroundColor;
          if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return true;
        }
        return false;
      };
      foot.querySelectorAll('*').forEach((el) => {
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        const isIcon = el.tagName === 'svg';
        if (!own && !isIcon) return;
        if (el.closest('svg') && !isIcon) return;
        if (hasOwnFill(el)) return;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') return;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        el.dataset.fw = String(out.length);
        const c = (cs.color.match(/[\d.]+/g) || []).map(Number);
        out.push({
          i: out.length,
          name: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className) || el.tagName.toLowerCase(),
          text: (el.textContent || '').trim().slice(0, 32),
          color: c.slice(0, 3),
          size: parseFloat(cs.fontSize),
          weight: parseInt(cs.fontWeight, 10),
          y: r.top + window.scrollY,
          icon: isIcon,
        });
      });
      return out;
    });
    const results = [];
    for (const s of subjects) {
      /* Bring the element into view, hide the footer's text, capture, restore. */
      await p.evaluate((i) => {
        const el = document.querySelector(`[data-fw="${i}"]`);
        el.scrollIntoView({ block: 'center' });
        document.querySelector('footer.foot').classList.add('fw-hide');
      }, s.i);
      await p.addStyleTag({ content: '.fw-hide, .fw-hide * { color: transparent !important; text-shadow: none !important; } .fw-hide svg { visibility: hidden !important; }' });
      await new Promise((r) => setTimeout(r, 120));
      const box = await p.evaluate((i) => {
        const r = document.querySelector(`[data-fw="${i}"]`).getBoundingClientRect();
        return { x: Math.max(0, Math.floor(r.left)), y: Math.max(0, Math.floor(r.top)), w: Math.ceil(r.width), h: Math.ceil(r.height) };
      }, s.i);
      const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
      let brightest = null;
      for (let y = box.y; y < Math.min(im.height, box.y + box.h); y++) {
        for (let x = box.x; x < Math.min(im.width, box.x + box.w); x++) {
          const k = (y * im.width + x) * 4;
          const px = [im.data[k], im.data[k + 1], im.data[k + 2]];
          if (!brightest || L(px) > L(brightest)) brightest = px;
        }
      }
      await p.evaluate(() => document.querySelector('footer.foot').classList.remove('fw-hide'));
      const ratio = CR(s.color, brightest);
      const large = s.size >= 24 || (s.size >= 18.66 && s.weight >= 700);
      const need = s.icon ? 3 : large ? 3 : 4.5;
      results.push({ ...s, ground: brightest, ratio, need });
    }
    const fails = results.filter((r) => r.ratio < r.need);
    bad += fails.length;
    const grounds = [...new Set(results.map((r) => `rgb(${r.ground.join(',')})`))];
    const worst = results.reduce((m, r) => (!m || r.ratio / r.need < m.ratio / m.need ? r : m), null);
    console.log(`${route} ${w}: ${results.length} pairs on the painted ground, ${fails.length} failing; grounds seen ${grounds.slice(0, 4).join(' ')}${grounds.length > 4 ? ' ...' : ''}; tightest ${worst ? `${worst.name} "${worst.text}" ${worst.ratio.toFixed(2)}:1 (needs ${worst.need})` : '-'}`);
    for (const f of fails) console.log(`   FAIL ${f.name} "${f.text}" ${f.ratio.toFixed(2)}:1 on rgb(${f.ground.join(',')})`);
    await p.close();
  }
}
await browser.close();
console.log(bad ? `${bad} failing` : 'every footer pair passes on its painted ground');

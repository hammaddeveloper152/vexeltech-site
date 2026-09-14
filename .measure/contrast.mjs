/* contrast.mjs — every painted text pair on a page, walked and checked.

   Not a declared-pair check: it reads each text-bearing element's computed
   colour, walks UP for the first ancestor that actually paints a background,
   composites any alpha against what is behind it, and measures. That is the
   gap the impeccable detector cannot see — it reads declared CSS pairs, and a
   ground set on a section three levels up is not a declared pair with the text
   inside it. */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';

const URL = process.argv[2] || 'http://localhost:4179/';
const AA_BODY = 4.5, AA_LARGE = 3.0;

const b = await puppeteer.launch({ headless:'new', args:['--force-color-profile=srgb'] });
let bad = 0;
for (const [w,h] of [[1280,800],[390,844]]) {
  const p = await b.newPage();
  await p.setViewport({ width:w, height:h });
  await p.goto(URL, { waitUntil:'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const tot = await p.evaluate(()=>document.documentElement.scrollHeight);
  for (let y=0;y<tot;y+=h/2){ await p.evaluate((yy)=>window.scrollTo(0,yy), y); await new Promise(r=>setTimeout(r,90)); }

  const findings = await p.evaluate((AA_BODY, AA_LARGE) => {
    const px = (s) => (s.match(/[\d.]+/g)||[]).map(Number);
    const lin = (c) => { c/=255; return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4; };
    const L = ([r,g,bl]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(bl);
    const CR = (a,bb) => { const l1=Math.max(L(a),L(bb)), l2=Math.min(L(a),L(bb)); return (l1+0.05)/(l2+0.05); };
    const over = (fg,a,bg) => fg.map((c,i)=>c*a+bg[i]*(1-a));

    /* the effective background behind an element, compositing alphas upward */
    const groundOf = (el) => {
      let stack = [];
      let e = el;
      while (e && e !== document.documentElement) {
        const c = getComputedStyle(e);
        const v = px(c.backgroundColor);
        const a = v.length === 4 ? v[3] : 1;
        if (a > 0) stack.push([[v[0],v[1],v[2]], a]);
        if (a === 1) break;
        e = e.parentElement;
      }
      let out = [23,24,26];
      for (let i = stack.length-1; i >= 0; i--) out = over(stack[i][0], stack[i][1], out);
      return out;
    };

    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      const txt = [...el.childNodes].filter(n=>n.nodeType===3 && n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
      if (!txt) continue;
      const c = getComputedStyle(el);
      if (c.visibility === 'hidden' || c.display === 'none') continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const op = parseFloat(c.opacity);
      if (op < 0.05) continue;
      /* OUTLINED TYPE IS READ BY ITS STROKE. The strike ticker's problems
         have a transparent fill and a 1.5px white stroke; their colour is
         rgba(0,0,0,0) and the pair used to read 1:1. */
      let fgv = px(c.color);
      if ((fgv.length === 4 ? fgv[3] : 1) === 0 && parseFloat(c.webkitTextStrokeWidth) > 0) {
        fgv = px(c.webkitTextStrokeColor);
      }
      const fa = (fgv.length === 4 ? fgv[3] : 1) * op;
      const ground = groundOf(el);
      const fg = over([fgv[0],fgv[1],fgv[2]], fa, ground);
      const ratio = CR(fg, ground);
      const size = parseFloat(c.fontSize);
      const bold = parseInt(c.fontWeight,10) >= 700;
      const large = size >= 24 || (size >= 18.66 && bold);
      const need = large ? AA_LARGE : AA_BODY;
      if (ratio < need) out.push({
        cls: (el.className||'').toString().slice(0,38) || el.tagName,
        txt: txt.slice(0,34), ratio: +ratio.toFixed(2), need, size: Math.round(size),
        fg: c.color, ground: `rgb(${ground.map(Math.round).join(', ')})`,
        /* DOCUMENT coordinates, not viewport ones. The walk ends at the
           bottom of the page, so a viewport box for anything above it is off
           screen and samples nothing — the first version of the pixel check
           silently cleared no pairs for exactly that reason. */
        box: [Math.round(r.left + scrollX), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height)],
      });
    }
    return out;
  }, AA_BODY, AA_LARGE);

  /* ---- EVERY FAILURE IS RE-CHECKED AGAINST PAINTED PIXELS ---------------

     The walk above climbs the DOM for the first ancestor that paints a
     background. That is the right test for a ground three levels up and it is
     blind to a ground that is not an ancestor at all: a sibling `::before`, a
     canvas, an absolutely positioned plate behind the text. The pricing tabs
     are exactly that — the active pill is a `::before` on the row, so the
     label's computed ancestor is the track and its PAINTED ground is the pill,
     and the walk reported asphalt on surface-warm at 1.12:1 for a pair that is
     asphalt on machine yellow at 9.46:1.

     So a failure is a candidate, not a verdict. Each one is re-measured
     against the pixels actually painted inside the element's own box, away
     from the glyphs, and a pair that passes there is a ground the DOM could
     not see rather than a defect. Same discipline BUILD-LAW already records
     for the stale-node false positive: check a surprising measurement against
     the pixels before believing it. */
  const real = [];
  const hidden = [];
  if (findings.length) {
    const im = PNG.sync.read(await p.screenshot({ type: 'png', fullPage: true }));
    const lin2 = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    const L2 = (r, g, b) => 0.2126 * lin2(r) + 0.7152 * lin2(g) + 0.0722 * lin2(b);
    const CR2 = (a, b) => { const l1 = Math.max(a, b), l2 = Math.min(a, b); return (l1 + 0.05) / (l2 + 0.05); };
    for (const f of findings) {
      const [x, y, bw, bh] = f.box;
      /* the MODAL colour inside the box: glyphs are a minority of the pixels,
         so the most common value is the ground under them */
      const tally = new Map();
      for (let yy = Math.max(0, y + 1); yy < Math.min(im.height, y + bh - 1); yy++) {
        for (let xx = Math.max(0, x + 1); xx < Math.min(im.width, x + bw - 1); xx++) {
          const i = (yy * im.width + xx) * 4;
          const k = `${im.data[i]},${im.data[i + 1]},${im.data[i + 2]}`;
          tally.set(k, (tally.get(k) || 0) + 1);
        }
      }
      let best = null, bestN = 0;
      for (const [k, n2] of tally) if (n2 > bestN) { best = k; bestN = n2; }
      if (!best) { real.push(f); continue; }
      const g2 = best.split(',').map(Number);

      /* THE GLYPH COLOUR COMES FROM PIXELS TOO, and this is the half that
         matters. The first version compared the DECLARED colour against the
         painted ground, which ignores every opacity between them — it cleared
         the ghost rows at 6.33:1 when the composite a reader sees is 2.61:1.
         A pixel check that only replaces one side of the pair is worse than
         no check, because it clears real failures while it fixes false ones.

         The glyph core is the pixel furthest in luminance from the ground.
         Anti-aliased edges sit between the two, so the extreme is the ink. */
      const gl = L2(g2[0], g2[1], g2[2]);
      let ink = null, far = -1;
      for (let yy = Math.max(0, y + 1); yy < Math.min(im.height, y + bh - 1); yy++) {
        for (let xx = Math.max(0, x + 1); xx < Math.min(im.width, x + bw - 1); xx++) {
          const i = (yy * im.width + xx) * 4;
          const d = Math.abs(L2(im.data[i], im.data[i + 1], im.data[i + 2]) - gl);
          if (d > far) { far = d; ink = [im.data[i], im.data[i + 1], im.data[i + 2]]; }
        }
      }
      if (!ink) { real.push(f); continue; }
      const ratio2 = CR2(L2(ink[0], ink[1], ink[2]), gl);
      const shot = { ...f, painted: `rgb(${g2.join(', ')})`, inkPainted: `rgb(${ink.join(', ')})`, ratio2: +ratio2.toFixed(2) };
      if (ratio2 >= f.need) hidden.push(shot); else real.push(shot);
    }
  }

  console.log(`\n=== ${w}x${h} — ${real.length} failing pair(s) ===`);
  for (const f of real) {
    const painted = f.painted ? `  [painted ${f.painted} ${f.ratio2}:1]` : '';
    console.log(`  ${String(f.ratio).padStart(5)} (needs ${f.need})  ${f.size}px  ${f.cls.padEnd(30)} "${f.txt}"  ${f.fg} on ${f.ground}${painted}`);
  }
  if (hidden.length) {
    console.log(`  -- ${hidden.length} pair(s) cleared on painted pixels: a ground the DOM walk cannot see --`);
    for (const f of hidden) console.log(`     ${String(f.ratio).padStart(5)} declared -> ${f.ratio2}:1 painted   ${f.cls.padEnd(28)} "${f.txt}"  on ${f.painted}`);
  }
  bad += real.length;
  await p.close();
}
await b.close();
console.log(bad ? `\n${bad} failing pairs` : '\nEvery painted text pair passes.');

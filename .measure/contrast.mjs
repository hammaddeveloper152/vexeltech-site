/* contrast.mjs — every painted text pair on a page, walked and checked.

   Not a declared-pair check: it reads each text-bearing element's computed
   colour, walks UP for the first ancestor that actually paints a background,
   composites any alpha against what is behind it, and measures. That is the
   gap the impeccable detector cannot see — it reads declared CSS pairs, and a
   ground set on a section three levels up is not a declared pair with the text
   inside it. */
import puppeteer from 'puppeteer';

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
      const fgv = px(c.color);
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
      });
    }
    return out;
  }, AA_BODY, AA_LARGE);

  console.log(`\n=== ${w}x${h} — ${findings.length} failing pair(s) ===`);
  for (const f of findings) console.log(`  ${String(f.ratio).padStart(5)} (needs ${f.need})  ${f.size}px  ${f.cls.padEnd(30)} "${f.txt}"  ${f.fg} on ${f.ground}`);
  bad += findings.length;
  await p.close();
}
await b.close();
console.log(bad ? `\n${bad} failing pairs` : '\nEvery painted text pair passes.');

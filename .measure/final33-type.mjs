/* final33-type.mjs: every heading and every figure on the phone (final33,
   2026-10-07). At 390, each h1/h2 and any text at 40px or more, with its
   size; flags a display heading outside 28 to 36px (the hero h1 and About's
   44px h1 excepted) and a figure over 64px (the hero h1 and the footer
   wordmark excepted).
     node .measure/final33-type.mjs [base] [width] */
import puppeteer from 'puppeteer';
const BASE = process.argv[2] || 'http://localhost:4190';
const W = Number(process.argv[3] || 390);
const b = await puppeteer.launch({ headless: 'new' });
for (const route of ['/', '/services', '/pricing', '/about-us', '/contact-us']) {
  const p = await b.newPage();
  await p.setViewport({ width: W, height: 844 });
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const out = [];
    for (const e of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      const fs = parseFloat(cs.fontSize);
      const isH = /^H[12]$/.test(e.tagName);
      if (!(isH || (own && fs >= 40))) continue;
      if (e.closest('.skip-h, .lf__sr') || /inset\(50%\)/.test(cs.clipPath)) continue;
      const t = e.textContent.trim().slice(0, 30);
      const ex = e.closest('.hero') || e.closest('.sf__mark') || e.classList.contains('ab3-hero__h');
      let flag = '';
      if (isH && !ex && (fs < 28 || fs > 36)) flag = 'HEADING OUTSIDE 28-36';
      if (!isH && !ex && fs > 64) flag = 'FIGURE OVER 64';
      out.push(`${Math.round(fs)}px ${e.tagName.toLowerCase()} "${t}"${flag ? '  <- ' + flag : ''}`);
    }
    return [...new Set(out)];
  });
  console.log(`== ${route} @${W}\n  ` + r.join('\n  '));
  await p.close();
}
await b.close();

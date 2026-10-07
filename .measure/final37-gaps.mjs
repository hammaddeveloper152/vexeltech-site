/* final37-gaps.mjs: the section titles (final37, 2026-10-08, the founder).
   For every `.hl` on every route at 390, 430, 1024 and 1280: its face, size
   and line count, whether any word overflows its box, and, where a lead
   follows it, the gap from the title's last baseline to the lead's cap
   height (the brief's 20px at 390, 24 from 1024). Baselines are read off a
   zero-size inline-block set on the line; the cap height is the lead's
   baseline less Satoshi's 0.74em. Also the What we do cards' heights (the
   70% cap at 390 is 590px) and The Next Size's steps.

     node .measure/final37-gaps.mjs [base]   (default http://localhost:4190) */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/thanks', '/nope'];
const b = await puppeteer.launch({ headless: 'new' });
for (const w of [390, 430, 1024, 1280]) {
  for (const route of ROUTES) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: 844 });
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    const rows = await p.evaluate(() => {
      const base = (el, atEnd) => {
        const m = document.createElement('span');
        m.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
        if (atEnd) el.appendChild(m);
        else el.insertBefore(m, el.firstChild);
        const y = m.getBoundingClientRect().bottom;
        m.remove();
        return y;
      };
      return [...document.querySelectorAll('.hl')]
        .filter((e) => e.getBoundingClientRect().height)
        .map((e) => {
          const cs = getComputedStyle(e);
          const lines = Math.round(e.getBoundingClientRect().height / parseFloat(cs.lineHeight));
          const over = e.scrollWidth > e.clientWidth + 1;
          const next = e.nextElementSibling;
          let gap = null;
          if (next && /services__lead|sec-lead|tail__line|callband__note|ab__lead/.test(next.className)) {
            const hb = base(e, true);
            const lb = base(next, false) - 0.74 * parseFloat(getComputedStyle(next).fontSize);
            gap = Math.round((lb - hb) * 10) / 10;
          }
          return `${cs.fontFamily.split(',')[0]} ${cs.fontSize} ${lines} line${lines > 1 ? 's' : ''}${over ? ' OVERFLOW' : ''}${gap !== null ? `, lead gap ${gap}px` : ''}  "${e.textContent.trim().slice(0, 44)}"`;
        });
    });
    const extra = await p.evaluate(() => ({
      cards: [...document.querySelectorAll('.wwd__card')].map((c) => Math.round(c.getBoundingClientRect().height)),
      steps: [...document.querySelectorAll('.ns__step')].map((c) => Math.round(c.getBoundingClientRect().height)),
    }));
    console.log(`== ${route} @${w}`);
    rows.forEach((r) => console.log(`   ${r}`));
    if (extra.cards.length) console.log(`   What we do cards: ${extra.cards.join(' / ')}px (cap at 390: 590)`);
    if (extra.steps.length) console.log(`   The Next Size steps: ${extra.steps.join(' / ')}px`);
    await p.close();
  }
}
await b.close();

/* v42-lines.mjs: copy V4.2's typed answers, measured (2026-10-07). For each
   What we do card at 390 and 1280, at rest (reduced motion), how many
   lines the WE DO answer sets in, whether any line breaks inside a word or
   at a hyphen, and whether the answer and the fact stay inside the card.
   Also the hero at 390: the line under the h1, its lines, and whether the
   call is still on the first screen (BUILD-LAW Layout).

     node .measure/v42-lines.mjs [base]   (default http://localhost:4190) */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const b = await puppeteer.launch({ headless: 'new' });
for (const w of [390, 1280]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const lines = (el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const tops = new Set([...range.getClientRects()].filter((x) => x.width > 1).map((x) => Math.round(x.top)));
      return tops.size;
    };
    const cards = [...document.querySelectorAll('.wwd__card')].map((c) => {
      /* The visible answer (the screen reader's copy beside it is clipped). */
      const fill = c.querySelector('.wwd__fill [aria-hidden]') || c.querySelector('.wwd__fill');
      const fact = c.querySelector('.wwd__fact');
      const cr = c.getBoundingClientRect();
      const inside = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return r.bottom <= cr.bottom + 0.5 && r.right <= cr.right + 0.5;
      };
      return {
        name: c.querySelector('.wwd__form')?.textContent.trim().slice(0, 24),
        answerLines: fill ? lines(fill) : null,
        answerInside: inside(fill),
        factInside: inside(fact),
        card: `${Math.round(cr.width)}x${Math.round(cr.height)}`,
      };
    });
    const sub = document.querySelector('.hero__sub');
    const cta = document.querySelector('.hero__cta');
    return {
      cards,
      heroSubLines: sub ? lines(sub) : null,
      callOnFirstScreen: cta ? cta.getBoundingClientRect().bottom <= window.innerHeight : null,
    };
  });
  console.log(`@${w}`, JSON.stringify(r, null, 1));
  await p.close();
}
await b.close();

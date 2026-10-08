/* final41-measure.mjs (FINAL41, 2026-10-08, the founder): What we do's
   four cards at 390, 430, 1024 and 1280, at rest (reduced motion, answers
   filled): each question's and answer's line count, the card's height,
   the gap from the answer's line (its 3px rule) to the fact, and the
   bottom of each card's fact row (they must align from 1024). And the
   footer: the three columns' tops and feet at 1280, and the Start call's
   box at 390.
     node .measure/final41-measure.mjs [base]   (default http://localhost:4190) */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const b = await puppeteer.launch({ headless: 'new' });
for (const w of [390, 430, 1024, 1280]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: 844 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const rows = await p.evaluate(() =>
    [...document.querySelectorAll('.wwd__card')].map((c) => {
      const lines = (e) => Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight));
      const q = c.querySelector('.wwd__q');
      const ansLine = c.querySelector('.wwd__ans');
      const ans = ansLine.lastElementChild;
      const meta = c.querySelector('.wwd__meta');
      const fact = c.querySelector('.wwd__fact');
      return {
        name: c.querySelector('.wwd__form').textContent.trim(),
        q: lines(q),
        a: lines(ans),
        h: Math.round(c.getBoundingClientRect().height),
        gap: Math.round(fact.getBoundingClientRect().top - ansLine.getBoundingClientRect().bottom),
        foot: Math.round(meta.getBoundingClientRect().bottom + scrollY),
        cardFoot: Math.round(c.getBoundingClientRect().bottom + scrollY),
      };
    })
  );
  const qs = rows.map((r) => r.q);
  const as = rows.map((r) => r.a);
  console.log(`== @${w}  questions within ${Math.max(...qs) - Math.min(...qs)} line, answers within ${Math.max(...as) - Math.min(...as)} line`);
  for (const r of rows) console.log(`   ${r.name.padEnd(18)} question ${r.q}  answer ${r.a}  card ${r.h}px  answer line to fact ${r.gap}px  fact row foot ${r.foot}  card foot ${r.cardFoot}`);
  if (w === 1280 || w === 390) {
    const f = await p.evaluate(() => {
      const cols = [...document.querySelectorAll('.sf__col')].map((c) => {
        const r = c.getBoundingClientRect();
        const last = c.lastElementChild.getBoundingClientRect();
        return `${Math.round(r.top + scrollY)} to ${Math.round(r.bottom + scrollY)} (last block's foot ${Math.round(last.bottom + scrollY)})`;
      });
      const cta = document.querySelector('.sf__cta').getBoundingClientRect();
      const k = [...document.querySelectorAll('.sf__k')].pop().getBoundingClientRect();
      return { cols, cta: `${Math.round(cta.left)},${Math.round(cta.top + scrollY)} ${Math.round(cta.width)}x${Math.round(cta.height)}`, startLabelToCall: Math.round(cta.top - k.bottom) };
    });
    console.log(`   footer @${w}: columns ${f.cols.join(' | ')}; Start call at ${f.cta}, ${f.startLabelToCall}px under its label`);
  }
  await p.close();
}
await b.close();

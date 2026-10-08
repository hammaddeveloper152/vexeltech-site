/* final43-pricing-gaps.mjs (FINAL43, the founder): the gaps around
   /pricing's one call at 1280 and 390: the bundle's foot to the call, the
   call to its promise line, the block's last line to the section's end
   and to the next section's first content, and the section token there.
     node .measure/final43-pricing-gaps.mjs [base]   (default 4190) */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const b = await puppeteer.launch({ headless: 'new' });
for (const w of [1280, 390]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + '/pricing', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const y = (e, k) => Math.round(e.getBoundingClientRect()[k] + scrollY);
    const sec = document.querySelector('.pr-grid');
    const bundle = document.querySelector('.pr-bundle');
    const call = document.querySelector('.pr-grid__cta');
    const promise = document.querySelector('.pr-grid__promise');
    const notes = [...sec.querySelectorAll('.pr-grid__note')];
    const kids = [...sec.querySelectorAll('*')].filter((e) => e.getBoundingClientRect().height && e.children.length === 0);
    const lastContent = Math.max(...kids.map((e) => y(e, 'bottom')));
    const next = sec.nextElementSibling;
    const nextFirst = next ? [...next.querySelectorAll('h2, h3, p, button, a')].find((e) => e.getBoundingClientRect().height) : null;
    const token = getComputedStyle(document.documentElement).getPropertyValue('--s-section').trim();
    return {
      callHeight: Math.round(call.getBoundingClientRect().height),
      callFont: getComputedStyle(call).fontSize,
      bundleToCall: y(call, 'top') - y(bundle, 'bottom'),
      /* Since FINAL43 the footnotes stand between: the grid's last line. */
      gridEndToCall: y(call, 'top') - Math.max(y(bundle, 'bottom'), ...notes.filter((e) => y(e, 'top') < y(call, 'top')).map((e) => y(e, 'bottom'))),
      callToPromise: promise ? y(promise, 'top') - y(call, 'bottom') : null,
      blockToNotes: notes.length ? y(notes[0], 'top') - y(promise || call, 'bottom') : null,
      notesAfterCall: notes.length ? y(notes[0], 'top') > y(call, 'top') : null,
      lastContentToSectionEnd: y(sec, 'bottom') - lastContent,
      lastContentToNextContent: nextFirst ? y(nextFirst, 'top') - lastContent : null,
      sectionPadBottom: getComputedStyle(sec).paddingBottom,
      token,
      tokenPx: Math.round(parseFloat(getComputedStyle(sec).getPropertyValue('--s-section')) || 0),
    };
  });
  console.log(`@${w}`, JSON.stringify(r));
  await p.close();
}
await b.close();

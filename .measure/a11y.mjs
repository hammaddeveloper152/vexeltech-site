import { open } from './lib.mjs';

const W = Number(process.argv[2] || 1280), H = Number(process.argv[3] || 800);
const { browser, page } = await open(W, H);

/* 1. landmark and skip link */
const landmarks = await page.evaluate(() => {
  const m = document.querySelectorAll('main');
  const skip = document.querySelector('.skip');
  return {
    mainCount: m.length,
    mainId: m[0] ? m[0].id : null,
    mainTabIndex: m[0] ? m[0].tabIndex : null,
    mainChildren: m[0] ? m[0].children.length : 0,
    skipText: skip ? skip.textContent.trim() : null,
    skipHref: skip ? skip.getAttribute('href') : null,
    skipFirstInTab: (() => {
      const f = document.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
      return f[0] === skip;
    })(),
    h1s: document.querySelectorAll('h1').length,
  };
});
console.log('LANDMARK / SKIP LINK', landmarks);

/* the skip link is off screen until focused */
const skipBox = await page.evaluate(() => {
  const s = document.querySelector('.skip');
  const before = s.getBoundingClientRect();
  s.focus();
  const after = s.getBoundingClientRect();
  return { hiddenTop: Math.round(before.top), focusedTop: Math.round(after.top), h: Math.round(after.height) };
});
console.log('  off screen at top', skipBox.hiddenTop, '-> on screen at', skipBox.focusedTop, ', height', skipBox.h);

/* does it actually move focus into main? */
const landed = await page.evaluate(() => {
  document.querySelector('.skip').click();
  return { active: document.activeElement.tagName, id: document.activeElement.id };
});
console.log('  after activating:', landed);

/* 2. tab stops before the first content */
const tab = await page.evaluate(() => {
  const f = Array.from(document.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'))
    .filter((el) => el.offsetParent !== null || el === document.activeElement);
  const main = document.querySelector('main');
  const firstInMain = f.findIndex((el) => main.contains(el));
  return { total: f.length, beforeMain: firstInMain, order: f.slice(0, 8).map((e) => (e.className || e.tagName).toString().split(' ')[0]) };
});
console.log('TAB STOPS', tab);

/* 3. process step titles: read once? */
await page.evaluate(() => document.querySelector('.process').scrollIntoView());
await new Promise((r) => setTimeout(r, 500));
const proc = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('.process__t').forEach((h) => {
    const spans = Array.from(h.querySelectorAll('span'));
    out.push({
      text: h.textContent.trim().slice(0, 30),
      spans: spans.length,
      exposed: spans.filter((s) => s.getAttribute('aria-hidden') !== 'true').map((s) => s.textContent.trim().slice(0, 24)),
    });
  });
  const nums = Array.from(document.querySelectorAll('.process__n')).map((n) => n.getAttribute('aria-hidden'));
  return { titles: out, numeralsHidden: nums };
});
console.log('PROCESS TITLES');
for (const t of proc.titles) console.log('  spans', t.spans, 'announced:', JSON.stringify(t.exposed));
console.log('  numeral wrappers aria-hidden:', proc.numeralsHidden.join(','));

/* 4. marquee pause control */
await page.evaluate(() => document.querySelector('.marquee').scrollIntoView());
await new Promise((r) => setTimeout(r, 400));
const play = () => page.evaluate(() => getComputedStyle(document.querySelector('.marquee__track')).animationPlayState);
const btn = await page.$('.marquee__toggle');
const before = await play();
const label1 = await page.evaluate(() => document.querySelector('.marquee__toggle').getAttribute('aria-label'));
await btn.click();
await new Promise((r) => setTimeout(r, 250));
const after = await play();
const label2 = await page.evaluate(() => document.querySelector('.marquee__toggle').getAttribute('aria-label'));
const dataOff = await page.evaluate(() => document.querySelector('.marquee').dataset.running);
/* and back again, by keyboard this time */
await page.evaluate(() => document.querySelector('.marquee__toggle').focus());
await page.keyboard.press('Enter');
await new Promise((r) => setTimeout(r, 250));
const back = await play();
const box = await page.evaluate(() => {
  const r = document.querySelector('.marquee__toggle').getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height) };
});
const mq = { box, label1, label2, before, after, dataOff, backAfterEnter: back };
console.log('MARQUEE CONTROL', mq);

/* 5. no yellow left on the strip */
const sep = await page.evaluate(() => {
  const s = document.querySelector('.marquee__sep');
  return { color: getComputedStyle(s).color, size: getComputedStyle(s).fontSize };
});
console.log('  separator', sep);

await browser.close();

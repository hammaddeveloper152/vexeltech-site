/* The bar's call at three type steps, each captured in a frame that also
   holds the hero's call, so the judgement is about two calls competing
   rather than about whether one fits.

   The bar's call is button-secondary: transparent, white label, 12% border.
   The hero's is button-primary: machine yellow ground, asphalt label, and
   the frame's one accent. So this is not an accent-count question — it is
   whether a persistent white call at the top of the frame reads as a second
   call to the one the hero is making. */
import fs from 'node:fs';
import puppeteer from 'puppeteer';

const URL = 'http://localhost:5173/';
const OUT = '.measure/out/bar';
fs.mkdirSync(OUT, { recursive: true });

const STEPS = [
  ['12', 'var(--t-label-size)', 'var(--t-label-line)'],
  ['18', 'var(--t-body-size)', 'var(--t-body-line)'],
  ['27', 'var(--t-h3-size)', 'var(--t-h3-line)'],
];

const b = await puppeteer.launch({ headless: 'new' });

for (const W of [1280, 1024]) {
  for (const [name, size, line] of STEPS) {
    const p = await b.newPage();
    await p.setViewport({ width: W, height: 800, deviceScaleFactor: 1 });
    await p.goto(URL, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 2200));

    const m = await p.evaluate(
      ([sz, ln]) => {
        const px = (v) => Math.round(v * 100) / 100;
        const cta = document.querySelector('.bar__cta');
        cta.style.fontSize = sz;
        cta.style.lineHeight = ln;

        const inner = document.querySelector('.bar__inner');
        const cs = getComputedStyle(inner);
        const brand = document.querySelector('.bar__brand');
        const nav = document.querySelector('.bar__nav');
        const gap = parseFloat(cs.columnGap || cs.gap);
        const contentBox = px(
          inner.getBoundingClientRect().width -
            parseFloat(cs.paddingLeft) -
            parseFloat(cs.paddingRight)
        );
        const budget = px(
          contentBox -
            brand.getBoundingClientRect().width -
            nav.getBoundingClientRect().width -
            gap * 2
        );
        const bar = cta.getBoundingClientRect();
        const hero = document.querySelector('.hero__cta').getBoundingClientRect();
        return {
          budget,
          bar: { w: px(bar.width), h: px(bar.height), area: px(bar.width * bar.height) },
          hero: { w: px(hero.width), h: px(hero.height), area: px(hero.width * hero.height) },
          ratio: px((bar.width * bar.height) / (hero.width * hero.height)),
          barTop: px(bar.top),
          heroTop: px(hero.top),
          bothInFrame: hero.bottom <= innerHeight && bar.top >= 0,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      },
      [size, line]
    );

    await new Promise((r) => setTimeout(r, 250));
    await p.screenshot({ path: `${OUT}/bar-${W}-${name}px.png` });
    console.log(
      `${W}  ${name}px  bar ${String(m.bar.w).padStart(6)}x${m.bar.h}  ` +
        `hero ${m.hero.w}x${m.hero.h}  bar area is ${(m.ratio * 100).toFixed(1)}% of hero's  ` +
        `budget ${m.budget}  bothInFrame=${m.bothInFrame}  overflow=${m.overflow}`
    );
    await p.close();
  }
}
await b.close();

/* phonecall.mjs: one yellow call per screen on a phone, the top-aligned hero
   headline, and the current page by tone, 2026-09-30 (the founder).

   At 390x844 and 430x932 on home:
     - sweeps the scroll from 0 to 700 in 10px steps and counts, at each
       step, how many yellow calls are on screen and visible (the bar's call
       at opacity > 0, the hero's call below the bar and above the fold);
     - finds the scroll at which the bar's call is shown;
     - holds each of the four headline lines (the film paused and seeked to
       its shot) and measures the gap above the line (to the bar) and below
       it (to the offer line), with a frame of each;
     - frames at scroll 0 and 400.
   On /services at 390 and 430 (the menu panel open, where the links are)
   and 1280 (the bar), and on /about-us at 1280: each link's colour and
   background at rest. At 768 the bar's call is shown at scroll 0. Checks
   that no sticky bottom call is in the page, and collects console errors.

   Usage: node .measure/phonecall.mjs [base]   (default http://localhost:4173)
   Frames go to .measure/out/phonecall/. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out', 'phonecall');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.argv[2] || 'http://localhost:4173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const CUTS = [0, 45, 145, 234].map((f) => f / 24);

const errors = [];
const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
const open = async (w, h, route = '/') => {
  const p = await b.newPage();
  p.on('console', (m) => m.type() === 'error' && errors.push(`${w} ${route}: ${m.text()}`));
  p.on('pageerror', (e) => errors.push(`${w} ${route}: ${e.message}`));
  await p.setViewport({ width: w, height: h });
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await wait(1200);
  return p;
};
const scrollTo = async (p, y, settle = 500) => {
  await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
  await wait(settle);
};
const calls = (p) =>
  p.evaluate(() => {
    const bar = document.querySelector('.bar').getBoundingClientRect();
    const bc = document.querySelector('.bar__inner > .bar__cta');
    const bcs = getComputedStyle(bc);
    const hc = document.querySelector('.hero__actions .hero__cta').getBoundingClientRect();
    const barShown = bcs.display !== 'none' && bcs.visibility !== 'hidden' && Number(bcs.opacity) > 0;
    const heroShown = hc.bottom > bar.bottom && hc.top < innerHeight;
    return {
      y: Math.round(scrollY),
      barCall: barShown,
      barOpacity: Number(bcs.opacity),
      heroCall: heroShown,
      heroCallBottom: Math.round(hc.bottom),
      held: document.querySelector('.bar').getAttribute('data-call'),
      yellow: (barShown ? 1 : 0) + (heroShown ? 1 : 0),
    };
  });

const report = { phone: {} };
for (const [w, h] of [[390, 844], [430, 932]]) {
  const p = await open(w, h);
  const r = {};
  r.stickyCallInPage = await p.evaluate(() => !!document.querySelector('.stick'));
  r.at0 = await calls(p);
  await p.screenshot({ path: path.join(OUT, `${w}-home-scroll0.png`) });

  /* The sweep. 300ms a step lets the 150ms fade finish before it is read. */
  const sweep = [];
  for (let y = 0; y <= 700; y += 10) {
    await scrollTo(p, y, 300);
    sweep.push(await calls(p));
  }
  r.maxYellowOnScreen = Math.max(...sweep.map((s) => s.yellow));
  r.stepsWithTwo = sweep.filter((s) => s.yellow > 1).map((s) => s.y);
  const firstShown = sweep.find((s) => s.barCall);
  r.barCallShownFrom = firstShown ? { y: firstShown.y, heroCallBottom: firstShown.heroCallBottom } : null;
  const lastHeld = [...sweep].reverse().find((s) => !s.barCall);
  r.barCallLastHeldAt = lastHeld ? { y: lastHeld.y, heroCallBottom: lastHeld.heroCallBottom } : null;

  await scrollTo(p, 400, 600);
  r.at400 = await calls(p);
  await p.screenshot({ path: path.join(OUT, `${w}-home-scroll400.png`) });

  /* The four lines, each held on its own shot. */
  await scrollTo(p, 0, 600);
  r.lines = [];
  for (let i = 0; i < CUTS.length; i++) {
    await p.evaluate((t) => {
      const v = document.querySelector('.hero__spot');
      v.pause();
      v.currentTime = t;
    }, CUTS[i] + 0.6);
    await wait(700);
    const m = await p.evaluate(() => {
      const bar = document.querySelector('.bar').getBoundingClientRect();
      const line = document.querySelector('.hero__line');
      const lr = line.getBoundingClientRect();
      const box = document.querySelector('.hero__headline').getBoundingClientRect();
      const price = document.querySelector('.hero__price').getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(line);
      const rows = new Set(Array.from(range.getClientRects()).map((x) => Math.round(x.top))).size;
      return {
        text: line.textContent,
        rows,
        gapAbove: +(lr.top - bar.bottom).toFixed(1),
        gapBelow: +(price.top - lr.bottom).toFixed(1),
        boxTop: +(box.top - bar.bottom).toFixed(1),
        boxHeight: +box.height.toFixed(1),
        priceTop: +price.top.toFixed(1),
      };
    });
    r.lines.push(m);
    await p.screenshot({ path: path.join(OUT, `${w}-home-line${i + 1}.png`) });
  }
  report.phone[w] = r;
  await p.close();
}

/* The current page by tone. */
const tone = (sel) =>
  Array.from(document.querySelectorAll(sel)).map((a) => {
    const cs = getComputedStyle(a);
    return { text: a.textContent.trim(), current: a.getAttribute('aria-current') === 'page', color: cs.color, bg: cs.backgroundColor };
  });
report.current = {};
for (const [w, h] of [[390, 844], [430, 932]]) {
  const p = await open(w, h, '/services');
  await p.screenshot({ path: path.join(OUT, `${w}-services-scroll0.png`) });
  report.current[`${w}-services-barCall`] = (await p.evaluate(() => getComputedStyle(document.querySelector('.bar__inner > .bar__cta')).opacity));
  await p.click('.bar__menu');
  await wait(400);
  report.current[`${w}-services-panel`] = await p.evaluate(tone, '.bar__panel-link');
  await p.screenshot({ path: path.join(OUT, `${w}-services-panel.png`) });
  await p.close();
}
for (const route of ['/services', '/about-us']) {
  const p = await open(1280, 800, route);
  report.current[`1280${route}`] = await p.evaluate(tone, '.bar__link');
  await p.screenshot({ path: path.join(OUT, `1280${route.replace('/', '-')}-bar.png`), clip: { x: 0, y: 0, width: 1280, height: 64 } });
  await p.close();
}
{
  const p = await open(768, 1024);
  report.tablet768 = await calls(p);
  await p.close();
}

await b.close();
report.consoleErrors = errors;
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));

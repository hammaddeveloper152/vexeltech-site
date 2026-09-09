/* The container-budget test on the bar, at the width where the bar is fully
   populated: 1024, the breakpoint at which the navigation appears and the
   menu button goes away.

   BUILD-LAW.md, "Content can sit outside its own container's budget with
   nothing reporting it": measure the container's content box, subtract every
   fixed cost inside it, and compare the remainder to what has to fit. */
import puppeteer from 'puppeteer';

const URL = process.env.URL || 'http://localhost:5173/hero-preview.html';
const W = Number(process.argv[2] || 1024);

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: W, height: 900, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 400));

const out = await page.evaluate(() => {
  const px = (v) => Math.round(v * 100) / 100;
  const inner = document.querySelector('.bar__inner');
  const cs = getComputedStyle(inner);
  const box = inner.getBoundingClientRect();
  const padL = parseFloat(cs.paddingLeft);
  const padR = parseFloat(cs.paddingRight);
  const gap = parseFloat(cs.columnGap || cs.gap);

  const vis = (el) => el && el.offsetParent !== null;
  const brand = document.querySelector('.bar__brand');
  const nav = document.querySelector('.bar__nav');
  const cta = document.querySelector('.bar__cta');
  const menu = document.querySelector('.bar__menu');

  const items = [
    ['brand', brand],
    ['nav', nav],
    ['cta', cta],
    ['menu', menu],
  ].filter(([, el]) => vis(el));

  const widths = Object.fromEntries(
    items.map(([k, el]) => [k, px(el.getBoundingClientRect().width)])
  );

  const links = [...document.querySelectorAll('.bar__link')].map((a) => ({
    label: a.textContent.trim(),
    w: px(a.getBoundingClientRect().width),
    h: px(a.getBoundingClientRect().height),
  }));

  const contentBox = px(box.width - padL - padR);
  const gaps = px(gap * (items.length - 1));
  const fixed = px(widths.brand + widths.nav + gaps);
  const budget = px(contentBox - fixed);

  return {
    viewport: innerWidth,
    barWidth: px(box.width),
    padding: [padL, padR],
    gap,
    items: items.map(([k]) => k),
    contentBox,
    widths,
    gaps,
    fixed,
    budget,
    ctaWidth: widths.cta,
    slack: px(budget - widths.cta),
    links,
    navGap: px(parseFloat(getComputedStyle(document.querySelector('.bar__list')).columnGap)),
    docScrollsSideways: document.documentElement.scrollWidth > innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  };
});

console.log(JSON.stringify(out, null, 2));
await browser.close();

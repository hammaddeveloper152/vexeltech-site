/* final-behaviour.mjs: the final pass's objects, measured (2026-10-03).

     home       the spine segment sits beside the active row and the active
                row is the one nearest the viewport's middle; the ledger
                counts to its figures; the accordion is edge to edge, its
                height fixed, the active panel 4 to 1, hover and keys move
                it, every panel a new-tab link; no coloured fill outside
                What we do
     services   the brand marks land, the callouts draw, the thread plays
     about      the statement is asphalt after its sequence, the rail
                draws, the figures count
     reduced    every object in its final state with nothing moving
     rule 0     each new file is referenced by one page, once

   Usage: node .measure/final-behaviour.mjs [base] */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const out = {};
const b = await puppeteer.launch({ headless: 'new' });

async function open(route, { width = 1280, height = 800, reduce = false, touch = false } = {}) {
  const p = await b.newPage();
  if (touch) {
    await p.emulate({ viewport: { width, height, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, userAgent: 'Mozilla/5.0 (iPhone)' });
  } else {
    await p.setViewport({ width, height });
  }
  if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  /* A tab behind another one gets no frames, so its transitions never
     finish: every page is brought to the front. */
  await p.bringToFront();
  await p.evaluate(() => document.fonts.ready);
  return p;
}
const to = (p, sel, block = 'center') =>
  p.evaluate((s, bl) => document.querySelector(s).scrollIntoView({ block: bl }), sel, block);

/* ---- home ---- */
let p = await open('/');
for (const i of [0, 1, 2, 3]) {
  await p.evaluate((n) => {
    const r = document.querySelectorAll('.kc__row')[n];
    const y = r.getBoundingClientRect().top + scrollY + r.offsetHeight / 2 - innerHeight / 2;
    scrollTo(0, y);
  }, i);
  await wait(900);
  const r = await p.evaluate(() => {
    const rows = [...document.querySelectorAll('.kc__row')];
    const on = rows.findIndex((x) => x.dataset.on === 'true');
    const seg = document.querySelector('.kc__seg').getBoundingClientRect();
    const row = rows[on].getBoundingClientRect();
    const lit = getComputedStyle(rows[on].querySelector('.kc__w'), '::after').opacity;
    return { on, segTop: Math.round(seg.top - row.top), segH: Math.round(seg.height - row.height), lit };
  });
  out[`spine row ${i}`] = r;
}
await to(p, '.fl2');
await wait(1600);
out.ledger = await p.evaluate(() => [...document.querySelectorAll('.fl2__fig')].map((x) => x.textContent));
out.homeFills = await p.evaluate(() => {
  const what = document.querySelector('section.services');
  const found = [];
  for (const el of document.querySelectorAll('main *')) {
    if (what && what.contains(el)) continue;
    const c = getComputedStyle(el).backgroundColor;
    const m = c.match(/\d+(\.\d+)?/g);
    if (!m || (m[3] !== undefined && +m[3] === 0)) continue;
    const [r, g, bl] = m.map(Number);
    const sat = Math.max(r, g, bl) - Math.min(r, g, bl);
    if (sat > 40 && el.getBoundingClientRect().width > 0) found.push(`${el.className || el.tagName} ${c}`);
  }
  return [...new Set(found)];
});
await to(p, '.wa__row');
await wait(800);
const geo = () =>
  p.evaluate(() => {
    const row = document.querySelector('.wa__row').getBoundingClientRect();
    const ps = [...document.querySelectorAll('.wa__panel')].map((x) => Math.round(x.getBoundingClientRect().width));
    return { left: row.left, right: Math.round(row.right), vw: document.documentElement.clientWidth, h: row.height, widths: ps.join(' '), on: [...document.querySelectorAll('.wa__panel')].findIndex((x) => x.dataset.on === 'true') };
  });
out.accordion1280 = await geo();
const box = await p.evaluate(() => {
  const r = document.querySelectorAll('.wa__panel')[3].getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
await p.mouse.move(box.x, box.y);
await wait(900);
out.accordionHover = await geo();
await p.focus('.wa__link');
await p.keyboard.press('ArrowRight');
await wait(900);
out.accordionKey = await geo();
out.accordionLinks = await p.evaluate(() => [...document.querySelectorAll('.wa__link')].every((a) => a.target === '_blank' && a.rel === 'noopener'));
out.accordionAnim = await p.evaluate(() => getComputedStyle(document.querySelector('.wa__panel[data-on="true"] img')).animationName);
await p.close();

p = await open('/', { width: 390, height: 844, touch: true });
await to(p, '.wa__row', 'start');
await wait(600);
const hs = () => p.evaluate(() => [...document.querySelectorAll('.wa__panel')].map((x) => Math.round(x.getBoundingClientRect().height)).join(' '));
out.accordion390 = { heights: await hs(), row: await p.evaluate(() => document.querySelector('.wa__row').getBoundingClientRect().height) };
const t = await p.evaluate(() => {
  const r = document.querySelectorAll('.wa__panel')[2].getBoundingClientRect();
  return { x: r.x + 40, y: r.y + 40 };
});
const pages0 = (await b.pages()).length;
await p.touchscreen.tap(t.x, t.y);
await wait(900);
out.accordion390tap = { heights: await hs(), openedTab: (await b.pages()).length > pages0 };
/* The second tap on the now active panel opens its site. */
const t2 = await p.evaluate(() => {
  const r = document.querySelectorAll('.wa__panel')[2].getBoundingClientRect();
  return { x: r.x + 40, y: r.y + 40 };
});
await p.touchscreen.tap(t2.x, t2.y);
await wait(900);
out.accordion390tap2 = { openedTab: (await b.pages()).length > pages0 };
await p.close();

/* ---- services ---- */
p = await open('/services');
await to(p, '.bb');
await wait(900);
out.brand = await p.evaluate(() => [...document.querySelectorAll('.bb__p')].map((x) => `${getComputedStyle(x).opacity} ${getComputedStyle(x).transform}`));
await to(p, '.ab');
await wait(2200);
out.callouts = await p.evaluate(() => [...document.querySelectorAll('.ab__mark')].map((x) => getComputedStyle(x).strokeDashoffset));
await to(p, '.tb');
const seq = [];
for (let i = 0; i < 9; i += 1) {
  seq.push(await p.evaluate(() => [...document.querySelectorAll('.tb__msg')].map((m) => (m.dataset.typing === 'true' ? 't' : m.dataset.shown === 'true' ? 'x' : '.')).join('')));
  await wait(700);
}
out.thread = seq.join(' ');
await p.close();

/* ---- about ---- */
p = await open('/about-us');
await wait(1800);
out.statement = await p.evaluate(() => [...document.querySelectorAll('.ab3-lit')].map((x) => getComputedStyle(x, '::after').opacity).join(' '));
await to(p, '.yr');
await wait(1600);
out.rail = await p.evaluate(() => getComputedStyle(document.querySelector('.yr__fill')).transform);
await to(p, '.ba__rows', 'start');
for (const i of [0, 1, 2, 3]) {
  await p.evaluate((n) => document.querySelectorAll('.ba__row')[n].scrollIntoView({ block: 'center' }), i);
  await wait(400);
}
await wait(1200);
out.figures = await p.evaluate(() => [...document.querySelectorAll('.ba__fig')].map((x) => x.textContent));
await p.close();

/* ---- reduced motion: final states at once ---- */
p = await open('/', { reduce: true });
out.reducedHome = await p.evaluate(() => ({
  words: [...document.querySelectorAll('.kc__w')].every((w) => getComputedStyle(w).opacity === '1'),
  ledger: [...document.querySelectorAll('.fl2__fig')].map((x) => x.textContent).join(' '),
  anim: getComputedStyle(document.querySelector('.wa__panel[data-on="true"] img')).animationName,
  flexTransition: getComputedStyle(document.querySelector('.wa__panel')).transitionDuration,
}));
await p.close();
p = await open('/services', { reduce: true });
out.reducedServices = await p.evaluate(() => ({
  brand: [...document.querySelectorAll('.bb__p')].map((x) => getComputedStyle(x).opacity).join(' '),
  callouts: [...document.querySelectorAll('.ab__mark')].map((x) => getComputedStyle(x).strokeDashoffset).join(' '),
  thread: [...document.querySelectorAll('.tb__msg')].map((m) => m.dataset.shown).join(' '),
}));
await p.close();
p = await open('/about-us', { reduce: true });
out.reducedAbout = await p.evaluate(() => ({
  statement: getComputedStyle(document.querySelector('.ab3-lit')).color,
  rail: getComputedStyle(document.querySelector('.yr__fill')).transform,
  figures: [...document.querySelectorAll('.ba__fig')].map((x) => x.textContent).join(' '),
}));
await p.close();

/* ---- rule 0: every new file on one page, once ---- */
const FILES = ['/proof/ads-jan-feb-2026.png', '/proof/ads-nov-2025.png', '/brand/ccp-main.svg', '/brand/ccp-white.svg'];
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us'];
const work = ['baseline-books', 'artiora', 'onesix', 'zions-caregivers', 'altavia', 'edgeq'];
const counts = {};
for (const r of ROUTES) {
  p = await open(r, { reduce: true });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      scrollTo(0, y);
      await new Promise((res) => setTimeout(res, 30));
    }
  });
  const srcs = await p.evaluate(() => [...document.querySelectorAll('img')].map((i) => new URL(i.currentSrc || i.src).pathname));
  for (const s of srcs) {
    const key = s.replace(/-720(?=\.jpg$)/, '');
    counts[key] = counts[key] || [];
    counts[key].push(r);
  }
  await p.close();
}
out.rule0 = Object.fromEntries(
  [...FILES, ...work.map((w) => `/work/${w}.jpg`), ...['baseline-books', 'artiora', 'onesix'].map((w) => `/work/${w}-phone.jpg`)].map((f) => [f, (counts[f] || []).join(',') || 'nowhere'])
);
await b.close();
console.log(JSON.stringify(out, null, 1));

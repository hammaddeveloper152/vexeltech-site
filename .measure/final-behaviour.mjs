/* final-behaviour.mjs: the final pass's objects, measured (final pass 2,
   2026-10-03).

     visible    BUILD-LAW Motion, "an entrance never hides content": on /,
                /services and /about-us, at load and at every screen of a
                scroll taken with no pause, no element carrying text in
                <main> paints below opacity 1 (the product of its own and its
                ancestors'), states excepted: the accordion's captions belong
                to a panel's state, a typing indicator to the thread's loop
     home       the ledger final;
                the accordion edge to edge, 560 tall at 1280, the active
                panel 3 to 1, hover and keys move it, the phone's first tap
                opens a panel and the second its site
     services   the client face loaded there and not on home, the whole
                thread painted and the loop running only on screen
     about      the statement's words at opacity 1 from the first frame;
                the side labels 01 to 06; the grounds

   THE FINAL ARTIFACTS PASS (2026-10-03) took out the spine, the identity
   sheet, the benchmark and the record, and their measurements with them.
   The four artifacts that replaced them are measured by final5.mjs.
     reduced    every object in its final state with nothing moving
     rule 0     each file referenced by one page, once

   Usage: node .measure/final-behaviour.mjs [base] */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const out = {};
const b = await puppeteer.launch({ headless: 'new' });

async function open(route, { width = 1280, height = 800, reduce = false, touch = false, settle = true } = {}) {
  const p = await b.newPage();
  if (touch) {
    await p.emulate({ viewport: { width, height, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, userAgent: 'Mozilla/5.0 (iPhone)' });
  } else {
    await p.setViewport({ width, height });
  }
  if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + route, { waitUntil: settle ? 'networkidle0' : 'domcontentloaded' });
  /* A tab behind another one gets no frames, so its transitions never
     finish: every page is brought to the front. */
  await p.bringToFront();
  return p;
}
const to = (p, sel, block = 'center') =>
  p.evaluate((s, bl) => document.querySelector(s).scrollIntoView({ block: bl }), sel, block);

/* Text-carrying elements in <main> whose painted opacity is below 1. */
const hidden = (p) =>
  p.evaluate(() => {
    /* States, not entrances. */
    const STATE = '.wa__cap, .wa__side, .tb__typing, .marg';
    const bad = [];
    for (const el of document.querySelectorAll('main *')) {
      if (el.closest(STATE)) continue;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
      if (!own && el.tagName !== 'IMG') continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      let o = 1;
      for (let a = el; a && a !== document.body; a = a.parentElement) o *= Number(getComputedStyle(a).opacity);
      if (o < 0.999) bad.push(`${el.className || el.tagName} ${o.toFixed(2)}`);
    }
    return [...new Set(bad)].slice(0, 12);
  });

/* ---- visible by default ---- */
out.visible = {};
for (const route of ['/', '/services', '/about-us']) {
  const p = await open(route, { settle: false });
  const found = new Set(await hidden(p));
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 700) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await wait(60);
    (await hidden(p)).forEach((x) => found.add(x));
  }
  out.visible[route] = [...found];
  await p.close();
}

/* ---- home ---- */
let p = await open('/');
await to(p, '.fl2');
out.ledger = await p.evaluate(() => [...document.querySelectorAll('.fl2__fig')].map((x) => x.textContent));
await to(p, '.wa__row');
await wait(800);
const geo = () =>
  p.evaluate(() => {
    const row = document.querySelector('.wa__row').getBoundingClientRect();
    const ps = [...document.querySelectorAll('.wa__panel')];
    return {
      left: row.left,
      right: Math.round(row.right),
      h: row.height,
      widths: ps.map((x) => Math.round(x.getBoundingClientRect().width)).join(' '),
      on: ps.findIndex((x) => x.dataset.on === 'true'),
      dimTransition: getComputedStyle(ps[1].querySelector('.wa__link'), '::before').transitionDuration,
      fit: getComputedStyle(ps[0].querySelector('img')).objectFit,
      img: ps[0].querySelector('img').naturalHeight,
    };
  });
out.accordion1280 = await geo();
const box = await p.evaluate(() => {
  const r = document.querySelectorAll('.wa__panel')[3].getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
await p.mouse.move(box.x, box.y);
await wait(900);
out.accordionHover = (await geo()).widths;
await p.focus('.wa__link');
await p.keyboard.press('ArrowRight');
await wait(900);
out.accordionKey = (await geo()).on;
out.accordionLinks = await p.evaluate(() => [...document.querySelectorAll('.wa__link')].every((a) => a.target === '_blank' && a.rel === 'noopener'));
await p.close();

p = await open('/', { width: 390, height: 844, touch: true });
await to(p, '.wa__row', 'start');
await wait(600);
const hs = () => p.evaluate(() => [...document.querySelectorAll('.wa__panel')].map((x) => Math.round(x.getBoundingClientRect().height)).join(' '));
const pages0 = (await b.pages()).length;
const tap = async () => {
  const t = await p.evaluate(() => {
    const r = document.querySelectorAll('.wa__panel')[2].getBoundingClientRect();
    return { x: r.x + 40, y: r.y + 40 };
  });
  await p.touchscreen.tap(t.x, t.y);
  await wait(900);
};
await tap();
out.accordion390tap = { heights: await hs(), openedTab: (await b.pages()).length > pages0 };
await tap();
out.accordion390tap2 = { openedTab: (await b.pages()).length > pages0 };
await p.close();

/* ---- services ---- */
p = await open('/services');
out.threadAtLoad = await p.evaluate(() => [...document.querySelectorAll('.tb__msg')].map((m) => m.dataset.shown).join(' '));
out.clientFontsBeforeSheet = await p.evaluate(() => [...document.fonts].filter((f) => f.family.includes('CCP')).map((f) => `${f.family} ${f.status}`).join(', '));
await to(p, '.tb');
const seq = [];
for (let i = 0; i < 8; i += 1) {
  seq.push(await p.evaluate(() => [...document.querySelectorAll('.tb__msg')].map((m) => (m.dataset.typing === 'true' ? 't' : m.dataset.shown === 'true' ? 'x' : '.')).join('')));
  await wait(700);
}
out.threadOnScreen = seq.join(' ');
await p.evaluate(() => window.scrollTo(0, 0));
await wait(600);
out.threadOffScreen = await p.evaluate(() => [...document.querySelectorAll('.tb__msg')].map((m) => m.dataset.shown).join(' '));
await p.close();

p = await open('/', { settle: true });
out.clientFontsOnHome = await p.evaluate(() => [...document.fonts].filter((f) => f.family.includes('CCP')).map((f) => `${f.family} ${f.status}`).join(', '));
await p.close();

/* ---- about ---- */
p = await open('/about-us', { settle: false });
await p.waitForSelector('.ab3-rise');
out.statementFirstFrame = await p.evaluate(() => [...document.querySelectorAll('.ab3-rise')].map((x) => getComputedStyle(x).opacity).join(' '));
await p.close();
p = await open('/about-us');
out.aboutLabels = await p.evaluate(() => [...document.querySelectorAll('.marg')].map((x) => x.textContent).join(' / '));
out.aboutGrounds = await p.evaluate(() => [...document.querySelectorAll('main > section, main > div > section')].map((x) => `${x.className.split(' ').slice(-1)[0]}:${getComputedStyle(x).backgroundColor}`).join(' '));
await p.close();

/* ---- reduced motion ---- */
p = await open('/services', { reduce: true });
await to(p, '.tb');
await wait(3000);
out.reducedThread = await p.evaluate(() => [...document.querySelectorAll('.tb__msg')].map((m) => m.dataset.shown).join(' '));
await p.close();

/* ---- rule 0 ---- */
/* final7: the /brand files and the November capture are deleted. */
const FILES = [];
const work = ['baseline-books', 'artiora', 'onesix', 'zions-caregivers', 'altavia', 'edgeq'];
const counts = {};
for (const r of ['/', '/services', '/pricing', '/about-us', '/contact-us']) {
  p = await open(r, { reduce: true });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((res) => setTimeout(res, 30));
    }
  });
  const srcs = await p.evaluate(() => [...document.querySelectorAll('img')].map((i) => new URL(i.currentSrc || i.src).pathname));
  for (const s of srcs) {
    /* (A file twice on one page shows as the route twice.) */
    const key = s.replace(/-(720|800)(?=\.jpg$)/, '');
    counts[key] = counts[key] || [];
    counts[key].push(r);
  }
  await p.close();
}
out.rule0 = Object.fromEntries(
  [...FILES, ...work.map((w) => `/work/${w}.jpg`), ...['baseline-books', 'artiora', 'onesix'].map((w) => `/work/${w}-phone.webp`)].map((f) => [f, (counts[f] || []).join(',') || 'nowhere'])
);
await b.close();
console.log(JSON.stringify(out, null, 1));

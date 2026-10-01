/* five-behaviour.mjs: the behaviours the five fixes added (2026-10-02),
   checked in a browser: the Recent work showcase (arrows, keys, drag, the
   ends, reduced motion) and the pricing toggles (one open at a time, the
   buttons on one baseline closed). Usage: node .measure/five-behaviour.mjs [base] */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const out = {};
const b = await puppeteer.launch({ headless: 'new' });

for (const reduce of [false, true]) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.querySelector('.rw2').scrollIntoView({ block: 'center' }));
  await wait(600);
  const state = () => p.evaluate(() => ({
    count: document.querySelector('.rw2__count').textContent.trim(),
    name: document.querySelector('.rw2__name').textContent.trim(),
    prevDisabled: document.querySelector('.rw2__arrow--prev').disabled,
    transition: getComputedStyle(document.querySelector('.rw2__track')).transitionDuration,
  }));
  const r = { start: await state() };
  await p.click('.rw2__arrow:not(.rw2__arrow--prev)');
  await wait(500);
  r.afterNext = await state();
  await p.focus('.rw2__arrow:not(.rw2__arrow--prev)');
  await p.keyboard.press('ArrowRight');
  await wait(500);
  r.afterKey = await state();
  const box = await (await p.$('.rw2__stage')).boundingBox();
  await p.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2);
  await p.mouse.down();
  await p.mouse.move(box.x + box.width * 0.3, box.y + box.height / 2, { steps: 8 });
  await p.mouse.up();
  await wait(500);
  r.afterDrag = await state();
  for (let k = 0; k < 6; k += 1) {
    await p.keyboard.press('ArrowRight');
    await wait(80);
  }
  await wait(500);
  r.atEnd = { ...(await state()), nextDisabled: await p.evaluate(() => document.querySelector('.rw2__arrow:not(.rw2__arrow--prev)').disabled) };
  out[reduce ? 'showcase reduced motion' : 'showcase'] = r;
  await p.close();
}

const p = await b.newPage();
await p.setViewport({ width: 1280, height: 800 });
await p.goto(BASE + '/pricing', { waitUntil: 'networkidle0' });
await wait(600);
const btnTops = () => p.evaluate(() => [...document.querySelectorAll('.pr-col__btn')].slice(0, 4).map((e) => Math.round(e.getBoundingClientRect().bottom + window.scrollY)));
const openState = () => p.evaluate(() => [...document.querySelectorAll('.pr-col__more')].map((e) => e.getAttribute('aria-expanded')));
out.pricing = { buttonBottomsClosed: await btnTops(), open0: await openState() };
const toggles = await p.$$('.pr-col__more');
await toggles[0].click();
await wait(300);
out.pricing.openAfterBranding = await openState();
await toggles[3].click();
await wait(300);
out.pricing.openAfterAutomation = await openState();
out.pricing.automationPanelHidden = await p.evaluate(() => document.getElementById('pr-full-automation').hidden);
await toggles[3].click();
await wait(300);
out.pricing.openAfterClosing = await openState();
await b.close();
console.log(JSON.stringify(out, null, 1));

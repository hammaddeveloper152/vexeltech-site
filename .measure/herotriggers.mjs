/* herotriggers.mjs: how many ScrollTrigger instances touch the home hero,
   2026-09-30 (the founder: the pinned reveal is deleted).

   The production bundle does not expose ScrollTrigger to the page, so this
   runs against the DEV server, where it is a module. It imports the exact
   URL the app itself loaded (version query and all), which returns the same
   module instance the page is using, not a second copy with its own empty
   list. Then, at 1280 and 390 once the page has loaded, and again after a
   scroll through the hero: ScrollTrigger.getAll(), and which of them have
   the hero, or anything inside it, as trigger, pin or endTrigger.

   Usage: node .measure/herotriggers.mjs [devBase]   (default http://localhost:5173) */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:5173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
const out = {};
for (const [w, h] of [[1280, 800], [390, 844]]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await wait(2000);
  const count = () =>
    p.evaluate(async () => {
      const url = performance
        .getEntriesByType('resource')
        .map((e) => e.name)
        .find((n) => /gsap_ScrollTrigger\.js/.test(n));
      if (!url) return { error: 'ScrollTrigger module not loaded by the page' };
      const { ScrollTrigger } = await import(url);
      const hero = document.querySelector('.hero');
      const touches = (el) => !!el && el.nodeType === 1 && (el === hero || hero.contains(el) || el.contains(hero));
      const all = ScrollTrigger.getAll();
      const onHero = all.filter((t) => touches(t.trigger) || touches(t.pin) || touches(t.vars && t.vars.endTrigger));
      return {
        module: url.split('/').pop(),
        total: all.length,
        hero: onHero.length,
        pinSpacerAroundHero: !!hero.closest('.pin-spacer'),
        others: all.map((t) => (t.trigger && t.trigger.className) || String(t.trigger)).slice(0, 12),
      };
    });
  out[`${w} at load`] = await count();
  await p.evaluate(() => window.scrollTo({ top: document.querySelector('.hero').offsetHeight, behavior: 'instant' }));
  await wait(800);
  out[`${w} after scrolling the hero`] = await count();
  await p.close();
}
await b.close();
console.log(JSON.stringify(out, null, 1));

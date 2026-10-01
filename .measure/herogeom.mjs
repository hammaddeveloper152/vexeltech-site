/* herogeom.mjs: the hero copy block's geometry, 2026-10-01 (copy V3: the
   eyebrow and the promise line). For each width, the block's top and foot
   as a share of the hero's height measured from its bottom, and the
   headline's top. "Lower third" means the block's top stays at or under
   66.7% from the bottom.

   Usage: node .measure/herogeom.mjs [base] */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
for (const [w, h] of [[390, 844], [768, 1024], [1280, 800], [1440, 900], [1920, 1080]]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));
  const g = await p.evaluate(() => {
    const hero = document.querySelector('.hero').getBoundingClientRect();
    const body = document.querySelector('.hero__body');
    const kids = [...body.querySelectorAll('.hero__eyebrow, .hero__headline, .hero__support > *')].filter((e) => getComputedStyle(e).display !== 'none');
    const top = Math.min(...kids.map((e) => e.getBoundingClientRect().top));
    const foot = Math.max(...kids.map((e) => e.getBoundingClientRect().bottom));
    const pct = (y) => Math.round(((hero.bottom - y) / hero.height) * 1000) / 10;
    return {
      hero: Math.round(hero.height),
      blockTop: `${Math.round(top)} (${pct(top)}% up)`,
      blockFoot: `${Math.round(foot)} (${pct(foot)}% up)`,
      headlineTop: Math.round(document.querySelector('.hero__headline').getBoundingClientRect().top),
      shown: kids.map((e) => e.className.split(' ')[0]).join(' '),
    };
  });
  console.log(w, JSON.stringify(g));
  await p.close();
}
await b.close();

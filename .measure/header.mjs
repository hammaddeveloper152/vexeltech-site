/* header.mjs: the header's one control geometry, 2026-09-30 (the founder).

   At 1280 and 390, on home (no current page) and /services (a current page),
   it measures every header control's box and computed radius, checks the
   48px target on each (elementFromPoint 3px outside the painted box), checks
   for sideways scroll, and photographs the bar at rest and with each nav
   link hovered. At 390 the nav links live in the menu panel, so it opens the
   panel and hovers them there. The footer's pages are measured on home.

   Usage: node .measure/header.mjs [base]   (default http://localhost:4173)
   Frames go to .measure/out/header/. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'out', 'header');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.argv[2] || 'http://localhost:4173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const measure = (sel) =>
  Array.from(document.querySelectorAll(sel))
    .filter((el) => el.offsetParent !== null)
    .map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const cx = r.left + r.width / 2;
      /* The target: 3px above and below the painted box must still be this
         control. The cream footer is measured mid-page, so it is scrolled to. */
      const hit = (y) => {
        const e = document.elementFromPoint(cx, y);
        if (e && (e === el || el.contains(e))) return true;
        return e ? `${e.tagName}.${e.className?.baseVal ?? e.className}` : 'nothing';
      };
      return {
        text: (el.textContent || el.getAttribute('aria-label') || '').trim(),
        w: +r.width.toFixed(2),
        h: +r.height.toFixed(2),
        cy: +(r.top + r.height / 2).toFixed(2),
        radius: cs.borderTopLeftRadius,
        padding: cs.padding,
        fontSize: cs.fontSize,
        bg: cs.backgroundColor,
        color: cs.color,
        current: el.getAttribute('aria-current'),
        hitMid: hit(r.top + r.height / 2),
        hitAbove: hit(r.top - 3),
        hitBelow: hit(r.bottom + 3),
      };
    });

const b = await puppeteer.launch({ headless: 'new' });
const report = {};

for (const [w, h] of [[1280, 800], [390, 844]]) {
  for (const route of ['/', '/services']) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h });
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    await wait(1200);
    const tag = `${w}${route === '/' ? '-home' : route.replace('/', '-')}`;
    const clip = { x: 0, y: 0, width: w, height: 64 };

    report[tag] = {
      overflowX: await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
      bar: await p.evaluate(measure, '.bar__link, .bar__cta, .bar__menu'),
    };
    await p.screenshot({ path: path.join(OUT, `${tag}-rest.png`), clip });

    if (w >= 1024) {
      for (const label of ['Services', 'Pricing', 'About us']) {
        const links = await p.$$('.bar__link');
        for (const l of links) {
          if ((await l.evaluate((e) => e.textContent.trim())) === label) {
            await l.hover();
            break;
          }
        }
        await wait(150);
        const hovered = await p.evaluate(measure, '.bar__link:hover');
        report[tag][`hover:${label}`] = hovered[0];
        await p.screenshot({ path: path.join(OUT, `${tag}-hover-${label.replace(' ', '-')}.png`), clip });
      }
      await p.mouse.move(w / 2, h - 10);
    } else {
      await p.click('.bar__menu');
      await wait(300);
      report[tag].panel = await p.evaluate(measure, '.bar__panel-link');
      await p.screenshot({ path: path.join(OUT, `${tag}-panel-rest.png`) });
      for (const label of ['Services', 'Pricing', 'About us']) {
        const links = await p.$$('.bar__panel-link');
        for (const l of links) {
          if ((await l.evaluate((e) => e.textContent.trim())) === label) {
            await l.hover();
            break;
          }
        }
        await wait(150);
        const hovered = await p.evaluate(measure, '.bar__panel-link:hover');
        report[tag][`panel-hover:${label}`] = hovered[0];
        await p.screenshot({ path: path.join(OUT, `${tag}-panel-hover-${label.replace(' ', '-')}.png`) });
      }
      /* Close it, or the panel covers the footer measured next. */
      await p.keyboard.press('Escape');
      await wait(300);
    }

    if (route === '/') {
      await p.evaluate(() => document.querySelector('.foot__pages').scrollIntoView({ block: 'center' }));
      await wait(600);
      report[tag].footer = await p.evaluate(measure, '.foot__page');
      const first = await p.$('.foot__page');
      await first.hover();
      await wait(150);
      report[tag]['footer-hover'] = (await p.evaluate(measure, '.foot__page:hover'))[0];
      const box = await p.evaluate(() => {
        const r = document.querySelector('.foot__meta').getBoundingClientRect();
        return { x: Math.max(0, r.left - 24), y: Math.max(0, r.top - 24 + scrollY), width: Math.min(innerWidth, r.width + 48), height: r.height + 48 };
      });
      await p.screenshot({ path: path.join(OUT, `${tag}-footer-hover-Home.png`), clip: box });
    }
    await p.close();
  }
}

/* Sideways scroll and which calls show, at the widths the bar changes
   around: 360 and 375 either side of the panel call, 768 and 1024. */
report.widths = {};
for (const w of [360, 375, 390, 768, 1024, 1280]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: 800 });
  await p.goto(BASE + '/services', { waitUntil: 'networkidle0' });
  await wait(600);
  report.widths[w] = await p.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    barCallShown: getComputedStyle(document.querySelector('.bar__inner > .bar__cta')).display !== 'none',
    innerRight: Math.max(...Array.from(document.querySelectorAll('.bar__inner > *'))
      .filter((e) => e.offsetParent !== null)
      .map((e) => e.getBoundingClientRect().right)),
    contentEdge: (() => {
      const i = document.querySelector('.bar__inner');
      return i.getBoundingClientRect().right - parseFloat(getComputedStyle(i).paddingRight);
    })(),
  }));
  if (w === 360) {
    await p.click('.bar__menu');
    await wait(300);
    report.widths[w].panelCall = await p.evaluate(measure, '.bar__cta--panel');
    await p.screenshot({ path: path.join(OUT, '360-services-panel.png') });
  }
  await p.close();
}

await b.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));

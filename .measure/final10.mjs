/* final10.mjs: the founder's services substance pass, 2026-10-06. Frames
   of each /services discipline's substance (spec sheet, how it goes, two
   questions, call) at 1280 and 390, one with its first question open, to
   .measure/out/final10/substance/, and printed as JSON:

     ld       the FAQPage blocks on /services, /about-us and /pricing: one
              per page, its question count, and that every question and
              answer is on the page as rendered (opened)
     inks     painted colours of the spec, step and question text on each
              band, closed and open, with the ground they sit on

   Usage: node .measure/final10.mjs [base]   (default http://localhost:4173) */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = path.join(HERE, 'out', 'final10', 'substance');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const out = { ld: {}, inks: {} };
const b = await puppeteer.launch({ headless: 'new' });

for (const route of ['/services', '/about-us', '/pricing']) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await wait(500);
  /* Open every question so its answer is in the page's text. */
  await p.evaluate(() => document.querySelectorAll('.faq__btn').forEach((btn) => btn.click()));
  out.ld[route] = await p.evaluate(() => {
    const blocks = [...document.querySelectorAll('script[type="application/ld+json"][data-faq]')];
    const data = blocks.map((s) => JSON.parse(s.textContent));
    const qs = data.flatMap((d) => d.mainEntity || []);
    /* Since final14 (2026-10-06) /services' two questions per discipline sit
       inside a "Questions" row as plain Q and A (.sub-q, .sub-a); About and
       Pricing keep them as accordion rows (.faq__q-t, .faq__a). */
    const shownQ = [...document.querySelectorAll('.faq__q-t, .sub-q')].map((n) => n.textContent.trim());
    const panels = [...document.querySelectorAll('.faq__a, .sub-a')].map((n) => n.textContent.replace(/\s+/g, ' ').trim());
    return {
      blocks: blocks.length,
      questions: qs.length,
      buttons: document.querySelectorAll('.faq__btn').length,
      qMissing: qs.filter((q) => !shownQ.includes(q.name)).map((q) => q.name),
      aMissing: qs.filter((q) => !panels.includes(q.acceptedAnswer.text)).map((q) => q.name),
    };
  });
  await p.close();
}

for (const width of [1280, 390]) {
  const p = await b.newPage();
  await p.setViewport({ width, height: width > 500 ? 800 : 844 });
  await p.goto(BASE + '/services', { waitUntil: 'networkidle0' });
  await wait(500);
  for (const id of ['branding', 'websites', 'marketing', 'automation']) {
    /* Open the band's first row (What's included since final14). */
    await p.evaluate((id) => document.querySelector(`#${id} .sub-qs .faq__btn`).click(), id);
    await wait(700);
    const box = await p.evaluate((id) => {
      /* The rows since final14 (the spec sheet sits behind the first). */
      const a = document.querySelector(`#${id} .svc2__qs`).getBoundingClientRect();
      const z = document.querySelector(`#${id} .svc2__call`).getBoundingClientRect();
      return { y: a.top + window.scrollY - 24, h: z.bottom - a.top + 48 };
    }, id);
    await p.screenshot({ path: path.join(OUT, `${width}-${id}.png`), clip: { x: 0, y: box.y, width, height: box.h }, captureBeyondViewport: true });
    if (width === 1280) {
      out.inks[id] = await p.evaluate((id) => {
        const s = document.getElementById(id);
        const c = (sel, prop = 'color') => {
          const e = s.querySelector(sel);
          return e ? getComputedStyle(e)[prop] : null;
        };
        return {
          ground: getComputedStyle(s.querySelector('.svc2__in')).backgroundColor,
          specK: c('.sub-spec__k'),
          specV: c('.sub-spec__v'),
          rule: c('.sub-spec__row', 'borderBottomColor'),
          n: c('.sub-how__n'),
          t: c('.sub-how__t'),
          l: c('.sub-how__l'),
          qOpen: c('.faq__item[data-open="true"] .faq__q-t'),
          qClosed: c('.faq__item[data-open="false"] .faq__q-t'),
          a: c('.faq__item[data-open="true"] .faq__a'),
          openFill: c('.faq__item[data-open="true"]', 'backgroundColor'),
          mark: c('.faq__item[data-open="false"] .faq__mark'),
        };
      }, id);
    }
  }
  await p.close();
}
await b.close();
console.log(JSON.stringify(out, null, 1));

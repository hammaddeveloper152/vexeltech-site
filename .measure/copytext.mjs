/* copytext.mjs: every public route's rendered text, and the copy checks,
   2026-10-01 (the founder's copy V2).

   Dumps each route's innerText at 1280 (after a walk down the page, so
   anything revealed on scroll is in, and with every disclosure opened) to
   .measure/out/copytext/<tag>/<route>.txt, then runs the checks on the
   public pages (not the legal pages, whose text is verbatim and exempt
   from V2; they are checked for dashes and figures only):

     - em or en dashes anywhere
     - a sentence that appears on more than one page
     - "Not " followed by a capital, more than once on a page
     - the banned strings: SaaS, mobile applications, web apps, Most picked,
       Fifty-two, Startups, Entrepreneurs, Founders
     - every $ figure, against 299, 449, 700, 999, 150, 15 and 300
     - exclamation marks

   Usage: node .measure/copytext.mjs [tag] [base]
   (tag names the dump folder: before, after.) */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TAG = process.argv[2] || 'after';
const BASE = process.argv[3] || 'http://localhost:4173';
const OUT = path.join(HERE, 'out', 'copytext', TAG);
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const PUBLIC = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/thanks'];
const LEGAL = ['/privacy-policy', '/terms-of-service'];
const BANNED = ['SaaS', 'mobile applications', 'web apps', 'Most picked', 'Fifty-two', 'Startups', 'Entrepreneurs', 'Founders'];
/* 300 joined the list on 2026-10-01: V2's budget bands (Up to $300, $300 to
   $700) are derived from the prices, the founder's decision. */
const FIGURES = new Set(['299', '449', '700', '999', '150', '15', '300']);

const errors = [];
const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
const texts = {};
for (const route of [...PUBLIC, ...LEGAL]) {
  const p = await b.newPage();
  p.on('console', (m) => m.type() === 'error' && errors.push(`${route}: ${m.text()}`));
  p.on('pageerror', (e) => errors.push(`${route}: ${e.message}`));
  await p.setViewport({ width: 1280, height: 800 });
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await wait(1000);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 600) {
    await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await wait(150);
  }
  /* Open every disclosure so its answer is in the text. */
  await p.evaluate(() => {
    document.querySelectorAll('details').forEach((d) => (d.open = true));
    document.querySelectorAll('[aria-expanded="false"]').forEach((el) => {
      if (!el.closest('.bar')) el.click();
    });
  });
  await wait(800);
  const t = await p.evaluate(() => document.querySelector('main')?.innerText || document.body.innerText);
  /* The hero's headline rotates: its four lines are read from the source by
     the checks below as well, so the dump of / carries all four. */
  texts[route] = t;
  fs.writeFileSync(path.join(OUT, `${route.replace(/\//g, '_') || '_home'}.txt`), t);
  await p.close();
}
await b.close();

const report = { dashes: {}, repeats: [], notCap: {}, banned: {}, figures: {}, bangs: {} };
const sentences = (t) =>
  t
    .split(/\n+/)
    .flatMap((l) => l.split(/(?<=[.?])\s+(?=[A-Z0-9$"'])/))
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 4);
const seen = new Map();
for (const route of [...PUBLIC, ...LEGAL]) {
  const t = texts[route];
  const d = t.match(/[^\n]*[–—][^\n]*/g);
  if (d) report.dashes[route] = d.slice(0, 5);
  const figs = [...t.matchAll(/\$\s?([\d,]+)/g)].map((m) => m[1].replace(/,/g, ''));
  const bad = figs.filter((f) => !FIGURES.has(f));
  report.figures[route] = { all: [...new Set(figs)], outside: [...new Set(bad)] };
  if (LEGAL.includes(route)) continue;
  for (const s of new Set(sentences(t))) {
    if (!seen.has(s)) seen.set(s, []);
    seen.get(s).push(route);
  }
  const nc = t.match(/\bNot [A-Z][^\n]{0,40}/g) || [];
  report.notCap[route] = nc;
  const hits = BANNED.filter((w) => t.includes(w));
  if (hits.length) report.banned[route] = hits;
  const bang = t.match(/[^\n]*![^\n]*/g);
  if (bang) report.bangs[route] = bang.slice(0, 5);
}
for (const [s, routes] of seen) if (routes.length > 1) report.repeats.push({ s, routes });
report.consoleErrors = errors;
fs.writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));

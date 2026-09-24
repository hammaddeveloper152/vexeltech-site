/* Release audit crawl: sideways scroll, internal links and hash targets,
   every asset response, and each page's head. */
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/LENOVO/Desktop/vexeltech2-src/vexeltech2-main/package.json');
const puppeteer = require('puppeteer');
const BASE = 'http://localhost:4173';
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/resources', '/portfolio', '/case-studies', '/nope'];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
const hrefs = new Map(); // href -> set of pages
const badAssets = [];
const consoleErrors = [];
const overflow = [];
const heads = {};

async function walk(p) {
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) { await p.evaluate((v) => scrollTo(0, v), y); await wait(60); }
  await wait(600);
}

for (const W of [1280, 390]) {
  for (const r of ROUTES) {
    const p = await b.newPage();
    await p.setViewport({ width: W, height: W < 768 ? 844 : 800 });
    p.on('response', (res) => {
      const t = res.request().resourceType();
      const ct = res.headers()['content-type'] || '';
      if (res.status() >= 400 || (['image', 'media', 'font', 'script', 'stylesheet'].includes(t) && ct.includes('text/html'))) {
        badAssets.push(`${W} ${r}: ${res.status()} ${t} ${res.url()} (${ct})`);
      }
    });
    p.on('requestfailed', (req) => { const e = req.failure()?.errorText || ''; if (!/ERR_ABORTED/.test(e)) badAssets.push(`${W} ${r}: FAILED ${req.resourceType()} ${req.url()} ${e}`); });
    p.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`${W} ${r}: ${m.text()}`); });
    p.on('pageerror', (e) => consoleErrors.push(`${W} ${r}: pageerror ${e.message}`));
    await p.goto(BASE + r, { waitUntil: 'networkidle0' });
    await walk(p);
    const o = await p.evaluate(() => {
      const de = document.documentElement;
      const out = { sw: de.scrollWidth, cw: de.clientWidth, wide: [] };
      if (de.scrollWidth > de.clientWidth) {
        for (const el of document.querySelectorAll('body *')) {
          const rc = el.getBoundingClientRect();
          if (rc.right > de.clientWidth + 1 && getComputedStyle(el).position !== 'fixed') out.wide.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} right=${Math.round(rc.right)}`);
        }
        out.wide = out.wide.slice(0, 5);
      }
      /* also: can the page be scrolled sideways? */
      scrollTo(500, scrollY); out.sx = scrollX; scrollTo(0, scrollY);
      return out;
    });
    if (o.sw > o.cw || o.sx > 0) overflow.push(`${W} ${r}: scrollWidth ${o.sw} > ${o.cw}, scrollX after push ${o.sx} ${o.wide.join('; ')}`);
    const links = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')));
    for (const l of links) { if (!hrefs.has(l)) hrefs.set(l, new Set()); hrefs.get(l).add(r); }
    if (W === 1280) {
      heads[r] = await p.evaluate(() => ({
        title: document.title,
        desc: document.querySelector('meta[name="description"]')?.content || null,
        canonical: document.querySelector('link[rel="canonical"]')?.href || null,
        ogImage: document.querySelector('meta[property="og:image"]')?.content || null,
        ogTitle: document.querySelector('meta[property="og:title"]')?.content || null, card: document.querySelector('meta[name="twitter:card"]')?.content || null,
        robots: document.querySelector('meta[name="robots"]')?.content || null,
        jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].length,
        h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      }));
    }
    await p.close();
  }
}

/* internal links: every one, resolved */
const linkResults = [];
for (const [href, pages] of hrefs) {
  if (/^(mailto:|tel:|https?:\/\/(?!localhost))/.test(href)) { linkResults.push(`EXTERNAL ${href} (from ${[...pages].join(', ')})`); continue; }
  const u = new URL(href, BASE + [...pages][0]);
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  let status = 0;
  p.on('response', (res) => { if (res.url() === u.href.split('#')[0]) status = res.status(); });
  await p.goto(u.href, { waitUntil: 'networkidle0' });
  await wait(400);
  const res = await p.evaluate((hash) => ({
    path: location.pathname + location.hash,
    notFound: !!document.querySelector('.nf'),
    hashOk: hash ? !!document.getElementById(decodeURIComponent(hash.slice(1))) : true,
    title: document.title,
  }), u.hash);
  linkResults.push(`${res.notFound || !res.hashOk ? 'BROKEN' : 'ok'} ${href} -> ${res.path} [${status}] ${res.notFound ? 'renders 404' : ''} ${res.hashOk ? '' : 'hash target missing'} (from ${[...pages].join(', ')})`);
  await p.close();
}
await b.close();
console.log('== OVERFLOW'); console.log(overflow.length ? overflow.join('\n') : 'none');
console.log('== BAD ASSETS'); console.log(badAssets.length ? [...new Set(badAssets)].join('\n') : 'none');
console.log('== CONSOLE ERRORS'); console.log(consoleErrors.length ? [...new Set(consoleErrors)].join('\n') : 'none');
console.log('== LINKS'); console.log(linkResults.sort().join('\n'));
console.log('== HEADS'); for (const [r, h] of Object.entries(heads)) console.log(r, JSON.stringify(h));

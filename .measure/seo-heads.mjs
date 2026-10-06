/* seo-heads.mjs: the head and the headings of every public route (the
   founder's final audit, final22, 2026-10-06), printed as JSON.

     node .measure/seo-heads.mjs [base]

   Per route: the title and its length, the meta description and its
   length, the canonical, the og and twitter tags present, the h1s, the
   heading levels in document order (a skip is flagged), the JSON-LD types,
   and how many times the promise line "A written number within one
   business day." renders. */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/privacy-policy', '/terms-of-service', '/no-such-page'];
const b = await puppeteer.launch({ headless: 'new' });
const out = {};
for (const r of ROUTES) {
  const p = await b.newPage();
  await p.goto(BASE + r, { waitUntil: 'networkidle0' });
  out[r] = await p.evaluate(() => {
    const m = (sel) => document.querySelector(sel)?.getAttribute('content') || null;
    const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]));
    const skips = levels.filter((l, i) => i > 0 && l > levels[i - 1] + 1).length;
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => {
      try {
        const j = JSON.parse(s.textContent);
        return (j['@graph'] || [j]).map((x) => x['@type']);
      } catch {
        return ['INVALID'];
      }
    });
    return {
      title: document.title,
      titleLen: document.title.length,
      description: m('meta[name="description"]'),
      descLen: (m('meta[name="description"]') || '').length,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
      og: ['og:title', 'og:description', 'og:url', 'og:image'].filter((k) => m(`meta[property="${k}"]`)),
      twitter: ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'].filter((k) => m(`meta[name="${k}"]`)),
      robots: m('meta[name="robots"]'),
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      levels: levels.join(''),
      skips,
      ld,
      promise: (document.body.innerText.match(/A written number within one business day\./g) || []).length,
    };
  });
  await p.close();
}
await b.close();
console.log(JSON.stringify(out, null, 1));

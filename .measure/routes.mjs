import puppeteer from 'puppeteer';
const BASE = process.env.BASE || 'http://localhost:5173';
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/resources', '/portfolio', '/case-studies', '/services/branding', '/blog', '/legacy/home', '/nope-404'];
const b = await puppeteer.launch({ headless: 'new' });
for (const r of ROUTES) {
  const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e).split('\n')[0]));
  const reqs = [];
  p.on('request', q => { const u = q.url(); if (!u.startsWith(BASE) && !u.startsWith('data:')) reqs.push(new URL(u).host); });
  await p.setViewport({ width: 1280, height: 800 });
  await p.goto(BASE + r, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise(z => setTimeout(z, 900));
  const o = await p.evaluate(() => ({
    title: document.title,
    h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()).slice(0, 3),
    h1n: document.querySelectorAll('h1').length,
    legacy: !!document.querySelector('.lg'),
    main: document.querySelectorAll('main').length,
    skip: !!document.querySelector('a.skip'),
    ground: getComputedStyle(document.body).backgroundColor,
    overflow: document.documentElement.scrollWidth > innerWidth,
    height: document.documentElement.scrollHeight,
    dashes: (document.body.innerText.match(/[\u2013\u2014]/g) || []).length,
    bangs: (document.body.innerText.match(/!/g) || []).length,
    dollars: (document.body.innerText.match(/\$[\d,]+/g) || []),
  }));
  console.log(`${r.padEnd(22)} h1=${o.h1n} ${o.legacy?'LEGACY':'rebuild'} main=${o.main} skip=${o.skip?'y':'n'} ov=${o.overflow?'YES':'no'} h=${o.height} dash=${o.dashes} bang=${o.bangs} $=${JSON.stringify(o.dollars)} 3p=${JSON.stringify([...new Set(reqs)])}`);
  console.log(`  ${JSON.stringify(o.h1)}  "${o.title}"`);
  if (errs.length) console.log('  ERRORS', errs);
  await p.close();
}
await b.close();

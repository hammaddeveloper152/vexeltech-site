/* Diagnose the wordmark, from a FRESH PROFILE WITH THE CACHE DISABLED.

   A cached copy of the old page is indistinguishable from a routing bug by
   eye, so neither can be ruled out without taking the cache out of it. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:5173';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'vt-fresh-'));

const b = await puppeteer.launch({
  headless: 'new',
  userDataDir: profile,               // fresh profile, no history, no cache
  args: ['--disk-cache-size=0', '--disable-application-cache'],
});

const OLD = /We build the websites startups grow on/i;
const NEW = /Not a proposal/i;

async function probe(startPath, selector, name) {
  const p = await b.newPage();
  await p.setCacheEnabled(false);       // cache disabled at the protocol level
  await p.setViewport({ width: 1280, height: 900 });
  const docs = [];
  p.on('response', (r) => {
    if (r.request().resourceType() === 'document') docs.push(`${r.status()} ${r.url()}`);
  });

  await p.goto(BASE + startPath, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1800));

  const before = await p.evaluate((sel) => {
    const a = document.querySelector(sel);
    return {
      exists: !!a,
      hrefAttr: a ? a.getAttribute('href') : null,
      hrefResolved: a ? a.href : null,
      tag: a ? a.tagName : null,
      isRouterLink: a ? !!a.__reactProps$ : null,
      url: location.href,
      h1: (document.querySelector('h1') || {}).textContent || '',
      legacy: !!document.querySelector('.lg'),
    };
  }, selector);

  if (!before.exists) { console.log(`  ${name}: SELECTOR NOT PRESENT on ${startPath}`); await p.close(); return; }

  await p.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: 'center' }), selector);
  await new Promise((r) => setTimeout(r, 250));
  const nav = p.waitForNavigation({ waitUntil: 'networkidle0', timeout: 8000 }).catch(() => null);
  await p.evaluate((sel) => document.querySelector(sel).click(), selector);
  await nav;
  await p.evaluate(() => document.fonts.ready).catch(() => {});
  await new Promise((r) => setTimeout(r, 2200));

  const after = await p.evaluate(() => ({
    url: location.href,
    h1: (document.querySelector('h1') || {}).textContent || '',
    legacy: !!document.querySelector('.lg'),
    title: document.title,
  }));

  const verdict = OLD.test(after.h1) ? 'OLD HERO' : NEW.test(after.h1) ? 'rebuild' : 'other';
  console.log(`  ${name} from ${startPath}`);
  console.log(`     href attr "${before.hrefAttr}"  ->  ${before.hrefResolved}`);
  console.log(`     landed ${after.url}   ${after.legacy ? 'LEGACY(.lg)' : 'rebuild tree'}   => ${verdict}`);
  console.log(`     h1: ${JSON.stringify(after.h1.replace(/\s+/g, ' ').trim().slice(0, 70))}`);
  console.log(`     documents: ${JSON.stringify(docs)}`);
  await p.close();
}

console.log(`\n######## ${BASE}  (fresh profile, cache disabled) ########`);
await probe('/', '.bar__brand', 'BAR wordmark');
await probe('/', '.foot__brand', 'FOOTER wordmark');
await probe('/pricing', '.bar__brand', 'BAR wordmark');
await probe('/blog', '.brand', 'LEGACY bar wordmark');
await b.close();
fs.rmSync(profile, { recursive: true, force: true });

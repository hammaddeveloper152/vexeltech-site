/* lh.mjs: Lighthouse simulated mobile on the four pages, three runs each,
   median by LCP. Lighthouse 13.5.0 through npx, on puppeteer's Chrome.

   Usage: node .measure/lh.mjs [base] [tag] [blocked-url-pattern] [routes]
   e.g. `... now-nofilm '*hero-spot*' /` measures home with the film blocked.
   Reports go to .measure/out/lh/<tag>/. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'http://localhost:4173';
const TAG = process.argv[3] || 'now';
const OUT = path.join(HERE, 'out', 'lh', TAG);
fs.mkdirSync(OUT, { recursive: true });
const CHROME = puppeteer.executablePath();
const BLOCK = process.argv[4] || '';
const PAGES = process.argv[5] ? process.argv[5].split(',') : ['/', '/services', '/pricing', '/about-us'];
const rows = [];
for (const route of PAGES) {
  const runs = [];
  for (let i = 1; i <= 3; i += 1) {
    const file = path.join(OUT, `${route === '/' ? 'home' : route.slice(1)}-${i}.json`);
    execFileSync(
      process.platform === 'win32' ? 'npx.cmd' : 'npx',
      ['-y', 'lighthouse@13.5.0', BASE + route, '--only-categories=performance', '--output=json', `--output-path=${file}`, '--quiet', '--chrome-flags=--headless=new', ...(BLOCK ? [`--blocked-url-patterns=${BLOCK}`] : [])],
      { env: { ...process.env, CHROME_PATH: CHROME }, stdio: 'inherit', shell: process.platform === 'win32' }
    );
    const r = JSON.parse(fs.readFileSync(file, 'utf8'));
    const a = r.audits;
    /* Lighthouse 13 carries the element in the LCP breakdown insight. */
    const el = (a['lcp-breakdown-insight']?.details?.items || []).find((i) => i.type === 'node');
    runs.push({
      lcp: a['largest-contentful-paint'].numericValue,
      fcp: a['first-contentful-paint'].numericValue,
      perf: Math.round(r.categories.performance.score * 100),
      el: el ? `${el.nodeLabel} <${el.selector}>` : '-',
    });
  }
  runs.sort((x, y) => x.lcp - y.lcp);
  const m = runs[1];
  rows.push({ route, ...m, all: runs.map((x) => (x.lcp / 1000).toFixed(2)).join(' / ') });
}
for (const r of rows) {
  console.log(`${r.route}\tLCP ${(r.lcp / 1000).toFixed(2)}s\tFCP ${(r.fcp / 1000).toFixed(2)}s\tperf ${r.perf}\truns ${r.all}\t${r.el}`);
}

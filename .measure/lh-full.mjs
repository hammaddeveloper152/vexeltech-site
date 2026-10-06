/* lh-full.mjs: Lighthouse, all four categories, mobile and desktop, on the
   four main routes (the founder's final audit, final22, 2026-10-06).

     node .measure/lh-full.mjs [base]     (default http://localhost:4190,
                                           .measure/serve-dist.mjs)

   One run per route and form factor, Lighthouse 13.5.0. Prints a table and
   writes the JSON reports to .measure/out/lh/final22/. For each category
   under 100 it lists the failing audits by id. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'lh', 'final22');
fs.mkdirSync(OUT, { recursive: true });
const ROUTES = ['/', '/services', '/pricing', '/about-us'];
const rows = [];
for (const form of ['mobile', 'desktop']) {
  for (const route of ROUTES) {
    const file = path.resolve(OUT, `${form}${route === '/' ? '-home' : route.replace(/\//g, '-')}.json`);
    execFileSync(
      process.platform === 'win32' ? 'npx.cmd' : 'npx',
      ['-y', 'lighthouse@13.5.0', BASE + route, '--output=json', `--output-path=${file}`, '--quiet', '--chrome-flags=--headless=new', ...(form === 'desktop' ? ['--preset=desktop'] : [])],
      { stdio: 'ignore', shell: process.platform === 'win32' }
    );
    const r = JSON.parse(fs.readFileSync(file, 'utf8'));
    const c = r.categories;
    const fails = {};
    for (const [k, cat] of Object.entries(c)) {
      if (cat.score < 1) {
        fails[k] = cat.auditRefs
          .filter((a) => a.weight > 0 && r.audits[a.id].score !== null && r.audits[a.id].score < 1)
          .map((a) => a.id);
      }
    }
    rows.push({
      form,
      route,
      perf: Math.round(c.performance.score * 100),
      a11y: Math.round(c.accessibility.score * 100),
      bp: Math.round(c['best-practices'].score * 100),
      seo: Math.round(c.seo.score * 100),
      lcp: r.audits['largest-contentful-paint'].displayValue,
      fails,
    });
    console.log(JSON.stringify(rows[rows.length - 1]));
  }
}
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(rows, null, 2));

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
     - V2.1's and V3's banned words (2026-10-01, the founder), any case,
       whole words: coded, design system, page builder, theme(s),
       outsourced, generated, template(s), affordable, cheap (and cheaper,
       cheapest), agency-level, dominate, skyrocket, startups, entrepreneurs,
       founders, and "this site"; V3.1 adds contractor(s), trade(s), Map
       Pack and home service(s); final16 adds the hyphenated forms
       (home-service, trade-, contractor-). The exceptions: the refusals band's "It's
       on this site", About's "Startups raising a round", and on About only
       the fit list's "Contractors". Checked in the rendered text and in each
       page's title and meta description.
     - repeats are split (V3): ALLOWED where every page's copy of the
       sentence sits in the shared footer, a button or link, the facts block
       (home and Contact), the closing call (home and Services) or a margin
       label; FLAGGED otherwise. Also ALLOWED (the founder, 2026-10-02): a
       sentence that sits in a pricing "Full list" panel (.pr-col__full),
       which repeats the Services item lines by design.
     - every $ figure, against 299, 449, 700, 999, 150, 15 and 300. A
       LABELLED COMPARISON FIGURE (the founder, 2026-10-06) is a price that
       is not ours, allowed only inside its own phrases: "from a $29
       one" in the Branding question on /services and "The $29 one is a
       stock mark" in its answer. It is reported under `comparisons`,
       not `outside`; the same figure anywhere else is still outside.
     - exclamation marks
     - THE DEVICE CHECK (the final artifacts pass, 2026-10-03, the
       founder): every artifact component carries `data-artifact` (its
       name) and, where it is one of the named devices, `data-device`
       (ledger, phone silhouette, stage, week strip). The check lists each
       component and the page it renders on, and FAILS if a component or a
       device renders on more than one page, or twice on one page. (The
       browser frame was excepted; it is deleted since final7.) The brief's "big-line list" and
       "map" have no component: the big lines went with KineticCosts and
       AroundLines, and the map was never built.

     - THE AUDIENCE (final38, 2026-10-08, the founder; BUILD-LAW Truth):
       small business(es), owner-run, one to fifty, SMB(s) and local
       business(es), any case, hyphenated or open, as the audience. Checked
       on every route, legal pages too, in the whole body's text (the
       footer included), every title, description, Open Graph and Twitter
       tag, every alt text, and every JSON-LD block. One exception: the
       branding desk's Google listing card on /services, whose category
       line "Local business" is the platform's label, not our audience.
       Any hit fails the run (exit 1).

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
const BANNED = ['SaaS', 'mobile applications', 'web apps', 'Most picked', 'Fifty-two'];
/* Startups, Entrepreneurs and Founders moved into SELF below, any case, 2026-10-01. */
/* 300 joined the list on 2026-10-01: V2's budget bands (Up to $300, $300 to
   $700) are derived from the prices, the founder's decision. */
const SELF =
  /\b(coded|design systems?|page builders?|themes?|outsourced|generated|templates?|affordab\w*|cheap\w*|agency-level|dominat\w*|skyrocket\w*|startups?|entrepreneurs?|founders?|this site|contractors?|trades?|map pack|home[ -]services?|trades?-\w+|contractors?-\w+)\b/gi;
/* The hyphenated forms (final16, 2026-10-06, the founder): "home-service",
   "trade-" and "contractor-" compounds count like the open forms.
   The exceptions. The About one holds on About only: the fit list's
   "Contractors" (V3.1, 2026-10-01). Home's cost cell 3, "of calls to trade
   and home businesses" (final16), is the founder's wording, on home only. */
/* "It's on this site" left the page in final23 (2026-10-06). */
const SELF_OK = ['Startups raising a round'];
/* /services' Maps tile (final30, 2026-10-07): "First in the map pack" is
   the founder's line in the frame M2 brief, on /services only. Platform
   names in the mosaic (Google search, Instagram, Facebook) are the buyer's
   words and were never banned. */
const SELF_OK_ROUTE = {
  '/about-us': ['Contractors, clinics, real estate'],
  '/': ['of calls to trade and home businesses'],
  '/services': ['First in the map pack'],
};
const AUDIENCE = /\b(small[- ]business(es)?|owner[- ]run|one to fifty|SMBs?|local business(es)?)\b/gi;
const AUDIENCE_OK_ROUTE = { '/services': ['Local business · Open'] };
const audienceHits = (t, route) =>
  [...(AUDIENCE_OK_ROUTE[route] || []).reduce((x, ok) => x.replaceAll(ok, ''), t).matchAll(AUDIENCE)].map((m) => m[0]);
const selfHits = (t, route) =>
  [...[...SELF_OK, ...(SELF_OK_ROUTE[route] || [])].reduce((x, ok) => x.replaceAll(ok, ''), t).matchAll(SELF)].map((m) => m[0]);
/* The shared text a repeat may sit in (V3's allowances). */
const SHARED = 'footer.foot, .callband, .about__rows, .ct-facts__row, a, button';
const FIGURES = new Set(['299', '449', '700', '999', '150', '15', '300']);
/* Labelled comparison figures: [figure, the exact phrase it may sit in]. */
const COMPARISONS = [['29', 'from a $29 one'], ['29', 'The $29 one is a stock mark']];
/* LABELLED FIGURES, by route, reported under `labelled`: home's cited $70
   (final15; WordStream, its source on the cell); on /services (final17)
   the desk's quote, $95, $140, $220 and $455, on the typed client's own
   document; since final18 the report's real $34.69 (read here as 34), the
   founder's November 2025 account. */
const LABELLED = { '/': ['70'], '/services': ['95', '140', '220', '455', '34'] };

const errors = [];
const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
const texts = {};
const meta = {};
const everything = {};
const shared = {};
const fullList = {};
const artifacts = {};
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
  /* The hero's headline is static since copy V4.1 (2026-10-06), so the
     page text is the whole of it. */
  texts[route] = t;
  shared[route] = await p.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => e.innerText).join('\n'), SHARED);
  /* Every pricing Full list panel, open or not (textContent reads a hidden
     panel too). */
  fullList[route] = await p.evaluate(() => [...document.querySelectorAll('.pr-col__full')].map((e) => e.textContent).join('\n'));
  artifacts[route] = await p.evaluate(() =>
    [...document.querySelectorAll('[data-artifact]')].map((e) => [e.dataset.artifact, e.dataset.device || ''])
  );
  meta[route] = await p.evaluate(() => `${document.title}
${document.querySelector('meta[name="description"]')?.content || ''}`);
  /* For the audience check: the body's text with the footer, every head
     tag a crawler or a share card reads, every alt text, every JSON-LD. */
  everything[route] = await p.evaluate(() =>
    [
      document.body.innerText,
      document.title,
      ...[...document.querySelectorAll('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]')].map((m) => m.content),
      ...[...document.querySelectorAll('img[alt]')].map((i) => i.alt),
      ...[...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent),
    ].join(String.fromCharCode(10))
  );
  fs.writeFileSync(path.join(OUT, `${route.replace(/\//g, '_') || '_home'}.txt`), t);
  await p.close();
}
await b.close();

const report = { dashes: {}, repeats: [], notCap: {}, banned: {}, selfExplaining: {}, figures: {}, bangs: {}, audience: {} };
/* THE REGISTER (copy V5.2, final39, the founder: "no slang, no jokes, no
   'just'"): every "just" in a public route's text is reported here. */
report.register = {};
for (const route of PUBLIC) {
  const j = (texts[route] || '').match(/[^.?\n]*\bjust\b[^.?\n]*[.?]?/gi);
  if (j) report.register[route] = j.map((x) => x.trim());
}
for (const route of Object.keys(everything)) {
  const a = audienceHits(everything[route], route);
  if (a.length) report.audience[route] = a;
}
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
  /* A comparison figure counts only inside its phrase; the phrase is taken
     out of the text the figures are read from. */
  let ft = t;
  const comparisons = [];
  for (const [fig, phrase] of COMPARISONS) {
    if (ft.includes(phrase)) {
      comparisons.push(fig);
      ft = ft.split(phrase).join(' ');
    }
  }
  const figs = [...ft.matchAll(/\$\s?([\d,]+)/g)].map((m) => m[1].replace(/,/g, ''));
  const labelled = LABELLED[route] || [];
  const bad = figs.filter((f) => !FIGURES.has(f) && !labelled.includes(f));
  report.figures[route] = { all: [...new Set(figs)], outside: [...new Set(bad)], comparisons, labelled: [...new Set(figs.filter((f) => labelled.includes(f)))] };
  if (LEGAL.includes(route)) continue;
  for (const s of new Set(sentences(t))) {
    if (!seen.has(s)) seen.set(s, []);
    seen.get(s).push(route);
  }
  const nc = t.match(/\bNot [A-Z][^\n]{0,40}/g) || [];
  report.notCap[route] = nc;
  const hits = BANNED.filter((w) => t.includes(w));
  if (hits.length) report.banned[route] = hits;
  const self = [...selfHits(t, route), ...selfHits(meta[route], route).map((w) => `meta: ${w}`)];
  if (self.length) report.selfExplaining[route] = self;
  const bang = t.match(/[^\n]*![^\n]*/g);
  if (bang) report.bangs[route] = bang.slice(0, 5);
}
report.repeatsAllowed = [];
for (const [s, routes] of seen) {
  if (routes.length < 2) continue;
  const ok = routes.every((r) => shared[r].includes(s)) || (routes.includes('/pricing') && fullList['/pricing'].includes(s));
  (ok ? report.repeatsAllowed : report.repeats).push({ s, routes });
}
/* The device check. */
report.artifacts = {};
report.deviceFailures = [];
const pagesOf = (key) => {
  const on = {};
  for (const route of PUBLIC) for (const [name, device] of artifacts[route] || []) {
    const k = key(name, device);
    if (!k) continue;
    on[k] = on[k] || {};
    on[k][route] = (on[k][route] || 0) + 1;
  }
  return on;
};
const byName = pagesOf((name) => name);
for (const [name, on] of Object.entries(byName)) {
  report.artifacts[name] = Object.entries(on).map(([r, n]) => (n > 1 ? `${r} x${n}` : r)).join(', ');
  if (Object.keys(on).length > 1 || Object.values(on).some((n) => n > 1)) report.deviceFailures.push(`component ${name}: ${report.artifacts[name]}`);
}
/* Containers are exempt (BUILD-LAW rule 0): the browser frame, and the
   phone silhouette since 2026-10-06 (the founder's quality pass), which may
   appear wherever a screen is shown. */
const CONTAINERS = new Set(['browser frame', 'phone silhouette']);
const byDevice = pagesOf((name, device) => (device && !CONTAINERS.has(device) ? device : null));
for (const [device, on] of Object.entries(byDevice)) {
  if (Object.keys(on).length > 1 || Object.values(on).some((n) => n > 1))
    report.deviceFailures.push(`device ${device}: ${Object.entries(on).map(([r, n]) => `${r} x${n}`).join(', ')}`);
}
report.consoleErrors = errors;
fs.writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
if (Object.keys(report.audience).length) {
  console.log('AUDIENCE: FAIL', JSON.stringify(report.audience));
  process.exit(1);
}

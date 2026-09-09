/* wipe.mjs — the page transition, frozen frame by frame, and what it costs.

   Three things, because the three questions are different:

     FRAMES    the three characters at 1280 and 390, mid-transition. At rest
               they are identical, so a settled screenshot measures nothing.
     COVER     what share of the frame is machine yellow at the instant the
               route swaps. This is the number that says whether the reader
               can see the page change, and it is the one thing separating a
               transition from a decoration played over one.
     COST      how long the destination is held. The brief forbids delaying
               it, and two of the three hold nothing; the third holds 220ms
               and this measures that rather than taking the constant's word.

   THE FREEZE is the same one `.measure/entrance.mjs` uses and it carries the
   same trap: `animation-play-state: paused` is injected at document-start,
   because `getAnimations()` drops a finished `backwards`-fill animation and a
   pause installed afterwards silently reaches nothing.

   ONE ADDITION HERE. The transition unmounts itself on a `setTimeout`, so a
   frozen animation would still be torn out of the DOM while the capture was
   half-done. EVERY timer of 200ms or more is dropped during the frame pass.

   The threshold was 300 first, which kept C's 220ms swap alive — and that
   produced frames that were wrong in a way no assertion would have caught.
   The animations are frozen but the wall clock is not, so by the time the
   t=0 screenshot was taken the real 220ms had long since elapsed, C's swap
   had fired, and every C frame showed the DESTINATION under a V that is
   supposed to be drawing over the origin. The pictures looked completely
   normal. At 200 the swap never fires, so C's strip shows the origin page
   throughout and the swap it hides is described rather than pictured.

   Usage, with the production build served at 4179:

     node .measure/wipe.mjs
*/
import puppeteer from 'puppeteer';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PNG } from 'pngjs';
import { isAccent } from './lib.mjs';

const BASE = 'http://localhost:4179';
const OUT = join(process.cwd(), '.measure', 'out', 'wipe');

/* ONE VERSION, because one shipped.

   This script drove `?wipe=a|b|c` while three were in the tree. The split was
   taken, the switch and the other two were removed, and this follows rather
   than keeping a parameter alive for shapes that no longer exist — the frames
   for all three are still under `.measure/out/wipe/` from the run that decided
   it, and DESIGN.md carries what each one measured. `swap` stays in the shape
   because the cover has to be measured on the frame the route actually
   changes, and for the split that is the first one. */
const VERSIONS = [
  { key: 'split', label: 'THE SPLIT  the arms cut the frame, the halves travel apart', swap: 0, total: 380 },
];

const WIDTHS = [
  { w: 1280, h: 800 },
  { w: 390, h: 844 },
];

/* Both destinations the brief names. PRICING is the shortest page on the site
   and SERVICES is the pinned scroller, so between them they cover the cheapest
   and the most expensive route to mount. */
const TARGETS = ['/pricing', '/services'];

/* The swap instant is always in the set, per version, because the cover is
   measured on that frame and a fixed grid walks straight past it. C swaps at
   220 and the first run of this script sampled 190 and 260 and reported no
   cover number for C at all — a missing row rather than a wrong one, which is
   the quieter of the two failures. */
const framesFor = (v) => [...new Set([0, 60, 120, 190, v.swap, 260, 330, 420])]
  .sort((a, b) => a - b);

const freeze = (dropLongTimers) => {
  const add = () => {
    if (!document.documentElement) return false;
    const s = document.createElement('style');
    s.textContent =
      '*, *::before, *::after { animation-play-state: paused !important; }';
    document.documentElement.appendChild(s);
    return true;
  };
  if (!add()) {
    const t = setInterval(() => {
      if (add()) clearInterval(t);
    }, 0);
  }
  if (dropLongTimers) {
    const real = window.setTimeout;
    window.setTimeout = (fn, ms, ...rest) =>
      ms >= 200 ? 0 : real(fn, ms, ...rest);
  }
};

/* Click the bar link by its href. Not a URL push: the transition triggers on
   a router navigation, and driving it any other way would be measuring
   something the reader never does. Matched on href rather than on text
   because the bar renders both the desktop nav and the phone panel, so the
   label exists twice and only one of them is visible at a given width —
   either will navigate, and a hidden link still clicks. */
const clickHref = (page, href) =>
  page.evaluate((h) => {
    const a = document.querySelector(`a[href="${h}"]`);
    if (!a) throw new Error('no link to ' + h);
    a.click();
  }, href);

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--force-color-profile=srgb', '--font-render-hinting=none'],
});

mkdirSync(OUT, { recursive: true });
const rows = [];
const cover = [];
const cost = [];

/* ---- Pass one: frames, and the cover at the swap ------------------------ */
for (const v of VERSIONS) {
  for (const { w, h } of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'no-preference' },
    ]);
    await page.evaluateOnNewDocument(freeze, true);

    await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);

    await clickHref(page, '/pricing');
    await page.waitForSelector('.pt', { timeout: 5000 });

    /* Seek the TRANSITION's animations to t and settle everything else.

       The first version seeked every animation on the page to the same
       currentTime, which put the origin page's own hero entrance back to 220ms
       in every frame of C's strip — its entrance line drawn across the frame
       behind the V, in a picture of a navigation where that line finished a
       long time ago. The overlay is what is being measured; the page under it
       should be in the state a reader would actually be looking at, which is
       settled. Everything outside `.pt` is pushed to 10s and left there. */
    const seek = (t) =>
      page.evaluate((ms) => {
        for (const a of document.getAnimations()) {
          const el = a.effect && a.effect.target;
          const inOverlay = el && el.closest && el.closest('.pt');
          try {
            a.currentTime = inOverlay ? ms : 10000;
          } catch {
            /* not on the document timeline */
          }
        }
      }, t);

    /* The overlay must actually be animating. A frozen page with a mounted
       but inert overlay produces seven identical frames and looks fine. */
    await seek(60);
    const live = await page.evaluate(
      () => document.getAnimations().filter((a) => {
        const t = a.effect && a.effect.target;
        return t && t.closest && t.closest('.pt');
      }).length
    );
    if (!live) {
      throw new Error(`wipe ${v.key} at ${w}: the overlay has no live animation`);
    }

    const shots = [];
    for (const t of framesFor(v)) {
      await seek(t);
      const name = `${v.key}-${w}-${String(t).padStart(4, '0')}.png`;
      const buf = await page.screenshot({ type: 'png' });
      writeFileSync(join(OUT, name), buf);
      shots.push({ name, t });

      /* The cover, measured on the frame where the route actually swaps. */
      if (t === v.swap) {
        const p = PNG.sync.read(buf);
        let ink = 0;
        for (let i = 0; i < p.data.length; i += 4) {
          if (isAccent(p.data[i], p.data[i + 1], p.data[i + 2])) ink++;
        }
        cover.push(
          `${v.key} ${w}x${h}: ${((ink / (p.width * p.height)) * 100).toFixed(1)}% of the frame is yellow at the swap (t=${t}ms)`
        );
      }
    }

    rows.push({ version: v, w, h, shots });
    await page.close();
  }
}

/* ---- Pass two: what the destination waits -------------------------------

   ONE NAVIGATION PER PAGE LOAD, and the first attempt is worth recording
   because of what it looked like rather than what it was. It clicked the
   target, timed the mount, then clicked the wordmark to run again — and that
   second click destroyed the execution context, which is puppeteer for "the
   browser fetched a document". That is the exact signature of the cached
   document defect BUILD-LAW records, so it was reported as one.

   IT IS NOT ONE. Checked before it went any further: every internal link to
   `/` in the rebuild is a `<Link>` — the bar, the footer lockup, the footer
   meta row — and there is no plain anchor to an internal route anywhere in
   the tree. The fault was in this file. The element was captured from the
   page BEFORE the navigation, so by the time it was clicked React had
   unmounted it; a click on a detached node reaches no synthetic handler, so
   nothing called preventDefault and the browser did what the href said.

   Recorded because the false positive is more dangerous than the bug would
   have been: it is a real symptom of a real recorded defect, produced by a
   harness holding a stale node, and it would have sent someone looking
   through the router for a fault that is not there. Reloading per run avoids
   holding a node across a navigation at all. */
for (const v of VERSIONS) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'no-preference' },
  ]);

  for (const target of TARGETS) {
    /* Time from the click to the destination's own h1 being in the document.
       That is the mount, which is the only thing a hold can delay. Five runs,
       median taken. */
    const runs = [];
    for (let i = 0; i < 5; i++) {
      await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      const ms = await page.evaluate(async (href) => {
        const link = document.querySelector(`a[href="${href}"]`);
        const before = document.querySelector('h1')?.textContent || '';
        const t0 = performance.now();
        link.click();
        await new Promise((res) => {
          const tick = () => {
            const now = document.querySelector('h1')?.textContent || '';
            if (now && now !== before) res();
            else requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
        return performance.now() - t0;
      }, target);
      runs.push(ms);
    }
    runs.sort((x, y) => x - y);
    cost.push(
      `${v.key} -> ${target}: destination h1 in the document ` +
        `${runs[2].toFixed(0)}ms after the click (5 runs, median; ` +
        `${runs.map((r) => r.toFixed(0)).join('/')})`
    );
  }
  await page.close();
}

/* ---- Pass three: first-load LCP, with the component in the bundle -------- */
const lcp = [];
for (const path of ['pricing', 'services']) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => {
    window.__lcp = 0;
    window.__lcpEl = '';
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__lcp = e.startTime;
        window.__lcpEl = e.element ? e.element.tagName + '.' + e.element.className : '(none)';
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.goto(`${BASE}/${path}`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const r = await page.evaluate(() => ({
    lcp: window.__lcp,
    el: window.__lcpEl,
    overlay: !!document.querySelector('.pt'),
  }));
  lcp.push(
    `/${path}: LCP ${r.lcp.toFixed(0)}ms on ${r.el}; transition overlay in the DOM on first load: ${r.overlay}`
  );
  await page.close();
}

await browser.close();

const html = `<!doctype html>
<meta charset="utf-8">
<title>Page transition — three characters</title>
<style>
  body { margin: 0; padding: 24px; background: #0d0e10; color: #fff;
         font: 13px/1.5 ui-monospace, monospace; }
  h1 { font-size: 15px; margin: 0 0 8px; font-weight: 600; }
  h2 { font-size: 13px; margin: 32px 0 8px; font-weight: 600; color: #f0b323; }
  .strip { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; }
  figure { margin: 0; flex: 0 0 auto; }
  img { display: block; height: 200px; width: auto; border: 1px solid #2a2c30; }
  figcaption { padding-top: 4px; color: #858a92; font-size: 11px; }
  b { color: #fff; font-weight: 600; }
  pre { color: #858a92; margin: 0 0 24px; white-space: pre-wrap; }
</style>
<h1>The page transition &mdash; the mark at page scale, frozen at seven beats.
  Times are milliseconds from the route change.</h1>
<pre>${[...cover, '', ...cost, '', ...lcp].join('\n')}</pre>
${rows
  .map(
    (r) => `<h2>${r.version.label} &nbsp;&mdash;&nbsp; ${r.w}&times;${r.h}</h2>
<div class="strip">
${r.shots
  .map(
    (s) =>
      `<figure><img src="wipe/${s.name}" alt=""><figcaption><b>${s.t}ms</b>${
        s.t === r.version.swap ? ' route swaps' : ''
      }</figcaption></figure>`
  )
  .join('\n')}
</div>`
  )
  .join('\n')}
`;

writeFileSync(join(process.cwd(), '.measure', 'out', 'wipe.html'), html);
for (const l of [...cover, '', ...cost, '', ...lcp]) console.log(l);
console.log(`\n${rows.length} strips, ${rows.reduce((n, r) => n + r.shots.length, 0)} frames`);
console.log('.measure/out/wipe.html');

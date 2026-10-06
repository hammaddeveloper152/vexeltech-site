/* final5.mjs: the final artifacts pass, 2026-10-03 (the founder). Frames
   of each looping artifact at 1280 and 390, to .measure/out/final5/:

     <artifact>-<width>-t<ms>.png     while it plays, from its first frame
     <artifact>-<width>-reduced.png   under prefers-reduced-motion

   and the measurements the pass's checks need, printed as JSON:
     paused      the timeline does not move while the artifact is off screen
     opacity     no element inside an artifact paints below opacity 1, at
                 load or at any captured frame
     rows        home's scenes: a headline click jumps to its scene

   ARTIFACTS REST FULL (2026-10-06, final10). A frame's ms is counted from
   the moment the stage is scrolled half into view, so the first 300 are the
   leave and the build's own clock starts at 300 (t150 is mid-leave). Added:
     restAtLoad  the painted state at load, with the stage under half in
                 view, equals the reduced-motion (complete) state
     offFull     scrolled off mid-play, the painted state equals the complete
                 state (for home's scenes: the held frame of its scene)
     leaveSeen   data-leaving was set during the first 300ms

   Usage: node .measure/final5.mjs [base] [folder]   (default http://localhost:4173, final5) */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'http://localhost:4173';
/* The folder under out/ (final6 since the founder's corrections). */
const OUT = path.join(HERE, 'out', process.argv[3] || 'final5');
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const ARTIFACTS = [
  { name: 'CostScenes', route: '/', times: [600, 1700, 3900, 6500, 9100, 11700, 14000, 15400] },
  { name: 'AnsweredCall', route: '/', times: [500, 1400, 2400, 3600] },
  { name: 'BrandYouType', route: '/services', times: [400, 900, 1500, 2900, 3800, 4900, 5900, 6800] },
  { name: 'SearchToCall', route: '/services', times: [700, 1800, 2900, 3700, 5200, 6500, 8400, 9800] },
  { name: 'TextBackBand', route: '/services', times: [800, 1800, 3300, 5000, 6400, 7000, 7800, 8800] },
  { name: 'OneTeam', route: '/about-us', times: [150, 700, 1500, 2500, 3250, 3500, 4000] },
  { name: 'WeekStrip', route: '/about-us', times: [150, 900, 1300, 1900, 2600, 3200, 3500] },
];
const rest = {};
/* The painted markup. An empty style attribute, which React leaves once
   the leave's `--leave` is removed, paints nothing and is dropped. */
const snapOf = (p, s) => p.evaluate((q) => document.querySelector(q).innerHTML.replace(/ style=""/g, ''), s);

const report = {};
const b = await puppeteer.launch({ headless: 'new' });
for (const width of [1280, 390]) {
  /* Reduced first: its painted state is the complete state the motion
     run is compared against. */
  for (const reduced of [true, false]) {
    for (const a of ARTIFACTS) {
      const p = await b.newPage();
      await p.setViewport({ width, height: width > 500 ? 800 : 844, deviceScaleFactor: 1 });
      if (reduced) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await p.goto(BASE + a.route, { waitUntil: 'networkidle0' });
      await p.evaluate(() => document.fonts.ready);
      const sel = `[data-artifact="${a.name}"]`;
      const key = `${a.name}-${width}${reduced ? '-reduced' : ''}`;
      const r = (report[key] = {});
      /* Below opacity 1 anywhere inside the artifact. Split since the
         quality pass (2026-10-06): an element that carries content (text
         or an image in it) against an empty decorative layer (a sheen, a
         ripple, a press tint), which rests invisible until it flashes.
         BUILD-LAW Motion's rule is about content; the empty layers are
         reported, not hidden. */
      const dim = (which = 'content') =>
        p.evaluate(
          (s, which) => {
            const el = document.querySelector(s);
            const content = (n) => n.textContent.trim() !== '' || n.tagName === 'IMG' || !!n.querySelector('img');
            return [...el.querySelectorAll('*')]
              .filter((n) => parseFloat(getComputedStyle(n).opacity) < 1)
              .filter((n) => (which === 'content' ? content(n) : !content(n)))
              .map((n) => n.className.baseVal ?? n.className);
          },
          sel,
          which
        );
      r.opacityAtLoad = await dim('content');
      r.decorativeAtLoad = await dim('empty');
      const el = await p.$(sel);
      const restKey = `${a.name}-${width}`;
      if (reduced) {
        rest[restKey] = await snapOf(p, sel);
        await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
        await wait(1500);
        await el.screenshot({ path: path.join(OUT, `${a.name}-${width}-reduced.png`) });
        await p.close();
        continue;
      }
      /* At load: is the stage under half in view, and if so is it at rest? */
      const underHalf = await p.evaluate((s) => {
        const b = document.querySelector(s).getBoundingClientRect();
        const vis = Math.max(0, Math.min(b.bottom, innerHeight) - Math.max(b.top, 0));
        return vis < Math.min(b.height, innerHeight) * 0.5;
      }, sel);
      if (underHalf) r.restAtLoad = (await snapOf(p, sel)) === rest[restKey];
      await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
      const t0 = Date.now();
      r.dim = [];
      r.leaveSeen = false;
      const watchLeave = (async () => {
        while (Date.now() - t0 < 600) {
          if (await p.evaluate((s) => !!document.querySelector(`${s}[data-leaving], ${s} [data-leaving]`), sel)) {
            r.leaveSeen = true;
            return;
          }
          await wait(30);
        }
      })();
      for (const ms of a.times) {
        const left = ms - (Date.now() - t0);
        if (left > 0) await wait(left);
        await el.screenshot({ path: path.join(OUT, `${a.name}-${width}-t${ms}.png`) });
        r.dim.push(...(await dim()));
      }
      await watchLeave;
      /* Paused off screen: scroll away, read the painted state twice. */
      const snap = () => p.evaluate((s) => document.querySelector(s).innerHTML.length + ':' + document.querySelector(s).innerHTML.slice(0, 4000), sel);
      await p.evaluate(() => window.scrollTo(0, 0));
      await wait(600);
      const s1 = await snap();
      await wait(1500);
      const s2 = await snap();
      r.pausedOffScreen = s1 === s2;
      if (a.name === 'CostScenes') {
        await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
        await wait(300);
        await p.evaluate(() => document.querySelectorAll('.cs__btn')[2].click());
        await wait(150);
        r.clickThird = await p.evaluate(() => [...document.querySelectorAll('.cs__btn')].map((x) => x.getAttribute('aria-pressed')).join(' '));
      }
      await p.close();

      /* Scrolled off mid-play (1.3s into the build): the complete state. */
      const q = await b.newPage();
      await q.setViewport({ width, height: width > 500 ? 800 : 844, deviceScaleFactor: 1 });
      await q.goto(BASE + a.route, { waitUntil: 'networkidle0' });
      await q.evaluate(() => document.fonts.ready);
      await q.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
      await wait(1600);
      r.midPlayDiffers = (await snapOf(q, sel)) !== rest[restKey];
      await q.evaluate((s) => {
        const el = document.querySelector(s);
        const top = el.getBoundingClientRect().top + scrollY;
        window.scrollTo(0, top > innerHeight * 2 ? 0 : document.documentElement.scrollHeight);
      }, sel);
      await wait(500);
      r.offFull = (await snapOf(q, sel)) === rest[restKey];
      await q.close();
    }
  }
}
await b.close();
console.log(JSON.stringify(report, null, 1));

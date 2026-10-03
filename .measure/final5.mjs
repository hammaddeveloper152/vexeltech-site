/* final5.mjs: the final artifacts pass, 2026-10-03 (the founder). Frames
   of each looping artifact at 1280 and 390, to .measure/out/final5/:

     <artifact>-<width>-t<ms>.png     while it plays, from its first frame
     <artifact>-<width>-reduced.png   under prefers-reduced-motion

   and the measurements the pass's checks need, printed as JSON:
     paused      the timeline does not move while the artifact is off screen
     opacity     no element inside an artifact paints below opacity 1, at
                 load or at any captured frame
     rows        home's scenes: a headline click jumps to its scene

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
  { name: 'CostScenes', route: '/', times: [700, 2600, 3900, 5000, 7400, 9600, 11900, 15000] },
  { name: 'BrandYouType', route: '/services', times: [600, 1300, 2000, 2400, 2800, 3600] },
  { name: 'SearchToCall', route: '/services', times: [900, 2600, 3500, 4600, 5400, 7700] },
  { name: 'OneTeam', route: '/about-us', times: [400, 1200, 2200, 3000, 3700] },
  { name: 'WeekStrip', route: '/about-us', times: [600, 1500, 2900, 3500] },
];

const report = {};
const b = await puppeteer.launch({ headless: 'new' });
for (const width of [1280, 390]) {
  for (const reduced of [false, true]) {
    for (const a of ARTIFACTS) {
      const p = await b.newPage();
      await p.setViewport({ width, height: width > 500 ? 800 : 844, deviceScaleFactor: 1 });
      if (reduced) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await p.goto(BASE + a.route, { waitUntil: 'networkidle0' });
      await p.evaluate(() => document.fonts.ready);
      const sel = `[data-artifact="${a.name}"]`;
      const key = `${a.name}-${width}${reduced ? '-reduced' : ''}`;
      const r = (report[key] = {});
      /* Below opacity 1 anywhere inside the artifact. */
      const dim = () =>
        p.evaluate((s) => {
          const el = document.querySelector(s);
          return [...el.querySelectorAll('*')]
            .filter((n) => parseFloat(getComputedStyle(n).opacity) < 1)
            .map((n) => n.className.baseVal ?? n.className);
        }, sel);
      r.opacityAtLoad = await dim();
      const el = await p.$(sel);
      if (reduced) {
        await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
        await wait(1500);
        await el.screenshot({ path: path.join(OUT, `${a.name}-${width}-reduced.png`) });
        await p.close();
        continue;
      }
      await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
      const t0 = Date.now();
      r.dim = [];
      for (const ms of a.times) {
        const left = ms - (Date.now() - t0);
        if (left > 0) await wait(left);
        await el.screenshot({ path: path.join(OUT, `${a.name}-${width}-t${ms}.png`) });
        r.dim.push(...(await dim()));
      }
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
    }
  }
}
await b.close();
console.log(JSON.stringify(report, null, 1));

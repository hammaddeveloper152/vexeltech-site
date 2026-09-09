/* entrance.mjs — the hero entrance, frozen frame by frame, warm and cold.

   ONE ENTRANCE, because one shipped. This script drove `?entrance=a|b|c` while
   three characters were in the tree; the slam was taken on 2026-09-09 and the
   other two were removed with the switch, so the loop is gone and the frames
   that cannot be regenerated are in `.measure/evidence/`. DESIGN.md carries
   what each of the three measured.

   THE METHOD. Every animation on the page is a WAAPI animation whether it was
   written in CSS or not, so `document.getAnimations()` returns all of them and
   `currentTime` is settable. A CSS animation's `currentTime` runs from 0 at
   the moment the element first got the animation, and its `animation-delay` is
   consumed inside that same timeline, so setting every animation to the same
   `currentTime` puts the whole page at one page-relative instant. That instant
   is exact and repeatable; a screenshot taken after a `setTimeout` is neither.

   THE TRAP, AND IT REPORTED NOTHING WHEN IT FIRED. The first version of this
   script paused the animations after the page had settled and then rewound
   them. It never touched the entrance. `getAnimations()` returns RELEVANT
   animations, and an animation whose fill is `backwards` stops being relevant
   the instant it finishes, because backwards fill affects only the delay phase
   and there is nothing left for it to affect. The whole entrance is
   `backwards` — deliberately, so no transform is pinned — so by the time the
   fonts had loaded every word and mask animation had run and been collected,
   and the frames showed a settled headline at every timestamp with the line
   sweeping across it. There was no error. Fifty-four frames were written and
   the contact sheet looked plausible.

   So the pause is installed BEFORE the page renders: a stylesheet injected at
   document-start pauses every animation at currentTime 0, and a paused
   animation is always relevant, so nothing is collected and the rewind has
   something to act on. The assertions below prove it fired.

   ---- THE COLD PASS, and why the warm one is not enough --------------------

   The warm frames are captured after `document.fonts.ready`, so Monigue is
   present in every one. That was recorded as a known blind spot for two
   passes: the entrance's line starts at 80ms and the faces landed at 420ms on
   a production build, so a reader on a cold cache can be shown the first part
   of this entrance in the FALLBACK face — and no frame taken after
   `fonts.ready` can ever show it.

   `cold()` below is that blind spot closed. It runs twice:

     TIMING     cache disabled, nothing frozen. Reads first paint and each
                woff2's responseEnd out of Resource Timing and prints them
                against the entrance's own beats, unthrottled and on Slow 4G.
     APPEARANCE the three woff2 held until after the capture, so the fallback
                face is guaranteed to be the one painted, then the same frozen
                beats. This is the worst case a real reader can be shown, not
                an approximation of it.

   Usage, with the measure build served at 4178:

     node .measure/entrance.mjs
*/
import puppeteer from 'puppeteer';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'http://localhost:4178/hero-preview.html';
const OUT = join(process.cwd(), '.measure', 'out', 'entrance');

const WIDTHS = [
  { w: 1280, h: 800 },
  { w: 390, h: 844 },
];

/* The beats, not a grid. Each one is a moment the entrance is supposed to be
   doing something specific, so a frame that looks wrong names its own beat. */
const FRAMES = [
  { t: 40, note: 'empty asphalt' },
  { t: 150, note: 'line drawing' },
  { t: 244, note: 'line drawn' },
  { t: 300, note: 'words in flight' },
  { t: 360, note: 'words in flight' },
  { t: 470, note: 'landed, line gone' },
  { t: 700, note: 'stack arriving' },
  { t: 1400, note: 'at rest' },
];

/* Pause everything before any element exists. A paused animation is always
   relevant, so nothing is collected before the rewind can reach it.

   The poll is not defensive coding. At document-start there is no
   `documentElement` to append to yet, so the straight version of this throws
   inside the injected script where nothing surfaces it: the page loads, the
   frames are written, and every one of them is settled.

   The ticker is pinned too, and it is not an animation — it is a transition
   driven by React state on a setInterval, so pausing the animation timeline
   does not touch it. It advanced between frames on the first run and the same
   beat came back reading "WORKING SITE" in one strip and "WHOLE SYSTEM" in
   another, which makes two captures differ for a reason that is not motion. */
const FREEZE = () => {
  const add = () => {
    if (!document.documentElement) return false;
    const s = document.createElement('style');
    s.textContent =
      '*, *::before, *::after { animation-play-state: paused !important; }' +
      '.ticker__track { transform: none !important; transition: none !important; }';
    document.documentElement.appendChild(s);
    return true;
  };
  if (!add()) {
    const t = setInterval(() => {
      if (add()) clearInterval(t);
    }, 0);
  }
};

const seek = (page, t) =>
  page.evaluate((ms) => {
    for (const a of document.getAnimations()) {
      try {
        a.currentTime = ms;
      } catch {
        /* an animation on a timeline that is not the document's */
      }
    }
  }, t);

/* The composite travel must be the mark's short arm outer edge and nothing
   else. dx/dy is 47/60 = 0.78333 straight off the path; anything else means
   the two components have drifted apart and the words are arriving on a path
   the line does not describe. */
async function assertTravel(page, label) {
  await seek(page, 260);
  const proof = await page.evaluate(() => {
    const word = document.querySelector('.hero__word');
    const mask = document.querySelector('.hero__mask');
    const cs = getComputedStyle(word);
    const m = (v) => (v === 'none' ? null : v.match(/matrix\(([^)]+)\)/));
    const wm = m(cs.transform);
    const mm = m(getComputedStyle(mask).transform);
    return {
      playState: cs.animationPlayState,
      dy: wm ? Number(wm[1].split(',')[5]) : 0,
      dx: mm ? Number(mm[1].split(',')[4]) : 0,
    };
  });
  if (proof.playState !== 'paused') {
    throw new Error(
      `${label}: animations are ${proof.playState}, not paused. The freeze did ` +
        `not install and every frame would be a settled hero.`
    );
  }
  if (Math.abs(proof.dy) < 1 || Math.abs(proof.dx) < 1) {
    throw new Error(`${label}: no travel at 260ms (dx ${proof.dx}, dy ${proof.dy}).`);
  }
  const ratio = Math.abs(proof.dx / proof.dy);
  if (Math.abs(ratio - 0.78333) > 0.002) {
    throw new Error(
      `${label}: travel is at ${((Math.atan2(1, ratio) * 180) / Math.PI).toFixed(2)} ` +
        `degrees, not 51.93 (dx ${proof.dx}, dy ${proof.dy}).`
    );
  }
  return `${label}: dx ${proof.dx.toFixed(1)} dy ${proof.dy.toFixed(1)} = ${(
    (Math.atan2(1, ratio) * 180) / Math.PI
  ).toFixed(2)} deg`;
}

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--force-color-profile=srgb', '--font-render-hinting=none'],
});

mkdirSync(OUT, { recursive: true });
const rows = [];
const angles = [];
const cold = [];

/* ---- Warm: the entrance with the faces already present ------------------ */
for (const { w, h } of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  /* Greyscale antialiasing, never subpixel: a colour classifier reading
     subpixel fringes is measuring the renderer rather than the page. */
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'no-preference' },
  ]);
  await page.evaluateOnNewDocument(FREEZE);
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);

  angles.push(await assertTravel(page, `warm ${w}`));

  const shots = [];
  for (const f of FRAMES) {
    await seek(page, f.t);
    const name = `warm-${w}-${String(f.t).padStart(4, '0')}.png`;
    writeFileSync(join(OUT, name), await page.screenshot({ type: 'png' }));
    shots.push({ name, ...f });
  }
  rows.push({ label: `WARM — the faces are already present`, w, h, shots });
  await page.close();
}

/* ---- Cold, part one: when do the faces actually land -------------------- */
for (const net of [
  { name: 'unthrottled', opts: null },
  {
    name: 'Slow 4G',
    opts: { offline: false, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8, latency: 400 },
  },
]) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.setCacheEnabled(false);
  if (net.opts) {
    const client = await page.createCDPSession();
    await client.send('Network.emulateNetworkConditions', net.opts);
  }
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);

  const t = await page.evaluate(() => {
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find((e) => e.name === 'first-contentful-paint');
    const fonts = performance
      .getEntriesByType('resource')
      .filter((e) => /\.woff2$/.test(e.name))
      .map((e) => ({ name: e.name.split('/').pop().split('-')[0], end: e.responseEnd }));
    return { fcp: fcp ? fcp.startTime : null, fonts };
  });

  const fcp = t.fcp ?? 0;
  const last = Math.max(...t.fonts.map((f) => f.end));
  cold.push(
    `${net.name}: first paint ${fcp.toFixed(0)}ms; faces ` +
      t.fonts.map((f) => `${f.name} ${f.end.toFixed(0)}`).join(', ') +
      `; last face ${last.toFixed(0)}ms`
  );
  /* The entrance's beats are measured from the moment the element got its
     animation, which is first paint. A face that lands after a beat means
     that beat painted in the fallback. */
  for (const [beat, at] of [['line starts', 80], ['words start', 250], ['words land', 470], ['note lands', 910]]) {
    const abs = fcp + at;
    cold.push(
      `    ${beat} at ${abs.toFixed(0)}ms — last face ${last > abs ? 'HAS NOT landed, FALLBACK' : 'has landed'}`
    );
  }
  await page.close();
}

/* ---- Cold, part two: what the fallback frames actually look like -------- */
for (const { w, h } of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.setCacheEnabled(false);
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'no-preference' },
  ]);
  await page.evaluateOnNewDocument(FREEZE);

  /* HOLD THE FACES rather than hope the timing catches them. Freezing the
     animations does not freeze the clock, so a woff2 that is merely slow will
     have arrived by the time the screenshot is taken and the capture would
     quietly show Monigue again — the same class of error as the ticker
     advancing between frames. Aborting them is the only way the fallback is
     guaranteed to be what is painted. */
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (/\.woff2$/.test(req.url())) req.abort();
    else req.continue();
  });

  await page.goto(BASE, { waitUntil: 'networkidle0' });

  const face = await page.evaluate(() => {
    const h1 = document.querySelector('.hero__headline');
    return { family: getComputedStyle(h1).fontFamily, loaded: document.fonts.status };
  });
  cold.push(`fallback capture ${w}: h1 family ${face.family}, document.fonts ${face.loaded}`);

  const shots = [];
  for (const f of FRAMES) {
    await seek(page, f.t);
    const name = `cold-${w}-${String(f.t).padStart(4, '0')}.png`;
    writeFileSync(join(OUT, name), await page.screenshot({ type: 'png' }));
    shots.push({ name, ...f });
  }
  rows.push({ label: `COLD — the woff2 held, so the fallback face is painted`, w, h, shots });
  await page.close();
}

await browser.close();

const html = `<!doctype html>
<meta charset="utf-8">
<title>Hero entrance — warm and cold</title>
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
<h1>The hero entrance &mdash; the slam, frozen at eight beats, with the faces
  present and with them held back. Times are page-relative milliseconds.</h1>
<pre>${[...angles, '', ...cold].join('\n')}</pre>
${rows
  .map(
    (r) => `<h2>${r.label} &nbsp;&mdash;&nbsp; ${r.w}&times;${r.h}</h2>
<div class="strip">
${r.shots
  .map(
    (s) =>
      `<figure><img src="entrance/${s.name}" alt=""><figcaption><b>${s.t}ms</b> ${s.note}</figcaption></figure>`
  )
  .join('\n')}
</div>`
  )
  .join('\n')}
`;

writeFileSync(join(process.cwd(), '.measure', 'out', 'entrance.html'), html);
for (const l of [...angles, '', ...cold]) console.log(l);
console.log(`\n${rows.length} strips, ${rows.reduce((n, r) => n + r.shots.length, 0)} frames`);
console.log('.measure/out/entrance.html');

/* auditfilm.mjs — the hero film's first paint and the marquee's start, for
   the viewer audit. 1280 on an open line and 390 on Slow 4G with the CPU at
   4x. Frames of the hero are captured at fixed times after navigation start,
   with the video's state and the poster's at each; the marquee row's
   transform is sampled for two seconds from the moment it is scrolled into
   view, to see whether it starts from rest or jumps.
   node .measure/auditfilm.mjs [base]    frames to .measure/out/audit/film/ */
import puppeteer from 'puppeteer';
import fs from 'node:fs';
const BASE = process.argv[2] || 'http://localhost:4180';
const OUT = '.measure/out/audit/film';
fs.mkdirSync(OUT, { recursive: true });
const SLOW_4G = { offline: false, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8, latency: 400 };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [w, h, slow, label] of [[1280, 800, false, 'open'], [390, 844, true, 'slow']]) {
  const b = await puppeteer.launch({ headless: 'new', args: ['--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.setCacheEnabled(false);
  const cdp = await p.target().createCDPSession();
  if (slow) { await cdp.send('Network.enable'); await cdp.send('Network.emulateNetworkConditions', SLOW_4G); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }
  const t0 = Date.now();
  p.goto(BASE + '/', { waitUntil: 'load', timeout: 120000 }).catch(() => {});
  const marks = slow ? [300, 800, 1500, 2500, 4000, 6000, 9000] : [100, 250, 500, 800, 1200, 2000];
  const rows = [];
  for (const m of marks) {
    await wait(Math.max(0, m - (Date.now() - t0)));
    const s = await p.evaluate(() => {
      const v = document.querySelector('video.hero__spot, .hero video');
      const img = document.querySelector('img.hero__spot, .hero picture img');
      const h1 = document.querySelector('h1');
      return {
        video: v ? { ready: v.readyState, t: +v.currentTime.toFixed(2), paused: v.paused, opacity: getComputedStyle(v).opacity } : null,
        poster: img ? { complete: img.complete, natural: img.naturalWidth, opacity: getComputedStyle(img).opacity } : null,
        phase: (document.querySelector('.hero') || {}).dataset ? JSON.stringify(document.querySelector('.hero') ? document.querySelector('.hero').dataset : {}) : null,
        h1: h1 ? getComputedStyle(h1).opacity : null,
      };
    }).catch((e) => ({ err: e.message.slice(0, 60) }));
    await p.screenshot({ path: `${OUT}/hero-${w}-${label}-${m}ms.png` }).catch(() => {});
    rows.push([m, JSON.stringify(s)]);
  }
  console.log(`\n=== hero ${w} ${label}`);
  rows.forEach((r) => console.log(`  ${String(r[0]).padStart(5)}ms  ${r[1]}`));
  await wait(slow ? 6000 : 1500);
  const mq = await p.evaluate(async () => {
    const view = document.querySelector('.ticker__view'); const row = document.querySelector('.ticker__row');
    if (!row) return null;
    view.scrollIntoView({ block: 'center' });
    const t = performance.now(); const out = [];
    for (let i = 0; i < 20; i++) { const m = getComputedStyle(row).transform.match(/matrix\(([^)]+)\)/); out.push([Math.round(performance.now() - t), m ? Math.round(+m[1].split(',')[4]) : 0]); await new Promise((r) => setTimeout(r, 100)); }
    return out;
  });
  console.log(`  marquee from scroll-in (ms, translateX): ${mq ? mq.map((x) => x.join(':')).join(' ') : 'no row'}`);
  await b.close();
}

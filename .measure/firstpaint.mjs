/* firstpaint.mjs: is the hero's headline in the first paint, 2026-10-01
   (the founder's perf pass).

   A cold load at 390 x 844 under CPU x4 and DevTools' Fast 3G. A probe
   injected before any page script records, on every animation frame, when
   the hero's first line is in the DOM, laid out, and visible (opacity of it
   and every ancestor above 0). PerformanceObserver gives the first paint,
   the first contentful paint and the LCP with its element. Then the same
   with reduced motion, and with the film blocked (no video can load).

   Usage: node .measure/firstpaint.mjs [base]   (default http://localhost:4173) */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function run(label, { reduce = false, blockVideo = false } = {}) {
  const b = await puppeteer.launch({ headless: 'new', args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.createBrowserContext();
  const p = await ctx.newPage();
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const cdp = await p.createCDPSession();
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 562.5,
    downloadThroughput: (1.44 * 1024 * 1024) / 8,
    uploadThroughput: (675 * 1024) / 8,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  if (blockVideo) await cdp.send('Network.setBlockedURLs', { urls: ['*.webm', '*.mp4'] });
  await p.evaluateOnNewDocument(() => {
    window.__fp = { paints: {}, lcp: null, lineVisible: null, lineText: null, videoPlaying: null };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__fp.paints[e.name] = Math.round(e.startTime);
    }).observe({ type: 'paint', buffered: true });
    new PerformanceObserver((l) => {
      const e = l.getEntries().at(-1);
      const el = e.element;
      window.__fp.lcp = {
        t: Math.round(e.startTime),
        el: el ? `${el.tagName.toLowerCase()}.${(el.className && el.className.baseVal === undefined ? el.className : '').toString().split(' ')[0]}` : null,
        text: el ? (el.textContent || '').trim().slice(0, 40) : null,
      };
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    const tick = () => {
      const line = document.querySelector('.hero__line');
      if (line && window.__fp.lineVisible === null) {
        const r = line.getBoundingClientRect();
        let vis = r.width > 0 && r.height > 0;
        for (let e = line; vis && e && e.nodeType === 1; e = e.parentElement) {
          if (Number(getComputedStyle(e).opacity) === 0) vis = false;
        }
        if (vis) {
          window.__fp.lineVisible = Math.round(performance.now());
          window.__fp.lineText = line.textContent.trim();
        }
      }
      const v = document.querySelector('video.hero__spot');
      if (v && !v.paused && v.currentTime > 0 && window.__fp.videoPlaying === null) {
        window.__fp.videoPlaying = Math.round(performance.now());
      }
      if (performance.now() < 15000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await p.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await wait(9000);
  const r = await p.evaluate(() => ({ ...window.__fp, mode: document.querySelector('.hero')?.getAttribute('data-mode') }));
  await b.close();
  console.log(label.padEnd(26), JSON.stringify(r));
  return r;
}

await run('390 Fast 3G + CPU x4');
await run('  + reduced motion', { reduce: true });
await run('  + no film (blocked)', { blockVideo: true });

/* auditperf.mjs — largest paint, total transfer and scroll frame rate, every
   route, for the pre-launch viewer audit.

   node .measure/auditperf.mjs [base]          ROUTES=/,/pricing to narrow

   LOAD: cold cache, three runs, median. 1280 on an open line; 390 on the
   slow profile, which is BUILD-LAW's Slow 4G (400 kbit/s each way, 400ms
   latency) with the CPU throttled 4x.

   SCROLL: on the slow profile at 390 and 1280, the page is walked top to
   bottom at 240px a second after it has loaded and settled, and a
   requestAnimationFrame loop counts frames in 250ms windows. Every window
   under 50fps is reported with its scroll position and the section at the
   middle of the viewport. Headless Chromium rasterises in software here, so
   these frame rates are a floor, not a phone. */
import puppeteer from 'puppeteer';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4180';
const ALL = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/portfolio', '/case-studies', '/resources', '/404',
  '/blog', '/thanks', '/privacy-policy', '/terms-of-service', '/legacy/contact'];
const ROUTES = process.env.ROUTES ? process.env.ROUTES.split(',') : ALL;
const SLOW_4G = { offline: false, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8, latency: 400 };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const out = [];

async function load(route, w, h, slow) {
  const b = await puppeteer.launch({ headless: 'new', args: ['--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await p.setCacheEnabled(false);
  const cdp = await p.target().createCDPSession();
  if (slow) {
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', SLOW_4G);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    /* THE CONNECTION HAS TO BE EMULATED TOO, and leaving it out measured a
       page no phone loads. CDP throttles the pipe but does not touch
       `navigator.connection`, so `videoAllowed()` saw a fast link and the hero
       fetched its 4.7 MB film over a 400 kbit/s line: LCP 35,080ms, 2,758 KB.
       With the connection reporting 3g — what a phone on that link reports —
       the gate fires, the hero renders its surface, and the same page is
       387 KB with a 7,808ms LCP. The harness was the finding, not the page. */
    await p.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'connection', {
        configurable: true,
        get: () => ({ effectiveType: '3g', saveData: false, addEventListener() {}, removeEventListener() {} }),
      });
    });
  }
  await p.evaluateOnNewDocument(() => {
    window.__lcp = { t: 0, el: '' };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = { t: Math.round(e.startTime), el: e.element ? `${e.element.tagName.toLowerCase()}.${(e.element.className || '').toString().split(' ')[0]}` : (e.url || '').split('/').pop() }; })
      .observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await p.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 180000 });
  await wait(slow ? 2500 : 800);
  const r = await p.evaluate(() => {
    let bytes = performance.getEntriesByType('navigation').reduce((a, n) => a + n.transferSize, 0);
    const big = [];
    for (const e of performance.getEntriesByType('resource')) { bytes += e.transferSize; if (e.transferSize > 50 * 1024) big.push(`${e.name.split('/').pop().split('?')[0]} ${Math.round(e.transferSize / 1024)}KB`); }
    return { bytes, big, lcp: window.__lcp };
  });
  return { b, p, cdp, ...r };
}

for (const route of ROUTES) {
  const row = { route };
  for (const [w, h, slow, label] of [[1280, 800, false, '1280 open'], [390, 844, true, '390 slow']]) {
    const runs = [];
    for (let i = 0; i < 3; i++) { const r = await load(route, w, h, slow); runs.push(r); if (i < 2) await r.b.close(); }
    const last = runs[2];
    row[label] = { lcp: med(runs.map((r) => r.lcp.t)), lcpEl: last.lcp.el, kb: Math.round(med(runs.map((r) => r.bytes)) / 1024), big: last.big };
    await last.b.close();
  }
  /* scroll frame rate on the slow profile, both widths, page already loaded */
  for (const [w, h] of [[1280, 800], [390, 844]]) {
    const { b, p, cdp } = await load(route, w, h, true);
    await p.evaluate(() => {
      window.__frames = [];
      const tick = (t) => { window.__frames.push([t, scrollY]); if (!window.__stopFrames) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    const tot = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let y = 0; y <= tot; y += 15) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(60); }
    const frames = await p.evaluate(() => { window.__stopFrames = true; return window.__frames; });
    const t0 = frames[0][0];
    const windows = [];
    for (let s = t0; s < frames[frames.length - 1][0] - 250; s += 250) {
      const inW = frames.filter((f) => f[0] >= s && f[0] < s + 250);
      if (!inW.length) continue;
      windows.push({ at: Math.round(s - t0), fps: Math.round(inW.length * 4), y: Math.round(inW[0][1]) });
    }
    const slowW = windows.filter((x) => x.fps < 50);
    const sections = [];
    for (const sw of slowW.slice(0, 40)) {
      sections.push(await p.evaluate((y) => {
        window.scrollTo(0, y);
        const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
        const sec = el && el.closest('section, footer, header, main > *');
        return sec ? (sec.className || sec.tagName).toString().split(' ').filter((c) => c && c !== 'vt')[0] : '?';
      }, sw.y));
    }
    let longest = 0;
    for (let i = 1; i < frames.length; i++) longest = Math.max(longest, frames[i][0] - frames[i - 1][0]);
    row[`scroll ${w} slow`] = { windows: windows.length, under50: slowW.length, minFps: windows.length ? Math.min(...windows.map((x) => x.fps)) : null,
      longestFrameMs: Math.round(longest), where: slowW.slice(0, 40).map((x, k) => `${x.y}:${x.fps}fps:${sections[k]}`) };
    await b.close();
  }
  out.push(row);
  console.log(`\n=== ${route}`);
  console.log(`  1280 open: LCP ${row['1280 open'].lcp}ms (${row['1280 open'].lcpEl}), ${row['1280 open'].kb} KB  ${row['1280 open'].big.join(', ')}`);
  console.log(`  390 slow:  LCP ${row['390 slow'].lcp}ms (${row['390 slow'].lcpEl}), ${row['390 slow'].kb} KB`);
  for (const k of ['scroll 1280 slow', 'scroll 390 slow']) {
    const s = row[k];
    console.log(`  ${k}: ${s.under50} of ${s.windows} windows under 50fps, min ${s.minFps}fps, longest frame ${s.longestFrameMs}ms  ${s.where.slice(0, 10).join('  ')}`);
  }
}
fs.mkdirSync('.measure/out/audit', { recursive: true });
fs.writeFileSync('.measure/out/audit/perf.json', JSON.stringify(out, null, 1));
console.log('\nwrote .measure/out/audit/perf.json');

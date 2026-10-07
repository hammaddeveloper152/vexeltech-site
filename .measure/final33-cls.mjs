/* final33-cls.mjs: every layout shift on a route on a throttled phone, with
   its sources (final33, 2026-10-07), to find what moves after first paint.
     node .measure/final33-cls.mjs <route> [base] */
import puppeteer from 'puppeteer';
const ROUTE = process.argv[2] || '/';
const BASE = process.argv[3] || 'http://localhost:4190';
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
const cdp = await p.createCDPSession();
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
await p.evaluateOnNewDocument(() => {
  window.__ls = [];
  new PerformanceObserver((l) =>
    l.getEntries().forEach((e) =>
      window.__ls.push({
        t: Math.round(e.startTime),
        v: +e.value.toFixed(4),
        src: e.sources.map((s) => `${s.node ? (s.node.className || s.node.nodeName).toString().split(' ')[0] : '?'} y${Math.round(s.previousRect.y)}h${Math.round(s.previousRect.height)} -> y${Math.round(s.currentRect.y)}h${Math.round(s.currentRect.height)}`),
      })
    )
  ).observe({ type: 'layout-shift', buffered: true });
});
await p.goto(BASE + ROUTE, { waitUntil: 'networkidle0', timeout: 90000 });
await new Promise((r) => setTimeout(r, 2500));
const ls = await p.evaluate(() => window.__ls);
console.log(`${ROUTE}: total ${ls.reduce((a, e) => a + e.v, 0).toFixed(4)}`);
ls.forEach((e) => console.log(`  ${e.t}ms ${e.v}  ${e.src.join(' | ')}`));
await b.close();

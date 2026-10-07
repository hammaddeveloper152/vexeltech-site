/* lcp-trace.mjs: when the largest paint lands, with and without the app
   (the launch gate, 2026-10-07, item 16). A 412-wide phone at 4x CPU, the
   LCP events from the DevTools timeline (which work with JavaScript off),
   on / and /pricing, first with JavaScript and then without.

     node .measure/lcp-trace.mjs     (against serve-dist.mjs on 4190)

   What it showed at the gate: without JavaScript the h1 is the LCP at
   668ms on home and 506ms on /pricing; with it, 1995 and 1340ms. React's
   createRoot replaces the prerendered markup with new nodes, and the new
   h1's paint is the one counted. See launch-gate.md, item 16. */
import puppeteer from 'puppeteer';
const b = await puppeteer.launch({ headless: 'new' });
for (const js of [true, false]) {
  for (const route of ['/', '/pricing']) {
    const p = await b.newPage();
    await p.setJavaScriptEnabled(js);
    await p.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
    const cdp = await p.createCDPSession();
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    const ev = [];
    let t0 = 0;
    cdp.on('PerformanceTimeline.timelineEventAdded', ({ event }) => {
      if (event.type === 'largest-contentful-paint') ev.push(`${Math.round(event.time * 1000 - t0)}ms size ${event.lcpDetails.size} node ${event.lcpDetails.nodeId || event.lcpDetails.url || ''}`);
    });
    await cdp.send('PerformanceTimeline.enable', { eventTypes: ['largest-contentful-paint'] });
    await cdp.send('Page.enable');
    t0 = Date.now();
    await p.goto('http://localhost:4190' + route, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1500));
    console.log(`js=${js} ${route}`, ev.length ? '' : '(no events)', ev.join(' | '));
    await p.close();
  }
}
await b.close();

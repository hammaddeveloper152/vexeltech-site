import puppeteer from 'puppeteer';

/* Page transfer, production build, cold cache, unthrottled. Five runs, median.
   The point is the headroom the hero's wall removal left behind, which is what
   the work grid's video has to be funded out of. */
const runs = [];
for (let i = 0; i < 5; i += 1) {
  const b = await puppeteer.launch({ headless: 'new', args: ['--hide-scrollbars', '--disable-lcd-text'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await p.setCacheEnabled(false);
  await p.goto('http://localhost:4178/hero-preview.html', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 600));
  const { bytes, byType } = await p.evaluate(() => {
    const rs = performance.getEntriesByType('resource');
    let bytes = performance.getEntriesByType('navigation').reduce((a, n) => a + n.transferSize, 0);
    const byType = {};
    for (const r of rs) {
      bytes += r.transferSize;
      const k = r.initiatorType + ' ' + (r.name.split('.').pop().split('?')[0]);
      byType[k] = (byType[k] || 0) + r.transferSize;
    }
    return { bytes, byType };
  });
  const lcp = await p.evaluate(() => new Promise((res) => {
    let v = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) v = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(() => res(Math.round(v)), 400);
  }));
  runs.push({ bytes, lcp, byType });
  await b.close();
}
const med = (a) => a.sort((x, y) => x - y)[Math.floor(a.length / 2)];
console.log('transfer median', (med(runs.map((r) => r.bytes)) / 1024).toFixed(0), 'KB   LCP median', med(runs.map((r) => r.lcp)), 'ms');
const t = runs[0].byType;
for (const k of Object.keys(t).sort((a, b) => t[b] - t[a])) {
  if (t[k] > 1024) console.log(`   ${k.padEnd(28)} ${(t[k] / 1024).toFixed(0)} KB`);
}

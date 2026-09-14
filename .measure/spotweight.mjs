/* spotweight.mjs — what the hero spot costs the home page, counted by the network.

   `transfer.mjs` sums Resource Timing just after `networkidle0`. That was right
   for a page of images and scripts and it is wrong for a film: a <video> loads
   through ranged media requests that can still be streaming when the network
   first goes quiet, and Resource Timing's transferSize for them is not reliable
   either. Its recorded numbers stand for what they measured; this measures the
   page that has a film on it.

   So bytes come from CDP, per request, from `Network.loadingFinished`'s
   encodedDataLength, which is what crossed the wire. Two figures per run:

     arrival   every request that is not the film, which is what the page costs
               before and apart from the spot
     film      the .webm and .mp4 requests, counted after the clip has ended,
               or at the cap on a throttled run, where it is what had arrived

   It also records WHICH film files were fetched, because the webm is listed
   first so that a browser which decodes it never downloads the h.264, and a
   run that fetched both would be paying for the fallback on top of the film.

   Production build, cold cache, a fresh browser per run, five runs, median, as
   BUILD-LAW asks. 1280 unthrottled, and 390 on the Slow 4G profile
   `entrance.mjs` uses.

   Usage, with the site built and served at 4179:

     node .measure/spotweight.mjs
*/
import puppeteer from 'puppeteer';

const URL = 'http://localhost:4179/';
const RUNS = 5;
const SLOW_4G = { offline: false, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8, latency: 400 };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

async function run(w, h, net) {
  const b = await puppeteer.launch({ headless: 'new', args: ['--hide-scrollbars', '--disable-lcd-text', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await p.setCacheEnabled(false);
  const cdp = await p.createCDPSession();
  await cdp.send('Network.enable');
  if (net) await cdp.send('Network.emulateNetworkConditions', net);

  /* Two counters, and the second is the one a film needs. `loadingFinished`
     gives a request's total only once it has finished, so a film still
     streaming at the cap has no total at all; `dataReceived` is summed per
     request as the bytes arrive, which is what a throttled reader has
     actually paid for by then. A finished request takes its finished total. */
  const urls = new Map();
  const bytes = new Map();
  const recv = new Map();
  cdp.on('Network.requestWillBeSent', (e) => urls.set(e.requestId, e.request.url));
  cdp.on('Network.dataReceived', (e) => recv.set(e.requestId, (recv.get(e.requestId) || 0) + (e.encodedDataLength || e.dataLength)));
  cdp.on('Network.loadingFinished', (e) => bytes.set(e.requestId, e.encodedDataLength));

  await p.goto(URL, { waitUntil: 'load', timeout: 120000 });
  await p.evaluate(() => document.fonts.ready);
  const mode = await p.evaluate(() => document.querySelector('.hero').dataset.mode);

  /* the film ends, or the cap: 16s on an open line, 30s on Slow 4G */
  const cap = net ? 30000 : 16000;
  await p.waitForFunction(() => { const v = document.querySelector('video.hero__spot'); return !v || v.ended; }, { timeout: cap, polling: 250 }).catch(() => {});
  const ended = await p.evaluate(() => { const v = document.querySelector('video.hero__spot'); return v ? v.ended : null; });
  await wait(300);

  const lcp = await p.evaluate(() => new Promise((res) => {
    let v = 0;
    let el = '';
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) { v = e.startTime; el = e.element ? `${e.element.tagName.toLowerCase()}.${String(e.element.className).split(' ')[0]}` : e.url.split('/').pop(); }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(() => res({ t: Math.round(v), el }), 400);
  }));

  let arrival = 0;
  let film = 0;
  const filmFiles = new Set();
  for (const id of new Set([...bytes.keys(), ...recv.keys()])) {
    const n = bytes.has(id) ? bytes.get(id) : recv.get(id);
    const u = urls.get(id) || '';
    if (/\/assets\/hero\/.*\.(webm|mp4)$/.test(u)) { film += n; filmFiles.add(u.split('/').pop()); } else arrival += n;
  }
  await b.close();
  return { mode, ended, lcp, arrival, film, filmFiles: [...filmFiles] };
}

for (const [w, h, net, label] of [[1280, 800, null, 'unthrottled'], [390, 844, SLOW_4G, 'Slow 4G']]) {
  const rs = [];
  for (let i = 0; i < RUNS; i++) rs.push(await run(w, h, net));
  console.log(`\n=== ${w}x${h}, ${label}, ${RUNS} cold runs`);
  for (const r of rs) {
    console.log(`  mode ${r.mode}  arrival ${(r.arrival / 1024).toFixed(0)} KB  film ${(r.film / 1024).toFixed(0)} KB (${r.filmFiles.join(', ') || 'none'}${r.ended === false ? ', still streaming at the cap' : ''})  LCP ${r.lcp.t}ms ${r.lcp.el}`);
  }
  console.log(`  MEDIAN  arrival ${(med(rs.map((r) => r.arrival)) / 1024).toFixed(0)} KB  film ${(med(rs.map((r) => r.film)) / 1024).toFixed(0)} KB  LCP ${med(rs.map((r) => r.lcp.t))}ms`);
  const both = rs.filter((r) => r.filmFiles.length > 1).length;
  console.log(`  runs that fetched both film formats: ${both}`);
}

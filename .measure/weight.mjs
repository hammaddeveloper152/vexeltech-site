/* weight.mjs — what a route actually costs, and what the bands added to it.

   Five photographs went onto the home page in one pass. "The page must not get
   slower" is a standing rule here, so the number has to be looked at rather
   than assumed, and it has to be looked at TWICE: once as the page ships, and
   once with the band images blocked, because the difference is the thing this
   pass is responsible for.

   `content-length` is not the measurement. A preview server can serve chunked
   responses with no length header, which is how the previous version of this
   reported 0.0 KB for every route and was believed. The transfer size comes
   from CDP's `Network.loadingFinished`, which is what the browser actually
   pulled down.
*/
import puppeteer from 'puppeteer';

const BASE = 'http://localhost:4179';
const ROUTES = ['/', '/about-us', '/services', '/pricing'];

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });

async function measure(route, blockBands) {
  /* A FRESH CONTEXT PER ROUTE. Pages in one browser share the HTTP cache, so
     the second route measured came back at 4 KB — every shared bundle served
     from memory with an encoded length of nothing. That is a true number about
     a warm cache and a useless one about what a page costs. */
  const ctx = await b.createBrowserContext();
  const p = await ctx.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  const cdp = await p.target().createCDPSession();
  await cdp.send('Network.enable');

  const req = new Map();
  const size = new Map();
  cdp.on('Network.requestWillBeSent', (e) => req.set(e.requestId, e.request.url));
  cdp.on('Network.loadingFinished', (e) => size.set(e.requestId, e.encodedDataLength));

  /* NO REQUEST INTERCEPTION. Aborting the band requests to measure the page
     without them broke the accounting for everything else — `loadingFinished`
     stops firing for the aborted ids and the totals came back as 1 KB — and
     then hung `networkidle0` on the next route. The bands are counted by URL
     and subtracted, which needs one page load instead of two and cannot lie
     about the rest of the page. */

  /* `networkidle0` hangs on the routes with a live canvas, so the wait is a
     load event and a fixed settle instead. */
  await p.goto(BASE + route, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1500));

  const tally = () => {
    let total = 0, bands = 0, n = 0;
    for (const [id, url] of req) {
      const s = size.get(id) || 0;
      total += s; n++;
      if (/\/assets\/(bands|marble)/.test(url)) bands += s;
    }
    return { total, bands, n };
  };

  /* TWO NUMBERS, AND THE FIRST ONE IS THE ONE THE RULE IS ABOUT.

     The bands are `background-image` on sections below the fold, and a browser
     does not fetch a background until the box that carries it is near the
     viewport. So the cost of arriving on the page is not the cost of the whole
     page: the first number is what a reader pays before they have done
     anything, and the second is what they pay having scrolled the lot. */
  const first = tally();

  const tot = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < tot; y += 400) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 90));
  }
  await new Promise((r) => setTimeout(r, 1200));
  const full = tally();

  await p.close();
  await ctx.close();
  return { first, full };
}

console.log('  route          on arrival        after the whole page is scrolled');
console.log('                 total   bands     total    bands   everything else');
for (const route of ROUTES) {
  const { first, full } = await measure(route, false);
  const kb = (v) => (v / 1024).toFixed(0).padStart(5) + ' KB';
  console.log(
    `  ${route.padEnd(13)} ${kb(first.total)} ${kb(first.bands)}   ` +
    `${kb(full.total)} ${kb(full.bands)}   ${kb(full.total - full.bands)}`
  );
}
await b.close();

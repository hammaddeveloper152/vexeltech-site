/* hydration-check.mjs: the build gate for hydration (FINAL29, 2026-10-07,
   the founder). The last step of `npm run build`.

   Serves dist as the host does (a route's folder serves its index.html; any
   other path gets 404.html with status 404), opens all nine routes at 390
   and at 1280, with motion on and with reduced motion, and reads the
   console. THE BUILD FAILS (exit 1) if any page logs a hydration warning or
   error: main.jsx's `[hydration]` reports (onRecoverableError), React's own
   hydration messages, or a page error.

   It also checks that hydration ADOPTED the prerendered page rather than
   replacing it: the h1 the browser parsed from the HTML must be the h1 in
   the document after the app has started, carrying React's fiber. A
   replaced h1 is a new paint, which is the LCP this fix exists to remove;
   an h1 with no fiber means the app never started.

   PROVED TO FAIL: with one word changed inside /pricing's built h1 it
   exits 1 with React's error #418 on that route (FINAL29). */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const TYPES = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]).replace(/\/+$/, '') || '/';
  let file = path.join(DIST, url);
  let status = 200;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!file.startsWith(DIST) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    file = path.join(DIST, '404.html');
    status = 404;
  }
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;

const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/privacy-policy', '/terms-of-service', '/thanks', '/this-page-does-not-exist'];
const HYDRATION = /\[hydration\]|hydrat|did not match|Minified React error #(418|419|421|422|423|425)/i;
const b = await puppeteer.launch({ headless: 'new' });
const failures = [];
let runs = 0;
for (const w of [390, 1280]) {
  for (const reduce of [false, true]) {
    for (const route of ROUTES) {
      const p = await b.newPage();
      await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
      await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }]);
      const msgs = [];
      p.on('console', (m) => {
        if ((m.type() === 'error' || m.type() === 'warn') && HYDRATION.test(m.text())) msgs.push(m.text().slice(0, 400));
      });
      p.on('pageerror', (e) => msgs.push(`pageerror: ${e.message.slice(0, 300)}`));
      await p.evaluateOnNewDocument(() => {
        document.addEventListener('readystatechange', () => {
          if (document.readyState === 'interactive') window.__parsedH1 = document.querySelector('h1');
        });
      });
      await p.goto(BASE + route, { waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 600));
      const adopted = await p.evaluate(() => {
        const now = document.querySelector('h1');
        /* The same node, and React's fiber on it: hydrated, not left
           alone and not replaced. */
        const fiber = now && Object.keys(now).some((k) => k.startsWith('__reactFiber'));
        return !!(window.__parsedH1 && now && window.__parsedH1 === now && now.isConnected && fiber);
      });
      if (!adopted) msgs.push('the parsed h1 was replaced, not hydrated');
      runs += 1;
      if (msgs.length) failures.push(`${route} @${w}${reduce ? ' reduced' : ''}:\n    ${msgs.join('\n    ')}`);
      await p.close();
    }
  }
}
await b.close();
server.close();

if (failures.length) {
  console.error(`HYDRATION CHECK FAILED on ${failures.length} of ${runs} runs:\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log(`hydration check: ${runs} runs (9 routes, 390 and 1280, motion on and reduced), no hydration warning, every h1 adopted`);

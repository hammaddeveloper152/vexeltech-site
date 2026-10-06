/* prerender.mjs: every public route as static HTML in dist (the founder's
   final audit, final22, 2026-10-06). Runs after `vite build` as part of
   `npm run build`.

   Why: the site is a client-rendered React app, so before this a crawler
   that does not run JavaScript saw an empty <div id="root">. Each route is
   now rendered once in Chrome and its finished document written to
   dist/<route>/index.html (home to dist/index.html, the not-found page to
   dist/404.html), with its own title, description, canonical, Open Graph
   and Twitter tags, JSON-LD, and every word of the page in the HTML.

   How: dist is served from memory by a small static server whose fallback
   is the untouched build template (so every route renders exactly as a
   visitor's first load would), each route is opened in Chrome with
   reduced motion on (every artifact at its finished, resting state, the
   hero on its first-second frame), and the document is written once the
   network is idle and the fonts are ready. React's createRoot replaces the
   prerendered markup with the same markup when the app starts.

   Needs puppeteer (a devDependency since final22). */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/privacy-policy', '/terms-of-service', '/thanks'];
const NOT_FOUND = '/404';

const TEMPLATE = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const TYPES = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
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
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(DIST, url);
  if (url !== '/' && file.startsWith(DIST) && fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(TEMPLATE);
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;

const browser = await puppeteer.launch({ headless: 'new' });
const out = {};
for (const route of [...ROUTES, NOT_FOUND]) {
  const p = await browser.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 300));
  let html = await p.evaluate(() => {
    /* Nothing the measuring machine added: the dev origin in any absolute
       URL is never written, since every URL in the app is relative or on
       the production origin. */
    return `<!doctype html>\n${document.documentElement.outerHTML}`;
  });
  /* Vite's preload helper writes the chunks it fetched as absolute URLs on
     the page's origin; on the prerender's origin they are made
     root-relative, as every other URL in the app already is. */
  html = html.split(BASE).join('');
  if (html.includes('localhost')) throw new Error(`${route}: a local URL leaked into the HTML`);
  const h1 = await p.$eval('h1', (n) => n.textContent.trim()).catch(() => '');
  if (!h1) throw new Error(`${route}: no h1 rendered`);
  out[route] = html;
  console.log(`prerendered ${route}  h1: ${h1}`);
  await p.close();
}
await browser.close();
server.close();

for (const [route, html] of Object.entries(out)) {
  const file =
    route === '/' ? path.join(DIST, 'index.html') : route === NOT_FOUND ? path.join(DIST, '404.html') : path.join(DIST, route.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
/* The untouched template stays as the fallback for any other route
   (.htaccess sends unknown paths to it, and the app renders them). */
fs.writeFileSync(path.join(DIST, 'app.html'), TEMPLATE);
console.log(`wrote ${Object.keys(out).length} files, and app.html as the fallback`);

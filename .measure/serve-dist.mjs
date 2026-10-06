/* serve-dist.mjs: dist served the way .measure/audit/htaccess-append.txt
   tells Hostinger to serve it (the founder's final audit, final22,
   2026-10-06), so measurements see what a visitor will.

     node .measure/serve-dist.mjs [port]     (default 4190)

   A file is served as itself; a folder with an index.html (a prerendered
   route) serves that file, with no trailing-slash redirect; any other path
   gets app.html, the app shell, with status 200. Text is gzipped; /assets/
   is cached for a year, immutable; HTML is no-cache. */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.argv[2] || 4190);
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
const TEXT = /^(text\/|application\/(json|xml|manifest)|image\/svg)/;

http
  .createServer((req, res) => {
    let url = decodeURIComponent(req.url.split('?')[0]);
    if (url.length > 1 && url.endsWith('/')) url = url.slice(0, -1);
    let file = path.join(DIST, url);
    if (!file.startsWith(DIST)) file = path.join(DIST, 'app.html');
    else if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) file = path.join(DIST, 'app.html');
    const type = TYPES[path.extname(file)] || 'application/octet-stream';
    const headers = { 'Content-Type': type };
    headers['Cache-Control'] = url.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : type.startsWith('text/html') ? 'no-cache' : 'public, max-age=86400';
    const body = fs.readFileSync(file);
    if (TEXT.test(type) && /gzip/.test(req.headers['accept-encoding'] || '')) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers);
      res.end(zlib.gzipSync(body));
      return;
    }
    res.writeHead(200, headers);
    res.end(body);
  })
  .listen(PORT, () => console.log(`dist on http://localhost:${PORT}`));

/* serve-dist.mjs: dist served the way .measure/audit/htaccess-append.txt
   tells Hostinger to serve it, so measurements see what a visitor will.

     node .measure/serve-dist.mjs [port]     (default 4190)

   THE APACHE-LIKE SERVER (the launch gate, 2026-10-07). There is no Apache
   on this machine, so this READS THE APPEND FILE and interprets the parts
   of it that decide a response, rather than restating them by hand:

     - every RewriteCond / RewriteRule in the mod_rewrite block, in order,
       with the R=301, L, NE, NC and OR flags, $n and %n back-references,
       %{HTTPS}, %{HTTP_HOST}, %{THE_REQUEST}, %{REQUEST_URI} and
       %{REQUEST_FILENAME} with -f / -d; after an internal rewrite the rules
       run again on the new path, as they do per directory
     - DirectoryIndex, and DirectorySlash Off (no automatic slash redirect)
     - ErrorDocument 404, with the 404 status kept
     - every `Header always set` line, `env=HTTPS` honoured
     - Cache-Control for .html and /assets/, as the FilesMatch and If blocks
     - brotli, else gzip, for the AddOutputFilterByType types only

   THE SCHEME AND HOST ARE SIMULATED. The server speaks plain http; a
   request counts as HTTPS unless it carries `X-Forwarded-Proto: http`, and
   the host is the Host header. So `curl -H 'Host: www.vexeltechsolutions.com'
   -H 'X-Forwarded-Proto: http' localhost:4190/services/` exercises the
   www and http rules. What this cannot prove is how Hostinger's own server
   (LiteSpeed or Apache, and its existing .htaccess) behaves; that is the
   live curl run in the launch-gate report. */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(HERE, '..', 'dist');
const HTACCESS = fs.readFileSync(path.join(HERE, 'audit', 'htaccess-append.txt'), 'utf8');
const PORT = Number(process.argv[2] || 4190);
const TYPES = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
};

/* ---- The file, parsed ------------------------------------------------------ */
const lines = HTACCESS.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const args = (l) => l.match(/"[^"]*"|\S+/g).map((t) => (t.startsWith('"') ? t.slice(1, -1) : t));
const flagsOf = (t) => (t && t.startsWith('[') ? t.slice(1, -1).split(',').map((f) => f.trim()) : []);

const rules = [];
let conds = [];
let inRewrite = false;
for (const l of lines) {
  if (l === '<IfModule mod_rewrite.c>') inRewrite = true;
  else if (inRewrite && l === '</IfModule>') inRewrite = false;
  else if (inRewrite && l.startsWith('RewriteCond ')) {
    const [, test, pattern, f] = args(l);
    conds.push({ test, pattern, flags: flagsOf(f) });
  } else if (inRewrite && l.startsWith('RewriteRule ')) {
    const [, pattern, sub, f] = args(l);
    rules.push({ pattern, sub, flags: flagsOf(f), conds });
    conds = [];
  }
}
const errorDoc = (HTACCESS.match(/^ErrorDocument 404 (\S+)/m) || [])[1];
const dirIndex = (HTACCESS.match(/^DirectoryIndex (\S+)/m) || [])[1] || 'index.html';
const always = lines
  .filter((l) => l.startsWith('Header always set '))
  .map((l) => {
    const [, , , name, value, env] = args(l);
    return { name, value, env: env && env.startsWith('env=') ? env.slice(4) : null };
  });
const compressTypes = new Set(
  (HTACCESS.match(/^AddOutputFilterByType DEFLATE (.+)$/m) || ['', ''])[1].split(/\s+/).filter(Boolean)
);
const brotli = /mod_brotli\.c/.test(HTACCESS);

/* ---- Rewriting ------------------------------------------------------------- */
const fsPath = (urlPath) => path.join(DIST, decodeURIComponent(urlPath));
const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();
const isDir = (p) => fs.existsSync(p) && fs.statSync(p).isDirectory();

function vars(ctx, uri) {
  return {
    HTTPS: ctx.https ? 'on' : 'off',
    HTTP_HOST: ctx.host,
    THE_REQUEST: ctx.theRequest,
    REQUEST_URI: uri,
    REQUEST_FILENAME: fsPath(uri).replace(/[\\/]+$/, ''),
  };
}
const expand = (s, v, m, cm) =>
  s
    .replace(/%\{([A-Z_:]+)\}/g, (_, k) => v[k] ?? '')
    .replace(/\$(\d)/g, (_, n) => (m && m[n]) || '')
    .replace(/%(\d)/g, (_, n) => (cm && cm[n]) || '');

function testCond(c, v) {
  const value = expand(c.test, v);
  let p = c.pattern;
  const neg = p.startsWith('!');
  if (neg) p = p.slice(1);
  let ok;
  let m = null;
  if (p === '-f') ok = isFile(value);
  else if (p === '-d') ok = isDir(value);
  else {
    m = new RegExp(p, c.flags.includes('NC') ? 'i' : '').exec(value);
    ok = !!m;
  }
  return { ok: neg ? !ok : ok, m: neg ? null : m };
}

/* Returns { redirect } or { uri } (the path to serve). A condition chain is
   ANDed, and a run of [OR] conditions counts as one term. */
function rewrite(ctx, uri) {
  for (let pass = 0; pass < 10; pass += 1) {
    let changed = false;
    for (const r of rules) {
      const v = vars(ctx, uri);
      const m = new RegExp(r.pattern, r.flags.includes('NC') ? 'i' : '').exec(uri.slice(1));
      if (!m) continue;
      let ok = true;
      let cm = null;
      let orRun = null;
      for (const c of r.conds) {
        const t = testCond(c, v);
        if (t.m) cm = t.m;
        if (c.flags.includes('OR')) {
          orRun = (orRun || false) || t.ok;
          continue;
        }
        ok = ok && (orRun === null ? t.ok : orRun || t.ok);
        orRun = null;
      }
      if (orRun !== null) ok = ok && orRun;
      if (!ok) continue;
      const target = expand(r.sub, v, m, cm);
      const redirect = r.flags.find((f) => f.startsWith('R'));
      if (redirect) {
        const status = Number(redirect.split('=')[1] || 302);
        return { redirect: target, status };
      }
      if (target !== '-' && target !== uri) {
        uri = target;
        changed = true;
      }
      if (r.flags.includes('L')) break;
    }
    if (!changed) break;
  }
  return { uri };
}

/* ---- Serving --------------------------------------------------------------- */
const securityHeaders = (ctx) => {
  const h = {};
  for (const a of always) if (!a.env || (a.env === 'HTTPS' && ctx.https)) h[a.name] = a.value;
  return h;
};

function send(req, res, status, file, ctx) {
  const type = TYPES[path.extname(file)] || 'application/octet-stream';
  const headers = { 'Content-Type': type, ...securityHeaders(ctx) };
  if (type.startsWith('text/html')) headers['Cache-Control'] = 'no-cache';
  if (ctx.uri.startsWith('/assets/')) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  let body = fs.readFileSync(file);
  const ae = req.headers['accept-encoding'] || '';
  if (compressTypes.has(type.split(';')[0])) {
    headers.Vary = 'Accept-Encoding';
    if (brotli && /\bbr\b/.test(ae)) {
      headers['Content-Encoding'] = 'br';
      body = zlib.brotliCompressSync(body);
    } else if (/gzip/.test(ae)) {
      headers['Content-Encoding'] = 'gzip';
      body = zlib.gzipSync(body);
    }
  }
  headers['Content-Length'] = body.length;
  res.writeHead(status, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
}

http
  .createServer((req, res) => {
    const raw = req.url.split('?')[0];
    const ctx = {
      https: (req.headers['x-forwarded-proto'] || 'https') !== 'http',
      host: req.headers.host || 'localhost',
      theRequest: `${req.method} ${req.url} HTTP/1.1`,
      uri: raw,
    };
    const out = rewrite(ctx, raw);
    if (out.redirect) {
      res.writeHead(out.status, { Location: out.redirect, ...securityHeaders(ctx) });
      res.end();
      return;
    }
    let file = fsPath(out.uri);
    if (!file.startsWith(DIST)) file = '';
    if (file && isDir(file) && isFile(path.join(file, dirIndex))) file = path.join(file, dirIndex);
    if (file && isFile(file)) {
      send(req, res, 200, file, { ...ctx, uri: out.uri });
      return;
    }
    if (errorDoc && isFile(fsPath(errorDoc))) send(req, res, 404, fsPath(errorDoc), { ...ctx, uri: errorDoc });
    else {
      res.writeHead(404);
      res.end('Not found');
    }
  })
  .listen(PORT, () => console.log(`dist on http://localhost:${PORT} (htaccess-append.txt: ${rules.length} rewrite rules)`));

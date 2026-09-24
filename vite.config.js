import fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* ---- CRITICAL CSS, 2026-09-25 (the founder's release-audit addendum) -----

   Home's above-the-fold rules are inlined into index.html and the full
   stylesheet loads without blocking (`media="print"`, switched to `all` on
   load). The rules kept are the ones whose selectors use only classes that
   paint above the fold on home at 390, 768, 1280 and 1440 before any scroll
   (`src/critical-classes.json`, written by `.measure/critical-classes.mjs`;
   it is a build input, so it lives in src/, not in .measure/, whose *.json
   are ignored measurement output),
   plus every rule with no class at all (:root, html, body, elements),
   @font-face, and the @keyframes the kept rules name.

   Every other route waits for the full stylesheet before it renders
   (src/main.jsx), so nothing else can paint unstyled; its content is drawn
   by script, so the wait costs it nothing it had before. Home renders at
   once on the inlined rules and refreshes its ScrollTriggers when the rest
   lands.

   If the class list goes stale, the full stylesheet still styles
   everything: the cost is a flash above the fold, never a broken page.

   The Clash Display preload is injected here too, because its file name is
   hashed at build time and index.html cannot name it. */

const EXTRA = ['skip'];

function blocks(css) {
  const out = [];
  let i = 0;
  const n = css.length;
  while (i < n) {
    const start = i;
    let depth = 0;
    let q = null;
    while (i < n) {
      const c = css[i];
      if (q) {
        if (c === '\\') { i += 2; continue; }
        if (c === q) q = null;
        i++;
        continue;
      }
      if (c === '"' || c === "'") { q = c; i++; continue; }
      if (c === '(') depth++;
      else if (c === ')') depth--;
      else if (depth === 0 && (c === '{' || c === ';')) break;
      i++;
    }
    if (i >= n) break;
    const prelude = css.slice(start, i).trim();
    if (css[i] === ';') { out.push({ stmt: `${prelude};` }); i++; continue; }
    let j = i + 1;
    let d = 1;
    q = null;
    while (j < n && d > 0) {
      const c = css[j];
      if (q) {
        if (c === '\\') { j += 2; continue; }
        if (c === q) q = null;
        j++;
        continue;
      }
      if (c === '"' || c === "'") { q = c; j++; continue; }
      if (c === '{') d++;
      else if (c === '}') d--;
      j++;
    }
    out.push({ prelude, body: css.slice(i + 1, j - 1) });
    i = j;
  }
  return out;
}

function splitList(s) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const c of s) {
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur);
  return out;
}

function keepSelector(sel, set) {
  const stripped = sel.replace(/:not\((?:[^()]|\([^()]*\))*\)/g, '');
  const cls = [...stripped.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]);
  return cls.every((c) => set.has(c));
}

function extract(css, set, frames) {
  let out = '';
  for (const b of blocks(css)) {
    if (b.stmt) {
      if (/^@(charset|layer)/.test(b.stmt)) out += b.stmt;
      continue;
    }
    const p = b.prelude;
    if (p.startsWith('@font-face') || p.startsWith('@property')) { out += `${p}{${b.body}}`; continue; }
    if (/^@(-webkit-)?keyframes/.test(p)) { frames.push(b); continue; }
    if (/^@(media|supports|layer|container)/.test(p)) {
      const inner = extract(b.body, set, frames);
      if (inner) out += `${p}{${inner}}`;
      continue;
    }
    if (p.startsWith('@')) continue;
    if (splitList(p).some((s) => keepSelector(s, set))) out += `${p}{${b.body}}`;
  }
  return out;
}

function criticalCss() {
  return {
    name: 'vt-critical-css',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const link = html.match(/<link rel="stylesheet" crossorigin href="(\/assets\/index-[^"]+\.css)">/);
        if (!link) return html;
        const href = link[1];
        const asset = Object.values(ctx.bundle).find((a) => a.type === 'asset' && `/${a.fileName}` === href);
        if (!asset) return html;
        const css = typeof asset.source === 'string' ? asset.source : Buffer.from(asset.source).toString('utf8');
        const list = JSON.parse(fs.readFileSync(new URL('./src/critical-classes.json', import.meta.url), 'utf8'));
        const set = new Set([...list, ...EXTRA]);
        const frames = [];
        let crit = extract(css, set, frames);
        for (const f of frames) {
          const name = f.prelude.replace(/^@(-webkit-)?keyframes\s+/, '').trim();
          if (new RegExp(`(animation(-name)?:[^;}]*\\b${name}\\b)`).test(crit)) crit += `${f.prelude}{${f.body}}`;
        }
        const clash = Object.values(ctx.bundle).find((a) => a.type === 'asset' && /clash-display-variable-[\w-]+\.woff2$/.test(a.fileName));
        const preload = clash
          ? `<link rel="preload" href="/${clash.fileName}" as="font" type="font/woff2" crossorigin>\n    `
          : '';
        return html.replace(
          link[0],
          `${preload}<style data-vt-critical>${crit}</style>\n    ` +
            `<link rel="stylesheet" crossorigin href="${href}" media="print" onload="this.media='all'" data-vt-css>\n    ` +
            `<noscript><link rel="stylesheet" crossorigin href="${href}"></noscript>`
        );
      },
    },
  };
}

export default defineConfig({ plugins: [react(), criticalCss()] });

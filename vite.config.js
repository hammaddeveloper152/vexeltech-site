import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* ---- CRITICAL CSS, 2026-09-25 (the founder's release-audit addendum) -----

   Every public route's above-the-fold rules are inlined into index.html and the full
   stylesheet loads without blocking (`media="print"`, switched to `all` on
   load). The rules kept are the ones whose selectors use only classes that
   paint above the fold on any public route at 390, 768, 1280 and 1440
   before any scroll
   (`src/critical-classes.json`, written by `.measure/critical-classes.mjs`;
   it is a build input, so it lives in src/, not in .measure/, whose *.json
   are ignored measurement output),
   plus every rule with no class at all (:root, html, body, elements),
   @font-face, and the @keyframes the kept rules name.

   Every route renders at once on the inlined rules and refreshes its
   ScrollTriggers when the rest lands (src/main.jsx). Until 2026-10-01 only
   home did, and every other route waited for the full stylesheet, which
   was most of /services' measured LCP.

   If the class list goes stale, the full stylesheet still styles
   everything: the cost is a flash above the fold, never a broken page.

   The Clash Display and Satoshi preloads are injected here too, because
   their file names are hashed at build time and index.html cannot name
   them. */

/* FINAL29 (2026-10-07): What we do's grid and card sizes ride in the
   critical CSS too. Below the fold, but until the full sheet landed the
   cards had no height, Recent work sat inside Chrome's lazy-load distance,
   and its screenshots (635 KB) downloaded before the first paint. FINAL30:
   the branding desk's strip, which an unstyled phone layout put first, so
   the full sheet moved the whole of /services (CLS 0.744). */
const EXTRA = ['skip', 'wwd', 'wwd__grid', 'wwd__card', 'bd__strip'];

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
        /* `index-` while CSS was split per chunk, `style-` since it is one
           file (cssCodeSplit: false, 2026-10-01). */
        const link = html.match(/<link rel="stylesheet" crossorigin href="(\/assets\/(?:index|style)-[^"]+\.css)">/);
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
        /* Clash (headings) and, since 2026-10-01, Satoshi (body: /services'
           LCP is a Satoshi paragraph). Both hashed, so injected here; Monigue
           is preloaded from index.html. One document, so every route. */
        const preload = [/clash-display-variable-[\w-]+\.woff2$/, /satoshi-variable-[\w-]+\.woff2$/]
          .map((re) => Object.values(ctx.bundle).find((a) => a.type === 'asset' && re.test(a.fileName)))
          .filter(Boolean)
          .map((a) => `<link rel="preload" href="/${a.fileName}" as="font" type="font/woff2" crossorigin>\n    `)
          .join('');
        return html.replace(
          link[0],
          `${preload}<style data-vt-critical>${crit}</style>\n    ` +
            /* No onload attribute since the launch gate (2026-10-07): an
               inline handler is inline script under the CSP. The boot file
               (routePreload below) switches the media once the sheet has
               loaded. */
            `<link rel="stylesheet" crossorigin href="${href}" media="print" data-vt-css>\n    ` +
            `<noscript><link rel="stylesheet" crossorigin href="${href}"></noscript>`
        );
      },
    },
  };
}

/* ---- THE LANDING ROUTE'S CHUNK, PRELOADED, 2026-10-01 (the founder's
   bundle split) --------------------------------------------------------------

   Every page is its own chunk (App.jsx), so the page a reader lands on is
   only asked for once the main script has run: a second round trip before
   anything paints. A small inline script ahead of the main one reads the
   path and adds a modulepreload for that route's chunk and the shared chunks
   it imports, so they download beside the main script instead of after it.

   The table names each page's module once; the paths are App.jsx's, aliases
   included. A path missing here still works and only loses the preload. */
const ROUTE_PAGES = {
  'Home.jsx': ['/'],
  'ServicesPage.jsx': ['/services'],
  'PricingPage.jsx': ['/pricing', '/packages'],
  'AboutPage.jsx': ['/about-us', '/about'],
  'ContactPage.jsx': ['/contact-us', '/contact'],
};

let bootSource = '';
let bootName = '';

function routePreload() {
  return {
    name: 'vt-route-preload',
    apply: 'build',
    writeBundle(opts) {
      if (bootSource) fs.writeFileSync(path.join(opts.dir || 'dist', bootName), bootSource);
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const chunks = Object.values(ctx.bundle).filter((c) => c.type === 'chunk');
        const entry = chunks.find((c) => c.isEntry);
        const map = {};
        for (const [file, paths] of Object.entries(ROUTE_PAGES)) {
          const chunk = chunks.find((c) => c.facadeModuleId && c.facadeModuleId.replace(/\\/g, '/').endsWith(`/pages/site/${file}`));
          if (!chunk) throw new Error(`vt-route-preload: no chunk for ${file}`);
          const files = [chunk.fileName, ...chunk.imports.filter((f) => f !== entry.fileName)].map((f) => `/${f}`);
          for (const path of paths) map[path] = files;
        }
        /* (Final pass 2 preloaded /services' signage plate here, then its
           largest paint; the identity sheet put the signage under the sheet
           on a phone, 2026-10-03, and the preload came out.) */
        /* THE BOOT FILE (the launch gate, 2026-10-07). This was an inline
           <script>, which a CSP of script-src 'self' does not allow. It is
           now a small external file, content-hashed and loaded async ahead
           of the main script. It adds the modulepreloads for the landing
           route, and it switches the full stylesheet from print to all once
           the sheet has loaded (the inline onload attribute's old job).
           Written to dist in writeBundle. */
        bootSource =
          `(function(){var m=${JSON.stringify(map)};` +
          `var p=location.pathname.replace(/\\/+$/,'')||'/';` +
          `(m[p]||[]).forEach(function(h){var l=document.createElement('link');` +
          `l.rel='modulepreload';l.crossOrigin='';l.href=h;document.head.appendChild(l);});` +
          `function c(){document.querySelectorAll('link[data-vt-css]').forEach(function(l){` +
          `if(l.media==='all')return;if(l.sheet){l.media='all';}else{l.addEventListener('load',function(){l.media='all';},{once:true});}});}` +
          `c();document.addEventListener('DOMContentLoaded',c);})();`;
        bootName = `assets/boot-${createHash('sha256').update(bootSource).digest('hex').slice(0, 8)}.js`;
        const script = `<script src="/${bootName}" async></script>\n    `;
        return html.replace(/<script type="module" crossorigin/, (m) => script + m);
      },
    },
  };
}

/* ---- ONE STYLESHEET, IN THE ORDER IT HAD, 2026-10-01 ----------------------

   With every page its own chunk, Vite would split each page's CSS into a
   file of its own, loaded when the chunk is; the critical-CSS pass above
   reads one sheet, so the CSS stays one file (`cssCodeSplit: false`).

   THE ORDER IS THE CASCADE, and chunking changes it. Vite writes a merged
   sheet chunk by chunk, so the shared chunks' CSS (register.css among it)
   landed ahead of the section sheets it must follow, and home's What we do
   came out 24px shorter at 1280. So the order is fixed here, independent
   of the chunks: `virtual:vt-css` imports every stylesheet in the order the
   eager build met them, walking the imports from main.jsx in source order
   with each `page(() => import(...))` taken where it stands, and the plain
   `lazy(() => import(...))` pages (legal, /thanks) last, where their sheet
   loaded before. main.jsx imports it first, so every sheet is the main
   chunk's and the merged file keeps this order. Checked byte for byte
   against the eager build's sheet (`.measure/split.mjs` notes). */
const CSS_ORDER = 'virtual:vt-css';

function cssOrder() {
  const src = fileURLToPath(new URL('./src/', import.meta.url));
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const resolveFile = (from, spec) => {
    if (!spec.startsWith('.')) return null;
    const base = path.resolve(path.dirname(from), spec);
    for (const f of [base, `${base}.js`, `${base}.jsx`]) if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
    return null;
  };
  const walk = () => {
    const seen = new Set();
    const css = [];
    const late = [];
    const visit = (file) => {
      if (seen.has(file)) return;
      seen.add(file);
      if (file.endsWith('.css')) {
        css.push(file);
        return;
      }
      const code = strip(fs.readFileSync(file, 'utf8'));
      const re = /\bimport\s+(?:[^'"`;]*?\s+from\s+)?['"]([^'"]+)['"]|(\blazy\(\s*\(\)\s*=>\s*)?\bimport\(\s*['"]([^'"]+)['"]\s*\)/g;
      for (const m of code.matchAll(re)) {
        const spec = m[1] || m[3];
        const f = resolveFile(file, spec);
        if (!f) continue;
        if (m[2]) late.push(f);
        else visit(f);
      }
    };
    visit(path.join(src, 'main.jsx'));
    for (let i = 0; i < late.length; i += 1) visit(late[i]);
    return css;
  };
  return {
    name: 'vt-css-order',
    enforce: 'pre',
    resolveId(id) {
      return id === CSS_ORDER ? `\0${CSS_ORDER}` : null;
    },
    load(id) {
      if (id !== `\0${CSS_ORDER}`) return null;
      const files = walk();
      files.forEach((f) => this.addWatchFile(f));
      return files.map((f) => `import ${JSON.stringify(f.replace(/\\/g, '/'))};`).join('\n');
    },
  };
}

/* PLAUSIBLE BEHIND A FLAG (the launch gate, 2026-10-07). Off by default:
   with VITE_PLAUSIBLE_DOMAIN unset the build carries no analytics at all.
   Set it (VITE_PLAUSIBLE_DOMAIN=vexeltechsolutions.com in .env) and every
   page's head gets Plausible's tagged-events script from plausible.io. The
   events are src/components/site/analytics.js. The CSP in
   htaccess-append.txt then needs https://plausible.io in script-src and
   connect-src. */
function plausible() {
  let domain = '';
  return {
    name: 'vt-plausible',
    configResolved(c) {
      domain = String(c.env.VITE_PLAUSIBLE_DOMAIN || process.env.VITE_PLAUSIBLE_DOMAIN || '').trim();
    },
    transformIndexHtml(html) {
      if (!/^[a-z0-9.-]+$/i.test(domain)) return html;
      return html.replace(
        '</head>',
        `  <script defer data-domain="${domain}" src="https://plausible.io/js/script.tagged-events.js"></script>\n  </head>`
      );
    },
  };
}

/* THE NETLIFY FORM TWIN BEHIND A FLAG (the founder's final audit, final22,
   2026-10-06). The hidden <form name="contact" data-netlify> in index.html
   exists only for Netlify's parser. The site posts to Formspree on
   Hostinger (content/form.js), so the build strips the twin, and the
   comment above it, unless VITE_FORM_TARGET=netlify. */
function netlifyFormTwin() {
  let target = '';
  return {
    name: 'vt-netlify-form-twin',
    /* The resolved env carries the .env file's VITE_ values. */
    configResolved(c) {
      target = c.env.VITE_FORM_TARGET || process.env.VITE_FORM_TARGET || '';
    },
    transformIndexHtml(html) {
      if (target === 'netlify') return html;
      return html.replace(/<form name="contact" data-netlify[\s\S]*?<\/form>\s*/, '');
    },
  };
}

export default defineConfig({
  plugins: [cssOrder(), react(), criticalCss(), routePreload(), netlifyFormTwin(), plausible()],
  build: { cssCodeSplit: false },
});

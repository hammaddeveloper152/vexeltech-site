/* audit.mjs — the pre-launch viewer audit, 2026-09-16.

   node .measure/audit.mjs <mode> [base]     BASE default http://localhost:4180
   ROUTES=/,/pricing narrows the route list.

   Modes, each at 1280 and 390, every route:
     seams       top-level blocks in order: ground, padding, margin, borders,
                 object-to-object gap across each join, any thin full-width
                 element near a join, and the painted step across it (8-bit)
     type        text blocks whose last line is one word (widow) or whose
                 first line is one word of several (orphan); headings at 390
                 that break a word or overflow
     reveal      attribute flips on the reveal hooks (data-revealed, data-in,
                 data-lit) against where the element was: late (in view over
                 400ms first), early (flipped while off screen), twice; every
                 layout shift with its sources; hero film first frame and
                 marquee start on /
     continuity  frames a quarter screen apart with nothing to land on
     interact    1280: hover and press on every link and button, with clicks
                 swallowed so nothing navigates; every internal link resolved.
                 390: tap each one and read what stays applied after.

   Writes .measure/out/audit/<mode>.json and prints a summary. It measures;
   judging a finding is the reader's job. */
import puppeteer from 'puppeteer';
import fs from 'node:fs';

const [MODE = 'seams', BASE = 'http://localhost:4180'] = process.argv.slice(2);
const ALL = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/portfolio', '/case-studies', '/resources', '/404',
  '/blog', '/thanks', '/privacy-policy', '/terms-of-service', '/legacy/contact'];
const ROUTES = process.env.ROUTES ? process.env.ROUTES.split(',') : ALL;
const WIDTHS = [[1280, 800], [390, 844]];
const OUT = '.measure/out/audit';
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const args = ['--force-color-profile=srgb', '--hide-scrollbars', '--font-render-hinting=none', '--autoplay-policy=no-user-gesture-required'];

async function open(b, route, w, h, opts = {}) {
  const p = await b.newPage();
  if (opts.touch) await p.setViewport({ width: w, height: h, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  else await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  if (opts.before) await p.evaluateOnNewDocument(opts.before);
  await p.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 });
  await p.evaluate(() => document.fonts.ready);
  return p;
}

/* Walk the page once so every reveal has run, then return to the top. */
async function settle(p, h) {
  const tot = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= tot; y += Math.round(h / 3)) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(110); }
  await p.evaluate(() => window.scrollTo(0, 0));
  await wait(500);
}

const results = [];

if (MODE === 'seams') {
  const b = await puppeteer.launch({ headless: 'new', args });
  for (const route of ROUTES) for (const [w, h] of WIDTHS) {
    const p = await open(b, route, w, h);
    await settle(p, h);
    const blocks = await p.evaluate(() => {
      const main = document.querySelector('main');
      const list = [...(main ? main.children : [])].filter((e) => e.getBoundingClientRect().height > 0);
      const foot = document.querySelector('footer');
      if (foot && !list.includes(foot)) list.push(foot);
      const visibleLeafRects = (root) => {
        const rects = [];
        const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let n = tw.nextNode(); n; n = tw.nextNode()) {
          if (!n.textContent.trim()) continue;
          const el = n.parentElement; const c = getComputedStyle(el);
          if (c.visibility === 'hidden' || +c.opacity < 0.05 || el.closest('[aria-hidden="true"].skip-h, .skip-h')) continue;
          const r = document.createRange(); r.selectNodeContents(n);
          for (const q of r.getClientRects()) if (q.width > 1 && q.height > 1) rects.push(q);
        }
        root.querySelectorAll('img, svg, video, canvas, input, select, textarea, button').forEach((el) => {
          const c = getComputedStyle(el); const q = el.getBoundingClientRect();
          if (q.width > 4 && q.height > 4 && c.visibility !== 'hidden' && +c.opacity >= 0.05) rects.push(q);
        });
        return rects;
      };
      return list.map((el) => {
        const c = getComputedStyle(el); const r = el.getBoundingClientRect();
        const leaves = visibleLeafRects(el);
        const bgA = (c.backgroundColor.match(/[\d.]+/g) || []).map(Number);
        return {
          tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().split(' ').filter((x) => x && x !== 'vt').join('.'),
          top: Math.round(r.top + scrollY), bottom: Math.round(r.bottom + scrollY),
          ground: (bgA.length === 4 ? bgA[3] : 1) > 0.01 && c.backgroundColor !== 'rgba(0, 0, 0, 0)' ? c.backgroundColor : 'transparent',
          image: c.backgroundImage !== 'none' ? c.backgroundImage.slice(0, 50) : '',
          pad: [c.paddingTop, c.paddingBottom], mar: [c.marginTop, c.marginBottom],
          border: [c.borderTopWidth, c.borderBottomWidth],
          first: leaves.length ? Math.round(Math.min(...leaves.map((q) => q.top)) + scrollY) : null,
          last: leaves.length ? Math.round(Math.max(...leaves.map((q) => q.bottom)) + scrollY) : null,
        };
      });
    });
    /* thin full-width elements within 40px of each join */
    const joins = [];
    for (let i = 1; i < blocks.length; i++) {
      const A = blocks[i - 1], B = blocks[i];
      const y = B.top;
      const thin = await p.evaluate((y) => [...document.querySelectorAll('body *')].filter((e) => {
        const q = e.getBoundingClientRect(); const c = getComputedStyle(e);
        const top = q.top + scrollY;
        return q.height > 0 && q.height <= 2 && q.width >= innerWidth * 0.5 && Math.abs(top - y) <= 40 && c.visibility !== 'hidden' && +c.opacity > 0.05;
      }).map((e) => (e.className || e.tagName).toString().slice(0, 40)), y);
      /* the painted step: mean of 8 rows above against 8 below, the join in the middle */
      await p.evaluate((v) => window.scrollTo(0, v), Math.max(0, y - Math.round(h / 2)));
      await wait(350);
      const vy = await p.evaluate((y) => y - scrollY, y);
      let step = null;
      if (vy > 12 && vy < h - 12) {
        const buf = await p.screenshot({ clip: { x: 0, y: vy - 10, width: w, height: 20 }, encoding: 'binary' });
        const { PNG } = await import('pngjs');
        const im = PNG.sync.read(buf);
        const rowMean = (ry) => { let s = 0; for (let x = 0; x < im.width; x++) { const i = (ry * im.width + x) * 4; s += (im.data[i] + im.data[i + 1] + im.data[i + 2]) / 3; } return s / im.width; };
        const above = [0, 1, 2, 3, 4, 5, 6, 7].map(rowMean).reduce((a, c) => a + c, 0) / 8;
        const below = [12, 13, 14, 15, 16, 17, 18, 19].map(rowMean).reduce((a, c) => a + c, 0) / 8;
        const rows = [...Array(20).keys()].map(rowMean);
        const edge = Math.max(...rows.slice(1).map((v, k) => Math.abs(v - rows[k])));
        step = { across: +(below - above).toFixed(1), sharpest: +edge.toFixed(1) };
      }
      joins.push({
        a: A.cls || A.tag, b: B.cls || B.tag, at: y,
        gap: A.last != null && B.first != null ? B.first - A.last : null,
        aPad: A.pad, bPad: B.pad, aGround: A.ground + (A.image ? ' +img' : ''), bGround: B.ground + (B.image ? ' +img' : ''),
        borders: [A.border, B.border], thin, step,
      });
    }
    results.push({ route, w, blocks, joins });
    console.log(`\n=== ${route} ${w}`);
    for (const j of joins) {
      console.log(`  ${String(j.at).padStart(6)}  ${(j.a + ' > ' + j.b).slice(0, 58).padEnd(58)} gap ${String(j.gap).padStart(4)}  pad ${j.aPad[1]}/${j.bPad[0]}` +
        `  ${j.thin.length ? 'THIN ' + j.thin.join('|') : ''}  ${j.step ? `step ${j.step.across} edge ${j.step.sharpest}` : ''}` +
        `${j.borders.flat().some((v) => v !== '0px') ? ' BORDER ' + JSON.stringify(j.borders) : ''}`);
    }
    await p.close();
  }
  await b.close();
}

if (MODE === 'type') {
  const b = await puppeteer.launch({ headless: 'new', args });
  for (const route of ROUTES) for (const [w, h] of WIDTHS) {
    const p = await open(b, route, w, h);
    await settle(p, h);
    const found = await p.evaluate((w) => {
      const out = [];
      const blocks = [...document.querySelectorAll('h1,h2,h3,h4,p,li,dd,dt,blockquote,figcaption,label,a,button,summary,td,th')]
        .filter((el) => {
          if (el.closest('[aria-hidden="true"], .skip-h, .sr-only')) return false;
          const c = getComputedStyle(el);
          if (c.visibility === 'hidden' || c.display === 'none' || +c.opacity < 0.05) return false;
          /* the innermost block that holds text directly */
          return [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().split(/\s+/).length >= 1 && n.textContent.trim());
        });
      for (const el of blocks) {
        const words = [];
        const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        for (let n = tw.nextNode(); n; n = tw.nextNode()) {
          const s = n.textContent; const re = /\S+/g; let m;
          while ((m = re.exec(s))) {
            const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
            const rects = [...r.getClientRects()].filter((q) => q.width > 0);
            if (rects.length) words.push({ t: m[0], top: Math.round(rects[0].top), broken: rects.length > 1 && Math.abs(rects[0].top - rects[rects.length - 1].top) > 2 });
          }
        }
        if (words.length < 2) continue;
        const lines = [];
        for (const wd of words) {
          const l = lines.find((x) => Math.abs(x.top - wd.top) <= 3);
          if (l) l.words.push(wd.t); else lines.push({ top: wd.top, words: [wd.t] });
        }
        lines.sort((a, c) => a.top - c.top);
        const heading = /^H[1-4]$/.test(el.tagName);
        const r = el.getBoundingClientRect();
        const cls = (el.className || el.tagName).toString().split(' ')[0].slice(0, 30);
        const text = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 60);
        const yDoc = Math.round(r.top + scrollY);
        if (lines.length >= 2 && lines[lines.length - 1].words.length === 1 && words.length >= 4) out.push({ kind: 'widow', cls, heading, y: yDoc, lines: lines.length, last: lines[lines.length - 1].words[0], text });
        if (lines.length >= 2 && lines[0].words.length === 1 && words.length >= 4) out.push({ kind: 'orphan-first', cls, heading, y: yDoc, lines: lines.length, text });
        if (words.some((x) => x.broken)) out.push({ kind: 'word broken across lines', cls, heading, y: yDoc, text, word: words.find((x) => x.broken).t });
        if (heading && el.scrollWidth > el.clientWidth + 1) out.push({ kind: 'heading overflows', cls, heading, y: yDoc, text, over: el.scrollWidth - el.clientWidth });
      }
      return out;
    }, w);
    results.push({ route, w, found });
    console.log(`\n=== ${route} ${w}: ${found.length}`);
    for (const f of found) console.log(`  ${String(f.y).padStart(6)} ${f.kind.padEnd(24)} ${f.heading ? 'H ' : '  '}${f.cls.padEnd(22)} "${f.text}"${f.last ? ` [${f.last}]` : ''}${f.word ? ` [${f.word}]` : ''}`);
    await p.close();
  }
  await b.close();
}

if (MODE === 'reveal') {
  const b = await puppeteer.launch({ headless: 'new', args });
  for (const route of ROUTES) for (const [w, h] of WIDTHS) {
    const p = await open(b, route, w, h, {
      before: () => {
        window.__audit = { flips: [], shifts: [], seen: new Map(), video: null, t0: performance.now() };
        const sig = (el) => `${el.tagName.toLowerCase()}.${(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').toString().split(' ')[0]}`;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries()) {
            if (e.hadRecentInput) continue;
            window.__audit.shifts.push({ t: Math.round(e.startTime), v: +e.value.toFixed(4), y: Math.round(scrollY),
              src: (e.sources || []).map((s) => (s.node ? sig(s.node.nodeType === 1 ? s.node : s.node.parentElement) : '?') + ` ${Math.round(s.previousRect.top)}->${Math.round(s.currentRect.top)} h${Math.round(s.previousRect.height)}->${Math.round(s.currentRect.height)}`) });
          }
        }).observe({ type: 'layout-shift', buffered: true });
        const watch = () => {
          new MutationObserver((ms) => {
            for (const m of ms) {
              const el = m.target; const v = el.getAttribute(m.attributeName);
              if (v === m.oldValue) continue;
              const r = el.getBoundingClientRect();
              const vis = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / Math.max(1, Math.min(r.height, innerHeight));
              const firstSeen = window.__audit.seen.get(el);
              window.__audit.flips.push({ t: Math.round(performance.now()), y: Math.round(scrollY), el: sig(el), attr: m.attributeName, from: m.oldValue, to: v,
                vis: +vis.toFixed(2), top: Math.round(r.top), inViewFor: firstSeen ? Math.round(performance.now() - firstSeen) : null,
                trans: getComputedStyle(el).transitionDuration + '|' + (el.firstElementChild ? getComputedStyle(el.firstElementChild).transitionDuration : '') });
            }
          }).observe(document.documentElement, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['data-revealed', 'data-in', 'data-lit'] });
          /* when each reveal target first has 40% of itself on screen */
          const tick = () => {
            document.querySelectorAll('[data-revealed], [data-in]').forEach((el) => {
              if (window.__audit.seen.has(el)) return;
              const r = el.getBoundingClientRect();
              const vis = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / Math.max(1, Math.min(r.height, innerHeight));
              if (vis >= 0.4) window.__audit.seen.set(el, performance.now());
            });
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          const v = document.querySelector('video');
          if (v) {
            const mark = () => { if (!window.__audit.video) window.__audit.video = { firstFrame: Math.round(performance.now()), poster: v.getAttribute('poster'), src: (v.currentSrc || '').split('/').pop() }; };
            if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(mark); else v.addEventListener('playing', mark, { once: true });
          }
        };
        document.addEventListener('DOMContentLoaded', watch);
      },
    });
    /* on /, the hero film and the marquee before any scroll */
    let hero = null;
    if (route === '/') {
      hero = await p.evaluate(async () => {
        const nav = performance.getEntriesByType('navigation')[0];
        const paint = Object.fromEntries(performance.getEntriesByType('paint').map((e) => [e.name, Math.round(e.startTime)]));
        const v = document.querySelector('video');
        return { fcp: paint['first-contentful-paint'], video: window.__audit.video, videoState: v && { readyState: v.readyState, paused: v.paused, poster: v.getAttribute('poster'), preload: v.preload }, domDone: Math.round(nav.domContentLoadedEventEnd) };
      });
      const trackSel = '.ticker__track, .marquee__track, [class*="ticker"] [class*="track"]';
      const mq = await p.evaluate(async (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        el.scrollIntoView({ block: 'center' });
        const samples = [];
        const t0 = performance.now();
        for (let i = 0; i < 12; i++) { samples.push([Math.round(performance.now() - t0), getComputedStyle(el).transform]); await new Promise((r) => setTimeout(r, 100)); }
        return { sel: el.className, samples };
      }, trackSel);
      hero.marquee = mq;
      await p.evaluate(() => window.scrollTo(0, 0));
      await wait(400);
    }
    /* scroll at reading speed: 240px a second, in 60ms steps */
    const tot = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let y = 0; y <= tot; y += 15) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(60); }
    await wait(800);
    const a = await p.evaluate(() => ({ flips: window.__audit.flips, shifts: window.__audit.shifts }));
    const counts = {};
    a.flips.forEach((f) => { if (f.to === 'true') { const k = f.el + ' ' + f.attr + ' @' + f.top; counts[f.el + f.attr] = (counts[f.el + f.attr] || 0); } });
    const byEl = {};
    a.flips.forEach((f) => { const k = `${f.el}|${f.attr}`; (byEl[k] = byEl[k] || []).push(f); });
    const late = a.flips.filter((f) => f.to === 'true' && f.attr !== 'data-lit' && f.inViewFor != null && f.inViewFor > 400);
    const early = a.flips.filter((f) => f.to === 'true' && f.attr !== 'data-lit' && f.vis === 0);
    const again = a.flips.filter((f) => f.attr !== 'data-lit' && f.from === 'true' && f.to !== 'true');
    const pops = a.flips.filter((f) => f.to === 'true' && f.attr !== 'data-lit' && /^0s\|(0s)?$/.test(f.trans));
    const shiftSum = a.shifts.reduce((s, x) => s + x.v, 0);
    results.push({ route, w, hero, flips: a.flips, shifts: a.shifts, late, early, again, pops, cls: +shiftSum.toFixed(4) });
    console.log(`\n=== ${route} ${w}: ${a.flips.length} flips, late ${late.length}, early ${early.length}, un-revealed ${again.length}, no transition ${pops.length}, layout shift ${shiftSum.toFixed(4)} over ${a.shifts.length}`);
    for (const f of [...late, ...early, ...again, ...pops].slice(0, 12)) console.log(`   ${f.el} ${f.attr} ${f.from}->${f.to} at scroll ${f.y}, top ${f.top}, vis ${f.vis}, in view ${f.inViewFor}ms, transition ${f.trans}`);
    for (const s of a.shifts.filter((x) => x.v >= 0.001).slice(0, 8)) console.log(`   shift ${s.v} at ${s.t}ms scroll ${s.y}: ${s.src.join('; ')}`);
    if (hero) console.log(`   hero: ${JSON.stringify(hero).slice(0, 600)}`);
    await p.close();
  }
  await b.close();
}

if (MODE === 'continuity') {
  const b = await puppeteer.launch({ headless: 'new', args });
  for (const route of ROUTES) for (const [w, h] of WIDTHS) {
    const p = await open(b, route, w, h);
    await settle(p, h);
    const tot = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    const frames = [];
    for (let y = 0; y <= tot; y += Math.round(h / 4)) {
      await p.evaluate((v) => window.scrollTo(0, v), y);
      await wait(200);
      frames.push(await p.evaluate(() => {
        const bar = document.querySelector('.bar'); const barB = bar ? bar.getBoundingClientRect().bottom : 0;
        let n = 0; const what = new Set();
        const inView = (q) => q.bottom > barB + 8 && q.top < innerHeight - 8 && q.width > 0;
        const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let t = tw.nextNode(); t; t = tw.nextNode()) {
          if (!t.textContent.trim()) continue;
          const el = t.parentElement; if (!el || el.closest('.bar, .skip-h, [aria-hidden="true"]')) continue;
          const c = getComputedStyle(el);
          if (c.visibility === 'hidden' || +c.opacity < 0.3 || parseFloat(c.fontSize) < 16) continue;
          const r = document.createRange(); r.selectNodeContents(t);
          if ([...r.getClientRects()].some(inView)) { n++; what.add((el.className || el.tagName).toString().split(' ')[0]); }
        }
        document.querySelectorAll('img, video, canvas, svg').forEach((el) => {
          if (el.closest('.bar')) return;
          const q = el.getBoundingClientRect(); const c = getComputedStyle(el);
          if (q.width >= 64 && q.height >= 64 && inView(q) && +c.opacity >= 0.3 && c.visibility !== 'hidden') { n++; what.add(el.tagName.toLowerCase()); }
        });
        return { y: Math.round(scrollY), n, what: [...what].slice(0, 4) };
      }));
    }
    const runs = []; let cur = null;
    for (const f of frames) {
      if (f.n === 0) { if (!cur) cur = { from: f.y, to: f.y }; else cur.to = f.y; } else if (cur) { runs.push(cur); cur = null; }
    }
    if (cur) runs.push(cur);
    const long = runs.filter((r) => r.to - r.from + h >= h * 1.0 && r.to > r.from);
    results.push({ route, w, frames, emptyRuns: runs, long });
    console.log(`=== ${route} ${w}: ${frames.length} frames, empty frames ${frames.filter((f) => !f.n).length}, runs ${JSON.stringify(runs)}`);
    await p.close();
  }
  await b.close();
}

if (MODE === 'interact') {
  const b = await puppeteer.launch({ headless: 'new', args });
  const internal = new Map();
  for (const route of ROUTES) {
    /* ---- 1280: hover and press ---- */
    const p = await open(b, route, 1280, 800, {
      before: () => {
        window.addEventListener('click', (e) => { if (!window.__allowClick) { e.preventDefault(); e.stopPropagation(); } }, true);
        window.addEventListener('submit', (e) => { e.preventDefault(); e.stopPropagation(); }, true);
      },
    });
    await settle(p, 800);
    const n = await p.evaluate(() => {
      const els = [...document.querySelectorAll('a[href], button, [role="button"], summary, [role="tab"]')]
        .filter((e) => { const q = e.getBoundingClientRect(); const c = getComputedStyle(e); return q.width > 0 && q.height > 0 && c.visibility !== 'hidden' && !e.closest('[inert]'); });
      els.forEach((e, i) => { e.dataset.auditI = String(i); });
      return els.length;
    });
    const rows = [];
    for (let i = 0; i < n; i++) {
      const sel = `[data-audit-i="${i}"]`;
      const info = await p.evaluate((sel) => {
        const e = document.querySelector(sel); if (!e) return null;
        e.scrollIntoView({ block: 'center' });
        const q = e.getBoundingClientRect();
        return { tag: e.tagName.toLowerCase(), cls: (e.className || '').toString().split(' ')[0], text: (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
          href: e.getAttribute('href'), disabled: e.disabled || e.getAttribute('aria-disabled') === 'true', x: q.left + q.width / 2, y: q.top + q.height / 2, w: q.width, h: q.height };
      }, sel);
      if (!info) continue;
      await wait(120);
      const snap = () => p.evaluate((sel) => {
        const e = document.querySelector(sel); if (!e) return null;
        const pick = (el) => { const c = getComputedStyle(el); return [c.opacity, c.transform, c.color, c.backgroundColor, c.textDecorationLine, c.borderColor, c.boxShadow, c.filter, c.backgroundImage.slice(0, 30)].join('~'); };
        const kids = [...e.querySelectorAll('*')].slice(0, 12).map(pick).join('#');
        const after = getComputedStyle(e, '::after'); const before = getComputedStyle(e, '::before');
        return { self: pick(e), kids, pseudo: [after.opacity, after.transform, after.backgroundColor, before.opacity, before.transform].join('~'),
          dur: Math.max(...getComputedStyle(e).transitionDuration.split(',').map((s) => parseFloat(s) * (s.includes('ms') ? 1 : 1000))) };
      }, sel);
      const rest = await snap();
      await p.mouse.move(info.x, info.y);
      await wait(60);
      const early = await snap();
      await wait(340);
      const hov = await snap();
      await p.mouse.down();
      await wait(200);
      const press = await p.evaluate((sel) => getComputedStyle(document.querySelector(sel)).transform, sel);
      await p.mouse.up();
      await p.mouse.move(2, 2);
      await wait(250);
      const changed = hov && rest && (hov.self !== rest.self || hov.kids !== rest.kids || hov.pseudo !== rest.pseudo);
      const late = changed && early && early.self === rest.self && early.kids === rest.kids && early.pseudo === rest.pseudo && rest.dur > 300;
      const m = press && press.match(/matrix\(([^,]+)/);
      const scale = m ? +(+m[1]).toFixed(3) : 1;
      rows.push({ ...info, hover: changed ? 'responds' : 'NO HOVER', late: !!late, dur: rest && rest.dur, press: scale });
      if (info.href && info.href.startsWith('/') ) internal.set(info.href.split('#')[0] || '/', (internal.get(info.href.split('#')[0]) || new Set()).add(route));
      if (info.href && info.href.startsWith('#')) {
        const ok = await p.evaluate((id) => !!document.getElementById(id), info.href.slice(1));
        if (!ok) rows[rows.length - 1].brokenHash = true;
      }
    }
    /* ---- 390: tap, then read what stays applied ---- */
    const t = await open(b, route, 390, 844, {
      touch: true,
      before: () => {
        window.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); }, true);
      },
    });
    await settle(t, 844);
    const tn = await t.evaluate(() => {
      const els = [...document.querySelectorAll('a[href], button, [role="button"], summary, [role="tab"]')]
        .filter((e) => { const q = e.getBoundingClientRect(); const c = getComputedStyle(e); return q.width > 0 && q.height > 0 && c.visibility !== 'hidden'; });
      els.forEach((e, i) => { e.dataset.auditI = String(i); });
      return els.length;
    });
    const sticky = [];
    for (let i = 0; i < tn; i++) {
      const sel = `[data-audit-i="${i}"]`;
      const pos = await t.evaluate((sel) => { const e = document.querySelector(sel); e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2, text: (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40), cls: (e.className || '').toString().split(' ')[0], w: q.width, h: q.height }; }, sel);
      if (pos.y < 0 || pos.y > 844) continue;
      await wait(100);
      const pick = () => t.evaluate((sel) => { const e = document.querySelector(sel); const c = getComputedStyle(e); return [c.opacity, c.transform, c.color, c.backgroundColor, c.textDecorationLine].join('~'); }, sel);
      const before = await pick();
      await t.touchscreen.tap(pos.x, pos.y);
      await wait(450);
      await t.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur());
      await wait(150);
      const after = await pick();
      /* A LEAVE IN FLIGHT IS NOT A STICKY STATE. The home cards return over
         400ms, and read 450ms after the tap they were still a colour step or
         two from rest: 30,31,34 against 31,32,34, reported as sticky. Channels
         within 3 of each other are the same state; anything a reader could see
         is further than that. */
      const near3 = (a, c) => {
        const na = (a.match(/[\d.]+/g) || []).map(Number);
        const nc = (c.match(/[\d.]+/g) || []).map(Number);
        if (na.length !== nc.length) return false;
        return na.every((v, i) => Math.abs(v - nc[i]) <= 3);
      };
      if (after !== before && !near3(before, after)) sticky.push({ ...pos, before, after });
      if (pos.w < 44 || pos.h < 44) sticky.push({ ...pos, small: true });
    }
    await t.close();
    results.push({ route, rows, sticky });
    const dead = rows.filter((r) => r.hover === 'NO HOVER' && !r.disabled);
    const nopress = rows.filter((r) => r.press === 1 && !r.disabled);
    console.log(`\n=== ${route}: ${rows.length} controls at 1280; no hover ${dead.length}; no press ${nopress.length}; late ${rows.filter((r) => r.late).length}; broken #hash ${rows.filter((r) => r.brokenHash).length}; 390 sticky ${sticky.filter((s) => !s.small).length}; under 44px ${sticky.filter((s) => s.small).length}`);
    for (const r of dead.slice(0, 20)) console.log(`   no hover: ${r.tag}.${r.cls} "${r.text}" ${r.href || ''}`);
    for (const r of nopress.slice(0, 20)) console.log(`   no press: ${r.tag}.${r.cls} "${r.text}" ${r.href || ''}`);
    for (const r of rows.filter((x) => x.late)) console.log(`   late: ${r.tag}.${r.cls} "${r.text}" ${r.dur}ms`);
    for (const s of sticky.slice(0, 20)) console.log(`   390 ${s.small ? `small ${Math.round(s.w)}x${Math.round(s.h)}` : 'sticky'}: ${s.cls} "${s.text}"${s.small ? '' : ` ${s.before} -> ${s.after}`}`);
    await p.close();
  }
  /* every internal href, resolved */
  const lp = await b.newPage();
  await lp.setViewport({ width: 1280, height: 800 });
  const links = [];
  for (const [href, from] of internal) {
    await lp.goto(BASE + href, { waitUntil: 'networkidle0' });
    const r = await lp.evaluate(() => ({ url: location.pathname + location.hash, h1: (document.querySelector('h1') || {}).textContent || '', nf: /isn't here/.test((document.querySelector('h1') || {}).textContent || '') }));
    links.push({ href, from: [...from], ...r });
    console.log(`   link ${href.padEnd(22)} -> ${r.url.padEnd(24)} ${r.nf ? 'NOT FOUND' : 'ok'}  "${r.h1.trim().slice(0, 40)}"  from ${[...from].join(' ')}`);
  }
  results.push({ links });
  await b.close();
}

fs.writeFileSync(`${OUT}/${MODE}.json`, JSON.stringify(results, null, 1));
console.log(`\nwrote ${OUT}/${MODE}.json`);

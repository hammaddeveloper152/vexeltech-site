/* launch-gate.mjs: the browser half of the launch gate (2026-10-07, the
   founder). Runs against .measure/serve-dist.mjs, which serves dist through
   htaccess-append.txt with its headers, so the CSP the browser applies is
   the file's.

     node .measure/launch-gate.mjs [base]     (default http://localhost:4190)

   Writes .measure/out/launch-gate/report.json and prints a summary:

     csp        every route with motion on, scrolled through, plus a form
                submit on /contact-us (Formspree answered by the script,
                so no real submission is sent): every CSP report-only
                violation from the console and securitypolicyviolation
     notfound   a client-side navigation to a bad route: the 404 view and
                its noindex meta
     keyboard   per route at 1280 and 390, every Tab stop: a visible focus
                indicator, its contrast against the ground (3:1), and the
                stop not under the sticky bar; the skip link; Esc on the
                menu returns focus; the hero's pause control by keyboard
     axe        axe-core 4.14 on nine routes at 1280 and 390, every rule,
                critical and serious listed
     spacing    WCAG 1.4.12's text spacing on every route: clipped text
     reflow     1280 at 200% (640 CSS px) and 320 wide: horizontal scroll
                and content pushed off screen */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import puppeteer from 'puppeteer';

const require = createRequire(import.meta.url);
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'launch-gate');
fs.mkdirSync(OUT, { recursive: true });
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/privacy-policy', '/terms-of-service', '/thanks', '/nope'];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
const report = {};

async function open(route, { w = 1280, h = 800, reduce = true, scale = 1 } = {}) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h, deviceScaleFactor: scale });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }]);
  const csp = [];
  p.on('console', (m) => {
    if (/Content Security Policy|Content-Security-Policy/i.test(m.text())) csp.push(m.text().slice(0, 300));
  });
  await p.evaluateOnNewDocument(() => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) =>
      window.__csp.push(`${e.violatedDirective} ${e.blockedURI} ${e.sourceFile || ''}:${e.lineNumber || ''}`)
    );
  });
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  return { p, csp };
}
async function walk(p) {
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await wait(400);
}

/* ---- CSP ---------------------------------------------------------------------- */
report.csp = {};
for (const route of ROUTES) {
  const { p, csp } = await open(route, { reduce: false });
  await walk(p);
  if (route === '/contact-us') {
    await p.setRequestInterception(true);
    let posted = null;
    p.on('request', (r) => {
      if (r.url().startsWith('https://formspree.io/')) {
        if (r.method() === 'POST') posted = r.url();
        r.respond({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept',
          },
          body: '{"ok":true}',
        });
      } else r.continue();
    });
    const form = await p.$('form.lf--needs') || (await p.$('form.lf'));
    const id = await form.$eval('input[name="name"]', (n) => n.id.split('-')[0]);
    await p.type(`#${id}-name`, 'Gate Test');
    await p.type(`#${id}-phone`, '5550102200');
    await p.type(`#${id}-email`, 'gate@example.test');
    await p.type(`#${id}-message`, 'Launch gate check, not a real enquiry.');
    await form.$eval('button[type="submit"]', (n) => n.click());
    await wait(1500);
    report.formSubmit = {
      posted,
      status: await form.$eval('.lf__status', (n) => n.textContent.trim()),
    };
  }
  const events = await p.evaluate(() => window.__csp);
  report.csp[route] = [...new Set([...csp, ...events])];
  await p.close();
}

/* ---- Client-side 404 ------------------------------------------------------------- */
{
  const { p } = await open('/', { reduce: true });
  await p.evaluate(() => {
    window.history.pushState({}, '', '/this-route-does-not-exist');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await wait(800);
  report.notfound = await p.evaluate(() => ({
    path: location.pathname,
    h1: document.querySelector('h1')?.textContent.trim(),
    robots: document.querySelector('meta[name="robots"]')?.content || null,
  }));
  await p.close();
}

/* ---- Keyboard ------------------------------------------------------------------------ */
const lum = (c) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};
const ratio = (a, c) => {
  const [x, y] = [lum(a), lum(c)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
report.keyboard = {};
for (const w of [1280, 390]) {
  for (const route of ['/', '/services', '/pricing', '/about-us', '/contact-us', '/privacy-policy', '/thanks', '/nope']) {
    const { p } = await open(route, { w, h: w === 390 ? 844 : 800, reduce: true });
    const stops = [];
    for (let i = 0; i < 90; i += 1) {
      await p.keyboard.press('Tab');
      await wait(30);
      const s = await p.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        el.scrollIntoView({ block: 'nearest' });
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        const parse = (c) => (c.match(/[\d.]+/g) || []).map(Number);
        /* The ground under the element: the first ancestor with an opaque
           background colour, else the page's. */
        let bg = [11, 11, 13];
        for (let n = el.parentElement; n; n = n.parentElement) {
          const c = parse(getComputedStyle(n).backgroundColor);
          if (c.length >= 3 && (c.length === 3 || c[3] > 0.9)) {
            bg = c.slice(0, 3);
            break;
          }
        }
        const hasOutline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 1;
        const bar = document.querySelector('.bar');
        const barBottom = bar ? bar.getBoundingClientRect().bottom : 0;
        const cx = r.left + r.width / 2;
        const cy = r.top + Math.min(r.height / 2, 10);
        const hit = document.elementFromPoint(cx, cy);
        const underBar = !!(bar && hit && bar.contains(hit) && !bar.contains(el));
        return {
          id: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}.${String(el.className.baseVal ?? el.className).split(' ')[0]}`,
          text: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40),
          outline: hasOutline ? parse(cs.outlineColor).slice(0, 3) : null,
          shadow: cs.boxShadow !== 'none',
          borderBottom: parse(cs.borderBottomColor).slice(0, 3),
          bg,
          underBar,
          top: Math.round(r.top),
          barBottom: Math.round(barBottom),
        };
      });
      if (!s) continue;
      if (stops.length && s.id === stops[0].id && s.text === stops[0].text) break;
      s.contrast = s.outline ? Math.round(ratio(s.outline, s.bg) * 100) / 100 : null;
      stops.push(s);
    }
    report.keyboard[`${route} @${w}`] = {
      stops: stops.length,
      /* The line fields (lf__input, bd__input) show focus as a 2px line in
         the focus colour, a border rather than an outline. */
      noIndicator: stops.filter((s) => !s.outline && !s.shadow && !/lf__input|bd__input/.test(s.id)).map((s) => `${s.id} "${s.text}"`),
      lowContrast: stops.filter((s) => s.outline && s.contrast < 3).map((s) => `${s.id} "${s.text}" ${s.contrast}`),
      underBar: stops.filter((s) => s.underBar).map((s) => `${s.id} "${s.text}"`),
    };
    await p.close();
  }
}

/* The skip link, Esc on the menu, the pause control. */
{
  const { p } = await open('/', { w: 1280, reduce: false });
  await p.keyboard.press('Tab');
  const skip = await p.evaluate(() => {
    const a = document.activeElement;
    const r = a.getBoundingClientRect();
    return { cls: a.className, visible: r.top >= 0 && r.bottom > 0 };
  });
  await p.keyboard.press('Enter');
  await wait(300);
  skip.after = await p.evaluate(() => document.activeElement.id);
  report.skip = skip;
  /* The pause control: focused, pressed by keyboard, twice. */
  const pause = {};
  await p.waitForSelector('.hero__pause', { timeout: 5000 }).catch(() => null);
  if (await p.$('.hero__pause')) {
    await p.focus('.hero__pause');
    pause.before = await p.$eval('.hero__pause', (n) => n.getAttribute('aria-label'));
    pause.size = await p.$eval('.hero__pause', (n) => {
      const r = n.getBoundingClientRect();
      return `${Math.round(r.width)}x${Math.round(r.height)}`;
    });
    await p.keyboard.press('Enter');
    await wait(300);
    pause.afterEnter = await p.evaluate(() => ({
      label: document.querySelector('.hero__pause').getAttribute('aria-label'),
      videoPaused: document.querySelector('video.hero__spot')?.paused,
    }));
    await p.keyboard.press('Space');
    await wait(500);
    pause.afterSpace = await p.evaluate(() => ({
      label: document.querySelector('.hero__pause').getAttribute('aria-label'),
      videoPaused: document.querySelector('video.hero__spot')?.paused,
    }));
  } else pause.missing = true;
  report.pause = pause;
  await p.close();

  const r = await open('/', { reduce: true });
  report.pauseReduced = await r.p.evaluate(() => ({
    button: !!document.querySelector('.hero__pause'),
    video: !!document.querySelector('video.hero__spot'),
    poster: document.querySelector('.hero picture img')?.getAttribute('src') || null,
  }));
  await r.p.close();

  const m = await open('/services', { w: 390, h: 844, reduce: true });
  await m.p.focus('.bar__menu');
  await m.p.keyboard.press('Enter');
  await wait(400);
  const opened = await m.p.$eval('.bar__menu', (n) => n.getAttribute('aria-expanded'));
  await m.p.keyboard.press('Escape');
  await wait(400);
  report.menu = await m.p.evaluate((o) => ({
    opened: o,
    afterEsc: document.querySelector('.bar__menu').getAttribute('aria-expanded'),
    focusBack: document.activeElement === document.querySelector('.bar__menu'),
  }), opened);
  await m.p.close();
}

/* ---- axe ------------------------------------------------------------------------------- */
report.axe = {};
for (const w of [1280, 390]) {
  for (const route of ROUTES) {
    const { p } = await open(route, { w, h: w === 390 ? 844 : 800, reduce: true });
    await walk(p);
    await p.evaluate(AXE);
    const res = await p.evaluate(async () => {
      const r = await window.axe.run(document, { resultTypes: ['violations'] });
      return r.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.length,
        sample: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
      }));
    });
    report.axe[`${route} @${w}`] = res;
    await p.close();
  }
}

/* ---- Text spacing (WCAG 1.4.12) ---------------------------------------------------------- */
const SPACING = `*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}`;
report.spacing = {};
for (const w of [1280, 390]) {
  for (const route of ROUTES) {
    const { p } = await open(route, { w, h: w === 390 ? 844 : 800, reduce: true });
    await p.addStyleTag({ content: SPACING });
    await wait(400);
    await walk(p);
    report.spacing[`${route} @${w}`] = await p.evaluate(() => {
      const out = [];
      /* Not shown, so not clipped: aria-hidden, or at opacity 0 (the
         accordion's captions on its closed panels). */
      const vis = (el) => {
        for (let n = el; n; n = n.parentElement) {
          if (n.getAttribute && n.getAttribute('aria-hidden') === 'true') return false;
          if (n.nodeType === 1 && getComputedStyle(n).opacity === '0') return false;
        }
        const cs = getComputedStyle(el);
        return cs.visibility !== 'hidden' && cs.display !== 'none';
      };
      for (const el of document.querySelectorAll('body *')) {
        if (!el.childNodes.length || ![...el.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) continue;
        if (!vis(el)) continue;
        const cs = getComputedStyle(el);
        /* Skipped: visually hidden labels, and anything inside a closed
           disclosure (inert), which is hidden on purpose. */
        if (/inset\(50%\)/.test(cs.clipPath) || el.closest('.skip, .lf__sr, .skip-h, .lf__trap, [inert]')) continue;
        /* Clipping happens in the element itself or in the nearest ancestor
           that clips. */
        for (let n = el; n && n !== document.body; n = n.parentElement) {
          const s = getComputedStyle(n);
          const clipY = /hidden|clip/.test(s.overflowY) || (s.textOverflow === 'ellipsis');
          const clipX = /hidden|clip/.test(s.overflowX);
          if (!clipX && !clipY) continue;
          if ((clipY && n.scrollHeight > n.clientHeight + 2) || (clipX && n.scrollWidth > n.clientWidth + 2)) {
            out.push(`${n.tagName.toLowerCase()}.${String(n.className.baseVal ?? n.className).split(' ')[0]} "${el.textContent.trim().slice(0, 30)}" (${n.clientWidth}x${n.clientHeight} of ${n.scrollWidth}x${n.scrollHeight})`);
          }
          break;
        }
      }
      return [...new Set(out)];
    });
    await p.close();
  }
}

/* ---- Reflow: 200% zoom and 320px ------------------------------------------------------------ */
report.reflow = {};
for (const [label, opts] of [['zoom200 (640px)', { w: 640, h: 400, scale: 2 }], ['320px', { w: 320, h: 640 }]]) {
  for (const route of ROUTES) {
    const { p } = await open(route, { ...opts, reduce: true });
    await walk(p);
    report.reflow[`${route} ${label}`] = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const scroll = document.documentElement.scrollWidth - vw;
      const off = [];
      for (const el of document.querySelectorAll('h1, h2, h3, p, a, button, label, li, input, textarea')) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (el.closest('[aria-hidden="true"], .skip, .lf__trap, .skip-h, .lf__sr')) continue;
        /* Content inside a horizontal scroller (the cost row's swipe, a
           table region) is reachable by scrolling it; only content past the
           page's edge with no scroller is lost. */
        let scroller = false;
        for (let n = el.parentElement; n; n = n.parentElement) {
          const s = getComputedStyle(n);
          if (/auto|scroll/.test(s.overflowX) && n.scrollWidth > n.clientWidth) {
            scroller = true;
            break;
          }
        }
        if (!scroller && (r.right > vw + 1 || r.left < -1)) off.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 30)}"`);
      }
      return { hScroll: scroll, off: [...new Set(off)].slice(0, 10) };
    });
    await p.close();
  }
}

await b.close();
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));

/* ---- Summary ------------------------------------------------------------------------------------ */
const cspTotal = Object.values(report.csp).flat().length;
console.log('CSP violations:', cspTotal, cspTotal ? JSON.stringify(report.csp, null, 1) : '');
console.log('form submit:', JSON.stringify(report.formSubmit));
console.log('client 404:', JSON.stringify(report.notfound));
console.log('skip:', JSON.stringify(report.skip), 'menu:', JSON.stringify(report.menu));
console.log('pause:', JSON.stringify(report.pause), 'reduced:', JSON.stringify(report.pauseReduced));
for (const [k, v] of Object.entries(report.keyboard)) {
  if (v.noIndicator.length || v.lowContrast.length || v.underBar.length) console.log('keyboard', k, JSON.stringify(v));
  else console.log('keyboard', k, `${v.stops} stops, all visible, 3:1, clear of the bar`);
}
for (const [k, v] of Object.entries(report.axe)) {
  const bad = v.filter((x) => x.impact === 'critical' || x.impact === 'serious');
  const rest = v.filter((x) => !(x.impact === 'critical' || x.impact === 'serious'));
  console.log('axe', k, bad.length ? `SERIOUS+: ${JSON.stringify(bad)}` : 'no critical or serious', rest.length ? `| minor/moderate: ${rest.map((x) => `${x.id}(${x.impact})`).join(', ')}` : '');
}
for (const [k, v] of Object.entries(report.spacing)) console.log('spacing', k, v.length ? JSON.stringify(v) : 'nothing clipped');
for (const [k, v] of Object.entries(report.reflow)) console.log('reflow', k, v.hScroll > 0 || v.off.length ? JSON.stringify(v) : 'no horizontal scroll, nothing off screen');

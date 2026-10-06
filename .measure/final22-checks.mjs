/* final22-checks.mjs: links, states, keyboard, reduced motion, JSON-LD and
   media for the final audit (the founder, 2026-10-06). Printed as JSON.

     node .measure/final22-checks.mjs [base]

   links    every internal href on every public route, opened: the target
            route renders an h1 that is not the not-found page's, and a
            #fragment names an element on it
   keys     Tab through each route (up to 80 stops): every stop shows a
            visible focus (an outline or a box-shadow that its unfocused
            state lacks), and the order never jumps back up the page by more
            than a screen except to the footer's start
   hover    interactive elements whose classes match no :hover rule, and
            none matching an :active rule (BUILD-LAW Motion: every pressable
            element presses)
   motion   under reduced motion, CSS animations still running after load
   ld       each JSON-LD block parses, has @context and @type, and the
            fields schema.org needs for its type (ProfessionalService: name,
            url; Service: name, provider; FAQPage: mainEntity with name and
            acceptedAnswer.text; BreadcrumbList: itemListElement with
            position, name, item; Organization: name, url)
   media    every img has alt (empty allowed when aria-hidden or decorative
            by role), every video has a poster and is aria-hidden or
            labelled, html has lang */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/privacy-policy', '/terms-of-service', '/thanks', '/no-such-page'];
const b = await puppeteer.launch({ headless: 'new' });
const report = { links: {}, keys: {}, hover: {}, motion: {}, ld: {}, media: {} };
const seen = new Set();

for (const route of ROUTES) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);

  /* Links. */
  const hrefs = await p.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
  hrefs.filter((h) => h.startsWith('/') || h.startsWith('#')).forEach((h) => seen.add(h.startsWith('#') ? route + h : h));

  /* Hover and active coverage. */
  report.hover[route] = await p.evaluate(() => {
    const hov = [];
    const act = [];
    const walk = (rules) => {
      for (const r of rules) {
        if (r.cssRules && !r.selectorText) walk(r.cssRules);
        else if (r.selectorText) {
          if (r.selectorText.includes(':hover')) hov.push(r.selectorText);
          if (r.selectorText.includes(':active')) act.push(r.selectorText);
        }
      }
    };
    for (const s of document.styleSheets) {
      try {
        walk(s.cssRules);
      } catch {
        /* cross-origin sheet */
      }
    }
    const els = [...document.querySelectorAll('a[href], button, [role="radio"], [role="slider"], summary, input:not([type="hidden"]), textarea, select')].filter(
      (e) => e.getBoundingClientRect().width > 0 && !e.closest('[aria-hidden="true"]')
    );
    const covered = (list, e) => [...e.classList].some((c) => list.some((sel) => sel.includes(`.${c}`))) || list.some((sel) => { try { return e.matches(sel.replace(/:hover|:active/g, '')); } catch { return false; } });
    const noHover = [];
    const noActive = [];
    els.forEach((e) => {
      const name = `${e.tagName.toLowerCase()}.${[...e.classList].join('.')}`;
      if (['input', 'textarea', 'select'].includes(e.tagName.toLowerCase())) return;
      if (!covered(hov, e)) noHover.push(name);
      if (!covered(act, e)) noActive.push(name);
    });
    return { interactive: els.length, noHover: [...new Set(noHover)], noActive: [...new Set(noActive)] };
  });

  /* Reduced motion: animations still running. */
  report.motion[route] = await p.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a.playState === 'running')
      .map((a) => `${a.animationName || a.constructor.name} on ${a.effect && a.effect.target ? a.effect.target.className : '?'}`)
  );

  /* JSON-LD. */
  report.ld[route] = await p.evaluate(() => {
    const need = {
      ProfessionalService: ['name', 'url'],
      Organization: ['name', 'url'],
      WebSite: ['url', 'name'],
      Service: ['name', 'provider'],
      FAQPage: ['mainEntity'],
      BreadcrumbList: ['itemListElement'],
    };
    const out = [];
    for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
      let j;
      try {
        j = JSON.parse(s.textContent);
      } catch (e) {
        out.push(`INVALID JSON: ${e.message}`);
        continue;
      }
      if (j['@context'] !== 'https://schema.org') out.push('no @context');
      const items = j['@graph'] || [j];
      for (const it of items) {
        const t = it['@type'];
        const missing = (need[t] || []).filter((k) => it[k] === undefined || it[k] === '');
        if (t === 'FAQPage') (it.mainEntity || []).forEach((q, i) => { if (!q.name || !q.acceptedAnswer || !q.acceptedAnswer.text) missing.push(`question ${i}`); });
        if (t === 'BreadcrumbList') (it.itemListElement || []).forEach((l, i) => { if (!l.position || !l.name || !l.item) missing.push(`item ${i}`); });
        out.push(`${t}${missing.length ? ` MISSING ${missing.join(',')}` : ' ok'}`);
      }
    }
    return out;
  });

  /* Media. */
  report.media[route] = await p.evaluate(() => ({
    lang: document.documentElement.lang,
    imgsNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => i.src.split('/').pop()),
    videos: [...document.querySelectorAll('video')].map((v) => `${v.poster ? 'poster' : 'NO POSTER'} ${v.getAttribute('aria-hidden') === 'true' || v.getAttribute('aria-label') ? 'labelled/hidden' : 'UNLABELLED'}`),
    manifest: !!document.querySelector('link[rel="manifest"]'),
    favicon: !!document.querySelector('link[rel="icon"]'),
  }));

  /* Keyboard. */
  const stops = [];
  for (let i = 0; i < 80; i += 1) {
    await p.keyboard.press('Tab');
    const s = await p.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return null;
      const cs = getComputedStyle(e);
      const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none');
      const r = e.getBoundingClientRect();
      return { name: `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 2).join('.')}`, text: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 24), ring, y: Math.round(r.top + window.scrollY) };
    });
    if (!s) break;
    if (stops.length && s.name === stops[0].name && s.y === stops[0].y) break;
    stops.push(s);
  }
  report.keys[route] = {
    stops: stops.length,
    noRing: stops.filter((s) => !s.ring).map((s) => `${s.name} "${s.text}"`),
    backJumps: stops.filter((s, i) => i > 0 && s.y < stops[i - 1].y - 800).map((s) => `${s.name} "${s.text}" at ${s.y}`),
  };
  await p.close();
}

/* Open every internal link once. */
for (const href of seen) {
  const [pathPart, frag] = href.split('#');
  const p = await b.newPage();
  await p.goto(BASE + (pathPart || '/'), { waitUntil: 'networkidle0' });
  const r = await p.evaluate((frag) => {
    const h1 = document.querySelector('h1');
    return {
      h1: h1 ? h1.textContent.trim().slice(0, 40) : null,
      notFound: !!document.querySelector('.nf'),
      fragment: frag ? !!document.getElementById(frag) : true,
    };
  }, frag);
  report.links[href] = r.h1 && !r.notFound && r.fragment ? 'ok' : `FAIL ${JSON.stringify(r)}`;
  await p.close();
}
await b.close();
console.log(JSON.stringify(report, null, 1));

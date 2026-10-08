/* interact-audit.mjs: the interaction polish audit (final35, 2026-10-08,
   the founder). Every interactive control on every route, read for:
     size      the hit target is 48px or more each way (BUILD-LAW Touch;
               the founder's brief asks 44) (inline links in a
               sentence are listed apart: WCAG 2.5.8 exempts them)
     overlap   no two targets' boxes overlap (nested ones excepted)
     cursor    pointer on every link, button and summary; no pointer on
               anything that is not interactive
     state     every disclosure button carries aria-expanded, and Enter and
               Space both toggle it (1280 only)
     focus     every Tab stop shows an outline, a shadow or a line field's
               border, 3:1 or better against the ground under it
     hover     at 1280 with a fine pointer: the hovered control does not
               move or resize, no other element changes its decoration or
               box, the hover underline (if any) is the token's offset and
               thickness, and no anchor carries a glyph in ::before/::after
               that its underline would run under

     buttons   THE BUTTON LAW (FINAL40, addendum 3, the founder): with
               motion allowed at 1280, every button the law names rises
               2px and changes its fill on hover, and presses to 0.97;
               the submit before its form is valid does neither and shows
               the default cursor. These moves are expected, not
               departures (the move check above runs under reduced motion,
               where the law moves nothing).

     node .measure/interact-audit.mjs [base] [tag]   (default 4190, now)
   Writes .measure/out/final35/interact-<tag>.json and prints every
   departure; exits 1 when there is one. */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const TAG = process.argv[3] || 'now';
const OUT = path.join('.measure', 'out', 'final35');
fs.mkdirSync(OUT, { recursive: true });
const ROUTES = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/privacy-policy', '/terms-of-service', '/thanks', '/nope'];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
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

const MIN = 48; // BUILD-LAW Touch (the brief asks 44; the law is 48)
const SEL = 'a[href], button, input:not([type=hidden]), textarea, select, summary, [role=button], [tabindex]:not([tabindex="-1"])';

/* In the page: name an element, find its ground. */
const HELPERS = `
  window.__name = (el) => {
    const cls = String(el.className.baseVal ?? el.className).trim().split(/\\s+/)[0];
    const t = (el.getAttribute('aria-label') || el.textContent || el.placeholder || '').trim().replace(/\\s+/g, ' ').slice(0, 32);
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '') + (t ? ' "' + t + '"' : '');
  };
  window.__parse = (c) => (c.match(/[\\d.]+/g) || []).map(Number);
  window.__ground = (el) => {
    for (let n = el.parentElement; n; n = n.parentElement) {
      const c = __parse(getComputedStyle(n).backgroundColor);
      if (c.length >= 3 && (c.length === 3 || c[3] > 0.9)) return c.slice(0, 3);
    }
    return __parse(getComputedStyle(document.body).backgroundColor).slice(0, 3);
  };
  window.__visible = (e) => {
    const r = e.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    for (let n = e; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    }
    return !e.closest('[aria-hidden="true"], [inert]');
  };
`;

const b = await puppeteer.launch({ headless: 'new' });
const report = {};
const departures = [];
const dep = (route, w, kind, what) => departures.push({ route, w, kind, what });

for (const w of [1280, 390]) {
  for (const route of ROUTES) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
    await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await p.goto(BASE + route, { waitUntil: 'networkidle0' });
    await p.evaluate(HELPERS);
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 25));
      }
      window.scrollTo(0, 0);
    });

    /* size, overlap, cursor */
    const stat = await p.evaluate((SEL, MIN) => {
      const out = { small: [], inline: [], overlap: [], noPointer: [], strayPointer: [], glyph: [] };
      const els = [...document.querySelectorAll(SEL)].filter(__visible);
      const boxes = els.map((e) => {
        const r = e.getBoundingClientRect();
        return { e, x: r.left, y: r.top + scrollY, w: r.width, h: r.height };
      });
      for (const { e, w: bw, h: bh } of boxes) {
        if (e.matches('.skip, .lf__trap *')) continue;
        /* A target widened by an absolute ::before or ::after (the bar's
           controls) is measured at the pseudo's size. */
        let w = bw;
        let h = bh;
        for (const ps of ['::before', '::after']) {
          const c = getComputedStyle(e, ps);
          if (c.content !== 'none' && c.position === 'absolute') {
            w = Math.max(w, parseFloat(c.width) || 0);
            h = Math.max(h, parseFloat(c.height) || 0);
          }
        }
        if (w < MIN || h < MIN) {
          /* An inline link inside running text is exempt (WCAG 2.5.8). */
          const inText = e.tagName === 'A' && getComputedStyle(e).display === 'inline' && e.parentElement && e.parentElement.textContent.trim().length > e.textContent.trim().length + 8;
          (inText ? out.inline : out.small).push(`${__name(e)} ${Math.round(w)}x${Math.round(h)}`);
        }
        const cur = getComputedStyle(e).cursor;
        /* A scroll region made focusable for the keyboard is not a
           control: no pointer is right for it. */
        if (!e.matches('a, button, summary, input, textarea, select, [role=button]')) continue;
        const textual = e.matches('input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]), textarea, select');
        if (!textual && cur !== 'pointer' && !e.disabled && e.getAttribute('aria-disabled') !== 'true') out.noPointer.push(`${__name(e)} cursor:${cur}`);
        if (e.tagName === 'A') {
          for (const ps of ['::before', '::after']) {
            const c = getComputedStyle(e, ps).content;
            if (c && c !== 'none' && c !== 'normal' && c.replace(/["']/g, '').trim()) out.glyph.push(`${__name(e)} ${ps} ${c}`);
          }
        }
      }
      for (let i = 0; i < boxes.length; i += 1) {
        for (let j = i + 1; j < boxes.length; j += 1) {
          const a = boxes[i];
          const c = boxes[j];
          if (a.e.contains(c.e) || c.e.contains(a.e)) continue;
          const ox = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x);
          const oy = Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y);
          if (ox > 1 && oy > 1) out.overlap.push(`${__name(a.e)} x ${__name(c.e)} ${Math.round(ox)}x${Math.round(oy)}`);
        }
      }
      const inter = 'a[href], button, input, textarea, select, summary, label, [role=button], [tabindex], [onclick]';
      for (const e of document.querySelectorAll('body *')) {
        if (getComputedStyle(e).cursor !== 'pointer' || !__visible(e)) continue;
        if (e.closest(inter)) continue;
        if (e.parentElement && getComputedStyle(e.parentElement).cursor === 'pointer') continue;
        out.strayPointer.push(__name(e));
      }
      return out;
    }, SEL, MIN);
    for (const x of stat.small) dep(route, w, 'target under 44px', x);
    for (const x of stat.overlap) dep(route, w, 'targets overlap', x);
    for (const x of stat.noPointer) dep(route, w, 'no pointer cursor', x);
    for (const x of stat.strayPointer) dep(route, w, 'pointer on a non-interactive element', x);
    for (const x of stat.glyph) dep(route, w, 'glyph inside an anchor', x);

    /* focus: Tab through the page */
    const stops = [];
    for (let i = 0; i < 120; i += 1) {
      await p.keyboard.press('Tab');
      await wait(20);
      const s = await p.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        el.scrollIntoView({ block: 'nearest' });
        const cs = getComputedStyle(el);
        const bg = __ground(el);
        const outline = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 1 ? __parse(cs.outlineColor).slice(0, 3) : null;
        const line = /lf__input|bd__input/.test(el.className) ? __parse(cs.borderBottomColor).slice(0, 3) : null;
        return { id: __name(el), outline, line, shadow: cs.boxShadow !== 'none', bg };
      });
      if (!s) continue;
      if (stops.length && s.id === stops[0].id) break;
      const ink = s.outline || s.line;
      s.contrast = ink ? Math.round(ratio(ink, s.bg) * 100) / 100 : null;
      stops.push(s);
      if (!ink && !s.shadow) dep(route, w, 'no focus indicator', s.id);
      else if (ink && s.contrast < 3) dep(route, w, 'focus ring under 3:1', `${s.id} ${s.contrast}:1 on rgb(${s.bg})`);
    }

    /* state and hover, at 1280 */
    let disc = [];
    let hovers = [];
    if (w === 1280) {
      disc = await p.evaluate(() =>
        [...document.querySelectorAll('button[aria-controls], button[aria-expanded], summary, .faq__btn, .dt__btn, [data-disclosure]')]
          .filter(__visible)
          .map((e, i) => {
            e.setAttribute('data-ia', `d${i}`);
            return { k: `d${i}`, id: __name(e), tag: e.tagName, exp: e.getAttribute('aria-expanded') };
          })
      );
      for (const d of disc) {
        if (d.tag === 'SUMMARY') continue;
        if (d.exp === null) {
          dep(route, w, 'disclosure without aria-expanded', d.id);
          continue;
        }
        for (const key of ['Enter', 'Space']) {
          const before = await p.$eval(`[data-ia="${d.k}"]`, (e) => e.getAttribute('aria-expanded'));
          await p.focus(`[data-ia="${d.k}"]`);
          await p.keyboard.press(key);
          await wait(80);
          const after = await p.$eval(`[data-ia="${d.k}"]`, (e) => e.getAttribute('aria-expanded'));
          if (after === before) dep(route, w, `disclosure does not toggle on ${key}`, d.id);
        }
      }
      /* The Recent work accordion: each panel's link says whether it is
         open; focus opens it and Space keeps it open (Enter follows the
         link). */
      const wa = await p.$$eval('.wa__link', (ls) => ls.map((l) => l.getAttribute('aria-expanded')));
      for (let i = 0; i < wa.length; i += 1) {
        if (wa[i] === null) {
          dep(route, w, 'accordion panel without aria-expanded', `wa__link #${i + 1}`);
          continue;
        }
        const h = await p.$$('.wa__link');
        await h[i].focus();
        await p.keyboard.press('Space');
        await wait(80);
        const st = await p.$$eval('.wa__link', (ls, i) => ls[i].getAttribute('aria-expanded'), i);
        if (st !== 'true') dep(route, w, 'accordion panel not open on focus and Space', `wa__link #${i + 1}`);
      }
      await p.evaluate(() => document.activeElement && document.activeElement.blur());
      const n = await p.evaluate((SEL) => {
        const els = [...document.querySelectorAll(SEL)].filter(__visible).filter((e) => !e.matches('input, textarea, select, .skip'));
        els.forEach((e, i) => e.setAttribute('data-ih', String(i)));
        return els.length;
      }, SEL);
      for (let i = 0; i < n; i += 1) {
        const sel = `[data-ih="${i}"]`;
        const snap = await p.evaluate((sel) => {
          const el = document.querySelector(sel);
          el.scrollIntoView({ block: 'center' });
          const scope = el.parentElement?.parentElement || el.parentElement;
          const sibs = [...scope.querySelectorAll('*')].filter((x) => !el.contains(x) && x !== el && !x.contains(el));
          const read = (x) => {
            const cs = getComputedStyle(x);
            const r = x.getBoundingClientRect();
            return `${cs.textDecorationLine}|${Math.round(r.width)}x${Math.round(r.height)}`;
          };
          window.__sibs = sibs;
          const r = el.getBoundingClientRect();
          return { wa: !!el.closest('[data-artifact="WorkAccordion"]'), sibs: sibs.map(read), box: [r.left, r.top, r.width, r.height].map(Math.round), tf: getComputedStyle(el).transform, name: __name(el) };
        }, sel);
        try {
          await p.hover(sel);
        } catch {
          continue;
        }
        await wait(260);
        const after = await p.evaluate((sel) => {
          const el = document.querySelector(sel);
          const cs = getComputedStyle(el);
          const read = (x) => {
            const c = getComputedStyle(x);
            const r = x.getBoundingClientRect();
            return `${c.textDecorationLine}|${Math.round(r.width)}x${Math.round(r.height)}`;
          };
          const r = el.getBoundingClientRect();
          return {
            sibs: window.__sibs.map(read),
            sibNames: window.__sibs.map(__name),
            box: [r.left, r.top, r.width, r.height].map(Math.round),
            tf: cs.transform,
            ul: cs.textDecorationLine.includes('underline') ? `${cs.textUnderlineOffset} ${cs.textDecorationThickness}` : null,
          };
        }, sel);
        await p.mouse.move(1, 1);
        await wait(40);
        /* The accordion's width animation is a recorded motion (BUILD-LAW
           Motion): its panels are exempt from the move and spill checks. */
        if (snap.wa) {
          if (after.ul) hovers.push(`${snap.name}: ${after.ul}`);
          continue;
        }
        const moved = snap.box[2] !== after.box[2] || snap.box[3] !== after.box[3] || Math.abs(snap.box[0] - after.box[0]) > 1 || Math.abs(snap.box[1] - after.box[1]) > 1;
        if (moved || (snap.tf !== after.tf && after.tf !== 'none')) dep(route, w, 'moves on hover', `${snap.name} ${snap.box} to ${after.box} ${after.tf}`);
        snap.sibs.forEach((v, j) => {
          if (v !== after.sibs[j]) dep(route, w, 'hover spills onto another element', `${snap.name} changes ${after.sibNames[j]} (${v} to ${after.sibs[j]})`);
        });
        if (after.ul) hovers.push(`${snap.name}: ${after.ul}`);
      }
      const offsets = [...new Set(hovers.map((h) => h.split(': ')[1]))];
      if (offsets.length > 1) dep(route, w, 'hover underline varies', offsets.join(' / '));
    }
    report[`${route} @${w}`] = { stops: stops.length, disclosures: disc.length, hoverUnderlines: hovers, inlineExempt: stat.inline };
    await p.close();
  }
}
/* THE BUTTON LAW, with motion allowed. */
const LAW = '.hero__cta, .bar__cta, .lf__submit, .callband__cta, .pr-grid__cta, .legal__cta, .dt__btn, .pr-col__more, .hero__pause, .ct-mq__ctl';
const lawSeen = {};
for (const route of ROUTES) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  await p.goto(BASE + route, { waitUntil: 'networkidle0' });
  await p.evaluate(HELPERS);
  await wait(2600); /* the hero's pause control appears with the film */
  const n = await p.evaluate((LAW) => {
    const els = [...document.querySelectorAll(LAW)].filter(__visible);
    els.forEach((e, i) => e.setAttribute('data-law', String(i)));
    return els.length;
  }, LAW);
  for (let i = 0; i < n; i += 1) {
    const sel = `[data-law="${i}"]`;
    const read = () =>
      p.evaluate((sel) => {
        const e = document.querySelector(sel);
        const cs = getComputedStyle(e);
        const face = e.querySelector('.ct-mq__face');
        return { tf: cs.transform, bg: (face ? getComputedStyle(face) : cs).backgroundColor, cursor: cs.cursor, disabled: e.getAttribute('aria-disabled') === 'true', name: __name(e) };
      }, sel);
    const there = await p.evaluate((sel) => {
      const e = document.querySelector(sel);
      if (e) e.scrollIntoView({ block: 'center' });
      return !!e;
    }, sel);
    if (!there) continue;
    await p.mouse.move(1, 1);
    await wait(250);
    const rest = await read();
    try {
      await p.hover(sel);
    } catch {
      continue;
    }
    await wait(300);
    const hov = await read();
    await p.mouse.down();
    await wait(200);
    const down = await read();
    /* Released away from the button, so the press is not a click: a link
       would navigate, a toggle would toggle. */
    await p.mouse.move(1, 1);
    await p.mouse.up();
    await wait(200);
    const ty = (tf) => (tf === 'none' ? 0 : Number(tf.match(/matrix\(([^)]+)\)/)[1].split(',')[5]));
    const sc = (tf) => (tf === 'none' ? 1 : Number(tf.match(/matrix\(([^)]+)\)/)[1].split(',')[0]));
    lawSeen[rest.name] = true;
    if (rest.disabled) {
      if (hov.tf !== rest.tf || hov.bg !== rest.bg || down.tf !== rest.tf) dep(route, 1280, 'button law: a disabled button moves or changes', rest.name);
      if (rest.cursor !== 'default') dep(route, 1280, 'button law: disabled cursor', `${rest.name} ${rest.cursor}`);
      continue;
    }
    if (Math.abs(ty(hov.tf) - ty(rest.tf) + 2) > 0.5) dep(route, 1280, 'button law: no 2px rise on hover', `${rest.name} ${hov.tf}`);
    if (hov.bg === rest.bg) dep(route, 1280, 'button law: fill unchanged on hover', `${rest.name} ${hov.bg}`);
    if (Math.abs(sc(down.tf) - 0.97) > 0.005) dep(route, 1280, 'button law: no 0.97 press', `${rest.name} ${down.tf}`);
  }
  await p.close();
}
console.log(`button law: ${Object.keys(lawSeen).length} distinct buttons checked`);

await b.close();
const uniq = [...new Map(departures.map((d) => [`${d.route}|${d.w}|${d.kind}|${d.what}`, d])).values()];
fs.writeFileSync(path.join(OUT, `interact-${TAG}.json`), JSON.stringify({ report, departures: uniq }, null, 1));
for (const [k, v] of Object.entries(report)) console.log(`${k.padEnd(26)} ${v.stops} stops, ${v.disclosures} disclosures, ${v.inlineExempt.length} inline links exempt`);
console.log(`\n${uniq.length} departures`);
for (const d of uniq) console.log(`${d.route} @${d.w}  ${d.kind}: ${d.what}`);
const allUl = [...new Set(Object.values(report).flatMap((v) => v.hoverUnderlines.map((h) => h.split(': ')[1])))];
console.log('\nhover underline values in use:', allUl.join(' / ') || 'none');
process.exit(uniq.length ? 1 : 0);

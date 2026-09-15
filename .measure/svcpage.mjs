/* svcpage.mjs — /services rebuilt as four sections (2026-09-15), and the
   not-found page.

   node .measure/svcpage.mjs services [base]     geometry, index, capture
   node .measure/svcpage.mjs notfound [base]     /404 and an unknown path

   SERVICES, at 1280 and 390:
     sections   four, 96px apart
     row one    name and promise; NO TILE since 2026-09-16
     cards      six per section under the promise, 3 across from 1024, 2 from
                768, 1 below; lit-near with the two lights; a 24px icon top
                left in shop white, aria-hidden; title Satoshi 18px white; one
                line in bone; order intro, cards, panel
     type       name in Moldie at the statement step, promise Satoshi 22px bone
     panel      three columns side by side from 1024, stacked below; hairlines
     numerals   Moldie in the accent's text value
     calls      primary on Branding and Websites, a link on the other two
     index      1280: scrolled to each section, the active numeral follows
   Full page captured at 1280 to .measure/out/svc/services-rebuild.png.

   NOTFOUND: heading, line, call, the render at 480px (1280) and inside the
   frame (390), the solid bar; captured at 1280 to .measure/out/svc/404-1280.png. */
import puppeteer from 'puppeteer';
import fs from 'node:fs';

const [mode = 'services', base = 'http://localhost:4180'] = process.argv.slice(2);
const out = '.measure/out/svc';
fs.mkdirSync(out, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const args = ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars'];
let fail = 0;
const check = (ok, msg) => { if (!ok) fail++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`); };
const near = (a, b, t = 1) => Math.abs(a - b) <= t;

async function open(w, h, path) {
  const b = await puppeteer.launch({ headless: 'new', args });
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(base + path, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const tot = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < tot; y += h / 2) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(90); }
  await p.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))));
  await p.evaluate(() => window.scrollTo(0, 0));
  await wait(500);
  return { b, p };
}

if (mode === 'services') {
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    console.log(`\n=== /services ${w}x${h}`);
    const { b, p } = await open(w, h, '/services');
    const s = await p.evaluate(() => [...document.querySelectorAll('.svc2__d')].map((d) => {
      const R = (el) => { const r = el.getBoundingClientRect(); return { l: r.left, t: r.top + scrollY, w: r.width, h: r.height, b: r.bottom + scrollY, r: r.right }; };
      const cs = (el) => getComputedStyle(el);
      const cols = [...d.querySelectorAll('.svc2__col')];
      return {
        id: d.id, S: R(d), I: R(d.querySelector('.svc2__intro')), G: R(d.querySelector('.svc2__cards')), P: R(d.querySelector('.svc2__panel')),
        hasTile: !!d.querySelector('.svc2__tile, img'),
        cards: [...d.querySelectorAll('.svc2__card')].map((c) => {
          const cb = c.getBoundingClientRect();
          const ic = c.querySelector('svg');
          const ib = ic ? ic.getBoundingClientRect() : null;
          const t = c.querySelector('.svc2__ct');
          const l = c.querySelector('.svc2__cl');
          return {
            top: Math.round(cb.top),
            icon: ic && { w: Math.round(ib.width), color: cs(ic).color, hidden: ic.getAttribute('aria-hidden'), dx: Math.round(ib.left - cb.left), dy: Math.round(ib.top - cb.top) },
            title: t && [t.textContent, cs(t).fontFamily.split(',')[0], cs(t).fontSize, cs(t).color],
            line: l && [l.textContent, cs(l).color],
            bg: cs(c).backgroundColor, lights: (cs(c).backgroundImage.match(/radial-gradient/g) || []).length,
          };
        }),
        name: [cs(d.querySelector('.svc2__name')).fontFamily.split(',')[0], cs(d.querySelector('.svc2__name')).fontSize],
        promise: [cs(d.querySelector('.svc2__promise')).fontFamily.split(',')[0], cs(d.querySelector('.svc2__promise')).fontSize, cs(d.querySelector('.svc2__promise')).color],
        cols: cols.map(R), borders: cols.map((c) => [cs(c).borderLeftWidth, cs(c).borderTopWidth]),
        panelBg: cs(d.querySelector('.svc2__panel')).backgroundColor,
        numerals: [...d.querySelectorAll('.svc2__sn')].map((n) => cs(n).fontFamily.split(',')[0] + ' ' + cs(n).color)[0],
        steps: d.querySelectorAll('.svc2__step').length,
        call: d.querySelector('.svc2__cta') ? 'primary' : d.querySelector('.svc2__link') ? 'link' : 'none',
        callText: (d.querySelector('.svc2__cta, .svc2__link') || {}).textContent,
      };
    }));
    check(s.length === 4, `${s.length} sections`);
    for (let i = 0; i < s.length; i++) {
      const d = s[i];
      const wide = w >= 1024;
      const bad = [];
      const rows = new Set(d.cards.map((c) => c.top)).size;
      const wantRows = w >= 1024 ? 2 : w >= 768 ? 3 : 6;
      if (d.hasTile) bad.push('a tile or image is still in the section');
      if (d.cards.length !== 6) bad.push(`${d.cards.length} cards`);
      if (rows !== wantRows) bad.push(`${rows} card rows, wanted ${wantRows}`);
      if (!(d.G.t >= d.I.b - 1 && d.P.t >= d.G.b - 1)) bad.push('order is not intro, cards, panel');
      d.cards.forEach((c, k) => {
        const e = [];
        if (!c.icon || c.icon.w !== 24 || c.icon.color !== 'rgb(255, 255, 255)' || c.icon.hidden !== 'true') e.push(`icon ${JSON.stringify(c.icon)}`);
        else if (c.icon.dx !== 25 || c.icon.dy !== 25) e.push(`icon not top left (${c.icon.dx},${c.icon.dy})`);
        if (!c.title || c.title[1] !== 'Satoshi' || c.title[2] !== '18px' || c.title[3] !== 'rgb(255, 255, 255)' || !c.title[0]) e.push(`title ${c.title}`);
        if (!c.line || c.line[1] !== 'rgb(232, 234, 237)' || !c.line[0] || /—|–/.test(c.line[0])) e.push(`line ${c.line}`);
        if (c.bg !== 'rgb(30, 31, 34)' || c.lights !== 2) e.push(`surface ${c.bg}, ${c.lights} lights`);
        if (e.length) bad.push(`card ${k + 1}: ${e.join(', ')}`);
      });
      if (d.name[0] !== 'Moldie') bad.push(`name ${d.name}`);
      if (d.promise[0] !== 'Satoshi' || d.promise[1] !== '22px' || d.promise[2] !== 'rgb(232, 234, 237)') bad.push(`promise ${d.promise}`);
      if (d.cols.length !== 3) bad.push(`${d.cols.length} columns`);
      else if (wide && !(near(d.cols[0].t, d.cols[1].t) && near(d.cols[1].t, d.cols[2].t) && d.borders[1][0] === '1px' && d.borders[2][0] === '1px')) bad.push('columns not side by side with hairlines');
      else if (!wide && !(d.cols[1].t >= d.cols[0].b - 1 && d.cols[2].t >= d.cols[1].b - 1)) bad.push('columns not stacked');
      /* White since the user's carrier decision, 2026-09-15. */
      if (!/Moldie rgb\(255, 255, 255\)/.test(d.numerals)) bad.push(`numerals ${d.numerals}`);
      const want = i < 2 ? 'primary' : 'link';
      if (d.call !== want) bad.push(`call ${d.call}, wanted ${want}`);
      if (i < s.length - 1) {
        const gap = s[i + 1].S.t - d.S.b;
        if (!near(gap, 96)) bad.push(`gap to next ${gap.toFixed(1)}`);
      }
      check(!bad.length, `${d.id.padEnd(10)} name ${d.name[1]}, ${d.cards.length} cards in ${rows} rows, ${d.steps} steps, ${d.call} "${d.callText}"${bad.length ? ' — ' + bad.join('; ') : ''}`);
    }

    if (w === 1280) {
      for (let i = 0; i < 4; i++) {
        await p.evaluate((i) => {
          const d = document.querySelectorAll('.svc2__d')[i];
          window.scrollTo(0, d.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3);
        }, i);
        await wait(700);
        const a = await p.evaluate(() => [...document.querySelectorAll('.svc__index-n')].findIndex((n) => n.dataset.active === 'true'));
        check(a === i, `index follows section ${i + 1}: active ${a + 1}`);
      }
      await p.evaluate(() => window.scrollTo(0, 0));
      await wait(600);
      await p.screenshot({ path: `${out}/services-rebuild.png`, fullPage: true });
      console.log(`  captured ${out}/services-rebuild.png`);
    }
    await b.close();
  }
}

if (mode === 'notfound') {
  for (const [w, h, path] of [[1280, 800, '/404'], [1280, 800, '/no-such-page'], [390, 844, '/404']]) {
    const { b, p } = await open(w, h, path);
    const r = await p.evaluate(() => {
      const img = document.querySelector('.nf__mark');
      const cta = document.querySelector('.nf__cta');
      return {
        h1: document.querySelector('h1') && document.querySelector('h1').textContent,
        h1font: document.querySelector('h1') && getComputedStyle(document.querySelector('h1')).fontFamily.split(',')[0],
        lead: (document.querySelector('.nf__lead') || {}).textContent,
        leadColor: document.querySelector('.nf__lead') && getComputedStyle(document.querySelector('.nf__lead')).color,
        img: img && { w: img.getBoundingClientRect().width, natural: img.naturalWidth, centre: img.getBoundingClientRect().left + img.getBoundingClientRect().width / 2 },
        cta: cta && [cta.textContent, cta.getAttribute('href'), getComputedStyle(cta).backgroundColor],
        bar: { over: document.querySelector('.bar').dataset.over, solid: document.querySelector('.bar').dataset.solid },
        legacy: !!document.querySelector('.lg'),
        vw: document.documentElement.clientWidth,
      };
    });
    console.log(`\n=== ${path} ${w}x${h}`);
    check(r.h1 === "That page isn't here." && r.h1font === 'Monigue', `heading "${r.h1}" in ${r.h1font}`);
    check(r.lead === 'Try the menu, or tell us what you were looking for.' && r.leadColor === 'rgb(232, 234, 237)', `line "${r.lead}" ${r.leadColor}`);
    check(!!r.img && r.img.natural === 1200 && (w === 1280 ? near(r.img.w, 480) : r.img.w <= r.vw) && near(r.img.centre, r.vw / 2, 2), `render ${r.img && r.img.w}px of natural ${r.img && r.img.natural}, centre ${r.img && r.img.centre} of ${r.vw}`);
    check(!!r.cta && r.cta[1] === '/contact-us' && r.cta[2] === 'rgb(240, 179, 35)', `call ${r.cta}`);
    check(r.bar.over === 'false' && r.bar.solid === 'true' && !r.legacy, `solid bar, rebuilt shell (legacy ${r.legacy})`);
    if (w === 1280 && path === '/404') await p.screenshot({ path: `${out}/404-1280.png`, fullPage: true });
    await b.close();
  }
}

console.log(fail ? `\n${fail} FAILED` : '\nall pass');
process.exit(fail ? 1 : 0);

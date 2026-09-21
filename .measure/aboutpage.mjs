/* aboutpage.mjs — /about-us, all six sections, 2026-09-16.

   node .measure/aboutpage.mjs [base]        (default http://localhost:4180)

   At 1280 and 390:
     order     hero, what we do, how it goes, pricing, standards, call band;
               the hero headline is the one h1; no images in <main>; solid bar
     hero      Monigue at the home hero's display clamp, white, left, 60%
               measure from 1024; the bone line; lines and height reported
     what      two columns from 1024, stacked below
     how       the cream band; five stops in a row with the line under from
               1024, down the left below
     price     the yellow band; $700 Monigue at 200px (30vw cap) in asphalt,
               two 13px label lines under it; four refusals; two columns from
               1024, stacked below
     std       three columns with hairlines from 1024, stacked below
     call      the spotlight call band (2026-09-16) with the yellow Let's Talk
   Full page at 1280 to .measure/out/about/about-v4.png. */
import puppeteer from 'puppeteer';
import fs from 'node:fs';

const base = process.argv[2] || 'http://localhost:4180';
const out = '.measure/out/about';
fs.mkdirSync(out, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const args = ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars'];
let fail = 0;
const check = (ok, msg) => { if (!ok) fail++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`); };
const near = (a, b, t = 1) => Math.abs(a - b) <= t;
const REFUSALS = [
  "We don't sell retainers. Thirty days of support are included, after that it's a conversation.",
  "We don't use templates. Every build starts from your business.",
  "We don't hide the price until a call. It's on this site.",
  "We don't keep your files. Domain, hosting, code and credentials move to your name.",
];

for (const [w, h] of [[1280, 800], [390, 844]]) {
  console.log(`\n=== /about-us ${w}x${h}`);
  const b = await puppeteer.launch({ headless: 'new', args });
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(base + '/about-us', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const tot = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < tot; y += h / 2) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(90); }
  await p.evaluate(() => window.scrollTo(0, 0));
  await wait(500);

  const r = await p.evaluate(() => {
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => [...document.querySelectorAll(s)];
    const R = (el) => { const x = el.getBoundingClientRect(); return { l: x.left, t: x.top + scrollY, w: x.width, h: x.height, b: x.bottom + scrollY, r: x.right }; };
    const cs = (el, ps) => getComputedStyle(el, ps);
    const inset = parseFloat(cs(document.documentElement).getPropertyValue('--inset')) || 0;
    const vw = document.documentElement.clientWidth;
    const bp = vw >= 1024 ? 64 : vw >= 768 ? 40 : 16;
    const expected = Math.min((window.innerWidth - 2 * bp) / 6.227, (window.innerHeight - 360) / 1.76);
    const h1 = $('.ab3-hero__h');
    const lh = parseFloat(cs(h1).lineHeight);
    const stops = $$('.route__stop');
    const route = $('.route');
    const cols = $$('.ab3-std__col');
    return {
      order: $$('main > section').map((s) => s.className.split(' ').find((c) => /^(ab3-|route-band|callband)/.test(c))),
      /* The page's own sections, not <main>: the footer, with the social
         row's six tiles, is rendered inside <main> by the shell. */
      h1s: $$('h1').map((x) => x.textContent.trim()), imgs: $$('main > section img').length,
      bar: $('.bar').dataset.over + '/' + $('.bar').dataset.solid, vw,
      hero: { size: parseFloat(cs(h1).fontSize), expected, font: cs(h1).fontFamily.split(',')[0], color: cs(h1).color, lines: Math.round(R(h1).h / lh), height: Math.round(R(h1).h),
        text: R($('.ab3-hero__text')), inner: R($('.ab3-hero .ab3__in')), pColor: cs($('.ab3-hero__p')).color, p: $('.ab3-hero__p').textContent.replace(/\s+/g, ' ').trim() },
      what: { h: R($('.ab3-what__h')), p: R($('.ab3-what__p')) },
      how: { bg: cs($('.route-band')).backgroundColor, n: stops.length, row: stops.every((s) => Math.abs(R(s).t - R(stops[0]).t) < 1), line: [cs(route, '::before').width, cs(route, '::before').height] },
      price: { bg: cs($('.ab3-price')).backgroundColor, h: $('.ab3-price__h').textContent,
        n: [$('.ab3-price__n').textContent, cs($('.ab3-price__n')).fontFamily.split(',')[0], parseFloat(cs($('.ab3-price__n')).fontSize), cs($('.ab3-price__n')).color],
        k: $$('.ab3-price__k').map((k) => [k.textContent, cs(k).fontSize, cs(k).fontFamily.split(',')[0], cs(k).color]),
        refuse: $$('.ab3-price__r').map((x) => [x.textContent, cs(x).color]),
        fig: R($('.ab3-price__fig')), list: R($('.ab3-price__refuse')), nW: R($('.ab3-price__n')).r },
      std: cols.map((c) => ({ t: R(c).t, bl: cs(c).borderLeftWidth, bt: cs(c).borderTopWidth })),
      call: { h: $('.callband__h').textContent, bg: cs($('.callband__cta')).backgroundColor, handset: !!$('.callband__handset') },
    };
  });
  const wide = w >= 1024;
  check(r.order.join() === 'ab3-hero,ab3-what,route-band,ab3-price,ab3-std,callband', `order ${r.order.join(' > ')}`);
  check(r.h1s.length === 1 && r.h1s[0] === 'A website that looks expensive and costs $700.' && r.imgs === 0 && r.bar === 'false/true', `one h1 "${r.h1s[0]}", ${r.imgs} images, bar ${r.bar}`);
  check(r.hero.font === 'Monigue' && near(r.hero.size, r.hero.expected, 0.5) && r.hero.color === 'rgb(255, 255, 255)' && r.hero.pColor === 'rgb(232, 234, 237)',
    `hero Monigue ${r.hero.size.toFixed(2)}px (home clamp ${r.hero.expected.toFixed(2)}), white; ${r.hero.lines} lines, ${r.hero.height}px tall; bone line`);
  if (wide) check(near(r.hero.text.w / r.hero.inner.w, 0.6, 0.01) && near(r.hero.text.l, r.hero.inner.l, 1), `hero measure ${(r.hero.text.w / r.hero.inner.w * 100).toFixed(1)}% of ${r.hero.inner.w.toFixed(0)}px, left aligned`);
  check(wide ? near(r.what.h.t, r.what.p.t, 2) : r.what.p.t > r.what.h.b - 1, `what we do ${wide ? 'two columns' : 'stacked'}`);
  check(r.how.bg === 'rgb(244, 241, 234)' && r.how.n === 5 && (wide ? r.how.row && r.how.line[1] === '3px' : !r.how.row && r.how.line[0] === '3px'), `how it goes: cream, ${r.how.n} stops ${wide ? 'in a row' : 'stacked'}`);
  const pr = r.price;
  check(pr.bg === 'rgb(240, 179, 35)' && pr.h === 'Flat prices, and a short list of things we refuse to do.', `price band ${pr.bg}, "${pr.h}"`);
  check(pr.n[0] === '$700' && pr.n[1] === 'Monigue' && near(pr.n[2], wide ? 200 : Math.min(200, r.vw * 0.3), 0.5) && pr.n[3] === 'rgb(23, 24, 26)' && pr.nW <= r.vw,
    `figure ${pr.n[0]} ${pr.n[1]} ${pr.n[2]}px ${pr.n[3]}, inside the frame (right ${pr.nW.toFixed(0)} of ${r.vw})`);
  check(pr.k.length === 2 && pr.k[0][0] === 'flat, one time' && pr.k[1][0] === '$299 to $449 for branding' && pr.k.every((k) => k[1] === '13px' && k[2] === 'Satoshi' && k[3] === 'rgb(23, 24, 26)'),
    `mono lines: ${pr.k.map((k) => `"${k[0]}" ${k[1]} ${k[2]}`).join(', ')}`);
  check(pr.refuse.length === 4 && pr.refuse.every((x, i) => x[0] === REFUSALS[i] && x[1] === 'rgb(23, 24, 26)'), `${pr.refuse.length} refusals, verbatim, asphalt`);
  check(wide ? near(pr.fig.t, pr.list.t, 2) && pr.list.l > pr.fig.l + 100 : pr.list.t > pr.fig.b - 1, `price ${wide ? 'two columns' : 'stacked'}`);
  const c = r.std;
  check(c.length === 3 && (wide ? c.every((x) => near(x.t, c[0].t, 1)) && c[1].bl === '1px' : c[1].t > c[0].t && c[1].bt === '1px'), `standards ${wide ? 'three columns' : 'stacked'}, hairlines`);
  check(r.call.h === 'Tell us about your business and get a quote the same day.' && r.call.bg === 'rgb(240, 179, 35)' && !r.call.handset, `call band, yellow Let's Talk, no object`);
  if (wide) {
    await p.screenshot({ path: `${out}/about-v4.png`, fullPage: true });
    console.log(`  captured ${out}/about-v4.png`);
  }
  await b.close();
}
console.log(fail ? `\n${fail} FAILED` : '\nall pass');
process.exit(fail ? 1 : 0);

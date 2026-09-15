/* aboutpage.mjs — /about-us, third version, 2026-09-15.

   node .measure/aboutpage.mjs [base]        (default http://localhost:4180)

   Four sections built (the hero and the pricing band are held for their
   images). At 1280 and 390:
     order     what we do, how it goes, standards, the call band, in that order;
               section 2's heading is the page's only h1
     images    none in <main>
     bar       solid
     what      two columns from 1024, stacked below; the body in bone
     how       the cream band; five stops in one row from 1024 with the line
               under them and a stop on the line under each; stacked below
               with the line down the left
     std       three columns from 1024 with hairlines between; stacked below
     call      the burst call band: heading, body, the yellow Let's Talk, no
               object
   Full page at 1280 to .measure/out/about/about-v3.png. */
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

for (const [w, h] of [[1280, 900], [390, 844]]) {
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
    const R = (el) => { const x = el.getBoundingClientRect(); return { l: x.left, t: x.top + scrollY, w: x.width, h: x.height, b: x.bottom + scrollY }; };
    const cs = (el, pseudo) => getComputedStyle(el, pseudo);
    const order = $$('main > section, main > header').map((s) => s.className.split(' ').find((c) => /^(ab3-|callband)/.test(c)) || s.className);
    const stops = $$('.ab3-route__stop');
    const route = $('.ab3-route');
    const cols = $$('.ab3-std__col');
    return {
      order,
      h1: $$('h1').map((x) => x.textContent.trim()),
      imgs: $$('main img').length,
      bar: $('.bar').dataset.over + '/' + $('.bar').dataset.solid,
      what: { h: R($('.ab3-what__h')), p: R($('.ab3-what__p')), color: cs($('.ab3-what__p')).color },
      how: { bg: cs($('.ab3-how')).backgroundColor, route: R(route), line: [cs(route, '::before').backgroundColor, cs(route, '::before').width, cs(route, '::before').height],
        stops: stops.map((s) => ({ R: R(s), n: s.querySelector('.ab3-route__n').textContent, t: s.querySelector('.ab3-route__t').textContent,
          dot: (() => { const d = cs(s, '::before'); return [d.width, d.backgroundColor]; })(), color: cs(s.querySelector('.ab3-route__t')).color })) },
      std: cols.map((c) => ({ R: R(c), bl: cs(c).borderLeftWidth + ' ' + cs(c).borderLeftColor, bt: cs(c).borderTopWidth })),
      call: { h: $('.callband__h').textContent, note: $('.callband__note').textContent, cta: [$('.callband__cta').textContent, cs($('.callband__cta')).backgroundColor], handset: !!$('.callband__handset') },
    };
  });
  const wide = w >= 1024;
  check(r.order.join() === 'ab3-what,ab3-how,ab3-std,callband', `order ${r.order.join(' > ')}`);
  check(r.h1.length === 1 && r.h1[0] === 'We work with local service businesses, not everyone.', `h1 ${JSON.stringify(r.h1)}`);
  check(r.imgs === 0, `${r.imgs} images in main`);
  check(r.bar === 'false/true', `bar ${r.bar}`);
  check(r.what.color === 'rgb(232, 234, 237)' && (wide ? near(r.what.h.t, r.what.p.t, 2) && r.what.p.l > r.what.h.l + 100 : r.what.p.t > r.what.h.b - 1),
    `what we do ${wide ? 'two columns' : 'stacked'}, body ${r.what.color}`);
  const s = r.how.stops;
  const row = s.every((x) => near(x.R.t, s[0].R.t, 1));
  check(r.how.bg === 'rgb(244, 241, 234)' && s.length === 5 && (wide ? row && r.how.line[1] !== '3px' && r.how.line[2] === '3px' : !row && r.how.line[1] === '3px')
    && s.every((x) => x.dot[0] === '12px' && x.dot[1] === 'rgb(23, 24, 26)' && x.color === 'rgb(23, 24, 26)') && r.how.line[0] === 'rgb(23, 24, 26)',
    `how it goes: cream ${r.how.bg}, ${s.length} stops ${wide ? 'in one row, line under' : 'stacked, line down the left'} (${r.how.line.join(' ')}): ${s.map((x) => x.n + ' ' + x.t).join(' / ')}`);
  const c = r.std;
  check(c.length === 3 && (wide ? c.every((x) => near(x.R.t, c[0].R.t, 1)) && c[1].bl.startsWith('1px') && c[2].bl.startsWith('1px') : c[1].R.t > c[0].R.t && c[1].bt === '1px'),
    `standards ${wide ? 'three columns, hairlines ' + c[1].bl : 'stacked, hairlines ' + c[1].bt}`);
  check(r.call.h === 'Tell us about your business and get a quote the same day.' && r.call.cta[1] === 'rgb(240, 179, 35)' && !r.call.handset,
    `call "${r.call.h}", ${r.call.cta[0]} ${r.call.cta[1]}, handset ${r.call.handset}`);
  if (wide) {
    await p.screenshot({ path: `${out}/about-v3.png`, fullPage: true });
    console.log(`  captured ${out}/about-v3.png`);
  }
  await b.close();
}
console.log(fail ? `\n${fail} FAILED` : '\nall pass');
process.exit(fail ? 1 : 0);

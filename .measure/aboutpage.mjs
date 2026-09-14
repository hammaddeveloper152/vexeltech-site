/* aboutpage.mjs — /about-us rebuilt, 2026-09-15.

   node .measure/aboutpage.mjs check [base]   structure, geometry, capture
   node .measure/aboutpage.mjs shade [base]   the strip cards' names, painted

   CHECK, at 1280 and 390:
     bar       solid (the cream hero is neither film nor surface)
     hero      cream band edge to edge, 96px top and bottom; 60/40 columns
               from 1024; the statement Monigue at the heading step, asphalt;
               two paragraphs; the asphalt call to #refuse; the mascot at its
               column's width, floating
     strip     four cards in one row from 1024, 2x2 below; 12px radius,
               cover-fit; Moldie names that fit their cards; links to
               /services#<id>, and arriving there lands on the section
     origin    the frame at 40% from 1024 with the arc edges; heading, body
     refuse    the yellow band; three columns from 1024; icons megaphone,
               name tag, phone, in that order
     who       two plates
     call      the call band with the floating handset
   Full page at 1280 to .measure/out/about/about-rebuild.png.

   SHADE: each card name, ink made transparent, brightest pixel under its line
   box, at rest and hovered; the shade starts at 85% and rises in 5% steps. */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import fs from 'node:fs';

const [mode = 'check', base = 'http://localhost:4180'] = process.argv.slice(2);
const out = '.measure/out/about';
fs.mkdirSync(out, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const args = ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars'];
let fail = 0;
const check = (ok, msg) => { if (!ok) fail++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`); };
const near = (a, b, t = 1) => Math.abs(a - b) <= t;

async function open(w, h, path = '/about-us') {
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

if (mode === 'check') {
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    console.log(`\n=== /about-us ${w}x${h}`);
    const { b, p } = await open(w, h);
    const r = await p.evaluate(() => {
      const $ = (s) => document.querySelector(s);
      const $$ = (s) => [...document.querySelectorAll(s)];
      const R = (el) => { const x = el.getBoundingClientRect(); return { l: x.left, t: x.top + scrollY, w: x.width, h: x.height, r: x.right }; };
      const cs = (el) => getComputedStyle(el);
      const hero = $('.ab-hero');
      const cards = $$('.ab-card');
      return {
        bar: $('.bar').dataset.over + '/' + $('.bar').dataset.solid,
        vw: document.documentElement.clientWidth,
        hero: { R: R(hero), bg: cs(hero).backgroundColor, pad: [cs(hero).paddingTop, cs(hero).paddingBottom],
          text: R($('.ab-hero__text')), art: R($('.ab-hero__art')), char: R($('.ab-hero__character')),
          float: cs($('.ab-hero__character')).animationName,
          h1: [$('h1').textContent.trim(), cs($('h1')).fontFamily.split(',')[0], cs($('h1')).fontSize, cs($('h1')).color],
          ps: $$('.ab-hero__p').length, call: [$('.ab-hero__call').textContent.trim(), $('.ab-hero__call').getAttribute('href'), cs($('.ab-hero__call')).backgroundColor] },
        strip: { h: $('.ab-strip__h').textContent, cards: cards.map((c) => ({ R: R(c), href: c.getAttribute('href'), radius: cs(c).borderTopLeftRadius,
          fit: cs(c.querySelector('img')).objectFit, decoded: c.querySelector('img').naturalWidth,
          name: c.querySelector('.ab-card__name').textContent, font: cs(c.querySelector('.ab-card__name')).fontFamily.split(',')[0],
          nameW: c.querySelector('.ab-card__name').scrollWidth, inner: c.querySelector('.ab-card__body').clientWidth })) },
        origin: { inner: R($('.ab-origin__in')), frame: R($('.ab-origin__frame')), edge: cs($('.ab-origin__frame')).borderRightColor,
          img: $('.ab-origin__img').naturalWidth, h: $('.ab-origin__h').textContent, p: $('.ab-origin__p').textContent.replace(/\s+/g, ' ').trim() },
        refuse: { bg: cs($('.ab-refuse')).backgroundColor, items: $$('.ab-refuse__item').map((i) => ({ t: R(i).t, icon: i.querySelector('img').getAttribute('src'), title: i.querySelector('h3').textContent })) },
        plates: $$('.plate').length,
        call: { h: $('.callband__h').textContent, handset: !!$('.callband__handset'), float: $('.callband__handset') && cs($('.callband__handset')).animationName,
          hs: $('.callband__handset') && R($('.callband__handset')), cta: R($('.callband__cta')) },
      };
    });
    const wide = w >= 1024;
    check(r.bar === 'false/true', `bar solid (${r.bar})`);
    check(r.hero.bg === 'rgb(244, 241, 234)' && near(r.hero.R.w, r.vw) && r.hero.pad.join() === '96px,96px', `hero cream ${r.hero.bg}, ${r.hero.R.w}/${r.vw}px wide, padding ${r.hero.pad}`);
    if (wide) check(near(r.hero.text.w / (r.hero.text.w + r.hero.art.w), 0.6, 0.01) && near(r.hero.char.w, r.hero.art.w), `hero columns ${r.hero.text.w.toFixed(0)} / ${r.hero.art.w.toFixed(0)} (${(r.hero.text.w / (r.hero.text.w + r.hero.art.w) * 100).toFixed(1)}%), mascot ${r.hero.char.w.toFixed(0)}px`);
    check(r.hero.float === 'vt-float', `mascot float ${r.hero.float}`);
    check(r.hero.h1[1] === 'Monigue' && r.hero.h1[3] === 'rgb(23, 24, 26)', `statement ${r.hero.h1[1]} ${r.hero.h1[2]} ${r.hero.h1[3]}`);
    check(r.hero.ps === 2 && r.hero.call[1] === '#refuse' && r.hero.call[2] === 'rgb(23, 24, 26)', `${r.hero.ps} paragraphs; call "${r.hero.call[0]}" ${r.hero.call[1]} ${r.hero.call[2]}`);
    const c = r.strip.cards;
    const oneRow = c.every((x) => near(x.R.t, c[0].R.t));
    const twoByTwo = near(c[0].R.t, c[1].R.t) && near(c[2].R.t, c[3].R.t) && c[2].R.t > c[0].R.t + 10;
    check(c.length === 4 && (wide ? oneRow : twoByTwo), `${c.length} cards, ${wide ? 'one row' : '2x2'}: ${oneRow ? 'one row' : twoByTwo ? '2x2' : 'neither'} (${c[0].R.w.toFixed(0)}px)`);
    for (const x of c) check(x.radius === '12px' && x.fit === 'cover' && x.decoded && x.font === 'Moldie' && x.nameW <= x.inner + 1 && x.href === `/services#${x.name.toLowerCase()}`, `card ${x.name}: ${x.href}, name ${x.nameW}/${x.inner}px`);
    if (wide) check(near(r.origin.frame.w / r.origin.inner.w, 0.4, 0.01), `origin frame ${(r.origin.frame.w / r.origin.inner.w * 100).toFixed(1)}% of the row`);
    check(r.origin.edge === 'rgba(8, 48, 127, 0.35)' && r.origin.img > 0 && r.origin.h === 'Fifty-two iterations, one cut', `origin edge ${r.origin.edge}, plate ${r.origin.img}px, "${r.origin.h}"`);
    const it = r.refuse.items;
    check(r.refuse.bg === 'rgb(240, 179, 35)' && it.length === 3 && (wide ? it.every((x) => near(x.t, it[0].t)) : it[1].t > it[0].t)
      && it.map((x) => x.icon.split('/').pop()).join() === 'icon-megaphone.webp,icon-name-tag.webp,icon-phone.webp', `refuse band ${r.refuse.bg}, ${it.map((x) => x.title).join(' ')}`);
    check(r.plates === 2, `${r.plates} plates`);
    check(r.call.handset && r.call.float === 'vt-float' && r.call.h === 'Tell us what is going wrong', `call band "${r.call.h}", handset ${r.call.hs && r.call.hs.w.toFixed(0)}px ${r.call.float}`);

    if (wide) {
      const card = (await p.$$('.ab-card'))[0];
      await card.scrollIntoView();
      await wait(300);
      const bb = await card.boundingBox();
      await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
      await wait(700);
      const sc = await p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.ab-card__img')).transform).a);
      check(near(sc, 1.04, 0.002), `card hover scale ${sc.toFixed(3)}`);
      await p.mouse.move(2, 2);
      await wait(600);
      await p.evaluate(() => window.scrollTo(0, 0));
      await wait(500);
      await p.screenshot({ path: `${out}/about-rebuild.png`, fullPage: true });
      console.log(`  captured ${out}/about-rebuild.png`);

      await p.goto(base + '/services#websites', { waitUntil: 'networkidle0' });
      await wait(1500);
      const top = await p.evaluate(() => document.getElementById('websites').getBoundingClientRect().top);
      check(top >= 0 && top < 200, `/services#websites lands on the section: top ${top.toFixed(0)}px`);
    }
    await b.close();
  }
}

if (mode === 'shade') {
  const result = {};
  for (const [w, h] of [[1280, 900], [390, 844]]) {
    const { b, p } = await open(w, h);
    await p.addStyleTag({ content: '.ab-ink-off .ab-card__name { color: transparent !important }' });
    let shade = 85;
    for (;;) {
      await p.evaluate((s) => document.querySelector('.ab-strip').style.setProperty('--card-shade', `${s}%`), shade);
      const rows = [];
      const n = await p.$$eval('.ab-card', (e) => e.length);
      for (let i = 0; i < n; i++) {
        for (const hover of [false, true]) {
          await p.evaluate((i) => document.querySelectorAll('.ab-card')[i].scrollIntoView({ block: 'center' }), i);
          await wait(250);
          const card = (await p.$$('.ab-card'))[i];
          const bb = await card.boundingBox();
          if (hover) await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height * 0.4);
          else await p.mouse.move(2, 2);
          await wait(650);
          const info = await p.evaluate((i) => {
            const el = document.querySelectorAll('.ab-card__name')[i];
            const rg = document.createRange();
            rg.selectNodeContents(el);
            return { name: el.textContent, color: getComputedStyle(el).color, rects: [...rg.getClientRects()].map((r) => [r.left, r.top, r.width, r.height]) };
          }, i);
          await p.evaluate(() => document.documentElement.classList.add('ab-ink-off'));
          await wait(60);
          const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
          await p.evaluate(() => document.documentElement.classList.remove('ab-ink-off'));
          const [cr, cg, cb] = (info.color.match(/[\d.]+/g) || []).map(Number);
          let max = 0, px = null;
          for (const [x0, y0, rw, rh] of info.rects) {
            for (let y = Math.max(0, Math.floor(y0)); y < Math.min(im.height, Math.ceil(y0 + rh)); y++) {
              for (let x = Math.max(0, Math.floor(x0)); x < Math.min(im.width, Math.ceil(x0 + rw)); x++) {
                const k = (y * im.width + x) * 4;
                const l = L(im.data[k], im.data[k + 1], im.data[k + 2]);
                if (l > max) { max = l; px = `rgb(${im.data[k]},${im.data[k + 1]},${im.data[k + 2]})`; }
              }
            }
          }
          rows.push({ name: info.name, hover, ratio: +CR(L(cr, cg, cb), max).toFixed(2), px });
        }
      }
      await p.mouse.move(2, 2);
      const fails = rows.filter((x) => x.ratio < 3);
      const worst = [...rows].sort((a, b2) => a.ratio - b2.ratio)[0];
      console.log(`${w}: shade ${shade}% — ${fails.length ? `${fails.length} failing` : 'every name passes'}; binding ${worst.name} ${worst.hover ? 'hover' : 'rest'} ${worst.ratio}:1 over ${worst.px}`);
      if (!fails.length || shade >= 100) { result[w] = { shade, pass: !fails.length }; break; }
      shade += 5;
    }
    await b.close();
  }
  console.log('RESULT', JSON.stringify(result));
}

console.log(fail ? `\n${fail} FAILED` : '\nall pass');
process.exit(fail ? 1 : 0);

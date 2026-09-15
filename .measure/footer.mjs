/* footer.mjs — the footer rebuilt, 2026-09-16.

   node .measure/footer.mjs check   [base]    shipped build: no social URLs
   node .measure/footer.mjs preview [base]    VITE_SOCIAL_PREVIEW=1 build: glyphs

   CHECK, on /, /about-us, /pricing, /services, /contact-us, /404 at 1280 and 390:
     email      Monigue, uppercase, one line, fitted (<= 115px, never wider than
                the footer's content box), white, a mailto; machine yellow on hover
     line       the bone line under it, verbatim
     rules      two hairlines, 1px rule-dark
     row        the five pages in Satoshi 14px; no social glyphs (no URLs yet)
     base       wordmark, address; no legal line, no phone; 11px steel-lift
     corner     no stroked V on the footer
     form       present above the footer on / and /contact-us only
     stacking   on a phone the pages stack and the base stacks
   Footer captured at 1280 and 390 from the top of the page.

   PREVIEW: six glyphs in one row at the right of the pages row, 24px, steel-
   lift, each a >= 48px target labelled by platform, machine yellow on hover. */
import puppeteer from 'puppeteer';
import fs from 'node:fs';

const [mode = 'check', base = 'http://localhost:4180'] = process.argv.slice(2);
const out = '.measure/out/footer';
fs.mkdirSync(out, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let fail = 0;
const check = (ok, msg) => { if (!ok) fail++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`); };
const near = (a, b, t = 1) => Math.abs(a - b) <= t;
const YELLOW = 'rgb(240, 179, 35)';

const b = await puppeteer.launch({ headless: 'new', args: ['--force-color-profile=srgb', '--hide-scrollbars'] });
const routes = mode === 'check' ? ['/', '/about-us', '/pricing', '/services', '/contact-us', '/404'] : ['/'];
for (const [w, h] of [[1280, 900], [390, 844]]) {
  for (const route of routes) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h });
    await p.goto(base + route, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate(() => {
      const $ = (s) => document.querySelector(s);
      const $$ = (s) => [...document.querySelectorAll(s)];
      const cs = (el, ps) => getComputedStyle(el, ps);
      const R = (el) => el.getBoundingClientRect();
      const email = $('.foot__email');
      const inner = $('.foot__inner');
      const icb = R(inner);
      const innerW = icb.width - parseFloat(cs(inner).paddingLeft) - parseFloat(cs(inner).paddingRight);
      const range = document.createRange();
      range.selectNodeContents(email);
      const tops = new Set([...range.getClientRects()].map((q) => Math.round(q.top)));
      const foot = $('.foot');
      const links = $$('.foot__nav-link');
      const baseEls = [$('.foot__brand'), $('.foot__addr')].filter(Boolean);
      return {
        email: email && { text: email.textContent, href: email.getAttribute('href'), font: cs(email).fontFamily.split(',')[0], size: parseFloat(cs(email).fontSize),
          transform: cs(email).textTransform, color: cs(email).color, w: R(email).width, lines: tops.size, innerW, left: R(email).left - icb.left },
        line: $('.foot__lead-p') && [$('.foot__lead-p').textContent, cs($('.foot__lead-p')).color],
        rules: $$('.foot__rule').map((x) => [cs(x).borderTopWidth, cs(x).borderTopColor]),
        pages: links.map((a) => a.textContent.trim()), pageFont: links[0] && [cs(links[0]).fontFamily.split(',')[0], cs(links[0]).fontSize],
        pagesStacked: links.length > 1 && R(links[1]).top > R(links[0]).top + 5,
        social: $$('.social__a').map((a) => ({ label: a.getAttribute('aria-label'), href: a.getAttribute('href'), color: cs(a).color, w: R(a.querySelector('svg')).width, tw: R(a).width, th: R(a).height, top: R(a).top })),
        socialRight: $('.social') ? R($('.social')).right : null, rowRight: $('.foot__row') ? R($('.foot__row')).right : null,
        base: { brand: !!$('.foot__brand .wm--sm'), addr: $('.foot__addr') && [$('.foot__addr').textContent, cs($('.foot__addr')).fontSize, cs($('.foot__addr')).color, cs($('.foot__addr')).fontFamily.split(',')[0]],
          legal: !!$('.foot__legal'), phone: !!$('.foot__phone'), stacked: baseEls.length === 2 && R(baseEls[1]).top > R(baseEls[0]).bottom - 1 },
        corner: cs(foot, '::before').backgroundImage,
        form: !!$('.foot__form'),
        oldMeta: !!$('.foot__meta-k, .foot__contact'),
      };
    });

    console.log(`\n=== ${route} ${w}x${h}`);
    if (mode === 'check') {
      const e = r.email;
      check(e && e.text === 'info@vexeltechsolutions.com' && e.href === 'mailto:info@vexeltechsolutions.com' && e.font === 'Monigue' && e.transform === 'uppercase' && e.color === 'rgb(255, 255, 255)',
        `email ${e && e.font} ${e && e.transform} ${e && e.color}, ${e && e.href}`);
      check(e && e.lines === 1 && e.size <= 115 + 0.01 && e.w <= e.innerW + 0.5 && (w === 1280 ? near(e.size, 114.06, 1) : near(e.size, 35.4, 0.6)),
        `email one line at ${e && e.size.toFixed(2)}px, ${e && e.w.toFixed(0)}px of ${e && e.innerW.toFixed(0)}px`);
      check(r.line && r.line[0] === "Tell us what's going wrong. You'll hear from a person within one business day." && r.line[1] === 'rgb(232, 234, 237)', `bone line: "${r.line && r.line[0]}"`);
      check(r.rules.length === 2 && r.rules.every((x) => x[0] === '1px' && x[1] === 'rgba(255, 255, 255, 0.12)'), `${r.rules.length} hairlines ${r.rules.map((x) => x.join(' ')).join(', ')}`);
      check(r.pages.join() === 'Home,Services,Pricing,About us,Contact us' && r.pageFont[0] === 'Satoshi' && r.pageFont[1] === '14px' && (w < 768 ? r.pagesStacked : !r.pagesStacked),
        `pages ${r.pages.join(' / ')} in ${r.pageFont.join(' ')}, ${r.pagesStacked ? 'stacked' : 'one row'}`);
      check(r.social.length === 0, `social glyphs rendered: ${r.social.length} (no account URLs supplied)`);
      check(r.base.brand && r.base.addr && r.base.addr[0] === '6619 Elks Trce, Richmond, TX 77406' && r.base.addr[1] === '11px' && r.base.addr[2] === 'rgb(155, 161, 169)' && !r.base.legal && !r.base.phone && (w < 768 ? r.base.stacked : !r.base.stacked),
        `base: small wordmark, address ${r.base.addr && r.base.addr.slice(1).join(' ')}, legal ${r.base.legal}, phone ${r.base.phone}, ${r.base.stacked ? 'stacked' : 'one row'}`);
      check(r.corner === 'none' && !r.oldMeta, `corner V ${r.corner === 'none' ? 'gone' : r.corner.slice(0, 40)}; old meta blocks ${r.oldMeta ? 'present' : 'gone'}`);
      check(r.form === (route === '/' || route === '/contact-us'), `form ${r.form ? 'present' : 'absent'}`);
      if (w === 1280 && route === '/') {
        await p.hover('.foot__email');
        await wait(300);
        const hc = await p.evaluate(() => getComputedStyle(document.querySelector('.foot__email')).color);
        check(hc === YELLOW, `email hover ${hc}`);
        await p.mouse.move(2, 2);
      }
      if (route === '/about-us') {
        await p.evaluate(() => window.scrollTo(0, 0));
        await wait(500);
        const clip = await p.evaluate(() => { const f = document.querySelector('.foot'); const q = f.getBoundingClientRect(); return { x: 0, y: q.top + scrollY, width: document.documentElement.clientWidth, height: q.height }; });
        await p.screenshot({ path: `${out}/footer-${w}.png`, clip, captureBeyondViewport: true });
        console.log(`  captured ${out}/footer-${w}.png`);
      }
    } else {
      const s = r.social;
      const oneRow = s.every((x) => near(x.top, s[0].top, 1));
      check(s.length === 6 && s.map((x) => x.label).join() === 'Instagram,Facebook,LinkedIn,X,TikTok,YouTube' && s.every((x) => near(x.w, 24, 0.5) && x.tw >= 48 && x.th >= 48 && x.color === 'rgb(155, 161, 169)') && oneRow,
        `preview: ${s.length} glyphs ${s.map((x) => x.label).join(' ')}, ${s[0] && s[0].w}px, targets ${s[0] && s[0].tw}x${s[0] && s[0].th}, ${s[0] && s[0].color}, ${oneRow ? 'one row' : 'wrapped'}`);
      if (w >= 768) check(near(r.socialRight, r.rowRight, 13), `preview: glyphs at the right of the row (${r.socialRight && r.socialRight.toFixed(0)} / ${r.rowRight && r.rowRight.toFixed(0)})`);
      if (w === 1280) {
        await p.hover('.social__a');
        await wait(300);
        const hc = await p.evaluate(() => getComputedStyle(document.querySelector('.social__a')).color);
        check(hc === YELLOW, `preview: glyph hover ${hc}`);
      }
    }
    await p.close();
  }
}
await b.close();
console.log(fail ? `\n${fail} FAILED` : '\nall pass');
process.exit(fail ? 1 : 0);

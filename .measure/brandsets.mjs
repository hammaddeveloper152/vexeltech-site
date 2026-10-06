/* brandsets.mjs: the brand you type (final7, 2026-10-03). Types names into
   the /services field until every one of the five colour sets has shown,
   and measures each pair the stage paints, from computed colour: the
   wordmark on the stage, the sign band's wordmark on the band, the mark's
   and the tile's initials, and the card's name on the neutral. 4.5:1 is
   the bar for all of them.

   Usage: node .measure/brandsets.mjs [base] */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const NAMES = ['Harbor Dental', 'Mesa Roofing', 'Lake Clinic', 'Oak Bakery', 'Pine Legal', 'Bright Spa', 'North Auto', 'Cedar Books', 'Tide Cafe', 'Stone Gym', 'Elm Florist', 'Bay Plumbing', 'Ridge Vet', 'Fox Salon', 'Iron Works', 'Glen Dental', 'Ash Tailor', 'Reed Optics'];
const b = await puppeteer.launch({ headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 900 });
await p.goto(BASE + '/services', { waitUntil: 'networkidle0' });
await p.evaluate(() => document.querySelector('.by').scrollIntoView({ block: 'center' }));
const seen = {};
for (const name of NAMES) {
  await p.click('#by-name', { clickCount: 3 });
  await p.keyboard.press('Backspace');
  await p.type('#by-name', name);
  await new Promise((r) => setTimeout(r, 150));
  const r = await p.evaluate(() => {
    const rgb = (s) => s.match(/[\d.]+/g).slice(0, 3).map(Number);
    const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    const L = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
    const cr = (a, c) => {
      const [x, y] = [L(a), L(c)].sort((m, n) => n - m);
      return +((x + 0.05) / (y + 0.05)).toFixed(2);
    };
    /* The after layer of the slider (final15, 2026-10-06). */
    const cs = (sel) => getComputedStyle(document.querySelector(`#branding .ba__layer--after ${sel}`));
    const cream = rgb(getComputedStyle(document.querySelector('.by__panel')).backgroundColor);
    const panel = getComputedStyle(document.querySelector('.by__panel'));
    const A = rgb(panel.getPropertyValue('--a').trim().replace(/^#(..)(..)(..)$/, (m, r, g, bl) => `rgb(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(bl, 16)})`));
    const dark = A.map((v) => v * 0.86);
    const word = rgb(cs('.bs-sign').color);
    const mark = cs('.bs-mark--sign');
    const av = cs('.bs-gbp__av--mark');
    return {
      a: panel.getPropertyValue('--a').trim(),
      signWord: cr(word, A),
      signWordDark: cr(word, dark),
      markInitials: cr(rgb(mark.color), rgb(mark.backgroundColor)),
      cardName: cr(rgb(cs('.bs-card').color), A),
      avatar: cr(rgb(av.color), rgb(av.backgroundColor)),
      afterTag: cr(A, cream),
    };
  });
  if (!seen[r.a]) seen[r.a] = { name, ...r };
}
await b.close();
const sets = Object.values(seen);
console.log(JSON.stringify(sets, null, 1));
const low = Math.min(...sets.flatMap((s) => [s.signWord, s.signWordDark, s.markInitials, s.cardName, s.avatar, s.afterTag]));
console.log(`${sets.length} of 5 sets seen; lowest pair ${low}:1 ${low >= 4.5 ? 'PASS' : 'FAIL'}`);

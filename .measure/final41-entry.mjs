/* final41-entry.mjs: the artifacts' entrance, frame by frame (FINAL41
   part 4, 2026-10-08, the founder). In a real browser, motion allowed, at
   1280 and 390, for /services' mosaic, thread and branding desk, home's
   What we do typing (card 01), About's staircase and its four lines:

     1. load at the top of the page and read the artifact's state on first
        paint (it is below the fold)
     2. scroll its top edge to the viewport's foot, then on 100px a frame,
        one frame per 100ms, until it is half in view
     3. hold, and read a frame every 100ms until its play ends (its state
        unchanged for a second) or 12s pass

   Each frame's state is a short description: the soft start's opacity
   (`--fade` while `data-leaving` is set), and what the artifact shows,
   counted (lit tiles, risen messages, typed characters, visible lines).
   Runs of identical frames are reported as one span. With [shots], the
   mosaic's and the thread's eight frames from half in view are written to
   .measure/out/final41/mosaic-entry-01..08.png and thread-entry-01..08.png.

   About's two blocks also report their lowest opacity and any offset, and
   a frame with a line or step under 0.05 is marked BLANK.
   [only] limits the run: `about` runs About's two blocks at 390 alone.

     node .measure/final41-entry.mjs [base] [shots|-] [only]   (4190) */
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const SHOTS = process.argv[3] === 'shots';
const OUT = path.join('.measure', 'out', 'final41');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const CASES = [
  { name: 'mosaic', route: '/services', sel: '[data-artifact="MarketingMosaic"] .mm__stage', shot: 'mosaic-entry' },
  { name: 'thread', route: '/services', sel: '[data-artifact="AssistantThread"] .at__stage', shot: 'thread-entry' },
  { name: 'desk', route: '/services', sel: '[data-artifact="BrandDesk"] .bd__stage' },
  { name: 'what we do 01', route: '/', sel: '.wwd__card' },
  { name: 'staircase', route: '/about-us', sel: '.ns__steps' },
  { name: 'four lines', route: '/about-us', sel: '.hold' },
];

/* The state of one artifact, in words. */
const READ = (sel) => {
  const el = document.querySelector(sel);
  const op = (e) => {
    let o = 1;
    for (let n = e; n && n !== document.body; n = n.parentElement) o *= Number(getComputedStyle(n).opacity);
    return o;
  };
  const fade = el.getAttribute('data-leaving') ? `soft ${Number(getComputedStyle(el).getPropertyValue('--fade') || 1).toFixed(2)}` : 'full';
  let what = '';
  if (el.closest('[data-artifact="MarketingMosaic"]')) {
    const tiles = [...el.querySelectorAll('.mm__tile')];
    const lit = tiles.filter((t) => op(t) > 0.9).length;
    const tally = (el.querySelector('.mm__tally') || {}).textContent || '';
    what = `${lit} of ${tiles.length} tiles lit, tally "${tally.trim().split(/\s+/).slice(0, 3).join(' ')}"`;
  } else if (el.closest('[data-artifact="AssistantThread"]')) {
    const items = [...el.querySelectorAll('.at__item')];
    const shown = items.filter((t) => op(t) > 0.5).length;
    const chips = el.querySelectorAll('.at__chip.is-on').length;
    what = `${shown} of ${items.length} messages shown, ${chips} chips lit`;
  } else if (el.closest('[data-artifact="BrandDesk"]')) {
    const xs = [...el.querySelectorAll('.xf')];
    const shown = xs.filter((t) => op(t) > 0.5).length;
    what = `${shown} of ${xs.length} desk pieces shown`;
  } else if (el.matches('.wwd__card')) {
    const ans = el.querySelector('.wwd__ans').lastElementChild;
    const text = ans.innerText.replace(/\s+/g, ' ').trim();
    what = `answer ${text.length} characters${el.querySelector('[class*="caret"]') ? ', caret' : ''}`;
  } else {
    const items = [...el.children];
    const shown = items.filter((t) => op(t) > 0.9).length;
    const low = Math.min(...items.map(op));
    const off = Math.max(
      ...items.map((t) => {
        const tf = getComputedStyle(t).transform;
        return tf === 'none' ? 0 : Math.abs(Number(tf.match(/matrix\(([^)]+)\)/)[1].split(',')[5]));
      })
    );
    what = `${shown} of ${items.length} at full, lowest opacity ${low.toFixed(2)}, offset ${Math.round(off)}px${low < 0.05 ? ', BLANK' : ''}`;
  }
  return `${fade}, ${what}`;
};

const ONLY = process.argv[4];
const b = await puppeteer.launch({ headless: 'new' });
for (const w of ONLY === 'about' ? [390] : [1280, 390]) {
  for (const c of ONLY === 'about' ? CASES.filter((x) => x.route === '/about-us') : CASES) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
    await p.goto(BASE + c.route, { waitUntil: 'networkidle0' });
    await p.evaluate(() => document.fonts.ready);
    await wait(300);
    const frames = [];
    const t0 = Date.now();
    const log = async (phase) => frames.push({ ms: Date.now() - t0, phase, s: await p.evaluate(READ, c.sel) });
    await log('first paint, below the fold');
    /* Its top edge to the viewport's foot. */
    await p.evaluate((sel) => {
      const r = document.querySelector(sel).getBoundingClientRect();
      window.scrollTo(0, r.top + scrollY - innerHeight + 1);
    }, c.sel);
    const entered = Date.now();
    await log('top edge enters');
    /* 100px a frame until half in view. */
    for (let i = 0; i < 60; i += 1) {
      const half = await p.evaluate((sel) => {
        const r = document.querySelector(sel).getBoundingClientRect();
        const need = Math.min(r.height, innerHeight) * 0.5;
        return Math.min(r.bottom, innerHeight) - Math.max(r.top, 0) >= need;
      }, c.sel);
      if (half) break;
      await p.evaluate(() => window.scrollBy(0, 100));
      await wait(100);
      await log('scrolling in');
    }
    const halfAt = Date.now() - entered;
    let same = 0;
    for (let i = 0; i < 120 && same < 10; i += 1) {
      if (SHOTS && c.shot && i < 8) {
        const el = await p.$(c.sel);
        await el.screenshot({ path: path.join(OUT, `${c.shot}-${String(i + 1).padStart(2, '0')}.png`) });
      }
      await wait(100);
      await log('half in view');
      const n = frames.length;
      same = frames[n - 1].s === frames[n - 2].s ? same + 1 : 0;
    }
    /* Report: runs of identical frames. */
    const runs = [];
    for (const f of frames) {
      const last = runs[runs.length - 1];
      if (last && last.s === f.s) last.to = f.ms;
      else runs.push({ from: f.ms, to: f.ms, s: f.s, phase: f.phase });
    }
    console.log(`== ${c.name} @${w} (half in view ${halfAt}ms after the top edge entered)`);
    for (const r of runs) console.log(`   ${String(r.from).padStart(5)} to ${String(r.to).padStart(5)}ms  [${r.phase}]  ${r.s}`);
    await p.close();
  }
}
await b.close();

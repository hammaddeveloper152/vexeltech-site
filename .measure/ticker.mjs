/* ticker.mjs — the strike ticker, measured.

   node .measure/ticker.mjs [base]          (default http://localhost:4180)
   FFMPEG=<path to ffmpeg.exe> records the 6s webm at 1280 as well.

   Per width (1280, 390):
     type      the phrase size (64 / 40), the stroke, the strike's thickness and
               its end cut, read back as an angle
     caps      where the strike sits against the PAINTED caps of its phrase:
               strike hidden, ticker paused, the outline's rows found by pixel
     base      leftward speed at rest, median of 100ms windows over 3s
     crossing  every phrase whose centre crosses the viewport centre is struck,
               and how long after the crossing frame; no phrase visible left
               of centre is ever unstruck
     scroll    a wheel flick: peak speed (ceiling 6 x 60 = 360) and the time
               back to within 10% of base
     throw     a 400px drag to the left: the row follows the hand, carries on
               after release, and comes back to base
   Reduced motion: five phrases, all struck, fixes shown, nothing translated.
   Captures to .measure/out/ticker/. */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import fs from 'node:fs';

const base = process.argv[2] || 'http://localhost:4180';
const out = '.measure/out/ticker';
fs.mkdirSync(out, { recursive: true });
const FF = process.env.FFMPEG;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const args = ['--force-color-profile=srgb', '--font-render-hinting=none',
  '--use-gl=swiftshader', '--enable-unsafe-swiftshader'];
let fail = 0;
const check = (ok, msg) => { if (!ok) fail++; console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${msg}`); };
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : NaN; };

async function centre(p) {
  await p.evaluate(() => {
    const s = document.querySelector('.ticker');
    const r = s.getBoundingClientRect();
    window.scrollTo(0, r.top + window.scrollY - (window.innerHeight - r.height) / 2);
  });
  await wait(1500);
}

/* A frame loop in the page: speed in 100ms windows (leftward positive), the
   crossings, and the lag from a crossing frame to the struck state. */
const sample = (p, ms) => p.evaluate((ms) => new Promise((res) => {
  const view = document.querySelector('.ticker__view');
  const ticks = [...document.querySelectorAll('.tick')];
  const prev = new Map();
  const cross = new Map();
  const t0 = performance.now();
  let winT = t0, winD = 0, crossings = 0, lag = 0, missed = 0;
  const speeds = [];
  const step = (t) => {
    const v = view.getBoundingClientRect();
    const vc = v.left + v.width / 2;
    let fd = 0, n = 0;
    for (const el of ticks) {
      const pr = el.querySelector('.tick__problem').getBoundingClientRect();
      const cx = pr.left + pr.width / 2;
      const was = prev.get(el);
      if (was !== undefined) {
        const d = cx - was;
        if (Math.abs(d) < 400) { fd += d; n++; }
        if (was >= vc && cx < vc) { crossings++; cross.set(el, t); }
      }
      if (cross.has(el) && el.dataset.struck === 'true') { lag = Math.max(lag, t - cross.get(el)); cross.delete(el); }
      if (cx < vc - 24 && pr.right > v.left && pr.left < v.right && el.dataset.struck !== 'true') missed++;
      prev.set(el, cx);
    }
    if (n) winD += fd / n;
    if (t - winT >= 100) { speeds.push([Math.round(t - t0), +(-winD / ((t - winT) / 1000)).toFixed(1)]); winD = 0; winT = t; }
    if (t - t0 < ms) requestAnimationFrame(step);
    else res({ crossings, lag: +lag.toFixed(1), missed, speeds });
  };
  requestAnimationFrame(step);
}), ms);

async function flick(p) {
  for (let i = 0; i < 5; i++) { await p.mouse.wheel({ deltaY: 60 }); await wait(16); }
}

async function throwLeft(p) {
  const r = await p.$eval('.ticker__view', (e) => { const b = e.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; });
  await p.mouse.move(r[0], r[1]);
  await p.mouse.down();
  for (let i = 1; i <= 8; i++) { await p.mouse.move(r[0] - i * 50, r[1]); await wait(8); }
  await p.mouse.up();
}

for (const [w, h, size] of [[1280, 800, 64], [390, 844, 40]]) {
  console.log(`\n=== ${w}x${h}`);
  const b = await puppeteer.launch({ headless: 'new', args });
  const p = await b.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(base + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await centre(p);

  /* ---- type and the strike's shape ---- */
  const geo = await p.evaluate(() => {
    const t = document.querySelector('.tick');
    const s = t.querySelector('.tick__strike');
    const cs = getComputedStyle(t);
    const pcs = getComputedStyle(t.querySelector('.tick__problem'));
    const scs = getComputedStyle(s);
    const nums = (scs.clipPath.match(/[\d.]+px/g) || []).map(parseFloat);
    return {
      count: document.querySelectorAll('.tick').length,
      slots: document.querySelectorAll('.marquee__slot').length,
      size: parseFloat(cs.fontSize), family: cs.fontFamily.split(',')[0],
      stroke: pcs.webkitTextStrokeWidth, strokeColor: pcs.webkitTextStrokeColor, fill: pcs.color,
      thick: parseFloat(scs.height), color: scs.backgroundColor, cut: nums[0],
      toggle: !!document.querySelector('.ticker__toggle'),
    };
  });
  const angle = Math.atan(geo.thick / geo.cut) * 180 / Math.PI;
  check(geo.slots === 0, `client slots deleted (${geo.slots} left)`);
  check(Math.abs(geo.size - size) < 0.5, `phrase ${geo.size}px ${geo.family} (brief ${size})`);
  check(geo.stroke === '1.5px' && geo.fill === 'rgba(0, 0, 0, 0)', `outline ${geo.stroke} ${geo.strokeColor}, fill ${geo.fill}`);
  check(geo.thick === 3 && Math.abs(angle - 51.93) < 0.1, `strike ${geo.thick}px ${geo.color}, end cut ${geo.cut}px = ${angle.toFixed(2)} deg`);
  check(geo.toggle, 'pause control present');

  /* ---- the strike against the painted caps: paused, strike hidden ---- */
  await p.click('.ticker__toggle');
  await wait(400);
  const pick = await p.evaluate(() => {
    const v = document.querySelector('.ticker__view').getBoundingClientRect();
    const all = [...document.querySelectorAll('.tick[data-struck="true"]')]
      .map((el) => ({ el, r: el.querySelector('.tick__problem').getBoundingClientRect() }))
      /* Any struck phrase with at least 120px on screen clear of the toggle;
         the pixel rows below are clipped to that visible run. A long phrase
         left of centre at 1280 is rarely wholly in frame. */
      .filter(({ r }) => Math.min(r.right, v.right - 80) - Math.max(r.left, v.left) > 120);
    if (!all.length) return null;
    const { el, r } = all[0];
    el.id = 'tick-probe';
    const s = el.querySelector('.tick__strike').getBoundingClientRect();
    const f = el.querySelector('.tick__fix').getBoundingClientRect();
    return { box: [r.left, r.top, r.width, r.height], fix: [f.top, f.height], strikeMid: s.top + s.height / 2, vis: [Math.max(r.left, v.left), Math.min(r.right, v.right - 80)] };
  });
  if (pick) {
    await p.addStyleTag({ content: '#tick-probe .tick__strike { visibility: hidden }' });
    await wait(100);
    const im = PNG.sync.read(await p.screenshot({ type: 'png' }));
    const [, y0, , bh] = pick.box;
    let top = null, bottom = null;
    for (let y = Math.floor(y0 - 4); y < Math.ceil(y0 + bh + 4); y++) {
      let hit = 0;
      for (let x = Math.ceil(pick.vis[0]); x < Math.floor(pick.vis[1]); x++) {
        const i = (y * im.width + x) * 4;
        if (im.data[i] > 200 && im.data[i + 1] > 200 && im.data[i + 2] > 200) hit++;
      }
      if (hit > 2) { if (top === null) top = y; bottom = y; }
    }
    const mid = (top + bottom + 1) / 2;
    const pct = ((mid - y0) / bh) * 100;
    check(Math.abs(pick.strikeMid - mid) <= 1.5,
      `strike centre ${pick.strikeMid.toFixed(1)} vs painted caps ${top}..${bottom}, middle ${mid.toFixed(1)} (off ${(pick.strikeMid - mid).toFixed(1)}px; caps middle at ${pct.toFixed(1)}% of the line box)`);
    /* PAINTED CONTRAST, because the page walk cannot do these two. The
       problem's fill is transparent and its ink is a 1.5px stroke, so a DOM
       walk reads 1:1; and a moving phrase is rarely where a full-page capture
       expects it. Same method as contrast.mjs's pixel re-check: the modal
       pixel of the box is the ground, the brightest is the ink. Strike hidden,
       row paused. */
    const run = (ya, yb) => {
      const tally = new Map();
      let peak = 0;
      for (let y = Math.max(0, Math.floor(ya)); y < Math.min(im.height, Math.ceil(yb)); y++) {
        for (let x = Math.ceil(pick.vis[0]); x < Math.floor(pick.vis[1]); x++) {
          const i = (y * im.width + x) * 4;
          const l = L(im.data[i], im.data[i + 1], im.data[i + 2]);
          /* The ground is the modal DARK pixel. A 40px condensed phrase can
             be mostly glyph, and a plain mode then took white for the ground
             and read the fix at 1:1. */
          if (l < 0.2) {
            const k = `${im.data[i]},${im.data[i + 1]},${im.data[i + 2]}`;
            tally.set(k, (tally.get(k) || 0) + 1);
          }
          if (l > peak) peak = l;
        }
      }
      let best = null, n = 0;
      for (const [k, c] of tally) if (c > n) { best = k; n = c; }
      const g = best.split(',').map(Number);
      return { ratio: +CR(peak, L(g[0], g[1], g[2])).toFixed(2), ground: `rgb(${g.join(',')})` };
    };
    const probC = run(y0, y0 + bh);
    const fixC = run(pick.fix[0], pick.fix[0] + pick.fix[1]);
    check(probC.ratio >= 3, `outlined problem, painted: ${probC.ratio}:1 over ${probC.ground} (needs 3)`);
    check(fixC.ratio >= 3, `fix, painted: ${fixC.ratio}:1 over ${fixC.ground} (needs 3)`);
    await p.evaluate(() => document.getElementById('tick-probe').removeAttribute('id'));
  } else check(false, 'no struck phrase fully in view to measure');
  await p.click('.ticker__toggle');
  await p.mouse.move(2, 2);
  await wait(800);

  /* ---- base speed and crossings ---- */
  const rest = await sample(p, 3000);
  const vRest = median(rest.speeds.map((s) => s[1]));
  check(Math.abs(vRest - 60) < 6, `base ${vRest} px/s (60)`);
  check(rest.missed === 0, `no visible phrase left of centre unstruck (${rest.missed} frame-hits)`);
  check(rest.lag <= 34, `crossings ${rest.crossings}, strike state within ${rest.lag}ms of the crossing frame`);

  /* Clip rectangles are DOCUMENT coordinates in this puppeteer: a viewport y
     captured the hero. */
  const shot = await p.$eval('.ticker', (e) => { const r = e.getBoundingClientRect(); return { x: 0, y: r.top + window.scrollY, width: window.innerWidth, height: r.height }; });
  await p.screenshot({ path: `${out}/ticker-${w}.png`, clip: shot });

  /* ---- scroll ---- */
  const sp = sample(p, 3500);
  await wait(150);
  await flick(p);
  const scroll = await sp;
  const peak = Math.max(...scroll.speeds.map((s) => Math.abs(s[1])));
  const peakAt = scroll.speeds.find((s) => Math.abs(s[1]) === peak)[0];
  const back = scroll.speeds.find((s) => s[0] > peakAt && Math.abs(s[1] - 60) <= 6);
  check(peak > 90 && peak <= 360 * 1.05, `scroll peak ${peak} px/s at ${peakAt}ms (ceiling 360)`);
  check(!!back && back[0] - peakAt <= 1500, `back to base ${back ? back[0] - peakAt : 'never'}ms after the peak (decay 1.2s)`);
  check(scroll.missed === 0, `scroll: no visible phrase left of centre unstruck (${scroll.missed})`);
  await centre(p);

  /* ---- throw ---- */
  const tp = sample(p, 3000);
  await wait(150);
  await throwLeft(p);
  const thr = await tp;
  const tPeak = Math.max(...thr.speeds.map((s) => s[1]));
  const tail = thr.speeds.filter((s) => s[0] > 400 && s[0] < 1200).map((s) => s[1]);
  const settled = median(thr.speeds.filter((s) => s[0] > 2400).map((s) => s[1]));
  check(tPeak > 600, `throw peak ${tPeak} px/s leftward`);
  check(tail.some((v) => v > 80), `inertia after release: ${tail.slice(0, 5).join(', ')} px/s`);
  check(Math.abs(settled - 60) < 8, `settled back to ${settled} px/s`);
  check(thr.missed === 0, `throw: no visible phrase left of centre unstruck (${thr.missed})`);

  /* ---- the recording ---- */
  if (w === 1280 && FF) {
    await centre(p);
    const rec = await p.screencast({ path: `${out}/ticker-scroll-throw.webm`, ffmpegPath: FF });
    await wait(1000);
    await flick(p);
    await wait(2000);
    await centre(p);
    await throwLeft(p);
    await wait(1200);
    await rec.stop();
    console.log(`  recorded ${out}/ticker-scroll-throw.webm`);
  }
  await b.close();

  /* ---- reduced motion ---- */
  const rb = await puppeteer.launch({ headless: 'new', args });
  const rp = await rb.newPage();
  await rp.setViewport({ width: w, height: h });
  await rp.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await rp.goto(base + '/', { waitUntil: 'networkidle0' });
  await rp.evaluate(() => document.fonts.ready);
  await centre(rp);
  const red = await rp.evaluate(() => {
    const ticks = [...document.querySelectorAll('.tick')];
    return {
      n: ticks.length,
      struck: ticks.filter((t) => t.dataset.struck === 'true').length,
      strikeDrawn: ticks.filter((t) => new DOMMatrix(getComputedStyle(t.querySelector('.tick__strike')).transform).a === 1).length,
      fixShown: ticks.filter((t) => getComputedStyle(t.querySelector('.tick__fix')).opacity === '1').length,
      moved: ticks.filter((t) => t.style.transform).length,
      toggle: !!document.querySelector('.ticker__toggle'),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  check(red.n === 5 && red.struck === 5 && red.strikeDrawn === 5 && red.fixShown === 5,
    `reduced: ${red.n} phrases, ${red.struck} struck, ${red.strikeDrawn} strikes drawn, ${red.fixShown} fixes shown`);
  check(red.moved === 0 && !red.toggle && !red.overflow, `reduced: ${red.moved} translated, toggle ${red.toggle}, page overflow ${red.overflow}`);

  /* The capture BEFORE the probe below scrolls the page and hides a strike. */
  const rshot = await rp.$eval('.ticker', (e) => { const r = e.getBoundingClientRect(); return { x: 0, y: r.top + window.scrollY, width: window.innerWidth, height: r.height }; });
  await rp.screenshot({ path: `${out}/ticker-reduced-${w}.png`, clip: rshot });

  /* No fix may overlap another item's problem, or its own. */
  const overlaps = await rp.evaluate(() => {
    const boxes = [...document.querySelectorAll('.tick')].map((t) => ({
      fix: t.querySelector('.tick__fix').getBoundingClientRect(),
      prob: [...t.querySelector('.tick__problem').getClientRects()],
    }));
    const hit = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
    let n = 0;
    for (const a of boxes) for (const b of boxes) for (const r of b.prob) if (hit(a.fix, r)) n++;
    return n;
  });
  check(overlaps === 0, `reduced: ${overlaps} fix/problem overlaps`);

  /* Every static phrase inside the frame: the section clips, so page overflow
     alone would not see a phrase cut off at the edge. */
  const fit = await rp.evaluate(() => {
    const view = document.querySelector('.ticker__view');
    const v = view.getBoundingClientRect();
    const right = v.right - parseFloat(getComputedStyle(view).paddingRight);
    return [...document.querySelectorAll('.tick__problem')].map((e) => {
      const rs = [...e.getClientRects()];
      return { lines: rs.length, over: +(Math.max(...rs.map((r) => r.right)) - right).toFixed(1) };
    });
  });
  check(fit.every((f) => f.over <= 1), `reduced: every phrase inside the frame (lines/overrun: ${fit.map((f) => `${f.lines}/${f.over}`).join(', ')})`);

  /* The line-through against the painted caps, on every line of the longest
     phrase: the line's rows by difference (below), white rows with the line
     made transparent. */
  await rp.evaluate(() => {
    const e = [...document.querySelectorAll('.tick__problem')].sort((a, b) => b.textContent.length - a.textContent.length)[0];
    e.id = 'rm-probe';
    e.scrollIntoView({ block: 'center' });
  });
  await wait(400);
  const rects = await rp.$eval('#rm-probe', (e) => [...e.getClientRects()].map((r) => [r.left, r.top, r.width, r.height]));
  const withLine = PNG.sync.read(await rp.screenshot({ type: 'png' }));
  await rp.addStyleTag({ content: '#rm-probe { background-image: none !important }' });
  await wait(150);
  const noLine = PNG.sync.read(await rp.screenshot({ type: 'png' }));
  const rows = (im, [x0, y0, bw, bh], test) => {
    let a = null, z = null;
    /* The fragment's own rows and no margin: wrapped lines are 0.9em apart and
       their fragments 0.925em tall, so any margin reads the next line's caps. */
    for (let y = Math.max(0, Math.ceil(y0)); y < Math.min(im.height, Math.floor(y0 + bh)); y++) {
      let hit = 0;
      for (let x = Math.max(0, Math.ceil(x0)); x < Math.min(im.width, Math.floor(x0 + bw)); x++) {
        const i = (y * im.width + x) * 4;
        if (test(im.data[i], im.data[i + 1], im.data[i + 2])) hit++;
      }
      if (hit > 3) { if (a === null) a = y; z = y; }
    }
    return [a, z];
  };
  /* THE LINE IS FOUND BY DIFFERENCE, 2026-09-24. It was found by colour -
     yellow rows - and the strike went bone with the quiet pass, the same
     colour as the outline, so a colour test found nothing and returned NaN.
     A row is the line's where a third of the fragment's width is bright with
     the line and was not without it. */
  const lineRows = ([x0, y0, bw, bh]) => {
    let a = null, z = null;
    for (let y = Math.max(0, Math.ceil(y0)); y < Math.min(withLine.height, Math.floor(y0 + bh)); y++) {
      let hit = 0;
      for (let x = Math.max(0, Math.ceil(x0)); x < Math.min(withLine.width, Math.floor(x0 + bw)); x++) {
        const i = (y * withLine.width + x) * 4;
        if (withLine.data[i] > 200 && noLine.data[i] < 120) hit++;
      }
      if (hit > bw / 3) { if (a === null) a = y; z = y; }
    }
    return [a, z];
  };
  const offs = rects.map((r) => {
    const [ya, yz] = lineRows(r);
    const [ca, cz] = rows(noLine, r, (R, G, B) => R > 200 && G > 200 && B > 200);
    return ya === null || ca === null ? NaN : +(((ya + yz + 1) / 2) - ((ca + cz + 1) / 2)).toFixed(1);
  });
  check(offs.every((o) => Math.abs(o) <= 2), `reduced: line-through vs painted caps middle, per line: ${offs.join(', ')}px`);
  await rb.close();
}

console.log(fail ? `\n${fail} FAILED` : '\nticker passes');
process.exit(fail ? 1 : 0);

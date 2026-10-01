// The Recent work track's behaviour (the six fixes, 2026-10-02): drag with
// inertia, horizontal wheel moves it, vertical wheel does not, arrows move a
// plate, the rail follows, links open in a new tab, a drag does not click,
// reduced motion lands without easing, and touch is native scroll with snap.
import puppeteer from 'puppeteer';
const base = process.argv[2] || 'http://localhost:4173';
const b = await puppeteer.launch({ headless: 'new' });
const out = {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function page(reduce) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await p.goto(base + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.querySelector('.rt__view').scrollIntoView({ block: 'center' }));
  await sleep(600);
  return p;
}
const x = (p) => p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.rt__track')).transform).m41);
const seg = (p) => p.evaluate(() => { const s = document.querySelector('.rt__seg'); return { w: s.style.width, t: s.style.transform }; });
const box = async (p) => p.evaluate(() => { const r = document.querySelector('.rt__view').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });

let p = await page(false);
out.mode = await p.evaluate(() => document.querySelector('.rt__view').dataset.mode);
out.links = await p.evaluate(() => [...document.querySelectorAll('.rt__plate')].map((a) => `${a.target} ${a.rel} ${a.href}`));
out.rail0 = await seg(p);
let c = await box(p);
await p.mouse.move(c.x, c.y);
out.cueOn = await p.evaluate(() => document.querySelector('.rt__cue').dataset.on);
await p.mouse.down();
for (let i = 1; i <= 10; i++) { await p.mouse.move(c.x - i * 30, c.y); await sleep(16); }
const atRelease = await x(p);
await p.mouse.up();
await sleep(1200);
out.drag = { atRelease: Math.round(atRelease), settled: Math.round(await x(p)) };
out.railAfterDrag = await seg(p);
const before = await x(p);
await p.mouse.wheel({ deltaY: 300 });
await sleep(800);
out.verticalWheel = { trackMoved: Math.round((await x(p)) - before), pageY: await p.evaluate(() => scrollY) };
await p.evaluate(() => document.querySelector('.rt__view').scrollIntoView({ block: 'center' }));
await sleep(300);
c = await box(p);
await p.mouse.move(c.x, c.y);
const b2 = await x(p);
await p.mouse.wheel({ deltaX: 200 });
await sleep(900);
out.horizontalWheel = Math.round((await x(p)) - b2);
await p.focus('.rt__view');
const b3 = await x(p);
await p.keyboard.press('ArrowRight');
await sleep(900);
out.arrowRight = Math.round((await x(p)) - b3);
out.plateStep = await p.evaluate(() => document.querySelector('.rt__item').getBoundingClientRect().width + 24);
// a drag must not open a link
const pagesBefore = (await b.pages()).length;
await p.mouse.move(c.x, c.y); await p.mouse.down();
for (let i = 1; i <= 6; i++) { await p.mouse.move(c.x + i * 20, c.y); await sleep(16); }
await p.mouse.up(); await sleep(500);
out.dragOpenedTab = (await b.pages()).length > pagesBefore;
await p.close();

p = await page(true);
c = await box(p);
await p.mouse.move(c.x, c.y);
await p.mouse.down();
for (let i = 1; i <= 10; i++) { await p.mouse.move(c.x - i * 30, c.y); await sleep(16); }
const r1 = await x(p);
await p.mouse.up();
await sleep(600);
out.reduced = { atRelease: Math.round(r1), settled: Math.round(await x(p)), imgTransition: await p.evaluate(() => getComputedStyle(document.querySelector('.rt__img')).transitionDuration) };
await p.close();

p = await b.newPage();
await p.emulate({ viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, userAgent: 'Mozilla/5.0 (iPhone)' });
await p.goto(base + '/', { waitUntil: 'networkidle0' });
out.touch = await p.evaluate(() => { const v = document.querySelector('.rt__view'); const cs = getComputedStyle(v); return { mode: v.dataset.mode, overflowX: cs.overflowX, snap: cs.scrollSnapType, scrollbar: cs.scrollbarWidth, cue: !!document.querySelector('.rt__cue') }; });
await p.evaluate(() => { const v = document.querySelector('.rt__view'); v.scrollLeft = v.scrollWidth; });
await sleep(400);
out.touchRailEnd = await seg(p);
await b.close();
console.log(JSON.stringify(out, null, 1));

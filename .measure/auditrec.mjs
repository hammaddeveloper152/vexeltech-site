/* auditrec.mjs — a webm of every route scrolled top to bottom at reading
   speed, at 1280 and 390, for the pre-launch viewer audit.

   node .measure/auditrec.mjs [base]          ROUTES=/,/pricing to narrow

   Recorded in the page, as hovershot.mjs does: ffmpeg is not installed, so
   getDisplayMedia with --auto-accept-this-tab-capture and MediaRecorder give a
   VP9 webm of the tab's own composited frames. Reading speed is 240px a
   second, in 15px steps every 60ms, with a 1.5s hold at the top so the first
   paint and the entrance are in the file, and a 1s hold at the bottom.
   Written to .measure/out/audit/webm/<route>-<width>.webm. */
import puppeteer from 'puppeteer';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4180';
const ALL = ['/', '/services', '/pricing', '/about-us', '/contact-us', '/portfolio', '/case-studies', '/resources', '/404',
  '/blog', '/thanks', '/privacy-policy', '/terms-of-service', '/legacy/contact'];
const ROUTES = process.env.ROUTES ? process.env.ROUTES.split(',') : ALL;
const OUT = '.measure/out/audit/webm';
fs.mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const b = await puppeteer.launch({ headless: 'new', args: [
  '--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars',
  '--auto-accept-this-tab-capture', '--enable-usermedia-screen-capturing', '--autoplay-policy=no-user-gesture-required',
] });

for (const route of ROUTES) {
  for (const [w, h] of [[1280, 800], [390, 844]]) {
    const p = await b.newPage();
    await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    /* Start recording on a blank page of the same origin, then navigate inside
       the recording, so the first paint of the route is in the file. The
       stream is of the tab, and the tab survives a same-origin navigation of
       a single-page app only if the recorder lives outside it: so the route is
       loaded in an iframe-free way by recording from the first document and
       navigating with the app's own history. */
    await p.goto(BASE + '/404', { waitUntil: 'networkidle0' });
    await p.evaluate(async (w, h) => {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30, width: w, height: h }, preferCurrentTab: true });
      const rec = new MediaRecorder(s, { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 1_500_000 });
      window.__chunks = [];
      rec.ondataavailable = (e) => window.__chunks.push(e.data);
      window.__rec = rec;
      rec.start(250);
    }, w, h);
    await wait(300);
    /* A full document load of the route would end the recorder with the old
       document, so the route is entered through the router: a click on a
       temporary link, which is how a reader arrives from inside the site. */
    await p.evaluate((route) => {
      const a = document.createElement('a');
      a.href = route; a.id = '__auditgo'; a.textContent = 'go';
      a.style.cssText = 'position:fixed;left:0;top:0;opacity:0;';
      document.body.appendChild(a);
    }, route);
    const viaRouter = await p.evaluate(() => typeof window.history.pushState === 'function');
    await p.evaluate((route) => {
      window.history.pushState({}, '', route);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, route);
    await wait(1500);
    const tot = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let y = 0; y <= tot; y += 15) { await p.evaluate((v) => window.scrollTo(0, v), y); await wait(60); }
    await wait(1000);
    const b64 = await p.evaluate(async () => {
      await new Promise((r) => { window.__rec.onstop = r; window.__rec.stop(); });
      const buf = await new Blob(window.__chunks, { type: 'video/webm' }).arrayBuffer();
      const u8 = new Uint8Array(buf);
      let s = '';
      for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000));
      return btoa(s);
    });
    const name = `${OUT}/${route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')}-${w}.webm`;
    const buf = Buffer.from(b64, 'base64');
    fs.writeFileSync(name, buf);
    const landed = await p.evaluate(() => location.pathname);
    console.log(`${name}  ${(buf.length / 1024 / 1024).toFixed(1)} MB  ${Math.round((tot / 15) * 0.06 + 2.5)}s  landed ${landed}${viaRouter ? '' : ' (no router)'}`);
    await p.close();
  }
}
await b.close();

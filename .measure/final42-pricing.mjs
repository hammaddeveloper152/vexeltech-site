/* final42-pricing.mjs (FINAL42, the founder): /pricing's one call. At 1280
   and 390, motion allowed: click it, sample the scroll every 100ms (it must
   travel, not jump), and read the focused element once the scroll ends (the
   form's first field). Then the keyboard order through the page's grid
   section and on to the form.
     node .measure/final42-pricing.mjs [base]   (default http://localhost:4190) */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
for (const w of [1280, 390]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: w === 390 ? 844 : 800 });
  await p.goto(BASE + '/pricing', { waitUntil: 'networkidle0' });
  const cta = await p.$('.pr-grid__cta');
  await cta.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  await wait(400);
  const box = await p.evaluate(() => {
    const r = document.querySelector('.pr-grid__cta').getBoundingClientRect();
    const g = document.querySelector('.pr-grid__cols').getBoundingClientRect();
    return { h: Math.round(r.height), centre: Math.round(r.left + r.width / 2), gridCentre: Math.round(g.left + g.width / 2) };
  });
  const ys = [];
  await cta.click();
  for (let i = 0; i < 14; i += 1) {
    ys.push(await p.evaluate(() => Math.round(scrollY)));
    await wait(100);
  }
  await wait(600);
  const r = await p.evaluate(() => {
    const a = document.activeElement;
    const form = document.getElementById('form').getBoundingClientRect();
    return { focused: `${a.tagName.toLowerCase()}#${a.id}`, formTop: Math.round(form.top), hash: location.hash };
  });
  console.log(`@${w} button ${box.h}px tall, centre ${box.centre} vs grid ${box.gridCentre}; scroll ${ys.join(' > ')}; focused ${r.focused}; form top ${r.formTop}px; ${r.hash}`);
  await p.close();
}
{
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 800 });
  await p.goto(BASE + '/pricing', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.querySelector('.pr-grid__cols').scrollIntoView());
  await p.evaluate(() => {
    const first = document.querySelector('.pr-col .pr-col__more');
    const all = [...document.querySelectorAll('a, button, input, textarea')];
    all[all.indexOf(first) - 1].focus();
  });
  const order = [];
  for (let i = 0; i < 9; i += 1) {
    await p.keyboard.press('Tab');
    order.push(
      await p.evaluate(() => {
        const a = document.activeElement;
        return (a.innerText || a.getAttribute('aria-label') || a.id || a.tagName).replace(/\s+/g, ' ').trim().slice(0, 28);
      })
    );
  }
  console.log('keyboard on /pricing from the grid:', order.join(' > '));
  await p.close();
}
await b.close();

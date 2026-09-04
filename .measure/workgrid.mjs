import { open } from './lib.mjs';
const { browser, page } = await open(1280, 800);
const g = await page.evaluate(() => {
  document.querySelector('.work').scrollIntoView();
  return {
    plates: document.querySelectorAll('.work__plate').length,
    videos: document.querySelectorAll('.work__video').length,
    indices: Array.from(document.querySelectorAll('.work__item')).length,
    heading: getComputedStyle(document.querySelector('.work__h')).color,
    /* with no files in the tree every plate must be the empty state */
    firstPlateBox: (() => {
      const p = document.querySelector('.work__plate');
      const link = p.closest('.work__link');
      const a = p.getBoundingClientRect(), b = link.getBoundingClientRect();
      return { plate: [Math.round(a.width), Math.round(a.height)], link: [Math.round(b.width), Math.round(b.height)] };
    })(),
  };
});
console.log('WORK GRID', g);
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: '.measure/workgrid.png' });
await browser.close();

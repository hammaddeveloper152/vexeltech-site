import { open } from './lib.mjs';

/* Reduced motion and the dead-override check, after every change. */
{
  const { browser, page } = await open(1280, 800, { reduced: true });
  const r = await page.evaluate(() => {
    document.querySelector('.marquee').scrollIntoView();
    return {
      marqueeControl: !!document.querySelector('.marquee__toggle'),
      marqueeTrack: getComputedStyle(document.querySelector('.marquee__track')).animationName,
      litSteps: document.querySelectorAll('.process__step[data-lit="true"]').length,
      litColour: getComputedStyle(document.querySelector('.process__n-lit')).color,
      skip: !!document.querySelector('.skip'),
      barBg: getComputedStyle(document.querySelector('.bar')).backgroundColor,
    };
  });
  console.log('reduced motion:', r);
  await browser.close();
}
{
  const { browser, page } = await open(1280, 800);
  const d = await page.evaluate(() => ({
    vtLightNodes: document.querySelectorAll('.vt--light').length,
    vtLightRules: Array.from(document.styleSheets).some((s) => {
      try { return Array.from(s.cssRules).some((r) => (r.selectorText || '').includes('vt--light')); }
      catch { return false; }
    }),
    /* every element still claiming machine yellow, anywhere on the page */
    yellow: Array.from(document.querySelectorAll('*')).filter((el) => {
      const c = getComputedStyle(el);
      return /240, 179, 35/.test(c.color) || /240, 179, 35/.test(c.backgroundColor) || /240, 179, 35/.test(c.fill);
    }).map((el) => (el.className.baseVal !== undefined ? el.className.baseVal : el.className) || el.tagName),
  }));
  console.log('dead overrides:', { vtLightNodes: d.vtLightNodes, vtLightRules: d.vtLightRules });
  console.log('elements painting machine yellow:', [...new Set(d.yellow)]);
  await browser.close();
}

import { open, scrollTo } from './lib.mjs';
import fs from 'node:fs';

for (const [W, H] of [[1280, 800], [390, 844]]) {
  const { browser, page } = await open(W, H);

  const glyph = await page.evaluate(() => {
    const c = document.createElement('canvas').getContext('2d');
    const w = (font, ch) => { c.font = `400 200px ${font}`; return c.measureText(ch).width; };
    const probe = (ch) => ({
      ch,
      monigue: w("Monigue", ch),
      narrow: w("'Arial Narrow'", ch),
      arial: w("Arial", ch),
    });
    return {
      loaded: document.fonts.check('400 128px Monigue'),
      // A face that lacks a glyph falls through the stack, so an advance width
      // identical to the fallback's is the tell.
      marks: ['\u201C', '\u201D', '"', 'A'].map(probe),
    };
  });

  const box = await page.evaluate(() => {
    const el = document.querySelector('.quotes');
    el.scrollIntoView();
    const q = document.querySelector('.quotes__slide[data-active="true"]');
    const mark = q.querySelector('.quotes__mark');
    const r = mark.getBoundingClientRect();
    const cs = getComputedStyle(mark);
    const s = el.getBoundingClientRect();
    return {
      section: { top: s.top + window.scrollY, h: s.height },
      mark: { w: r.width, h: r.height, fontSize: cs.fontSize, family: cs.fontFamily.split(',')[0], color: cs.color },
      count: (() => {
        const c = document.querySelector('.quotes__count');
        const k = getComputedStyle(c);
        return { fontSize: k.fontSize, family: k.fontFamily.split(',')[0], color: k.color };
      })(),
    };
  });

  await scrollTo(page, Math.max(0, box.section.top - 40));
  await page.screenshot({ path: `.measure/quotes-${W}.png` });

  console.log(`\n=== ${W}x${H} ===`);
  console.log('Monigue loaded:', glyph.loaded);
  for (const m of glyph.marks) {
    const fellBack = Math.abs(m.monigue - m.narrow) < 0.01 || Math.abs(m.monigue - m.arial) < 0.01;
    console.log(`  U+${m.ch.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')} "${m.ch}"  monigue ${m.monigue.toFixed(1)}  arialNarrow ${m.narrow.toFixed(1)}  arial ${m.arial.toFixed(1)}  ${fellBack ? 'FELL BACK' : 'in face'}`);
  }
  console.log('mark:', box.mark);
  console.log('count:', box.count);
  console.log('section height:', Math.round(box.section.h));
  await browser.close();
}

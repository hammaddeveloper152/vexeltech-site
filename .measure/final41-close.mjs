/* final41-close.mjs (FINAL41, 2026-10-08, the founder): About's yellow
   close field and its inverted call. At 1280 and 390, the call's fill,
   text, transform, outline and shadow at rest, under the pointer, pressed
   and on keyboard focus, and every control on every route that stands on
   a yellow ground. Writes about-close-1280.png and about-close-390.png
   (at rest) into .measure/out/final41/.
     node .measure/final41-close.mjs [base]   (default http://localhost:4190) */
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const OUT = path.join('.measure', 'out', 'final41');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({ headless: 'new' });
const SEL = '.callband--field .callband__cta';
for (const w of [1280, 390]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: 844 });
  await p.goto(BASE + '/about-us', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: '.bar, .skip { visibility: hidden !important; }' });
  await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), SEL);
  await wait(400);
  const read = () =>
    p.evaluate((s) => {
      const cs = getComputedStyle(document.querySelector(s));
      return `fill ${cs.backgroundColor}, text ${cs.color}, ${cs.transform}, outline ${cs.outlineStyle === 'none' ? 'none' : `${cs.outlineWidth} ${cs.outlineColor} +${cs.outlineOffset}`}, shadow ${cs.boxShadow}`;
    }, SEL);
  const rest = await read();
  const field = await p.$('.callband--field');
  await field.screenshot({ path: path.join(OUT, `about-close-${w}.png`) });
  await p.hover(SEL);
  await wait(300);
  const hov = await read();
  await p.mouse.down();
  await wait(150);
  const down = await read();
  await p.mouse.move(1, 1);
  await p.mouse.up();
  await wait(300);
  /* Keyboard focus: a key press puts the page in keyboard modality, so
     focusing the call then matches :focus-visible, as a Tab onto it does. */
  await p.keyboard.press('Shift');
  await p.focus(SEL);
  await wait(200);
  const foc = await read();
  console.log(`@${w}\n  rest    ${rest}\n  hover   ${hov}\n  press   ${down}\n  focus   ${foc}`);
  await p.close();
}
await b.close();

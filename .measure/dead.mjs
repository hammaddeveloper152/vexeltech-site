/* Did the deleted rules ever match anything? A deletion can only change a
   painted pixel if some element matched the selector.

   The selector is an argument now, 2026-09-14. It was written for the `.tier*`
   removal with that question built in, and the rhythm pass needed the same
   proof for a different set of classes. With no argument it asks exactly what
   it always asked, so the recorded `.tier*` result still re-runs unchanged.

     node .measure/dead.mjs                          the original .tier* check
     node .measure/dead.mjs ".band-glass, .fail__rail"   any selector list */
import puppeteer from 'puppeteer';
const SELECTOR = process.argv[2] || null;
const ROUTES=['/','/services','/pricing','/about-us','/contact-us','/resources','/portfolio','/case-studies','/blog'];
const b=await puppeteer.launch({headless:'new',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
let total=0;
for (const w of [1280,390]) {
 for (const r of ROUTES) {
  const p=await b.newPage(); await p.setViewport({width:w,height:900});
  await p.goto('http://localhost:4179'+r,{waitUntil:'domcontentloaded'});
  await new Promise(t=>setTimeout(t,1500));
  /* open every conditional surface first, so a state-only rule cannot hide */
  await p.evaluate(()=>{document.querySelectorAll('.plate').forEach(e=>e.click());
    const l=document.querySelector('.card__price--live'); if(l) l.click();
    document.querySelectorAll('.tabs__radio').forEach(e=>{e.checked=true;});});
  const hits=await p.evaluate((sel)=>{
    const q=sel
      ? [...document.querySelectorAll(sel)]
      : [...document.querySelectorAll('[class*="tier"]')]
          .filter(e=>![...e.classList].every(c=>c==='tiers__route'));
    return q.map(e=>e.className.toString());}, SELECTOR);
  if (hits.length) { console.log(`  ${w} ${r}: ${hits.length} — ${hits.slice(0,4).join(' | ')}`); total+=hits.length; }
  await p.close();
 }
}
console.log(total===0
  ? 'No element on any route, at either width, in any state, carries a deleted `.tier*` class.'
  : `${total} elements still match a deleted rule — THE DELETION CHANGED THE PAGE.`);
await b.close();

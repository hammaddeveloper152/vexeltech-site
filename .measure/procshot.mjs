/* procshot.mjs — the Process route drawn to step 02, at both widths.

   THE TWO-STEP WINDOW IS ABOVE THE SECTION'S OWN TOP. The route's trigger
   starts at `top 70%` of the step LIST, so it is already drawing before the
   section has finished entering the viewport; a scan that starts at the
   section's top finds three steps lit and never two. */
import puppeteer from 'puppeteer';
const b=await puppeteer.launch({headless:'new',
  args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--force-color-profile=srgb','--font-render-hinting=none']});
for (const [w,h] of [[1280,900],[390,844]]) {
 const p=await b.newPage(); await p.setViewport({width:w,height:h});
 await p.goto('http://localhost:4179/',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,2500));
 const listTop=await p.evaluate(()=>Math.round(
   document.querySelector('.process__steps').getBoundingClientRect().top+scrollY));
 let found=null;
 for(let y=listTop-900; y<listTop+400; y+=25){
   await p.evaluate(v=>{document.scrollingElement.scrollTop=Math.max(0,v);},y);
   await new Promise(r=>setTimeout(r,150));
   const n=await p.evaluate(()=>[...document.querySelectorAll('.process__step')]
     .filter(e=>e.dataset.lit==='true').length);
   if(n===2){found=y;break;}
 }
 if(found===null){console.log(w,'no two-step position'); await p.close(); continue;}
 await p.evaluate(v=>{document.scrollingElement.scrollTop=v;},found);
 await new Promise(r=>setTimeout(r,900));
 console.log(w, JSON.stringify(await p.evaluate(()=>({
   lit:[...document.querySelectorAll('.process__step')].map(e=>e.dataset.lit==='true'?1:0).join(''),
   stroke:getComputedStyle(document.querySelector('.process__passed')).stroke,
   ahead:getComputedStyle(document.querySelector('.process__lit')).strokeWidth}))));
 const clip=await p.evaluate(()=>{const r=document.querySelector('.process').getBoundingClientRect();
   return {x:0,y:Math.max(0,r.top+scrollY),width:innerWidth,height:Math.round(r.height)};});
 await p.screenshot({path:`.measure/out/agency/proc-${w}.png`,clip});
 await p.close();
}
await b.close();

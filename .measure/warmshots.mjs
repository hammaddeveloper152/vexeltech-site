/* warmshots.mjs — the three frames the warm surfaces changed: the About
   plates at rest and with one open, and the pricing ladder at 1280. */
import puppeteer from 'puppeteer';
const b=await puppeteer.launch({headless:'new',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--force-color-profile=srgb','--font-render-hinting=none']});
const shot=async(route,sel,file,open,pad=140)=>{
 const p=await b.newPage(); await p.setViewport({width:1280,height:900});
 await p.goto('http://localhost:4179'+route,{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,2500));
 await p.evaluate((s,pd)=>{const e=document.querySelector(s);
   document.scrollingElement.scrollTop=e.getBoundingClientRect().top+scrollY-pd;},sel,pad);
 await new Promise(r=>setTimeout(r,600));
 console.log(file,'scrollY',await p.evaluate(()=>Math.round(scrollY)),
   'plates top',await p.evaluate(s=>Math.round(document.querySelector(s).getBoundingClientRect().top),sel));
 if(open){ await p.evaluate(o=>document.querySelector(o).click(),open); await new Promise(r=>setTimeout(r,700)); }
 /* Puppeteer's clip is in DOCUMENT coordinates, not viewport ones — with
    captureBeyondViewport on, a viewport-relative y captures the top of the
    page and looks like a scroll that did not happen. */
 const clip=await p.evaluate((s,pd)=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();
   return {x:0,y:r.top+scrollY-pd,width:innerWidth,height:r.height+pd*2};},sel,pad);
 await p.screenshot({path:file,clip});
 await p.close();
};
await shot('/about-us','.plates','.measure/out/agency/name-plates-1280.png','.plate');
await shot('/pricing','.cards','.measure/out/agency/name-pricing-1280.png',null,120);
await shot('/','.services__card','.measure/out/agency/name-services-1280.png',null,120);
await b.close();
console.log('ok');

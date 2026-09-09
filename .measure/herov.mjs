import fs from 'node:fs';
import puppeteer from 'puppeteer';
const OUT='.measure/out/hero'; fs.mkdirSync(OUT,{recursive:true});
const V=[['base','/'],['a','/?hero=a'],['b','/?hero=b'],['c','/?hero=c']];
const b=await puppeteer.launch({headless:'new'});
for(const [W,H] of [[1280,800],[390,844]]){
 for(const [name,route] of V){
  const p=await b.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e).split('\n')[0]));
  await p.setViewport({width:W,height:H});
  await p.goto('http://localhost:5173'+route,{waitUntil:'networkidle0'});
  await p.evaluate(()=>document.fonts.ready);
  await new Promise(r=>setTimeout(r,3000));
  await p.screenshot({path:`${OUT}/${W}-hero-${name}.png`});
  const m=await p.evaluate(()=>{
   const g=s=>{const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect();
    return {w:Math.round(r.width),h:Math.round(r.height),area:Math.round(r.width*r.height)};};
   return {headline:g('.hero__headline'), plate:g('.hero__plate'), note:g('.hero__note'),
           heroH:Math.round(document.querySelector('.hero').getBoundingClientRect().height),
           overflow:document.documentElement.scrollWidth>innerWidth};
  });
  console.log(`${W} ${name.padEnd(5)} headline ${m.headline.w}x${m.headline.h} (${m.headline.area}px2)  plate ${m.plate?m.plate.w+'x'+m.plate.h+' ('+m.plate.area+'px2)':'none'}  ov=${m.overflow}${errs.length?' ERR '+errs:''}`);
  await p.close();
 }
}
await b.close();

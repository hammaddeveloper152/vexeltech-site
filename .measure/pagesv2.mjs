import fs from 'node:fs';
import puppeteer from 'puppeteer';
const OUT='.measure/out/v2'; fs.mkdirSync(OUT,{recursive:true});
const PAGES=[['about','/about-us'],['services','/services'],['pricing-base','/pricing'],
             ['pricing-lead','/pricing?tiers=lead'],['pricing-headline','/pricing?tiers=headline'],
             ['portfolio','/portfolio']];
const b=await puppeteer.launch({headless:'new'});
for (const [W,H] of [[1280,800],[390,844]]) {
  for (const [name,route] of PAGES) {
    const p=await b.newPage();
    const errs=[]; p.on('pageerror',e=>errs.push(String(e).split('\n')[0]));
    await p.setViewport({width:W,height:H,deviceScaleFactor:1});
    await p.goto('http://localhost:5173'+route,{waitUntil:'networkidle0'});
    await p.evaluate(()=>document.fonts.ready);
    await new Promise(r=>setTimeout(r,1500));
    const docH=await p.evaluate(()=>document.documentElement.scrollHeight);
    const frames=Math.min(Math.ceil(docH/H),7);
    for(let i=0;i<frames;i++){
      await p.evaluate(t=>window.scrollTo(0,t),Math.min(i*H,docH-H));
      await new Promise(r=>setTimeout(r,420));
      await p.screenshot({path:`${OUT}/${W}-${name}-${i}.png`});
    }
    console.log(`${W} ${name.padEnd(18)} doc=${docH} frames=${frames}${errs.length?'  ERRORS '+errs:''}`);
    await p.close();
  }
}
await b.close();

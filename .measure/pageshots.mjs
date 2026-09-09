import fs from 'node:fs';
import puppeteer from 'puppeteer';
const BASE='http://localhost:5173';
const OUT='.measure/out/pages'; fs.mkdirSync(OUT,{recursive:true});
const PAGES=[['services','/services'],['pricing','/pricing'],['portfolio','/portfolio'],['about','/about-us'],['contact','/contact-us']];
const b=await puppeteer.launch({headless:'new'});
for (const [W,H] of [[1280,800],[390,844]]) {
  for (const [name,route] of PAGES) {
    const p=await b.newPage();
    await p.setViewport({width:W,height:H,deviceScaleFactor:1});
    await p.goto(BASE+route,{waitUntil:'networkidle0'});
    await p.evaluate(()=>document.fonts.ready);
    await new Promise(r=>setTimeout(r,1200));
    const docH=await p.evaluate(()=>document.documentElement.scrollHeight);
    const frames=Math.min(Math.ceil(docH/H),8);
    for(let i=0;i<frames;i++){
      const y=Math.min(i*H,docH-H);
      await p.evaluate(t=>window.scrollTo(0,t),y);
      await new Promise(r=>setTimeout(r,450));
      await p.screenshot({path:`${OUT}/${W}-${name}-${i}.png`});
    }
    console.log(`${W} ${name} doc=${docH} frames=${frames}`);
    await p.close();
  }
}
await b.close();

/* heroink.mjs — hero text against the LIT SURFACE, measured off painted pixels.

   The standard contrast walk composites background-colour up the DOM. The hero
   surface is a <canvas> SIBLING of the copy, so no DOM walk can see it and
   every pair passes on paper. This hides the copy, samples the brightest
   ground under each text box across ten frames, and measures against that. */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
const lin=(c)=>{c/=255;return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4;};
const L=(r,g,b)=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const CR=(a,b)=>{const l1=Math.max(a,b),l2=Math.min(a,b);return (l1+0.05)/(l2+0.05);};
const TARGETS = {
  headline:'.hero__headline', sub:'.hero__sub', note:'.hero__note',
  'secondary link':'.hero__cta--line',
};
const b = await puppeteer.launch({ headless:'new',
  args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--force-color-profile=srgb','--font-render-hinting=none'] });
let fails=0;
for (const [w,h] of [[1280,800],[390,844]]) {
  const p = await b.newPage();
  await p.setViewport({ width:w, height:h });
  await p.goto('http://localhost:4179/', { waitUntil:'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  await new Promise(r=>setTimeout(r,900));
  const boxes = await p.evaluate((T)=>{
    const o={};
    for (const [k,sel] of Object.entries(T)) {
      const e=document.querySelector(sel); if(!e) continue;
      const r=e.getBoundingClientRect(), c=getComputedStyle(e);
      o[k]={t:Math.round(r.top),b:Math.round(r.bottom),l:Math.round(r.left),r:Math.round(r.right),
            fs:parseFloat(c.fontSize), fw:parseInt(c.fontWeight,10), col:c.color};
    }
    return o;
  }, TARGETS);
  await p.evaluate(()=>{ document.querySelector('.hero__body').style.visibility='hidden'; });
  const peak={}; for(const k of Object.keys(boxes)) peak[k]=0;
  for (let k=0;k<10;k++){
    await new Promise(r=>setTimeout(r,380));
    const im=PNG.sync.read(await p.screenshot({type:'png'}));
    for (const key of Object.keys(boxes)) {
      const bx=boxes[key];
      for(let y=Math.max(0,bx.t);y<Math.min(im.height,bx.b);y++)
        for(let x=Math.max(0,bx.l);x<Math.min(im.width,bx.r);x++){
          const i=(y*im.width+x)*4;
          const l=L(im.data[i],im.data[i+1],im.data[i+2]);
          if(l>peak[key]) peak[key]=l;
        }
    }
  }
  console.log(`--- ${w} ---`);
  for (const key of Object.keys(boxes)) {
    const bx=boxes[key];
    const m=bx.col.match(/[\d.]+/g).map(Number);
    const ratio=CR(L(m[0],m[1],m[2]), peak[key]);
    /* Every pair is held to 4.5, large text included, because that is the bar
       the correction was asked to clear. */
    const ok=ratio>=4.5; if(!ok) fails++;
    console.log(`  ${key.padEnd(15)} ${String(Math.round(bx.fs)).padStart(3)}px  ground ${(peak[key]*100).toFixed(2).padStart(5)}%  ${ratio.toFixed(2)}:1  ${ok?'ok':`FAILS by ${(4.5-ratio).toFixed(2)}`}`);
  }
  await p.close();
}
await b.close();
console.log(fails?`\n${fails} pair(s) under 4.5:1`:'\nevery pair over 4.5:1');

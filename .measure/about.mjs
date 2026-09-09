import puppeteer from 'puppeteer';
import { writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
const lin=(c)=>{c/=255;return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4;};
const L=(r,g,b)=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const CR=(a,b)=>{const l1=Math.max(a,b),l2=Math.min(a,b);return (l1+0.05)/(l2+0.05);};
const b = await puppeteer.launch({ headless:'new',
  args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--force-color-profile=srgb','--font-render-hinting=none'] });
for (const [w,h] of [[1280,900],[390,844]]) {
  const p = await b.newPage();
  await p.setViewport({ width:w, height:h });
  await p.goto('http://localhost:4179/about-us', { waitUntil:'domcontentloaded' });
  await new Promise(r=>setTimeout(r,2500));
  const boxes = await p.evaluate(()=>{
    const g=(s)=>{const e=document.querySelector(s); if(!e)return null;
      const r=e.getBoundingClientRect(), c=getComputedStyle(e);
      return {t:Math.round(r.top),b:Math.round(r.bottom),l:Math.round(r.left),r:Math.round(r.right),
              fs:parseFloat(c.fontSize), col:c.color};};
    return { heading:g('.abt__top .pg__h'), lead:g('.abt__top .pg__lead') };
  });
  await p.evaluate(()=>{ document.querySelector('.abt__top-in').style.visibility='hidden'; });
  const peak={heading:0,lead:0};
  for (let k=0;k<10;k++){
    await new Promise(r=>setTimeout(r,380));
    const im=PNG.sync.read(await p.screenshot({type:'png'}));
    for (const key of Object.keys(peak)) { const bx=boxes[key]; if(!bx) continue;
      for(let y=Math.max(0,bx.t);y<Math.min(im.height,bx.b);y++)
        for(let x=Math.max(0,bx.l);x<Math.min(im.width,bx.r);x++){
          const i=(y*im.width+x)*4; const l=L(im.data[i],im.data[i+1],im.data[i+2]);
          if(l>peak[key]) peak[key]=l; } }
  }
  console.log(`--- about top, ${w} ---`);
  for (const key of Object.keys(peak)) { const bx=boxes[key]; if(!bx) continue;
    const m=bx.col.match(/[\d.]+/g).map(Number);
    const ratio=CR(L(m[0],m[1],m[2]), peak[key]);
    console.log(`  ${key.padEnd(8)} ${String(Math.round(bx.fs)).padStart(3)}px  ground ${(peak[key]*100).toFixed(2)}%  ${ratio.toFixed(2)}:1 ${ratio>=4.5?'ok':'FAILS'}`); }
  await p.evaluate(()=>{ document.querySelector('.abt__top-in').style.visibility=''; });
  const tot = await p.evaluate(()=>document.documentElement.scrollHeight);
  for (let y=0;y<tot;y+=h/2){ await p.evaluate((yy)=>window.scrollTo(0,yy), y); await new Promise(r=>setTimeout(r,140)); }
  await p.evaluate(()=>window.scrollTo(0,0)); await new Promise(r=>setTimeout(r,500));
  /* One plate held open on the 1280 shot. */
  /* One plate held open on the 1280 shot. `click()` scrolls the button into
     view, so the page goes back to the top after it and before the capture. */
  if (w===1280) { await p.evaluate(()=>document.querySelector('.plate').click());
                  await new Promise(r=>setTimeout(r,700));
                  await p.evaluate(()=>window.scrollTo(0,0));
                  await new Promise(r=>setTimeout(r,400));
                  const st=await p.evaluate(()=>{const e=document.querySelector('.plate');
                    return e.dataset.open+' '+getComputedStyle(e).transform+' rev '+
                      getComputedStyle(e.querySelector('.plate__reveal')).opacity;});
                  console.log('  left plate: '+st); }
  writeFileSync(`.measure/out/agency/about-${w}.png`, await p.screenshot({type:'png', fullPage:true}));
  console.log(`  page ${tot}px`);
  await p.close();
}
await b.close();

/* surface.mjs — the hero surface's own distribution, off painted pixels.
   Peak, the share under 3%, the share in the olive band, and where the
   brightest decile sits on the ramp. Copy hidden so nothing but the surface
   and its ground is measured. */
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
const lin=(c)=>{c/=255;return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4;};
const L=(r,g,b)=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
/* the olive band, as a box in RGB */
const olive=(r,g,b)=>r>=74&&r<=107&&g>=63&&g<=90&&b>=26&&b<=34;
/* THE MOUNTS. The surface is one component on two pages, so this measures a
   named mount rather than the hero specifically: `node surface.mjs about`. */
const MOUNTS={
  hero:  {route:'/',         box:'.hero',     copy:'.hero__body'},
  about: {route:'/about-us', box:'.abt__top', copy:'.abt__top-in'},
};
const M=MOUNTS[process.argv[2]||'hero'];
if(!M){console.error('unknown mount');process.exit(2);}
const b = await puppeteer.launch({ headless:'new',
  args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--force-color-profile=srgb'] });
for (const [w,h] of [[1280,800],[390,844]]) {
  const p = await b.newPage();
  await p.setViewport({ width:w, height:h });
  await p.goto('http://localhost:4179'+M.route, { waitUntil:'domcontentloaded' });
  await new Promise(r=>setTimeout(r,2000));
  await p.evaluate((s)=>{ document.querySelector(s).style.visibility='hidden'; }, M.copy);
  let best=null;
  for (let k=0;k<10;k++){
    await new Promise(r=>setTimeout(r,380));
    const im=PNG.sync.read(await p.screenshot({type:'png'}));
    const box=await p.evaluate((s)=>{const r=document.querySelector(s).getBoundingClientRect();
      return {t:Math.max(0,Math.round(r.top))+3,b:Math.min(innerHeight,Math.round(r.bottom))-3};}, M.box);
    const ls=[]; let ol=0, n=0, warm=0;
    for(let y=box.t;y<box.b;y++)for(let x=3;x<im.width-3;x++){
      const i=(y*im.width+x)*4, R=im.data[i],G=im.data[i+1],B=im.data[i+2];
      ls.push(L(R,G,B)); if(olive(R,G,B)) ol++; n++;
    }
    ls.sort((a,c)=>a-c);
    const peak=ls[ls.length-1];
    const under3=ls.filter(v=>v<0.03).length/n;
    /* the brightest decile: is it past the yellow stop? measure saturation —
       the yellow stop is rgb(101,80,29), spread 72; warm white is (107,102,90),
       spread 17. A low spread means the pixel is at the neutral end. */
    const cut=ls[Math.floor(n*0.9)];
    let spreadSum=0, cnt=0;
    for(let y=box.t;y<box.b;y++)for(let x=3;x<im.width-3;x++){
      const i=(y*im.width+x)*4, R=im.data[i],G=im.data[i+1],B=im.data[i+2];
      if(L(R,G,B)>=cut){ spreadSum += Math.max(R,G,B)-Math.min(R,G,B); cnt++; }
    }
    const rec={peak,under3,olive:ol/n,spread:spreadSum/cnt};
    if(!best||rec.peak>best.peak) best=rec;
  }
  console.log(`--- ${M.route} ${w} ---`);
  console.log(`  peak luminance      ${(best.peak*100).toFixed(2)}%   (ceiling 13.4)  ${best.peak<=0.135?'ok':'OVER'}`);
  console.log(`  under 3% luminance  ${(best.under3*100).toFixed(1)}%   (want >=70)     ${best.under3>=0.70?'ok':'LOW'}`);
  console.log(`  in the olive band   ${(best.olive*100).toFixed(2)}%   (want <=5)      ${best.olive<=0.05?'ok':'OVER'}`);
  console.log(`  brightest decile: mean channel spread ${best.spread.toFixed(1)}  (yellow stop 72, warm white 17)`);
  await p.close();
}
await b.close();

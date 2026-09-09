import puppeteer from 'puppeteer';
const BASE='http://localhost:5173';
const ROUTES=['/','/services','/pricing','/about-us','/contact-us','/resources','/portfolio','/case-studies'];
const b=await puppeteer.launch({headless:'new'});
for(const W of [1280,390]){
 console.log(`\n===== ${W} =====`);
 for(const r of ROUTES){
  const p=await b.newPage();
  await p.setViewport({width:W,height:W===1280?800:844});
  await p.goto(BASE+r,{waitUntil:'networkidle0'});
  await p.evaluate(()=>document.fonts.ready);
  await new Promise(z=>setTimeout(z,1400));
  const o=await p.evaluate(()=>{
   const Y='rgb(240, 179, 35)';
   const els=[...document.querySelectorAll('*')].filter(e=>{
     const c=getComputedStyle(e), rc=e.getBoundingClientRect();
     if(!rc.width||!rc.height) return false;
     return c.backgroundColor===Y||c.color===Y;
   });
   const names=els.map(e=>(e.className&&e.className.baseVal!==undefined?e.className.baseVal:String(e.className||e.tagName)).split(' ')[0]);
   const small=[...document.querySelectorAll('a,button')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.height<48;}).length;
   const hs=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h=>+h.tagName[1]);
   let skip=false; for(let i=1;i<hs.length;i++) if(hs[i]-hs[i-1]>1) skip=true;
   return {yellow:[...new Set(names)], count:els.length, small, headingSkip:skip, hs:hs.join(''),
     eyebrows:document.querySelectorAll('.eyebrow').length,
     ov:document.documentElement.scrollWidth>innerWidth};
  });
  console.log(`${r.padEnd(15)} yellowEls=${String(o.count).padStart(2)} ${JSON.stringify(o.yellow)} small=${o.small} hSkip=${o.headingSkip} ov=${o.ov}`);
  await p.close();
 }
}
await b.close();

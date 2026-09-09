import puppeteer from 'puppeteer';
const URL='http://localhost:5173/hero-preview.html';
const b=await puppeteer.launch({headless:'new'});
for (const [W,H] of [[1280,800],[1024,800],[768,900],[390,844]]) {
  const p=await b.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.setViewport({width:W,height:H});
  await p.goto(URL,{waitUntil:'networkidle0'});
  await p.evaluate(()=>document.fonts.ready);
  await new Promise(r=>setTimeout(r,1500));
  const r=await p.evaluate(()=>{
    const yellow=[...document.querySelectorAll('*')].filter(el=>{
      const cs=getComputedStyle(el);
      const hit=(v)=>v && v.replace(/\s/g,'')==='rgb(240,179,35)';
      if(!(el.getBoundingClientRect().width)) return false;
      return hit(cs.color)||hit(cs.backgroundColor)||hit(cs.borderTopColor);
    }).map(el=>el.className&&el.className.baseVal!==undefined?el.className.baseVal:(el.className||el.tagName));
    const small=[...document.querySelectorAll('a,button')].filter(el=>{
      const r=el.getBoundingClientRect();
      return r.width>0 && r.height>0 && r.height<48;
    }).map(el=>`${el.tagName}.${el.className} ${Math.round(el.getBoundingClientRect().height)}px`);
    return {
      scrollW: document.documentElement.scrollWidth,
      inner: innerWidth,
      overflow: document.documentElement.scrollWidth>innerWidth,
      yellow:[...new Set(yellow)],
      undersizedTargets:[...new Set(small)],
      dashes: (document.body.innerText.match(/[\u2013\u2014]/g)||[]).length,
      bangs: (document.body.innerText.match(/!/g)||[]).length,
      h1s: document.querySelectorAll('h1').length,
    };
  });
  console.log(`\n=== ${W} ===`);
  console.log(JSON.stringify(r,null,1));
  if(errs.length) console.log('PAGE ERRORS',errs);
  await p.close();
}
await b.close();

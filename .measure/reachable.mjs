/* What is publicly reachable, and what each path asserts. */
import puppeteer from 'puppeteer';
const BASE='http://localhost:5173';
const P=process.argv.slice(2);
const b=await puppeteer.launch({headless:'new'});
for(const r of P){
 const p=await b.newPage();
 await p.setViewport({width:1280,height:900});
 await p.goto(BASE+r,{waitUntil:'networkidle0'});
 await p.evaluate(()=>document.fonts.ready);
 await new Promise(z=>setTimeout(z,1400));
 const o=await p.evaluate(()=>{
  const t=document.body.innerText;
  return {url:location.pathname+location.hash, title:document.title,
   legacy:!!document.querySelector('.lg'),
   money:[...new Set(t.match(/\$\s?[\d,]+(?:\.\d+)?/g)||[])],
   pcts:[...new Set(t.match(/\b\d+(?:\.\d+)?%/g)||[])],
   emails:[...new Set((t.match(/[\w.+-]+@[\w-]+\.[\w.]+/gi)||[]).map(x=>x.toLowerCase()))],
   dashes:(t.match(/[\u2013\u2014]/g)||[]).length,
   titleDash:/[\u2013\u2014]/.test(document.title),
   bangs:(t.match(/!/g)||[]).length,
   weeks:/within weeks/i.test(t),
   scales:/vexel\s*scales/i.test(document.documentElement.innerHTML),
  };
 });
 console.log(`${r.padEnd(24)} -> ${o.url.padEnd(22)} ${o.legacy?'LEGACY ':'rebuild'} $=${JSON.stringify(o.money)} %=${JSON.stringify(o.pcts)} mail=${JSON.stringify(o.emails)} dash=${o.dashes}${o.titleDash?'+TITLE':''} weeks=${o.weeks} scales=${o.scales}`);
 await p.close();
}
await b.close();

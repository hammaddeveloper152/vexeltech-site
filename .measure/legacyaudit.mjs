/* Audit the six /legacy/... paths against the three things that make a
   superseded page worse than a dead link: a price, an unsourced claim about
   the business, and a dash-rule breach. */
import puppeteer from 'puppeteer';
const BASE='http://localhost:5173';
const P=process.argv.slice(2);
const b=await puppeteer.launch({headless:'new'});
for(const r of P){
 const p=await b.newPage();
 await p.setViewport({width:1280,height:900});
 await p.goto(BASE+r,{waitUntil:'networkidle0'});
 await p.evaluate(()=>document.fonts.ready);
 await new Promise(z=>setTimeout(z,1200));
 const o=await p.evaluate(()=>{
  const t=document.body.innerText;
  return {
   title:document.title,
   money:[...new Set(t.match(/\$\s?[\d,]+(?:\.\d+)?/g)||[])],
   dashes:(t.match(/[\u2013\u2014]/g)||[]).length,
   bangs:(t.match(/!/g)||[]).length,
   /* Unsourced proof claims: counts of clients/projects/years, ratings. */
   claims:[...new Set(t.match(/\b\d+\+?\s*(?:clients?|projects?|years?|businesses|brands?|websites?|reviews?|stars?)\b/gi)||[])],
   pcts:[...new Set(t.match(/\b\d+(?:\.\d+)?%/g)||[])],
   phones:[...new Set(t.match(/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g)||[])],
   emails:[...new Set(t.match(/[\w.+-]+@[\w-]+\.[\w.]+/g)||[])],
   calendly: /calendly/i.test(document.documentElement.innerHTML),
   vexelScales: /vexel\s*scales/i.test(document.documentElement.innerHTML),
   chars:t.length,
  };
 });
 console.log(`\n=== ${r} === "${o.title}"`);
 console.log(`  money   ${JSON.stringify(o.money)}`);
 console.log(`  claims  ${JSON.stringify(o.claims)}  pct ${JSON.stringify(o.pcts)}`);
 console.log(`  phone   ${JSON.stringify(o.phones)}  email ${JSON.stringify(o.emails)}`);
 console.log(`  dashes ${o.dashes}  bangs ${o.bangs}  calendly ${o.calendly}  vexelScales ${o.vexelScales}`);
 await p.close();
}
await b.close();

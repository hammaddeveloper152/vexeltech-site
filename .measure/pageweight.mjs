import puppeteer from 'puppeteer';
const BASE='http://localhost:4178';
const b=await puppeteer.launch({headless:'new'});
for(const r of ['/','/services','/pricing','/services/branding']){
 const p=await b.newPage();
 await p.setViewport({width:1280,height:800});
 const seen=new Map(); const hosts=new Set();
 p.on('response', async res=>{
   const u=res.url(); try{ const h=new URL(u).host; if(h!=='localhost:4178') hosts.add(h);}catch{}
   try{ const len=Number(res.headers()['content-length']||0); seen.set(u,len);}catch{}
 });
 await p.goto(BASE+r,{waitUntil:'networkidle0'});
 await p.evaluate(()=>document.fonts.ready);
 await new Promise(z=>setTimeout(z,800));
 const total=[...seen.values()].reduce((a,c)=>a+c,0);
 const legacyCss=[...seen.keys()].filter(u=>/LegacyShell.*\.css/.test(u));
 console.log(`${r.padEnd(22)} requests=${seen.size} bytes(reported)=${(total/1024).toFixed(1)}KB legacyCSSloaded=${legacyCss.length>0} thirdParty=${JSON.stringify([...hosts])}`);
 await p.close();
}
await b.close();

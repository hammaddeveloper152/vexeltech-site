/* Both forms, end to end on the preview build: land with UTM tags, fill,
   submit, capture the real POST body, and diff its keys against the hidden
   Netlify declarations in the BUILT dist/index.html. The POST is answered
   200 by interception, as Netlify would. */
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/LENOVO/Desktop/vexeltech2-src/vexeltech2-main/package.json');
const puppeteer = require('puppeteer');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const html = fs.readFileSync('C:/Users/LENOVO/Desktop/vexeltech2-src/vexeltech2-main/dist/index.html', 'utf8');
const twins = {};
for (const m of html.matchAll(/<form name="([^"]+)"([^>]*)>([\s\S]*?)<\/form>/g)) {
  twins[m[1]] = { attrs: m[2].trim(), fields: [...m[3].matchAll(/name="([^"]+)"/g)].map((x) => x[1]) };
}
console.log('TWINS in dist/index.html:', JSON.stringify(twins, null, 1));

const UTM = '?utm_source=audit&utm_medium=cpc&utm_campaign=release&utm_content=ad1';
const b = await puppeteer.launch({ headless: 'new' });
async function run(label, url, fill) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  const posts = [];
  await p.setRequestInterception(true);
  p.on('request', (req) => {
    if (req.method() === 'POST') { posts.push(req.postData() || ''); req.respond({ status: 200, contentType: 'text/html', body: 'ok' }); }
    else req.continue();
  });
  await p.goto(url, { waitUntil: 'networkidle0' });
  await fill(p);
  await wait(1200);
  const status = await p.evaluate(() => (document.querySelector('.lf__ok, .plan__ok') || {}).textContent || '(no success line)');
  await p.close();
  for (const body of posts) {
    const q = new URLSearchParams(body);
    const keys = [...q.keys()];
    const form = q.get('form-name');
    const declared = twins[form]?.fields || [];
    const missing = keys.filter((k) => k !== 'form-name' && !declared.includes(k));
    const unsent = declared.filter((k) => k !== 'bot-field' && !keys.includes(k));
    console.log(`\n${label}: POST form-name=${form}`);
    console.log('  sent:', JSON.stringify(Object.fromEntries(q)));
    console.log(`  sent but NOT declared (Netlify drops): ${missing.length ? missing.join(', ') : 'none'}`);
    console.log(`  declared but not sent: ${unsent.length ? unsent.join(', ') : 'none'}`);
  }
  console.log(`  posts: ${posts.length}; success line: ${status.trim()}`);
}

const typeIn = async (p, sel, v) => { await p.focus(sel); await p.keyboard.type(v); };

await run('Contact page form', 'http://localhost:4173/contact-us' + UTM, async (p) => {
  await typeIn(p, '#ct-name', 'Audit Test'); await typeIn(p, '#ct-phone', '713 555 0100');
  await typeIn(p, '#ct-email', 'audit@example.com');
  await p.evaluate(() => { document.querySelectorAll('.ct-form input[name=need]')[0].click(); document.querySelectorAll('.ct-form input[name=need]')[2].click(); document.querySelectorAll('.ct-form input[name=budget]')[1].click(); });
  await typeIn(p, '#ct-message', 'Release audit, please ignore.');
  await p.click('.ct-form .lf__submit');
});

await run('Footer form (home), UTM carried from an earlier landing', 'http://localhost:4173/' + UTM, async (p) => {
  await p.goto('http://localhost:4173/pricing', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.querySelector('#ff-name').scrollIntoView());
  await typeIn(p, '#ff-name', 'Audit Test'); await typeIn(p, '#ff-phone', '713 555 0100');
  await typeIn(p, '#ff-email', 'audit@example.com'); await typeIn(p, '#ff-message', 'Release audit, please ignore.');
  await p.click('.foot .lf__submit');
});

await run('Plan Builder (/pricing)', 'http://localhost:4173/pricing' + UTM, async (p) => {
  for (let k = 0; k < 3; k++) {
    await p.evaluate(() => { const c = document.querySelector('.plan [data-choice]'); c && c.click(); }); await wait(300);
    await p.evaluate(() => document.querySelector('.plan__next').click()); await wait(600);
  }
  await typeIn(p, '#plan-name', 'Audit Test'); await typeIn(p, '#plan-email', 'audit@example.com'); await typeIn(p, '#plan-phone', '713 555 0100');
  await p.evaluate(() => document.querySelector('.plan__next').click()); await wait(800);
  await p.evaluate(() => document.querySelector('.plan__send').click());
});
await b.close();

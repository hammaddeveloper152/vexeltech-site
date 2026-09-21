/* planpaths.mjs — every path through /pricing's Plan Builder, driven like a
   reader: pick a trade, a stage, the services (and Branding's tier), fill the
   three fields, show the plan. Reports the ticket at step 3 and the result's
   rationale, lines and total, and the bundle merging and splitting back.

     node .measure/planpaths.mjs <base> */
import puppeteer from 'puppeteer';
const base = process.argv[2] || 'http://localhost:4173';
const b = await puppeteer.launch({ headless: 'new' });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function open() {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  await p.goto(base + '/pricing', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  return p;
}
const pick = (p, text) => p.evaluate((t) => {
  const el = [...document.querySelectorAll('.plan [data-choice]')].find((c) => c.textContent.trim().startsWith(t));
  if (!el) throw new Error(`no choice ${t}`);
  el.click();
}, text);
const next = async (p) => { await p.evaluate(() => document.querySelector('.plan__next').click()); await wait(700); };
const ticketNow = (p) => p.evaluate(() => ({
  trade: document.querySelector('.plan__ticket-trade')?.textContent || '',
  stage: document.querySelector('.plan__ticket-stage')?.textContent || '',
  lines: [...document.querySelectorAll('.plan__side .plan__tl')].map((l) => l.textContent.replace(/\s+/g, ' ').trim()),
  total: document.querySelector('.plan__side .plan__total-n')?.textContent || '(strip hidden)',
}));

async function run(name, services, tier) {
  const p = await open();
  const disabledAtStart = await p.evaluate(() => document.querySelector('.plan__next').disabled);
  await pick(p, 'Plumbing'); await wait(200); await next(p);
  await pick(p, 'Just starting out'); await wait(200); await next(p);
  for (const s of services) { await pick(p, s); await wait(750); }
  if (tier) { await pick(p, tier); await wait(750); }
  const at3 = await ticketNow(p);
  await next(p);
  await p.type('#plan-name', 'Test Reader');
  await p.type('#plan-email', 'test@example.com');
  await p.type('#plan-phone', '555 0100');
  await next(p);
  await wait(900);
  const result = await p.evaluate(() => ({
    head: document.querySelector('.plan__q')?.textContent,
    why: document.querySelector('.plan__why')?.textContent,
    send: document.querySelector('.plan__send')?.textContent,
  }));
  const end = await ticketNow(p);
  console.log(`\n## ${name}  (Next disabled before an answer: ${disabledAtStart})`);
  console.log(`   step 3 ticket: ${at3.lines.join(' | ') || '(no lines)'}  total ${at3.total}`);
  console.log(`   result: ${result.head} ${result.why}`);
  console.log(`   ticket: [${end.trade} / ${end.stage}] ${end.lines.join(' | ')}  total ${end.total}  button "${result.send}"`);
  await p.close();
}

await run('Website only', ['Website']);
await run('Basic + Website', ['Branding', 'Website'], 'Basic');
await run('Advance + Website (bundle)', ['Branding', 'Website']);
await run('Marketing only (nothing priced)', ['Marketing']);
await run('Automation only (nothing priced)', ['Automation']);

/* Bundle, then unbundle: Advance + Website merge; Website off splits. */
{
  const p = await open();
  await pick(p, 'HVAC'); await wait(200); await next(p);
  await pick(p, 'Set up'); await wait(200); await next(p);
  await pick(p, 'Branding'); await wait(750);
  await pick(p, 'Website'); await wait(900);
  const merged = await ticketNow(p);
  await pick(p, 'Website'); await wait(900);
  const split = await ticketNow(p);
  await pick(p, 'Website'); await wait(900);
  await pick(p, 'Basic'); await wait(900);
  const basic = await ticketNow(p);
  console.log('\n## Bundle and unbundle');
  console.log(`   merged: ${merged.lines.join(' | ')}  total ${merged.total}`);
  console.log(`   Website off: ${split.lines.join(' | ')}  total ${split.total}`);
  console.log(`   Website on, Basic: ${basic.lines.join(' | ')}  total ${basic.total}`);
  await p.close();
}
await b.close();

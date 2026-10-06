/* formtest.mjs: the quote form against its endpoint (the founder's final
   audit, final22, 2026-10-06).

     node .measure/formtest.mjs [base]

   1. /contact-us, every field filled, submitted: records the request (its
      URL, method and body keys) and the response status, and the status
      line the form shows. With the placeholder Formspree ID the post fails,
      and the form must show its error state, cleanly.
   2. The same, with the honeypot filled: no request may leave, and the
      form shows its success state.
   Captures the error state to .measure/out/final22/form-error.png. */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = path.join('.measure', 'out', 'final22');
fs.mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({ headless: 'new' });
const report = {};

for (const bot of [false, true]) {
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 900 });
  const sent = [];
  p.on('request', (r) => {
    if (r.method() === 'POST') sent.push({ url: r.url(), body: Object.keys(JSON.parse(r.postData() || '{}')) });
  });
  const statuses = [];
  p.on('response', (r) => {
    if (r.request().method() === 'POST') statuses.push(`${r.status()} ${r.url()}`);
  });
  await p.goto(BASE + '/contact-us', { waitUntil: 'networkidle0' });
  await p.type('#ct-name', 'Audit Test');
  await p.type('#ct-phone', '555 010 2200');
  await p.type('#ct-email', 'audit@example.com');
  await p.type('#ct-message', 'A test submission against the placeholder endpoint.');
  if (bot) await p.$eval('#ct-trap', (n) => {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    set.call(n, 'bot');
    n.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await p.click('.lf__submit');
  await new Promise((r) => setTimeout(r, 4000));
  const status = await p.$eval('.lf__status', (n) => n.textContent.trim());
  if (!bot) {
    const form = await p.$('.lf');
    await form.evaluate((n) => n.scrollIntoView({ block: 'center' }));
    await form.screenshot({ path: path.join(OUT, 'form-error.png') });
  }
  report[bot ? 'honeypot' : 'placeholder'] = { requests: sent, responses: statuses, status };
  await p.close();
}
await b.close();
console.log(JSON.stringify(report, null, 1));

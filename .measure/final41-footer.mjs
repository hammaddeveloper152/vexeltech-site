/* final41-footer.mjs (FINAL41, the footer, 2026-10-08, the founder): at
   1280 the top of "Let's talk." against the first links' cap tops and
   baselines in columns 2 and 3; at 390 the order and the gaps of the
   three groups; the legal row's text at both widths; and the keyboard
   order through the footer, which must be the two contact links, the four
   pages and the two legal links, and nothing else.
     node .measure/final41-footer.mjs [base]   (default http://localhost:4190) */
import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://localhost:4190';
const b = await puppeteer.launch({ headless: 'new' });
for (const w of [1280, 390]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: 844 });
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const base = (el) => {
      const m = document.createElement('span');
      m.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      el.insertBefore(m, el.firstChild);
      const y = m.getBoundingClientRect().bottom + scrollY;
      m.remove();
      return Math.round(y * 10) / 10;
    };
    const talk = document.querySelector('.sf__talk').getBoundingClientRect();
    const firsts = [...document.querySelectorAll('.sf__links')].map((ul) => {
      const a = ul.querySelector('a');
      const bl = base(a);
      return { text: a.textContent, baseline: bl, capTop: Math.round((bl - 0.74 * 16) * 10) / 10, box: Math.round(a.getBoundingClientRect().top + scrollY) };
    });
    const groups = [...document.querySelectorAll('.sf__col')].map((c) => {
      const r = c.getBoundingClientRect();
      return [Math.round(r.top + scrollY), Math.round(r.bottom + scrollY)];
    });
    return { talkTop: Math.round((talk.top + scrollY) * 10) / 10, firsts, groups, legal: document.querySelector('.sf__legal').innerText.replace(/\n/g, ' | '), legalLines: Math.round(document.querySelector('.sf__legal').getBoundingClientRect().height / 16) };
  });
  console.log(`== @${w}`, JSON.stringify(r));
  if (w === 1280) {
    const order = [];
    await p.evaluate(() => document.querySelector('footer.sf').previousElementSibling.querySelectorAll('a,button,input,textarea').forEach((e) => e.setAttribute('data-last', '')));
    await p.evaluate(() => {
      const all = [...document.querySelectorAll('main a, main button, main input, main textarea')];
      all[all.length - 1].focus();
    });
    for (let i = 0; i < 12; i += 1) {
      await p.keyboard.press('Tab');
      const t = await p.evaluate(() => {
        const e = document.activeElement;
        if (!e || e === document.body) return '(body)';
        if (!e.closest('footer.sf')) return `(outside: ${e.tagName.toLowerCase()}.${e.className})`;
        return e.textContent.trim() || `(${e.tagName.toLowerCase()}.${e.className})`;
      });
      order.push(t);
      if (t.startsWith('(body)') || t.startsWith('(outside')) break;
    }
    console.log('   keyboard through the footer:', order.join(' > '));
  }
  await p.close();
}
await b.close();

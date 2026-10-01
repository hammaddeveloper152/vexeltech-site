/* copymatch.mjs: the copy file against the rendered pages, 2026-10-01 (copy
   V3.1). Every sentence of four words or more in a page's section of
   VEXELTECH-COPY.md is looked up in that page's rendered text (the latest
   copytext.mjs dump). Prints what is missing, for a person to read: some
   misses are deliberate (stage notes, structure-pass sections, lines the
   founder chose not to render) and are not errors in themselves.

   Usage: node .measure/copymatch.mjs [dump-tag] */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TAG = process.argv[2] || 'after';
const SRC = fs.readFileSync(path.join(HERE, '..', '..', '..', 'vexel-tech-site', 'VEXELTECH-COPY.md'), 'utf8');
const DUMP = (f) => fs.readFileSync(path.join(HERE, 'out', 'copytext', TAG, f), 'utf8');
const norm = (t) => t.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').toLowerCase();
const PAGES = { HOME: '_.txt', SERVICES: '_services.txt', PRICING: '_pricing.txt', 'ABOUT US': '_about-us.txt', CONTACT: '_contact-us.txt' };
for (const [sec, file] of Object.entries(PAGES)) {
  const start = SRC.indexOf(`## ${sec}\n`);
  const end = SRC.indexOf('\n## ', start + 4);
  const body = SRC.slice(start, end);
  const page = norm(DUMP(file));
  const miss = [];
  for (const raw of body.split('\n')) {
    if (!raw.trim() || raw.startsWith('#')) continue;
    const val = raw.replace(/^[-\d.\s]*(?:[A-Z][\w ()'",]*?:\s)?/, '');
    for (const s of val.split(/(?<=[.?])\s+/)) {
      if (s.split(/\s+/).length < 4) continue;
      if (!page.includes(norm(s.replace(/[.?]$/, '')))) miss.push(s);
    }
  }
  console.log(`== ${sec}: ${miss.length} not found`);
  miss.forEach((m) => console.log('   ' + m.slice(0, 140)));
}

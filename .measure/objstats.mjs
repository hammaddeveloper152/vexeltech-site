/* objstats.mjs — what the background of each object image actually is.

   The cut to alpha is a THRESHOLD on luminance, flood-filled in from the
   image's own edge, and a threshold has to be measured from the file rather
   than guessed: the handset was supplied with a grey vignette, so "white"
   is not one value across the frame. This prints, per image, the luminance
   and chroma along the border and in rings towards the centre, which is
   where the cut's two numbers come from.

     node .measure/objstats.mjs
*/
import { PNG } from 'pngjs';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(process.cwd(), 'public', 'assets', 'objects');
const lum8 = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b; // 0-255, sRGB-weighted

for (const f of readdirSync(DIR).filter((n) => /\.png$/i.test(n))) {
  const im = PNG.sync.read(readFileSync(join(DIR, f)));
  const { width: W, height: H, data } = im;
  const px = (x, y) => { const i = (y * W + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
  const ring = (d) => {
    const ls = [], cs = [];
    for (let x = d; x < W - d; x += 4) for (const y of [d, H - 1 - d]) { const [r, g, b] = px(x, y); ls.push(lum8(r, g, b)); cs.push(Math.max(r, g, b) - Math.min(r, g, b)); }
    for (let y = d; y < H - d; y += 4) for (const x of [d, W - 1 - d]) { const [r, g, b] = px(x, y); ls.push(lum8(r, g, b)); cs.push(Math.max(r, g, b) - Math.min(r, g, b)); }
    ls.sort((a, b) => a - b); cs.sort((a, b) => a - b);
    const q = (a, p) => a[Math.floor((a.length - 1) * p)];
    return `min ${q(ls, 0).toFixed(0)}  p5 ${q(ls, 0.05).toFixed(0)}  median ${q(ls, 0.5).toFixed(0)}  max ${q(ls, 1).toFixed(0)}   chroma p95 ${q(cs, 0.95)}`;
  };
  console.log(`\n${f}  ${W}x${H}`);
  for (const d of [0, 40, 120, 240]) console.log(`  ring ${String(d).padStart(3)}px in:  ${ring(d)}`);
}

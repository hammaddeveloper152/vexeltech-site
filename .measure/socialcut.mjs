/* socialcut.mjs — the six social tiles out of social.png.

   node .measure/socialcut.mjs measure
   FFMPEG=<ffmpeg.exe> node .measure/socialcut.mjs cut [reflectionPx]

   MEASURE finds the tile row (the first rows where many pixels are bright),
   the six tiles as runs of bright columns across it, and for each tile how far
   its reflection reaches: the last row below the tile where enough of its
   columns are still brighter than the floor.

   CUT makes a square per tile: the tile plus `reflectionPx` of reflection
   (default: all of it), centred, with ALPHA WHERE THE FLOOR IS PURE BLACK.
   Alpha ramps over max-channel 6 to 22, so the anti-aliased edge of a glyph or
   a reflection fades rather than stepping. Written as PNG with alpha and then
   webp at 240px with ffmpeg. */
import { PNG } from 'pngjs';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const [mode = 'measure', reflArg] = process.argv.slice(2);
const SRC = 'public/assets/objects/social.png.png';
const NAMES = ['instagram', 'facebook', 'linkedin', 'x', 'tiktok', 'youtube'];
const im = PNG.sync.read(fs.readFileSync(SRC));
const { width: W, height: H, data } = im;
const mx = (x, y) => { const i = (y * W + x) * 4; return Math.max(data[i], data[i + 1], data[i + 2]); };

let top = -1;
for (let y = 0; y < H && top < 0; y++) {
  let n = 0;
  for (let x = 0; x < W; x += 2) if (mx(x, y) > 80) n++;
  if (n > 60) top = y;
}

const col = new Array(W).fill(0);
for (let y = top; y < top + 240; y++) for (let x = 0; x < W; x++) if (mx(x, y) > 80) col[x]++;
const runs = [];
let start = -1;
for (let x = 0; x < W; x++) {
  if (col[x] > 20 && start < 0) start = x;
  if ((col[x] <= 20 || x === W - 1) && start >= 0) { if (x - start > 60) runs.push([start, x - 1]); start = -1; }
}

const tiles = runs.map(([x0, x1]) => {
  const w = x1 - x0 + 1;
  let tileBottom = top;
  let reflBottom = top;
  for (let y = top; y < H; y++) {
    let n = 0;
    for (let x = x0; x <= x1; x += 2) if (mx(x, y) > 80) n++;
    if (n > w * 0.25) tileBottom = y;
    let m = 0;
    for (let x = x0; x <= x1; x += 2) if (mx(x, y) > 30) m++;
    if (m > w * 0.1) reflBottom = y;
  }
  return { x0, x1, w, top, tileBottom, tileH: tileBottom - top + 1, reflBottom, reflH: reflBottom - tileBottom };
});

if (mode === 'measure') {
  console.log(`source ${W}x${H}; tile row starts at y ${top}; ${tiles.length} tiles`);
  tiles.forEach((t, i) => console.log(`  ${NAMES[i] || i}: x ${t.x0}-${t.x1} (${t.w}px), tile y ${t.top}-${t.tileBottom} (${t.tileH}px), reflection to y ${t.reflBottom} (${t.reflH}px below the tile)`));
}

if (mode === 'cut') {
  const FF = process.env.FFMPEG;
  const tmp = '.measure/out/social';
  fs.mkdirSync(tmp, { recursive: true });
  const pad = 12;
  tiles.forEach((t, i) => {
    const refl = reflArg ? Math.min(Number(reflArg), t.reflH) : t.reflH;
    const contentH = t.tileH + refl;
    const side = Math.max(t.w, contentH) + pad * 2;
    const cx = Math.round((t.x0 + t.x1) / 2);
    const sx = cx - Math.floor(side / 2);
    const sy = t.top - pad;
    const out = new PNG({ width: side, height: side });
    for (let y = 0; y < side; y++) {
      for (let x = 0; x < side; x++) {
        const X = sx + x, Y = sy + y;
        const o = (y * side + x) * 4;
        const inside = X >= 0 && Y >= 0 && X < W && Y < H && Y <= t.tileBottom + refl && X >= t.x0 - pad && X <= t.x1 + pad;
        if (!inside) { out.data[o + 3] = 0; continue; }
        const i = (Y * W + X) * 4;
        const m = Math.max(data[i], data[i + 1], data[i + 2]);
        const a = m <= 6 ? 0 : m >= 22 ? 255 : Math.round(((m - 6) / 16) * 255);
        out.data[o] = data[i]; out.data[o + 1] = data[i + 1]; out.data[o + 2] = data[i + 2]; out.data[o + 3] = a;
      }
    }
    const png = `${tmp}/${NAMES[i]}.png`;
    fs.writeFileSync(png, PNG.sync.write(out));
    const webp = `public/assets/objects/social-${NAMES[i]}.webp`;
    execFileSync(FF, ['-v', 'error', '-y', '-i', png, '-vf', 'scale=240:240:flags=lanczos', '-c:v', 'libwebp', '-pix_fmt', 'yuva420p', '-quality', '90', '-compression_level', '6', '-frames:v', '1', webp]);
    const kb = fs.statSync(webp).size / 1024;
    console.log(`  ${NAMES[i]}: square ${side}px (tile ${t.w}x${t.tileH}, reflection ${refl}px) -> ${webp} ${kb.toFixed(1)} KB; tile is ${((t.w / side) * 100).toFixed(0)}% of the width`);
  });
}

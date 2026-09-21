/* objcut.mjs — the supplied objects, cut to alpha by a luminance threshold.

   Three PNGs arrived on near-white: the mascot, a handset and a sprite of four
   icons. `objstats.mjs` measured their borders at luminance 252 to 255 with
   chroma under 2. The handset was supplied with a grey vignette.

   A THRESHOLD, NOT A COLOUR KEY, and the reason is that vignette. A key
   removes one colour; a vignette is a range of greys that darkens towards the
   corners, so a key leaves a ring. This removes LUMINANCE:

     - a pixel is background-coloured when it is light (luminance >= LO) and
       nearly neutral (chroma <= CHROMA)
     - background is FLOOD-FILLED IN FROM THE EDGE through such pixels, so the
       name tag's pale label, the mascot's white T-shirt and shoes and the
       handset's specular highlights — all light, all neutral, all enclosed by
       the object — are never reached
     - inside the flood, alpha ramps from opaque at LO to clear at HI, and the
       colour is un-mixed from white by that alpha. A soft grey shadow on white
       comes out as a soft dark shadow on transparency, which sits correctly on
       asphalt, cream or yellow alike, and no edge keeps a white halo.

   Then each image is trimmed to its opaque box, and the sprite is split into
   its four icons by connected region, left to right: phone, megaphone, missed
   call, name tag — the order they were supplied in.

   Writes RGBA PNGs to .measure/out/objects/. The webp encode is ffmpeg's, run
   after, capped at 1600px on the long side.

     node .measure/objcut.mjs
*/
import { PNG } from 'pngjs';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'public', 'assets', 'objects');
const OUT = join(process.cwd(), '.measure', 'out', 'objects');
const HI = 250;
/* 100, not 200, and it was 200 for one render. At 200 every drop shadow kept
   its core OPAQUE — the flood stopped where the shadow darkened past 200 — and
   on asphalt that core read as a light band under the beanbag and the icons.
   Measured straight down through each shadow: the object's own edge runs 0 to
   83, then the shadow's core starts at 132 to 189 and lightens to white. 100
   is under every shadow core and over every object edge, so the whole shadow
   becomes a translucent dark shadow and the object is never entered. */
const LO = 100;
const CHROMA = 14;
const PAD = 32;

mkdirSync(OUT, { recursive: true });
const lum8 = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const clamp8 = (v) => Math.max(0, Math.min(255, Math.round(v)));

function cut(file) {
  const im = PNG.sync.read(readFileSync(join(SRC, file)));
  const { width: W, height: H, data } = im;
  const N = W * H;
  const bg = new Uint8Array(N);
  const light = (p) => {
    const i = p * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    return lum8(r, g, b) >= LO && Math.max(r, g, b) - Math.min(r, g, b) <= CHROMA;
  };
  const stack = [];
  const seed = (p) => { if (!bg[p] && light(p)) { bg[p] = 1; stack.push(p); } };
  for (let x = 0; x < W; x++) { seed(x); seed((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { seed(y * W); seed(y * W + W - 1); }
  while (stack.length) {
    const p = stack.pop();
    const x = p % W;
    if (x > 0) seed(p - 1);
    if (x < W - 1) seed(p + 1);
    if (p >= W) seed(p - W);
    if (p < N - W) seed(p + W);
  }

  const out = new PNG({ width: W, height: H });
  let cleared = 0, partial = 0;
  for (let p = 0; p < N; p++) {
    const i = p * 4;
    let r = data[i], g = data[i + 1], b = data[i + 2], a = 255;
    if (bg[p]) {
      const t = Math.max(0, Math.min(1, (HI - lum8(r, g, b)) / (HI - LO)));
      a = Math.round(t * 255);
      if (a === 0) { cleared++; r = g = b = 0; } else if (a < 255) {
        partial++;
        const f = a / 255;
        r = clamp8((r - (1 - f) * 255) / f);
        g = clamp8((g - (1 - f) * 255) / f);
        b = clamp8((b - (1 - f) * 255) / f);
      }
    }
    out.data[i] = r; out.data[i + 1] = g; out.data[i + 2] = b; out.data[i + 3] = a;
  }
  console.log(`${file}: ${W}x${H}, ${(cleared / N * 100).toFixed(1)}% cleared, ${(partial / N * 100).toFixed(2)}% partial`);
  return { png: out, W, H };
}

function boxOf(png, W, H, test) {
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (test(x, y, png.data[(y * W + x) * 4 + 3])) {
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
  return [x0, y0, x1, y1];
}

function crop(png, W, H, [x0, y0, x1, y1], name) {
  const bx0 = Math.max(0, x0 - PAD), by0 = Math.max(0, y0 - PAD);
  const bx1 = Math.min(W - 1, x1 + PAD), by1 = Math.min(H - 1, y1 + PAD);
  const w = bx1 - bx0 + 1, h = by1 - by0 + 1;
  const o = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const si = ((by0 + y) * W + bx0 + x) * 4, di = (y * w + x) * 4;
    for (let k = 0; k < 4; k++) o.data[di + k] = png.data[si + k];
  }
  writeFileSync(join(OUT, `${name}.png`), PNG.sync.write(o));
  console.log(`  ${name}.png ${w}x${h} (box ${bx0},${by0} to ${bx1},${by1})`);
}

/* THE CHARACTER POSES, 2026-09-21. The storyboard's P2 to P5 are generated on
   pure white and saved as character-2.png to character-5.png in
   public/assets/objects. Name them on the command line; each is trimmed to
   everything with any alpha, so a soft shadow is kept rather than cut at the
   half-transparent line. With no arguments it cuts P1 from its source.

   The handset and the icon sprite were cut here until the storyboard took
   them off the site; their branch is gone with their files.

     node .measure/objcut.mjs character-2.png character-3.png
     ffmpeg -i .measure/out/objects/character-2.png -vf "scale='min(1600,iw)':-2"        -c:v libwebp -quality 90 public/assets/objects/character-2.webp */
const files = process.argv.slice(2);
const jobs = files.length
  ? files.map((f) => [f, f.replace(/\.png(\.png)?$/i, '')])
  : [['character.png.png', 'character']];
for (const [file, name] of jobs) {
  const { png, W, H } = cut(file);
  crop(png, W, H, boxOf(png, W, H, (x, y, a) => a > 8), name);
}

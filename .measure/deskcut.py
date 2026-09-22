"""deskcut.py - cut a supplied render to alpha, and encode it for its slot.

   WHY THIS IS NOT objcut.mjs. That tool floods in from the edge through
   pixels that are light and nearly neutral. DESIGN.md records it failing on
   the mascot render: the white sneakers touched the white ground with no
   darker edge, so the flood walked into the shoes and they came out
   transparent. A threshold cannot separate an object from a ground of the
   same value, because there is nothing in the pixel values to separate. A
   SEGMENTATION MODEL decides by what the thing IS, which is a different
   question, and rembg's isnet-general-use with alpha matting answers it.

   THREE STEPS, and the last two exist because a matte is not the end of the
   job when the render stood on a flat ground:

   1. rembg, isnet-general-use, alpha matting on.

   2. UN-PREMULTIPLY AGAINST THE GROUND. Every pixel the matte left partly
      transparent still carries (1-a) of the ground in its own colour, which
      composites onto the page as a halo. Recovering

          F = (C - (1-a) * G) / a

      takes the ground back out and leaves the shape. G IS AN ARGUMENT AND
      THAT MATTERS: the mascot stood on white (G = 255), the cost objects
      stand on black (G = 0, so the recovery is simply C/a). Running the
      white arithmetic over a black-ground render washes it out, and the
      other way round leaves a dark rind. Neither failure is subtle once it
      is on the page and both are invisible in the PNG on its own.

   3. SMOOTH THE CONTOUR, NOT THE IMAGE. What is left is a jagged alpha edge
      where the matte could not decide. A light blur on the ALPHA CHANNEL
      ALONE, then a steep smoothstep back through 0.5, straightens the
      contour without moving it and without touching a colour. Blurring the
      composite would soften the whole object.

   Then trim to the opaque box and encode WebP at 2x the slot.

     python .measure/deskcut.py <src> <out-base> <ground> <width> [keep]

       ground   "black" or "white", the colour the render stood on
       width    the WebP's width in px, which is 2x the CSS slot
       keep     pass "keep" to hold the SOURCE CANVAS instead of trimming to
                the opaque box

   WHY `keep` EXISTS. Trimming is right for a single object that will be sized
   on its own, like the mascot. It is wrong for a SET: the four cost renders
   were composed inside one 2048 square each, and trimming each to its own ink
   gave four different aspect ratios - 689x1642 next to 1668x1250 - so a row
   that shared one 280px slot would have shown them at four unrelated scales.
   The square is the founder's composition and the relative sizes inside it
   are a decision. Transparent margin costs almost nothing in WebP.

   THE COST OBJECTS, 2026-09-23. `costprep.mjs` used to mold them - a toe to
   black and an edge feather - so that `mix-blend-mode: screen` would drop
   their black ground into the page. That works at rest and FLASHES A BLACK
   BOX during a reveal, because screen over a fading parent is not the same
   composite. They are cut to real alpha now and mounted as plain images, so
   there is nothing to blend and nothing to flash:

     python .measure/deskcut.py "public/assets/objects/cost-1. png.png" \\
            public/assets/cost-1 black 560
"""
import os
import sys

import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove

SRC = sys.argv[1]
OUT = sys.argv[2]
GROUND = (sys.argv[3] if len(sys.argv) > 3 else 'white').lower()
WIDTH = int(sys.argv[4]) if len(sys.argv) > 4 else 640
KEEP = len(sys.argv) > 5 and sys.argv[5].lower() == 'keep'

G = 255.0 if GROUND == 'white' else 0.0
# The page ground each is checked against, for the composite this writes out.
CHECK = (11, 11, 13)

im = Image.open(SRC).convert('RGBA')
print(f'in            {im.size[0]}x{im.size[1]}  ground={GROUND}')

cut = remove(
    im,
    session=new_session('isnet-general-use'),
    alpha_matting=True,
    alpha_matting_foreground_threshold=240,
    alpha_matting_background_threshold=15,
    alpha_matting_erode_size=8,
)

arr = np.asarray(cut).astype(np.float32)
rgb, a = arr[..., :3], arr[..., 3:4] / 255.0

eps = 1e-3
fg = np.clip(np.where(a > eps, (rgb - (1.0 - a) * G) / np.maximum(a, eps), rgb), 0, 255)

am = Image.fromarray((a[..., 0] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1))
av = np.asarray(am).astype(np.float32)[..., None] / 255.0
t = np.clip((av - 0.34) / (0.66 - 0.34), 0.0, 1.0)
av = t * t * (3.0 - 2.0 * t)
av = np.where(av < 0.06, 0.0, av)

res = Image.fromarray(np.concatenate([fg, av * 255.0], axis=2).astype(np.uint8), 'RGBA')
if KEEP:
    print(f'cut, canvas   {res.size[0]}x{res.size[1]}')
else:
    box = res.getbbox()
    if box:
        res = res.crop(box)
    print(f'cut, trimmed  {res.size[0]}x{res.size[1]}')

res.save(f'{OUT}.png')
h = round(res.size[1] * WIDTH / res.size[0])
res.resize((WIDTH, h), Image.LANCZOS).save(f'{OUT}.webp', 'WEBP', quality=88, method=6)
print(f'webp          {WIDTH}x{h}  {os.path.getsize(OUT + ".webp") / 1024:.1f} KB')

# The eye check: the object on the ground it actually stands on.
name = os.path.basename(OUT)
os.makedirs('.measure/out', exist_ok=True)
comp = Image.alpha_composite(Image.new('RGBA', res.size, CHECK + (255,)), res).convert('RGB')
comp.save(f'.measure/out/{name}-on-base.png')
print(f'wrote         .measure/out/{name}-on-base.png')

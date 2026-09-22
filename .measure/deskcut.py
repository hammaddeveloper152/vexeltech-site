"""deskcut.py - the mascot at the desk, cut to alpha and encoded for stop 03.

   WHY THIS IS NOT objcut.mjs. That tool floods in from the edge through
   pixels that are light and nearly neutral, and DESIGN.md already records it
   failing on exactly this render: the white sneakers touch the white ground
   with no darker edge between them, so the flood walks straight into the
   shoes and they come out transparent, reading as black shoes on the base.
   Two attempted fixes are recorded as rejected. A threshold cannot separate
   a white object from a white ground, because there is nothing in the pixel
   values to separate.

   So this one uses a SEGMENTATION MODEL - rembg's isnet-general-use with
   alpha matting - which decides by what the thing IS rather than by how
   light it is. The shoes survive. Verified against the base, which is the
   only ground this object stands on.

   THREE STEPS, and the second two exist because the model's matte is not the
   end of the job on a white ground:

   1. rembg, isnet-general-use, alpha matting on.

   2. UN-PREMULTIPLY AGAINST WHITE. The render stood on flat white, so every
      pixel the matte left partly transparent still carries (1-a) of that
      white in its own colour. Composited onto the base that reads as a pale
      halo. Recovering F = (C - (1-a)*255)/a takes the white back out and
      leaves the shape. This is the same arithmetic objcut.mjs does for its
      own flood, applied to a matte instead.

   3. SMOOTH THE CONTOUR, NOT THE IMAGE. What is left after step 2 is a
      jagged alpha edge along the shoes - single pixels the matte could not
      decide, because a white toe against a white floor is the hardest call
      in the frame. A light blur on the ALPHA CHANNEL ALONE, followed by a
      steep smoothstep back through 0.5, straightens the contour without
      moving it and without touching a colour. Blurring the composite would
      soften the whole object; this only affects where the edge falls.

   Then trim to the opaque box and encode. The output is 640px wide, the
   mount is 320px at 1280, so the file carries 2x for a retina screen and
   nothing more.

     python .measure/deskcut.py

   Writes public/assets/objects/character-desk.png (the working RGBA) and
   character-desk.webp (what the page loads), plus a composite over the base
   at .measure/out/desk-on-base.png for the eye check that closes it.
"""
import numpy as np
from PIL import Image, ImageFilter
from rembg import remove, new_session

SRC = 'public/assets/objects/character-3-raw.png.png'
OUT_PNG = 'public/assets/objects/character-desk.png'
OUT_WEBP = 'public/assets/objects/character-desk.webp'
BASE = (11, 11, 13)          # --c-base #0B0B0D, the only ground it stands on
WIDTH = 640                  # mounted at 320px, so 2x and no more

im = Image.open(SRC).convert('RGBA')
print(f'in            {im.size[0]}x{im.size[1]}')

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

# 2. un-premultiply against the white the render stood on
eps = 1e-3
fg = np.clip(np.where(a > eps, (rgb - (1.0 - a) * 255.0) / np.maximum(a, eps), rgb), 0, 255)

# 3. straighten the contour: blur alpha only, then smoothstep back through 0.5
am = Image.fromarray((a[..., 0] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1))
av = np.asarray(am).astype(np.float32)[..., None] / 255.0
t = np.clip((av - 0.34) / (0.66 - 0.34), 0.0, 1.0)
av = t * t * (3.0 - 2.0 * t)
av = np.where(av < 0.06, 0.0, av)      # below 6% is haze, not object

res = Image.fromarray(np.concatenate([fg, av * 255.0], axis=2).astype(np.uint8), 'RGBA')
res = res.crop(res.getbbox())
print(f'cut, trimmed  {res.size[0]}x{res.size[1]}')

res.save(OUT_PNG)

h = round(res.size[1] * WIDTH / res.size[0])
small = res.resize((WIDTH, h), Image.LANCZOS)
small.save(OUT_WEBP, 'WEBP', quality=88, method=6)
import os
print(f'webp          {WIDTH}x{h}  {os.path.getsize(OUT_WEBP)/1024:.1f} KB')

# the eye check: the object on the one ground it stands on
comp = Image.alpha_composite(Image.new('RGBA', res.size, BASE + (255,)), res).convert('RGB')
comp.save('.measure/out/desk-on-base.png')
W, H = res.size
comp.crop((int(0.32 * W), int(0.80 * H), int(0.81 * W), H)).resize((760, 460), Image.LANCZOS).save(
    '.measure/out/desk-sneakers.png'
)
comp.crop((int(0.53 * W), int(0.31 * H), W, int(0.57 * H))).resize((700, 560), Image.LANCZOS).save(
    '.measure/out/desk-laptop.png'
)
print('wrote the base composite and the two crops')

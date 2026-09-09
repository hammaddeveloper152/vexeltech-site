import React, { useEffect, useRef, useState } from 'react';
import './TileWall.css';
import { ART, LANES, STILL, VIDEO_SLOTS } from './bench.js';
import { clipFor } from './videoTiles.js';
import { VideoTile, videoAllowed } from './Video.jsx';

/* The wall is a BENCH.

   A lit studio bench seen from above, with design artefacts lying on it —
   press sheets, swatch strips, type specimens, tracing paper, tape, a steel
   rule, a blade. It used to be a grid of photographs, and six columns of
   equal rectangles read as a stock grid however good the pictures were.
   Objects on a bench overlap, sit at angles, and are not all the same size.
   bench.js is the arrangement; this file only renders it.

   ---- What is machinery and stayed ----------------------------------------

   Six lanes, each drifting at an ambient station in alternating directions,
   the set rendered twice so the loop is one continuous translate with no
   seam. The wall starts still and wakes after the hero's entrance, one lane
   at a time on the sweep stagger. The responsive ladder, the video capability
   with its four gates, and the sourcing rule. None of that changed.

   ---- What is flat and what is lit ----------------------------------------

   The ground is asphalt and the interface is flat: no shadows, no gradients,
   no depth anywhere in this stylesheet or this markup. The bench is warm and
   lit from one side, and that warmth lives ENTIRELY IN THE IMAGES. Every
   artefact carries its own light baked into its pixels — placeholder or
   photograph — and the CSS does nothing to it but place, rotate and clip.
   This is the line the direction runs closest to, and it is recorded in
   DESIGN.md as a boundary rather than a preference.

   ---- Drift with objects of different heights ------------------------------

   The track was a grid with equal rows. It is now a flex column, because a
   negative top margin on a grid item pulls it up inside its own row and
   overlaps nothing; in a column of flex items it pulls the item over the one
   before it, which is what a sheet lying on a sheet is. Rotated elements are
   painted in DOM order, so the later item is on top: a bench is stacked in
   the order things landed.

   The doubled track still translates by exactly half its height. Both copies
   are the same items with the same overlaps, so half is still one set. */

/* Vite resolves these at build time, so a renamed file fails the build rather
   than 404ing quietly at runtime. */
const AVIF = import.meta.glob('../../assets/images/bench/*.avif', {
  eager: true,
  query: '?url',
  import: 'default',
});
const WEBP = import.meta.glob('../../assets/images/bench/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

/* The ladder is the wall's, unchanged in its five widths. It was derived from
   the MEASURED lane width at every breakpoint times the plausible pixel
   ratios, and the lanes did not change. An artefact wider than its lane
   takes a larger candidate through `sizes`, below. */
const WIDTHS = [320, 480, 640, 800, 1200];
const set = (map, name, ext) =>
  WIDTHS.map((w) => `${map[`../../assets/images/bench/${name}-${w}.${ext}`]} ${w}w`).join(', ');

/* What one LANE is worth at each breakpoint — measured off the grid, gap is
   --s-md at 16px. An artefact's own width is this times its share. */
const LANE = [
  '(max-width: 767px) 100vw',
  '(max-width: 1023px) calc((100vw - 32px) / 3)',
  'calc((100vw - 80px) / 6)',
];
const sizesFor = (share) =>
  LANE.map((s) => {
    const [cond, val] = s.startsWith('(') ? [s.slice(0, s.indexOf(')') + 1), s.slice(s.indexOf(')') + 2)] : ['', s];
    return `${cond} calc(${val} * ${share})`.trim();
  }).join(', ');

/* Which placeholder file an item draws. Prints cycle through six tones so no
   two adjacent prints are the same picture; sheets cycle through three.
   These are the files the real photographs replace, name for name. */
let printN = 0;
const fileFor = (art, laneIndex, itemIndex) => {
  if (art === 'print') return `print-${(printN++ % 6) + 1}`;
  if (art === 'sheet-p' || art === 'sheet-l') {
    const v = (laneIndex + itemIndex) % 3;
    return v === 0 ? art : `${art}-${v}`;
  }
  return art;
};

/* AVIF first, WebP as the fallback, no JPEG. */
function ArtPicture({ file, share }) {
  const sizes = sizesFor(share);
  return (
    <picture className="wall__pic">
      <source type="image/avif" srcSet={set(AVIF, file, 'avif')} sizes={sizes} />
      <img
        className="wall__img"
        src={WEBP[`../../assets/images/bench/${file}-640.webp`]}
        srcSet={set(WEBP, file, 'webp')}
        sizes={sizes}
        alt=""
        decoding="async"
        fetchPriority="low"
      />
    </picture>
  );
}

/* The player and the four gates live in `Video.jsx` and are imported above.
   They were defined here, for this wall, and moved out when the capability was
   remounted onto the work grid — the wall is unmounted and the grid is not, so
   the shared file is the one that is exercised. Nothing about them changed in
   the move except the class name, which is now passed in.

   The contract is unchanged and worth restating where it is used:
   preload="none" so nothing is fetched until play(), an IntersectionObserver
   so only a tile on screen asks, `live` so nothing asks until the hero's
   entrance is over, and a refusal outright under reduced motion, Save-Data or
   a slow connection. Play requires intersecting AND the document visible,
   because observer callbacks are throttled and a backgrounded tab would
   otherwise go on decoding. Verify with the window focused. */

/* One artefact on the bench. Width, angle and overlap come from bench.js as
   custom properties; the stylesheet turns them into geometry. `--up` is a
   percentage of the LANE width, because a percentage top margin resolves
   against the containing block's width and not its height: the item's height
   is lane * share / ratio, so the overlap is up * share / ratio of the lane.

   Three states, as before: a clip and video allowed -> the video; a clip and
   video refused -> poster only, never the artefact; no clip -> the picture. */
function Artefact({ item, lane, laneIndex, itemIndex, allow, live }) {
  const ratio = ART[item.art].ratio;
  const slot = `${lane}-${itemIndex}`;
  const clip = clipFor(VIDEO_SLOTS[slot]);
  const style = {
    '--w': item.w,
    '--ar': ratio,
    '--rot': `${item.rot}deg`,
    '--up': `${-(item.up * item.w / ratio * 100).toFixed(2)}%`,
  };
  return (
    <div className="bench__item" data-slot={slot} data-art={item.art} style={style}>
      {clip && allow ? (
        <VideoTile clip={clip} live={live} className="wall__img wall__video" />
      ) : clip ? (
        <img className="wall__img" src={clip.poster} alt="" decoding="async" fetchPriority="low" />
      ) : (
        <ArtPicture file={fileFor(item.art, laneIndex, itemIndex)} share={item.w} />
      )}
    </div>
  );
}

/* The still layer: the objects at the mark's angle that lie ACROSS the
   bench. They sit inside the wall, above the lanes and below the scrim, and
   they do not drift — which is both why they read as placed and why they
   can span lanes at all. Never video. */
function Still({ obj }) {
  const ratio = ART[obj.art].ratio;
  const style = {
    '--x': `${obj.x * 100}%`,
    '--y': `${obj.y * 100}%`,
    '--w': obj.w,
    '--ar': ratio,
    '--rot': `${obj.rot}deg`,
  };
  return (
    <div className="bench__still" data-art={obj.art} style={style}>
      <ArtPicture file={obj.art} share={obj.w * 6} />
    </div>
  );
}

/* `live` is the hero's ambient phase and gates the VIDEO, not the drift — the
   drift is CSS and already hangs off data-phase. No clip is requested until
   the entrance is over. */
export default function TileWall({ live = false }) {
  const [allow, setAllow] = useState(false);
  useEffect(() => setAllow(videoAllowed()), []);

  return (
    <div className="wall bench" aria-hidden="true">
      {LANES.map(({ id, dir, station, items }, col) => (
        <div className="wall__col" key={id}>
          <div
            className={`wall__track wall__track--${dir}`}
            style={{ '--dur': `var(--d-ambient-${station})`, '--col': col }}
          >
            {items.map((item, i) => (
              <Artefact item={item} lane={id} laneIndex={col} itemIndex={i} allow={allow} live={live} key={`x${i}`} />
            ))}
            {items.map((item, i) => (
              <Artefact item={item} lane={id} laneIndex={col} itemIndex={i} allow={allow} live={live} key={`y${i}`} />
            ))}
          </div>
        </div>
      ))}
      {STILL.map((obj, i) => (
        <Still obj={obj} key={`s${i}`} />
      ))}
    </div>
  );
}

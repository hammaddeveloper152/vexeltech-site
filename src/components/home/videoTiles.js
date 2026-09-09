/* Video tiles for the wall — the CAPABILITY, not the content.
   ==========================================================================

   Nothing here requires a single clip to exist. Until a clip and its poster
   are both present the slot renders its still photograph exactly as before,
   so the wall is complete and correct with zero video files in the tree. Drop
   files in and the slots light up; take them out and the wall reverts.

   ---- Why so few -----------------------------------------------------------

   SIX slots, out of forty-eight. The wall renders six columns of seven to nine
   tiles and repeats the set for the loop, so there are 48 logical slots and 96
   tile elements. Twenty-four is the count of tiles roughly IN VIEW at 1280,
   not the count in the wall.

   A wall of moving tiles is not a wall, it is a screensaver, and it is a load
   disaster: the still wall already transfers 2.6MB of photographs and its LCP
   on a throttled phone is a tile image at 6.3s. Six is enough for the eye to
   catch movement somewhere on the surface without ever being able to watch all
   of it, which is the effect wanted.

   ---- Which six, and why these ---------------------------------------------

   See bench.js for the slots. ONE PER LANE, which makes vertical adjacency
   impossible by construction rather than by checking. Horizontal adjacency
   cannot be arranged for: the lanes run at different ambient stations in
   opposite directions, so every horizontal pairing changes continuously. What
   can be arranged is the starting height, and the six sit at spread heights
   rather than in a band. Every video slot is a PRINT — the one artefact whose
   16:10 shape is the clip's shape — and the still layer never carries video. */
/* The slots themselves live in bench.js with the rest of the arrangement, so
   there is one file that says what lies where. Re-exported here so the video
   machinery keeps a single import. Every video slot is a 16:10 print — the
   one artefact whose shape is the clip's shape — and there is one per lane. */
export { VIDEO_SLOTS } from './bench.js';

/* Vite resolves these at build time. A missing file is simply absent from the
   map rather than a runtime 404, which is what makes the slot fall back to its
   still image instead of painting a black rectangle. */
const MP4 = import.meta.glob('../../assets/video/clip-*.mp4', {
  eager: true,
  query: '?url',
  import: 'default',
});
const ALT = import.meta.glob('../../assets/video/clip-*.webm', {
  eager: true,
  query: '?url',
  import: 'default',
});
const POSTER = import.meta.glob('../../assets/video/poster-*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});

const two = (n) => String(n).padStart(2, '0');

/* A slot only becomes video when BOTH a clip and its poster exist.

   The poster is not optional and it is not the tile's own photograph: it is a
   still FROM THE CLIP, so the tile is already showing the first frame of what
   will move before a single video byte is requested. A clip without its poster
   would paint the tile's border colour until the video decoded, which is a
   hole in the wall, so that case falls back to the still image instead. */
export function clipFor(id) {
  if (!id) return null;
  const mp4 = MP4[`../../assets/video/clip-${two(id)}.mp4`];
  const poster = POSTER[`../../assets/video/poster-${two(id)}.jpg`];
  if (!mp4 || !poster) return null;
  return { mp4, alt: ALT[`../../assets/video/clip-${two(id)}.webm`] || null, poster };
}

/* The four gates and the player moved to `Video.jsx` when the capability was
   remounted onto the work grid, and they are re-exported rather than copied:
   two definitions of a refusal rule are two definitions that drift. What is
   still this file's own is the wall's slot map and its `clip-0N` file names.

   The wall itself is unmounted. This file is kept live and correct so that
   mounting it again is one line in Hero.jsx, not a rebuild. */
export { videoAllowed, VideoTile } from './Video.jsx';

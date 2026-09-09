/* The work grid's six clips — the CONTENT slots, not the mechanism.
   ==========================================================================

   The mechanism is `Video.jsx`: the four gates and the player, shared with the
   dormant tile wall so neither can drift from the other. What lives here is
   only which files belong to which plate.

   ---- Six plates, six clips, and no slot map ------------------------------

   The wall needed a slot map (`bench.js`, `VIDEO_SLOTS`) because it had 48
   logical slots and could take video in only six of them, one per lane, so
   that vertical adjacency was impossible by construction. The work grid has
   exactly six plates and every one of them may move, so the map is the plate
   number and there is nothing to choose.

   That removes the wall's whole adjacency problem rather than solving it
   again. What replaces it is a weight problem, and it is the one that binds:
   six clips on one screen is six decoders. The gates below are why that is
   affordable — a plate that is not on screen has not requested a byte.

   ---- Three states per plate ----------------------------------------------

     clip + poster, video allowed   the video
     clip + poster, video refused   the poster, alone
     poster only, no clip           the poster, alone
     neither                        the hairline empty state and its index

   A clip WITHOUT its poster is not video. It would paint the plate's own
   surface until the video decoded, which is a hole in the grid, so it falls
   back to the empty state exactly as if neither file were there. The poster
   is the load-bearing file of the pair.

   The poster is a still FROM ITS OWN CLIP, never a different picture: it is
   what the plate shows before any video byte is requested, what a refused
   autoplay leaves on screen, and what a reduced-motion or Save-Data reader
   sees instead. If it were a separate image the grid would show different
   pictures depending on whether the reader got motion.
   ========================================================================== */

/* ---- Why the poster is WebP and not JPEG --------------------------------

   The tile ladder rule is AVIF with a WebP fallback and no JPEG at all, and it
   gets there with `<picture>`. A `poster` attribute cannot do that: it is one
   URL with no fallback, so the format has to be one every target decodes on
   its own. AVIF is not that yet. WebP is, and it is the one the ladder already
   names as the fallback tier.

   The same file is the `<img src>` in the poster-only state, so a plate is one
   still whichever path it takes, and there is no second image to keep in step.
   The wall's dormant `clip-0N` contract still says `.jpg`; it was written
   before the ladder rule existed and is not the live one.

   Vite resolves these at build time. A missing file is simply absent from the
   map rather than a runtime 404, which is what makes a plate fall back to its
   empty state instead of painting a black rectangle. */
const MP4 = import.meta.glob('../../assets/video/work-*.mp4', {
  eager: true,
  query: '?url',
  import: 'default',
});
const ALT = import.meta.glob('../../assets/video/work-*.webm', {
  eager: true,
  query: '?url',
  import: 'default',
});
const POSTER = import.meta.glob('../../assets/video/work-*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

const two = (n) => String(n).padStart(2, '0');

/* `n` is the plate's position in the grid, 1 to 6.

   Returns null when the plate has no poster, which covers both "no files at
   all" and "a clip arrived without its still". `mp4` may be null on its own:
   that is the poster-only state, and it is a legitimate way to ship a plate
   rather than a half-finished one. */
export function clipForPlate(n) {
  const poster = POSTER[`../../assets/video/work-${two(n)}.webp`];
  if (!poster) return null;
  return {
    poster,
    mp4: MP4[`../../assets/video/work-${two(n)}.mp4`] || null,
    alt: ALT[`../../assets/video/work-${two(n)}.webm`] || null,
  };
}

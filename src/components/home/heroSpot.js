/* The hero spot — its cuts, its lines and its files. One definition of each.
   ==========================================================================

   The clip is 12.042s at 24fps, four shots, three hard cuts. The cuts are
   FRAME NUMBERS rather than seconds, because a frame is what ffmpeg reported
   and a rounded second is not: 145 / 24 is 6.041666, and "6.04" is a frame
   early.

     cut   frame   time      score    what changes
     1       45    1.875s    0.228    the phone on the desk, to the city
     2      145    6.042s    0.076    the city, to black, and the screens come on
     3      234    9.750s    0.392    the screen wall, to the phone ringing

   The clip's median scene score is 0.0019, so cuts 1 and 3 are unmistakable.
   CUT 2 IS NOT FINDABLE BY THRESHOLD, and that is worth knowing before anyone
   re-runs detection on a new cut of this spot: a dark city cutting to black
   scores low, and each screen switching on afterwards scores just as high
   (0.074 to 0.076 at frames 153, 155 and 160). Any threshold that catches
   frame 145 also reports three cuts that are not there. It was placed from the
   frames: 144 is the city, 145 is black, 146 is the first screen.

   SHOT 3 IS BLURRED IN EVERY FILE, frames 145 to 233, Gaussian sigma 20 in
   source pixels, colour untouched. The screen wall carries interface text, and
   under the 70% scrim at 1280 a wordmark on the teal screen and the figures on
   the red one still read as glyphs, which the sourcing rule bans. The user's
   rule was the minimum radius that breaks them: rendered at display scale
   under the plate, the digits still read at 16 and are soft blocks at 20. A
   re-cut of this spot re-applies it, or re-derives it if the footage changes.

   Each line starts on its cut and begins its exit EXIT_MS before the next one,
   so no line is ever on screen across a cut. The last line has no next cut and
   stays: the rotating headline is retired and this is the headline now. */

export const FPS = 24;
export const CUT_FRAMES = [0, 45, 145, 234];
export const CUTS = CUT_FRAMES.map((f) => f / FPS);
export const EXIT_MS = 200;

/* Sentence case in the source and uppercase in the stylesheet, as every loud
   string on the site is. Case is copy; the transform is the register. */
export const LINES = [
  "Nobody's calling.",
  "They can't find you. Yet.",
  'We build the thing that finds them.',
  'Not a proposal. The finished thing.',
];

export const FINAL_LINE = LINES[LINES.length - 1];

/* Under 768 the tall cut: 608 by 1080, a 9:16 crop of the source. Centre crop
   for shots 1, 2 and 4; shot 3 is cropped to the window holding the most lit
   screen, so the wall fills the frame rather than the dark room beside it.

   Chosen ONCE, at mount. A reader who rotates a phone mid-spot keeps the cut
   they started on rather than restarting the clip at a different ratio. */
export const TALL_QUERY = '(max-width: 767px)';

export const SPOT = {
  wide: {
    webm: '/assets/hero/hero-spot.webm',
    mp4: '/assets/hero/hero-spot.mp4',
    poster: '/assets/hero/hero-spot-poster.webp',
  },
  tall: {
    webm: '/assets/hero/hero-spot-tall.webm',
    mp4: '/assets/hero/hero-spot-tall.mp4',
    poster: '/assets/hero/hero-spot-tall-poster.webp',
  },
};

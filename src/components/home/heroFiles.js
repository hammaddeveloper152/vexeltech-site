/* The hero film's files, imported so each ships with a content hash
   (2026-10-05). Kept apart from heroSpot.js, which is the copy and the cut
   frames and is imported by the measurement scripts in Node, where a .webm
   import cannot load. */

/* THEY ARE IMPORTED, NOT SERVED FROM public/, 2026-10-05. A file in
   public/ keeps its name across encodes, so a cache holding the old one keeps
   serving it. Imported, each gets a content hash in its filename: a new
   encode is a new URL, and /assets/* can be cached as immutable. */
import wideWebm from '../../assets/hero/hero-spot.webm';
import wideMp4 from '../../assets/hero/hero-spot.mp4';
import wideFirst from '../../assets/hero/hero-spot-first.webp';
import mobileWebm from '../../assets/hero/hero-spot-m.webm';
import mobileMp4 from '../../assets/hero/hero-spot-m.mp4';
import mobileFirst from '../../assets/hero/hero-spot-m-first.jpg';

/* `first` is a frame from the film's first second (0.5s, the phone on the
   desk): the video element's own poster, which is what shows until the clip
   plays and what stays if autoplay is refused, and the whole of the still
   mode. The last-frame posters are deleted (2026-10-05): the hero shows the
   film or a frame of it, and the still is never the last frame. The mobile
   one is a JPEG, 12.6 KB (the brief's ceiling is 60). */
export const SPOT = {
  wide: {
    webm: wideWebm,
    mp4: wideMp4,
    first: wideFirst,
  },
  mobile: {
    webm: mobileWebm,
    mp4: mobileMp4,
    first: mobileFirst,
  },
};

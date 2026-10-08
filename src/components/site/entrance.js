import { useEffect, useLayoutEffect } from 'react';

/* THE ENTRANCE RULE (FINAL41 part 4, 2026-10-08, the founder; BUILD-LAW
   Motion). Every artifact that plays once:

     on load, below the fold   set to its start state in the hydration step,
                               before that region paints, while it is off
                               screen; the prerendered HTML stays finished
     at half in view           plays once: a 400ms crossfade into the first
                               step, the recorded sequence, then finished
     in view at first paint    (a deep link, a restored scroll) it stays
                               finished and does not play: nothing visible
                               is ever removed
     reduced motion            finished, no play

   These are the shared pieces: a layout effect that runs before the first
   paint on the client and as an effect on the server (where it never
   runs), and the test for "entirely below the fold". A URL with a #hash
   counts as in view: the browser may still be scrolling to its target, and
   an artifact there must not be emptied under the reader. */
export const useBeforePaint = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const motionAllowed = () =>
  typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function belowFold(el) {
  if (!el || typeof window === 'undefined') return false;
  if (window.location.hash) return false;
  return el.getBoundingClientRect().top >= window.innerHeight;
}

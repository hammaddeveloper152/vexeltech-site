import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* Lenis, wired as smoothing and nothing else.

   DESIGN.md's test is whether input maps one to one to distance: a given
   amount of wheel or swipe must always yield the same amount of document
   travel, with only the easing to it changed. So both multipliers are pinned
   at 1 and there is no snapping, no section targeting, and no wheel capture.
   The moment this is configured to pick a destination it is hijacking and it
   is out.

   Lenis is global, so it lives here as a singleton rather than inside a
   section. Ref counted, because React StrictMode mounts every effect twice in
   development and a second Lenis on the same page fights the first. */

let lenis = null;
let tick = null;
let refs = 0;

export function getLenis() {
  return lenis;
}

export function useSmoothScroll() {
  useEffect(() => {
    /* Switched off entirely, not reduced. There is no gentler version of
       easing someone's scroll, and interposing anything between a reader and
       the scroll position is exactly what the preference asks you not to do.
       ScrollTrigger falls back to the native scroll on its own. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    refs += 1;

    if (!lenis) {
      lenis = new Lenis({
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        /* Touch stays native. Smoothing a swipe breaks the one to one test
           on the device where it matters most. */
        syncTouch: false,
      });

      lenis.on('scroll', ScrollTrigger.update);

      tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      /* GSAP's lag smoothing skips ahead after a slow frame, which puts the
         ticker and Lenis on different clocks and shows up as the pinned track
         jumping. */
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      refs -= 1;
      if (refs > 0 || !lenis) return;
      gsap.ticker.remove(tick);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenis = null;
      tick = null;
    };
  }, []);
}

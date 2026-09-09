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
let fontsArmed = false;

/* ScrollTrigger measures once, when a trigger is created, and again only on
   resize. The webfonts land later than that on a cold cache: Monigue, Clash
   and Satoshi arrived at 1.4 to 1.8 seconds against components mounting at
   80ms, and every heading between the hero and the trigger changes height
   when the fallback face is replaced. So every start and end below the hero
   was measured against the fallback layout and stayed wrong for the whole
   session: 200px into Failures the rail had drawn 0px and all four
   consequences sat at opacity 0; the process numerals lit a viewport after
   the reader had passed them. A warm cache has the fonts before the first
   trigger is created and shows none of it, which is why it went unseen.

   One refresh when the fonts are ready re-measures everything. It is armed
   from an effect, not at module scope: `document.fonts.ready` settles
   immediately if nothing is loading yet, and nothing loads until text is
   laid out, so arming it before mount would fire before the fonts had even
   been requested. `loadingdone` covers any face that starts loading later
   than the first batch. Recorded in BUILD-LAW under what the detector
   cannot see. */
function refreshWhenFontsLand() {
  if (fontsArmed || !document.fonts) return;
  fontsArmed = true;
  const refresh = () => ScrollTrigger.refresh();
  document.fonts.ready.then(refresh);
  document.fonts.addEventListener('loadingdone', refresh);
}

export function getLenis() {
  return lenis;
}

export function useSmoothScroll() {
  useEffect(() => {
    /* Before the reduced-motion return: the Services pin and any trigger that
       survives the preference still measure against the fallback layout. */
    refreshWhenFontsLand();

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

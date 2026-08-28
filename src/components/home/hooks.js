import { useEffect, useRef, useState } from 'react';

/* Shared behaviour for the home sections. One definition of each, imported
   everywhere: Hero, WorkGrid and CounterRow all read reduced motion from
   here. Do not re-declare either hook locally. */

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  return reduced;
}

/* Batched reveal.

   One observer per section rather than one per element, per DESIGN.md scroll
   motion: the section is the thing being watched and its children run off a
   single class change. Fires once and disconnects, so scrolling back up and
   down again does not replay the reveal.

   threshold is 0 on purpose. A ratio threshold cannot be met by a section
   taller than the viewport: 15% of the work grid is more pixels than the
   window has, so the callback never fires and the section stays at zero
   opacity forever. The trigger is the leading edge crossing a viewport
   shortened by rootMargin instead, which holds at any section height.

   No scroll listener anywhere. */
export function useReveal({ threshold = 0, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    /* No observer means no reveal to run: show the content rather than
       leaving a section stuck at zero opacity. */
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [revealed, threshold, rootMargin]);

  return [ref, revealed];
}

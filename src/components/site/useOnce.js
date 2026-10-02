import { useEffect, useState } from 'react';
import { loadTrigger } from './motionLibs.js';

/* ONE ENTRANCE PER OBJECT, ON SCROLL (the final pass, 2026-10-03). GSAP's
   ScrollTrigger fires `run(gsap, el)` once, when the element's top crosses
   `start`. Already past it when the trigger is made (a reload halfway down,
   a fragment link): it runs at once.

   `armed` is true while an entrance is still owed. A component keeps its
   final state on screen unless `armed`, so:
     reduced motion   never armed: the final state, nothing loads
     before GSAP      armed from the first render, held at the start state
     after the run    disarmed, the final state stays
   Under reduced motion the hook does nothing at all (BUILD-LAW Motion). */
export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useOnce(ref, run, start = 'top 80%') {
  const [armed, setArmed] = useState(() => !prefersReduced());
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) {
      setArmed(false);
      return undefined;
    }
    let live = true;
    let st = null;
    const fire = (gsap) => {
      if (!live) return;
      if (st) st.kill();
      st = null;
      run(gsap, el, () => live && setArmed(false));
    };
    loadTrigger().then(({ gsap, ScrollTrigger }) => {
      if (!live) return;
      st = ScrollTrigger.create({ trigger: el, start, onEnter: () => fire(gsap) });
      if (st.scroll() >= st.start) fire(gsap);
    });
    return () => {
      live = false;
      if (st) st.kill();
    };
    // run and start are fixed for a use's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return armed;
}

/* THE SAME ENTRANCE WITHOUT GSAP, for a route that loads no animation
   library (/services, the final pass, 2026-10-03: GSAP is home's and
   About's). `armed` as above; it disarms once, when `amount` of the
   element is in the viewport (0.2 is 20% in), and `run()` follows. Reduced
   motion: never armed, and `run` is not called. */
export function useSeen(ref, run, amount = 0.2) {
  const [armed, setArmed] = useState(() => !prefersReduced());
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced() || typeof IntersectionObserver === 'undefined') {
      setArmed(false);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          setArmed(false);
          if (run) run();
        }
      },
      { threshold: amount }
    );
    io.observe(el);
    return () => io.disconnect();
    // run and amount are fixed for a use's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return armed;
}

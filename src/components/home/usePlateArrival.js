import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from './smoothScroll.js';

/* PLATES ARRIVE. One hook, both mounts.

   A plate rests at 1.5 degrees, alternating, and straightens to zero with a
   4px lift over 250ms on the reveal curve when it is 30% into the viewport —
   ScrollTrigger at `top 70%`.

   IT FIRES ONCE. A plate that re-tilts when it leaves the top of the screen
   undoes itself behind the reader, and scrolling back would re-straighten
   plates they have already read. Arrival happens once.

   THE STAGGER IS 70ms AND IT IS PER GROUP, NOT PER PLATE. Four plates in a 2x2
   grid cross `top 70%` in pairs — the two in a row arrive together — so a
   delay indexed on the plate's position in the list would give the second pair
   140ms and 210ms of lag for no reason a reader could see. The delay is the
   index within the group that fires together, which is what a stagger is.

   Reduced motion: straight from first paint, with no trigger created at all.
   Not a slower straighten — the whole device is the movement, and there is no
   gentler version of a rectangle rotating. */
export default function usePlateArrival(count) {
  const plates = useRef([]);

  /* ScrollTrigger is registered in smoothScroll.js and nowhere else. Calling
     the hook is how a section says it depends on that, rather than relying on
     another one to have imported it first. Ref counted by design. */
  useSmoothScroll();

  useEffect(() => {
    const els = plates.current.filter(Boolean);
    if (!els.length) return undefined;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      /* Plates that cross the line inside one frame are one group. */
      let group = [];
      let flushing = null;
      const flush = () => {
        group.forEach((el, i) => {
          el.style.transitionDelay = `${i * 70}ms`;
          el.dataset.in = 'true';
        });
        group = [];
        flushing = null;
      };
      const arrive = (el) => {
        if (el.dataset.in === 'true' || group.includes(el)) return;
        group.push(el);
        if (!flushing) flushing = requestAnimationFrame(flush);
      };

      const sts = els.map((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: 'top 70%',
          once: true,
          onEnter: () => arrive(el),
          /* A plate above the fold on first paint never crosses its start, so
             it would sit tilted forever. */
          onRefresh: (self) => {
            if (self.progress > 0) arrive(el);
          },
          id: `plate-in-${i}`,
        })
      );

      return () => {
        if (flushing) cancelAnimationFrame(flushing);
        sts.forEach((s) => s.kill());
      };
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      els.forEach((el) => {
        el.dataset.in = 'true';
      });
      return undefined;
    });

    return () => mm.revert();
  }, [count]);

  /* The setter AND the list. A mount that only arranges plates needs the
     first; the services index needs the second, because it tracks which plate
     the reader is on and scrolls to one when a numeral is pressed. */
  const setPlate = (i) => (el) => {
    plates.current[i] = el;
  };
  return [setPlate, plates];
}

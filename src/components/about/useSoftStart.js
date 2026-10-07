import { useEffect, useState } from 'react';

/* REST FULL, START SOFT (final37, 2026-10-08, the founder's ruling for
   About's What we hold to and The Next Size). Everything is in place and
   visible on first paint, in the prerendered HTML, off screen and under
   reduced motion. Once, when the block is half in view, it returns true and
   the block's items replay their entrance (about.css): each from below
   with its opacity from 0, one after another. False on the first render,
   so the server render and hydration agree. */
export default function useSoftStart(ref) {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setPlay(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return play;
}

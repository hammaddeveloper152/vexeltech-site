import { useEffect, useState } from 'react';
import { useBeforePaint, motionAllowed, belowFold } from '../site/entrance.js';

/* THE ENTRANCE RULE for About's What we hold to and The Next Size (FINAL41
   part 4, 2026-10-08, the founder; entrance.js). Returns the block's state:

     'rest'    complete: the prerendered HTML, a block in view at first
               paint, reduced motion, and every block once it has played
     'armed'   the start state, set before the region paints when the block
               is entirely below the fold: each line or step at its
               recorded start (opacity 0, below its place; about.css)
     'play'    once, at half in view: the recorded entrance, 400ms each,
               150ms apart, ending complete

   'rest' on the first render, so the server render and hydration agree. */
export default function useSoftStart(ref) {
  const [state, setState] = useState('rest');
  useBeforePaint(() => {
    if (!motionAllowed() || typeof IntersectionObserver === 'undefined') return;
    if (belowFold(ref.current)) setState('armed');
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el || state !== 'armed') return undefined;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setState('play');
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, state]);
  return state;
}

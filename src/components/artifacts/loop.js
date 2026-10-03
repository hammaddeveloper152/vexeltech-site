import { useEffect, useRef, useState } from 'react';
import { prefersReduced } from '../site/useOnce.js';

/* THE ARTIFACT LOOP (the final artifacts pass, 2026-10-03, the founder).
   Every artifact on the site is a timeline of `total` ms that plays, rests
   5s on its final frame, and plays again.

     the first paint   the final frame (`t = total`), so nothing an artifact
                       says is hidden before it moves (BUILD-LAW Motion)
     in view           plays from 0, loops with the rest
     off screen        paused where it is
     reduced motion    the final frame, never moving

   Each artifact draws itself from `t` alone: positions as transforms,
   draws as clip-path or stroke-dashoffset, counts and typing as text. So a
   paused or reduced artifact is one frame, and a jump (`seek`) is exact.

   `seek(ms)` moves the playhead; under reduced motion it moves it too, so
   an artifact with chapters (home's four scenes) can show each chapter's
   own held frame. `first` is where the first play starts (home's scenes
   start past their slide, since scene 1 is already on the panel). */
export const REST = 5000;

export function useLoop(ref, total, { start = total, first = 0 } = {}) {
  const [t, setT] = useState(start);
  const clock = useRef({ base: 0, at: start, live: false, raf: 0, seen: false });

  useEffect(() => {
    const el = ref.current;
    const c = clock.current;
    if (!el || prefersReduced() || typeof IntersectionObserver === 'undefined') return undefined;
    const cycle = total + REST;
    const tick = (now) => {
      const e = (now - c.base) % cycle;
      c.at = e;
      setT(Math.min(e, total));
      c.raf = requestAnimationFrame(tick);
    };
    const play = () => {
      if (c.live) return;
      c.live = true;
      /* The first time in view, from the top; after a pause, from where it
         stopped. */
      if (!c.seen) {
        c.seen = true;
        c.at = first;
      }
      c.base = performance.now() - c.at;
      c.raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      c.live = false;
      cancelAnimationFrame(c.raf);
    };
    const io = new IntersectionObserver((es) => (es[0].isIntersecting ? play() : pause()), { threshold: 0.25 });
    io.observe(el);
    c.play = play;
    return () => {
      io.disconnect();
      pause();
    };
    // total is fixed for an artifact's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seek = (ms) => {
    const c = clock.current;
    c.at = ms;
    c.seen = true;
    c.base = performance.now() - ms;
    setT(Math.min(ms, total));
  };
  return [t, seek];
}

/* The reveal curve, cubic-bezier(.23, 1, .32, 1), solved for x. */
function bezier(x1, y1, x2, y2) {
  const f = (a, b, s) => 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 24; i += 1) {
      const mid = (lo + hi) / 2;
      if (f(x1, x2, mid) < x) lo = mid;
      else hi = mid;
    }
    return f(y1, y2, (lo + hi) / 2);
  };
}
export const easeReveal = bezier(0.23, 1, 0.32, 1);

/* Progress of a step that starts at `from` and lasts `ms`, eased, 0 to 1. */
export const step = (t, from, ms, ease = easeReveal) => ease(Math.max(0, Math.min(1, (t - from) / ms)));

/* Linear progress, for counts and typing. */
export const lin = (t, from, ms) => Math.max(0, Math.min(1, (t - from) / ms));

/* Mix two numbers. */
export const mix = (a, b, k) => a + (b - a) * k;

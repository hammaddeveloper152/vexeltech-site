import { useEffect, useRef, useState } from 'react';
import { prefersReduced } from '../site/useOnce.js';

/* THE ARTIFACT LOOP (the final artifacts pass, 2026-10-03, the founder).
   Every artifact on the site is a timeline of `total` ms that each artifact
   draws itself from: positions as transforms, draws as clip-path or
   stroke-dashoffset, counts and typing as text. So any `t` is one exact
   frame, and a jump (`seek`) is exact.

   ARTIFACTS REST FULL, 2026-10-06 (the founder's services substance pass,
   BUILD-LAW Motion). An artifact is never seen empty or half built:

     at rest           the complete frame (`rest(t)`, the last frame by
                       default): on the first paint, off screen and under
                       reduced motion
     plays when        at least half of the stage is in view (half of the
                       viewport, for a stage taller than two viewports)
     a play            a REBUILD: the complete frame leaves over 300ms
                       (`leave`, 0 to 1, which the artifact turns into a
                       clip-path wipe with `leaving()`), then the timeline
                       runs from `first` to the end, as built
     after a play      the complete frame holds for 6s before any replay,
                       in view or not
     off screen        the play stops and the complete frame is painted
     reduced motion    the complete frame, no loop

   `seek(ms)` (home's four scenes, a headline click) plays on from `ms`
   when motion is allowed and the stage is in view; otherwise it paints
   `ms`, which the caller passes as a complete frame. `stop()` ends the loop
   for good on the last frame (the brand you type, once the visitor types).
   `rest(t)` maps the playhead to the complete frame it belongs to: the
   last frame by default; the current scene's held frame for home's
   scenes. */
export const LEAVE = 300;
export const HOLD = 6000;

/* In view enough to play: half the stage, or half the viewport when the
   stage is taller than two viewports and half of it can never show. */
export function halfInView(entry) {
  if (!entry.isIntersecting) return false;
  const vh = entry.rootBounds ? entry.rootBounds.height : window.innerHeight;
  const need = Math.min(entry.boundingClientRect.height, vh) * 0.5;
  return entry.intersectionRect.height >= need - 1;
}

export const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

/* The leave, for the element whose children wipe away: a data attribute
   while leaving and the progress as `--leave` (artifacts.css). Nothing is
   clipped at rest, so shadows and rings outside a box keep painting. */
export const leaving = (leave) => ({
  'data-leaving': leave > 0 ? 'true' : undefined,
  style: leave > 0 ? { '--leave': leave } : undefined,
});

export function useLoop(ref, total, { start = total, first = 0, rest = () => total } = {}) {
  const [t, setT] = useState(start);
  const [leave, setLeave] = useState(0);
  const clock = useRef({
    phase: 'rest',
    base: 0,
    t: start,
    inView: false,
    holdUntil: 0,
    raf: 0,
    timer: 0,
    stopped: false,
    motion: false,
  });

  const paint = (ms) => {
    clock.current.t = ms;
    setT(ms);
  };

  useEffect(() => {
    const el = ref.current;
    const c = clock.current;
    if (!el || prefersReduced() || typeof IntersectionObserver === 'undefined') return undefined;
    c.motion = true;

    const cancel = () => {
      cancelAnimationFrame(c.raf);
      clearTimeout(c.timer);
      c.raf = 0;
      c.timer = 0;
    };
    const tick = (now) => {
      if (c.phase === 'leave') {
        const p = (now - c.base) / LEAVE;
        if (p >= 1) {
          c.phase = 'build';
          c.base = now - first;
          setLeave(0);
          paint(first);
        } else {
          setLeave(p);
        }
        c.raf = requestAnimationFrame(tick);
        return;
      }
      if (c.phase === 'build') {
        const e = now - c.base;
        if (e >= total) {
          paint(total);
          c.phase = 'rest';
          c.holdUntil = now + HOLD;
          c.raf = 0;
          if (c.inView) c.begin();
          return;
        }
        paint(e);
        c.raf = requestAnimationFrame(tick);
      }
    };
    /* Start a play, or wait out the hold and then start one. */
    const begin = () => {
      if (c.stopped || c.phase !== 'rest') return;
      const now = performance.now();
      clearTimeout(c.timer);
      if (now < c.holdUntil) {
        c.timer = setTimeout(() => {
          if (c.inView) begin();
        }, c.holdUntil - now);
        return;
      }
      c.phase = 'leave';
      c.base = now;
      c.raf = requestAnimationFrame(tick);
    };
    c.tick = tick;
    c.cancel = cancel;
    c.begin = begin;

    const io = new IntersectionObserver(
      (es) => {
        const e = es[es.length - 1];
        if (halfInView(e)) {
          c.inView = true;
          if (c.phase === 'rest') begin();
          return;
        }
        c.inView = false;
        /* Off screen: the complete frame. Between half and none in view a
           play that has started runs on, and none starts. */
        if (!e.isIntersecting) {
          cancel();
          c.phase = 'rest';
          setLeave(0);
          paint(rest(c.t));
        }
      },
      { threshold: THRESHOLDS }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancel();
    };
    // total, first and rest are fixed for an artifact's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seek = (ms) => {
    const c = clock.current;
    if (c.motion && c.inView && !c.stopped && c.tick) {
      c.cancel();
      c.phase = 'build';
      c.base = performance.now() - ms;
      setLeave(0);
      paint(ms);
      c.raf = requestAnimationFrame(c.tick);
      return;
    }
    setLeave(0);
    paint(ms);
  };
  const stop = () => {
    const c = clock.current;
    c.stopped = true;
    if (c.cancel) c.cancel();
    c.phase = 'rest';
    setLeave(0);
    paint(total);
  };
  return [t, seek, stop, leave];
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

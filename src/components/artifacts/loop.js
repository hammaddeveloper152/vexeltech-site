import { useEffect, useRef, useState } from 'react';
import { useBeforePaint, motionAllowed, belowFold } from '../site/entrance.js';

/* THE ARTIFACT LOOP (the final artifacts pass, 2026-10-03, the founder).
   Every artifact on the site is a timeline of `total` ms that each artifact
   draws itself from: positions as transforms, draws as clip-path or
   stroke-dashoffset, counts and typing as text. So any `t` is one exact
   frame, and a jump (`seek`) is exact.

   THE ENTRANCE RULE (FINAL41 part 4, 2026-10-08, the founder; BUILD-LAW
   Motion; it replaces "rest full, start soft, play once" and the rebuild
   from the finished state that came before it):

     prerendered HTML  the complete frame (and so with no JavaScript)
     on load           below the fold: the start state, set before the
                       region paints (`useBeforePaint`); in view: complete,
                       and it never plays
     plays when        at least half of the stage is in view (half of the
                       viewport, for a stage taller than two viewports)
     a play            once: 400ms crossfading the moving part from 0.35 to
                       full on the first frame, then the timeline from
                       `first` to the end, then the complete frame for good
     off screen        a play that has started stops on the complete frame
                       and is spent; before its play the start state stays
     reduced motion    the complete frame, no play

   `seek(ms)` (home's four scenes, a headline click) plays on from `ms`
   when motion is allowed and the stage is in view; otherwise it paints
   `ms`, which the caller passes as a complete frame. `stop()` ends the loop
   for good on the last frame (the brand you type, once the visitor types).
   `rest(t)` maps the playhead to the complete frame it belongs to: the
   last frame by default; the current scene's held frame for home's
   scenes. */
/* The soft start's opacity (`--fade`) comes from `leave` through
   `fadeOf`: the start state holds `ARMED` (a fade of 0.35), and the play's
   first 400ms take it to 0 (a fade of 1). */
export const LEAVE = 400;

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
export const fadeOf = (leave) => (leave < 0.5 ? 1 - 2 * leave : 2 * leave - 1);
export const leaving = (leave) => ({
  'data-leaving': leave > 0 ? 'true' : undefined,
  style: leave > 0 ? { '--leave': leave, '--fade': fadeOf(leave) } : undefined,
});

/* THE ENTRANCE RULE (FINAL41 part 4, the founder; it replaces "rest full,
   start soft, play once"; entrance.js). On load, an artifact entirely below
   the fold is set to its start state before that region paints: its first
   frame (`first`), the moving part faint at the soft start (`ARMED`, a
   `--fade` of 0.35). At half in view it plays once: 400ms crossfading the
   moving part up to full on the first frame, then the timeline, then the
   complete frame for good. An artifact in view at first paint stays
   complete and never plays. Off screen during its play it paints the
   complete frame and is spent. Reduced motion: complete, no play. */
export const ARMED = 0.325; /* fadeOf(0.325) = 0.35 */

export function useLoop(ref, total, { start = total, first = 0 } = {}) {
  const [t, setT] = useState(start);
  const [leave, setLeave] = useState(0);
  const clock = useRef({
    phase: 'rest',
    base: 0,
    t: start,
    inView: false,
    armed: false,
    played: false,
    raf: 0,
    timer: 0,
    stopped: false,
    motion: false,
  });

  const paint = (ms) => {
    clock.current.t = ms;
    setT(ms);
  };

  /* The start state, before the region paints (hydration). */
  useBeforePaint(() => {
    const c = clock.current;
    if (!motionAllowed() || typeof IntersectionObserver === 'undefined') {
      c.stopped = true;
      return;
    }
    if (belowFold(ref.current)) {
      c.armed = true;
      paint(first);
      setLeave(ARMED);
    } else {
      c.stopped = true; /* in view at first paint: complete, no play */
    }
    // first is fixed for an artifact's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = ref.current;
    const c = clock.current;
    if (!el || c.stopped || !c.armed) return undefined;
    c.motion = true;

    const cancel = () => {
      cancelAnimationFrame(c.raf);
      clearTimeout(c.timer);
      c.raf = 0;
      c.timer = 0;
    };
    const tick = (now) => {
      if (c.phase === 'enter') {
        /* The 400ms crossfade into the first step: the moving part from the
           soft start up to full, the first frame held. */
        const p = (now - c.base) / LEAVE;
        if (p >= 1) {
          c.phase = 'build';
          c.base = now - first;
          setLeave(0);
        } else {
          setLeave(ARMED * (1 - p));
        }
        c.raf = requestAnimationFrame(tick);
        return;
      }
      if (c.phase === 'build') {
        const e = now - c.base;
        if (e >= total) {
          paint(total);
          c.phase = 'rest';
          c.raf = 0;
          c.stopped = true;
          return;
        }
        paint(e);
        c.raf = requestAnimationFrame(tick);
      }
    };
    /* The one play. */
    const begin = () => {
      if (c.stopped || c.played || c.phase !== 'rest') return;
      c.played = true;
      c.phase = 'enter';
      c.base = performance.now();
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
        /* Off screen during the play: the complete frame, and the play is
           spent. Before the play the start state stays. */
        if (!e.isIntersecting && c.played) {
          cancel();
          c.phase = 'rest';
          setLeave(0);
          paint(total);
          c.stopped = true;
          io.disconnect();
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

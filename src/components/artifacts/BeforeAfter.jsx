import React, { useCallback, useEffect, useRef } from 'react';
import { prefersReduced } from '../site/useOnce.js';
import { halfInView, THRESHOLDS } from './loop.js';
import './before-after.css';

/* THE BEFORE/AFTER SLIDER (the founder's approved frames, final15,
   2026-10-06; reference/final-frames in the design repo). One mechanism for
   the Branding and the Marketing stages on /services.

     the stage    two layers of the same size. The "before" layer is in
                  flow and sets the height; the "after" layer lies over it
                  and is cut by clip-path at the divider, so nothing
                  resizes (BUILD-LAW Motion names clip-path for masks)
     the seam     a full-stage box moved by translateX: the 4px yellow
                  divider, the 44px yellow handle at mid-height and the
                  "After" label, which rides the divider's right side
     the drift    at rest the divider runs 35% to 65% and back, one sine
                  over 10s, while at least half the stage is in view. It
                  pauses while a pointer is over the stage or the handle
                  has focus, and stops for good at the first drag or key.
                  Reduced motion: no drift, the divider rests at 50%
     the drag     pointer and touch: a press anywhere on the stage puts the
                  divider there and drags it. `touch-action: pan-y` keeps a
                  vertical swipe scrolling the page
     the keys     the handle is a slider: arrows move it 2%, Home and End
                  go to the ends

   Nothing starts hidden: the first paint is both layers at 50%. The layers
   are pictures of the caption and are aria-hidden; the caption is the
   content. The position is written to `--x` on the stage directly, so a
   drag or the drift never re-renders the scenes.

   `before`, `after`: the layers' content. `cap`: the line under the stage;
   `end`: its right end. `name`: the handle's accessible name. */
const LO = 35;
const HI = 65;
const PERIOD = 10000;
const STEP = 2;

export default function BeforeAfter({ before, after, cap, end, name, tone = 'cream', className = '', ...rest }) {
  const stageRef = useRef(null);
  const handleRef = useRef(null);
  const x = useRef(50);
  const taken = useRef(false);
  const paused = useRef(false);

  const put = useCallback((v) => {
    const n = Math.max(0, Math.min(100, v));
    x.current = n;
    const el = stageRef.current;
    if (el) el.style.setProperty('--x', n.toFixed(2));
    const h = handleRef.current;
    if (h) {
      h.setAttribute('aria-valuenow', String(Math.round(n)));
      h.setAttribute('aria-valuetext', `${Math.round(n)}% before, ${100 - Math.round(n)}% after`);
    }
  }, []);

  /* The drift: a sine about 50, its phase kept across pauses so a resume
     carries on from where the divider is. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || prefersReduced()) return undefined;
    let raf = 0;
    let inView = false;
    let last = 0;
    let phase = 0;
    const tick = (now) => {
      raf = 0;
      if (taken.current || !inView) return;
      if (!paused.current) {
        if (last) phase += (now - last) / PERIOD;
        put(50 + ((HI - LO) / 2) * Math.sin(phase * 2 * Math.PI));
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        inView = halfInView(e);
        if (inView && !raf && !taken.current) {
          last = 0;
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: THRESHOLDS }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [put]);

  const at = (clientX) => {
    const r = stageRef.current.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * 100;
  };

  const onDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    taken.current = true;
    stageRef.current.setPointerCapture(e.pointerId);
    stageRef.current.dataset.drag = 'true';
    put(at(e.clientX));
  };
  const onMove = (e) => {
    if (stageRef.current.dataset.drag !== 'true') return;
    put(at(e.clientX));
  };
  const onUp = (e) => {
    const el = stageRef.current;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    delete el.dataset.drag;
  };

  const onKey = (e) => {
    const k = e.key;
    let v = null;
    if (k === 'ArrowLeft' || k === 'ArrowDown') v = x.current - STEP;
    else if (k === 'ArrowRight' || k === 'ArrowUp') v = x.current + STEP;
    else if (k === 'Home') v = 0;
    else if (k === 'End') v = 100;
    if (v === null) return;
    e.preventDefault();
    taken.current = true;
    put(Math.round(v));
  };

  return (
    <figure className={`ba ba--${tone}${className ? ` ${className}` : ''}`} {...rest}>
      <div
        className="ba__stage"
        ref={stageRef}
        style={{ '--x': 50 }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') paused.current = true;
        }}
        onPointerLeave={() => {
          paused.current = false;
        }}
      >
        <div className="ba__layer ba__layer--before" aria-hidden="true">
          {before}
          <span className="ba__tag ba__tag--before">Before</span>
        </div>
        <div className="ba__layer ba__layer--after" aria-hidden="true">
          {after}
        </div>
        <div className="ba__seam">
          <span className="ba__tag ba__tag--after" aria-hidden="true">
            After
          </span>
          <span className="ba__line" aria-hidden="true" />
          <span
            className="ba__handle"
            ref={handleRef}
            role="slider"
            tabIndex={0}
            aria-label={name}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
            aria-valuetext="50% before, 50% after"
            onKeyDown={onKey}
            onFocus={() => {
              paused.current = true;
            }}
            onBlur={() => {
              paused.current = false;
            }}
          >
            <span className="ba__grip" aria-hidden="true" />
          </span>
        </div>
      </div>
      <figcaption className="ba__cap">
        <span>{cap}</span>
        {end ? <span className="ba__end">{end}</span> : null}
      </figcaption>
    </figure>
  );
}

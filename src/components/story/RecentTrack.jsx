import React, { useEffect, useRef, useState } from 'react';
import { REAL_WORK, MIN_WORK } from '../../content/work.js';
import './story.css';

/* RECENT WORK, A FULL-BLEED DRAG TRACK (the founder's six fixes,
   2026-10-02). It replaced the one-plate showcase.

   THE TRACK starts on the content column's left edge and runs out past the
   right edge of the viewport: plates 27vw wide from 1280 (3.4 in view,
   the fourth cut by the edge), 31vw from 1024, 44vw from 768, 78vw below
   (1.2 in view), 24px apart (widths from the seven corrections,
   2026-10-02). Each plate is the live site's 1440 x 900 capture at 16:10, 6px
   radius, no border; under it the name (18px, bone), the sector and city
   (mono 11px, steel-lift) and the one line (steel-lift). The whole plate is
   one link to the live site, in a new tab.

   TWO WAYS TO MOVE IT, chosen by the pointer:
     a mouse or trackpad (hover and a fine pointer): the track is moved by
       transform (translate3d), eased toward its target each frame (a lerp);
       a drag sets the target and a release carries its speed on (inertia);
       a horizontal wheel or trackpad swipe moves it, a vertical wheel is
       left to the page; the arrow keys move it one plate when it has focus;
       a 56px black disc reading DRAG in yellow follows the pointer over it
     touch: the browser's own sideways scroll, snapping a plate at a time,
       with no scrollbar shown
   Nothing pins and nothing takes over the page's scroll.

   THE PROGRESS RAIL, under the track across the content column: a 1px
   steel line with a yellow segment as wide as the share of the track in
   view, at the track's position along it. No counter, no arrows.

   Reduced motion: no inertia (the track goes straight to its target) and no
   hover shift. THE SECTION RENDERS NOTHING with fewer than three entries
   (BUILD-LAW Truth, Real over drawn). */
const fineQuery = '(hover: hover) and (pointer: fine)';

export default function RecentTrack() {
  const viewRef = useRef(null);
  const trackRef = useRef(null);
  const segRef = useRef(null);
  const cueRef = useRef(null);
  const st = useRef({ x: 0, target: 0, min: 0, raf: 0, drag: null, moved: false, vel: 0, lastX: 0, lastT: 0 });
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(fineQuery);
    const on = () => setFine(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    const track = trackRef.current;
    if (!view || !track) return undefined;
    const s = st.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* The rail: the visible share, and where along the track we are. */
    const rail = () => {
      const seg = segRef.current;
      if (!seg) return;
      const total = track.scrollWidth;
      const vis = view.clientWidth;
      const frac = Math.min(1, vis / total);
      const progress = fine ? (s.min < 0 ? s.x / s.min : 0) : view.scrollWidth > vis ? view.scrollLeft / (view.scrollWidth - vis) : 0;
      seg.style.width = `${frac * 100}%`;
      seg.style.transform = `translateX(${progress * (1 / frac - 1) * 100}%)`;
    };

    if (!fine) {
      track.style.transform = '';
      rail();
      view.addEventListener('scroll', rail, { passive: true });
      window.addEventListener('resize', rail);
      return () => {
        view.removeEventListener('scroll', rail);
        window.removeEventListener('resize', rail);
      };
    }

    const measure = () => {
      s.min = Math.min(0, view.clientWidth - track.scrollWidth);
      s.target = Math.max(s.min, Math.min(0, s.target));
      s.x = Math.max(s.min, Math.min(0, s.x));
      paint();
    };
    const paint = () => {
      track.style.transform = `translate3d(${s.x}px, 0, 0)`;
      rail();
    };
    const tick = () => {
      const d = s.target - s.x;
      s.x = reduce || Math.abs(d) < 0.5 ? s.target : s.x + d * 0.12;
      paint();
      s.raf = s.x === s.target && !s.drag ? 0 : requestAnimationFrame(tick);
    };
    const go = (t) => {
      s.target = Math.max(s.min, Math.min(0, t));
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };
    s.go = go;

    const step = () => {
      const plate = track.firstElementChild;
      return plate ? plate.getBoundingClientRect().width + 24 : 300;
    };
    s.step = step;

    const onDown = (e) => {
      if (e.button !== 0) return;
      s.drag = { x: e.clientX, start: s.target };
      s.moved = false;
      s.vel = 0;
      s.lastX = e.clientX;
      s.lastT = performance.now();
      /* The drag follows on the window, not by pointer capture: capture
         would send a plain click to the track rather than to the plate's
         link. */
      window.addEventListener('pointermove', onDrag);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };
    const onMove = (e) => {
      const cue = cueRef.current;
      if (cue) cue.style.transform = `translate3d(${e.clientX - 28}px, ${e.clientY - 28}px, 0)`;
    };
    const onDrag = (e) => {
      if (!s.drag) return;
      const dx = e.clientX - s.drag.x;
      if (Math.abs(dx) > 5) s.moved = true;
      const now = performance.now();
      s.vel = (e.clientX - s.lastX) / Math.max(1, now - s.lastT);
      s.lastX = e.clientX;
      s.lastT = now;
      go(s.drag.start + dx);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onDrag);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (!s.drag) return;
      s.drag = null;
      /* The click that ends a drag is swallowed (onClick below); after it,
         the plates click again, so a keyboard Enter is never blocked. */
      setTimeout(() => {
        s.moved = false;
      }, 0);
      /* Inertia: the release speed carried on, about 300ms worth. */
      if (!reduce) go(s.target + s.vel * 300);
    };
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      go(s.target - e.deltaX);
    };
    const onEnter = () => cueRef.current && cueRef.current.setAttribute('data-on', 'true');
    const onLeave = () => cueRef.current && cueRef.current.setAttribute('data-on', 'false');

    view.addEventListener('pointerdown', onDown);
    view.addEventListener('pointermove', onMove);
    view.addEventListener('wheel', onWheel, { passive: false });
    view.addEventListener('pointerenter', onEnter);
    view.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', measure);
    measure();
    return () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      view.removeEventListener('pointerdown', onDown);
      view.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointermove', onDrag);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      view.removeEventListener('wheel', onWheel);
      view.removeEventListener('pointerenter', onEnter);
      view.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', measure);
    };
  }, [fine]);

  /* The arrow keys move one plate, in either mode. */
  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const s = st.current;
    if (fine && s.go) s.go(s.target - dir * s.step());
    else {
      const view = viewRef.current;
      const plate = trackRef.current && trackRef.current.firstElementChild;
      const w = plate ? plate.getBoundingClientRect().width + 24 : 300;
      view.scrollBy({ left: dir * w, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  };

  if (REAL_WORK.length < MIN_WORK) return null;

  return (
    <section className="vt st-sec st--dark rt" aria-labelledby="rt-h">
      <div className="st-in rt__head">
        <h2 className="st-h" id="rt-h">
          Recent work
        </h2>
        <p className="st-lead">Live sites. Open any of them.</p>
      </div>

      <div
        className="rt__view"
        ref={viewRef}
        data-mode={fine ? 'drag' : 'scroll'}
        tabIndex={0}
        role="region"
        aria-label="Recent work, a horizontal track. Use the arrow keys to move it."
        onKeyDown={onKeyDown}
      >
        <ul className="rt__track" ref={trackRef}>
          {REAL_WORK.map((w) => (
            <li className="rt__item" key={w.slug}>
              <a
                className="rt__plate"
                href={w.url}
                target="_blank"
                rel="noopener"
                draggable="false"
                onClick={(e) => {
                  if (st.current.moved) e.preventDefault();
                }}
              >
                <span className="rt__img">
                  <img
                    src={`/work/${w.slug}-720.jpg`}
                    srcSet={`/work/${w.slug}-720.jpg 720w, /work/${w.slug}.jpg 1440w`}
                    sizes="(min-width: 1280px) 27vw, (min-width: 1024px) 31vw, (min-width: 768px) 44vw, 78vw"
                    alt={`${w.name}, the live site`}
                    width="1440"
                    height="900"
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                </span>
                <span className="rt__name">{w.name}</span>
                <span className="rt__where">
                  {w.industry}, {w.city}
                </span>
                <span className="rt__line">{w.line}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="st-in">
        <div className="rt__rail" aria-hidden="true">
          <span className="rt__seg" ref={segRef} />
        </div>
      </div>

      {fine ? (
        <span className="rt__cue" ref={cueRef} data-on="false" aria-hidden="true">
          Drag
        </span>
      ) : null}
    </section>
  );
}

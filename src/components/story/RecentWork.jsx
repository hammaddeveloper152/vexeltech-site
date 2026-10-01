import React, { useCallback, useRef, useState } from 'react';
import { REAL_WORK, MIN_WORK } from '../../content/work.js';
import { IconArrowRight } from '../site/Icons.jsx';
import './story.css';

/* RECENT WORK, A SHOWCASE (the founder's five fixes, 2026-10-02). It
   replaced the sideways strip: one plate at a time, the next one peeking.

     from 1024   the text in a 40% column (the business name in Clash Display
                 32px, its industry and city in mono, the one line in Satoshi
                 18px, the counter and the two arrows), the plate in the 60%
                 column at 16:10 in the 8px hairline frame, the next plate
                 peeking 32px at the right at 60% opacity
     below 1024  the plate first, full width, the next peeking 24px; the text
                 under it; the counter and the arrows under the text

   It moves on the arrows, the arrow keys (inside the showcase) and a drag
   or swipe: a 400ms slide on the reveal curve, transform only. No
   autoplay. Reduced motion: it cuts. The ends stop rather than loop, and an
   arrow with nowhere to go is disabled.

   THE DATA IS content/work.js: the founder's sites, each screenshot the live
   site's first viewport at 1440 x 900 (.measure/work-shots.mjs). Each plate
   opens the live site in a new tab. THE SECTION RENDERS NOTHING with fewer
   than three entries (BUILD-LAW Truth, Real over drawn). */
const pad = (n) => String(n).padStart(2, '0');

export default function RecentWork() {
  const [i, setI] = useState(0);
  const [drag, setDrag] = useState(0);
  const start = useRef(null);
  const moved = useRef(false);
  const n = REAL_WORK.length;

  const go = useCallback((k) => setI((c) => Math.max(0, Math.min(n - 1, c + k))), [n]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  /* A drag follows the pointer; past 48px on release it moves one plate. A
     drag that moved is not a click on the plate's link. */
  const onPointerDown = (e) => {
    start.current = { x: e.clientX, id: e.pointerId };
    moved.current = false;
  };
  const onPointerMove = (e) => {
    if (!start.current || start.current.id !== e.pointerId) return;
    const dx = e.clientX - start.current.x;
    if (Math.abs(dx) > 4) moved.current = true;
    setDrag(dx);
  };
  const onPointerUp = (e) => {
    if (!start.current || start.current.id !== e.pointerId) return;
    const dx = e.clientX - start.current.x;
    start.current = null;
    setDrag(0);
    if (dx <= -48) go(1);
    else if (dx >= 48) go(-1);
  };

  if (n < MIN_WORK) return null;
  const w = REAL_WORK[i];

  return (
    <section className="vt st-sec st--dark rw" aria-labelledby="rw-h">
      <div className="st-in">
        <h2 className="st-h" id="rw-h">
          Recent work
        </h2>
        <p className="st-lead">Live sites. Open any of them.</p>

        <div className="rw2" role="region" aria-roledescription="carousel" aria-label="Recent work" onKeyDown={onKeyDown}>
          <div
            className="rw2__stage"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <ul className="rw2__track" data-dragging={drag ? 'true' : 'false'} style={{ '--i': i, '--drag': `${drag}px` }}>
              {REAL_WORK.map((p, k) => (
                <li
                  className="rw2__plate"
                  key={p.slug}
                  data-current={k === i ? 'true' : 'false'}
                  aria-hidden={k === i ? undefined : 'true'}
                  aria-roledescription="slide"
                  aria-label={`${k + 1} of ${n}`}
                >
                  <a
                    className="rw2__link"
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={k === i ? undefined : -1}
                    draggable="false"
                    onClick={(e) => {
                      if (moved.current) e.preventDefault();
                    }}
                  >
                    <img
                      src={`/work/${p.slug}-720.jpg`}
                      srcSet={`/work/${p.slug}-720.jpg 720w, /work/${p.slug}.jpg 1440w`}
                      sizes="(min-width: 1280px) 690px, (min-width: 1024px) 55vw, calc(100vw - 56px)"
                      alt={`${p.name}, the live site`}
                      width="1440"
                      height="900"
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rw2__text" aria-live="polite">
            <p className="rw2__name">{w.name}</p>
            <p className="rw2__where st-mono">
              {w.industry}, {w.city}
            </p>
            <p className="rw2__line st-soft">{w.line}</p>
          </div>

          <div className="rw2__ctrl">
            <p className="rw2__count st-mono">
              {pad(i + 1)} / {pad(n)}
            </p>
            <div className="rw2__arrows">
              <button
                type="button"
                className="rw2__arrow rw2__arrow--prev"
                onClick={() => go(-1)}
                disabled={i === 0}
                aria-label="Previous site"
              >
                <IconArrowRight className="i" />
              </button>
              <button type="button" className="rw2__arrow" onClick={() => go(1)} disabled={i === n - 1} aria-label="Next site">
                <IconArrowRight className="i" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

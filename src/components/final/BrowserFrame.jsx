import React, { useEffect, useRef, useState } from 'react';
import { prefersReduced } from '../site/useOnce.js';
import './frame.css';

/* THE PLAIN BROWSER FRAME (the final pass, 2026-10-03), a container for a
   real capture: a 1px steel border, 6px radius, and a 32px bar with three
   hollow 10px circles at the left and the title in mono at the centre.
   BUILD-LAW rule 0 lets it appear wherever a real capture is shown (the
   founder, 2026-10-03): the Google Ads capture on /services and the
   November capture on About. The ink follows the ground: steel-lift on
   dark, steel on cream (`.bf--light`).

   `marks`: rounded rectangles in the capture's own pixel coordinates, drawn
   in yellow over it, so they hold at every width. They are PAINTED FROM THE
   FIRST FRAME (BUILD-LAW Motion: an entrance never hides content); if the
   frame is already on screen at load and motion is allowed they draw in by
   stroke-dashoffset, 600ms after load, one after the other. */
export default function BrowserFrame({ title, src, alt, width, height, marks = [], light = false }) {
  const ref = useRef(null);
  const [draw, setDraw] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !marks.length || prefersReduced()) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) setDraw(true);
    // marks are fixed for a use's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={`bf${light ? ' bf--light' : ''}`} ref={ref} data-draw={draw ? 'true' : 'false'}>
      <div className="bf__bar" aria-hidden="true">
        <span className="bf__dots">
          <span className="bf__dot" />
          <span className="bf__dot" />
          <span className="bf__dot" />
        </span>
        <span className="bf__title">{title}</span>
      </div>
      <div className="bf__shot">
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
        {marks.length ? (
          <svg className="bf__marks" viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
            {marks.map((m, i) => (
              <rect key={m.id} className="bf__mark" x={m.x} y={m.y} width={m.w} height={m.h} rx="6" pathLength="100" style={{ '--i': i }} />
            ))}
          </svg>
        ) : null}
      </div>
    </div>
  );
}

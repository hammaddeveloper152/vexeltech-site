import React, { useId, useLayoutEffect, useRef, useState } from 'react';

/* THE BRUSH STROKE, 2026-09-25 (the founder's life pass 3). A hand-drawn
   machine yellow stroke through the lower third of a figure, behind the
   text: the $700 on home's promise band and on the pricing Websites column.

   An SVG path 28px wide with round caps, wavering, running 12px past the
   words on each side (measured from the text, so it is never stretched),
   rotated -3 degrees, at 0.9. Its rough painted edge is a filter on the
   path: feTurbulence at a base frequency of 0.04 displacing it by 6. It
   draws in with `stroke-dashoffset` over 500ms when it enters the viewport
   (BUILD-LAW Motion names `stroke-dashoffset` for drawing a path); the
   filter itself never animates. Reduced motion: drawn from the start.

   The text sits above it and stays fully legible: asphalt on the stroke is
   measured in DESIGN.md. Decorative. */
const W_STROKE = 28;
const PAST = 12;

export default function Brush({ children, className = '' }) {
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [drawn, setDrawn] = useState(false);
  const fid = `brush-${useId().replace(/:/g, '')}`;

  useLayoutEffect(() => {
    const t = textRef.current;
    if (!t) return undefined;
    const measure = () => {
      const r = t.getBoundingClientRect();
      setBox({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    if (document.fonts) document.fonts.ready.then(measure);
    let io;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      setDrawn(true);
    } else {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setDrawn(true);
            io.disconnect();
          }
        },
        { threshold: 0.6 }
      );
      io.observe(wrapRef.current);
    }
    return () => {
      ro.disconnect();
      if (io) io.disconnect();
    };
  }, []);

  /* The stroke's box: the words plus 12px each side, and room above and
     below for the wobble, the cap and the rough edge. The path's ends sit
     half a stroke in from the box's ends, so the round caps land exactly
     12px past the words. */
  const W = box.w + PAST * 2;
  const H = W_STROKE + 16;
  const y = H / 2;
  const a = W_STROKE / 2;
  const d = `M${a} ${y + 2} C ${W * 0.28} ${y - 4}, ${W * 0.55} ${y + 5}, ${W - a} ${y - 2}`;

  return (
    <span className={`brush ${className}`.trim()} ref={wrapRef}>
      {box.w ? (
        <svg
          className="brush__stroke"
          data-drawn={drawn ? 'true' : 'false'}
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {/* The filter's region is the whole box in user units. Sized to
                the path's own bounds (the default), it was a band a few
                pixels tall that clipped the 28px stroke to a thin line. */}
            <filter id={fid} filterUnits="userSpaceOnUse" x="-8" y="-8" width={W + 16} height={H + 16}>
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <path d={d} pathLength="1" filter={`url(#${fid})`} />
        </svg>
      ) : null}
      <span className="brush__t" ref={textRef}>
        {children}
      </span>
    </span>
  );
}

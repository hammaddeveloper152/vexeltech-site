import React, { useId, useLayoutEffect, useRef, useState } from 'react';

/* THE SWASH, the site's one brush stroke (2026-09-25; the founder's life
   pass 3 made it for the $700s, the Genesis pass made it the motif). One
   SVG path with round caps, wavering, in machine yellow, its rough painted
   edge a feTurbulence at a base frequency of 0.04 displacing it by 6, the
   filter's region the whole drawing in user units (sized to the path's own
   bounds, it clipped the stroke to a thin band). It draws in with
   `stroke-dashoffset` over 500ms on entering the viewport (BUILD-LAW Motion
   names `stroke-dashoffset` for drawing a path); the filter never animates.
   Reduced motion: drawn from the start. Decorative.

   Three uses, one drawing:

     around words   <Brush>$700</Brush>: the stroke runs 12px past the words
                    each side, behind them, the text above it. `thickness`
                    28 (the $700s) or 'fit' (the highlight: the stroke as
                    thick as the word needs to sit wholly on it, 0.9em, so
                    the word can be asphalt and read on it; see DESIGN.md).
     a loose mark   <Brush mark width={260} />: the stroke alone, that wide.

   `angle` rotates it, `opacity` sets its strength, `at` is where its centre
   sits in the words' box, from the top. */
const PAST = 12;

export default function Brush({
  children = null,
  mark = false,
  width = 0,
  thickness = 28,
  angle = -3,
  opacity = 0.9,
  at = '70%',
  className = '',
}) {
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const [box, setBox] = useState({ w: mark ? width : 0, t: typeof thickness === 'number' ? thickness : 0 });
  const [drawn, setDrawn] = useState(false);
  const fid = `brush-${useId().replace(/:/g, '')}`;

  useLayoutEffect(() => {
    const t = textRef.current;
    const measure = () => {
      if (mark) return;
      const r = t.getBoundingClientRect();
      const fs = parseFloat(getComputedStyle(t).fontSize) || 16;
      setBox({
        w: Math.round(r.width),
        t: thickness === 'fit' ? Math.round(fs * 0.9) : thickness,
      });
    };
    measure();
    let ro;
    if (!mark && t) {
      ro = new ResizeObserver(measure);
      ro.observe(t);
      if (document.fonts) document.fonts.ready.then(measure);
    }
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
        /* A loose mark can be mostly outside a clipping parent (the
           footer's corner swash), and the observer counts only what shows,
           so a mark draws as soon as any of it is on screen. */
        { threshold: mark ? 0 : 0.6 }
      );
      io.observe(wrapRef.current);
    }
    return () => {
      if (ro) ro.disconnect();
      if (io) io.disconnect();
    };
    // `thickness` and `mark` are fixed for a use's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* The drawing's box: the words plus 12px each side (or the mark's own
     width), and room above and below for the wobble and the rough edge. The
     path's ends sit half a stroke in, so the round caps land at the edge.
     A 'fit' stroke is as thick as the words are tall, and its round caps
     are half circles that tall: ended at 12px past the words, they bit the
     corners off the first and last letters. So for a fit stroke the full
     thickness runs 12px past the words each side and the caps go beyond. */
  const T = box.t;
  const ext = !mark && thickness === 'fit' ? T / 2 : 0;
  const W = mark ? width : box.w + PAST * 2 + ext * 2;
  const wob = Math.max(4, T * 0.18);
  const H = T + wob * 2 + 8;
  const y = H / 2;
  const a = T / 2;
  const d = `M${a} ${y + wob * 0.4} C ${W * 0.28} ${y - wob}, ${W * 0.55} ${y + wob}, ${W - a} ${y - wob * 0.4}`;

  const svg =
    W > 0 && T > 0 ? (
      <svg
        className="brush__stroke"
        data-drawn={drawn ? 'true' : 'false'}
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        style={{
          '--brush-rot': `${angle}deg`,
          '--brush-op': opacity,
          '--brush-h': `${H}px`,
          '--brush-at': at,
          '--brush-left': `${-(PAST + ext)}px`,
        }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id={fid} filterUnits="userSpaceOnUse" x="-8" y="-8" width={W + 16} height={H + 16}>
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <path d={d} pathLength="1" filter={`url(#${fid})`} style={{ strokeWidth: `${T}px` }} />
      </svg>
    ) : null;

  if (mark) {
    return (
      <span className={`brush brush--mark ${className}`.trim()} ref={wrapRef} style={{ width: `${width}px` }}>
        {svg}
      </span>
    );
  }
  /* A fit stroke reaches past its word by more than a word space, so the
     words beside it are held off the yellow by a margin as wide as that
     reach: a bone letter on the stroke would be 1.7:1 (the box it replaced
     padded its word for the same reason). */
  const hold = thickness === 'fit' && T ? { marginInline: `${PAST + ext}px` } : undefined;
  return (
    <span className={`brush ${className}`.trim()} ref={wrapRef} style={hold} data-drawn={drawn ? 'true' : 'false'}>
      {svg}
      <span className="brush__t" ref={textRef}>
        {children}
      </span>
    </span>
  );
}

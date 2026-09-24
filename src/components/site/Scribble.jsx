import React, { useLayoutEffect, useRef, useState } from 'react';

/* THE SCRIBBLE, 2026-09-25 (the founder's life pass): the closing call's
   underline, hand-drawn. Two strokes that slightly overlap, 3px, machine
   yellow, round caps, drawn to the link's own width (measured, so the
   stroke is never stretched), under the words.

   It draws itself when it enters the viewport: `stroke-dashoffset` from the
   stroke's full length to 0, the first stroke over 360ms and the second
   over 240ms after it, 600ms in all. `stroke-dashoffset` is one of the two
   properties BUILD-LAW's Motion rule names as exceptions, for drawing a
   path. Once drawn it stays. Reduced motion: drawn from the start.

   Decorative: the link's words are its name. */
/* SCALED TO ITS WORDS, 2026-09-25: the closing call's heading went to 56px,
   so the scribble takes its height (0.43em) and stroke (1/11em, 3px at the
   least) from the words' own size rather than a fixed 16 and 3. */
export default function Scribble() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  const [fs, setFs] = useState(32);
  const [drawn, setDrawn] = useState(false);

  useLayoutEffect(() => {
    const svg = ref.current;
    const host = svg && svg.parentElement;
    if (!host) return undefined;
    const measure = () => {
      setW(Math.round(host.getBoundingClientRect().width));
      setFs(parseFloat(getComputedStyle(host).fontSize) || 32);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
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
        { threshold: 1 }
      );
      io.observe(svg);
    }
    return () => {
      ro.disconnect();
      if (io) io.disconnect();
    };
  }, []);

  const W = Math.max(w, 40);
  const H = Math.round(fs * 0.43);
  const sw = Math.max(3, Math.round(fs / 11));
  const k = H / 16;
  /* Two passes of a hand: the first rises and dips across the width, the
     second comes back a little lower and crosses it (drawn on a 16-unit
     height and scaled to the words). */
  const a = `M2 ${10 * k} C ${W * 0.22} ${2 * k}, ${W * 0.52} ${14 * k}, ${W - 2} ${4 * k}`;
  const b = `M${W * 0.08} ${13 * k} C ${W * 0.38} ${6 * k}, ${W * 0.7} ${15 * k}, ${W - 8} ${9 * k}`;
  return (
    <svg
      ref={ref}
      className="scribble"
      data-drawn={drawn ? 'true' : 'false'}
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      style={{ '--scribble-w': `${sw}px` }}
      aria-hidden="true"
      focusable="false"
    >
      <path className="scribble__a" d={a} pathLength="1" />
      <path className="scribble__b" d={b} pathLength="1" />
    </svg>
  );
}

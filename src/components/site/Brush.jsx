import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

/* THE SWASH, the site's one brush stroke (2026-09-25; the founder's life
   pass 3 made it for the $700s, the Genesis pass made it the motif). One
   SVG path with round caps, wavering, in machine yellow, its rough painted
   edge a feTurbulence at a base frequency of 0.04 displacing it by 6 with a
   fixed seed, the filter's region the whole drawing in user units plus 20%
   and 30% round it (sized to the path's own bounds, it clipped the stroke
   to a thin band). Around words it is measured only once the words' own
   face has loaded, and it draws in with `stroke-dashoffset` over 500ms once
   the block the words sit in is half in view, once (BUILD-LAW Motion names
   `stroke-dashoffset` for drawing a path); the filter never animates.
   Reduced motion: it appears without the draw. Decorative.

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

/* The block the words sit in: the statement, the heading, the paragraph.
   The reveal watches it rather than the word, so it waits for the line the
   reader is reading, not one word of it. */
function blockOf(el) {
  for (let e = el.parentElement; e; e = e.parentElement) {
    const d = getComputedStyle(e).display;
    if (d !== 'inline' && d !== 'inline-block' && d !== 'contents') return e;
  }
  return el;
}

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
  /* THREE GATES, 2026-09-30 (the founder's About swash fix). Measured on a
     throttled phone load (`.measure/swashframes.mjs`): with the fonts late,
     the stroke was measured in the fallback face (244px for "phone" against
     188 in Monigue), drew at that width across "RI" of "ring.", and snapped
     back 2.6s later. The ResizeObserver meant to catch the swap watched an
     inline span, which it never reports on.

       ready   the words' own face is loaded and they have been measured in
               it. Until then there is no stroke at all (a loose mark has no
               words, so it is ready at once).
       seen    the block the words sit in is half in view (0.5), once. A
               loose mark keeps its own test: any of it on screen.
       drawn   one frame after both, so the stroke always mounts undrawn and
               then draws, and never arrives already drawn. */
  const [ready, setReady] = useState(mark);
  const [seen, setSeen] = useState(false);
  const [drawn, setDrawn] = useState(false);
  /* The highlight's words turn asphalt when the stroke has FINISHED drawing,
     500ms after it starts (at once under reduced motion). They turned at the
     start of the draw, which left the unstroked end of "Yet." asphalt on the
     dark film at 1.13:1 for about 200ms (`.measure/swashframes.mjs`). */
  const [inked, setInked] = useState(false);
  const fid = `brush-${useId().replace(/:/g, '')}`;

  useLayoutEffect(() => {
    const t = textRef.current;
    const wrap = wrapRef.current;
    let dead = false;
    /* The thickness is the words' size, known now, so the hold margin
       (below) is right from the first paint and nothing beside the words
       moves when the stroke arrives. */
    if (!mark && t && thickness === 'fit') {
      const fs = parseFloat(getComputedStyle(t).fontSize) || 16;
      setBox((b) => ({ ...b, t: Math.round(fs * 0.9) }));
    }
    /* The words' own inline box: getClientRects of the span, not the block.
       The wrapper is inline-block, so the words never break inside it; if
       it wraps onto a line alone the stroke, positioned in it, goes too. */
    const measure = () => {
      if (mark || !t || dead) return;
      const rects = Array.from(t.getClientRects());
      if (!rects.length) return;
      const w = Math.round(Math.max(...rects.map((r) => r.width)));
      const fs = parseFloat(getComputedStyle(t).fontSize) || 16;
      setBox({ w, t: thickness === 'fit' ? Math.round(fs * 0.9) : thickness });
    };

    let raf = 0;
    const remeasure = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    let ro;
    if (!mark && t) {
      const cs = getComputedStyle(t);
      const spec = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const fonts = document.fonts
        ? Promise.resolve(document.fonts.load(spec, t.textContent || 'x'))
            .catch(() => {})
            .then(() => document.fonts.ready)
        : Promise.resolve();
      fonts.then(() => {
        if (dead) return;
        measure();
        setReady(true);
      });
      /* The wrapper is inline-block, so it has a box to observe. */
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(remeasure);
        ro.observe(wrap);
      }
      window.addEventListener('resize', remeasure);
      window.addEventListener('orientationchange', remeasure);
      if (document.fonts) document.fonts.addEventListener('loadingdone', remeasure);
    }

    let io;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
    } else {
      const target = mark ? wrap : blockOf(wrap);
      io = new IntersectionObserver(
        (entries) => {
          const hit = entries.some((e) => {
            if (!e.isIntersecting) return false;
            if (mark) return true;
            /* Half the block, or half the screen for a block taller than
               two screens, which can never be half in view. */
            return e.intersectionRatio >= 0.5 || e.intersectionRect.height >= window.innerHeight * 0.5;
          });
          if (hit) {
            setSeen(true);
            io.disconnect();
          }
        },
        /* A loose mark can be mostly outside a clipping parent (the
           footer's corner swash), and the observer counts only what shows,
           so a mark draws as soon as any of it is on screen. */
        { threshold: mark ? 0 : [0, 0.25, 0.5, 0.75, 1] }
      );
      io.observe(target);
    }
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('orientationchange', remeasure);
      if (document.fonts) document.fonts.removeEventListener('loadingdone', remeasure);
    };
    // `thickness` and `mark` are fixed for a use's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Drawn one frame after ready and seen, so the undrawn stroke has been
     painted and the draw runs. Reduced motion: the transition is off
     (tokens.css), so it simply appears. */
  useEffect(() => {
    if (!ready || !seen || drawn) return undefined;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setDrawn(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [ready, seen, drawn]);

  useEffect(() => {
    if (!drawn || inked) return undefined;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = setTimeout(() => setInked(true), still ? 0 : 500);
    return () => clearTimeout(id);
  }, [drawn, inked]);

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
    ready && W > 0 && T > 0 ? (
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
          {/* The region is the drawing's own box in user space, with room
              all round for the displacement (2026-09-30). Percentages here
              are of the drawing, not of the path's bounds: bounds-relative,
              the region is the path's geometry without its stroke and cut
              the stroke to a thin band. The seed is fixed, so the edge is
              the same on every render. */}
          <filter id={fid} filterUnits="userSpaceOnUse" x="-20%" y="-30%" width="140%" height="160%">
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
    <span
      className={`brush ${className}`.trim()}
      ref={wrapRef}
      style={hold}
      data-drawn={drawn ? 'true' : 'false'}
      data-inked={inked ? 'true' : 'false'}
    >
      {svg}
      <span className="brush__t" ref={textRef}>
        {children}
      </span>
    </span>
  );
}

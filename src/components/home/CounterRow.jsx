import React, { useCallback, useEffect, useState } from 'react';
import { useReducedMotion, useReveal } from './hooks.js';
import './CounterRow.css';

/* Section 4. The numbers.

   Four across, full width. It was a two by two block only while the flat
   Pillars row still held the four-across layout family; Services replaced
   Pillars and that constraint died with it. Verified before rebuilding that no
   other grid on the page is a row of four.

   Values are deliberately synthetic and the labels say so. BUILD-LAW.md
   Truth: no invented client counts, credentials, or capabilities. */
const COUNTERS = [
  { id: 'one', value: 1240, label: 'Placeholder label one' },
  { id: 'two', value: 48, label: 'Placeholder label two' },
  { id: 'three', value: 12, label: 'Placeholder label three' },
  { id: 'four', value: 6, label: 'Placeholder label four' },
];

/* DESIGN.md's duration table stops at drawers and panels and then says
   marketing reveals may run longer. A count is a marketing reveal. */
const COUNT_MS = 1600;

const format = (n) => new Intl.NumberFormat('en-US').format(n);

/* The reveal curve from DESIGN.md, cubic-bezier(.23, 1, .32, 1), solved in
   JavaScript so the count eases on the system's own curve instead of a second
   one invented here. Newton-Raphson on x, then read y. */
function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t) => (3 * ax * t + 2 * bx) * t + cx;

  return (x) => {
    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-6) break;
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    return sampleY(t);
  };
}

const easeReveal = cubicBezier(0.23, 1, 0.32, 1);

function Counter({ value, label, index, run, reduced, landed, onLanded }) {
  /* Under reduced motion the number is its final value from the first paint.
     There is no gentler version of a count, so this one is switched off
     rather than slowed. */
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      onLanded(index);
      return undefined;
    }
    if (!run) return undefined;

    let raf = 0;
    let start = 0;

    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / COUNT_MS, 1);
      setShown(Math.round(value * easeReveal(p)));
      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        /* The rule lights when its number lands, not on a timer that hopes
           to agree with it. */
        onLanded(index);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, run, reduced, index, onLanded]);

  return (
    <li
      className="counters__item"
      style={{ '--i': index }}
      data-landed={landed ? 'true' : 'false'}
    >
      {/* The separator belongs to the stat on its right, so there is none
          before the first. Vertical between columns, horizontal between rows
          once the block folds to two by two. */}
      {index > 0 ? (
        <span className="counters__rule" aria-hidden="true">
          <span className="counters__rule-lit" />
        </span>
      ) : null}

      {/* No width reservation. The columns are fixed at 1fr, so a number
          growing a digit mid count has nothing to push: it changes width
          inside a track whose width does not depend on it. The reservation
          this replaced was measured in `ch`, the width of a zero, which
          over-reserved by the width of the comma and pushed the widest figure
          out past its own column. tabular-nums still keeps the digits from
          jittering in place. */}
      {/* No icon. The figure is the visual object here, per Plate 04, and a
          mark above it would only say "this is a number" over something that
          is obviously a number. See DESIGN.md Iconography: an icon has to add
          meaning the element does not already carry. */}
      <span className="counters__n">{format(shown)}</span>
      <span className="counters__l">{label}</span>
    </li>
  );
}

export default function CounterRow() {
  const reduced = useReducedMotion();
  const [ref, revealed] = useReveal();
  const [landed, setLanded] = useState(() => COUNTERS.map(() => false));

  /* Stable across renders. An inline arrow here would be a new function on
     every render, and it sits in the count effect's dependency list, so the
     effect would tear down and restart the count on every tick it caused. */
  const land = useCallback((i) => {
    setLanded((prev) => {
      if (prev[i]) return prev;
      const next = prev.slice();
      next[i] = true;
      return next;
    });
  }, []);

  return (
    <section
      className="vt counters band-marble"
      aria-labelledby="counters-h"
      data-revealed={revealed ? 'true' : 'false'}
      ref={ref}
    >
      <div className="counters__inner">
        <h2 className="counters__h" id="counters-h">
          Placeholder section heading
        </h2>

        <ul className="counters__list">
          {COUNTERS.map(({ id, value, label }, i) => (
            <Counter
              key={id}
              value={value}
              label={label}
              index={i}
              run={revealed}
              reduced={reduced}
              landed={landed[i]}
              onLanded={land}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

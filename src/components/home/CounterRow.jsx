import React, { useEffect, useState } from 'react';
import { useReducedMotion, useReveal } from './hooks.js';
import './CounterRow.css';

/* Section 4. The numbers.

   Two by two on concrete, not four across. Pillars directly above is already
   a four-across equal-column row, and BUILD-LAW.md allows a layout family
   once per page. The block also gives the density law its leader: counter one
   runs a full step up the scale from the other three.

   Values are deliberately synthetic and the labels say so. BUILD-LAW.md
   Truth: no invented client counts, credentials, or capabilities. These are
   placeholders that cannot be mistaken for a claim, and pre-flight item 5
   fails loudly on them until the real numbers arrive. */
const COUNTERS = [
  { id: 'one', value: 1240, label: 'Placeholder label one' },
  { id: 'two', value: 48, label: 'Placeholder label two' },
  { id: 'three', value: 12, label: 'Placeholder label three' },
  { id: 'four', value: 6, label: 'Placeholder label four' },
];

/* DESIGN.md's duration table stops at drawers and panels and then says
   marketing reveals may run longer. A count is a marketing reveal, so it
   takes a longer figure than any interaction band. */
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

function Counter({ value, label, lead, index, run, reduced }) {
  /* Under reduced motion the number is simply its final value from the first
     paint. There is no gentler version of a count, so this one is switched
     off rather than slowed. */
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setShown(value);
      return undefined;
    }
    if (!run) return undefined;

    let raf = 0;
    let start = 0;

    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / COUNT_MS, 1);
      setShown(Math.round(value * easeReveal(p)));
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, run, reduced]);

  const final = format(value);

  return (
    <li className={`counters__item${lead ? ' counters__item--lead' : ''}`} style={{ '--i': index }}>
      {/* The width is reserved from the final string, so a number growing a
          digit mid count cannot move anything around it. tabular-nums keeps
          the digits themselves from jittering in place. */}
      <span className="counters__n" style={{ '--chars': final.length }}>
        {format(shown)}
      </span>
      <span className="counters__l">{label}</span>
    </li>
  );
}

export default function CounterRow() {
  const reduced = useReducedMotion();
  const [ref, revealed] = useReveal();

  return (
    <section
      className="vt vt--light counters"
      aria-label="Placeholder figures"
      data-revealed={revealed ? 'true' : 'false'}
      ref={ref}
    >
      <div className="counters__inner">
        <ul className="counters__list">
          {COUNTERS.map(({ id, value, label }, i) => (
            <Counter
              key={id}
              value={value}
              label={label}
              lead={i === 0}
              index={i}
              run={revealed}
              reduced={reduced}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

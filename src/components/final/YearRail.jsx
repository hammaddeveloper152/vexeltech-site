import React, { useRef } from 'react';
import { useOnce } from '../site/useOnce.js';
import './about-final.css';

/* ABOUT, WHERE WE COME FROM: THE YEAR RAIL (the final pass, 2026-10-03).
   One horizontal rail across the 760px column, above the three paragraphs:
   a 1px steel line, three ticks, and the founder's years in mono 11px steel
   (7.2:1 on cream) at 0%, 50% and 100%. A yellow fill draws along it from
   the left over 1.2s on the reveal curve, by scaleX, when the block enters
   the view, once (useOnce). Reduced motion: drawn from the start. */
const YEARS = [
  { y: '2023', at: 0 },
  { y: '2025', at: 50 },
  { y: '2026', at: 100 },
];

export default function YearRail() {
  const ref = useRef(null);
  const armed = useOnce(ref, (gsap, el, done) => done(), 'top 80%');
  return (
    <div className="yr" ref={ref} data-armed={armed ? 'true' : 'false'}>
      <span className="yr__line" aria-hidden="true">
        <span className="yr__fill" />
      </span>
      <ol className="yr__years">
        {YEARS.map(({ y, at }) => (
          <li className="yr__year" key={y} style={{ '--at': `${at}%` }} data-at={at}>
            {y}
          </li>
        ))}
      </ol>
    </div>
  );
}

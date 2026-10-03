import React, { useRef } from 'react';
import { useLoop, step } from './loop.js';
import './artifacts.css';
import '../final/about-bands.css';

/* ABOUT, FOUR BUSINESS DAYS (the final artifacts pass, 2026-10-03, the
   founder). A dark band: the H2, then a week strip of five cells, Monday
   to Friday, each a 1px steel outline 180px tall (stacked below 768), the
   day in mono 11px at the top. The cells fill in turn, 600ms apart: a 4px
   yellow bar draws across the top and one line in bone rises into place.
   Friday fills solid yellow, "Live." in black at 24px. Hold, rest, loop
   (loop.js); the first paint and reduced motion show the full week.

   The week is the founder's, from the brief; the caption sets it against
   the content date and points bigger builds at the call. The strip is a
   picture of the caption's claim, so the days and lines are real text and
   read in order. */
const DAYS = [
  { d: 'Mon', line: 'Content in. Concepts out.' },
  { d: 'Tue', line: 'Build.' },
  { d: 'Wed', line: 'Build. Your review.' },
  { d: 'Thu', line: 'Changes. Launch checks.' },
  { d: 'Fri', line: 'Live.', live: true },
];
const T0 = 300;
const GAP = 600;
const TOTAL = T0 + GAP * 4 + 400 + 1200;

export default function WeekStrip() {
  const ref = useRef(null);
  const [t] = useLoop(ref, TOTAL);
  return (
    <section className="vt st-sec st--dark ab-dark wk" aria-labelledby="wk-h" data-artifact="WeekStrip" data-device="week strip">
      <div className="st-in">
        <h2 className="st-h" id="wk-h">
          Four business days from content to live
        </h2>
        <ol className="wk__days" ref={ref}>
          {DAYS.map(({ d, line, live }, i) => {
            const at = T0 + i * GAP;
            const pBar = step(t, at, 300);
            const pLine = step(t, at + 100, 400);
            return (
              <li
                className={`wk__cell${live ? ' wk__cell--live' : ''}${live && step(t, at, 400) > 0.5 ? ' wk__cell--lit' : ''}`}
                key={d}
              >
                {live ? (
                  <span className="wk__fill" aria-hidden="true" style={{ transform: `scaleY(${step(t, at, 400)})` }} />
                ) : (
                  <span className="wk__bar" aria-hidden="true" style={{ transform: `scaleX(${pBar})` }} />
                )}
                <span className="wk__d">{d}</span>
                <span className="wk__mask">
                  <span className="wk__line" style={{ transform: `translateY(${(1 - pLine) * 110}%)` }}>
                    {line}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className="wk__cap">Counted from the day we have your content. Bigger builds are scoped on the call.</p>
      </div>
    </section>
  );
}

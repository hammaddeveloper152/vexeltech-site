import React, { useRef } from 'react';
import { useLoop, step } from './loop.js';
import './artifacts.css';
import '../final/about-bands.css';

/* ABOUT, FOUR BUSINESS DAYS: THE RAIL (the founder's pre-launch pass,
   2026-10-05). It replaces the week strip of five outlined cells (the final
   artifacts pass, 2026-10-03). No boxes and no outlines.

   One 2px steel rail across the content width with five ticks, Monday to
   Friday, the day names in mono 11px under the ticks. A yellow fill draws
   along the rail tick to tick, 600ms a segment. As it reaches a tick that
   day's line rises into place in 18px bone, above the rail and below it in
   turn, so no two lines meet. At Friday the fill ends in a 24px yellow disc
   and "Live." lands above it in 40px display yellow. Below 768 the rail
   runs down the left with the lines to its right.

   Hold, rest, loop (loop.js); the first paint and reduced motion show the
   whole week. The week is the founder's, from the brief; the days and lines
   are real text and read in order. */
const DAYS = [
  { d: 'Mon', line: 'Content in. Concepts out.' },
  { d: 'Tue', line: 'Build.' },
  { d: 'Wed', line: 'Build. Your review.' },
  { d: 'Thu', line: 'Changes. Launch checks.' },
  { d: 'Fri', line: 'Live.', live: true },
];
const T0 = 300;
const SEG = 600;
const SEGS = DAYS.length - 1;
const TOTAL = T0 + SEG * SEGS + 400 + 1200;

/* The fill's reach, 0 to 1 along the rail: each segment eased on its own,
   so the fill arrives at every tick rather than sliding past it. */
function reach(t) {
  const k = Math.max(0, Math.min(SEGS, (t - T0) / SEG));
  const done = Math.floor(k);
  return done === SEGS ? 1 : (done + step(k - done, 0, 1)) / SEGS;
}

export default function WeekStrip() {
  const ref = useRef(null);
  const [t] = useLoop(ref, TOTAL);
  return (
    <section className="vt st-sec st--dark ab-dark wk" aria-labelledby="wk-h" data-artifact="WeekStrip" data-device="week rail">
      <div className="st-in">
        <h2 className="st-h" id="wk-h">
          Four business days from content to live
        </h2>
        <div className="wk__track" ref={ref}>
          <span className="wk__rail" aria-hidden="true">
            <span className="wk__fill" style={{ '--p': reach(t) }} />
          </span>
          <ol className="wk__days">
            {DAYS.map(({ d, line, live }, i) => {
              const at = T0 + i * SEG;
              const side = live ? 'live' : i % 2 === 0 ? 'above' : 'below';
              return (
                <li className={`wk__day wk__day--${side}`} key={d} style={{ '--i': i }}>
                  <span className="wk__tick" aria-hidden="true" />
                  {live ? (
                    <span className="wk__disc" aria-hidden="true" style={{ transform: `scale(${step(t, at, 300)})` }} />
                  ) : null}
                  <span className="wk__d">{d}</span>
                  <span className="wk__mask">
                    <span className="wk__line" style={{ transform: `translateY(${(1 - step(t, at, 400)) * 110}%)` }}>
                      {line}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
        <p className="wk__cap">Counted from the day we have your content. Bigger builds are scoped on the call.</p>
      </div>
    </section>
  );
}

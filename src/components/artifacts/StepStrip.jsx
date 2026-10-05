import React from 'react';
import './step-strip.css';

/* THE STEP STRIP (the founder's clarity pass, 2026-10-06). Under every
   stage on /services and home's cost stage: the sequence's beats as mono
   11px labels on one line, 1px steel ticks between. The beat playing is in
   the accent (`--strip-now`, set by the section: the discipline's text ink
   on /services, yellow on home), the beats done in the ground's ink, the
   beats to come in its secondary ink. It advances with the play and rests
   fully lit: `at` is the index of the beat playing, and `at` at or past
   the last beat's end (or null) lights them all.

   The labels are text a reader can read in order, so the strip is a list;
   the beat playing carries aria-current. */
export default function StepStrip({ steps, at = null, className = '' }) {
  const all = at === null || at >= steps.length;
  return (
    <ol className={`strip${className ? ` ${className}` : ''}`}>
      {steps.map((s, i) => {
        const state = all || i < at ? 'done' : i === at ? 'now' : 'next';
        return (
          <li className="strip__beat" data-state={state} key={s} aria-current={state === 'now' ? 'step' : undefined}>
            {s}
          </li>
        );
      })}
    </ol>
  );
}

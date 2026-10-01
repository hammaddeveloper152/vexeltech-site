import React from 'react';
import { useReveal } from './hooks.js';
import Brush from '../site/Brush.jsx';
import './Failures.css';

/* The four failures. Sits between the hero and Services, and names what is
   broken before anything on the page mentions a service.

   The four statements are the user's copy, verbatim and in the user's order.
   The order is the order a customer is lost in: found, called, answered,
   remembered. Nothing in them is a claim about VexelTech, so BUILD-LAW.md
   Truth is not in play for them.

   ---- FOUR ROWS ON THE PAGE GROUND, 2026-09-24 (the founder) ---------------

   No panel, no images, no icons: four rows inside the measure, each a
   numeral (mono 12px, steel-lift), a title (Clash Display Medium 27px,
   bone) in a 40% column, and the one-line body (16px, steel-lift), 32px
   above and below each row, split by white hairlines at 10%. The object
   cards and the cream panel that followed them are gone.

   The numerals are an ordered list's own count shown in type, so a screen
   reader hears the list's count and not "01" read out before each title. */
/* COPY V2, 2026-10-01 (VEXELTECH-COPY.md, Home, What it costs you): each
   row's first sentence is the title, the rest the line. */
const FAILURES = [
  {
    id: 'find',
    statement: 'They search and find someone else.',
    consequence: 'No site, or a site Google skips, and the job goes to the company it found instead.',
  },
  {
    id: 'call',
    statement: "The ads run and the phone doesn't.",
    consequence: "Money goes out every month, clicks land on a page that doesn't convert, and nobody can tell you why.",
  },
  {
    id: 'miss',
    statement: 'You miss the call.',
    consequence: "You're on a roof or under a sink. The caller tries the next number on the list.",
  },
  {
    id: 'remember',
    statement: 'They forget your name.',
    consequence: 'Work with no mark on it is work the next customer never hears about.',
  },
];

export default function Failures() {
  /* The 70ms stagger runs on the rows as the list enters, once. The observer
     watches what moves, not the section (viewer audit, 2026-09-16). */
  const [ref, revealed] = useReveal();

  return (
    <section className="vt fail" aria-labelledby="fail-h">
      {/* The margin label is Marginalia.jsx's since 2026-09-25. */}
      <div className="fail__inner">
        {/* THE HEAD COLUMN, 2026-09-25 (the founder's life pass 3): the
            heading and the founder's intro line, verbatim. */}
        <div className="fail__head">
          <h2 className="fail__h" id="fail-h">
            What it costs you
          </h2>
          {/* Two loose swashes under the intro, from 1024 (the Genesis pass):
              260 and 320px, -6 and 4 degrees, at 0.85. Decorative. */}
          <div className="fail__marks" aria-hidden="true">
            <Brush mark width={260} angle={-6} opacity={0.85} />
            <Brush mark width={320} angle={4} opacity={0.85} />
          </div>
        </div>
        {/* A 2 x 2 from 1024, one column below it. No numerals since life
            pass 3: the list is still ordered, and a screen reader still
            hears its count. */}
        <ol className="fail__rows" data-revealed={revealed ? 'true' : 'false'} ref={ref}>
          {FAILURES.map(({ id, statement, consequence }, i) => (
            <li className="fail__row" key={id} style={{ '--i': i }}>
              <h3 className="fail__t">{statement}</h3>
              <p className="fail__b">{consequence}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

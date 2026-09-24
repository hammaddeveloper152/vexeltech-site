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
const FAILURES = [
  {
    id: 'find',
    statement: 'They cannot find you',
    consequence: 'No online presence, so the search that should have found you finds nobody.',
  },
  {
    id: 'call',
    statement: 'Not enough are calling',
    consequence: 'The marketing budget goes out every month and the leads do not come back.',
  },
  {
    id: 'miss',
    statement: 'You miss the ones who do',
    consequence: 'A missed call is a job that goes to whoever picked up instead.',
  },
  {
    id: 'remember',
    statement: 'They do not remember you',
    consequence: 'Work with no name on it is work the next customer never hears about.',
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
          <p className="fail__intro">Four ways a local business loses money before anyone notices.</p>
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

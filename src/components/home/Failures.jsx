import React from 'react';
import { useReveal } from './hooks.js';
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
      {/* The margin label, 2026-09-24: decorative, the heading names it. */}
      <span className="marg" aria-hidden="true">
        (01) What it costs you
      </span>
      <div className="fail__inner">
        <h2 className="fail__h" id="fail-h">
          What it costs you
        </h2>
        <ol className="fail__rows" data-revealed={revealed ? 'true' : 'false'} ref={ref}>
          {FAILURES.map(({ id, statement, consequence }, i) => (
            <li className="fail__row" key={id} style={{ '--i': i }}>
              <span className="fail__n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="fail__t">{statement}</h3>
              <p className="fail__b">{consequence}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

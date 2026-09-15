import React from 'react';
import { useReveal } from './hooks.js';
import './Failures.css';

/* The four failures. Sits between the hero and Services, and names what is
   broken before anything on the page mentions a service.

   The four statements are the user's copy, verbatim and in the user's order.
   The order is the order a customer is lost in: found, called, answered,
   remembered. Nothing in them is a claim about VexelTech, so BUILD-LAW.md
   Truth is not in play for them.

   ---- A YELLOW BAND WITH FOUR OBJECTS ON IT, 2026-09-14 ------------------

   This was the hanging-rail ledger: four statements down a wide column, their
   consequences hanging in a narrow one, and a rail drawn between them on the
   scroll. It is a machine yellow band now, edge to edge, with asphalt type,
   and each failure stands with one object from the supplied icon set above
   it. Four rows below 1024 and four columns from 1024 up.

   What went with the ledger, because it existed only to carry it: the rail
   and its three strokes, the scrubbed ScrollTrigger that gated each
   consequence on the rail, and the lead statement's extra size. A lead was
   the density law's answer while four statements sat at heading scale in one
   column; four peers in four columns are a set, and the section heading is
   what leads, which is where DESIGN.md says to look when a set of peers has
   no leader.

   Four columns is the layout family the counter row already uses on this
   page. The user decided on 2026-09-14 that icon-and-text columns and a row of
   figures are different families, and BUILD-LAW records the amendment.

   ---- The consequences --------------------------------------------------

   Lines one and two come from content answer 1.2, which names a business "not
   getting enough leads by spending alot on their marketing budget", and one
   that does "not have any online presence". Lines three and four were given
   directly on 2026-09-08. */
const FAILURES = [
  {
    id: 'find',
    statement: 'They cannot find you',
    consequence: 'No online presence, so the search that should have found you finds nobody.',
    icon: 'icon-phone',
  },
  {
    id: 'call',
    statement: 'Not enough are calling',
    consequence: 'The marketing budget goes out every month and the leads do not come back.',
    icon: 'icon-megaphone',
  },
  {
    id: 'miss',
    statement: 'You miss the ones who do',
    consequence: 'A missed call is a job that goes to whoever picked up instead.',
    icon: 'icon-missed-call',
  },
  {
    id: 'remember',
    statement: 'They do not remember you',
    consequence: 'Work with no name on it is work the next customer never hears about.',
    icon: 'icon-name-tag',
  },
];

export default function Failures() {
  /* Four separate things to read, so they arrive one after another on the
     70ms stagger as the LIST enters, and once. The observer watched the
     section until 2026-09-16, and the section's top reaches the trigger line
     with the heading: the list was still 147px below the fold at 1280, so the
     stagger ran out of sight (viewer audit). It watches what moves now. */
  const [ref, revealed] = useReveal();

  return (
    <section className="vt fail" aria-labelledby="fail-h">
      <div className="fail__inner">
        <h2 className="fail__h" id="fail-h">
          What it costs you
        </h2>

        <ul className="fail__items" data-revealed={revealed ? 'true' : 'false'} ref={ref}>
          {FAILURES.map(({ id, statement, consequence, icon }, i) => (
            <li className="fail__item" key={id} style={{ '--i': i }}>
              {/* Decorative. The statement beside it says what it means, and
                  an object that announced "megaphone" before "Not enough are
                  calling" would say the section twice. A brand object, and
                  exempt from the carrier count for that reason, like the
                  wordmark. */}
              <img
                className="fail__icon"
                src={`/assets/objects/${icon}.webp`}
                alt=""
                width="96"
                height="96"
                loading="lazy"
                decoding="async"
              />
              <div className="fail__text">
                <h3 className="fail__s">{statement}</h3>
                <p className="fail__c">{consequence}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

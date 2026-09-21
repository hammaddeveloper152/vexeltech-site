import React from 'react';
import { BellSlash, MapPinLine, PhoneSlash, UserMinus } from '@phosphor-icons/react';
import { useReveal } from './hooks.js';
import './Failures.css';

/* The four failures. Sits between the hero and Services, and names what is
   broken before anything on the page mentions a service.

   The four statements are the user's copy, verbatim and in the user's order.
   The order is the order a customer is lost in: found, called, answered,
   remembered. Nothing in them is a claim about VexelTech, so BUILD-LAW.md
   Truth is not in play for them.

   ---- FOUR DARK ROWS, 2026-09-21, from the storyboard ----------------

   Dark, no band: it cannot touch the hero. Four short rows at every width, a
   Phosphor icon at the 24px station left of each statement and its
   consequence. The rendered icon objects and the yellow band they stood on
   came off with the storyboard, which allows no object but the character.
   The icons are MapPinLine, PhoneSlash, BellSlash and UserMinus since
   2026-09-21, by BUILD-LAW 0 (nothing is reused): MagnifyingGlass and
   Megaphone were also on What we do and /services. None of the four appears
   anywhere else on the site.

   Before this it was a yellow band with four rendered objects (2026-09-14),
   and before that the hanging-rail ledger. */
const FAILURES = [
  {
    id: 'find',
    statement: 'They cannot find you',
    consequence: 'No online presence, so the search that should have found you finds nobody.',
    Icon: MapPinLine,
  },
  {
    id: 'call',
    statement: 'Not enough are calling',
    consequence: 'The marketing budget goes out every month and the leads do not come back.',
    Icon: PhoneSlash,
  },
  {
    id: 'miss',
    statement: 'You miss the ones who do',
    consequence: 'A missed call is a job that goes to whoever picked up instead.',
    Icon: BellSlash,
  },
  {
    id: 'remember',
    statement: 'They do not remember you',
    consequence: 'Work with no name on it is work the next customer never hears about.',
    Icon: UserMinus,
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
          {FAILURES.map(({ id, statement, consequence, Icon }, i) => (
            <li className="fail__item" key={id} style={{ '--i': i }}>
              {/* Phosphor at the 24px station, inheriting the row's colour.
                  Decorative: the statement beside it says what it means. */}
              <Icon className="i i--md fail__icon" aria-hidden="true" />
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

import React from 'react';
import { useReveal } from '../home/hooks.js';
import './story.css';

/* WHAT IT COSTS YOU, AS TYPE (the founder, 2026-10-02: real over drawn).
   The four drawn frames came off: the costs are set the way About's
   statements are, the label in Clash Display 32px, the line in Satoshi 18px
   steel-lift, a hairline between rows; one column below 1024, two from it.
   No illustration. The words are VEXELTECH-COPY.md V3.1's, verbatim. */
const ROWS = [
  {
    id: 'find',
    statement: 'Not found.',
    consequence: "Someone searches for what you do and sees three competitors. You're not one of them.",
  },
  {
    id: 'call',
    statement: 'Ad spend without a cost per lead.',
    consequence: 'Money goes out every month and nobody can say what a lead cost.',
  },
  {
    id: 'miss',
    statement: 'The missed call.',
    consequence: "You're with a customer. The caller dials the next number on the list.",
  },
  {
    id: 'remember',
    statement: 'No name on the work.',
    consequence: "Every job you finish advertises someone else's brand, or nobody's.",
  },
];

export default function CostRows() {
  const [ref, revealed] = useReveal();
  return (
    <section className="vt st-sec st--dark cr" aria-labelledby="cr-h">
      <div className="st-in">
        <h2 className="st-h" id="cr-h">
          What it costs you
        </h2>
        <ol className="cr__rows" ref={ref} data-revealed={revealed ? 'true' : 'false'}>
          {ROWS.map(({ id, statement, consequence }, i) => (
            <li className="cr__row st-rv" key={id} style={{ '--i': i }}>
              <h3 className="cr__t">{statement}</h3>
              <p className="cr__b st-soft">{consequence}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

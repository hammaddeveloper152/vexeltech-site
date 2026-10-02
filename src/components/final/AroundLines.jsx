import React from 'react';
import './about-bands.css';

/* ABOUT, WHAT WE BUILD IT AROUND, ON THE DARK (2026-10-03, the founder). It
   replaced BuildAround. Four rows, a 1px steel rule between them: the
   discipline in mono 11px in the yellow text accent (9.46:1 on the dark
   ground), then its line in the display face at 40px in bone (28 below
   768). No figures, no icons. Nothing moves.

   The lines are VEXELTECH-COPY.md V3.1's, verbatim. */
const ROWS = [
  {
    id: 'branding',
    k: 'Branding',
    line: "A customer decides if you're real in ten seconds. The mark does that before you speak.",
  },
  {
    id: 'websites',
    k: 'Websites',
    line: 'People scan for a number, a price and a reason to trust you. All three above the fold.',
  },
  {
    id: 'marketing',
    k: 'Marketing',
    line: 'An ad is only as good as the page after the click and the phone after the page.',
  },
  {
    id: 'automation',
    k: 'Automation',
    line: 'A missed call answered by text in sixty seconds is still a customer.',
  },
];

export default function AroundLines() {
  return (
    <section className="vt st-sec st--dark ab-dark al" aria-labelledby="al-h">
      <div className="st-in">
        <h2 className="st-h" id="al-h">
          What we build it around
        </h2>
        <ul className="al__rows">
          {ROWS.map(({ id, k, line }) => (
            <li className="al__row" key={id}>
              <p className="al__k">{k}</p>
              <p className="al__line">{line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

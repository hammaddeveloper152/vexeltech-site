import React from 'react';
import './story.css';

/* WHO WE ARE FOR, IN COLOUR (the founder's five fixes, 2026-10-02). Two
   sheets, side by side from 1024 and stacked below: "A fit" on mint, "Not a
   fit" on coral. 24px radius, 32px padding, the label in mono 12px
   uppercase, each sentence in Clash Display 20px asphalt, a hairline of
   asphalt at 20% between them. It replaced the two-column ledger with its
   gutter marks.

   The sentences are VEXELTECH-COPY.md V3.1's, verbatim, split at their full
   stops; "Contractors, clinics, real estate" is the check's About exception
   and stays one line. */
const SHEETS = [
  {
    id: 'fit',
    head: 'A fit',
    rows: [
      'Owner-run businesses, one to fifty people.',
      'Contractors, clinics, real estate, bookkeeping, hospitality, consultancies, local retail.',
      'You answer your own phone, or you want to stop having to.',
    ],
  },
  {
    id: 'not',
    head: 'Not a fit',
    rows: [
      'Agencies wanting white-label work.',
      'Startups raising a round.',
      'Anyone who wants a retainer instead of a result.',
    ],
  },
];

export default function FitLedger() {
  return (
    <section className="vt st-sec st--light fl" aria-labelledby="fl-h">
      <div className="st-in">
        <h2 className="st-h" id="fl-h">
          Who we are for
        </h2>
        <div className="fl__sheets">
          {SHEETS.map(({ id, head, rows }) => (
            <div className={`fl__sheet fl__sheet--${id}`} key={id}>
              <h3 className="fl__head">{head}</h3>
              <ul className="fl__rows">
                {rows.map((r) => (
                  <li className="fl__row" key={r}>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

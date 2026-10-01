import React from 'react';
import './story.css';

/* WHO WE ARE FOR, A LEDGER (the storytelling pass, 2026-10-01). Two
   columns, A fit and Not a fit, each sentence of the founder's two lines
   its own hairline row, a mono mark in the gutter: + for a fit, x for not.
   Typographic only. The sentences are VEXELTECH-COPY.md V3.1's, verbatim,
   split at their full stops; "Contractors, clinics, real estate" is the
   check's About exception and stays one row. */
const COLS = [
  {
    id: 'fit',
    head: 'A fit',
    mark: '+',
    rows: [
      'Owner-run businesses, one to fifty people.',
      'Contractors, clinics, real estate, bookkeeping, hospitality, consultancies, local retail.',
      'You answer your own phone, or you want to stop having to.',
    ],
  },
  {
    id: 'not',
    head: 'Not a fit',
    mark: '×',
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
        <div className="fl__cols">
          {COLS.map(({ id, head, mark, rows }) => (
            <div className="fl__col" key={id}>
              <h3 className="fl__head st-mono">{head}</h3>
              <ul className="fl__rows">
                {rows.map((r) => (
                  <li className="fl__row" key={r}>
                    <span className="fl__mark" aria-hidden="true">
                      {mark}
                    </span>
                    <span className="fl__t">{r}</span>
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

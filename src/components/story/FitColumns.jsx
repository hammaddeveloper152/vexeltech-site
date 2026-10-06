import React from 'react';
import './story.css';

/* WHO WE ARE FOR, TWO COLUMNS (the founder's six fixes, 2026-10-02). The
   mint and coral sheets came off. On the cream page: two columns split by
   one 1px vertical rule in steel (stacked below 768, a horizontal rule
   between). The labels mono 11px: "A fit" in deep amber (4.82:1 on cream),
   "Not a fit" in steel. The items in the display face at 22px, 20px apart,
   no boxes, no fills:

     a fit       asphalt (15.75:1), each with a 10px yellow square
     not a fit   steel (7.20:1), each with a 10px hollow square, 1px steel

   STEEL, NOT STEEL-LIFT, for "Not a fit": the brief named steel-lift, which
   is 2.3:1 on cream and fails its own 4.5:1 check; steel is the system's
   secondary text on a light ground.

   The sentences are VEXELTECH-COPY.md V3.1's, verbatim, split at their full
   stops; "Contractors, clinics, real estate" is the check's About exception
   and stays one item. "wherever you are" is the founder's, 2026-10-03: no
   geography fences the audience. */
const COLS = [
  {
    id: 'fit',
    head: 'A fit',
    rows: [
      'Owner-run businesses, one to fifty people, wherever you are.',
      'Contractors, clinics, real estate, bookkeeping, hospitality, consultancies, local retail.',
      'You answer your own phone, or you want to stop having to.',
    ],
  },
  {
    id: 'not',
    head: 'Not a fit',
    rows: [
      /* COPY V3.5, 2026-10-05. */
      'Agencies wanting white-label work.',
      'Anyone who wants a retainer instead of a result.',
      'Anyone who needs it yesterday. Four business days is the fastest honest answer.',
    ],
  },
];

export default function FitColumns() {
  return (
    <section className="vt st-sec st--light fc" aria-labelledby="fc-h" data-artifact="FitColumns">
      <div className="st-in">
        <h2 className="st-h" id="fc-h">
          Who this is for
        </h2>
        <div className="fc__cols">
          {COLS.map(({ id, head, rows }) => (
            <div className={`fc__col fc__col--${id}`} key={id}>
              <h3 className="fc__head">{head}</h3>
              <ul className="fc__rows">
                {rows.map((r) => (
                  <li className="fc__row" key={r}>
                    <span className="fc__mark" aria-hidden="true" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* COPY V4, 2026-10-06: under both lists, 15px, steel on this cream
            band (the brief's steel-lift is 2.27:1 on cream). */}
        <p className="fc__note">
          Our clients are in the US, the UK, Europe and Australia. We work with the UK, Europe and
          Australia on the same terms, with calls set to your hours.
        </p>
      </div>
    </section>
  );
}

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
      /* final38 (2026-10-08, the founder): the audience is any business
         that wants to grow. */
      /* COPY V5.2 (final39). */
      'Businesses that intend to grow, at any size and in any market.',
      'Contractors, clinics, real estate, bookkeeping, hospitality, consultancies, retail, and many we have not listed.',
      'You want more coming in than you have today.',
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
        <h2 className="st-h hl" id="fc-h">
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
        {/* The line under the lists is deleted (FINAL43, the founder). */}
      </div>
    </section>
  );
}

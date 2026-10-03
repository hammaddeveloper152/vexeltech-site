import React from 'react';
import Wordmark from '../site/Wordmark.jsx';
import './story.css';

/* HOW WE WORK WITH YOU, A REAL SHEET (the founder's six fixes,
   2026-10-02). It replaced the cream terms document; the Schedule (the key
   facts) is gone. Pure white (#fff), at most 680px, 48px inside (28 below
   768), 4px radius, the shadow 0 1px 2px at 6% and 0 24px 48px at 10%,
   centred in the content column.

     the head     the wordmark at 14px, "Terms" in the body face at 16px
                  beside it, the year in mono 11px at the right; a 1px rule
                  under
     the clauses  four, 28px apart: the number in mono 11px deep amber
                  (5.43:1 on white), the title in the display face 20px
                  asphalt, the line 15px steel
     the foot     a 1px rule, then one row: "Signed for VexelTech" in mono
                  11px at the left and the wordmark at 14px, all black, at
                  the right. The swash signature came off in the seven
                  corrections (2026-10-02); the site's swash count is three

   STEEL, NOT STEEL-LIFT, for the lines: the brief named steel-lift, which
   is 2.6:1 on white and fails its own 4.5:1 check; steel is 7.6:1.

   The clauses are VEXELTECH-COPY.md V3.1's, About, How we work with you;
   "Signed for VexelTech" is the founder's line in the brief. */
const CLAUSES = [
  ['01', 'One person.', 'A name and a US number, on your account from the first call.'],
  ['02', 'Approval first.', 'Concepts, then the build, then the invoice.'],
  ['03', 'Ownership.', 'Domain, hosting, code and credentials in your name from day one.'],
  ['04', 'Thirty days.', 'Maintenance included after launch. After that, you call us when you need us.'],
];

export default function TermsCard() {
  return (
    <section className="vt st-sec st--light tc" aria-labelledby="tc-h" data-artifact="TermsCard">
      <div className="st-in">
        <h2 className="st-h" id="tc-h">
          How we work with you
        </h2>
        <article className="tc__sheet" aria-label="Terms">
          <header className="tc__head">
            <Wordmark size="sm" className="tc__wm" />
            <p className="tc__title">Terms</p>
            <p className="tc__year">2026</p>
          </header>
          <ol className="tc__clauses">
            {CLAUSES.map(([n, t, d]) => (
              <li className="tc__clause" key={n}>
                <span className="tc__n">{n}</span>
                <span className="tc__t">{t}</span>
                <span className="tc__d">{d}</span>
              </li>
            ))}
          </ol>
          <footer className="tc__foot">
            <p className="tc__signed">Signed for VexelTech</p>
            <Wordmark size="sm" className="tc__wm" />
          </footer>
        </article>
      </div>
    </section>
  );
}

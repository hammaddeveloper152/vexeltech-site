import React from 'react';
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

/* THE CONTRACT, final28 (2026-10-07, the founder). The heading "Our terms,
   in plain English" is deleted; the section is named by the document. The
   sheet is redrawn as a contract: paper #F7F3EA ruled every 24px, a 1px ink
   border, the mark top left, "Terms of work" in mono 13px and "2026" at the
   right. The four clauses as before, each over a 2px ink rule. At the foot
   the wordmark in the display face as the signature, rotated -3deg, over a
   1px ink line, "Signed for VexelTech" in mono 11px under it. A round dated
   stamp sits over the bottom right corner, rotated 8deg, in the Branding
   ink #865f08 at 85% (the launch gate; it was #F2B01E at 70%):
   2px ring, "VEXELTECH · 2026" round it in mono 11px and the mark in the
   middle. 88px, not the brief's 72, so the ring's words keep the 11px type
   floor (the founder's ruling, the same day). 480px wide at 1280, the
   home paper cards' cast shadow, and the full width less 32px on a phone.
   The signature and the stamp are pictures, hidden from assistive
   technology; the clauses are the content. */
const MARK = 'M7 33 29 25 50 60 78 6 94 2 54 93Z';

function Mark({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path d={MARK} />
    </svg>
  );
}

/* The ring's words on a circle of radius 32 about the stamp's centre,
   stretched to its whole length so they close up like a rubber stamp's. */
const RING_R = 32;
const RING_LEN = Math.round(2 * Math.PI * RING_R);

function Stamp() {
  return (
    <svg className="tc__stamp" viewBox="0 0 88 88" aria-hidden="true" focusable="false">
      <defs>
        <path id="tc-ring" d={`M 44 ${44 - RING_R} a ${RING_R} ${RING_R} 0 1 1 -0.01 0`} />
      </defs>
      <circle cx="44" cy="44" r="42" className="tc__stamp-ring" />
      <circle cx="44" cy="44" r="24" className="tc__stamp-ring tc__stamp-ring--in" />
      <text className="tc__stamp-t">
        <textPath href="#tc-ring" textLength={RING_LEN - 4} lengthAdjust="spacing">
          VEXELTECH · 2026 ·
        </textPath>
      </text>
      <path d={MARK} transform="translate(32 32) scale(0.24)" className="tc__stamp-mark" />
    </svg>
  );
}

export default function TermsCard() {
  return (
    <section className="vt st-sec st--light tc" aria-label="Terms of work" data-artifact="TermsCard">
      <div className="st-in">
        <article className="tc__sheet" aria-label="Terms of work">
          <header className="tc__head">
            <Mark className="tc__mark" />
            <p className="tc__title">Terms of work</p>
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
            <span className="tc__sig" aria-hidden="true">
              VEXELTECH.
            </span>
            <p className="tc__signed">Signed for VexelTech</p>
          </footer>
          <Stamp />
        </article>
      </div>
    </section>
  );
}

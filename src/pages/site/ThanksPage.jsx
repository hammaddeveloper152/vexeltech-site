import React from 'react';
import { Link } from 'react-router-dom';
import Shell from './Shell.jsx';
import './legal.css';

/* /thanks, on the site's shell, 2026-09-25 (the founder's legacy rebuild).
   The legacy page's copy, with one change the founder gave: the promise is
   "You'll hear from a person within one business day." (it read "A member
   of our team will review your project details and reach out within 24
   hours."). The "/ 01" after the label came off: one page, nothing to
   number. The forms confirm in place, so this route is only reached by a
   direct visit or an old link. noindex, as before.

   THE STRUCTURE PASS, 2026-10-01 (the founder): the heading is "Received."
   and the line is the founder's, with the phone as a call link. Sentence
   case throughout (the badge, the call and the title were title case), and
   the line saying what VexelTech is not ("not generic pitch decks") is
   gone. */
export default function ThanksPage() {
  return (
    <Shell
      title="Submission received | VexelTech"
      description="Received. A written reply within one business day."
      footerForm={false}
      noindex
    >
      <section className="vt legal legal--thanks" aria-labelledby="thanks-h">
        <div className="legal__in">
          <p className="legal__badge lbl">Submission confirmed</p>
          <h1 className="legal__h" id="thanks-h">
            Received.
          </h1>
          <p className="legal__lead">
            A written reply within one business day. If it&apos;s urgent, call{' '}
            <a href="tel:+13852843265">(385) 284-3265</a>.
          </p>
          <Link className="legal__cta" to="/">
            Return to homepage
          </Link>
        </div>
      </section>
    </Shell>
  );
}

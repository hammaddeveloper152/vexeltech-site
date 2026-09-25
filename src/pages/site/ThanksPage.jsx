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
   direct visit or an old link. noindex, as before. */
export default function ThanksPage() {
  return (
    <Shell
      title="Submission Received | VexelTech"
      description="Thank you for reaching out to VexelTech Solutions. We will review your request and get back to you shortly."
      footerForm={false}
      noindex
    >
      <section className="vt legal legal--thanks" aria-labelledby="thanks-h">
        <div className="legal__in">
          <p className="legal__badge lbl">Submission Confirmed</p>
          <h1 className="legal__h" id="thanks-h">
            We&apos;ve Received Your Request
          </h1>
          <p className="legal__lead">
            Thank you for reaching out to VexelTech. We show up with actual work built, not generic pitch decks.
            You&apos;ll hear from a person within one business day.
          </p>
          <Link className="legal__cta" to="/">
            Return to Homepage
          </Link>
        </div>
      </section>
    </Shell>
  );
}

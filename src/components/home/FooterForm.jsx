import React from 'react';
import LeadForm from '../site/LeadForm.jsx';
import FooterMeta from './FooterMeta.jsx';
import './FooterForm.css';

/* Section 9. The form, and the end of the page.

   Every value below is a placeholder. BUILD-LAW.md Truth: a phone number, an
   address, a legal entity name and a set of budget bands are all facts about
   this business, and none of them may be written here until they are given.
   The v11 tree carries a phone number and a Calendly link; they were NOT
   carried over, because a stale contact detail is worse than a visibly empty
   one.

   There is no Vexel Scales line anywhere in this file, by decision. */

/* THE FORM MOVED INTO LeadForm.jsx, 2026-09-25 (the founder's contact
   pass): the line fields, 01 name, 02 phone, 03 email, 04 message, and the
   submit at 40% until they are filled. Its validation, its posting to the
   Netlify form "contact", the UTM fields and the Lead event went with it,
   unchanged. The contact page renders the same form with the pills.

   `form={false}` renders the footer block alone, with no form above it
   (About since 2026-09-25, and Contact, whose form is its own section). */
export default function FooterForm({ form = true }) {
  if (!form) {
    return (
      <footer className="vt foot foot--bare">
        <FooterMeta />
      </footer>
    );
  }

  return (
    <footer className="vt foot">
      <div className="foot__inner">
        <h2 className="foot__h" id="foot-h">
          Get in touch
        </h2>

        <LeadForm idPrefix="ff" labelledBy="foot-h" />

        {/* The line that answers the form. */}
        <p className="foot__lead-p">
          Tell us what&apos;s going wrong. You&apos;ll hear from a person within one business day.
        </p>
      </div>

      {/* The footer block, inset (FooterMeta.jsx). */}
      <FooterMeta />
    </footer>
  );
}

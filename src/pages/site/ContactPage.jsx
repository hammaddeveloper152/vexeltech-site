import React from 'react';
import Shell from './Shell.jsx';
import { PageHead } from './parts.jsx';
import FooterForm from '../../components/home/FooterForm.jsx';

/* THE CONTACT PAGE. The form as built, and nothing added.

   `FooterForm` is reused rather than reimplemented, so there is one form on
   this site and one place its validation, its error handling and its offline
   state live. It renders as a `<footer>` here, which is correct: it is the
   end of this page as much as it is the end of the homepage, and it carries
   the meta row with it.

   THE FORM IS STILL OFFLINE and says so on itself. `LIVE` in FooterForm.jsx
   is false, the submit is disabled, and a visible line under it reads "This
   form is not live yet." Supply an endpoint and flip that one constant; the
   sent and failed branches are already wired.

   NO SECOND CALL ON THIS PAGE. Every other page's call points here, so a
   call here would point at the page the reader is on. The form is the
   action, which is why this is the one page with no call band and the one
   page whose accent is the form's own submit.

   NOT BUILT: the phone field. Content answer 9.1 asks for name, phone with a
   country code set from the IP, email, budget and message. The form has
   name, email, company, budget and message, so `company` is on it and not in
   9.1, and `phone` is in 9.1 and not on it. Both are the same decision and
   its cost was reported rather than guessed: an IP country code needs either
   a third party called on page load, which DESIGN.md's no-third-party-request
   rule is aimed squarely at, or an edge function this static build does not
   have. It would work perfectly while the form still went nowhere, which is
   the argument for doing it when the endpoint lands and not before. */

export default function ContactPage() {
  return (
    <Shell
      title="Contact | VexelTech"
      description="Tell us what you do and what you are losing. Fifteen minutes on the phone."
      meta={false}
    >
      <PageHead
        title="Let’s talk"
        lead="Tell us what you do and what is going wrong. Fifteen minutes on the phone is enough for us to say what we would fix first, and there is nothing to pay for the answer."
      />
      <FooterForm />
    </Shell>
  );
}

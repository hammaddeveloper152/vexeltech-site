import React from 'react';
import Shell from './Shell.jsx';
import { OneScreen } from './parts.jsx';

/* THE THREE ONE-SCREEN PAGES: Resources, Portfolio, Case studies.

   Each is a heading in Monigue on one line, a line under it, and one call to
   Contact. They are deliberate pages, not stubs, and the distinction that
   makes them so is what the line under the heading is allowed to say.

   ABOUT US WAS THE FOURTH, and the one with real copy. It is its own page now,
   `AboutPage.jsx`, rebuilt on 2026-09-15.

   ---- None of the three has content -------------------------------------

   PORTFOLIO, CASE STUDIES and RESOURCES have nothing. Source section 5, THE
   WORK, is blank, section 6, TESTIMONIALS, is blank, and nothing anywhere in
   either document mentions resources. So each of those three carries a
   `pending` note that says, in the page's own voice, that the material is
   not published here yet.

   ---- Why a pending note rather than written copy -----------------------

   THE INSTRUCTION WAS THAT THEY MUST NOT IMPLY CONTENT THAT DOES NOT EXIST,
   and the trap is subtler than writing "browse our work". A confident empty
   page that says "our case studies are coming soon" has asserted that case
   studies exist and are coming, and BUILD-LAW.md Truth does not let a build
   assert either. Even "we have not published our work yet" claims to know
   why it is absent.

   So the note says the one thing that is certainly true and is about the
   PAGE rather than about the business: this page has no content in it yet.
   It is styled as a placeholder, on a rule, in steel-dark at the small step,
   so it reads as a note about the page and can never be mistaken for the
   page's own copy. Every one of these notes comes out when the material
   arrives, and nothing around it has to change.

   ---- What makes them deliberate rather than stubs ----------------------

   The heading is at the page-head step and fills the frame, the page is a
   real screen tall rather than a band of white space, and the call is the
   page's one accent and the one thing to do on it. A reader who lands on
   Portfolio from the footer gets a page that knows what it is and sends
   them somewhere useful, which is the honest version of a page with no
   portfolio on it.

   ---- Not built ---------------------------------------------------------

   There is no work grid, no case study template and no resource index on any
   of these. Building an empty grid would be building the implication. */

/* Honest before, and lifeless. It stated a fact about the page and said
   nothing to the person reading it. This says the same fact in the voice and
   still claims nothing: no work is described, no date is promised, and
   "haven't done yet" asserts only what the empty page already proves. */
const PENDING =
  "There's nothing here yet. We would rather leave a page empty than fill it with work we haven't done.";

export function PortfolioPage() {
  return (
    <Shell path="/portfolio" title="Portfolio | VexelTech" description="Work by VexelTech.">
      <OneScreen title="Portfolio" pending={PENDING} />
    </Shell>
  );
}

export function CaseStudiesPage() {
  return (
    <Shell path="/case-studies" title="Case studies | VexelTech" description="Case studies by VexelTech.">
      <OneScreen title="Case studies" pending={PENDING} />
    </Shell>
  );
}

export function ResourcesPage() {
  return (
    <Shell path="/resources" title="Resources | VexelTech" description="Resources from VexelTech.">
      <OneScreen title="Resources" pending={PENDING} />
    </Shell>
  );
}

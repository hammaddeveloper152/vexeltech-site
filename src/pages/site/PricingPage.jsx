import React from 'react';
import Shell from './Shell.jsx';
import { PageHead, CallBand } from './parts.jsx';
import PlanBuilder from './PlanBuilder.jsx';

/* THE PRICING PAGE, REBUILT 2026-09-22 by the founder.

     1. The head, running straight into
     2. The Plan Builder (PlanBuilder, 2026-09-22; it replaced the tabbed
        board and the toggle receipt). The SECTION has no ground of its own:
        the drift lands on arc-black at its top (`driftTo`) and holds through
        the footer. Since later the same day it carries a lit-near panel.
     3. The burst call, then the form and the footer, as built

   THE BANNER IS GONE, 2026-09-22 (the founder): no banners anywhere on the
   site. `pricing-banner.webp` was a full-width 420px reservation for a file
   that is not coming, and the head now runs straight into the builder.
   `Banner.jsx` and `banner.css` are deleted rather than left unimported.

   The ladder on the yellow panel, the four-question flow and the tabbed
   board with its receipt are gone. Every figure on the page still comes from
   `src/content/pricing.js`, and there is no other source for one. */

export default function PricingPage() {
  return (
    <Shell
      title="Pricing | VexelTech"
      description="Branding and website packages, marketing and automation scoped to the job."
      driftTo=".plan"
    >
      <PageHead title="What do you need?" lead="Four questions. Then a plan with a number on it." />

      <PlanBuilder />

      <CallBand
        material="burst"
        heading="Not sure which one you need"
        note="Tell us what is going wrong and we will say which of these we would start with. Sometimes it is the cheapest one on this page."
      />
    </Shell>
  );
}

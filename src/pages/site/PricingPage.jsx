import React from 'react';
import Shell from './Shell.jsx';
import { PageHead, CallBand } from './parts.jsx';
import PlanBuilder from './PlanBuilder.jsx';
import Banner from '../../components/site/Banner.jsx';

/* THE PRICING PAGE, REBUILT 2026-09-22 by the founder.

     1. The head
     2. The banner slot (pricing-banner.webp), empty until the file exists
     3. The Plan Builder (PlanBuilder, 2026-09-22; it replaced the tabbed
        board and the toggle receipt). No ground of its own: the drift lands
        on arc-black at its top (`driftTo`) and holds through the footer.
     4. The burst call, then the form and the footer, as built

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

      {/* The founder's banner, 2026-09-22. Empty until pricing-banner.webp
          exists. */}
      <Banner src="/assets/pricing-banner.webp" label="Pricing banner" />

      <PlanBuilder />

      <CallBand
        material="burst"
        heading="Not sure which one you need"
        note="Tell us what is going wrong and we will say which of these we would start with. Sometimes it is the cheapest one on this page."
      />
    </Shell>
  );
}

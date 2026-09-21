import React from 'react';
import Shell from './Shell.jsx';
import { PageHead, CallBand } from './parts.jsx';
import PricingBoard from './PricingBoard.jsx';
import Banner from '../../components/site/Banner.jsx';

/* THE PRICING PAGE, REBUILT 2026-09-22 by the founder.

     1. The head
     2. The banner slot (pricing-banner.webp), empty until the file exists
     3. The board and Build your quote, on one arc blue ground (PricingBoard)
     4. The burst call, then the form and the footer, as built

   The ladder on the yellow panel, its tab row and its route line, and the
   four-question flow are gone. Every figure on the page still comes from
   `src/content/pricing.js`, and there is no other source for one. */

export default function PricingPage() {
  return (
    <Shell
      title="Pricing | VexelTech"
      description="Branding and website packages, marketing and automation scoped to the job."
    >
      <PageHead
        title="Pricing"
        lead="Branding and websites have a price on them. Marketing and automation depend on what they have to do, so those get a number once we have talked."
      />

      {/* The founder's banner, 2026-09-22. Empty until pricing-banner.webp
          exists. */}
      <Banner src="/assets/pricing-banner.webp" label="Pricing banner" />

      <PricingBoard />

      <CallBand
        material="burst"
        heading="Not sure which one you need"
        note="Tell us what is going wrong and we will say which of these we would start with. Sometimes it is the cheapest one on this page."
      />
    </Shell>
  );
}

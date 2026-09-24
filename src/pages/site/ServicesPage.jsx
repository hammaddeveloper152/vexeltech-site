import React from 'react';
/* THE 24 PHOSPHOR IMPORTS AND THE `Icon` FIELDS ARE GONE, 2026-09-23. The
   sub-service cards came off with the band rebuild and nothing renders an
   icon on this page any more, but the imports stayed and the bundler kept
   bundling twenty-four icon components for markup that does not exist. An
   import that nothing renders is still shipped weight. The card `line` text
   is kept: it is the founder's copy from VEXELTECH-SERVICES-COPY.md and costs
   nothing but bytes of source. */
import Shell from './Shell.jsx';
import { PageHead, Section, CallBand } from './parts.jsx';
import ServiceSections from './ServiceSections.jsx';
import { DISCIPLINES } from '../../content/services.js';
import '../../styles/services.css';
import Brush from '../../components/site/Brush.jsx';

/* THE SERVICES PAGE, REBUILT 2026-09-15. Four discipline SECTIONS, not plates.

   ALL COPY IS THE FOUNDER'S, from VEXELTECH-SERVICES-COPY.md in the design
   repo, which says every fact in it already appears on /pricing or in the FAQ.
   Each section has three parts: name and promise, the sub-service cards, and
   one strip with the price, the turnaround, the fit line and the call.

   2026-09-21, by the user: the three-column block (what you get, how it
   goes, the facts) is gone from every section. "How every project runs", the
   route that replaced it, came off the same day: the route is home's device,
   and the four strips carry the turnaround and the process. The per-discipline steps, "What you get" groups and "Not a fit if"
   lines are removed with the block; the cards carry what you get.

   ---- Edits to the file, all recorded ------------------------------------

   1. The text after each group title is capitalised: "The mark: custom logo
      design" is a group title "The mark" over "Custom logo design, ...". Only
      the first letter moved, the same normalisation the page's old lists took.
   2. Each step's first sentence is its title: "A call." is set apart from the
      rest of the step. The words are unchanged.
   3. "See pricing." was a link after the price; the price is set in Moldie in
      the strip now and the link came out with the panel.
   4. The fact labels are the file's keys, "Price line" shortened to "Price".
   5. THE SUB-SERVICE CARDS, 2026-09-16. Titles and icons are the user's.
      Each card's line is the matching "What you get" group text, cut to one
      sentence; where two cards share a group they take different parts of it.
      Nothing is added that the group text does not say.

   The old lists (1.1's sub-services) are gone from this page because the file
   replaces them: "What you get" is the founder's grouped version of the same
   offer. */

/* The data moved to `src/content/services.js`, 2026-09-24, because the
   pricing grid reads the same six items and calls: one source, two pages. */

export default function ServicesPage() {
  return (
    <Shell
      title="Services | VexelTech"
      path="/services"
      description="Branding, websites, marketing and automation. The four disciplines in full, from one team."
    >
      {/* The page's one highlighted word, 2026-09-24: `.hl`, tokens.css. */}
      <PageHead
        title={
          <>
            What we <Brush className="brush--hl" thickness="fit" angle={-2} at="52%">do</Brush>
          </>
        }
        lead="Four disciplines and one team. Not four agencies who don't talk to each other, and not four invoices."
      />

      {/* NOT INSIDE `Section`, 2026-09-23. (Since 2026-09-24 the cream
          disciplines are panels inside the measure, not bands, and `vt` on
          the section still holds.) Each discipline was a full-width
          band then, and `Section` wraps its children in `.pg__section-in`,
          which is the page measure plus the inset - so the bands were 1152
          wide at 1280 and a cream band stopped short of both edges. A band
          that does not reach the viewport edge is not a band. Each section
          carries its own `vt` and its own inset, which is the established
          pattern: `vt` goes on the SECTION, never on a page wrapper. */}
      <ServiceSections disciplines={DISCIPLINES} />


      {/* TALK TO US: the closing call. */}
      <CallBand
        heading="Which one is costing you most"
        note="Fifteen minutes on the phone and we'll tell you what we'd fix first. It isn't always the expensive one."
      />
    </Shell>
  );
}

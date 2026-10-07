import React, { useEffect } from 'react';
/* THE 24 PHOSPHOR IMPORTS AND THE `Icon` FIELDS ARE GONE, 2026-09-23. The
   sub-service cards came off with the band rebuild and nothing renders an
   icon on this page any more, but the imports stayed and the bundler kept
   bundling twenty-four icon components for markup that does not exist. An
   import that nothing renders is still shipped weight. The card `line` text
   is kept: it is the founder's copy from VEXELTECH-SERVICES-COPY.md and costs
   nothing but bytes of source. */
import Shell from './Shell.jsx';
import { PageHead, CallBand } from './parts.jsx';
import ServiceSections from './ServiceSections.jsx';
import { DISCIPLINES } from '../../content/services.js';
import { SUBSTANCE } from '../../content/substance.js';
import { setLd, AREA_SERVED, ORIGIN } from './head.js';
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

/* The eight questions, two per discipline in page order, as FAQPage data
   (head.js, 2026-10-05). */

export default function ServicesPage() {
  /* No FAQPage since final24 (2026-10-07): the page shows no questions. */
  /* THE SERVICES, one Service entry per discipline (final22), from the
     same list the page renders. */
  useEffect(
    () =>
      setLd('services', {
        '@graph': DISCIPLINES.map((d) => ({
          '@type': 'Service',
          name: d.name,
          description: d.promise,
          url: `${ORIGIN}/services#${d.id}`,
          areaServed: AREA_SERVED,
          provider: { '@id': `${ORIGIN}/#organization` },
        })),
      }),
    []
  );
  return (
    <Shell
      title="Small business website design and local SEO | VexelTech"
      path="/services"
      closingLine="Fifteen minutes on the phone and a written number within one business day."
      /* The closing section, "Ready when you are." and the form, since
         final34 (2026-10-08, the founder; no in-page form from the
         storytelling pass until then). */
      description="Website design, Google Business Profile and Google Ads management, Meta ads, missed-call text-back and booking automation for small businesses."
    >
      {/* COPY V3.1, 2026-10-01 (VEXELTECH-COPY.md, Services, and Metadata).
          The page's one highlight is "small business", the founder's pick
          (it was "contractors" in V3, "do" before that). */}
      <PageHead
        title={
          <>
            Website design, local SEO, ads and automation for{' '}
            <Brush className="brush--hl" thickness="fit" angle={-2} at="52%">small business</Brush>
          </>
        }
        lead="These are the four things we do. Start with the one that's costing you customers, and if we think it's a different one, we'll say so on the first call."
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
        heading="Which one is costing you most?"
        note="Fifteen minutes on the phone and a written number. Usually it's not the expensive one."
      />
    </Shell>
  );
}

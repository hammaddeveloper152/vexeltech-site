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
import '../../styles/services.css';

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

const DISCIPLINES = [
  {
    id: 'branding',
    name: 'Branding',
    promise:
      'The name people remember after the job is done. Drawn and shown to you before you owe anything.',
    cards: [
      { title: 'Logo design', line: 'Custom logo design, with 5 concepts on Basic or 8 on Advance.' },
      { title: 'Brand guidelines', line: 'A brand guideline so every future job looks like the same company.' },
      { title: 'Stationery kit', line: 'Business card, letterhead, envelope and email signature.' },
      { title: 'Social media kit', line: 'A social media kit with banners and cover profiles.' },
      { title: 'Colour variations', line: 'Colour variations of the mark.' },
      { title: 'Digital assets', line: 'A favicon and logo sizes for social.' },
    ],
    price: 'From $299. Advance at $449.',
    turnaround: '1 to 2 business days.',
    fit: "You have a business and no mark, or a mark you're not proud of.",
    call: { label: 'Get a custom quote', primary: true },
  },
  {
    id: 'websites',
    name: 'Websites',
    promise:
      'A site that sells while you sleep. Built for you rather than picked off a shelf, in four business days, with 30 days of maintenance and a dedicated team you can actually reach.',
    cards: [
      { title: 'Custom websites', line: 'Custom design up to 6 pages, mobile first, live on your own domain.' },
      { title: 'Ecommerce stores', line: 'Ecommerce stores, web apps and SaaS products.' },
      { title: 'UI and UX design', line: 'Custom UI and UX with SEO-friendly content.' },
      { title: 'Custom backend', line: 'A custom backend and CRM development.' },
      { title: 'Payment gateways', line: 'Payment gateway integration built into the site.' },
      { title: '30 days maintenance', line: "30 days of maintenance included, then it's a conversation, not a retainer." },
    ],
    price: '$700, one tier.',
    turnaround: '4 business days from the day we have your content.',
    fit: "You have no site, or a site nobody finds, or a site that doesn't ring the phone.",
    call: { label: 'Get a custom quote', primary: true },
  },
  {
    id: 'marketing',
    name: 'Marketing',
    promise:
      'Full stack marketing, pointed at one thing. Not impressions, not reach. Whether the phone rings.',
    cards: [
      { title: 'SEO and AEO', line: 'SEO and AEO, so the search that should find you finds you.' },
      { title: 'Google ads', line: 'Google ads run as performance marketing.' },
      { title: 'Meta ads', line: 'Meta ads pointed at lead generation.' },
      { title: 'Lead generation and CRO', line: 'CRO, so the clicks you pay for become calls.' },
      { title: 'Campaign management', line: 'Campaign management across your paid ads.' },
      { title: 'Social content and reels', line: 'Social media management, organic content creation and reels.' },
    ],
    price: 'Priced on the call, in writing before any work starts.',
    turnaround: 'Campaigns live within the first week after the page is ready.',
    fit: "You're spending on marketing and not getting the leads, or you've never spent and don't know where to start.",
    call: { label: 'Ask a question first', primary: false },
  },
  {
    id: 'automation',
    name: 'Automation',
    promise:
      'The jobs that eat your week, done without you. Complicated tasks made simple, and workflows that hold.',
    cards: [
      { title: 'Workflow automation', line: 'The repeated tasks run on their own.' },
      { title: 'AI agents', line: 'AI agents that answer, book and route, on your rules.' },
      { title: 'Chatbots', line: 'On your site and your channels, answering the questions you answer ten times a day.' },
      { title: 'Quotes and follow-ups', line: 'Quotes and follow-ups go out on their own.' },
      { title: 'Invoices and reminders', line: 'Invoices and reminders run on their own.' },
      { title: 'Booking and routing', line: 'AI agents that book and route, on your rules.' },
    ],
    price: 'Priced on the call, in writing before any work starts.',
    turnaround: 'Scoped per workflow on the call.',
    fit: 'You or your staff answer the same message, send the same quote, or chase the same invoice every day.',
    call: { label: 'Ask a question first', primary: false },
  },
];

export default function ServicesPage() {
  return (
    <Shell
      driftTo="#automation"
      title="Services | VexelTech"
      description="Branding, websites, marketing and automation. The four disciplines in full, from one team."
    >
      {/* The page's one highlighted word, 2026-09-24: `.hl`, tokens.css. */}
      <PageHead
        title={
          <>
            What we <span className="hl">do</span>
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


      {/* TALK TO US: the plain dark call. */}
      <CallBand
        heading="Which one is costing you most"
        note="Fifteen minutes on the phone and we'll tell you what we'd fix first. It isn't always the expensive one."
      />
    </Shell>
  );
}

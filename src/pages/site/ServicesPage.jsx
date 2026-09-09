import React from 'react';
import Shell from './Shell.jsx';
import { PageHead, Section, CallBand } from './parts.jsx';
import HeroSurface from '../../components/home/HeroSurface.jsx';
import ServicePlates from './ServicePlates.jsx';
/* Loaded after pages.css so it wins on ground, plate and slot. */
import '../../styles/services.css';

/* THE SERVICES PAGE. The four disciplines at full length.

   This is where content answer 1.1's lists belong. The homepage carries
   three per discipline because a pinned card at the statement size holds
   three lines and reads as a summary; a reader who wants the whole offer
   comes here, and here it is complete.

   EVERY ITEM IS THE USER'S. Sources per block:

   | Block      | Lists from        | Line from |
   |---|---|---|
   | Branding   | 1.1 and 2.1       | 2.1       |
   | Websites   | 1.1 and 2.2       | 2.2       |
   | Marketing  | 1.1               | 2.3       |
   | Automation | 1.1               | 2.4       |

   ---- Four edits to the source lists, all recorded ----------------------

   1. "Ecommerce stores" and "E commerce websites" are consecutive entries in
      1.1 and are the same offering spelled two ways. They are ONE item here.
      Shipping both would read as a mistake in the copy, and merging two
      spellings of one thing is normalisation, not invention.

   2. Capitalisation and spacing normalised: "Ui Ux Design" to "UI and UX
      design", "Saas Products" to "SaaS products", "Ai Agents" to "AI
      agents", "Chat bots" to "Chatbots", "Work Flow automations" to
      "Workflow automation". The words are the user's; only the shape of
      them moved. AEO is left as the acronym it was given as.

   3. The stationery detail from 2.1 is a sub-line under the stationery item
      rather than four more services, because that is what it is.

   4. THE WEBSITE TIMELINE IS FOUR BUSINESS DAYS, and it is in the websites
      block. It was held out of this page while 7.2's four business days and
      2.2 and 3.5's "within weeks" were unreconciled. The user settled it on
      2026-09-08 in favour of 7.2: four business days, and "within weeks" is
      not used anywhere on this site.

   ---- The asymmetry is the source's ------------------------------------

   Marketing has twelve items and automation has three. That is what 1.1
   gives, and padding automation to match would be inventing capabilities.
   The layout does not force a count. */

const DISCIPLINES = [
  {
    id: 'branding',
    name: 'Branding',
    line: 'The name people remember after the job is done. Drawn and shown to you before you owe anything.',
    items: [
      { t: 'Brand visuals and identity' },
      { t: 'Custom logo design' },
      { t: 'Brand creation' },
      { t: 'Brand guidelines' },
      {
        t: 'Stationery design',
        dt: 'Business cards, envelope design, email signature, letterhead design',
      },
      { t: 'Social media kit' },
      { t: 'Social media creative' },
      { t: 'Graphic design' },
      { t: 'Digital assets' },
    ],
  },
  {
    id: 'websites',
    name: 'Websites',
    line:
      "A site that sells while you sleep. Built for you rather than picked off a shelf, in four business days, with 30 days of maintenance and a dedicated team you can actually reach.",
    items: [
      { t: 'Custom websites' },
      { t: 'Web apps' },
      { t: 'Ecommerce stores and websites' },
      { t: 'UI and UX design' },
      { t: 'CRM development' },
      { t: 'SaaS products' },
      { t: 'Mobile applications' },
      { t: 'Maintenance' },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    line: 'Full stack marketing, pointed at one thing. Not impressions, not reach. Whether the phone rings.',
    items: [
      { t: 'SEO' },
      { t: 'AEO' },
      { t: 'Google ads' },
      { t: 'Meta ads' },
      { t: 'Paid ads' },
      { t: 'Campaign management' },
      { t: 'Performance marketing' },
      { t: 'CRO' },
      { t: 'Lead generation' },
      { t: 'Social media management' },
      { t: 'Organic content creation' },
      { t: 'Social media reels' },
    ],
  },
  {
    id: 'automation',
    name: 'Automation',
    line: 'The jobs that eat your week, done without you. Complicated tasks made simple, and workflows that hold.',
    items: [{ t: 'Workflow automation' }, { t: 'AI agents' }, { t: 'Chatbots' }],
  },
];

export default function ServicesPage() {
  return (
    <Shell
      title="Services | VexelTech"
      description="Branding, websites, marketing and automation. The four disciplines in full, from one team."
    >
      {/* THE SURFACE'S FOURTH MOUNT. 60% of the hero's height, same shader,
          same clamp, same mask and pause rules — only the box changes. See
          DESIGN.md: the surface is the brand's recurring device. */}
      <div className="svc__top">
        <HeroSurface className="svc__surface" />
        <div className="svc__top-in">
          <PageHead
            title="What we do"
            lead="Four disciplines and one team. Not four agencies who don't talk to each other, and not four invoices."
          />
        </div>
      </div>

      <Section labelledBy="disciplines-h" title={null}>
        <h2 className="skip-h" id="disciplines-h">
          The four disciplines
        </h2>
        {/* Four plates and a sticky index. Every word of every list is the
            same string it was; only the container around them changed. */}
        <ServicePlates disciplines={DISCIPLINES} />
      </Section>

      <CallBand
        heading="Which one is costing you most"
        note="Fifteen minutes on the phone and we'll tell you what we'd fix first. It isn't always the expensive one."
      />
    </Shell>
  );
}

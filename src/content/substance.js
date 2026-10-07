/* THE SUBSTANCE OF EACH DISCIPLINE ON /services (the founder's services
   substance pass, 2026-10-05, VEXELTECH-COPY.md V3.6). Verbatim, and
   written nowhere else. Each discipline section renders, under its list and
   price, a spec sheet and how it goes in four steps
   (components/story/Substance.jsx), behind "Details" since final24
   (2026-10-07). The two questions per discipline, and the page's FAQPage
   data built from them, are deleted (final24); they are marked off in
   VEXELTECH-COPY.md.

   Figures are tokens where the site already has one: Branding's first
   question names the Basic price.

   SPEC SHEETS KEEP THE FACTS, 2026-10-06 (the founder): the spec values
   are the founder's originals, with Speed and Forms in his later words.
   Where a value repeated a What you get line, the LIST line was reworded
   (content/services.js), never the value. */

import { FIGURES, money } from './pricing.js';

export const SUBSTANCE = {
  branding: {
    spec: [
      ['Concepts', 'Five on Basic, eight on Advance'],
      ['Revisions', 'Until you approve. No cap.'],
      ['Delivery', 'One to two business days'],
      ['Files', 'SVG, PNG, PDF and the source files'],
      ['Guidelines', 'Colour, type, spacing, in writing'],
      ['Stationery', 'Card, letterhead, envelope'],
      ['Social kit', 'Profile marks and covers, every platform (Advance)'],
      ['Ownership', 'Yours, in full, from day one'],
    ],
    steps: [
      ['Brief', 'Fifteen minutes on what you do, who buys it, and what the mark has to survive.'],
      ['Concepts', 'Five or eight directions in one to two business days, shown on a sign, a card and a screen.'],
      ['Refine', "You pick one. We tighten it until you'd put it on the truck."],
      ['Files', 'Every format, the guide, and a call to walk you through using them.'],
    ],
  },
  websites: {
    spec: [
      ['Pages', 'Six, structured around what you sell most'],
      ['Build', 'Four business days from your content'],
      ['Mobile', 'Built for the phone first, then the desk'],
      ['Speed', 'Loads fast on a phone on a weak signal'],
      ['Search', 'Titles, schema, sitemap, Google Business Profile connected'],
      ['Forms', 'Calls and forms traced back to the ad or search that caused them'],
      ['Maintenance', 'Thirty days after launch, included'],
      ['Ownership', 'Domain, hosting and code in your name'],
    ],
    steps: [
      ['Content in', 'Your services, photos of real work, and the things you say on the phone.'],
      ['Concepts', 'Day one. The home page and one inner page, on a phone and a desk.'],
      ['Build', 'Days two and three. Every page, every form, every call tracked.'],
      ['Live', 'Day four. On your domain, in your name, with thirty days of changes included.'],
    ],
  },
  marketing: {
    spec: [
      /* COPY V4.2 (2026-10-07, the founder): the noun stack. */
      ['Channels', 'Google search, maps and listings, Instagram and Facebook, AI answers, reviews. One plan, reported monthly.'],
      ['Search', 'Local SEO and AI search, service-area pages and citations'],
      ['Measured by', 'Cost per lead, reported monthly'],
      ['Creative', 'Built from your real work, not stock'],
      ['Pricing', 'On the call, in writing before anything runs'],
      ['Terms', 'Month to month'],
      ['Tracking', 'Every call and form tied to its source'],
      ['Start', 'Within two weeks of sign-off'],
    ],
    steps: [
      ['The call', 'Fifteen minutes on your area, your budget and what a customer is worth to you.'],
      ['The number', 'A written plan with the spend, the channels and the cost per lead we are aiming at.'],
      ['Live', 'Campaigns and tracking running within two weeks, with the landing page fixed first if it needs it.'],
      ['The report', 'Monthly. Spend, leads, cost per lead, and what we change next.'],
    ],
  },
  automation: {
    spec: [
      /* COPY V4.2 (2026-10-07, the founder): the noun stack. */
      ['Workflows', 'AI receptionist, online booking, quote and invoice follow-up, reminders, review requests.'],
      ['Response', 'Text back in under sixty seconds'],
      ['Tools', 'Works with the phone, calendar and invoicing you already use'],
      ['Pricing', 'Per workflow, in writing before work starts'],
      ['Setup', 'Most workflows live within two weeks'],
      ['Rules', 'Yours: what gets sent, when, and to whom'],
      ['Ownership', 'Accounts in your name'],
      ['Support', 'Changes to the words and timing included for thirty days'],
    ],
    steps: [
      ['Map it', 'We walk through what happens today when a call is missed, a quote goes out or a job ends.'],
      ['Write it', 'The exact messages, in your voice, with the timing. You approve every word.'],
      ['Connect it', 'Phone, calendar and invoicing linked. Tested with real calls before it goes live.'],
      ['Run it', 'It works while you do. You see every message in one thread.'],
    ],
  },
};

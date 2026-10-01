/* THE FOUR DISCIPLINES, as /services renders them: the founder's copy from
   VEXELTECH-SERVICES-COPY.md in the design repo. The edits to that file are
   recorded at the top of src/pages/site/ServicesPage.jsx. Moved here
   2026-09-24 so /pricing's grid reads the same six items and the same calls
   rather than a second copy of them. */

import { FIGURES, money } from './pricing.js';

/* COPY V3.1, 2026-10-01 (VEXELTECH-COPY.md, Services): the promises, the six
   items with their lines, the terms, the fit lines and the calls. `terms`
   is V3's Terms line, shown after "Terms:"; it replaced `price` and
   `turnaround`. Websites carries `bigger`, shown. (Its SEO line came off
   in the audit, 2026-10-02: the phrase lives in the title and the
   description only.) Each
   card's `line` shows under its title on /services (the structure pass).
   Figures are tokens.

   `image` (the five fixes, 2026-10-02): the discipline's EVIDENCE BAND, a
   real 16:10 image under its promise (components/story/EvidenceBand.jsx).
   null renders nothing and the section is list-only. Websites has the
   Zions Caregivers site's second screen (not a Recent work image: BUILD-LAW
   rule 0); Branding, Marketing and Automation wait for real material. */
export const DISCIPLINES = [
  {
    id: 'branding',
    name: 'Branding',
    promise: 'A mark that holds up on the sign, the invoice and the search result.',
    cards: [
      { title: 'Logo design', line: 'Five concepts on Basic, eight on Advance.' },
      { title: 'Brand guidelines', line: 'Colour, type and spacing, written down.' },
      { title: 'Stationery', line: 'Business card, letterhead, envelope, email signature.' },
      { title: 'Social kit', line: 'Profile marks, banners and covers, sized per platform. Advance.' },
      { title: 'Colour variations', line: 'Full colour, one colour, reversed. Advance.' },
      { title: 'Files', line: 'Every format your printer, sign shop and web team will ask for.' },
    ],
    terms: `Basic ${money(FIGURES.brandingBasic)}. Advance ${money(FIGURES.brandingAdvance)}. One to two business days.`,
    image: null,
    fit: "You're trading under a name with no mark, or a mark you wouldn't put on a sign.",
    call: { label: 'Get a custom quote', primary: true },
  },
  {
    id: 'websites',
    name: 'Websites',
    promise: 'A conversion-focused site for your business, live in four business days.',
    cards: [
      { title: 'Six pages', line: 'Home, services, about, reviews, contact and one more for what you sell most. Structured for your business.' },
      { title: 'Mobile-first', line: 'Click to call, enquiry form and booking link above the fold on a phone.' },
      { title: 'Speed', line: 'Core Web Vitals in the green. Fast pages rank and convert.' },
      { title: 'Local search', line: 'Titles, schema, sitemap and Google Business Profile connected.' },
      { title: 'Forms and tracking', line: 'Every call and form tracked to its source.' },
      { title: 'Thirty days of maintenance', line: 'Changes and fixes after launch, included.' },
    ],
    bigger: 'Stores, customer portals, custom backends and apps. Scoped and priced on the call.',
    terms: `${money(FIGURES.website)}, one price. Four business days from the day we have your content. Domain, hosting and code in your name.`,
    image: {
      src: '/work/band-websites.jpg',
      src720: '/work/band-websites-720.jpg',
      alt: 'The Zions Caregivers website, its second screen.',
    },
    fit: 'You have no site, a site nobody finds, or a site that gets traffic and no enquiries.',
    call: { label: 'Get a custom quote', primary: true },
  },
  {
    id: 'marketing',
    name: 'Marketing',
    promise: 'Campaigns measured in cost per lead, not impressions.',
    cards: [
      /* "The Map Pack." came off this line when it met the banned list
         (the founder, 2026-10-01; the copy file was changed to match). */
      { title: 'Google Business Profile', line: 'Optimisation, posts, photos, review requests and responses.' },
      { title: 'Local Service Ads', line: 'Google Guaranteed setup and management, pay per lead.' },
      { title: 'Google Ads', line: 'Search campaigns by service and area. Conversion tracking from day one.' },
      { title: 'Meta ads', line: 'Facebook and Instagram lead campaigns with creative from your real work.' },
      { title: 'Local SEO and AI search', line: 'Service-area pages, citations, and the content answer engines cite.' },
      { title: 'Reporting', line: 'Leads, cost per lead and booked customers, monthly, in plain language.' },
    ],
    terms: 'Priced on the call, in writing before anything runs. Month to month.',
    image: null,
    fit: "You're spending on ads and can't name your cost per lead, or you're ready to start and want it set up right.",
    call: { label: 'Ask a question', primary: false },
  },
  {
    id: 'automation',
    name: 'Automation',
    promise: "The follow-up that runs while you're on the job.",
    cards: [
      { title: 'Missed-call text-back', line: 'A text to every unanswered caller within sixty seconds, with a booking link.' },
      /* "from your template" came off this line when it met the banned
         list (the founder, 2026-10-01; the copy file was changed to match). */
      { title: 'Quote follow-up', line: "Quotes sent with a follow-up cadence until they're answered." },
      { title: 'Invoice reminders', line: 'Sent on completion, chased on schedule, paid online.' },
      { title: 'Online booking', line: 'Appointments land on the right calendar with the details attached.' },
      { title: 'Review requests', line: 'A request after every completed job or visit, routed to Google.' },
      { title: 'AI agents', line: 'Answer, qualify and book from your site and your channels, on your rules.' },
    ],
    terms: 'Priced per workflow, in writing before any work starts. Most workflows run within two weeks.',
    image: null,
    fit: 'Your team sends the same text, quote or reminder by hand every day.',
    call: { label: 'Ask a question', primary: false },
  },
];

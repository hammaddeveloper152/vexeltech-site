/* THE FOUR DISCIPLINES, as /services renders them: the founder's copy from
   VEXELTECH-SERVICES-COPY.md in the design repo. The edits to that file are
   recorded at the top of src/pages/site/ServicesPage.jsx. Moved here
   2026-09-24 so /pricing's grid reads the same six items and the same calls
   rather than a second copy of them. */

import { FIGURES, money } from './pricing.js';

/* COPY V3, 2026-10-01 (VEXELTECH-COPY.md, Services): the promises, the six
   items with their lines, the terms, the fit lines and the calls. `terms`
   is V3's Terms line, shown after "Terms:"; it replaced `price` and
   `turnaround`. Websites carries the trades line (`trades`, an H3 under the
   promise) and `bigger`, both shown. Figures are tokens. */
export const DISCIPLINES = [
  {
    id: 'branding',
    name: 'Branding',
    promise: 'A mark that holds up on the truck, the invoice and the search result.',
    cards: [
      { title: 'Logo design', line: 'Five concepts on Basic, eight on Advance.' },
      { title: 'Brand guidelines', line: 'Colour, type and spacing, written down.' },
      { title: 'Stationery', line: 'Business card, letterhead, envelope, email signature.' },
      { title: 'Social kit', line: 'Profile marks, banners and covers, sized per platform. Advance.' },
      { title: 'Colour variations', line: 'Full colour, one colour, reversed. Advance.' },
      { title: 'Files', line: 'Every format your printer, sign shop and web team will ask for.' },
    ],
    terms: `Basic ${money(FIGURES.brandingBasic)}. Advance ${money(FIGURES.brandingAdvance)}. One to two business days.`,
    fit: "You're quoting jobs under a name with no mark, or a mark you wouldn't put on a truck.",
    call: { label: 'Get a custom quote', primary: true },
  },
  {
    id: 'websites',
    name: 'Websites',
    promise: 'A conversion-focused site for your trade, live in four business days.',
    trades: 'Plumber, HVAC, electrician, roofing, cleaning, dental and contractor website design.',
    cards: [
      { title: 'Six pages', line: 'Home, services, service area, about, reviews, contact. Structured for your trade.' },
      { title: 'Mobile-first', line: 'Click to call, quote form and booking link above the fold on a phone.' },
      { title: 'Speed', line: 'Core Web Vitals in the green. Fast pages rank and convert.' },
      { title: 'Local search', line: 'Titles, schema, sitemap and Google Business Profile connected.' },
      { title: 'Forms and tracking', line: 'Every call and form tracked to its source.' },
      { title: 'Thirty days of maintenance', line: 'Changes and fixes after launch, included.' },
    ],
    bigger: 'Stores, customer portals, custom backends and apps. Scoped and priced on the call.',
    terms: `${money(FIGURES.website)}, one price. Four business days from the day we have your content. Domain, hosting and code in your name.`,
    fit: "You have no site, a site that isn't in the Map Pack, or a site that gets traffic and no calls.",
    call: { label: 'Get a custom quote', primary: true },
  },
  {
    id: 'marketing',
    name: 'Marketing',
    promise: 'Campaigns measured in cost per lead, not impressions.',
    cards: [
      { title: 'Google Business Profile', line: 'Optimisation, posts, photos, review requests and responses. The Map Pack.' },
      { title: 'Local Service Ads', line: 'Google Guaranteed setup and management, pay per lead.' },
      { title: 'Google Ads', line: 'Search campaigns by trade and zip code. Conversion tracking from day one.' },
      { title: 'Meta ads', line: 'Facebook and Instagram lead campaigns with creative from your real jobs.' },
      { title: 'Local SEO and AI search', line: 'Service-area pages, citations, and the content answer engines cite.' },
      { title: 'Reporting', line: 'Leads, cost per lead and booked jobs, monthly, in plain language.' },
    ],
    terms: 'Priced on the call, in writing before anything runs. Month to month.',
    fit: "You're spending on ads and can't name your cost per lead, or you're ready to start and want it set up right.",
    call: { label: 'Ask a question', primary: false },
  },
  {
    id: 'automation',
    name: 'Automation',
    promise: "The follow-up that runs while you're on the job.",
    cards: [
      { title: 'Missed-call text-back', line: 'A text to every unanswered caller within sixty seconds, with a booking link.' },
      { title: 'Quote follow-up', line: "Quotes sent from your template, with a follow-up cadence until they're answered." },
      { title: 'Invoice reminders', line: 'Sent on completion, chased on schedule, paid online.' },
      { title: 'Online booking', line: 'Jobs land on the right calendar with the address and notes.' },
      { title: 'Review requests', line: 'A request after every finished job, routed to Google.' },
      { title: 'AI agents', line: 'Answer, qualify and book from your site and your channels, on your rules.' },
    ],
    terms: 'Priced per workflow, in writing before any work starts. Most workflows run within two weeks.',
    fit: 'Your team sends the same text, quote or reminder by hand every day.',
    call: { label: 'Ask a question', primary: false },
  },
];

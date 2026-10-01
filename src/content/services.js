/* THE FOUR DISCIPLINES, as /services renders them: the founder's copy from
   VEXELTECH-SERVICES-COPY.md in the design repo. The edits to that file are
   recorded at the top of src/pages/site/ServicesPage.jsx. Moved here
   2026-09-24 so /pricing's grid reads the same six items and the same calls
   rather than a second copy of them. */

/* COPY V2, 2026-10-01 (VEXELTECH-COPY.md, Services). The page renders each
   card's title; the line under it is V2's and waits for the structure pass
   (DESIGN.md, COPY V2, the gap list), as does Websites' `bigger`. Prices are
   tokens: the page reads FIGURES, and `price` here is built from them. */
import { FIGURES, money } from './pricing.js';

export const DISCIPLINES = [
  {
    id: 'branding',
    name: 'Branding',
    promise:
      'The mark a customer remembers after the job is done, designed by hand and shown to you before you pay.',
    cards: [
      { title: 'Logo design', line: 'Five concepts on Basic, eight on Advance, each one drawn for your trade.' },
      { title: 'Brand guideline', line: 'Colours, type and spacing written down, so the van, the invoice and the site match.' },
      { title: 'Stationery', line: 'Business card, letterhead, envelope and email signature.' },
      { title: 'Social kit', line: 'Profile marks, banners and cover images sized for every platform (Advance).' },
      { title: 'Colour variations', line: 'The mark in full colour, one colour and reversed (Advance).' },
      { title: 'Files', line: 'Every format, including the ones your printer and your sign shop will ask for.' },
    ],
    price: `Basic ${money(FIGURES.brandingBasic)}. Advance ${money(FIGURES.brandingAdvance)}.`,
    turnaround: 'One to two business days.',
    fit: "You have a business and no mark, or a mark you're embarrassed to put on the truck.",
    call: { label: 'Get a custom quote', primary: true },
  },
  {
    id: 'websites',
    name: 'Websites',
    promise:
      'A site built for your business, live on your domain in four business days.',
    cards: [
      { title: 'Design', line: 'Up to six pages, laid out for your trade and your area, mobile first.' },
      { title: 'Built to last', line: 'Fast, secure and simple to update. No platform fee to keep it online.' },
      { title: 'Forms and calls', line: 'Quote and contact forms wired to your inbox, click to call, a booking link if you use one.' },
      { title: 'Search', line: 'Titles, descriptions, sitemap and your Google Business Profile connected, so the site is found.' },
      { title: 'Speed', line: 'Built to load in under two seconds on a phone, which Google rewards and callers notice.' },
      { title: 'Care', line: 'Thirty days of changes and maintenance after launch, included.' },
    ],
    bigger: 'Online stores, customer portals, custom backends and apps are scoped and priced on the call.',
    price: `${money(FIGURES.website)}, one price.`,
    turnaround: 'Four business days from the day we have your content.',
    fit: "You have no site, or a site nobody finds, or a site that looks like everyone else's.",
    call: { label: 'Get a custom quote', primary: true },
  },
  {
    id: 'marketing',
    name: 'Marketing',
    promise: 'Ads measured by one number, the calls they bring in.',
    cards: [
      { title: 'Landing page first', line: 'Ad spend goes to a page that converts before another dollar goes to ads.' },
      { title: 'Google ads', line: 'Search campaigns for the jobs you want, in the zip codes you serve.' },
      { title: 'Meta ads', line: 'Facebook and Instagram campaigns built for leads, with the creative made by us.' },
      { title: 'SEO and AI search', line: 'The work that gets you found in Google and in the answers people now ask AI for.' },
      { title: 'Tracking', line: 'Every call and form tied back to the ad that caused it, reported in plain language monthly.' },
      { title: 'Social content', line: 'Posts and reels from your real jobs, scheduled and managed.' },
    ],
    price: 'Priced on the call, in writing before anything runs. Month to month.',
    turnaround: 'Campaigns live within the first week after the page is ready.',
    fit: "You're spending on ads and can't say what they returned, or you've never spent and want to start right.",
    call: { label: 'Ask a question', primary: false },
  },
  {
    id: 'automation',
    name: 'Automation',
    promise: 'The jobs that eat your week, done without you.',
    cards: [
      { title: 'Missed call text back', line: "A caller you couldn't answer gets a text in under a minute, with a way to book." },
      { title: 'Quotes and follow-ups', line: 'Quotes go out from a template you approve, and chase themselves until answered.' },
      { title: 'Invoices and reminders', line: 'Sent on completion, reminded on schedule, paid online.' },
      { title: 'Booking and routing', line: 'Jobs land on the right calendar, the right person, with the address and the notes.' },
      { title: 'AI agents', line: 'Answer the questions you answer ten times a day, on your site and your channels, on your rules.' },
      { title: 'Workflows', line: 'The tools you already use, connected so nobody retypes anything.' },
    ],
    price: 'Priced on the call, in writing before any work starts.',
    turnaround: 'Scoped per workflow. Most run within two weeks.',
    fit: 'You or your staff send the same message, quote or reminder every day by hand.',
    call: { label: 'Ask a question', primary: false },
  },
];

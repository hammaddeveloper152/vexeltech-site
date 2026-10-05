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
   null renders nothing and the section is list-only. An image is `{ src,
   src720, alt }`, one 16:10 image. `phones` (the six fixes, 2026-10-02):
   phone captures in device frames (components/story/DevicePhones.jsx);
   Websites has three (a phone capture and a desktop capture of the same
   site are different images under BUILD-LAW rule 0).

   `proof` (the final pass, 2026-10-03): the band the other three carry
   above their lists, one object each: 'brand' (artifacts/BrandYouType,
   the visitor's own name made into a brand), 'ads' (artifacts/SearchToCall,
   a search to a call for "Your business") and 'textback'
   (final/TextBackBand, the missed-call thread). Since final7 (2026-10-03)
   neither stage carries a client name or capture, so Baseline's phone is
   back in the Websites band, first. The founder left the third phone to
   us: OneSix stays and Zions Caregivers came out, because OneSix's first
   screen is the cleaner capture and Zions' is mostly two photographed
   faces. */
export const DISCIPLINES = [
  {
    id: 'branding',
    name: 'Branding',
    promise: 'A mark that holds up on the sign, the invoice and the search result.',
    cards: [
      { title: 'Logo design', line: 'Real directions to choose between, so the mark you keep is one you picked.' },
      { title: 'Brand guidelines', line: 'Your printer, sign shop and web team all apply the mark the same way.' },
      { title: 'Stationery', line: 'Every card, letter and envelope you send carries the same mark.' },
      { title: 'Social kit', line: 'On Advance, your business looks the same wherever people follow you.' },
      { title: 'Colour variations', line: 'Full colour, one colour, reversed. Advance.' },
      { title: 'Files', line: 'Every format your printer, sign shop and web team will ask for.' },
    ],
    terms: `Basic ${money(FIGURES.brandingBasic)}. Advance ${money(FIGURES.brandingAdvance)}. One to two business days.`,
    image: null,
    proof: 'brand',
    fit: "You're trading under a name with no mark, or a mark you wouldn't put on a sign.",
    call: { label: 'Get a custom quote', primary: true },
  },
  {
    id: 'websites',
    name: 'Websites',
    promise: 'A conversion-focused site for your business, live in four business days.',
    cards: [
      { title: 'Six pages', line: 'Every page a customer checks before they call, and one that sells your best seller.' },
      { title: 'Mobile-first', line: 'Click to call, enquiry form and booking link above the fold on a phone.' },
      { title: 'Speed', line: 'Core Web Vitals in the green. Fast pages rank and convert.' },
      { title: 'Local search', line: 'People searching nearby for what you do can find you.' },
      { title: 'Forms and tracking', line: 'You know which of your marketing is paying for itself.' },
      { title: 'Thirty days of maintenance', line: 'You are covered for a month after launch while the site settles in.' },
    ],
    bigger: 'Stores, customer portals, custom backends and apps. Scoped and priced on the call.',
    terms: `${money(FIGURES.website)}, one price. Four business days from the day we have your content. Domain, hosting and code in your name.`,
    image: null,
    phones: [
      { src: '/work/baseline-books-phone.jpg', alt: 'The Baseline Bookkeeping website on a phone.' },
      { src: '/work/onesix-phone.jpg', alt: 'The OneSix website on a phone.' },
      { src: '/work/artiora-phone.jpg', alt: 'The ARTIORA Luxury Villa website on a phone.' },
    ],
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
      { title: 'Meta ads', line: 'Facebook and Instagram campaigns that show the work people would be buying.' },
      { title: 'Local SEO and AI search', line: 'Found when nearby customers search, and named when AI tools answer.' },
      { title: 'Reporting', line: 'Every month you know what your spend brought in, in plain language.' },
    ],
    terms: 'Priced on the call, in writing before anything runs. Month to month.',
    image: null,
    proof: 'ads',
    fit: "You're spending on ads and can't name your cost per lead, or you're ready to start and want it set up right.",
    call: { label: 'Ask a question', primary: false },
  },
  {
    id: 'automation',
    name: 'Automation',
    promise: "The follow-up that runs while you're on the job.",
    cards: [
      { title: 'Missed-call text-back', line: 'The caller you missed gets a reply and a way to book before they ring someone else.' },
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
    proof: 'textback',
    fit: 'Your team sends the same text, quote or reminder by hand every day.',
    call: { label: 'Ask a question', primary: false },
  },
];

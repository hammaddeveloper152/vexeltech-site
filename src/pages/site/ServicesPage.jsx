import React from 'react';
import {
  Browser,
  CalendarCheck,
  Cards,
  ChartLineUp,
  ChatCircle,
  CreditCard,
  Database,
  Envelope,
  FilmSlate,
  Gear,
  GoogleLogo,
  Image,
  Layout,
  MagnifyingGlass,
  Megaphone,
  MetaLogo,
  Palette,
  PenNib,
  Receipt,
  Robot,
  ShareNetwork,
  ShoppingCart,
  Swatches,
  Wrench,
} from '@phosphor-icons/react';
import Shell from './Shell.jsx';
import { PageHead, Section, CallBand } from './parts.jsx';
import ServiceSections from './ServiceSections.jsx';
import '../../styles/services.css';

/* THE SERVICES PAGE, REBUILT 2026-09-15. Four discipline SECTIONS, not plates.

   ALL COPY IS THE FOUNDER'S, from VEXELTECH-SERVICES-COPY.md in the design
   repo, which says every fact in it already appears on /pricing or in the FAQ.
   Each section has the same five parts in the file's order: name and promise,
   the tile, what you get (grouped), how it goes (numbered), and the facts with
   a call.

   ---- Edits to the file, all recorded ------------------------------------

   1. The text after each group title is capitalised: "The mark: custom logo
      design" is a group title "The mark" over "Custom logo design, ...". Only
      the first letter moved, the same normalisation the page's old lists took.
   2. Each step's first sentence is its title: "A call." is set apart from the
      rest of the step. The words are unchanged.
   3. "See pricing." on the price lines of Branding and Websites is a link to
      /pricing. Marketing and Automation have no such line in the file.
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
    get: [
      { g: 'The mark', t: 'Custom logo design, 5 concepts (Basic) or 8 (Advance), colour variations, logo sizes for social.' },
      { g: 'The rules', t: 'A brand guideline so every future job looks like the same company.' },
      { g: 'The kit', t: 'Business card, letterhead, envelope, email signature, favicon; social media kit, banners and cover profiles.' },
    ],
    cards: [
      { Icon: PenNib, title: 'Logo design', line: 'Custom logo design, with 5 concepts on Basic or 8 on Advance.' },
      { Icon: Palette, title: 'Brand guidelines', line: 'A brand guideline so every future job looks like the same company.' },
      { Icon: Cards, title: 'Stationery kit', line: 'Business card, letterhead, envelope and email signature.' },
      { Icon: ShareNetwork, title: 'Social media kit', line: 'A social media kit with banners and cover profiles.' },
      { Icon: Swatches, title: 'Colour variations', line: 'Colour variations of the mark.' },
      { Icon: Image, title: 'Digital assets', line: 'A favicon and logo sizes for social.' },
    ],
    steps: [
      ['A call.', 'You tell us the business, the customers, and what already exists that has to survive.'],
      ['Concepts.', 'You see five or eight directions, drawn, before anything is paid for.'],
      ['Revisions.', 'Unlimited until you say stop.'],
      ['Files.', 'Every format, delivered in one or two business days depending on package.'],
    ],
    price: 'From $299. Advance at $449.',
    pricing: true,
    turnaround: '1 to 2 business days.',
    fit: "You have a business and no mark, or a mark you're not proud of.",
    notFit: "You want a template with your name typed in. We don't make those.",
    call: { label: 'Get a custom quote', primary: true },
  },
  {
    id: 'websites',
    name: 'Websites',
    promise:
      'A site that sells while you sleep. Built for you rather than picked off a shelf, in four business days, with 30 days of maintenance and a dedicated team you can actually reach.',
    get: [
      { g: 'The build', t: 'Custom design up to 6 pages, custom UI and UX, custom backend, payment gateway integration.' },
      { g: 'The reach', t: 'SEO-friendly content, mobile first, live on your own domain.' },
      { g: 'The cover', t: "30 days of maintenance included, then it's a conversation, not a retainer." },
      { g: 'Also', t: 'Web apps, ecommerce stores, CRM development, SaaS products, mobile applications.' },
    ],
    cards: [
      { Icon: Browser, title: 'Custom websites', line: 'Custom design up to 6 pages, mobile first, live on your own domain.' },
      { Icon: ShoppingCart, title: 'Ecommerce stores', line: 'Ecommerce stores, web apps and SaaS products.' },
      { Icon: Layout, title: 'UI and UX design', line: 'Custom UI and UX with SEO-friendly content.' },
      { Icon: Database, title: 'Custom backend', line: 'A custom backend and CRM development.' },
      { Icon: CreditCard, title: 'Payment gateways', line: 'Payment gateway integration built into the site.' },
      { Icon: Wrench, title: '30 days maintenance', line: "30 days of maintenance included, then it's a conversation, not a retainer." },
    ],
    steps: [
      ['A call.', 'Pages, what the site connects to (booking, payments, CRM, forms), where visitors come from.'],
      ['Design.', 'UI and UX first, shown to you.'],
      ['Build and test.', 'Four business days. You look at it and tell us what to change, as many times as it takes.'],
      ['Handover.', 'It moves to your hosting. Files, domain, credentials and code under your name.'],
    ],
    price: '$700, one tier.',
    pricing: true,
    turnaround: '4 business days from the day we have your content.',
    fit: "You have no site, or a site nobody finds, or a site that doesn't ring the phone.",
    notFit: "You want to keep paying monthly for something you don't own.",
    call: { label: 'Get a custom quote', primary: true },
  },
  {
    id: 'marketing',
    name: 'Marketing',
    promise:
      'Full stack marketing, pointed at one thing. Not impressions, not reach. Whether the phone rings.',
    get: [
      { g: 'Search', t: 'SEO and AEO, so the search that should find you finds you.' },
      { g: 'Paid', t: 'Google ads, Meta ads, campaign management, performance marketing, lead generation.' },
      { g: 'Conversion', t: 'CRO, so the clicks you pay for become calls.' },
      { g: 'Social', t: 'Social media management, organic content creation, reels.' },
    ],
    cards: [
      { Icon: MagnifyingGlass, title: 'SEO and AEO', line: 'SEO and AEO, so the search that should find you finds you.' },
      { Icon: GoogleLogo, title: 'Google ads', line: 'Google ads run as performance marketing.' },
      { Icon: MetaLogo, title: 'Meta ads', line: 'Meta ads pointed at lead generation.' },
      { Icon: ChartLineUp, title: 'Lead generation and CRO', line: 'CRO, so the clicks you pay for become calls.' },
      { Icon: Megaphone, title: 'Campaign management', line: 'Campaign management across your paid ads.' },
      { Icon: FilmSlate, title: 'Social content and reels', line: 'Social media management, organic content creation and reels.' },
    ],
    steps: [
      ['A call.', "Your market, who you're up against, the monthly budget range, what's been tried and what it returned."],
      ['The page first.', 'Ad spend goes to a page that converts before another dollar goes to ads.'],
      ['Launch and measure.', 'Campaigns run, numbers reported in plain language.'],
      ['Adjust.', "What works gets more; what doesn't gets cut."],
    ],
    price: 'Priced on the call, in writing before any work starts.',
    pricing: false,
    turnaround: 'Campaigns live within the first week after the page is ready.',
    fit: "You're spending on marketing and not getting the leads, or you've never spent and don't know where to start.",
    notFit: 'You want impressions on a report and nothing else.',
    call: { label: 'Ask a question first', primary: false },
  },
  {
    id: 'automation',
    name: 'Automation',
    promise:
      'The jobs that eat your week, done without you. Complicated tasks made simple, and workflows that hold.',
    get: [
      { g: 'Workflows', t: 'The repeated tasks (quotes, follow-ups, invoices, reminders) run on their own.' },
      { g: 'Agents', t: 'AI agents that answer, book, and route, on your rules.' },
      { g: 'Chatbots', t: 'On your site and your channels, answering the questions you answer ten times a day.' },
    ],
    cards: [
      { Icon: Gear, title: 'Workflow automation', line: 'The repeated tasks run on their own.' },
      { Icon: Robot, title: 'AI agents', line: 'AI agents that answer, book and route, on your rules.' },
      { Icon: ChatCircle, title: 'Chatbots', line: 'On your site and your channels, answering the questions you answer ten times a day.' },
      { Icon: Envelope, title: 'Quotes and follow-ups', line: 'Quotes and follow-ups go out on their own.' },
      { Icon: Receipt, title: 'Invoices and reminders', line: 'Invoices and reminders run on their own.' },
      { Icon: CalendarCheck, title: 'Booking and routing', line: 'AI agents that book and route, on your rules.' },
    ],
    steps: [
      ['A call.', 'The tools you already use, the workflow that eats the most hours each week, the volume it has to handle.'],
      ['Map it.', 'We draw the workflow before we build it, and you approve the drawing.'],
      ['Build and test.', 'It runs alongside you first, then without you.'],
      ['Handover.', 'Documented, under your accounts, yours.'],
    ],
    price: 'Priced on the call, in writing before any work starts.',
    pricing: false,
    turnaround: 'Scoped per workflow on the call.',
    fit: 'You or your staff answer the same message, send the same quote, or chase the same invoice every day.',
    notFit: 'The job changes every time. Automation needs a pattern.',
    call: { label: 'Ask a question first', primary: false },
  },
];

export default function ServicesPage() {
  return (
    <Shell
      title="Services | VexelTech"
      description="Branding, websites, marketing and automation. The four disciplines in full, from one team."
    >
      <PageHead
        title="What we do"
        lead="Four disciplines and one team. Not four agencies who don't talk to each other, and not four invoices."
      />

      <Section title={null}>
        <ServiceSections disciplines={DISCIPLINES} />
      </Section>

      <CallBand
        heading="Which one is costing you most"
        note="Fifteen minutes on the phone and we'll tell you what we'd fix first. It isn't always the expensive one."
      />
    </Shell>
  );
}

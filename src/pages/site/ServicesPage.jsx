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
import RouteBand from '../../components/site/RouteBand.jsx';
import '../../styles/services.css';

/* THE SERVICES PAGE, REBUILT 2026-09-15. Four discipline SECTIONS, not plates.

   ALL COPY IS THE FOUNDER'S, from VEXELTECH-SERVICES-COPY.md in the design
   repo, which says every fact in it already appears on /pricing or in the FAQ.
   Each section has three parts: name and promise, the sub-service cards, and
   one strip with the price, the turnaround, the fit line and the call.

   2026-09-21, by the user: the three-column block (what you get, how it
   goes, the facts) is gone from every section. "How it goes" is one route
   band at the foot of the page, "How every project runs", the route as on
   About. The per-discipline steps, "What you get" groups and "Not a fit if"
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
      { Icon: PenNib, title: 'Logo design', line: 'Custom logo design, with 5 concepts on Basic or 8 on Advance.' },
      { Icon: Palette, title: 'Brand guidelines', line: 'A brand guideline so every future job looks like the same company.' },
      { Icon: Cards, title: 'Stationery kit', line: 'Business card, letterhead, envelope and email signature.' },
      { Icon: ShareNetwork, title: 'Social media kit', line: 'A social media kit with banners and cover profiles.' },
      { Icon: Swatches, title: 'Colour variations', line: 'Colour variations of the mark.' },
      { Icon: Image, title: 'Digital assets', line: 'A favicon and logo sizes for social.' },
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
      { Icon: Browser, title: 'Custom websites', line: 'Custom design up to 6 pages, mobile first, live on your own domain.' },
      { Icon: ShoppingCart, title: 'Ecommerce stores', line: 'Ecommerce stores, web apps and SaaS products.' },
      { Icon: Layout, title: 'UI and UX design', line: 'Custom UI and UX with SEO-friendly content.' },
      { Icon: Database, title: 'Custom backend', line: 'A custom backend and CRM development.' },
      { Icon: CreditCard, title: 'Payment gateways', line: 'Payment gateway integration built into the site.' },
      { Icon: Wrench, title: '30 days maintenance', line: "30 days of maintenance included, then it's a conversation, not a retainer." },
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
      { Icon: MagnifyingGlass, title: 'SEO and AEO', line: 'SEO and AEO, so the search that should find you finds you.' },
      { Icon: GoogleLogo, title: 'Google ads', line: 'Google ads run as performance marketing.' },
      { Icon: MetaLogo, title: 'Meta ads', line: 'Meta ads pointed at lead generation.' },
      { Icon: ChartLineUp, title: 'Lead generation and CRO', line: 'CRO, so the clicks you pay for become calls.' },
      { Icon: Megaphone, title: 'Campaign management', line: 'Campaign management across your paid ads.' },
      { Icon: FilmSlate, title: 'Social content and reels', line: 'Social media management, organic content creation and reels.' },
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
      { Icon: Gear, title: 'Workflow automation', line: 'The repeated tasks run on their own.' },
      { Icon: Robot, title: 'AI agents', line: 'AI agents that answer, book and route, on your rules.' },
      { Icon: ChatCircle, title: 'Chatbots', line: 'On your site and your channels, answering the questions you answer ten times a day.' },
      { Icon: Envelope, title: 'Quotes and follow-ups', line: 'Quotes and follow-ups go out on their own.' },
      { Icon: Receipt, title: 'Invoices and reminders', line: 'Invoices and reminders run on their own.' },
      { Icon: CalendarCheck, title: 'Booking and routing', line: 'AI agents that book and route, on your rules.' },
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

      {/* HOW EVERY PROJECT RUNS, 2026-09-21: the route as on About, once for
          the page, before the call. */}
      <RouteBand id="svc-route-h" heading="How every project runs" cast={{ pose: 3, at: 2 }} />

      {/* TALK TO US: the plain dark call, P2 on the phone at its right. */}
      <CallBand
        cast={2}
        heading="Which one is costing you most"
        note="Fifteen minutes on the phone and we'll tell you what we'd fix first. It isn't always the expensive one."
      />
    </Shell>
  );
}

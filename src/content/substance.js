/* THE SUBSTANCE OF EACH DISCIPLINE ON /services (the founder's services
   substance pass, 2026-10-05, VEXELTECH-COPY.md V3.6). Verbatim, and
   written nowhere else. Each discipline section renders, under its list and
   price, a spec sheet, how it goes in four steps, and two questions
   (components/story/Substance.jsx). The two questions also feed the page's
   FAQPage structured data (head.js), so the answers here are exactly the
   answers on the page.

   Figures are tokens where the site already has one: Branding's first
   question names the Basic price. */

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
    questions: [
      {
        id: 'cheap',
        q: `What makes a ${money(FIGURES.brandingBasic)} logo different from a $29 one?`,
        a: 'Time and judgement. The cheap one is a template with your name typed in. Ours starts from what you do and who buys it, is tested on a sign and a card before you see it, and comes with the files and the rules to use it for ten years.',
      },
      {
        id: 'own',
        q: 'Will I own it outright?',
        a: 'Yes. Source files, every export and the guide are yours when the invoice is paid. No licence, no renewal, no fine print.',
      },
    ],
  },
  websites: {
    spec: [
      ['Pages', 'Six, structured around what you sell most'],
      ['Build', 'Four business days from your content'],
      ['Mobile', 'Built for the phone first, then the desk'],
      ['Speed', 'Core Web Vitals in the green'],
      ['Search', 'Titles, schema, sitemap, Google Business Profile connected'],
      ['Forms', 'Every call and form tracked to its source'],
      ['Maintenance', 'Thirty days after launch, included'],
      ['Ownership', 'Domain, hosting and code in your name'],
    ],
    steps: [
      ['Content in', 'Your services, photos of real work, and the things you say on the phone.'],
      ['Concepts', 'Day one. The home page and one inner page, on a phone and a desk.'],
      ['Build', 'Days two and three. Every page, every form, every call tracked.'],
      ['Live', 'Day four. On your domain, in your name, with thirty days of changes included.'],
    ],
    questions: [
      {
        id: 'six',
        q: 'Why six pages?',
        a: 'Because that is what a small business needs to be found and trusted: home, services, about, reviews, contact, and one page for the thing you sell most. Need more? Each extra page is scoped and priced before we build it.',
      },
      {
        id: 'update',
        q: 'Can I update it myself?',
        a: 'Yes. Text, photos and prices are editable without us. For bigger changes, call; small jobs are priced small.',
      },
    ],
  },
  marketing: {
    spec: [
      ['Channels', 'Google Business Profile, Local Service Ads, Google Ads, Meta ads'],
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
    questions: [
      {
        id: 'soon',
        q: 'How soon will the phone ring?',
        a: 'Ads can bring calls in the first week. Local search takes longer, usually a few months to move. We tell you which is which before you spend a dollar.',
      },
      {
        id: 'cpl',
        q: 'What if the cost per lead is too high?',
        a: 'Then we change something: the page, the offer, the area or the channel. If nothing moves it in two months, we say so and stop. You are not paying for a retainer.',
      },
    ],
  },
  automation: {
    spec: [
      ['Workflows', 'Missed-call text-back, quote follow-up, invoice reminders, booking, review requests, AI agents'],
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
    questions: [
      {
        id: 'robot',
        q: 'Will it sound like a robot?',
        a: "No. Every message is written with you, in the words you already use, and you approve each one before it sends. Customers reply to a person's voice, not a system's.",
      },
      {
        id: 'human',
        q: 'What if a customer wants a human?',
        a: 'They get one. Every workflow hands off to you or your team the moment someone asks, and you see the whole thread when you pick up.',
      },
    ],
  },
};

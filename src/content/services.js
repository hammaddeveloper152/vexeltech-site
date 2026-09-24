/* THE FOUR DISCIPLINES, as /services renders them: the founder's copy from
   VEXELTECH-SERVICES-COPY.md in the design repo. The edits to that file are
   recorded at the top of src/pages/site/ServicesPage.jsx. Moved here
   2026-09-24 so /pricing's grid reads the same six items and the same calls
   rather than a second copy of them. */

export const DISCIPLINES = [
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
      { title: 'SEO and AI search', line: 'SEO and AI search, so the search that should find you finds you.' },
      { title: 'Google ads', line: 'Google ads run as performance marketing.' },
      { title: 'Meta ads', line: 'Meta ads pointed at lead generation.' },
      { title: 'Lead generation and CRO', line: 'CRO, so the clicks you pay for become calls.' },
      { title: 'Campaign management', line: 'Campaign management across your paid ads.' },
      { title: 'Social content and reels', line: 'Social media management, organic content creation and reels.' },
    ],
    price: 'Priced on the call, in writing before any work starts.',
    turnaround: 'Campaigns live within the first week after the page is ready.',
    fit: "You're spending on marketing and not getting the leads, or you've never spent and don't know where to start.",
    call: { label: 'Ask a question', primary: false },
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
    call: { label: 'Ask a question', primary: false },
  },
];

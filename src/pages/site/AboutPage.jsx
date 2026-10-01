import React from 'react';
import Shell from './Shell.jsx';
import Brush from '../../components/site/Brush.jsx';
import RouteBand from '../../components/site/RouteBand.jsx';
import Services from '../../components/home/Services.jsx';
import Faq from '../../components/home/Faq.jsx';
import { CallBand } from './parts.jsx';
import { FIGURES, money } from '../../content/pricing.js';
import '../../styles/aboutpage.css';
import '../../styles/light.css';

/* THE ABOUT PAGE. The statement, then V3.1's sections, built in the
   structure pass (2026-10-01, the founder) from components that already
   exist, in the brief's order:

     1  Where we come from        RouteBand, three stops, still
     2  What we build it around   home's discipline cards (Services.jsx)
     3  Who we are for            two cream cards, A fit and Not a fit
     4  How we work with you      RouteBand, four stops, still
     5  Key facts                 hairline rows, the mono label left
     6  Questions                 the FAQ accordion, four questions
     7  The closing call          CallBand

   THE LIGHT PAGE since the three-colour pass (2026-09-25): a cream ground
   for the whole route (Shell's `light`, light.css), where each of these
   components takes its light-ground colours. The footer block closes the
   page without the form (Shell's `footerForm={false}`).

   EVERY LINE IS VEXELTECH-COPY.md V3.1's, About us. The figures in Key
   facts are tokens. The page's earlier shapes are in git and DESIGN.md. */

const EMAIL = 'info@vexeltechsolutions.com';
const PHONE = '(385) 284-3265';
const PHONE_HREF = 'tel:+13852843265';

const ORIGIN_STOPS = [
  ['01', 'The ads.'],
  ['02', 'The build.'],
  ['03', 'The whole thing.'],
];
const ORIGIN_LINES = [
  'We started as a paid media team running Google and Meta campaigns for small businesses. Most of the spend died on the page after the click.',
  'So we built the pages, then the whole site, then the follow-up that runs after the call.',
  "VexelTech, 2026. Branding, website, marketing and automation from one team at flat prices, for businesses that can't carry four vendors.",
];

const AROUND = {
  branding: "A customer decides if you're real in ten seconds. The mark does that before you speak.",
  websites: 'People scan for a number, a price and a reason to trust you. All three above the fold.',
  marketing: 'An ad is only as good as the page after the click and the phone after the page.',
  automation: 'A missed call answered by text in sixty seconds is still a customer.',
};

const FIT = [
  {
    id: 'fit',
    label: 'A fit',
    line: 'Owner-run businesses, one to fifty people. Contractors, clinics, real estate, bookkeeping, hospitality, consultancies, local retail. You answer your own phone, or you want to stop having to.',
  },
  {
    id: 'not',
    label: 'Not a fit',
    line: 'Agencies wanting white-label work. Startups raising a round. Anyone who wants a retainer instead of a result.',
  },
];

const WORK_STOPS = [
  ['01', 'One person.'],
  ['02', 'Approval first.'],
  ['03', 'Ownership.'],
  ['04', 'Thirty days.'],
];
const WORK_LINES = [
  'A name and a US number, on your account from the first call.',
  'Concepts, then the build, then the invoice.',
  'Domain, hosting, code and credentials in your name from day one.',
  'Maintenance included after launch. After that, you call us when you need us.',
];

const FACTS = [
  ['Company', 'VexelTech Solutions'],
  ['Work', 'Website design, branding, local SEO and ads, automation for US small businesses'],
  ['Founded', '2026'],
  [
    'Serves',
    'Owner-run businesses across the US. Recent work spans real estate, bookkeeping, care services, hospitality, consulting and technology',
  ],
  [
    'Terms',
    `Website ${money(FIGURES.website)} flat, branding ${money(FIGURES.brandingBasic)} or ${money(FIGURES.brandingAdvance)}, marketing and automation by quote`,
  ],
  ['Turnaround', 'Branding one to two business days, website four business days'],
  ['Ownership', "Domain, hosting, code and credentials in the client's name"],
  [
    'Contact',
    <>
      <a className="ab3-facts__a" href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>
      ,{' '}
      <a className="ab3-facts__a" href={PHONE_HREF}>
        {PHONE}
      </a>
    </>,
  ],
];

const QUESTIONS = [
  {
    id: 'us',
    q: 'Do you work outside the US?',
    a: 'No. The copy, the ad targeting and the hours are built for US customers.',
  },
  {
    id: 'industry',
    q: 'Do you work with my industry?',
    a: 'If customers search for what you do, yes. Recent work spans real estate, bookkeeping, care services, hospitality, consulting and technology.',
  },
  {
    id: 'concepts',
    q: "What if I don't like the first concepts?",
    a: 'Say so and we go again. Nothing is billed before approval.',
  },
  {
    id: 'takeover',
    q: 'Can you take over a site someone else built?',
    a: "If you own the domain and the files, yes. If you don't, the first job is getting them into your name.",
  },
];

export default function AboutPage() {
  return (
    <Shell
      title="About VexelTech: websites, ads and automation for small business"
      path="/about-us"
      description="One team for the website, the campaigns and the follow-up behind US small businesses. Flat prices, four-day builds, everything in your name."
      footerForm={false}
      light
    >
      {/* THE STATEMENT. */}
      <section className="vt ab3-hero" aria-labelledby="ab3-hero-h">
        <div className="ab3__in">
          <h1 className="ab3-hero__h" id="ab3-hero-h">
            {/* COPY V3.1, 2026-10-01. The page's one highlighted word, the
                swash (Brush.jsx), is "called." (it was "phone" before V3). */}
            Found, trusted,{' '}
            <Brush className="brush--hl" thickness="fit" angle={-2} at="52%">
              called.
            </Brush>
          </h1>
          <div className="ab3-hero__cols">
            <p className="ab3-hero__p">
              The site a customer lands on, the campaigns that send them there, and the follow-up
              that catches the call. One team builds all three.
            </p>
          </div>
        </div>
      </section>

      {/* 1. WHERE WE COME FROM. Home's route, three stops, drawn. */}
      <RouteBand id="ab3-from-h" heading="Where we come from" stops={ORIGIN_STOPS} lines={ORIGIN_LINES} still />

      {/* 2. WHAT WE BUILD IT AROUND. Home's four discipline cards, in their
             colours, with About's line on each and no lead. */}
      <Services id="ab3-around-h" heading="What we build it around" lead={null} lines={AROUND} />

      {/* 3. WHO WE ARE FOR. Two cream cards, side by side from 768. */}
      <section className="vt ab3-fit" aria-labelledby="ab3-fit-h">
        <div className="ab3__in">
          <h2 className="ab3-sec__h" id="ab3-fit-h">
            Who we are for
          </h2>
          <div className="ab3-fit__cards">
            {FIT.map(({ id, label, line }) => (
              <div className="ab3-fit__card" key={id}>
                <h3 className="ab3-fit__k lbl">{label}</h3>
                <p className="ab3-fit__p">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW WE WORK WITH YOU. The same route, four stops. */}
      <RouteBand id="ab3-work-h" heading="How we work with you" stops={WORK_STOPS} lines={WORK_LINES} still />

      {/* 5. KEY FACTS. Hairline rows, the label in mono on the left. */}
      <section className="vt ab3-facts" aria-labelledby="ab3-facts-h">
        <div className="ab3__in">
          <h2 className="ab3-sec__h" id="ab3-facts-h">
            Key facts
          </h2>
          <dl className="ab3-facts__rows">
            {FACTS.map(([k, v]) => (
              <div className="ab3-facts__row" key={k}>
                <dt className="ab3-facts__k lbl">{k}</dt>
                <dd className="ab3-facts__v">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 6. QUESTIONS. The accordion that was on home, four questions. */}
      <Faq items={QUESTIONS} id="ab3-faq" />

      {/* 7. THE CLOSING CALL. */}
      <CallBand heading="Tell us what's going wrong." note="Fifteen minutes on the phone. Nothing to pay for the answer." />
    </Shell>
  );
}

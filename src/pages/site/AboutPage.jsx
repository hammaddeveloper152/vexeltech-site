import React from 'react';
import { Check, CursorClick, Eye, MagnifyingGlass, Timer, X } from '@phosphor-icons/react';
import Shell from './Shell.jsx';
import { CallBand } from './parts.jsx';
import Faq from '../../components/home/Faq.jsx';
import ArtCard from '../../components/site/ArtCard.jsx';
import '../../styles/aboutpage.css';

/* THE ABOUT PAGE, REBUILT 2026-09-23 FROM THE FOUNDER'S COPY.

   The source is VEXELTECH-COPY.md, "ABOUT 2026-09-23", in the design repo,
   and every string below is that file verbatim. The order is the founder's:

     1  hero          the statement and its paragraph on the base, the rule
     2  where we      three Moldie-numbered stops in a row
        come from
     3  what the      four cream cards: icon, discipline in Moldie, the line
        phones
        taught us
     4  the numbers   OFF. Every figure is an unfilled bracket
     5  who we are    two cream cards, a Check list and an X list
        for
     6  how we work   the 01 to 04 row
        with you
     6a key facts     a real <dl>, two columns from 1024, one below
     6b questions     the home accordion with About's own four
     7  the note      one reading-width paragraph, the signature in Moldie
     8  the call      the spotlight, and the form from the Shell

   THE QUIET PASS, 2026-09-24, supersedes the faces and grounds named in
   that list: Moldie is gone from this page (numerals and the signature are
   Clash in bone), sections 3 and 5 are cream PANELS inside the measure
   rather than bands, and "phones" in the statement is the page's one
   highlighted word. DESIGN.md "The quiet pass" is the record.

   6a and 6b, and the definition line under the hero paragraph, are
   "ABOUT KEY FACTS 2026-09-23" in the same file, added the same day. The
   definition line is also this page's meta description and the
   Organization description in index.html's JSON-LD.

   WHAT WAS DELETED, because it is not on that list: "What we do" (the two
   text columns), the promise band, and "Our standards" with its CaretDown.
   The promise band is shared with home and home keeps it; this page simply
   stops mounting it. CaretDown was on the standards and nowhere else, so it
   leaves the site with them.

   ---- TWO DECISIONS THE COPY FORCED, BOTH PUT TO THE FOUNDER -------------

   THE [YEAR] BRACKETS. All three stops in section 2 carry one. The rule is
   that a line with an unfilled bracket is cut and never guessed, but cutting
   all three would have deleted the section the founder asked for in the same
   breath. The founder's answer: cut the BRACKET, keep the line. Nothing is
   guessed, each stop still reads as a complete sentence, and a year drops in
   later with no layout change. Stop 03 has its year now, 2026, supplied
   with the key facts; 01 and 02 still have none.

   VEXEL SCALES. Stop 02 as supplied named it. CLAUDE.md records, under
   "settled and not to be revisited", that no Vexel Scales attribution or
   reference of any kind appears anywhere on the site - the rule the legacy
   footer lines and the JSON-LD `legalName` were removed under. The founder's
   answer: keep the stop, drop the name. The history and the lesson survive
   and the entity does not, so the settled rule holds.

   ---- THE LAYOUT FAMILIES, AND THE ONE THAT IS ARGUABLE ------------------

   Sections 2 and 6 are both rows of Moldie numerals, which is the closest
   pair on this page, and they are built to be read differently rather than
   merely to differ. Section 2 is a TIMELINE: three stops, the numeral inline
   before its title on one line, a paragraph under, read as one story from
   left to right. Section 6 is four PROMISES: the numeral stacked above a
   single line, each read on its own and in any order. That is the same
   distinction BUILD-LAW's own amendment drew between icon columns and a
   figure row - what each column holds and how it is read - and it is flagged
   rather than assumed, because a reader who thinks they are one family twice
   is not obviously wrong.

   Sections 3 and 5 are both cream: four small cards against two wide ones,
   an icon-led card against a list card. */

/* Section 2, the founder's copy with the [YEAR] cut from each stop and the
   entity name cut from 02. */
const ORIGINS = [
  {
    n: '01',
    title: 'The phones.',
    body:
      'A call centre selling US internet and TV service on behalf of national providers. Thousands of conversations a month with homeowners, landlords and small business owners across the States.',
  },
  {
    n: '02',
    title: 'The ads.',
    body:
      'A paid media agency registered in Texas, running Google and Meta campaigns for the same kind of customer we used to call. That is where we learned that most ad spend dies on a bad landing page.',
  },
  {
    n: '03',
    title: 'The whole thing. 2026.',
    body:
      'VexelTech: branding, the website, the marketing and the automation, from one team, at a flat price, because the businesses we talked to for years could never afford four agencies.',
  },
];

/* Section 3. Four icons that are on no other route: Eye for being judged in
   ten seconds, MagnifyingGlass for scanning rather than reading, CursorClick
   for the page after the click, Timer for the two minutes. Each says
   something its line says; none is a neutral placeholder. */
const LESSONS = [
  {
    id: 'branding',
    Icon: Eye,
    name: 'Branding',
    line:
      'A caller decides if you are real in the first ten seconds. Your name and your mark do that work before you say a word.',
  },
  {
    id: 'websites',
    Icon: MagnifyingGlass,
    name: 'Websites',
    line:
      'Nobody reads. They scan for a number, a price and a reason to trust you, and they leave if any of the three is missing.',
  },
  {
    id: 'marketing',
    Icon: CursorClick,
    name: 'Marketing',
    line:
      'Ads do not fail in the ad. They fail on the page after the click, and on the phone after the page.',
  },
  {
    id: 'automation',
    Icon: Timer,
    name: 'Automation',
    line:
      'The job you lose is the one that called while you were on a roof. A missed call answered in two minutes is still a job.',
  },
];

/* Section 5. The founder's two cards, split into their sentences so each is
   its own line against its own mark. */
const FIT = {
  yes: [
    'Plumbers, HVAC, electricians, roofers, cleaners, dentists, contractors.',
    'One to fifteen people.',
    'You answer your own phone, or you want to stop having to.',
  ],
  no: [
    'Agencies looking for white-label work.',
    'Startups raising a round.',
    'Anyone who wants a retainer instead of a result.',
  ],
};

/* Section 6, the founder's four, each a title and the line after it. */
const WORK = [
  { n: '01', title: 'One person picks up.', line: 'Not a ticket queue. You get a name and a number.' },
  { n: '02', title: 'You see it before you pay.', line: 'Concepts first, then the build, then the invoice.' },
  { n: '03', title: 'You own everything.', line: 'Domain, hosting, code, credentials. In your name from day one.' },
  { n: '04', title: 'Thirty days of support.', line: 'After that it is a conversation, not a contract.' },
];

/* Section 6a, the founder's twelve facts, verbatim. A row with an unfilled
   bracket is OMITTED, not trimmed: the rule is applied here by the filter
   rather than by deleting rows, so filling a bracket is a one-line edit and
   the row appears. Omitted today: Founder ([SURNAME]) and Social (both URLs).

   CONTACT IS SPLIT, by the founder, 2026-09-23: its value is a list of
   parts, the filled ones are shown and joined, and [PHONE] joins the same
   row when it is filled. A row whose parts are all unfilled is omitted. */
const UNFILLED = /\[[^\]]*\]/;

const FACTS = [
  ['Company', 'VexelTech Solutions'],
  ['Type', 'Branding, web design, marketing and automation agency'],
  ['Founded', '2026'],
  ['Founder', 'Zee [SURNAME]'],
  [
    'Serves',
    'US local service businesses: plumbing, HVAC, electrical, roofing, cleaning, dental, contracting',
  ],
  ['Team based in', 'Karachi, working US hours'],
  [
    'Core offer',
    'Branding from $299, website $700 flat, marketing and automation scoped on a call',
  ],
  ['Contract terms', 'Flat project price, no retainer, thirty days of support included'],
  ['Turnaround', 'Branding 1 to 2 business days, website 4 business days'],
  ['Ownership', "Domain, hosting, code and credentials in the client's name"],
  ['Contact', ['info@vexeltechsolutions.com', '[PHONE]']],
  ['Social', '[LINKEDIN URL], [INSTAGRAM URL]'],
]
  .map(([label, value]) => [
    label,
    Array.isArray(value) ? value.filter((part) => !UNFILLED.test(part)).join(', ') : value,
  ])
  .filter(([, value]) => value && !UNFILLED.test(value));

/* Section 6b, the founder's four questions, in the home accordion. */
const QUESTIONS = [
  {
    id: 'us',
    q: 'Do you work with businesses outside the US?',
    a: 'No. Everything from the copy to the ad targeting is built for US customers, and that is what we know.',
  },
  {
    id: 'team',
    q: 'Where is the team?',
    a: 'Karachi, working US business hours. You get one named person, a US number and a reply within one business day.',
  },
  {
    id: 'concepts',
    q: 'What happens if I do not like the first concepts?',
    a: 'You tell us, we go again. You see concepts before you pay for the build, so nothing is owed for work you have not approved.',
  },
  {
    id: 'takeover',
    q: 'Can you take over a website someone else built?',
    a: 'Yes, if you own the domain and the files. If you do not, the first job is getting them into your name.',
  },
];

export default function AboutPage() {
  return (
    <Shell
      driftTo=".ab3-work"
      title="About us | VexelTech"
      description="VexelTech Solutions is a branding, web design, marketing and automation agency for US local service businesses, with flat prices from $299 and a finished website for $700."
    >
      {/* 1. HERO. The statement at the display step on the drift, a 48px
             yellow rule under it, then the paragraph. */}
      <section className="vt ab3-hero" aria-labelledby="ab3-hero-h">
        <div className="ab3__in ab3-hero__in">
          <div className="ab3-hero__text">
            <h1 className="ab3-hero__h" id="ab3-hero-h">
              {/* The page's one highlighted word, 2026-09-24: `.hl`, tokens.css. */}
              We spent years making <span className="hl">phones</span> ring for other
              people&apos;s brands.
            </h1>
            {/* Decorative, so a span rather than an <hr>, which would announce
                a thematic break between a heading and the line answering it. */}
            <span className="ab3-hero__rule" aria-hidden="true" />
            <p className="ab3-hero__p">
              Before VexelTech built a single website, our team answered calls for US internet
              providers, day and night, from Karachi. We know what a customer sounds like when they
              are ready to buy, and what makes them hang up.
            </p>
            {/* The definition line: what VexelTech is, in one sentence a
                search result or a reader skimming can lift whole. */}
            <p className="ab3-hero__def">
              VexelTech Solutions is a branding, web design, marketing and automation agency for US
              local service businesses, with flat prices from $299 and a finished website for $700.
            </p>
          </div>
        </div>
      </section>

      {/* 2. WHERE WE COME FROM. Three stops, the numeral inline before its
             title, a paragraph under: a timeline read left to right. */}
      <section className="vt ab3-origin" aria-labelledby="ab3-origin-h">
        <div className="ab3__in">
          <h2 className="ab3__h" id="ab3-origin-h">
            Where we come from
          </h2>
          <ol className="ab3-origin__row">
            {ORIGINS.map(({ n, title, body }) => (
              <li className="ab3-origin__stop" key={n}>
                <p className="ab3-origin__head">
                  {/* The list is ordered, so a screen reader counts it; reading
                      "01" aloud before the title would say it twice. */}
                  <span className="ab3-origin__n" aria-hidden="true">
                    {n}
                  </span>
                  <span className="ab3-origin__t">{title}</span>
                </p>
                <p className="ab3-origin__b">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3. WHAT THE PHONES TAUGHT US. Four of the site's cards on the base, four across at 1280. */}
      <section className="vt ab3-lesson" aria-labelledby="ab3-lesson-h">
        <div className="ab3__in">
          <h2 className="ab3__h ab3-lesson__h" id="ab3-lesson-h">
            What the phones taught us
          </h2>
          {/* The site's one card, 2026-09-24: the four artworks keyed by the
              discipline, the icons this page already carried. */}
          <ul className="ab3-lesson__grid">
            {LESSONS.map(({ id, Icon, name, line }) => (
              <li className="ab3-lesson__item" key={id}>
                <ArtCard art={id} Icon={Icon} name={name} line={line} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. THE NUMBERS is OFF: every figure in the copy is an unfilled
             bracket, and a marble band of four empty figures is a claim with
             the number left out. It returns when the figures are real. */}

      {/* 5. WHO WE ARE FOR. Two cards on a cream panel, a Check list and an X list. */}
      <section className="vt ab3-fit panel-sec" aria-labelledby="ab3-fit-h">
        <div className="ab3__in panel">
          <h2 className="ab3__h ab3-fit__h" id="ab3-fit-h">
            Who we are for
          </h2>
          <div className="ab3-fit__cols">
            <div className="ab3-fit__card" data-kind="yes">
              <h3 className="ab3-fit__n">A fit</h3>
              <ul className="ab3-fit__list">
                {FIT.yes.map((t) => (
                  <li className="ab3-fit__item" key={t}>
                    <Check className="ab3-fit__mark" weight="bold" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="ab3-fit__card" data-kind="no">
              <h3 className="ab3-fit__n">Not a fit</h3>
              <ul className="ab3-fit__list">
                {FIT.no.map((t) => (
                  <li className="ab3-fit__item" key={t}>
                    <X className="ab3-fit__mark" weight="bold" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW WE WORK WITH YOU. The 01 to 04 row: numeral above a line. */}
      <section className="vt ab3-work" aria-labelledby="ab3-work-h">
        <div className="ab3__in">
          <h2 className="ab3__h ab3-work__h" id="ab3-work-h">
            How we work with you
          </h2>
          <ol className="ab3-how__steps">
            {WORK.map(({ n, title, line }) => (
              <li className="ab3-how__step" key={n}>
                <span className="ab3-how__n" aria-hidden="true">
                  {n}
                </span>
                <span className="ab3-how__t">{title}</span>
                <span className="ab3-how__line">{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6a. KEY FACTS. A real description list: label in the 11px register,
             value in bone, a hairline between rows. */}
      <section className="vt ab3-facts" aria-labelledby="ab3-facts-h">
        <div className="ab3__in">
          <h2 className="ab3__h" id="ab3-facts-h">
            Key facts
          </h2>
          <dl className="ab3-facts__list">
            {FACTS.map(([label, value]) => (
              <div className="ab3-facts__row" key={label}>
                <dt className="ab3-facts__dt">{label}</dt>
                <dd className="ab3-facts__dd">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 6b. QUESTIONS. The home accordion, About's four, its own id prefix. */}
      <Faq items={QUESTIONS} id="ab3-faq" />

      {/* 7. THE NOTE. One reading-width paragraph, the signature in Clash. */}
      <section className="vt ab3-note" aria-labelledby="ab3-note-h">
        <div className="ab3__in ab3-note__in">
          <h2 className="skip-h" id="ab3-note-h">
            A note from the founder
          </h2>
          <p className="ab3-note__p">
            I started this because I got tired of watching good tradesmen lose work to worse ones
            with better websites. If your phone is not ringing the way it should, that is a fixable
            problem, and it should not cost you a year&apos;s profit to fix it.
          </p>
          <p className="ab3-note__sig">Zee, founder, VexelTech Solutions</p>
        </div>
      </section>

      {/* 8. THE CALL on the spotlight, and the form from the Shell. */}
      <CallBand
        material="spot"
        heading="Tell us about your business and get a quote the same day."
        note="Fifteen minutes on the phone and we'll tell you what we'd fix first. It isn't always the expensive one."
      />
    </Shell>
  );
}

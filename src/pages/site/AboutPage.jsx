import React, { useRef } from 'react';
import Shell from './Shell.jsx';
import OriginStory from '../../components/story/OriginStory.jsx';
import FitColumns from '../../components/story/FitColumns.jsx';
import TermsCard from '../../components/story/TermsCard.jsx';
import NextSize from '../../components/about/NextSize.jsx';
import useSoftStart from '../../components/about/useSoftStart.js';
import { CallBand } from './parts.jsx';
import '../../styles/about.css';

/* THE ABOUT PAGE, REBUILT (final37, 2026-10-08, the founder; copy V5).

     D1  the statement          ink: "About", the Monigue h1, the lead
     D2  the problem            cream: the h2 and one paragraph
     D3  what we hold to        ink: four Monigue lines, the last yellow
     D4  the next size          ink: the staircase (NextSize.jsx)
     D5  why we exist           kept: OriginStory, its fourth beat V5's
     D6  who this is for        kept: FitColumns, its note V5's
     D7  terms of work          kept: TermsCard, with its shadow
     D8  the close              the yellow field, then the form

   The earlier page (the statement's rising words, One team, the four
   business days rail, the light page) is deleted with its styles; its
   shapes are in git and DESIGN.md. The page's ground is ink; the three
   kept cream blocks carry their own cream (story.css). */
const DESCRIPTION =
  'Vexel builds small businesses into bigger ones. One team for the brand, the website, the marketing and the follow-up. Month to month, everything in your name, measured in enquiries.';

const HOLD = [
  "One team, or it isn't a plan.",
  'Your time is the scarcest thing in the building.',
  "We're paid to fill the calendar.",
  'We grow when you grow.',
];

function HoldTo() {
  const ref = useRef(null);
  const play = useSoftStart(ref);
  return (
    <section className="vt ab ab--ink ab--hold" aria-labelledby="hold-k">
      <div className="ab__in">
        <p className="ab__eyebrow" id="hold-k">
          What we hold to
        </p>
        <ul className="hold" ref={ref} data-play={play ? 'true' : 'false'}>
          {HOLD.map((l, i) => (
            <li className={`hold__l${i === 3 ? ' hold__l--y' : ''}`} key={l} style={{ '--i': i }}>
              {l}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <Shell title="About Vexel: the growth department for small businesses" path="/about-us" description={DESCRIPTION}>
      {/* D1. THE STATEMENT. */}
      <section className="vt ab ab--ink ab--d1" aria-labelledby="ab-h1">
        <div className="ab__in">
          <p className="ab__eyebrow">About</p>
          <h1 className="ab__h1" id="ab-h1">
            Vexel is the growth department small businesses never had.
          </h1>
          <p className="ab__lead">
            We build small businesses into bigger ones. The brand, the website, the marketing and the
            follow-up, run by one team that stays with you and grows when you grow.
          </p>
        </div>
      </section>

      {/* D2. THE PROBLEM. */}
      <section className="vt ab ab--cream" aria-labelledby="ab-problem">
        <div className="ab__in">
          <p className="ab__eyebrow">The problem</p>
          <h2 className="hl ab__h" id="ab-problem">
            Small businesses get sold to in pieces.
          </h2>
          <p className="ab__lead ab__body">
            A logo from one place. A website from another. Ads from a third. Software for the phone from a
            fourth. Four invoices, four people who have never met, and nobody whose job is the whole
            business. The owner holds it together, after hours. We started Vexel because that is the part
            nobody was selling.
          </p>
        </div>
      </section>

      <HoldTo />
      <NextSize />
      <OriginStory />
      <FitColumns />
      <TermsCard />

      {/* D8. THE CLOSE: the yellow field, then the form (Shell). The line
          drops "Ready when you are." (the founder's answer, final37): the
          form's heading below says it. */}
      <CallBand
        field
        heading="Your business, at its next size."
        note="Fifteen minutes on the phone and a written number within one business day."
      />
    </Shell>
  );
}

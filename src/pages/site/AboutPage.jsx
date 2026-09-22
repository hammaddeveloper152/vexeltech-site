import React, { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import Shell from './Shell.jsx';
import PromiseBand from '../../components/site/PromiseBand.jsx';
import { CallBand } from './parts.jsx';
import '../../styles/aboutpage.css';

/* THE ABOUT PAGE, aligned to the storyboard, 2026-09-21.

     1. Who we're for   the statement at the DISPLAY step with a 48px yellow
                        rule under it, then the paragraph. On the drift
                        (2026-09-22): the cream is gone, and so is the
                        banner slot and the "How we work" call
     2. What we do      dark, two columns of plain text
     3. How it goes     dark: four short lines under the heading, no
                        numerals, no line (the route is home's device)
     4. What we promise yellow: the shared promise band, $700, the refusals
     5. Our standards   dark, three lines, each revealing how it shows up on
                        a job: the page's engagement device
     6. Tell us         the call on the spotlight (about-call.webp), restored
                        2026-09-22

   ---- THE HERO, 2026-09-22 (the founder) ---------------------------------

   THE BANNER IS GONE (no banners anywhere), and with it the cream. The rule
   is machine yellow, and yellow on cream is 1.66:1 — DESIGN.md's own words
   for a yellow stroke on a light ground are "not a line, a rumour of one",
   which is why deep amber exists. The conflict was raised before anything was
   written and the user took the ground off rather than the colour off the
   rule: the hero opens on the base #0B0B0D like every other page, and the
   rule measures 10.47:1. Cream still appears once on the site, on home's
   Who we are band.

   THE STATEMENT IS AT THE DISPLAY STEP, which the record called home's alone.
   It is the same derived step, measure / 6.227, not a second size: 185px at
   1280, the hero's own figure. The user's call.

   The "How we work" button came off with it; How it goes is two sections down
   and on the same scroll. The paragraph stays, the user's choice.

   The "Four disciplines, one team" plates came off with the storyboard. The
   ground drifts from the base to arc-black at How it goes and holds there
   through the footer (2026-09-21).
   EVERY LINE IS THE BRIEF'S, which is the user's own copy. */

/* How it goes, the user's sentence, one clause a line (2026-09-21). FOUR
   BLOCKS IN ONE ROW since 2026-09-22 (the founder): each clause takes a
   Moldie numeral at 96px in machine yellow with its line under it. Same four
   clauses, same order, unchanged - what moved is that they are now counted.

   NO ROUTE LINE. The route is home's device and appears once on the site; a
   drawn line here would be the second. The numerals are the sequence. */
const HOW = ['A call,', 'then concepts you can see,', 'then a build you can test,', "then it's yours."];

/* THE STANDARDS, TESTED: About's engagement device (2026-09-21, the user's
   choice; built for this page and used nowhere else, BUILD-LAW 0). Each
   standard reveals how it shows up on a job: on hover with a mouse, on a tap
   or Enter anywhere else. The three lines are the user's, verbatim. */
const STANDARDS = [
  {
    id: 'see',
    line: 'You see the work before you owe anything.',
    job: "Concepts are drawn and shown on the call. No deposit, no invoice, until you've seen them.",
  },
  {
    id: 'revise',
    line: 'Revisions are unlimited until you say stop.',
    job: "There is no round three. You ask, we change it, until it's right.",
  },
  {
    id: 'decides',
    line: 'The person who decides is the person you talk to.',
    job: 'No account manager. The person on your call is the person who builds it.',
  },
];

function Standard({ id, line, job }) {
  const [open, setOpen] = useState(false);
  return (
    <li
      className="ab3-std__col"
      data-open={open ? 'true' : 'false'}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
    >
      <button
        type="button"
        className="ab3-std__line"
        aria-expanded={open}
        aria-controls={`std-${id}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="ab3-std__line-t">{line}</span>
        {/* The cue that it opens, 2026-09-22, the founder's ruling: CaretDown,
            used nowhere else on the site, turning when open. Decorative. */}
        <CaretDown className="i i--md ab3-std__caret" aria-hidden="true" />
      </button>
      {/* Held in the layout so nothing moves; hidden from assistive tech
          until it is open, so it matches `aria-expanded`. */}
      <p className="ab3-std__job" id={`std-${id}`} aria-hidden={!open}>
        {job}
      </p>
    </li>
  );
}

export default function AboutPage() {
  return (
    <Shell
      driftTo=".ab3-how"
      title="About us | VexelTech"
      description="Branding, websites, marketing and automation for local service businesses across the US. One flat price."
    >
      {/* 1. HERO. The statement at the display step on the drift, a 48px
             yellow rule under it, then the paragraph. */}
      <section className="vt ab3-hero" aria-labelledby="ab3-hero-h">
        <div className="ab3__in ab3-hero__in">
          <div className="ab3-hero__text">
            <h1 className="ab3-hero__h" id="ab3-hero-h">
              A website that looks expensive and costs $700.
            </h1>
            {/* The rule: 48px of machine yellow, 10.47:1 on the base.
                Decorative, so it is a presentational span rather than an
                <hr>, which would announce a thematic break to a screen
                reader between a heading and the paragraph that answers it. */}
            <span className="ab3-hero__rule" aria-hidden="true" />
            <p className="ab3-hero__p">
              Branding, websites, marketing and automation for plumbers, movers, electricians
              and cleaners across the US. One flat price. No surprises.
            </p>
          </div>
        </div>
      </section>

      {/* 2. WHAT WE DO. */}
      <section className="vt ab3-what" aria-labelledby="ab3-what-h">
        <div className="ab3__in ab3-what__in">
          <h2 className="ab3__h ab3-what__h" id="ab3-what-h">
            We work with local service businesses, not everyone.
          </h2>
          <p className="ab3-what__p">
            Four disciplines under one roof. A mark you&apos;re proud of, from $299. A finished
            website on your own domain in four business days, $700 flat. Marketing pointed at one
            thing: whether the phone rings. Automation for the jobs that eat your week. One team,
            one invoice, one person who picks up.
          </p>
        </div>
      </section>

      {/* 3. HOW IT GOES. Four counted blocks in one row, no drawn line. */}
      <section className="vt ab3-how" aria-labelledby="ab3-how-h">
        <div className="ab3__in">
          <h2 className="ab3__h ab3-how__h" id="ab3-how-h">
            Here is exactly how a project runs.
          </h2>
          <ol className="ab3-how__steps">
            {HOW.map((line, i) => (
              <li className="ab3-how__step" key={line}>
                {/* The numeral is decorative: the list is already ordered, so
                    a screen reader counts it. Reading "01" aloud before every
                    clause would say the same thing twice. */}
                <span className="ab3-how__n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="ab3-how__line">{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. PRICING AND REFUSALS. The promise band, shared with home. The
             $700 at 240px is its object; the image slot came off 2026-09-22. */}
      <PromiseBand id="ab3-price-h" />

      {/* 5. STANDARDS. */}
      <section className="vt ab3-std" aria-labelledby="ab3-std-h">
        <div className="ab3__in">
          <h2 className="ab3__h" id="ab3-std-h">
            Our standards are simple and we keep them.
          </h2>
          <ul className="ab3-std__cols">
            {STANDARDS.map((st) => (
              <Standard key={st.id} {...st} />
            ))}
          </ul>
        </div>
      </section>

      {/* 6. THE CALL on the spotlight, restored 2026-09-22. */}
      <CallBand
        material="spot"
        heading="Tell us about your business and get a quote the same day."
        note="Fifteen minutes on the phone and we'll tell you what we'd fix first. It isn't always the expensive one."
      />
    </Shell>
  );
}

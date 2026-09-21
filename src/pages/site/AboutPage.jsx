import React, { useState } from 'react';
import Shell from './Shell.jsx';
import PromiseBand from '../../components/site/PromiseBand.jsx';
import { CallBand } from './parts.jsx';
import '../../styles/aboutpage.css';

/* THE ABOUT PAGE, aligned to the storyboard, 2026-09-21.

     1. Who we're for   cream, text only: the statement at the heading step,
                        the paragraph, the asphalt outline call "How we work"
                        jumping to How it goes. The mascot came off
                        (2026-09-21, the user): P1 appears on home only
     2. What we do      dark, two columns of plain text
     3. How it goes     dark: four short lines under the heading, no
                        numerals, no line (the route is home's device)
     4. What we promise yellow: the shared promise band, $700, the refusals
     5. Our standards   dark, three lines, each revealing how it shows up on
                        a job: the page's engagement device
     6. Tell us         the plain call on the drift, as on /services

   The "Four disciplines, one team" plates came off with the storyboard. The
   ground drifts from asphalt to arc-black at How it goes and holds there
   through the footer (2026-09-21); the spotlight is retired.
   EVERY LINE IS THE BRIEF'S, which is the user's own copy. */

/* How it goes, the user's sentence, one clause a line (2026-09-21). */
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
        {line}
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
      {/* 1. HERO. A cream band, text only. */}
      <section className="vt ab3-hero colour-band" aria-labelledby="ab3-hero-h">
        <div className="ab3__in ab3-hero__in">
          <div className="ab3-hero__text">
            <h1 className="ab3-hero__h" id="ab3-hero-h">
              A website that looks expensive and costs $700.
            </h1>
            <p className="ab3-hero__p">
              Branding, websites, marketing and automation for plumbers, movers, electricians
              and cleaners across the US. One flat price. No surprises.
            </p>
            {/* An in-page jump, not a route: nothing is fetched. */}
            <a className="ab3-hero__call" href="#ab3-how-h">
              How we work
            </a>
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

      {/* 3. HOW IT GOES. Four short lines, no numerals, no line. */}
      <section className="vt ab3-how" aria-labelledby="ab3-how-h">
        <div className="ab3__in">
          <h2 className="ab3__h ab3-how__h" id="ab3-how-h">
            Here is exactly how a project runs.
          </h2>
          <p className="ab3-how__lines">
            {HOW.map((line) => (
              <span className="ab3-how__line" key={line}>
                {line}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* 4. PRICING AND REFUSALS. The promise band, shared with home. */}
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

      {/* 6. THE CALL, plain, on the drift: About ends as /services does. */}
      <CallBand
        heading="Tell us about your business and get a quote the same day."
        note="Fifteen minutes on the phone and we'll tell you what we'd fix first. It isn't always the expensive one."
      />
    </Shell>
  );
}

import React from 'react';
import Shell from './Shell.jsx';
import RouteBand from '../../components/site/RouteBand.jsx';
import PromiseBand from '../../components/site/PromiseBand.jsx';
import { CallBand } from './parts.jsx';
import '../../styles/aboutpage.css';

/* THE ABOUT PAGE, aligned to the storyboard, 2026-09-21.

     1. Who we're for   cream, text only: the statement at the heading step,
                        the paragraph, the asphalt outline call "How we work"
                        jumping to How it goes. The mascot came off
                        (2026-09-21, the user): P1 appears on home only
     2. What we do      dark, two columns of plain text
     3. How it goes     dark: the one route
     4. What we promise yellow: the shared promise band, $700, the refusals
     5. Our standards   dark, three lines
     6. Tell us         the spotlight call

   The "Four disciplines, one team" plates came off with the storyboard.
   EVERY LINE IS THE BRIEF'S, which is the user's own copy. */

const STANDARDS = [
  'You see the work before you owe anything.',
  'Revisions are unlimited until you say stop.',
  'The person who decides is the person you talk to.',
];

export default function AboutPage() {
  return (
    <Shell
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

      {/* 3. HOW IT GOES. The route on the dark ground. */}
      <RouteBand
        id="ab3-how-h"
        heading="Here is exactly how a project runs."
        ground="dark"
      />

      {/* 4. PRICING AND REFUSALS. The promise band, shared with home. */}
      <PromiseBand id="ab3-price-h" />

      {/* 5. STANDARDS. */}
      <section className="vt ab3-std" aria-labelledby="ab3-std-h">
        <div className="ab3__in">
          <h2 className="ab3__h" id="ab3-std-h">
            Our standards are simple and we keep them.
          </h2>
          <ul className="ab3-std__cols">
            {STANDARDS.map((line) => (
              <li className="ab3-std__col" key={line}>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. THE CALL, on the spotlight: About's closing material. */}
      <CallBand
        material="spot"
        heading="Tell us about your business and get a quote the same day."
        note="Fifteen minutes on the phone and we'll tell you what we'd fix first. It isn't always the expensive one."
      />
    </Shell>
  );
}

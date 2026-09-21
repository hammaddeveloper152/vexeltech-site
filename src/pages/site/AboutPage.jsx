import React from 'react';
import Shell from './Shell.jsx';
import RouteBand from '../../components/site/RouteBand.jsx';
import PromiseBand from '../../components/site/PromiseBand.jsx';
import { CallBand } from './parts.jsx';
import DisciplinePlate from '../../components/site/DisciplinePlate.jsx';
import usePlateArrival from '../../components/home/usePlateArrival.js';
import { DISCIPLINES as DISCIPLINE_CARDS } from '../../content/disciplines.js';
import '../../styles/plates.css';
import '../../styles/aboutpage.css';

/* THE ABOUT PAGE, THIRD VERSION, 2026-09-15; sections 1 and 4 added
   2026-09-16; the cream hero restored and the disciplines row added
   2026-09-21, both by the user.

     1. Hero               a cream band: the statement at the HEADING step on
                           the left, the line under it, the mascot on the
                           right, as built on 2026-09-15. The copy is this
                           version's; the display-step hero is withdrawn
     2. What we do         dark, text, two columns
     2b. Four disciplines  the home page's four icon plates, the same
                           component and its 2x2, each to its section on
                           /services
     3. How it goes        a cream band; the route drawn in code is its object
     4. Pricing, refusals  a yellow band; the typographic figure, $700, is its
                           object, recorded beside the route rule
     5. Standards          dark, three columns with hairlines
     6. Call               the site's call band

   EVERY LINE IS THE BRIEF'S, which is the user's own copy. The one image is
   the mascot, a brand object. */

const STANDARDS = [
  'You see the work before you owe anything.',
  'Revisions are unlimited until you say stop.',
  'The person who decides is the person you talk to.',
];

export default function AboutPage() {
  const [plateRef] = usePlateArrival(DISCIPLINE_CARDS.length);

  return (
    <Shell
      title="About us | VexelTech"
      description="Branding, websites, marketing and automation for local service businesses across the US. One flat price."
    >
      {/* 1. HERO. A cream band with the mascot standing on it. */}
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
          </div>
          <div className="ab3-hero__art">
            <img
              className="ab3-hero__character float"
              src="/assets/objects/character.webp"
              alt=""
              decoding="async"
            />
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

      {/* 2b. FOUR DISCIPLINES, ONE TEAM. The home page's plates. */}
      <section className="vt ab3-plates" aria-labelledby="ab3-plates-h">
        <div className="ab3__in">
          <h2 className="ab3__h" id="ab3-plates-h">
            Four disciplines, one team
          </h2>
          <ul className="ab3-plates__grid">
            {DISCIPLINE_CARDS.map(({ id, Icon, discipline, subs }, i) => (
              <li key={id}>
                <DisciplinePlate
                  id={`ab-${id}`}
                  Icon={Icon}
                  name={discipline}
                  items={subs.map((t) => ({ t }))}
                  side={i % 2 === 0 ? 'left' : 'right'}
                  as="h3"
                  plateRef={plateRef(i)}
                  href={`/services#${id}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. HOW IT GOES. A cream band; the route is the object standing on it. */}
      <RouteBand id="ab3-how-h" heading="Here is exactly how a project runs." />

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

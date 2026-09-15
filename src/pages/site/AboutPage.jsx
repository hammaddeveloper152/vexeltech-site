import React from 'react';
import Shell from './Shell.jsx';
import { CallBand } from './parts.jsx';
import '../../styles/aboutpage.css';

/* THE ABOUT PAGE, THIRD VERSION, 2026-09-15. It replaces the whole page before
   it: the cream mascot hero, the disciplines strip, Origin, the refusals band,
   the plates and the handset call.

   The brief has SIX sections. FOUR ARE BUILT, by the user's decision:

     1. Hero               HELD until /objects/about-hero.webp exists
     2. What we do         dark, text, two columns
     3. How it goes        a cream band with a five-stop route drawn in code
     4. Pricing, refusals  HELD until /objects/about-price.webp exists; without
                           its object the yellow band would be an empty field
     5. Standards          dark, three columns with hairlines
     6. Call               the site's call band

   While the hero is held, section 2's heading is the page's h1.

   EVERY LINE IS THE BRIEF'S, which is the user's own copy. No other images:
   the page carries none until the two held sections land.

   The user's decisions, recorded in DESIGN.md and BUILD-LAW.md:
   - The route drawn in code is the object standing on the cream band.
   - An object standing on a colour band and an image beside text on the dark
     ground are different layout families (for when sections 1 and 4 land).
   - The call keeps the burst call band, like every route, with no object. */

const STOPS = [
  ['01', 'A call, not a pitch'],
  ['02', 'We design it and show you'],
  ['03', 'We build and test it'],
  ['04', 'It goes live on your domain'],
  ['05', "Thirty days of support, then it's yours"],
];

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
      {/* 2. WHAT WE DO. The heading is the page's h1 while the hero is held. */}
      <section className="vt ab3-what" aria-labelledby="ab3-what-h">
        <div className="ab3__in ab3-what__in">
          <h1 className="ab3__h ab3-what__h" id="ab3-what-h">
            We work with local service businesses, not everyone.
          </h1>
          <p className="ab3-what__p">
            Four disciplines under one roof. A mark you&apos;re proud of, from $299. A finished
            website on your own domain in four business days, $700 flat. Marketing pointed at one
            thing: whether the phone rings. Automation for the jobs that eat your week. One team,
            one invoice, one person who picks up.
          </p>
        </div>
      </section>

      {/* 3. HOW IT GOES. A cream band; the route is the object standing on it. */}
      <section className="vt ab3-how" aria-labelledby="ab3-how-h">
        <div className="ab3__in">
          <h2 className="ab3__h ab3-how__h" id="ab3-how-h">
            Here is exactly how a project runs.
          </h2>
          <ol className="ab3-route">
            {STOPS.map(([n, line]) => (
              <li className="ab3-route__stop" key={n}>
                <span className="ab3-route__n" aria-hidden="true">
                  {n}
                </span>
                <span className="ab3-route__t">{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. STANDARDS. Three columns split by hairlines. */}
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

      {/* 6. THE CALL, on the burst call band, with no object. */}
      <CallBand
        heading="Tell us about your business and get a quote the same day."
        note="Fifteen minutes on the phone and we'll tell you what we'd fix first. It isn't always the expensive one."
      />
    </Shell>
  );
}

import React from 'react';
import Shell from './Shell.jsx';
import { CallBand } from './parts.jsx';
import '../../styles/aboutpage.css';

/* THE ABOUT PAGE, THIRD VERSION, 2026-09-15; sections 1 and 4 added
   2026-09-16, TYPOGRAPHIC, with no images.

     1. Hero               dark: the headline at the DISPLAY step, the home
                           hero's clamp, recorded as the site's second display
                           use; the bone line; no object; left, 60% measure
     2. What we do         dark, text, two columns
     3. How it goes        a cream band; the route drawn in code is its object
     4. Pricing, refusals  a yellow band; the typographic figure, $700, is its
                           object, recorded beside the route rule
     5. Standards          dark, three columns with hairlines
     6. Call               the site's call band

   EVERY LINE IS THE BRIEF'S, which is the user's own copy. No images. */

const STOPS = [
  ['01', 'A call, not a pitch'],
  ['02', 'We design it and show you'],
  ['03', 'We build and test it'],
  ['04', 'It goes live on your domain'],
  ['05', "Thirty days of support, then it's yours"],
];

const REFUSALS = [
  "We don't sell retainers. Thirty days of support are included, after that it's a conversation.",
  "We don't use templates. Every build starts from your business.",
  "We don't hide the price until a call. It's on this site.",
  "We don't keep your files. Domain, hosting, code and credentials move to your name.",
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
      {/* 1. HERO. Type only. */}
      <section className="vt ab3-hero" aria-labelledby="ab3-hero-h">
        <div className="ab3__in">
          <div className="ab3-hero__text">
            <h1 className="ab3-hero__h" id="ab3-hero-h">
              A website that looks expensive and costs $700.
            </h1>
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

      {/* 4. PRICING AND REFUSALS. A yellow band; the figure is its object. */}
      <section className="vt ab3-price" aria-labelledby="ab3-price-h">
        <div className="ab3__in">
          <h2 className="ab3__h ab3-price__h" id="ab3-price-h">
            Flat prices, and a short list of things we refuse to do.
          </h2>
          <div className="ab3-price__cols">
            <div className="ab3-price__fig">
              <p className="ab3-price__n">$700</p>
              <p className="ab3-price__k">flat, one time</p>
              <p className="ab3-price__k">$299 to $449 for branding</p>
            </div>
            <ul className="ab3-price__refuse">
              {REFUSALS.map((line) => (
                <li className="ab3-price__r" key={line}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

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

      {/* 6. THE CALL. */}
      <CallBand
        heading="Tell us about your business and get a quote the same day."
        note="Fifteen minutes on the phone and we'll tell you what we'd fix first. It isn't always the expensive one."
      />
    </Shell>
  );
}

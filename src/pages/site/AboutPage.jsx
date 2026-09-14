import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown } from '@phosphor-icons/react';
import Shell from './Shell.jsx';
import { Section, CallBand } from './parts.jsx';
import AboutPlates from './AboutPlates.jsx';
import '../../styles/about.css';
import '../../styles/aboutpage.css';

/* THE ABOUT PAGE, REBUILT 2026-09-15. It replaced the surface-mount head, the
   edge-bleed feature and the counter row.

   EVERY LINE OF COPY IS THE FOUNDER'S, from VEXELTECH-COPY.md (About us), or
   the brief's own for "What we refuse". Nothing else is written here.

     1. Hero       a cream band: the statement, Body 1 and Body 2, the asphalt
                   call; the mascot on the right, floating
     2. Strip      four image cards, the Services tiles, each to its section
     3. Origin     Plate 00 in a lit frame, "Fifty-two iterations, one cut"
     4. Refuse     a machine yellow band, three objects, three refusals
     5. Who        the two situations, as plates, as built
     6. Call       the call band, with the handset beside it

   ---- Decisions on the brief, all recorded in DESIGN.md --------------------

   - The statement is at the HEADING step, 95px at 1280, by the user: the hero
     clamp would have run it to about ten lines in a 60% column, and the display
     step is the home hero's.
   - The hero and Origin are both text beside media. BUILD-LAW was amended by
     the user: a mascot on a colour band and a framed artwork beside text are
     different families.
   - The bar is SOLID here. The header's transparent state is for a film or
     surface hero, and a cream band is neither: white navigation over cream
     would be 1.13:1.
   - "How we work with you" goes to the refusals on this page, the terms a
     client works on. It was the home About's call to this page.
   - The closing call keeps the call band, with the handset beside it, by the
     user. */

const DISCIPLINES = [
  { id: 'branding', name: 'Branding' },
  { id: 'websites', name: 'Websites' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'automation', name: 'Automation' },
];

/* The brief's copy, and the brief's pairing of objects to lines. */
const REFUSE = [
  {
    id: 'retainers',
    icon: 'icon-megaphone',
    title: 'No retainers.',
    body: "Thirty days of support is included with every build. After that it's a conversation, not a contract.",
  },
  {
    id: 'templates',
    icon: 'icon-name-tag',
    title: 'No templates.',
    body: 'Every build starts from your business, not from a theme.',
  },
  {
    id: 'lock-in',
    icon: 'icon-phone',
    title: 'No lock-in.',
    body: 'Files, domain, hosting and code move to your name at handover.',
  },
];

export default function AboutPage() {
  return (
    <Shell
      title="About us | VexelTech"
      description="One team for branding, websites, marketing and automation, from the logo through to the automation."
    >
      {/* 1. HERO. A colour band with an object standing on it. */}
      <section className="vt ab-hero" aria-labelledby="ab-hero-h">
        <div className="ab-hero__in">
          <div className="ab-hero__text">
            <h1 className="ab-hero__h" id="ab-hero-h">
              We know how hard it is to spend your earnings and get nothing for it.
            </h1>
            <p className="ab-hero__p">
              So we build long-term partnerships rather than treating you as an invoice to be
              paid. A dedicated team stays on your project, which is why asking for a change
              here is a conversation and not a negotiation.
            </p>
            <p className="ab-hero__p">
              One team from the logo to the automation, not four agencies who don&apos;t talk to
              each other. We put AI alongside orthodox marketing, so the work that used to take
              weeks of back and forth comes back fast and comes back right.
            </p>
            {/* An in-page jump, not a route: nothing is fetched. */}
            <a className="ab-hero__call" href="#refuse">
              How we work with you
              <ArrowDown className="i i--sm" aria-hidden="true" />
            </a>
          </div>
          {/* The mascot. Decorative, a brand object, exempt from the carrier
              count; floats on `.float`, still under reduced motion. */}
          <div className="ab-hero__art">
            <img
              className="ab-hero__character float"
              src="/assets/objects/character.webp"
              alt=""
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* 2. THE DISCIPLINES STRIP. The generated tiles, exempt as artwork. */}
      <section className="vt ab-strip" aria-labelledby="ab-strip-h">
        <div className="ab-strip__in">
          <h2 className="ab-strip__h" id="ab-strip-h">
            Four disciplines, one team
          </h2>
          <ul className="ab-strip__cards">
            {DISCIPLINES.map(({ id, name }) => (
              <li key={id}>
                <Link className="ab-card" to={`/services#${id}`}>
                  <img
                    className="ab-card__img"
                    src={`/assets/services/${id}.webp`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="ab-card__body">
                    <span className="ab-card__name">{name}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. ORIGIN. Plate 00 from the identity plates, in a lit frame. */}
      <section className="vt ab-origin" aria-labelledby="ab-origin-h">
        <div className="ab-origin__in">
          <figure className="ab-origin__frame">
            <img
              className="ab-origin__img"
              src="/assets/objects/plate-00.webp"
              alt="Identity plate 00: the VexelTech mark, drawn over its earlier iterations."
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className="ab-origin__text">
            <h2 className="ab-origin__h" id="ab-origin-h">
              Fifty-two iterations, one cut
            </h2>
            <p className="ab-origin__p">
              The mark on this site went through fifty-two versions before one was cut.
              That&apos;s how we treat your work too: we don&apos;t stop at the first thing that
              looks finished, we stop at the one that is.
            </p>
          </div>
        </div>
      </section>

      {/* 4. WHAT WE REFUSE. A yellow band with three objects on it. */}
      <section className="vt ab-refuse" id="refuse" aria-labelledby="ab-refuse-h">
        <div className="ab-refuse__in">
          <h2 className="ab-refuse__h" id="ab-refuse-h">
            What we refuse
          </h2>
          <ul className="ab-refuse__items">
            {REFUSE.map(({ id, icon, title, body }) => (
              <li className="ab-refuse__item" key={id}>
                <img
                  className="ab-refuse__icon"
                  src={`/assets/objects/${icon}.webp`}
                  alt=""
                  width="96"
                  height="96"
                  loading="lazy"
                  decoding="async"
                />
                <h3 className="ab-refuse__t">{title}</h3>
                <p className="ab-refuse__b">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. WHO WE WORK WITH, as built. */}
      <Section
        title="Who we work with"
        labelledBy="about-who"
        note="Owners and founders, and the two situations most of them arrive in."
      >
        <div className="abt__people-head">
          <h3 className="disc__name">The people</h3>
          <p className="disc__line">
            The person who decides is the person we talk to. No account manager relaying it back
            to somebody you never meet.
          </p>
        </div>

        <AboutPlates />

        <p className="abt__people">
          {['Startups', 'SMBs', 'Local businesses', 'Entrepreneurs', 'Founders', 'Owners'].map(
            (t, i, a) => (
              <span key={t}>
                {t}
                {i < a.length - 1 ? <span className="abt__slash" aria-hidden="true"> / </span> : null}
              </span>
            )
          )}
        </p>
      </Section>

      {/* 6. THE CALL, with the handset. */}
      <CallBand
        heading="Tell us what is going wrong"
        note="Fifteen minutes on the phone and we'll tell you what we'd fix first. There is nothing to pay for the answer."
        handset
      />
    </Shell>
  );
}

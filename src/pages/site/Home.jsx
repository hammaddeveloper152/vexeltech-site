import React, { useEffect } from 'react';
import Header from '../../components/site/Header.jsx';
import Hero from '../../components/home/Hero.jsx';
import Failures from '../../components/home/Failures.jsx';
import Services from '../../components/home/Services.jsx';
import WordBand from '../../components/home/WordBand.jsx';
import About from '../../components/home/About.jsx';
import CounterRow from '../../components/home/CounterRow.jsx';
import Faq from '../../components/home/Faq.jsx';
import RouteBand from '../../components/site/RouteBand.jsx';
import PromiseBand from '../../components/site/PromiseBand.jsx';
import FooterForm from '../../components/home/FooterForm.jsx';
import { CallBand } from './parts.jsx';
import useDrift, { at } from '../../components/site/useDrift.js';
import '../../styles/tokens.css';
/* The loud register, applied to every section below the hero. Imported LAST
   so it wins on source order. See src/styles/register.css. */
import '../../styles/register.css';
/* The agency register, loaded LAST because it supersedes the sheet above on
   ground, depth and where the accent lands. register.css still owns face and
   size; agency.css owns colour. See its header for what was withdrawn. */
import '../../styles/agency.css';
/* The light model. DESIGN.md Elevation & Depth is asphalt-dominant, LIT. */
import '../../styles/lit.css';

/* THE HOMEPAGE, NOW AT `/`.

   This is the eleven-section composition that has been living behind
   `hero-preview.html` for the whole rebuild. It is the same tree, in the same
   order, with the same comments about that order carried over from
   `hero-preview.jsx`; what changed is that it is a route rather than a
   separate Vite entry.

   `hero-preview.html` and `hero-preview.jsx` are KEPT and still work. They
   are the harness the measurement scripts point at, and pointing those at a
   client-routed page would mean every measurement waiting on the router.

   ---- THE STORYBOARD ORDER, 2026-09-21 -----------------------------------

   VEXELTECH-STORYBOARD.md is the source of section order and asset
   placement from this date, and it outranks the notes below where they
   differ. Hero (dark), What it costs you (dark rows), Who we are (cream, P1),
   What we do (plain columns) with the strike ticker under it, How it works
   (the vertical route on the drift at its darkest), The numbers (marble, off
   until the four figures exist), What we promise (yellow), Questions (dark),
   Get in touch (the form, P2 beside it on every route). The work grid and
   the testimonials came off; home's Process was retired into the one route,
   and glass was retired into the drift.

   ---- Ground rhythm (before the storyboard) ------------------------------

   Asphalt everywhere. The counter row and the FAQ used to be the two light
   sections; on a loud page a light section becomes the loudest thing on the
   page and takes the accent's job, so the FAQ takes its relief from its open
   row inverting instead. See DESIGN.md, "Asphalt everywhere".

   Failures sits between the hero and Services. It names what is broken
   before the page mentions a service, so the reader recognises the problem
   before being offered anything. Services sits below it, where Pillars sat.
   The four disciplines are the argument and they come before the proof. The
   section numbers in the build brief were a build sequence, not a page
   order, so do not reorder to match them. */

const TITLE = 'Website Design for Startups & Small Business | VexelTech';
const DESCRIPTION =
  'Branding, websites, marketing and automation for startups, SMBs and founders. We show up with the work already built. Book a 15-minute call.';

/* The retired Process component's four step descriptions, carried as one
   line under stops 01 to 04 of the route, and the user's line for stop 05
   (2026-09-21). */
const STEP_LINES = [
  "Thirty minutes with a brand strategist. You tell us what's wrong and what you're after, and we listen before we price anything.",
  'Onboarding and research first, then design starts: the brand work for branding, the UI and UX for the site.',
  'Four business days to build it, then testing. You look at it and tell us what to change, as many times as it takes.',
  'It moves to your hosting, with every credential and the ownership under your name. You own everything you paid for.',
  /* Stop 05, the user's line, 2026-09-21. */
  "It moves to your hosting, with every credential under your name. Thirty days of support included, then it's a conversation, not a contract.",
];

export default function Home() {
  useEffect(() => {
    document.title = TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = DESCRIPTION;
    window.scrollTo(0, 0);
  }, []);

  /* THE DRIFT, home's ground, the whole page (lit.css, useDrift.js). Two
     colours, the base (#0B0B0D) and arc-black, after lit-near at the very
     top: the base halfway to the route, arc-black through How it works, the
     base from the FAQ through the form, arc-black again from the footer's
     pages row. */
  useDrift(() => {
    const top = at('.route-band--open');
    return [
      ['--lit-near', 0],
      ['--c-base', top === null ? null : Math.round(top / 2)],
      ['--c-arc-black', top],
      ['--c-arc-black', at('.route-band--open', 'bottom')],
      ['--c-base', at('.faq')],
      ['--c-base', at('.foot__stage', 'bottom')],
      ['--c-arc-black', at('.foot__row')],
    ];
  });

  return (
    <>
      {/* First tab stop on the page. At 1280 the bar puts four links and a
          call between the top of the document and the first word of the
          hero. The link is in the tab order at all times and off the screen
          until it takes focus. Styled in tokens.css, not here, because it
          belongs to the page rather than to any section. */}
      <a className="skip" href="#main">
        Skip to content
      </a>

      {/* Over the film: transparent at the top, solid after 80px. */}
      <Header over />

      {/* The one main landmark. tabIndex -1 makes it a focus target without
          putting it in the tab order: without it the browser moves the
          scroll position and leaves focus on the link, so the next Tab goes
          back into the bar, which is the thing the link just skipped. */}
      <main id="main" tabIndex={-1}>
        <Hero />
        <Failures />
        <About />
        <Services />
        <WordBand />
        <RouteBand
          id="how-h"
          heading="How it works"
          lines={STEP_LINES}
          marg="(04) How it works"
        />
        <CounterRow band />
        {/* The $700 at 240px is the band's object; `promise.webp` came off
            2026-09-22 with every other unfilled slot. */}
        <PromiseBand id="promise-h" />
        <Faq />
        {/* The closing call, between Questions and the form: the founder's
            line and subline, 2026-09-24. */}
        <CallBand
          heading="Not sure where to start?"
          note="Fifteen minutes on the phone. We tell you what we would fix first."
        />
        <FooterForm />
      </main>
    </>
  );
}

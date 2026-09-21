import React, { useEffect } from 'react';
import IconProvider from '../../components/site/Icons.jsx';
import Header from '../../components/site/Header.jsx';
import Hero from '../../components/home/Hero.jsx';
import Failures from '../../components/home/Failures.jsx';
import Services from '../../components/home/Services.jsx';
import Marquee from '../../components/home/Marquee.jsx';
import About from '../../components/home/About.jsx';
import CounterRow from '../../components/home/CounterRow.jsx';
import Faq from '../../components/home/Faq.jsx';
import RouteBand from '../../components/site/RouteBand.jsx';
import PromiseBand from '../../components/site/PromiseBand.jsx';
import FooterForm from '../../components/home/FooterForm.jsx';
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
   What we do (dark cards) with the strike ticker under it, How it works (the
   route on glass, P3 at stop 02), The numbers (marble, off until the four
   figures exist), What we promise (yellow, P5), Questions (dark), Get in
   touch (the form, P2). The work grid and the testimonials came off; home's
   Process was retired into the one route.

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
   line under stops 01 to 04 of the route (the user, 2026-09-21). */
const STEP_LINES = [
  "Thirty minutes with a brand strategist. You tell us what's wrong and what you're after, and we listen before we price anything.",
  'Onboarding and research first, then design starts: the brand work for branding, the UI and UX for the site.',
  'Four business days to build it, then testing. You look at it and tell us what to change, as many times as it takes.',
  'It moves to your hosting, with every credential and the ownership under your name. You own everything you paid for.',
];

export default function Home() {
  useEffect(() => {
    document.title = TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = DESCRIPTION;
    window.scrollTo(0, 0);
  }, []);

  /* THE DRIFT, home's ground (lit.css, 2026-09-21). Its stops are measured
     in px from the page itself: asphalt halfway to the route, arc-black from
     the route's top to its bottom, asphalt again by the FAQ. Re-measured
     whenever the page changes height (fonts landing, a width change, the FAQ
     opening). Taken off the body when the reader leaves home. */
  useEffect(() => {
    const body = document.body;
    body.dataset.ground = 'drift';
    const set = () => {
      const route = document.querySelector('.route-band--open');
      const faq = document.querySelector('.faq');
      if (!route || !faq) return;
      const y = (el) => el.getBoundingClientRect().top + window.scrollY;
      const top = y(route);
      const bottom = top + route.offsetHeight;
      body.style.setProperty('--drift-asphalt', `${Math.round(top / 2)}px`);
      body.style.setProperty('--drift-deep', `${Math.round(top)}px`);
      body.style.setProperty('--drift-deep-end', `${Math.round(bottom)}px`);
      body.style.setProperty('--drift-back', `${Math.round(y(faq))}px`);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(body);
    if (document.fonts) document.fonts.ready.then(set);
    return () => {
      ro.disconnect();
      delete body.dataset.ground;
      ['--drift-asphalt', '--drift-deep', '--drift-deep-end', '--drift-back'].forEach((v) =>
        body.style.removeProperty(v)
      );
    };
  }, []);

  return (
    <IconProvider>
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
        <Marquee />
        <RouteBand
          id="how-h"
          heading="How it works"
          ground="dark"
          open
          lines={STEP_LINES}
        />
        <CounterRow band />
        <PromiseBand id="promise-h" />
        <Faq />
        <FooterForm />
      </main>
    </IconProvider>
  );
}

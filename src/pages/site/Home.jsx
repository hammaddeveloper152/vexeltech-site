import React, { useEffect } from 'react';
import Header from '../../components/site/Header.jsx';
import { skipToMain } from '../../components/site/skip.js';
import Hero from '../../components/home/Hero.jsx';
import CostsCited from '../../components/home/CostsCited.jsx';
import WorkAccordion from '../../components/final/WorkAccordion.jsx';
import WhatWeDo from '../../components/home/WhatWeDo.jsx';
import SiteFooter from '../../components/site/SiteFooter.jsx';
import { useSmoothScroll } from '../../components/home/smoothScroll.js';
import CounterRow from '../../components/home/CounterRow.jsx';
import ClosingForm from '../../components/site/ClosingForm.jsx';
import { setHead, setLd, AREA_SERVED, ORIGIN } from './head.js';
import { SOCIAL_URLS } from '../../content/socials.js';
import { FIGURES, money } from '../../content/pricing.js';
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

/* COPY V3.1, 2026-10-01 (VEXELTECH-COPY.md, Metadata). */
const TITLE = 'Website design for growing businesses, $700 flat | Vexel';
const DESCRIPTION =
  'Website design, branding, local SEO, ads and automation for businesses that want to grow. Websites $700 flat, live in four business days.';


export default function Home() {
  /* Lenis, home's alone. The wordmark band started it until final32
     deleted the band (2026-10-07, the founder). */
  useSmoothScroll();
  /* The title, description, canonical and Open Graph tags (head.js). */
  useEffect(() => setHead({ title: TITLE, description: DESCRIPTION, path: '/' }), []);

  /* THE BUSINESS, home only (the founder's final audit, final22): a
     ProfessionalService with its name, url, logo, the countries served and
     the price range; `sameAs` only once a social URL is set. */
  useEffect(() => {
    const sameAs = Object.values(SOCIAL_URLS).filter(Boolean);
    return setLd('business', {
      '@type': 'ProfessionalService',
      '@id': `${ORIGIN}/#service`,
      name: 'VexelTech Solutions',
      url: `${ORIGIN}/`,
      logo: `${ORIGIN}/og/logo.png`,
      image: `${ORIGIN}/og/vexeltech.jpg`,
      email: 'info@vexeltechsolutions.com',
      telephone: '+13852843265',
      description: DESCRIPTION,
      areaServed: AREA_SERVED,
      /* From the price tokens since the launch gate (2026-10-07): the range
         stopped at $700 while /pricing sells the $999 bundle. */
      priceRange: `${money(FIGURES.brandingBasic)} to ${money(FIGURES.bundle)}`,
      parentOrganization: { '@id': `${ORIGIN}/#organization` },
      ...(sameAs.length ? { sameAs } : {}),
    });
  }, []);

  useEffect(() => {
    /* A FRAGMENT IS HONOURED, 2026-09-25: About links to `/#how-it-works`.
       Scrolled once the fonts are in, so the target does not move after
       the page has landed on it; `scroll-margin-top` clears the bar. */
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (target) {
      const go = () => target.scrollIntoView();
      if (document.fonts) document.fonts.ready.then(go);
      else requestAnimationFrame(go);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  /* THE GROUND is the root's since 2026-09-24: one drift, base to
     arc-black to base, set once in lit.css. This page no longer keys it. */

  return (
    <>
      {/* First tab stop on the page. At 1280 the bar puts four links and a
          call between the top of the document and the first word of the
          hero. The link is in the tab order at all times and off the screen
          until it takes focus. Styled in tokens.css, not here, because it
          belongs to the page rather than to any section. */}
      <a className="skip" href="#main" onClick={skipToMain}>
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
        {/* THE ORDER SINCE FINAL26 (2026-10-07, the founder): What we do as
            paper forms (frame D3), Recent work, the wordmark band, What it
            costs you, then the $700 band. Who we are is deleted: the $700
            and the four days are in the band, the thirty days on the
            Websites card. Its "one invoice, one team" is on no section of
            home now. */}
        <WhatWeDo />
        {/* Recent work, the accordion of wide tiles, restored as it was at
            final22. It renders nothing until content/work.js has three
            real entries. */}
        <WorkAccordion />
        {/* What it costs you: four cited numbers, no artifact (the
            founder's approved frame C, final15, 2026-10-06). */}
        <CostsCited />
        <CounterRow band />
        {/* THE CLOSING SECTION (final34, 2026-10-08, the founder): How it
            works, the closing call and the form are one cream section,
            no join since final35 (ClosingForm.jsx). */}
        <ClosingForm
          steps
          heading="Which one is costing you most?"
          line="Fifteen minutes on the phone, and you have a written number within one business day. In our experience the problem is rarely the expensive one."
        />
      </main>
      {/* THE FOOTER, after <main> (SiteFooter.jsx, final32). */}
      <SiteFooter />
    </>
  );
}

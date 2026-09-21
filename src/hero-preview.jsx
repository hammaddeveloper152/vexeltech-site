import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/tokens.css';
import IconProvider from './components/site/Icons.jsx';
import Header from './components/site/Header.jsx';
import Hero from './components/home/Hero.jsx';
import Failures from './components/home/Failures.jsx';
import Services from './components/home/Services.jsx';
import Marquee from './components/home/Marquee.jsx';
import About from './components/home/About.jsx';
import CounterRow from './components/home/CounterRow.jsx';
import Faq from './components/home/Faq.jsx';
import RouteBand from './components/site/RouteBand.jsx';
import PromiseBand from './components/site/PromiseBand.jsx';
import FooterForm from './components/home/FooterForm.jsx';
/* The loud register, applied to every section below the hero. Imported LAST so
   it wins on source order. See src/styles/register.css. */
import './styles/register.css';
/* The agency register, loaded LAST because it supersedes the sheet above on
   ground, depth and where the accent lands. register.css still owns face and
   size; agency.css owns colour. See its header for what was withdrawn. */
import './styles/agency.css';
/* The light model. DESIGN.md Elevation & Depth is asphalt-dominant, LIT. */
import './styles/lit.css';

/* Ground rhythm: asphalt to concrete and back. The light sections carry the
   relief, and no two of them meet. There are two: the counter row on
   concrete and the FAQ on white, with dark sections between them.

   About was considered for a third and ruled out. It sits directly above the
   counter row, so a light ground there would put two reliefs against each
   other, which DESIGN.md forbids outright. It carries its relief as a
   full-bleed photograph instead. See About.css.

   Failures sits between the hero and Services. It names what is broken
   before the page mentions a service, so the reader recognises the problem
   before being offered anything. The four statements were labels on the
   service cards and are the section now.

   Services sits below it, where Pillars sat, and stays there. The four
   disciplines are the argument and they come before the proof. The section
   numbers in the build brief were a build sequence, not a page order, so do
   not reorder to match them. */
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

createRoot(document.getElementById('hero-root')).render(
  /* THE HARNESS NEEDS A ROUTER NOW.

     The bar, the footer lockup and every call became `<Link>` when the
     internal links stopped being plain anchors, and `useHref` throws outside
     a Router. This entry renders the section tree directly rather than
     through App, so it has to supply the context itself.

     BrowserRouter rather than MemoryRouter: the harness is served at
     hero-preview.html and the links should resolve against the real origin,
     so a click here goes where it would go on the site. */
  <React.StrictMode>
    <BrowserRouter>
    {/* One icon weight for the whole tree. See Icons.jsx. */}
    <IconProvider>
      {/* First tab stop on the page, and the reason it is here: at 1280 the
          bar puts six links between the top of the document and the first
          word of the hero, and a keyboard reader met all six before reaching
          any content. The link is in the tab order at all times and off the
          screen until it takes focus. Styled in tokens.css, not here, because
          it belongs to the page rather than to any section. */}
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Header />

      {/* The one main landmark. Every section below the bar is content, so
          the landmark is the whole run of them, and the skip link has
          somewhere to land. tabIndex -1 makes it a focus target without
          putting it in the tab order: without it the browser moves the
          scroll position and leaves focus on the link, so the next Tab goes
          back into the bar, which is the thing the link just skipped. */}
      <main id="main" tabIndex={-1}>
        {/* No preview switch. `?variant=machine` came out with `?hero` and
            `?entrance` on 2026-09-09; the harness renders the hero as it
            ships and nothing else. */}
        <Hero />
        <Failures />
        <About />
        <Services />
        <Marquee />
        <RouteBand
          id="how-h"
          heading="How it works"
          lines={STEP_LINES}
        />
        <CounterRow band />
        <PromiseBand id="promise-h" image="/assets/promise.webp" />
        <Faq />
        <FooterForm />
      </main>
    </IconProvider>
    </BrowserRouter>
  </React.StrictMode>
);

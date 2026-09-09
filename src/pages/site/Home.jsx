import React, { useEffect } from 'react';
import IconProvider from '../../components/site/Icons.jsx';
import Header from '../../components/site/Header.jsx';
import Hero from '../../components/home/Hero.jsx';
import Failures from '../../components/home/Failures.jsx';
import Services from '../../components/home/Services.jsx';
import Marquee from '../../components/home/Marquee.jsx';
import WorkGrid from '../../components/home/WorkGrid.jsx';
import About from '../../components/home/About.jsx';
import CounterRow from '../../components/home/CounterRow.jsx';
import Testimonials from '../../components/home/Testimonials.jsx';
import Process from '../../components/home/Process.jsx';
import Faq from '../../components/home/Faq.jsx';
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

   ---- Ground rhythm ------------------------------------------------------

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

export default function Home() {
  useEffect(() => {
    document.title = TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = DESCRIPTION;
    window.scrollTo(0, 0);
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

      <Header />

      {/* The one main landmark. tabIndex -1 makes it a focus target without
          putting it in the tab order: without it the browser moves the
          scroll position and leaves focus on the link, so the next Tab goes
          back into the bar, which is the thing the link just skipped. */}
      <main id="main" tabIndex={-1}>
        <Hero />
        <Failures />
        <Services />
        <Marquee />
        <WorkGrid />
        <About />
        <CounterRow />
        <Testimonials />
        <Process />
        <Faq />
        <FooterForm />
      </main>
    </IconProvider>
  );
}

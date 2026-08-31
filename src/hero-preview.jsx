import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import IconProvider from './components/site/Icons.jsx';
import Header from './components/site/Header.jsx';
import Hero from './components/home/Hero.jsx';
import Failures from './components/home/Failures.jsx';
import Services from './components/home/Services.jsx';
import Marquee from './components/home/Marquee.jsx';
import WorkGrid from './components/home/WorkGrid.jsx';
import About from './components/home/About.jsx';
import CounterRow from './components/home/CounterRow.jsx';
import Testimonials from './components/home/Testimonials.jsx';
import Process from './components/home/Process.jsx';
import Faq from './components/home/Faq.jsx';
import FooterForm from './components/home/FooterForm.jsx';

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
createRoot(document.getElementById('hero-root')).render(
  <React.StrictMode>
    {/* One icon weight for the whole tree. See Icons.jsx. */}
    <IconProvider>
      <Header />
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
    </IconProvider>
  </React.StrictMode>
);

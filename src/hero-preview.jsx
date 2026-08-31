import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import Header from './components/site/Header.jsx';
import Hero from './components/home/Hero.jsx';
import Services from './components/home/Services.jsx';
import Marquee from './components/home/Marquee.jsx';
import WorkGrid from './components/home/WorkGrid.jsx';
import CounterRow from './components/home/CounterRow.jsx';
import Testimonials from './components/home/Testimonials.jsx';
import Process from './components/home/Process.jsx';
import Faq from './components/home/Faq.jsx';
import FooterForm from './components/home/FooterForm.jsx';

/* Ground rhythm: asphalt to concrete and back. The light sections carry the
   relief, and no two of them meet.

   Services sits where Pillars sat, directly below the hero, and stays there.
   The four disciplines are the argument and they come before the proof. The
   section numbers in the build brief were a build sequence, not a page order,
   so do not reorder to match them. */
createRoot(document.getElementById('hero-root')).render(
  <React.StrictMode>
    <>
      <Header />
      <Hero />
      <Services />
      <Marquee />
      <WorkGrid />
      <CounterRow />
      <Testimonials />
      <Process />
      <Faq />
      <FooterForm />
    </>
  </React.StrictMode>
);

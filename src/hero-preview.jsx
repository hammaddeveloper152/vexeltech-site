import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import Hero from './components/home/Hero.jsx';
import Pillars from './components/home/Pillars.jsx';
import Marquee from './components/home/Marquee.jsx';
import WorkGrid from './components/home/WorkGrid.jsx';
import CounterRow from './components/home/CounterRow.jsx';

/* Ground rhythm: asphalt, asphalt, asphalt, asphalt, concrete. The one light
   section carries the relief, and no two light sections meet. */
createRoot(document.getElementById('hero-root')).render(
  <React.StrictMode>
    <>
      <Hero />
      <Pillars />
      <Marquee />
      <WorkGrid />
      <CounterRow />
    </>
  </React.StrictMode>
);

import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import Hero from './components/home/Hero.jsx';
import Pillars from './components/home/Pillars.jsx';

createRoot(document.getElementById('hero-root')).render(
  <React.StrictMode>
    <>
      <Hero />
      <Pillars />
    </>
  </React.StrictMode>
);

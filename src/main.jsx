import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/tokens.css';
import App from './App.jsx';
/* A band's photograph is fetched when the band is nearly on screen, not when
   the page loads. There is no lazy loading for a CSS background, so this is the
   thing that does it. See styles/bands.js. */
import { startBands } from './styles/bands.js';
import PageTransition from './components/site/PageTransition.jsx';
import Tracking from './components/site/Tracking.jsx';
import { captureUtm } from './components/site/utm.js';

/* The landing URL's UTM tags, read once before anything renders, so both
   forms find them wherever the reader goes next (utm.js). */
captureUtm();

/* PageTransition wraps the routes rather than sitting beside them because it
   needs the router's location to know a route changed. It does NOT control the
   location the routes render against: the transition starts already covering
   and the destination mounts on the same commit as the click, so there is
   nothing to hold. See PageTransition.jsx.

   An earlier draft passed a held location down through a function child, for a
   variant that drew its mark before the page changed. That variant was not
   taken and the machinery came out with it.  */
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Tracking />
    <PageTransition>
      <App />
    </PageTransition>
  </BrowserRouter>
);

startBands();

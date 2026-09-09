import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/tokens.css';
import App from './App.jsx';
import PageTransition from './components/site/PageTransition.jsx';

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
    <PageTransition>
      <App />
    </PageTransition>
  </BrowserRouter>
);

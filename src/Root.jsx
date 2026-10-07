import React from 'react';
import App from './App.jsx';
import PageTransition from './components/site/PageTransition.jsx';
import Tracking from './components/site/Tracking.jsx';

/* THE TREE UNDER THE ROUTER, shared by the browser (main.jsx, which hydrates
   it) and the build's server render (entry-server.jsx, which writes it into
   every prerendered page). One definition, so the two can never differ in
   shape (FINAL29, 2026-10-07). */
export default function Root() {
  return (
    <>
      <Tracking />
      <PageTransition>
        <App />
      </PageTransition>
    </>
  );
}

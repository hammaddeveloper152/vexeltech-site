import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPixel } from './pixel.js';
import { track, wireLinkEvents } from './analytics.js';

/* PageView on every route, Lead on the thanks page (2026-09-24, the
   founder's energy pass). /thanks is reached only by the legacy contact
   form; the rebuilt form fires its own Lead on its in-page success
   (LeadForm.jsx; the Plan Builder's went with it, 2026-10-01). Renders nothing. With no pixel ID both calls are
   no-ops: see pixel.js. Keyed on the path, so a hash change inside a page is
   not a second view. */
const THANKS = /^\/thanks(\.html)?\/?$/;

/* PLAUSIBLE (the launch gate, 2026-10-07): "Lead" once on /thanks, held to
   one per page load by a ref (StrictMode runs effects twice in
   development), and the phone and email clicks wired once (analytics.js).
   Plausible counts its own page views. */
export default function Tracking() {
  const { pathname } = useLocation();
  const leadSent = useRef(false);
  useEffect(() => {
    wireLinkEvents();
  }, []);
  useEffect(() => {
    trackPixel('PageView');
    if (THANKS.test(pathname)) {
      trackPixel('Lead');
      if (!leadSent.current) {
        leadSent.current = true;
        track('Lead');
      }
    }
  }, [pathname]);
  return null;
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPixel } from './pixel.js';

/* PageView on every route, Lead on the thanks page (2026-09-24, the
   founder's energy pass). Renders nothing. With no pixel ID both calls are
   no-ops: see pixel.js. Keyed on the path, so a hash change inside a page is
   not a second view. */
const THANKS = /^\/thanks(\.html)?\/?$/;

export default function Tracking() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPixel('PageView');
    if (THANKS.test(pathname)) trackPixel('Lead');
  }, [pathname]);
  return null;
}

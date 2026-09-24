import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CALL_HREF, CALL_LABEL } from '../../pages/site/parts.jsx';
import './StickyCta.css';

/* THE MOBILE STICKY CALL, 2026-09-24 (the founder's energy pass, CRO for paid
   traffic). Below 768px, once the page's first section (the hero on home, the
   page head elsewhere) has left the viewport, a 56px bar is fixed to the
   bottom of the screen with the yellow "Get a custom quote" in it, on the
   base ground with a top hairline. Hidden from 768 up (StickyCta.css).

   It also stands down in three places, and those are this build's calls,
   recorded in DESIGN.md:
     - on /contact-us, where it would link to the page it is on;
     - while the Plan Builder is on screen, which has its own bottom bar;
     - while the footer form is on screen, the call's own destination, so the
       bar never sits over the form's Send.

   Off, it is `inert` and hidden from assistive tech, so it is never a tab
   stop the reader cannot see. */
export default function StickyCta() {
  const { pathname } = useLocation();
  const [past, setPast] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    /* The block holding the page's h1: the hero on home, the page head
       elsewhere (a <header> on /pricing, a <section> on the rest). */
    const h1 = document.querySelector('main#main h1');
    const first = h1 ? h1.closest('section, header') : null;
    const blockers = [...document.querySelectorAll('main#main .plan, main#main .foot__inner')];
    const inView = new Map();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === first) setPast(!e.isIntersecting && e.boundingClientRect.top < 0);
        else inView.set(e.target, e.isIntersecting);
      }
      setBlocked([...inView.values()].some(Boolean));
    });
    if (first) io.observe(first);
    blockers.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, [pathname]);

  if (pathname.startsWith('/contact')) return null;
  const on = past && !blocked;

  return (
    <div className="stick" data-on={on ? 'true' : 'false'} inert={!on} aria-hidden={!on}>
      <Link className="stick__btn" to={CALL_HREF}>
        {CALL_LABEL}
      </Link>
    </div>
  );
}

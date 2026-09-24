import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from './smoothScroll.js';
import './WordBand.css';

gsap.registerPlugin(ScrollTrigger);

/* THE WORDMARK BAND, 2026-09-24 (the founder's Monolog pass). It replaces
   the strike ticker under What we do: "VEXELTECH" in Clash Display Medium at
   20vw, one line, bone at 70%, cropped at both edges by the band, drifting
   6% sideways across the band's own scroll. No image.

   THE DRIFT is a ScrollTrigger scrub on the band's passage through the
   viewport, from +3% to -3% of the word's width, on transform alone. The
   scrub reads the same clock Lenis drives (smoothScroll.js puts `lenis.raf`
   on gsap's ticker), which is why this component now calls
   `useSmoothScroll()`: the ticker it replaces was what started Lenis on the
   home page, and the route's scrub below depends on it. Reduced motion: the
   word stands still, centred.

   Decorative: the wordmark in the bar already names the company, and a
   screen reader gains nothing from the word read out again. */
export default function WordBand() {
  useSmoothScroll();
  const bandRef = useRef(null);
  const wordRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordRef.current,
        { xPercent: 3 },
        {
          xPercent: -3,
          ease: 'none',
          scrollTrigger: {
            trigger: bandRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, bandRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="vt wordband" ref={bandRef} aria-hidden="true">
      <p className="wordband__word" ref={wordRef}>
        VEXELTECH
      </p>
    </div>
  );
}

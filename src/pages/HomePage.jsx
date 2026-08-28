import React, { useEffect, useRef } from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import homeBody from '../legacy/home-body.html?raw';
import homeScripts from '../legacy/home-scripts.js?raw';

function runWhenReady(code, setTimerRef) {
  const run = () => {
    try {
      new Function(code)();
    } catch (err) {
      console.error('VexelTech home motion error:', err);
      document.documentElement.classList.remove('g-wait');
    }
  };
  if (window.gsap && window.THREE) {
    run();
  } else {
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if ((window.gsap && window.THREE) || tries > 100) {
        clearInterval(timer);
        run();
      }
    }, 50);
    setTimerRef(timer);
  }
}

export default function HomePage() {
  const ref = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const host = ref.current;
    if (host) {
      host.innerHTML = homeBody;
    }
    document.title = 'Website Design for Startups & Small Business | VexelTech';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content =
      'Branding, websites, marketing and automation for startups, SMBs and founders. We show up with the work already built. Book a 15-minute call.';

    runWhenReady(homeScripts, (t) => {
      timerRef.current = t;
    });

    window.scrollTo(0, 0);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      try {
        if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach((t) => t.kill());
      } catch {}
      try {
        if (window.gsap) window.gsap.globalTimeline.clear();
      } catch {}
      if (host) {
        host.innerHTML = '';
      }
    };
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <div ref={ref} />
      <SiteFooter />
    </>
  );
}

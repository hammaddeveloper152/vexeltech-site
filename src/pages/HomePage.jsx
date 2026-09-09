import React, { useEffect, useRef } from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import homeBody from '../legacy/home-body.html?raw';
import homeScripts from '../legacy/home-scripts.js?raw';

/* three.js and GSAP used to be three <script defer> tags in index.html. They
   are here now, because `/` is the rebuild and this page is the only thing on
   the site that needs them. Leaving them in the document head would have put
   three cdnjs requests on every page of the rebuild, which is exactly what
   DESIGN.md's "no third-party request on page load" and its rule about
   bundling GSAP rather than loading it from a CDN are about.

   The rebuild does not use these copies. It imports gsap and ScrollTrigger
   from npm and bundles them; `window.gsap` is a separate instance that only
   the legacy inline script below ever reads. */
const CDN = [
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
];

function loadLegacyVendors() {
  CDN.forEach((src) => {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement('script');
    s.src = src;
    s.async = false; /* ScrollTrigger needs gsap to have run first. */
    s.dataset.legacy = 'vendor';
    document.head.appendChild(s);
  });
}

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

    loadLegacyVendors();

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

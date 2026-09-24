import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

/* ==========================================================================
   THE ROUTE SWAP. BUILD-LAW.md pre-flight step 12, done.

   `/` served the legacy site for the whole rebuild because `main.jsx`
   imported an unscoped 9,960-line `styles.css` that opened with bare-element
   resets. That stylesheet is now `styles.legacy.css`, every one of its 1,500
   selectors rewritten to require `.lg`, and it is imported by
   `legacy/LegacyShell.jsx` and nothing else. The condition the step named is
   met, so the swap is made here.

   ---- Two trees, and which owns which path ------------------------------

   THE REBUILD OWNS FIVE DESTINATIONS since 2026-09-25: `/`, `/services`,
   `/pricing`, `/about-us`, `/contact-us`. `/resources`, `/portfolio` and
   `/case-studies` had no content and were removed with their pages
   (netlify.toml sends them to `/`).

   WHAT IS LEFT OF THE LEGACY TREE is three pages: the two legal pages and
   the thanks page, all noindex. The rule the legacy audit produced stands:
   **a URL is kept only while what it says is true.**

   THE ALIASES POINT AT THE REBUILD: `/packages`, `/pricing/`, `/contact`,
   `/about` and the rest resolve to the rebuilt page for their destination.

   ---- Lazy, and why it is not premature ---------------------------------

   Every legacy route is `lazy()`. That is what keeps the legacy stylesheet
   and the legacy component tree out of the bundle a reader gets on `/`.
   Without it the scoping would stop the styles LEAKING but the bytes would
   still ship, and 165 KB of stylesheet for a page that cannot use one of its
   rules is the same waste the tile ladder was about.
   ========================================================================== */

/* The rebuild. Eager: these are the site, and the homepage must not wait on
   a chunk to start its entrance. */
import Home from './pages/site/Home.jsx';
import ServicesPage from './pages/site/ServicesPage.jsx';
import PricingPage from './pages/site/PricingPage.jsx';
import ContactPage from './pages/site/ContactPage.jsx';
import AboutPage from './pages/site/AboutPage.jsx';
import NotFoundPage from './pages/site/NotFoundPage.jsx';

/* The legacy tree. Lazy, and every one of them wrapped in LegacyShell.

   Three remain: /thanks, the Privacy Policy and the Terms of Service. The
   superseded legacy pages, /blog and /legacy/contact were DELETED from the
   repo on 2026-09-25 (the founder's cleanup); git history holds them. */
const LegacyShell = lazy(() => import('./legacy/LegacyShell.jsx'));
const LegacySimple = lazy(() => import('./pages/SimplePage.jsx'));
const LegacyThanks = lazy(() => import('./pages/ThanksPage.jsx'));

/* Nothing visible while a legacy chunk arrives. A spinner here would be a
   loading state DESIGN.md has not specified, and inventing one is inventing
   a component. The chunk is local and the gap is a frame or two. */
function Legacy({ children }) {
  return (
    <Suspense fallback={null}>
      <LegacyShell>{children}</LegacyShell>
    </Suspense>
  );
}

const legacy = (node) => <Legacy>{node}</Legacy>;

export default function App() {
  return (
    <Routes>
      {/* ---- The rebuild: five destinations since 2026-09-25 -------------- */}
      <Route path="/" element={<Home />} />

      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/" element={<ServicesPage />} />

      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/pricing/" element={<PricingPage />} />
      <Route path="/packages" element={<PricingPage />} />

      <Route path="/about-us" element={<AboutPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/about/" element={<AboutPage />} />

      <Route path="/contact-us" element={<ContactPage />} />
      <Route path="/contact-us/" element={<ContactPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* /portfolio, /case-studies, /resources (and /work, /portfolio.html),
          /blog and /legacy/contact are GONE, 2026-09-25 (the founder's repo
          cleanup): no content, so their routes, pages and styles are
          deleted, and netlify.toml sends each to / with a 301. */}

      {/* ---- The four sub-service pages are GONE, 2026-09-08 ------------

          All four carried a price, and every one of them contradicted the
          sheet or had no source at all:

            /services/branding    $1,800
            /services/websites    $2,500   against a $700 website
            /services/marketing   $1,500   marketing is quoted, not priced
            /services/automation  $1,200   automation is scoped per job

          `/industries` went with them: 92%, 340% and 100% as performance
          figures, none of them sourced, plus 9 dashes including an em dash
          in its title tag.

          THE URLS ARE NOT DEAD. Each redirects to the rebuilt `/services`,
          which covers all four disciplines at full length, and to that
          discipline's own block on it. A redirect is right here where a 404
          was right for `/legacy/...`: those were superseded duplicates of
          pages that exist, these are paths whose subject still has a home.

          `/industries` is the exception and it 404s. There is no industries
          page on the rebuild and sending a reader to `/services` instead
          would be answering a different question. */}
      <Route path="/services/branding" element={<Navigate to="/services#branding" replace />} />
      <Route path="/branding" element={<Navigate to="/services#branding" replace />} />
      <Route path="/branding/" element={<Navigate to="/services#branding" replace />} />

      <Route path="/services/websites" element={<Navigate to="/services#websites" replace />} />
      <Route path="/services/web-development" element={<Navigate to="/services#websites" replace />} />
      <Route path="/web-development" element={<Navigate to="/services#websites" replace />} />
      <Route path="/web-development/" element={<Navigate to="/services#websites" replace />} />
      <Route path="/websites.html" element={<Navigate to="/services#websites" replace />} />

      <Route path="/services/marketing" element={<Navigate to="/services#marketing" replace />} />
      <Route path="/marketing" element={<Navigate to="/services#marketing" replace />} />
      <Route path="/marketing/" element={<Navigate to="/services#marketing" replace />} />

      <Route path="/services/automation" element={<Navigate to="/services#automation" replace />} />
      <Route path="/automation" element={<Navigate to="/services#automation" replace />} />
      <Route path="/automation/" element={<Navigate to="/services#automation" replace />} />

      {/* ---- Legacy: the pages the rebuild has not reached -------------- */}
      <Route path="/thanks" element={legacy(<LegacyThanks />)} />
      <Route path="/thanks.html" element={legacy(<LegacyThanks />)} />
      <Route path="/privacy-policy" element={legacy(<LegacySimple title="Privacy Policy" />)} />
      <Route path="/privacy-policy/" element={legacy(<LegacySimple title="Privacy Policy" />)} />
      <Route path="/privacy.html" element={legacy(<LegacySimple title="Privacy Policy" />)} />
      <Route path="/terms-of-service" element={legacy(<LegacySimple title="Terms of Service" />)} />
      <Route
        path="/terms-of-service/"
        element={legacy(<LegacySimple title="Terms of Service" />)}
      />
      <Route path="/terms.html" element={legacy(<LegacySimple title="Terms of Service" />)} />


      {/* THE NOT-FOUND ROUTE IS THE REBUILD'S, 2026-09-15. It was the legacy
          NotFound in the legacy shell; `/404` names it and `*` catches the
          rest. */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

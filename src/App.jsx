import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

/* ==========================================================================
   THE ROUTES, 2026-09-25.

   The site is five pages: `/`, `/services`, `/pricing`, `/about-us`,
   `/contact-us`, plus the Privacy Policy, the Terms of Service and /thanks,
   which are noindex. Every page is on the site's shell. THE LEGACY TREE IS
   GONE: its last three pages were rebuilt and `styles.legacy.css`,
   `LegacyShell` and `SecondaryLayout` were deleted (the founder's legacy
   rebuild). The rule its audit produced stands: **a URL is kept only while
   what it says is true.**

   THE ALIASES POINT AT THE PAGE FOR THEIR DESTINATION: `/packages`,
   `/pricing/`, `/contact`, `/about`, `/privacy.html` and the rest. The
   routes with no content (/blog, /resources, /portfolio, /case-studies,
   /legacy/contact) are removed and 301 to `/` in netlify.toml.
   ========================================================================== */

/* The rebuild. Eager: these are the site, and the homepage must not wait on
   a chunk to start its entrance. */
import Home from './pages/site/Home.jsx';
import ServicesPage from './pages/site/ServicesPage.jsx';
import PricingPage from './pages/site/PricingPage.jsx';
import ContactPage from './pages/site/ContactPage.jsx';
import AboutPage from './pages/site/AboutPage.jsx';
import NotFoundPage from './pages/site/NotFoundPage.jsx';

/* THE LEGAL PAGES AND /thanks, rebuilt on the site's shell 2026-09-25 (the
   founder's legacy rebuild). Lazy, so the legal text (about 40KB) stays out
   of the bundle a reader gets on `/`. Nothing shows while the chunk arrives:
   it is local and the gap is a frame or two. */
const LegalPage = lazy(() => import('./pages/site/LegalPage.jsx'));
const ThanksPage = lazy(() => import('./pages/site/ThanksPage.jsx'));
const later = (node) => <Suspense fallback={null}>{node}</Suspense>;

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

      {/* ---- The legal pages and /thanks, on the site's shell ------------ */}
      <Route path="/thanks" element={later(<ThanksPage />)} />
      <Route path="/thanks.html" element={later(<ThanksPage />)} />
      <Route path="/privacy-policy" element={later(<LegalPage kind="privacy" />)} />
      <Route path="/privacy-policy/" element={later(<LegalPage kind="privacy" />)} />
      <Route path="/privacy.html" element={later(<LegalPage kind="privacy" />)} />
      <Route path="/terms-of-service" element={later(<LegalPage kind="terms" />)} />
      <Route path="/terms-of-service/" element={later(<LegalPage kind="terms" />)} />
      <Route path="/terms.html" element={later(<LegalPage kind="terms" />)} />


      {/* THE NOT-FOUND ROUTE IS THE REBUILD'S, 2026-09-15. It was the legacy
          NotFound in the legacy shell; `/404` names it and `*` catches the
          rest. */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

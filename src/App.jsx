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

   THE REBUILD OWNS THE EIGHT DESTINATIONS from content answer 10.1. They are
   the site: `/`, `/services`, `/pricing`, `/about-us`, `/contact-us`,
   `/resources`, `/portfolio`, `/case-studies`.

   WHAT IS LEFT OF THE LEGACY TREE is four pages: the blog, the two legal
   pages and the thanks page, plus `/legacy/contact`. Everything else has
   been audited off. The rule that emerged is not "keep old pages" but:
   **a URL is kept only while what it says is true.** A page that is merely
   old stays; a page that publishes a price, a metric or a client the source
   does not support comes off, whoever wrote it.

   WHERE THE TWO COLLIDE, THE REBUILD WINS AND THE OLD PAGE IS GONE.
   Six paths were legacy pages and are now rebuilt pages. The superseded
   originals were parked under `/legacy/...` for a day and then audited; five
   of the six came off the router because they render a disputed price, an
   invented client, or an unsourced metric. Only `/legacy/contact` survives.
   The reasoning and the audit are at that route, below.

   THE ALIASES NOW POINT AT THE REBUILD, not at the legacy page they used to
   reach. `/packages`, `/pricing/`, `/contact`, `/work`, `/case-studies` and
   the rest resolve to the rebuilt page for their destination, because an
   alias exists to send a reader to the canonical page and the canonical page
   moved.

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
import {
  AboutPage,
  PortfolioPage,
  CaseStudiesPage,
  ResourcesPage,
} from './pages/site/OneScreenPages.jsx';

/* The legacy tree. Lazy, and every one of them wrapped in LegacyShell.

   TEN legacy components are deliberately NOT imported here any more. Their
   routes came off on 2026-09-08 and an import with no route would put them
   back in the bundle for nothing. The files all stay on disk.

     HomePage, Services, Packages, About, Portfolio  superseded duplicates
     WebDevelopment, Branding, Marketing, Automation each carried a price
     Industries                                      unsourced percentages

   See the notes by the redirects and by `/legacy/contact`. */
const LegacyShell = lazy(() => import('./legacy/LegacyShell.jsx'));
const LegacyContact = lazy(() => import('./pages/Contact.jsx'));
const LegacyBlog = lazy(() => import('./pages/Blog.jsx'));
const LegacySimple = lazy(() => import('./pages/SimplePage.jsx'));
const LegacyThanks = lazy(() => import('./pages/ThanksPage.jsx'));
const LegacyNotFound = lazy(() => import('./pages/NotFound.jsx'));

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
      {/* ---- The rebuild: the eight destinations, 10.1 ------------------ */}
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

      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/portfolio/" element={<PortfolioPage />} />
      <Route path="/portfolio.html" element={<PortfolioPage />} />
      <Route path="/work" element={<PortfolioPage />} />
      <Route path="/work/" element={<PortfolioPage />} />

      <Route path="/case-studies" element={<CaseStudiesPage />} />
      <Route path="/case-studies/" element={<CaseStudiesPage />} />

      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/resources/" element={<ResourcesPage />} />

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
      <Route path="/blog" element={legacy(<LegacyBlog />)} />

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

      {/* ---- The superseded pages: FIVE OF SIX ARE OFF THE ROUTER -------

          They were parked under `/legacy/...` on the reasoning that deleting
          a working URL to tidy a diff is worse than keeping it. Audited on
          2026-09-08 with `.measure/legacyaudit.mjs`, that reasoning does not
          survive what is actually on them. A superseded page is only worth
          keeping if it is merely OLD; these are wrong, and a wrong page on a
          live path is worse than a dead link.

          | Path | Off, because |
          |---|---|
          | `/legacy/home` | renders the disputed **$700** twice, claims "127 REVIEWS" and "8 stars", prints a mock phone number `(713) 555-0142`, and carries 7 dashes |
          | `/legacy/packages` | six prices, **$990 to $5,990**, none of which appear on the pricing sheet at all, plus 3 dashes |
          | `/legacy/portfolio` | **invents clients and case studies outright** — "Glamour Aroma", "Nexus Systems" — while source section 5, THE WORK, is blank. The worst Truth breach found on this site |
          | `/legacy/about` | invents a founder story, a philosophy and a pull quote presented as a quotation |
          | `/legacy/services` | "$0 Agency Retainer", "3-4 WK Average Delivery" and "100% Client Ownership" as stat tiles, none of them sourced, and the delivery figure contradicts the content answers |

          THE COMPONENTS ARE NOT DELETED. They are in `src/pages/` and one
          line each brings them back. What is removed is public reachability.

          `/legacy/contact` STAYS, and it is the only one that passes all
          three tests: no price, no invented client or metric, no dash. It
          duplicates `/contact-us`, so it is arguably pointless rather than
          harmful, and pointless is not a reason to delete a URL. */}
      <Route path="/legacy/contact" element={legacy(<LegacyContact />)} />

      <Route path="*" element={legacy(<LegacyNotFound />)} />
    </Routes>
  );
}

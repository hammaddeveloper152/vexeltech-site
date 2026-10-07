import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

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

/* EVERY PAGE IS ITS OWN CHUNK, 2026-10-01 (the founder's bundle split). A
   reader downloads the page they land on and nothing else before it paints.
   Until now the five pages were eager, in one 151 KB (gzipped) bundle every
   route ran before anything painted. The shell, the bar and the footer stay
   in the main chunk: Shell is imported below for that, and Home pulls the bar
   and the footer from the same modules.

   NO WATERFALL ON THE LANDING PAGE: the build writes the landing route's
   chunk into index.html as a modulepreload, before the main script
   (vite.config.js, `vt-route-preload`), so the two arrive together.

   NO WAIT ON A LATER NAVIGATION: three seconds after the landing page has
   loaded, when the browser is idle, the other pages are fetched (not
   sooner: fetched at load they shared the slow connection with the
   landing page's LCP), and a page fetched that way
   renders on the click's own commit, as it did when everything was eager.
   PageTransition depends on that: the destination mounts under the plane on
   the same commit (PageTransition.jsx). `page()` returns a thenable that
   answers synchronously once the module is in, which React.lazy reads
   without suspending. */

function page(load) {
  let mod = null;
  const fetchPage = () =>
    load().then((m) => {
      mod = m;
      return m;
    });
  const Page = lazy(() => (mod ? { then: (resolve) => resolve(mod) } : fetchPage()));
  Page.prefetch = fetchPage;
  return Page;
}

const Home = page(() => import('./pages/site/Home.jsx'));
const ServicesPage = page(() => import('./pages/site/ServicesPage.jsx'));
const PricingPage = page(() => import('./pages/site/PricingPage.jsx'));
const ContactPage = page(() => import('./pages/site/ContactPage.jsx'));
const AboutPage = page(() => import('./pages/site/AboutPage.jsx'));
const NotFoundPage = page(() => import('./pages/site/NotFoundPage.jsx'));

/* The shell, in the main chunk. After the pages in the source, because the
   stylesheet order is read from it (vite.config.js, `vt-css-order`). */
import './pages/site/Shell.jsx';

const PAGES = [Home, ServicesPage, PricingPage, ContactPage, AboutPage];

if (typeof window !== 'undefined') {
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  const prefetch = () =>
    setTimeout(() => idle(() => PAGES.forEach((P) => P.prefetch().catch(() => {}))), 3000);
  if (document.readyState === 'complete') prefetch();
  else window.addEventListener('load', prefetch, { once: true });
}

/* THE LEGAL PAGES AND /thanks, rebuilt on the site's shell 2026-09-25 (the
   founder's legacy rebuild). Lazy, so the legal text (about 40KB) stays out
   of the bundle a reader gets on `/`. Not prefetched: they are reached from
   the footer and the form, rarely. Nothing shows while a chunk arrives: it
   is local and the gap is a frame or two. */
const LegalPage = lazy(() => import('./pages/site/LegalPage.jsx'));
const ThanksPage = lazy(() => import('./pages/site/ThanksPage.jsx'));

/* A trailing slash, or a trailing /index.html, is taken off in place, so the
   router never renders a page under a second URL (the server does the same
   with a 301). */
function Canonical() {
  const { pathname, search, hash } = useLocation();
  const clean = pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
  if (clean === pathname) return null;
  return <Navigate to={`${clean}${search}${hash}`} replace />;
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <Canonical />
      <Routes>
        {/* ---- The rebuild: five destinations since 2026-09-25 -------------- */}
        <Route path="/" element={<Home />} />

        {/* ONE URL PER PAGE (the launch gate, 2026-10-07): an alias is a
            redirect to the canonical URL, as it is on the server
            (htaccess-append.txt), never a second copy of the page. A
            trailing slash is taken off by <Canonical /> above. */}
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/packages" element={<Navigate to="/pricing" replace />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/about" element={<Navigate to="/about-us" replace />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/contact" element={<Navigate to="/contact-us" replace />} />

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

        <Route path="/services/websites" element={<Navigate to="/services#websites" replace />} />
        <Route path="/services/web-development" element={<Navigate to="/services#websites" replace />} />
        <Route path="/web-development" element={<Navigate to="/services#websites" replace />} />
        <Route path="/websites.html" element={<Navigate to="/services#websites" replace />} />

        <Route path="/services/marketing" element={<Navigate to="/services#marketing" replace />} />
        <Route path="/marketing" element={<Navigate to="/services#marketing" replace />} />

        <Route path="/services/automation" element={<Navigate to="/services#automation" replace />} />
        <Route path="/automation" element={<Navigate to="/services#automation" replace />} />

        {/* ---- The legal pages and /thanks, on the site's shell ------------ */}
        <Route path="/thanks" element={<ThanksPage />} />
        <Route path="/thanks.html" element={<Navigate to="/thanks" replace />} />
        <Route path="/privacy-policy" element={<LegalPage kind="privacy" />} />
        <Route path="/privacy.html" element={<Navigate to="/privacy-policy" replace />} />
        <Route path="/terms-of-service" element={<LegalPage kind="terms" />} />
        <Route path="/terms.html" element={<Navigate to="/terms-of-service" replace />} />


        {/* THE NOT-FOUND ROUTE IS THE REBUILD'S, 2026-09-15. It was the legacy
            NotFound in the legacy shell; `/404` names it and `*` catches the
            rest. */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

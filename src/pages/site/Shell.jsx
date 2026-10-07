import React, { useEffect } from 'react';
import Header from '../../components/site/Header.jsx';
import { skipToMain } from '../../components/site/skip.js';
import ClosingForm from '../../components/site/ClosingForm.jsx';
import SiteFooter from '../../components/site/SiteFooter.jsx';
import { setHead, setBreadcrumb } from './head.js';
import '../../styles/tokens.css';
import '../../styles/register.css';

/* Every rebuilt page except the homepage.

   THE FORM IS ON EVERY ROUTE, 2026-09-21, by the user: every page ends in
   `FooterForm`, "Get in touch", the form, the email under it, then the pages
   row and the base. The homepage composes it itself (`Home.jsx`); the Contact
   page passes `meta={false}` and renders its own.

   ---- What this shell owns ----------------------------------------------

   The bar, the skip link, the one `<main>` landmark, the title and the meta
   description. Not the ground: that is `tokens.css` on the page element,
   because a wrapper painting its own asphalt would be a second surface.

   `register.css` is imported LAST, exactly as it is on the homepage, so it
   wins on source order over any section stylesheet a page brings with it. */

/* `barOver`: the page opens on a film or surface hero, and the bar stands over
   it (Header.css, 2026-09-15). */
/* The ground is the root's since 2026-09-24 (lit.css): one drift for every
   page, so the `driftTo` prop this shell took is gone. */
export default function Shell({
  title,
  description,
  meta = true,
  /* `footerForm={false}`: the page ends on the footer block alone, with no
     contact form (About, since 2026-09-25). */
  footerForm = true,
  /* `light`: the route is the light page (About, since 2026-09-25): a
     cream ground for the whole route, set on the document root while the
     route is mounted (light.css). */
  light = false,
  /* `path`: the page's canonical path, and `noindex` for the 404
     (head.js, the release audit, 2026-09-25). */
  path,
  noindex = false,
  barOver = false,
  children,
}) {
  useEffect(() => {
    if (!light) return undefined;
    const root = document.documentElement;
    root.dataset.ground = 'light';
    return () => {
      delete root.dataset.ground;
    };
  }, [light]);

  /* The title, description, canonical and Open Graph tags (head.js). */
  useEffect(() => setHead({ title, description, path, noindex }), [title, description, path, noindex]);
  /* The breadcrumb of an inner page (final22): Home, then the page, named
     by its title's first part. */
  useEffect(() => {
    if (noindex || !path || path === '/') return undefined;
    return setBreadcrumb(title.split(' | ')[0], path);
  }, [title, path, noindex]);

  useEffect(() => {
    /* A route change is not a scroll, so nothing restores the position.
       EXCEPT A FRAGMENT, 2026-09-15: the About cards link to
       `/services#<id>`, and scrolling to the top threw the fragment away. The
       target's own `scroll-margin-top` clears the sticky bar. */
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (target) requestAnimationFrame(() => target.scrollIntoView());
    else window.scrollTo(0, 0);
  }, [title, description]);

  return (
    <>
      <a className="skip" href="#main" onClick={skipToMain}>
        Skip to content
      </a>
      <Header over={barOver} />
      <main id="main" tabIndex={-1}>
        {children}
        {/* THE FORM, its own cream section since final32 (2026-10-07):
            not on Contact (`meta={false}`, it has its own form), nor where
            `footerForm={false}` (the legal pages, /thanks). Since final34
            this is the closing section, "Ready when you are." */}
        {meta && footerForm ? (
          <ClosingForm heading="Ready when you are." line="A written number within one business day." />
        ) : null}
      </main>
      {/* THE FOOTER, after <main> on every page, so it is the page's
          contentinfo landmark (SiteFooter.jsx, final32). */}
      <SiteFooter />
    </>
  );
}

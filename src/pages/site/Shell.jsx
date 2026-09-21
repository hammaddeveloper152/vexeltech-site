import React, { useEffect } from 'react';
import IconProvider from '../../components/site/Icons.jsx';
import Header from '../../components/site/Header.jsx';
import FooterForm from '../../components/home/FooterForm.jsx';
import useDrift, { at } from '../../components/site/useDrift.js';
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
/* `driftTo`: the section where this page's drift reaches arc-black and holds
   through the footer (2026-09-21: no route has a flat ground). The base
   (#0B0B0D) at the top; the footer by default. Services passes its last discipline, About its
   How it goes, Pricing its Plan Builder. */
export default function Shell({
  title,
  description,
  meta = true,
  barOver = false,
  driftTo = 'footer.foot',
  children,
}) {
  useDrift(() => [
    ['--c-base', 0],
    ['--c-arc-black', at(driftTo)],
  ]);

  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = description;
    }
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
    <IconProvider>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header over={barOver} />
      <main id="main" tabIndex={-1}>
        {children}
        {/* The Contact page passes meta={false}: it renders FooterForm
            itself, and two would be the form twice.

            The footer is `vt foot` inside FooterForm, which is load-bearing:
            tokens.css applies the ground per SECTION, and a footer rendered
            bare once sat on the UA's white body on six pages. */}
        {meta ? <FooterForm /> : null}
      </main>
    </IconProvider>
  );
}

import React, { useEffect } from 'react';
import IconProvider from '../../components/site/Icons.jsx';
import Header from '../../components/site/Header.jsx';
import FooterMeta from '../../components/home/FooterMeta.jsx';
import '../../components/home/FooterForm.css';
import '../../styles/tokens.css';
import '../../styles/register.css';

/* Every rebuilt page except the homepage.

   The homepage keeps its own composition (`Home.jsx`) because it ends in the
   footer FORM, which is a section of that page rather than a site chrome
   element. Everything else ends in the meta row alone — the wordmark, the
   site map, the contact block and the legal line — which is why `FooterMeta`
   was split out of `FooterForm` rather than copied.

   The Contact page is the exception in the other direction: it is the form,
   so it composes the two itself.

   ---- What this shell owns ----------------------------------------------

   The bar, the skip link, the one `<main>` landmark, the title and the meta
   description. Not the ground: that is `tokens.css` on the page element,
   because a wrapper painting its own asphalt would be a second surface.

   `register.css` is imported LAST, exactly as it is on the homepage, so it
   wins on source order over any section stylesheet a page brings with it. */

export default function Shell({ title, description, meta = true, children }) {
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
    /* A route change is not a scroll, so nothing restores the position. */
    window.scrollTo(0, 0);
  }, [title, description]);

  return (
    <IconProvider>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
        {/* The Contact page passes meta={false}: it ends in FooterForm,
            which carries the meta row itself, and two of them on one page
            would be the site map twice.

            THE `vt foot` WRAPPER IS LOAD-BEARING AND WAS MISSING. tokens.css
            applies the ground per SECTION, and on the homepage this row is
            inside FooterForm's own `<footer className="vt foot">`. Rendered
            bare into `<main>` it inherited nothing, so it sat on the UA's
            white body: shop white wordmark, shop white links and steel-dark
            keys, all on white, on all six pages that use this shell.

            Every measurement passed. The route check read `body` background,
            saw white, and recorded it as correct because the sections paint
            over it — which they do, and this row was not one of them. A
            SCREENSHOT CAUGHT IT, which is the second time on this project
            that a passing measurement has been wrong about paint. */}
        {meta ? (
          <footer className="vt foot">
            <div className="foot__inner">
              <FooterMeta />
            </div>
          </footer>
        ) : null}
      </main>
    </IconProvider>
  );
}

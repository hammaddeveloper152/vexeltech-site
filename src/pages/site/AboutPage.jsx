import React from 'react';
import Shell from './Shell.jsx';
import Brush from '../../components/site/Brush.jsx';
import '../../styles/aboutpage.css';
import '../../styles/light.css';

/* THE ABOUT PAGE, REBUILT 2026-09-25 (the founder; chong.studio/info). Four
   blocks of text and then the footer: no cards, no timeline, no facts table,
   no FAQ, no closing call and no form on this page. Every line is the
   founder's, verbatim.

   THE LIGHT PAGE since the three-colour pass (2026-09-25): a cream ground
   for the whole route (Shell's `light`, light.css), the blocks on it in
   asphalt, "What we do" an inset black block, the footer block black.

     1  Statement    cream   the Monigue line with the swash on "phone", and
                             two paragraphs under it in two columns from 1024
     2  What we do   black   the four disciplines and an example of each, a
                             plain two-column list, and the line to home's
                             How it works
     3  Definition   cream   one centred sentence under its mono label
     4  Contact      cream   clients and partners, a label, a line, the email

   SINCE COPY V3 (2026-10-01) ONLY BLOCK 1 IS BUILT: 2, 3 and 4 had no V3
   lines and came off.

   Taken off: Where we come from, What we build it around (the cards), Who we
   are for, Key facts, Questions, the founder's note, the closing call and the
   contact form. The footer block closes the page without the form (Shell's
   `footerForm={false}`). The history of the page is in git and DESIGN.md. */

export default function AboutPage() {
  return (
    <Shell
      title="About VexelTech: websites, ads and automation for the trades"
      path="/about-us"
      description="One team for the website, the campaigns and the follow-up behind US home service businesses. Flat prices, four-day builds, everything in your name."
      footerForm={false}
      light
    >
      {/* 1. THE STATEMENT. */}
      <section className="vt ab3-hero" aria-labelledby="ab3-hero-h">
        <div className="ab3__in">
          <h1 className="ab3-hero__h" id="ab3-hero-h">
            {/* COPY V3, 2026-10-01. The page's one highlighted word, the
                swash (Brush.jsx), moved from "phone" to "called." */}
            Found, trusted,{' '}
            <Brush className="brush--hl" thickness="fit" angle={-2} at="52%">
              called.
            </Brush>
          </h1>
          <div className="ab3-hero__cols">
            {/* COPY V3, 2026-10-01 (VEXELTECH-COPY.md, About us, Hero
                statement). */}
            <p className="ab3-hero__p">
              The site a customer lands on, the campaigns that send them there, and the follow-up
              that catches the call. One team builds all three.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE DO, THE DEFINITION AND CONTACT CAME OFF, 2026-10-01:
          COPY V3 gives them no lines. V3's About sections (Where we come
          from, What we build it around, Who we are for, How we work with
          you, Key facts, Questions, the closing call) wait for the
          structure pass (DESIGN.md, COPY V3). */}
    </Shell>
  );
}

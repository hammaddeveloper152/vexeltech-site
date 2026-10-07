import React, { useEffect } from 'react';
import Shell from './Shell.jsx';
import OriginStory from '../../components/story/OriginStory.jsx';
import WeekStrip from '../../components/artifacts/WeekStrip.jsx';
import OneTeam from '../../components/artifacts/OneTeam.jsx';
import FitColumns from '../../components/story/FitColumns.jsx';
import TermsCard from '../../components/story/TermsCard.jsx';
import { CallBand } from './parts.jsx';
import { FIGURES, money } from '../../content/pricing.js';
import '../../styles/aboutpage.css';
import '../../styles/light.css';

/* THE ABOUT PAGE, ONE OBJECT PER SECTION (the storytelling pass,
   2026-10-01, the founder):

     the statement                the Monigue line, its words rising on load
     One team (dark)              OneTeam: four lanes into one
     Why we exist                 OriginStory: four beats (final28)
     Four business days (dark)    WeekStrip: the week, Monday to live
     Who we are for               FitColumns: two columns, a rule between
     How we work with you         TermsCard: the contract (final28)
     the close                    CallBand field (the launch gate)

   It replaced home's route (twice), home's discipline cards, the fit cards
   and the facts table, all of which repeated objects found elsewhere on the
   site. The final artifacts pass (2026-10-03, the founder) took out The
   record and What we build it around (their lines are in the archive
   section of VEXELTECH-COPY.md) and put the week strip in.

   THE LIGHT PAGE since the three-colour pass (2026-09-25): a cream ground
   for the whole route (Shell's `light`, light.css). The footer block closes
   the page; since final34 (2026-10-08) the closing section with the form
   comes first ("Ready when you are.").

   EVERY LINE IS VEXELTECH-COPY.md V3.1's, About us. The page's earlier
   shapes are in git and DESIGN.md. */
/* THE QUESTIONS ARE GONE (final28, 2026-10-07, the founder): "Questions
   about working with us" is deleted, and with it the page's FAQPage data.
   The seven are in VEXELTECH-COPY.md, marked off. The regions they named
   are still on the page, in Who this is for's note. */

/* THE META DESCRIPTION, COPY V4, 2026-10-06. The figures are FIGURES'. */
const ABOUT_DESCRIPTION = `A web design and small business marketing agency. Websites ${money(FIGURES.website)} flat, branding from ${money(FIGURES.brandingBasic)}, ads measured by cost per lead. One team, one invoice.`;

/* The statement, word by word. COPY V4, 2026-10-06: it was "Found,
   trusted, called."; the same type and the same rise on each word. */
const WORDS = 'A web design and marketing agency built for small businesses.'.split(' ');

export default function AboutPage() {
  /* MONIGUE IS PRELOADED HERE ONLY (final26, 2026-10-07): About is the one
     route that paints Monigue above the fold. The tag is in the head when
     the page is prerendered, so about-us/index.html carries it; the other
     pages no longer preload a face they do not show first. */
  useEffect(() => {
    const l = document.createElement('link');
    l.rel = 'preload';
    l.href = '/fonts/monigue.woff2';
    l.as = 'font';
    l.type = 'font/woff2';
    l.crossOrigin = '';
    l.dataset.monigue = 'true';
    if (!document.head.querySelector('link[data-monigue]')) document.head.appendChild(l);
    return () => l.remove();
  }, []);
  return (
    <Shell
      title="About VexelTech | Small business marketing agency"
      path="/about-us"
      description={ABOUT_DESCRIPTION}
      light
    >
      {/* THE STATEMENT. */}
      <section className="vt ab3-hero" aria-labelledby="ab3-hero-h">
        <div className="ab3__in">
          <h1 className="ab3-hero__h" id="ab3-hero-h">
            {/* COPY V3.1, 2026-10-01. THE WORDS RISE IN TURN on load (final
                pass 2, 2026-10-03, the founder): each from 24px below to its
                place, 400ms, 200ms apart, once, black and fully visible
                throughout (BUILD-LAW Motion: an entrance never hides
                content). Reduced motion: still. */}
            {WORDS.map((w, i) => (
              <React.Fragment key={w}>
                {i > 0 ? ' ' : null}
                <span className="ab3-rise" style={{ '--i': i }}>
                  {w}
                </span>
              </React.Fragment>
            ))}
          </h1>
          <div className="ab3-hero__cols">
            {/* THE LEDE, COPY V4, 2026-10-06. */}
            <p className="ab3-hero__p">
              VexelTech builds the website people land on, the campaigns that send them there, and the
              follow-up that catches the call. One team, one invoice, and one person who knows your
              account by name.
            </p>
          </div>
        </div>
      </section>

      {/* THE BANDS, final7 (2026-10-03, the founder): cream, dark, cream,
          dark, then cream to the close. Dark bands 96 above and below, cream
          bands 80 (about-bands.css). */}
      <OneTeam />
      <OriginStory />
      <WeekStrip />
      {/* Who we are for and How we work with you, each at the full width
          again (the five fixes, 2026-10-02: the two colour sheets stand side
          by side, which the 40% column of the audit's pair could not hold). */}
      <FitColumns />
      <TermsCard />
      {/* The close (final18, 2026-10-06): one statement, the call and the
          facts. It replaced the closing call. */}
      {/* THE CLOSE IS HOME'S YELLOW FIELD (the launch gate, 2026-10-07, the
          founder): heading, line and button, so the anchor check passes.
          final18's AboutClose, its pricing link, promise line and three
          facts are deleted. */}
      <CallBand
        field
        heading="Four services. One team. One number to call."
        note="Branding, websites, marketing and automation, delivered by the people you spoke to on the first call."
      />
    </Shell>
  );
}

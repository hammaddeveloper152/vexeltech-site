import React from 'react';
import Shell from './Shell.jsx';
import Faq from '../../components/home/Faq.jsx';
import OriginStory from '../../components/story/OriginStory.jsx';
import WeekStrip from '../../components/artifacts/WeekStrip.jsx';
import OneTeam from '../../components/artifacts/OneTeam.jsx';
import FitColumns from '../../components/story/FitColumns.jsx';
import TermsCard from '../../components/story/TermsCard.jsx';
import { CallBand } from './parts.jsx';
import '../../styles/aboutpage.css';
import '../../styles/light.css';

/* THE ABOUT PAGE, ONE OBJECT PER SECTION (the storytelling pass,
   2026-10-01, the founder):

     the statement                the Monigue line, its words rising on load
     One team (dark)              OneTeam: four lanes into one
     Where we come from           OriginStory: one paragraph, the years over it
     Four business days (dark)    WeekStrip: the week, Monday to live
     Who we are for               FitColumns: two columns, a rule between
     How we work with you         TermsCard: a white sheet, four clauses
     Questions                    the FAQ accordion
     the closing call             CallBand

   It replaced home's route (twice), home's discipline cards, the fit cards
   and the facts table, all of which repeated objects found elsewhere on the
   site. The final artifacts pass (2026-10-03, the founder) took out The
   record and What we build it around (their lines are in the archive
   section of VEXELTECH-COPY.md) and put the week strip in.

   THE LIGHT PAGE since the three-colour pass (2026-09-25): a cream ground
   for the whole route (Shell's `light`, light.css). The footer block closes
   the page without the form (Shell's `footerForm={false}`).

   EVERY LINE IS VEXELTECH-COPY.md V3.1's, About us. The page's earlier
   shapes are in git and DESIGN.md. */
const QUESTIONS = [
  {
    id: 'us',
    q: 'Do you work outside the US?',
    a: 'Yes. Most of our clients are in the US. We work with the UK, Europe and Australia on the same terms, with calls set to your hours.',
  },
  {
    id: 'industry',
    q: 'Do you work with my industry?',
    a: 'If customers search for what you do, yes. Recent work spans real estate, bookkeeping, care services, hospitality, consulting and technology.',
  },
  {
    id: 'concepts',
    q: "What if I don't like the first concepts?",
    a: 'Say so and we go again. Nothing is billed before approval.',
  },
  {
    id: 'takeover',
    q: 'Can you take over a site someone else built?',
    a: "If you own the domain and the files, yes. If you don't, the first job is getting them into your name.",
  },
];

/* The statement, word by word. */
const WORDS = ['Found,', 'trusted,', 'called.'];

export default function AboutPage() {
  return (
    <Shell
      title="About VexelTech: websites, ads and automation for small business"
      path="/about-us"
      description="One team for the website, the campaigns and the follow-up behind small businesses. Flat prices, four-day builds, everything in your name."
      footerForm={false}
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
            <p className="ab3-hero__p">
              The site a customer lands on, the campaigns that send them there, and the follow-up
              that catches the call. One team builds all three.
            </p>
          </div>
        </div>
      </section>

      {/* THE BANDS, final7 (2026-10-03, the founder): cream, dark, cream,
          dark, then cream to the close. Dark bands 96 above and below, cream
          bands 80 (about-bands.css). The side labels number 01 to 07 in this
          order (Marginalia). */}
      <OneTeam />
      <OriginStory />
      <WeekStrip />
      {/* Who we are for and How we work with you, each at the full width
          again (the five fixes, 2026-10-02: the two colour sheets stand side
          by side, which the 40% column of the audit's pair could not hold). */}
      <FitColumns />
      <TermsCard />
      <Faq items={QUESTIONS} id="ab3-faq" />
      <CallBand heading="Tell us what's going wrong." note="Fifteen minutes on the phone. Nothing to pay for the answer." />
    </Shell>
  );
}

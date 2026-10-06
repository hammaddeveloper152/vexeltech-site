import React, { useEffect } from 'react';
import Shell from './Shell.jsx';
import Faq from '../../components/home/Faq.jsx';
import OriginStory from '../../components/story/OriginStory.jsx';
import WeekStrip from '../../components/artifacts/WeekStrip.jsx';
import OneTeam from '../../components/artifacts/OneTeam.jsx';
import FitColumns from '../../components/story/FitColumns.jsx';
import TermsCard from '../../components/story/TermsCard.jsx';
import AboutClose from '../../components/final/AboutClose.jsx';
import { setFaqLd } from './head.js';
import { FIGURES, money } from '../../content/pricing.js';
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
     the close                    AboutClose (final18)

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
/* COPY V3.5, 2026-10-05 (VEXELTECH-COPY.md, About, Questions): six, in
   the founder's order. The $700 is the token. */
const QUESTIONS = [
  {
    id: 'us',
    q: 'Do you work outside the US?',
    a: 'Yes. Most of our clients are in the US, and we work with the UK, Europe and Australia on the same terms. Calls are set to your hours, not ours.',
  },
  {
    id: 'who',
    q: 'Who will I actually be dealing with?',
    a: 'One person, by name, from the first call through launch and after. They answer the phone and they know your account. There is no ticket queue.',
  },
  {
    id: 'industry',
    q: 'Do you work with my industry?',
    a: 'If people search for what you do, yes. Recent work covers real estate, bookkeeping, care services, hospitality, consulting and technology, and the job is the same in every one: be found, look real, pick up.',
  },
  {
    id: 'concepts',
    q: "What if I don't like the first concepts?",
    a: 'Tell us. We would rather hear it on day two than on launch day. We go again at no charge, and nothing is billed until you have approved.',
  },
  {
    id: 'takeover',
    q: 'Can you take over a site someone else built?',
    a: "Yes, if you own the domain and the files. If you don't, that is the first thing we fix, because a site you can't log into isn't really yours.",
  },
  {
    id: 'flat',
    q: 'Why are your prices flat?',
    a: `Because a quote that changes halfway through isn't a quote. The website is ${money(FIGURES.website)} because we know what six good pages take, and we would rather you spend the saving on getting people to it.`,
  },
  /* COPY V4, 2026-10-06: the seventh. */
  {
    id: 'shops',
    q: 'How are you different from the big logo and website shops?',
    a: 'They sell packages; we sell outcomes you can check. One named person instead of a queue, a written number before any work, files and accounts in your name, and a monthly cost per lead instead of a monthly report about impressions. Fewer tiers, fewer surprises.',
  },
];

/* THE META DESCRIPTION, COPY V4, 2026-10-06. The figures are FIGURES'. */
const ABOUT_DESCRIPTION = `A web design and small business marketing agency. Websites ${money(FIGURES.website)} flat, branding from ${money(FIGURES.brandingBasic)}, ads measured by cost per lead. One team, one invoice.`;

/* The statement, word by word. COPY V4, 2026-10-06: it was "Found,
   trusted, called."; the same type and the same rise on each word. */
const WORDS = 'A web design and marketing agency built for small businesses.'.split(' ');

export default function AboutPage() {
  /* The questions as FAQPage data (head.js, 2026-10-05). */
  useEffect(() => setFaqLd(QUESTIONS), []);
  return (
    <Shell
      title="About VexelTech | Small business marketing agency"
      path="/about-us"
      description={ABOUT_DESCRIPTION}
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
      <Faq items={QUESTIONS} id="ab3-faq" heading="Questions about working with us" />
      {/* The close (final18, 2026-10-06): one statement, the call and the
          facts. It replaced the closing call. */}
      <AboutClose />
    </Shell>
  );
}

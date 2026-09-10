import React from 'react';
import Shell from './Shell.jsx';
import { Link } from 'react-router-dom';
import { OneScreen, PageHead, Section, CallBand } from './parts.jsx';
import HeroSurface from '../../components/home/HeroSurface.jsx';
import CounterRow from '../../components/home/CounterRow.jsx';
import AboutPlates from './AboutPlates.jsx';
/* The About page's own light, feature and plates. */
import '../../styles/about.css';

/* THE FOUR ONE-SCREEN PAGES: About us, Resources, Portfolio, Case studies.

   Each is a heading in Monigue on one line, a line under it, and one call to
   Contact. They are deliberate pages, not stubs, and the distinction that
   makes them so is what the line under the heading is allowed to say.

   ---- One of the four has content. Three do not --------------------------

   ABOUT US has real copy, from content answers 1.1 and 1.3. Its heading is
   the user's own sentence rather than the nav label: 1.1 opens "Vexel Means
   precision and speed", and that is a better one-line heading than the word
   "About". The nav label and the page heading differ on this page alone and
   that is the reason.

   PORTFOLIO, CASE STUDIES and RESOURCES have nothing. Source section 5, THE
   WORK, is blank, section 6, TESTIMONIALS, is blank, and nothing anywhere in
   either document mentions resources. So each of those three carries a
   `pending` note that says, in the page's own voice, that the material is
   not published here yet.

   ---- Why a pending note rather than written copy -----------------------

   THE INSTRUCTION WAS THAT THEY MUST NOT IMPLY CONTENT THAT DOES NOT EXIST,
   and the trap is subtler than writing "browse our work". A confident empty
   page that says "our case studies are coming soon" has asserted that case
   studies exist and are coming, and BUILD-LAW.md Truth does not let a build
   assert either. Even "we have not published our work yet" claims to know
   why it is absent.

   So the note says the one thing that is certainly true and is about the
   PAGE rather than about the business: this page has no content in it yet.
   It is styled as a placeholder, on a rule, in steel-dark at the small step,
   so it reads as a note about the page and can never be mistaken for the
   page's own copy. Every one of these notes comes out when the material
   arrives, and nothing around it has to change.

   ---- What makes them deliberate rather than stubs ----------------------

   The heading is at the page-head step and fills the frame, the page is a
   real screen tall rather than a band of white space, and the call is the
   page's one accent and the one thing to do on it. A reader who lands on
   Portfolio from the footer gets a page that knows what it is and sends
   them somewhere useful, which is the honest version of a page with no
   portfolio on it.

   ---- Not built ---------------------------------------------------------

   There is no work grid, no case study template and no resource index on any
   of these. Building an empty grid would be building the implication. */

/* Honest before, and lifeless. It stated a fact about the page and said
   nothing to the person reading it. This says the same fact in the voice and
   still claims nothing: no work is described, no date is promised, and
   "haven't done yet" asserts only what the empty page already proves. */
const PENDING =
  "There's nothing here yet. We would rather leave a page empty than fill it with work we haven't done.";

/* ---- THE ABOUT PAGE, BUILT OUT 2026-09-08 -----------------------------

   It was a heading, two lines and a call over 400px of empty asphalt. It is
   the one page of the four with real source behind it, and it was carrying
   about a fifth of what the source holds.

   EVERY LINE IS THE USER'S. Sources, in the order they appear on the page:

   | On the page | From |
   |---|---|
   | "Precision and speed" | 1.1, "Vexel Means precision and speed" |
   | The lead | 1.3, the one stop line |
   | The statement | 1.3, "one stop solution from creating the logo till automating the business" |
   | Support paragraph 1 | 1.3, AI with orthodox marketing, precise solutions, fast turnaround |
   | Support paragraph 2 | 1.5, professionals, modern era agency, cost effective, experts who know what they do |
   | Who we work with | 1.2, the six audiences and the two conditions, verbatim in substance |
   | The disciplines run | 1.1's four headings, linked to /services rather than repeated |

   TWO DEVICES, BOTH THE HOMEPAGE'S, ONE USE EACH. The pull quote is the
   About section's own shape; the definition stack is the Services page's.
   No family repeats on this page and no new one was invented.

   ---- WHAT THE SOURCE DOES NOT GIVE, AND SO IS NOT HERE ----------------

   No founder, no year founded, no team size, no location as a story, no
   client count, no origin. 1.1 to 1.5 contain none of it and an About page
   is exactly where inventing it is most tempting. The legacy /legacy/about
   page had all of it and that is why it came off the router.

   To fill the page further I need, and can use immediately: who started it
   and when; how many people do the work; and whether the Richmond address
   is an office or an operating base. Any one of those is a section. */

export function AboutPage() {
  return (
    <Shell
      title="About us | VexelTech"
      description="One team for branding, websites, marketing and automation, from the logo through to the automation."
    >
      {/* THE SURFACE'S SECOND MOUNT. 60% of the hero's height, same shader,
          same clamp, same mask and pause rules — only the box changes. See
          DESIGN.md: the surface is the brand's recurring device. */}
      <div className="abt__top">
        <HeroSurface className="abt__surface" />
        <div className="abt__top-in">
          <PageHead
            title="Precision and speed"
            lead="One team, from the logo through to automating the business."
          />
        </div>
      </div>

      <Section labelledBy="about-what">
        {/* EDGE-BLEED FEATURE. Statement and support left, the portrait slot
            running off the right edge of the viewport. Same layout family the
            home page's About section uses, which is why it is not a new one. */}
        <div className="abt__feature">
          <div className="pgq">
            {/* ARGUMENT THREE. It had no home anywhere on the site, and this
                is the biggest body type on the page a reader comes to when
                they are deciding whether to trust the company. The one-stop
                line it replaced was true and is still on the page, one step
                down, in the support column: it is a fact about how the work is
                organised, and this is a statement about how you will be
                treated. The second is the harder thing to say and the thing a
                reader is actually weighing. The founder's own words. */}
            <p className="pgq__statement">
              We know how hard it is to spend your earnings and get nothing for it.
            </p>
            <div>
              <p className="pgq__support">
                So we build long term partnerships rather than treating you as an invoice
                to be paid. A dedicated team stays on your project, which is why asking for
                a change here is a conversation and not a negotiation.
              </p>
              <p className="pgq__support">
                One team from the logo to the automation, not four agencies who don't talk
                to each other. We put AI alongside orthodox marketing, so the work that
                used to take weeks of back and forth comes back fast and comes back right.
              </p>
            </div>
          </div>

          {/* 922 x 1152, one ratio at every width — AND IT IS NOT RENDERED
              UNTIL THERE IS SOMETHING TO PUT IN IT.

              It used to carry the page's own surface at low intensity behind a
              hairline. The surface came out when reserved slots went to a
              hairline and a numeral, but the `<HeroSurface>` did not: its
              stylesheet rule was deleted and the component was left, so it
              rendered a bare canvas at its intrinsic size in the slot's
              top-left corner. A fragment of a shader in the corner of an empty
              box, for weeks, because half a change looks like no change.

              The slot itself follows the site's rule now: reservations are
              shown only when `VITE_SHOW_RESERVED=1`, and otherwise there is
              nothing here and the statement takes the full width. */}
          {import.meta.env.VITE_SHOW_RESERVED === '1' ? (
            <div className="abt__portrait" aria-hidden="true" />
          ) : null}
        </div>

        <p className="runline">
          Four disciplines: <strong>branding</strong>, <strong>websites</strong>,{' '}
          <strong>marketing</strong> and <strong>automation</strong>.{' '}
          <Link to="/services">See what each one covers</Link>.
        </p>
      </Section>

      {/* The home page's counter row, mounted as built - WITHOUT the band.
          The marble is one band on the whole site and home has it, so this
          mount is transparent over the page rig like every other section
          here. Same light model, same four placeholders, its own count. */}
      <CounterRow />

      <Section
        title="Who we work with"
        labelledBy="about-who"
        note="Owners and founders, and the two situations most of them arrive in."
      >
        <div className="abt__people-head">
          <h3 className="disc__name">The people</h3>
          <p className="disc__line">
            The person who decides is the person we talk to. No account manager
            relaying it back to somebody you never meet.
          </p>
        </div>

        {/* The two situations, as plates. See AboutPlates.jsx. */}
        <AboutPlates />

        {/* The people list is one mono line now, not a two-column list: six
            audiences are one answer to one question, and a column of them read
            as six separate facts. Every word is the list's own. */}
        <p className="abt__people">
          {['Startups', 'SMBs', 'Local businesses', 'Entrepreneurs', 'Founders', 'Owners'].map(
            (t, i, a) => (
              <span key={t}>
                {t}
                {i < a.length - 1 ? <span className="abt__slash" aria-hidden="true"> / </span> : null}
              </span>
            )
          )}
        </p>
      </Section>

      <CallBand
        heading="Tell us what is going wrong"
        note="Fifteen minutes on the phone and we'll tell you what we'd fix first. There is nothing to pay for the answer."
      />
    </Shell>
  );
}

export function PortfolioPage() {
  return (
    <Shell title="Portfolio | VexelTech" description="Work by VexelTech.">
      <OneScreen title="Portfolio" pending={PENDING} />
    </Shell>
  );
}

export function CaseStudiesPage() {
  return (
    <Shell title="Case studies | VexelTech" description="Case studies by VexelTech.">
      <OneScreen title="Case studies" pending={PENDING} />
    </Shell>
  );
}

export function ResourcesPage() {
  return (
    <Shell title="Resources | VexelTech" description="Resources from VexelTech.">
      <OneScreen title="Resources" pending={PENDING} />
    </Shell>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cssMs, useReducedMotion } from './hooks.js';
import HeroSurface from './HeroSurface.jsx';
import './Hero.css';

/* The hero runs on ONE clock, not three.

   It used to run on three. The wall, the phrase ticker and the entrance all
   started at page load and never referenced each other, so the entrance
   played over a ground that was already moving, and the ticker's first swap
   landed while the reader was still on the subtext. That the two did not
   collide was arithmetic, not design: 2400ms of dwell happened to exceed the
   1480ms the entrance takes.

   So there is a phase instead, and every clock hangs off it:

     load     the wall is composed and STILL, the ticker has not started,
              the entrance plays against a ground that is not moving. This
              is the signature moment and it gets the stage to itself.

     ambient  the wall wakes, its three columns staggered, and the ticker
              starts its first dwell from here rather than from load.

   The handoff is driven by the END OF THE LAST ENTRANCE ANIMATION, not by a
   timer set to the number the entrance currently adds up to. If those
   timings change, the handoff follows them. A hardcoded 1480 would drift the
   first time anyone touched a delay, silently, and the symptom would be the
   wall waking early over copy that is still arriving. */
const PHASE_GUARD_MS = 2500;

/* The cycling half of the headline. "Not a proposal. The ___" holds still and
   only the last two words roll. */
const PHRASES = ['whole system', 'working site', 'real build', 'finished thing'];

/* The fixed half, split so each word can travel into place on its own.

   Each word is one unit of the hit, and the five units arrive along the mark's
   angle rather than straight up: the mask carries the horizontal component and
   the word inside it carries the vertical, so the composite is a straight line
   at 51.93 degrees and neither element has to clip the other's travel. The
   arithmetic, the three characters of the hit and what each one costs are all
   in Hero.css under THE ENTRANCE.

   Before this the words rose 100% of their own height on a 250ms ease-out, and
   before THAT the headline had no entrance at all — the rules existed in the
   stylesheet and the markup they needed never did, so the loudest line on the
   site was the one thing on the page not moving.

   The ticker is the fifth unit and travels with the rest. It used to sit still
   through the entrance and start rolling on its own clock, which made it read
   as a separate widget parked inside the headline rather than as the last two
   words of the sentence. Its roll still waits for the ambient phase; only its
   arrival joins the line. */
const HEAD_WORDS = ['Not', 'a', 'proposal.', 'The'];

/* THE WORDS ARRIVE ON ONE BEAT, so there is no per-word index here any more.

   Three characters of the hit were rendered and compared, and two of them
   spent a stagger: one landed every word together, one swept them along the
   diagonal at 18ms in the order the line reaches them rather than in reading
   order. The slam was taken and it stages nothing — five words, one beat —
   so the sweep order, the `--w` custom property and `--stagger-strike` all
   came out with it. DESIGN.md carries what the other two measured.

   If a stagger ever comes back, the order is NOT the DOM's: the headline sets
   two lines, the second starts at the left margin below the first, and the
   diagonal reaches the lower-left word first. It is derived by projecting each
   word's centre onto (cos 51.93, -sin 51.93) with y down, which at 1280 gives
   THE, NOT, a, [phrase], PROPOSAL. Do not guess it from the sentence. */

/* The roll.
   Every phrase is rendered into the same single-column grid, so the column
   sizes itself to the widest phrase and the mask width never changes between
   words. The line cannot reflow. Only the track translates. */
/* THE CANONICAL PHRASE, for assistive technology only.

   Every rotating phrase is `aria-hidden`, because four of them in the
   accessible name would read as one run-on string: "Not a proposal. The
   whole system working site real build finished thing." Hiding all four
   fixed that and produced a worse defect: the h1's accessible name was
   "Not a proposal. The", A SENTENCE WITH NO ENDING. The page's one h1, and
   a screen reader got a fragment.

   So one phrase is named as the canonical one and rendered visually hidden
   inside the same element. The rotation is unchanged and still silent; the
   accessible name now reads "Not a proposal. The whole system."

   It is "whole system" by the user's decision, not by picking the first
   item in the array. If the array is reordered this constant does not
   follow it, which is the point. */
const CANONICAL_PHRASE = 'whole system';

function Ticker({ index }) {
  return (
    <span className="ticker">
      {/* Off-screen rather than display:none or visibility:hidden, both of
          which take an element out of the accessibility tree and would put
          the name back where it was. Not `.skip`: that is a control and
          takes focus; this is text and must never be reachable. */}
      <span className="ticker__a11y">{CANONICAL_PHRASE}</span>
      <span className="ticker__track" style={{ '--i': index }} aria-hidden="true">
        {PHRASES.map((phrase) => (
          <span className="ticker__word" key={phrase}>
            {phrase}
          </span>
        ))}
      </span>
    </span>
  );
}

/* NO PREVIEW SWITCHES. `?variant=machine`, `?hero=a|b|c` and `?entrance=a|b|c`
   all came out on 2026-09-09, with the shapes they selected. Each one compared
   the hero against a version that no longer exists, and a variant nobody can
   reach is a file the next pass reads as current — which is what `Pillars.jsx`
   was. What each of them measured is in DESIGN.md; the frames that cannot be
   regenerated are in `.measure/evidence/`. */
export default function Hero() {
  const reduced = useReducedMotion();
  const noteRef = useRef(null);

  /* The phrase index lives HERE rather than inside Ticker, because the rule
     under the word has to redraw on the same event that swaps it. Two
     components cannot share a swap by each running their own timer; they can
     only share it by sharing the state that causes it. */
  const [phrase, setPhrase] = useState(0);

  /* Under reduced motion there is no entrance to wait for, and the wall and
     the ticker are switched off anyway, so the hero opens already settled
     rather than sitting in a phase that will never advance. */
  const [phase, setPhase] = useState(reduced ? 'ambient' : 'load');

  useEffect(() => {
    if (reduced) {
      setPhase('ambient');
      return undefined;
    }

    const note = noteRef.current;
    let guard = 0;

    const settle = () => setPhase('ambient');

    /* The note is the last thing the entrance brings in, so its animation
       ending IS settle. One animation on this element, so no filtering. */
    if (note) note.addEventListener('animationend', settle, { once: true });

    /* If the entrance never runs, the listener never fires and the wall
       would be still forever. That is a dead page, not a quiet one, so the
       guard is a floor rather than a nicety: it covers a browser that skips
       the animation, a note that is display:none at some future width, and
       a tab backgrounded through the whole entrance. */
    guard = setTimeout(settle, PHASE_GUARD_MS);

    return () => {
      if (note) note.removeEventListener('animationend', settle);
      clearTimeout(guard);
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return undefined;
    /* Waits for the entrance. The first dwell is counted from settle rather
       than from load, so the first word swap can never land while the reader
       is still watching the subtext arrive. */
    if (phase !== 'ambient') return undefined;
    /* The phrase station of the rotation band. DESIGN.md owns the value. */
    const dwell = cssMs('--d-rotate-phrase', 2400);
    const t = setInterval(() => setPhrase((n) => (n + 1) % PHRASES.length), dwell);
    return () => clearInterval(t);
  }, [reduced, phase]);

  const index = reduced ? 0 : phrase;

  return (
    <section
      className="vt hero"
      aria-labelledby="hero-h"
      data-phase={phase}
    >
      {/* NO WALL AND NO SCRIM. The hero carries no photography at all.

          TileWall.jsx, bench.js and videoTiles.js stay in the tree, unmounted:
          the responsive ladder and the video capability are machinery a later
          section may want, and nothing about them depends on the hero. To
          mount the wall again it is `<TileWall live={phase === 'ambient'} />`
          here, plus the scrim it needs; DESIGN.md records why it came out. */}

      {/* The lit surface, behind the copy and above the ground gradient. Raw
          WebGL, one shader, brightness clamped in the shader so the headline
          and the call keep their contrast. See HeroSurface.jsx. */}
      <HeroSurface />

      {/* Grain sits above the scrim, below content. */}
      <svg className="hero__grain" aria-hidden="true" focusable="false">
        <filter id="vt-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.55
                    0 0 0 0 0.55
                    0 0 0 0 0.55
                    0.32 0.32 0.32 0 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#vt-grain)" />
      </svg>

      {/* No registration brackets. They came in with the bench, where they
          said "printed object" at the corners of a card, and there is no
          printed object now: the copy sits on asphalt with nothing around it.
          The 00 / THE DECISION row above the headline went earlier for the
          same class of reason. */}
      <div className="hero__body">

        {/* The roll needs all four phrases in the DOM to size its mask, which
            leaves the h1 text content reading as the phrases run together.
            aria-label gives the heading its canonical accessible name; every
            phrase span is aria-hidden. */}
        <h1
          className="hero__headline"
          id="hero-h"
          aria-label="Not a proposal. The whole system."
        >
          {/* THE LINE. It draws across the frame at the mark's angle before
              anything else exists, the headline arrives along it, and it runs
              off the far end. It is the one place on this page the angle
              appears, and it is BESIDE the type rather than on it: five
              devices died inside this headline and every one of them was a
              treatment applied to a letterform. This one is its own object
              and it leaves.

              It lives inside the h1 so it is positioned against the band the
              words land in rather than against the section, whose centre is
              lower — the body carries the sub, the calls and the note under
              the headline. z-index -1 against the h1's own isolation puts it
              behind the words, so they cover it as they land.

              A span, not a div: the h1's content model is phrasing. */}
          <span className="hero__strike" aria-hidden="true" />

          {HEAD_WORDS.map((word, i) => (
            /* The space lives between the masks, not inside them, so it is
               the font's own space rather than a margin standing in for one,
               and the mask clips only glyphs. */
            <React.Fragment key={word}>
              <span className="hero__mask">
                <span className="hero__word">{word}</span>
              </span>{' '}
            </React.Fragment>
          ))}

          {/* The slot. No rule under it any more: the rule was the frame's
              one accent while the call was white, and the call is machine
              yellow now. One accent per frame, and it is the call.

              No custom property is set on this mask, and that is worth a
              line: the ticker sets its own --i to drive the roll, so any --i
              set here would be inherited straight into it and the entrance's
              index would silently become the phrase index. The entrance uses
              none now, and if one ever comes back it must not be called --i. */}
          <span className="hero__slot">
            <span className="hero__mask">
              <span className="hero__word">
                <Ticker index={index} />
              </span>
            </span>
          </span>
        </h1>

        <p className="hero__sub">
          One team for branding, websites, marketing and automation. Not four agencies
          who don't talk to each other.
        </p>

        {/* Sentence case in the SOURCE, not a text-transform. The labels were
            Title Case with `text-transform: uppercase` over the top, so
            switching the transform off alone would have left "Get a Custom
            Quote". Case is copy. */}
        <div className="hero__actions">
          <Link className="hero__cta" to="/contact-us">
            Get a custom quote
          </Link>
          <Link className="hero__cta hero__cta--line" to="/contact-us">
            Ask a question first
          </Link>
        </div>

        {/* The note is the last thing the entrance brings in, so its
            animationend is what advances the phase. Keep it last. */}
        <p className="hero__note" ref={noteRef}>
          You'll see the work before you owe us anything. Ten seconds to decide, not
          ten meetings.
        </p>
      </div>
    </section>
  );
}

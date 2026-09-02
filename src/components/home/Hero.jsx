import React, { useEffect, useRef, useState } from 'react';
import TileWall from './TileWall.jsx';
import { cssMs, useReducedMotion } from './hooks.js';
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

/* The fixed half, split so each word can rise out of its own mask.

   The headline had NO entrance before this. The rules for it existed in
   Hero.css and the markup they needed never did, so the line simply appeared
   at full size while the brackets, subtext, actions and note faded in around
   it. The signature moment was the one thing not moving.

   It strikes rather than fades: transform only, no opacity anywhere in the
   keyframe. What hides a word at rest is its mask, not its alpha, which is
   why the line reads as struck rather than resolved. Five units at 16ms land
   in 64ms, so the eye registers one event with internal texture instead of
   counting words.

   The ticker is the fifth unit and takes the sweep with the rest. It used to
   sit still through the entrance and start rolling on its own clock, which
   made it read as a separate widget parked inside the headline rather than
   as the last two words of the sentence. Its roll still waits for the
   ambient phase; only its arrival joins the line. */
const HEAD_WORDS = ['Not', 'a', 'proposal.', 'The'];



/* The roll.
   Every phrase is rendered into the same single-column grid, so the column
   sizes itself to the widest phrase and the mask width never changes between
   words. The line cannot reflow. Only the track translates. */
function Ticker({ index }) {
  return (
    <span className="ticker">
      <span className="ticker__track" style={{ '--i': index }}>
        {PHRASES.map((phrase) => (
          <span className="ticker__word" key={phrase} aria-hidden="true">
            {phrase}
          </span>
        ))}
      </span>
    </span>
  );
}

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
    <section className="vt hero" aria-labelledby="hero-h" data-phase={phase}>
      <TileWall />

      {/* Flat scrim between wall and content. It no longer carries any
          contrast: the plate does that. 25% is set for subordination alone,
          and the full reasoning and what it costs are recorded on the rule in
          Hero.css. Uniform rather than graduated, because a scrim that
          darkens toward the headline is a gradient. */}
      <div className="hero__scrim" aria-hidden="true" />

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

      {/* Construction language, Plate 01. Inside the plate, where the flat
          sheet the plates draw it on actually exists: over the photographs
          these vanished, because they are white at 12%.

          The 00 / THE DECISION row that used to sit above the headline is
          gone. Moving it onto the plate fixed its legibility and left its
          real problem untouched: a numeral, a hairline and a label strung
          across the top of the copy read as a stray rule rather than as a
          device. The brackets carry the construction language on their own. */}
      <div className="hero__body">
        <div className="hero__reg" aria-hidden="true">
          <i className="hero__bracket hero__bracket--tl" />
          <i className="hero__bracket hero__bracket--tr" />
          <i className="hero__bracket hero__bracket--bl" />
          <i className="hero__bracket hero__bracket--br" />
        </div>

        {/* The roll needs all four phrases in the DOM to size its mask, which
            leaves the h1 text content reading as the phrases run together.
            aria-label gives the heading its canonical accessible name; every
            phrase span is aria-hidden. */}
        <h1
          className="hero__headline"
          id="hero-h"
          aria-label="Not a proposal. The whole system."
        >
          {HEAD_WORDS.map((word, i) => (
            /* The space lives between the masks, not inside them, so it is
               the font's own space rather than a margin standing in for one,
               and the mask clips only glyphs. */
            <React.Fragment key={word}>
              <span className="hero__mask" style={{ '--w': i }}>
                <span className="hero__word">{word}</span>
              </span>{' '}
            </React.Fragment>
          ))}

          {/* The slot. The rule is a sibling of the mask rather than inside
              it, because the mask clips and a rule under the word has to sit
              outside the clip to be seen at all.

              key={index} is the mechanism, not a React formality: changing
              the key remounts the rule, and remounting is what restarts a CSS
              animation from its first frame. The rule therefore redraws on
              exactly the event that swaps the word, because it is the same
              state change, rather than on a second timer hoping to agree with
              the first.

              --w, not --i. The ticker sets its own --i to drive the roll, and
              an --i here would be inherited straight into it: the entrance
              index would silently become the phrase index and the line would
              open on the wrong word. */}
          <span className="hero__slot">
            <span className="hero__mask" style={{ '--w': HEAD_WORDS.length }}>
              <span className="hero__word">
                <Ticker index={index} />
              </span>
            </span>
            <i className="hero__rule" key={index} aria-hidden="true" />
          </span>
        </h1>

        <p className="hero__sub">
          One team for branding, websites, marketing and automation. We show up with it
          already built.
        </p>

        {/* Sentence case in the SOURCE, not a text-transform. The labels were
            Title Case with `text-transform: uppercase` over the top, so
            switching the transform off alone would have left "Get a Custom
            Quote". Case is copy. */}
        <div className="hero__actions">
          <a className="hero__cta" href="/contact-us">
            Get a custom quote
          </a>
          <a className="hero__cta hero__cta--line" href="/contact-us">
            Request a proposal
          </a>
        </div>

        <p className="hero__note" ref={noteRef}>
          You decide in ten seconds instead of ten meetings. Nothing to pay until you
          have seen the work.
        </p>
      </div>
    </section>
  );
}

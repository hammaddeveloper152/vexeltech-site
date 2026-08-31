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
function Ticker({ reduced, phase }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return undefined;
    /* Waits for the entrance. The first dwell is counted from settle rather
       than from load, so the first word swap can never land while the reader
       is still watching the subtext arrive. */
    if (phase !== 'ambient') return undefined;
    /* The phrase station of the rotation band. DESIGN.md owns the value. */
    const dwell = cssMs('--d-rotate-phrase', 2400);
    const t = setInterval(() => setI((n) => (n + 1) % PHRASES.length), dwell);
    return () => clearInterval(t);
  }, [reduced, phase]);

  const index = reduced ? 0 : i;

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

  return (
    <section className="vt hero" aria-labelledby="hero-h" data-phase={phase}>
      <TileWall />

      {/* Flat scrim between wall and content. Asphalt at 55%, which puts white
          at roughly 6:1 over a machine yellow tile, the worst case in the
          wall. Uniform rather than graduated: a scrim that darkens toward the
          headline is a gradient, and it is not needed to clear AA. */}
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

      {/* Construction language, Plates 00 and 01. */}
      <div className="hero__reg" aria-hidden="true">
        <i className="hero__bracket hero__bracket--tl" />
        <i className="hero__bracket hero__bracket--tr" />
        <i className="hero__bracket hero__bracket--bl" />
        <i className="hero__bracket hero__bracket--br" />
      </div>

      <div className="hero__meta" aria-hidden="true">
        <span className="hero__meta-n">00</span>
        <span className="hero__meta-rule" />
        <span className="hero__meta-t">The decision</span>
      </div>

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

          {/* --w, not --i. The ticker sets its own --i to drive the roll, and
              an --i here would be inherited straight into it: the entrance
              index would silently become the phrase index and the line would
              open on the wrong word. */}
          <span className="hero__mask" style={{ '--w': HEAD_WORDS.length }}>
            <span className="hero__word">
              <Ticker reduced={reduced} phase={phase} />
            </span>
          </span>
        </h1>

        <p className="hero__sub">
          One team for branding, websites, marketing and automation. We show up with it
          already built.
        </p>

        <div className="hero__actions">
          <a className="hero__cta" href="/contact-us">
            Get a Custom Quote
          </a>
          <a className="hero__cta hero__cta--line" href="/contact-us">
            Request a Proposal
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

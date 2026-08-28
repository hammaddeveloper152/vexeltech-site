import React, { useEffect, useState } from 'react';
import TileWall from './TileWall.jsx';
import { cssMs, useReducedMotion } from './hooks.js';
import './Hero.css';

/* The cycling half of the headline. "Not a proposal. The ___" holds still and
   only the last two words roll. */
const PHRASES = ['whole system', 'working site', 'real build', 'finished thing'];



/* The roll.
   Every phrase is rendered into the same single-column grid, so the column
   sizes itself to the widest phrase and the mask width never changes between
   words. The line cannot reflow. Only the track translates. */
function Ticker({ reduced }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return undefined;
    /* The phrase station of the rotation band. DESIGN.md owns the value. */
    const dwell = cssMs('--d-rotate-phrase', 2400);
    const t = setInterval(() => setI((n) => (n + 1) % PHRASES.length), dwell);
    return () => clearInterval(t);
  }, [reduced]);

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

  return (
    <section className="vt hero" aria-labelledby="hero-h">
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
          Not a proposal. The <Ticker reduced={reduced} />
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

        <p className="hero__note">
          You decide in ten seconds instead of ten meetings. Nothing to pay until you
          have seen the work.
        </p>
      </div>
    </section>
  );
}

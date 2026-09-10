import React, { useState } from 'react';
import { useReducedMotion } from './hooks.js';
import './Marquee.css';

/* Section 2. The strip.

   Placeholder slots for now. Real client logos drop into the same slots later
   by swapping the text for an <img>: the slot is a fixed-height flex box, so
   nothing about the band changes when they arrive.

   Names are deliberately synthetic. BUILD-LAW.md Truth: nothing about
   VexelTech gets written here unless the user said it, and an invented client
   list is exactly that. */
const SLOTS = [
  'Client slot one',
  'Client slot two',
  'Client slot three',
  'Client slot four',
  'Client slot five',
  'Client slot six',
  'Client slot seven',
  'Client slot eight',
];

/* One set. Rendered twice into the track; the second copy is hidden from the
   accessibility tree so the list is not read out doubled. */
function Set({ hidden }) {
  return (
    <ul className="marquee__set" aria-hidden={hidden || undefined}>
      {SLOTS.map((name) => (
        <li className="marquee__item" key={name}>
          <span className="marquee__slot">{name}</span>
          <span className="marquee__sep" aria-hidden="true">
            /
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Marquee() {
  const reduced = useReducedMotion();
  /* The reader's own switch, and it wins over everything but the OS
     preference. Hover pausing is CSS and stays where it is; this is the
     control WCAG 2.2.2 asks for, because moving content that starts by
     itself and runs longer than five seconds beside other content has to be
     stoppable by someone who is not holding a mouse over it. Before this the
     only way to stop the strip was to change an OS setting. */
  const [running, setRunning] = useState(true);

  return (
    <section
      className="vt marquee band-rays"
      aria-label="Client slots"
      data-running={running ? 'true' : 'false'}
    >
      {/* The track holds two identical sets and travels exactly one set
          length, so the second copy lands where the first began. Continuous,
          never a reset, and there is no seam to see. */}
      <div className="marquee__track">
        <Set />
        <Set hidden />
      </div>

      {/* Not rendered under reduced motion: the strip is already held at the
          start of its loop there, and a pause control over something that is
          not moving is a control that lies about what it does. */}
      {reduced ? null : (
        <button
          className="marquee__toggle"
          type="button"
          onClick={() => setRunning((v) => !v)}
          /* The icon is the whole content of the control, so the control
             carries the label, and the label says what pressing it does
             rather than what the glyph depicts. Same construction as the
             bar's menu button. */
          aria-label={running ? 'Pause the client strip' : 'Play the client strip'}
        >
          {/* A HAIRLINE MARK, not the Phosphor station, and the deviation is
              recorded in DESIGN.md Iconography.

              This was the Phosphor `Pause` at the 24px medium station in shop
              white — a filled, bold glyph, which is the right weight for the
              bar's menu button and the wrong one here. The strip carries no
              yellow and no emphasis of any kind now; a solid white icon in it
              was the loudest object in a section built to yield.

              Two 2px bars, 12px tall, steel-dark. Drawn inline rather than
              taken from the set because the set has one weight by decision and
              this needs a lighter one. */}
          <svg
            className="marquee__icon"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            aria-hidden="true"
            focusable="false"
          >
            {running ? (
              <>
                <rect x="3" y="0" width="2" height="12" />
                <rect x="7" y="0" width="2" height="12" />
              </>
            ) : (
              <path d="M3 0 L11 6 L3 12 Z" />
            )}
          </svg>
        </button>
      )}
    </section>
  );
}

import React from 'react';
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
  return (
    <section className="vt marquee" aria-label="Client slots">
      {/* The track holds two identical sets and travels exactly one set
          length, so the second copy lands where the first began. Continuous,
          never a reset, and there is no seam to see. */}
      <div className="marquee__track">
        <Set />
        <Set hidden />
      </div>
    </section>
  );
}

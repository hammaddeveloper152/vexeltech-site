import React from 'react';
import { useReveal } from '../home/hooks.js';
import './story.css';

/* WHAT WE BUILD IT AROUND (the storytelling pass, 2026-10-01). Four
   statements in Clash Display at 32px (26 below 768), each with a small
   keyline mark beside it, in its discipline's colour (the colours the
   discipline cards carry: branding yellow, websites lilac, marketing coral,
   automation mint). No cards.

     Branding     a stopwatch, ten seconds swept: "decides in ten seconds"
     Websites     a page, a number above the fold line
     Marketing    click, page, phone: three objects on one chain
     Automation   a text bubble marked 60s

   The statements are VEXELTECH-COPY.md V3.1's, verbatim. */
const ROWS = [
  {
    id: 'branding',
    k: 'Branding',
    line: "A customer decides if you're real in ten seconds. The mark does that before you speak.",
    acc: 'var(--c-accent-ground)',
    Mark: ClockMark,
  },
  {
    id: 'websites',
    k: 'Websites',
    line: 'People scan for a number, a price and a reason to trust you. All three above the fold.',
    acc: 'var(--c-lilac)',
    Mark: FoldMark,
  },
  {
    id: 'marketing',
    k: 'Marketing',
    line: 'An ad is only as good as the page after the click and the phone after the page.',
    acc: 'var(--c-coral)',
    Mark: ChainMark,
  },
  {
    id: 'automation',
    k: 'Automation',
    line: 'A missed call answered by text in sixty seconds is still a customer.',
    acc: 'var(--c-mint)',
    Mark: BubbleMark,
  },
];

function Svg({ children }) {
  return (
    <svg className="ba__mark" viewBox="0 0 120 80" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/* Ten of sixty seconds swept: 60 degrees from twelve. */
function ClockMark() {
  return (
    <Svg>
      <path className="kl-acc" d="M60 44 L60 18 A26 26 0 0 1 82.5 31 Z" />
      <circle className="kl" cx="60" cy="44" r="26" />
      <rect className="kl" x="55" y="8" width="10" height="6" rx="2" />
      <line className="kl kl--2" x1="60" y1="44" x2="77.3" y2="34" />
      <circle className="kl-ink" cx="60" cy="44" r="2.5" />
    </Svg>
  );
}

/* A page, a number above the fold. */
function FoldMark() {
  return (
    <Svg>
      <rect className="kl" x="36" y="4" width="48" height="72" rx="6" />
      <rect className="kl-acc" x="44" y="14" width="32" height="10" rx="3" />
      <line className="kl" x1="44" y1="32" x2="68" y2="32" />
      <line className="kl" x1="28" y1="44" x2="92" y2="44" />
      <line className="kl" x1="44" y1="56" x2="76" y2="56" />
      <line className="kl" x1="44" y1="65" x2="66" y2="65" />
    </Svg>
  );
}

/* Click, page, phone. */
function ChainMark() {
  return (
    <Svg>
      <path className="kl" d="M8 26 L8 50 L14 44 L19 54 L23 52 L18 42 L26 42 Z" />
      <line className="kl kl--2" x1="30" y1="40" x2="42" y2="40" />
      <rect className="kl" x="44" y="22" width="28" height="36" rx="4" />
      <line className="kl" x1="49" y1="31" x2="67" y2="31" />
      <line className="kl" x1="49" y1="39" x2="61" y2="39" />
      <line className="kl kl--2" x1="74" y1="40" x2="86" y2="40" />
      <rect className="kl-acc" x="92" y="18" width="24" height="44" rx="5" />
      <rect className="kl" x="92" y="18" width="24" height="44" rx="5" />
      <rect className="kl-ink" x="100" y="54" width="8" height="3" rx="1.5" />
    </Svg>
  );
}

/* A text bubble, 60s. */
function BubbleMark() {
  return (
    <Svg>
      <path className="kl-acc" d="M26 12 L94 12 Q102 12 102 20 L102 48 Q102 56 94 56 L50 56 L36 68 L38 56 L26 56 Q18 56 18 48 L18 20 Q18 12 26 12 Z" />
      <text className="kl-text kl-text--ink" x="60" y="39" textAnchor="middle">
        60s
      </text>
    </Svg>
  );
}

export default function BuildAround() {
  const [ref, revealed] = useReveal();
  return (
    <section className="vt st-sec st--light ba" aria-labelledby="ba-h">
      <div className="st-in">
        <h2 className="st-h" id="ba-h">
          What we build it around
        </h2>
        <ul className="ba__rows" ref={ref} data-revealed={revealed ? 'true' : 'false'}>
          {ROWS.map(({ id, k, line, acc, Mark }, i) => (
            <li className="ba__row st-rv" key={id} style={{ '--acc': acc, '--i': i }}>
              <Mark />
              <div className="ba__body">
                <p className="ba__k st-mono">{k}</p>
                <p className="ba__line">{line}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

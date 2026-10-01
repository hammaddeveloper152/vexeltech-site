import React from 'react';
import { useReveal } from '../home/hooks.js';
import './story.css';

/* WHAT IT COSTS YOU, AS FOUR FRAMES (the storytelling pass, 2026-10-01).
   Each row of home's ledger gets the screen or object where that cost is
   seen: the search that lists three others, the ads panel with no cost per
   lead, the lock screen with the missed call, the shopfront with no name
   (it was a van door until 2026-10-01, the founder: a storefront reads for
   every small business, not only the trades).
   Flat, keyline, cream on the dark ground, 4:3, one accent each, and the
   accent is always the missing thing:

     search     yellow   the empty fourth result, dashed
     ads        coral    the cost-per-lead slot, empty
     phone      mint     the missed call's mark
     shop       lilac    the blank sign panel where a name would go

   No result titles, no figures, no times: bars stand for text (BUILD-LAW
   Truth). The rows' words are VEXELTECH-COPY.md V3.1's, unchanged. */

const ROWS = [
  {
    id: 'find',
    statement: 'Not found.',
    consequence: "Someone searches for what you do and sees three competitors. You're not one of them.",
    Frame: SearchFrame,
    acc: 'var(--c-accent-ground)',
  },
  {
    id: 'call',
    statement: 'Ad spend without a cost per lead.',
    consequence: 'Money goes out every month and nobody can say what a lead cost.',
    Frame: AdsFrame,
    acc: 'var(--c-coral)',
  },
  {
    id: 'miss',
    statement: 'The missed call.',
    consequence: "You're with a customer. The caller dials the next number on the list.",
    Frame: PhoneFrame,
    acc: 'var(--c-mint)',
  },
  {
    id: 'remember',
    statement: 'No name on the work.',
    consequence: "Every job you finish advertises someone else's brand, or nobody's.",
    Frame: ShopFrame,
    acc: 'var(--c-lilac)',
  },
];

function Svg({ children }) {
  return (
    <svg className="cf__svg" viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <rect className="kl" x="8" y="8" width="384" height="284" rx="14" />
      {children}
    </svg>
  );
}

/* Three results and an empty fourth. */
function SearchFrame() {
  return (
    <Svg>
      <rect className="kl" x="32" y="28" width="336" height="36" rx="18" />
      <circle className="kl" cx="54" cy="46" r="8" />
      <line className="kl" x1="60" y1="52" x2="66" y2="58" />
      <rect className="kl-bar" x="76" y="42" width="140" height="8" rx="4" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect className="kl" x="32" y={84 + 56 * i} width="28" height="28" rx="7" />
          <rect className="kl-bar" x="72" y={88 + 56 * i} width={200 - 24 * i} height="9" rx="4.5" />
          <rect className="kl-bar" x="72" y={104 + 56 * i} width={130 - 10 * i} height="6" rx="3" opacity="0.5" />
        </g>
      ))}
      <rect className="kl-acc-line kl--dash" x="32" y="252" width="336" height="28" rx="8" />
    </Svg>
  );
}

/* Spend and clicks have values; cost per lead is an empty slot. */
function AdsFrame() {
  return (
    <Svg>
      <rect className="kl-bar" x="32" y="30" width="120" height="10" rx="5" />
      <rect className="kl" x="32" y="58" width="160" height="80" rx="10" />
      <text className="kl-text" x="48" y="86">
        Spend
      </text>
      <rect className="kl-bar" x="48" y="102" width="96" height="16" rx="5" />
      <rect className="kl" x="208" y="58" width="160" height="80" rx="10" />
      <text className="kl-text" x="224" y="86">
        Clicks
      </text>
      <rect className="kl-bar" x="224" y="102" width="72" height="16" rx="5" />
      <rect className="kl" x="32" y="154" width="336" height="118" rx="10" />
      <text className="kl-text" x="48" y="182">
        Cost per lead
      </text>
      <rect className="kl-acc-line kl--dash" x="48" y="200" width="132" height="52" rx="8" />
      <polyline className="kl" points="212,244 240,232 264,238 290,214 316,222 344,196" />
    </Svg>
  );
}

/* A lock screen with one notification. */
function PhoneFrame() {
  return (
    <Svg>
      <rect className="kl" x="110" y="20" width="180" height="262" rx="26" />
      <rect className="kl-bar" x="180" y="30" width="40" height="8" rx="4" />
      <rect className="kl-bar" x="150" y="62" width="100" height="24" rx="7" />
      <rect className="kl-bar" x="168" y="94" width="64" height="6" rx="3" opacity="0.5" />
      <rect className="kl" x="122" y="124" width="156" height="58" rx="12" />
      <circle className="kl-acc" cx="145" cy="153" r="11" />
      <text className="kl-text" x="164" y="150">
        Missed call
      </text>
      <rect className="kl-bar" x="164" y="160" width="76" height="6" rx="3" opacity="0.5" />
      <rect className="kl-bar" x="170" y="264" width="60" height="5" rx="2.5" />
    </Svg>
  );
}

/* A shopfront: a window, a door, and the sign panel above them blank. */
function ShopFrame() {
  return (
    <Svg>
      <line className="kl" x1="32" y1="56" x2="368" y2="56" />
      <rect className="kl" x="48" y="56" width="304" height="206" />
      <rect className="kl-acc-line kl--dash" x="72" y="74" width="256" height="44" rx="4" />
      <line className="kl" x1="48" y1="136" x2="352" y2="136" />
      <rect className="kl" x="68" y="154" width="164" height="94" rx="2" />
      <line className="kl" x1="150" y1="154" x2="150" y2="248" />
      <rect className="kl" x="252" y="154" width="80" height="108" rx="2" />
      <rect className="kl-ink" x="316" y="204" width="4" height="14" rx="2" />
      <line className="kl" x1="20" y1="262" x2="380" y2="262" />
    </Svg>
  );
}

export default function CostFrames() {
  const [ref, revealed] = useReveal();
  return (
    <section className="vt st-sec st--dark cf" aria-labelledby="cf-h">
      <div className="st-in">
        <h2 className="st-h" id="cf-h">
          What it costs you
        </h2>
        <ol className="cf__rows" ref={ref} data-revealed={revealed ? 'true' : 'false'}>
          {ROWS.map(({ id, statement, consequence, Frame, acc }, i) => (
            <li className="cf__row st-rv" key={id} style={{ '--acc': acc, '--i': i }}>
              <Frame />
              <h3 className="cf__t">{statement}</h3>
              <p className="cf__b st-soft">{consequence}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

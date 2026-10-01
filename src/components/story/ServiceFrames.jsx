import React from 'react';
import './story.css';

/* ONE FRAME PER DISCIPLINE ON /services (the storytelling pass,
   2026-10-01), each a different shape so the four bands stop being one
   block four times. Keylines in the band's ink (bone on the dark bands,
   asphalt on the cream ones), one accent each in the discipline's colour.

     Branding     one mark on a sign, an invoice header and a business
                  profile card. The mark is a NEUTRAL PLACEHOLDER (a ring
                  and a bar), not anybody's logo.
     Websites     a phone, the above-the-fold anatomy labelled: call, form,
                  booking, and the fold itself, dashed.
     Marketing    a reporting card: spend, leads, cost per lead, tagged
                  Sample. THE VALUES ARE EMPTY SLOTS, not sample figures: a
                  figure on a sample card is still a figure nobody gave
                  (BUILD-LAW Truth; V3.1 asks for real numbers only on the
                  ad performance card).
     Automation   a text thread: the missed call, then the text back at 60s
                  with its booking link. The message is bars, not words.

   UI labels only inside the drawings ("Invoice", "Cost per lead", "Missed
   call"), at 14 units. */

const ACC = {
  branding: 'var(--c-accent-ground)',
  websites: 'var(--c-lilac)',
  marketing: 'var(--c-coral)',
  automation: 'var(--c-mint)',
};

function Mark({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle className="kl-acc" cx="0" cy="0" r="14" />
      <circle className="kl" cx="0" cy="0" r="14" />
      <rect className="kl-ink" x="-6" y="-2" width="12" height="4" rx="2" />
    </g>
  );
}

function BrandingFrame() {
  return (
    <svg className="sf__svg sf__svg--wide" viewBox="0 0 480 320" aria-hidden="true" focusable="false">
      {/* The sign. */}
      <rect className="kl" x="16" y="40" width="200" height="110" rx="8" />
      <Mark x={64} y={95} s={1.6} />
      <rect className="kl-bar" x="104" y="84" width="92" height="10" rx="5" />
      <rect className="kl-bar" x="104" y="102" width="64" height="6" rx="3" opacity="0.5" />
      <line className="kl kl--2" x1="56" y1="150" x2="56" y2="214" />
      <line className="kl kl--2" x1="176" y1="150" x2="176" y2="214" />
      <line className="kl" x1="16" y1="214" x2="216" y2="214" />
      <text className="kl-text kl-text--lg" x="16" y="248">
        Sign
      </text>
      {/* The invoice header. */}
      <path className="kl" d="M248 40 L464 40 Q472 40 472 48 L472 150 L248 150 L248 48 Q248 40 256 40 Z" />
      <Mark x={276} y={70} />
      <text className="kl-text kl-text--lg" x="374" y="77">
        Invoice
      </text>
      <rect className="kl-bar" x="264" y="100" width="90" height="6" rx="3" opacity="0.5" />
      <rect className="kl-bar" x="264" y="114" width="70" height="6" rx="3" opacity="0.5" />
      <line className="kl" x1="248" y1="136" x2="472" y2="136" />
      {/* The business profile card. */}
      <rect className="kl" x="248" y="172" width="224" height="132" rx="12" />
      <Mark x={280} y={204} />
      <rect className="kl-bar" x="304" y="196" width="110" height="9" rx="4.5" />
      <rect className="kl-bar" x="304" y="212" width="70" height="6" rx="3" opacity="0.5" />
      <path className="kl" d="M276 250 Q276 240 284 240 Q292 240 292 250 Q292 258 284 266 Q276 258 276 250 Z" />
      <rect className="kl-bar" x="304" y="246" width="130" height="6" rx="3" opacity="0.5" />
      <rect className="kl-bar" x="304" y="262" width="96" height="6" rx="3" opacity="0.5" />
    </svg>
  );
}

function WebsitesFrame() {
  return (
    <svg className="sf__svg" viewBox="0 0 360 420" aria-hidden="true" focusable="false">
      <rect className="kl" x="40" y="8" width="180" height="404" rx="26" />
      <rect className="kl-bar" x="110" y="20" width="40" height="7" rx="3.5" />
      <rect className="kl-bar" x="58" y="46" width="60" height="8" rx="4" />
      <rect className="kl-bar" x="58" y="74" width="140" height="14" rx="5" />
      <rect className="kl-bar" x="58" y="94" width="110" height="14" rx="5" />
      {/* Call. */}
      <rect className="kl-acc" x="58" y="124" width="144" height="34" rx="8" />
      <circle className="kl-ink" cx="80" cy="141" r="4" opacity="0.8" />
      {/* Form. */}
      <rect className="kl" x="58" y="172" width="144" height="26" rx="6" />
      <rect className="kl" x="58" y="206" width="144" height="26" rx="6" />
      {/* Booking. */}
      <rect className="kl" x="58" y="244" width="144" height="34" rx="17" />
      <rect className="kl-bar" x="102" y="258" width="56" height="6" rx="3" />
      {/* The fold. */}
      <line className="kl kl--dash" x1="20" y1="296" x2="340" y2="296" />
      <rect className="kl-bar" x="58" y="312" width="144" height="60" rx="8" opacity="0.2" />
      {/* Labels. */}
      <line className="kl" x1="206" y1="141" x2="244" y2="141" />
      <text className="kl-text" x="250" y="146">
        Call
      </text>
      <line className="kl" x1="206" y1="202" x2="244" y2="202" />
      <text className="kl-text" x="250" y="207">
        Form
      </text>
      <line className="kl" x1="206" y1="261" x2="244" y2="261" />
      <text className="kl-text" x="250" y="266">
        Booking
      </text>
      <text className="kl-text" x="250" y="316">
        Fold
      </text>
    </svg>
  );
}

function MarketingFrame() {
  return (
    <svg className="sf__svg sf__svg--wide" viewBox="0 0 420 300" aria-hidden="true" focusable="false">
      <rect className="kl" x="8" y="8" width="404" height="284" rx="14" />
      <text className="kl-text" x="32" y="44">
        Monthly report
      </text>
      <rect className="kl-acc" x="320" y="26" width="72" height="26" rx="13" />
      <text className="kl-text kl-text--ink" x="356" y="44" textAnchor="middle">
        Sample
      </text>
      {[
        ['Spend', 32],
        ['Leads', 156],
        ['Cost per lead', 280],
      ].map(([k, x]) => (
        <g key={k}>
          <text className="kl-text" x={x} y="92">
            {k}
          </text>
          <rect className="kl kl--dash" x={x} y="104" width="104" height="36" rx="6" />
        </g>
      ))}
      <line className="kl" x1="32" y1="172" x2="388" y2="172" />
      {[48, 72, 40, 88, 64, 100].map((h, i) => (
        <rect key={i} className={i === 5 ? 'kl-acc' : 'kl'} x={44 + i * 58} y={270 - h} width="30" height={h} rx="4" />
      ))}
      <line className="kl" x1="32" y1="270" x2="388" y2="270" />
    </svg>
  );
}

function AutomationFrame() {
  return (
    <svg className="sf__svg" viewBox="0 0 360 420" aria-hidden="true" focusable="false">
      <rect className="kl" x="40" y="8" width="280" height="404" rx="26" />
      <line className="kl" x1="40" y1="56" x2="320" y2="56" />
      <circle className="kl" cx="72" cy="32" r="12" />
      <rect className="kl-bar" x="94" y="28" width="90" height="8" rx="4" />
      {/* The missed call. */}
      <rect className="kl" x="70" y="80" width="220" height="40" rx="20" />
      <path className="kl" d="M92 94 Q92 92 94 92 L98 92 L100 97 L98 99 Q100 103 104 105 L106 103 L111 105 L111 108 Q111 110 109 110 Q98 109 92 96 Z" />
      <text className="kl-text" x="122" y="105">
        Missed call
      </text>
      {/* Sixty seconds. */}
      <text className="kl-text" x="180" y="152" textAnchor="middle">
        60s
      </text>
      {/* The text back, with its booking link. */}
      <path className="kl-acc" d="M126 172 L282 172 Q298 172 298 188 L298 272 Q298 288 282 288 L142 288 Q126 288 126 272 L126 188 Q126 172 142 172 Z" />
      <rect className="kl-bar" x="142" y="190" width="132" height="8" rx="4" style={{ fill: 'var(--c-asphalt)' }} />
      <rect className="kl-bar" x="142" y="206" width="110" height="8" rx="4" style={{ fill: 'var(--c-asphalt)' }} />
      <rect className="kl-bar" x="142" y="222" width="90" height="8" rx="4" style={{ fill: 'var(--c-asphalt)' }} />
      <rect x="142" y="244" width="96" height="28" rx="14" fill="none" stroke="var(--c-asphalt)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <rect x="160" y="255" width="60" height="6" rx="3" fill="var(--c-asphalt)" />
      {/* The reply. */}
      <path className="kl" d="M62 312 L176 312 Q190 312 190 326 L190 352 Q190 366 176 366 L76 366 Q62 366 62 352 L62 326 Q62 312 76 312 Z" />
      <rect className="kl-bar" x="78" y="330" width="90" height="8" rx="4" />
      <rect className="kl-bar" x="78" y="346" width="60" height="8" rx="4" />
    </svg>
  );
}

const FRAMES = {
  branding: BrandingFrame,
  websites: WebsitesFrame,
  marketing: MarketingFrame,
  automation: AutomationFrame,
};

export default function ServiceFrame({ id }) {
  const Frame = FRAMES[id];
  return (
    <figure className={`sf sf--${id}`} style={{ '--acc': ACC[id] }}>
      <Frame />
    </figure>
  );
}

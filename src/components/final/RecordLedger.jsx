import React, { useRef } from 'react';
import { useCountOnLoad } from '../site/useCountOnLoad.js';
import { REAL_WORK } from '../../content/work.js';
import './about-bands.css';

/* ABOUT, THE RECORD (2026-10-03, the founder). A dark band after the
   statement: the H2 "What we have shipped" (its side label is "The record",
   Marginalia's `data-marg`), then a ledger of four cells in one row (two by
   two below 768), hairlines between: the figure in the display face at 64px
   in bone, the label under it in mono 13px steel-lift. Under the ledger,
   one line in mono 11px steel-lift.

   THE FIGURES are painted from the first frame and count up only if the
   ledger is on screen at load (useCountOnLoad; BUILD-LAW Motion). "Live
   sites" is the count of content/work.js's shown entries; $30.11 is the
   last reported cost per conversion (the January to February capture);
   $70.11 is WordStream's 2025 US search average (the founder's source). */
const CELLS = [
  { pre: '', to: REAL_WORK.length, dp: 0, label: 'Live sites' },
  { pre: '', to: 1, dp: 0, label: 'Identity, guide and signage' },
  { pre: '$', to: 30.11, dp: 2, label: 'Last reported cost per conversion' },
  { pre: '$', to: 70.11, dp: 2, label: 'US search average, WordStream 2025' },
];

export default function RecordLedger() {
  const ref = useRef(null);
  useCountOnLoad(ref, '.rl__n');
  return (
    <section className="vt st-sec st--dark ab-dark rl" aria-labelledby="rl-h" data-marg="The record">
      <div className="st-in">
        <h2 className="st-h" id="rl-h">
          What we have shipped
        </h2>
        <dl className="rl__cells" ref={ref}>
          {CELLS.map(({ pre, to, dp, label }) => (
            <div className="rl__cell" key={label}>
              <dt className="rl__label">{label}</dt>
              <dd className="rl__fig">
                {pre}
                <span className="rl__n" data-to={to} data-dp={dp}>
                  {to.toFixed(dp)}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="rl__note">Live sites open from the home page. Campaign figures as reported by Google Ads.</p>
      </div>
    </section>
  );
}

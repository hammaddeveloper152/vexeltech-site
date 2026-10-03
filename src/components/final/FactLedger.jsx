import React, { useRef } from 'react';
import { useCountOnLoad } from '../site/useCountOnLoad.js';
import { FIGURES } from '../../content/pricing.js';
import './factledger.css';

/* WHO WE ARE, THE FACT LEDGER (the final pass, 2026-10-03). It replaced the
   lilac, mint, coral and yellow tiles. Four cells on the cream panel, one
   row from 768 and two by two below, a hairline between cells and no fills:
   the figure in Clash Display at 64px in asphalt (15.75:1 on cream), the
   label under it in mono 13px steel (7.2:1).

   THE FIGURES ARE FINAL FROM THE FIRST PAINT (final pass 2, BUILD-LAW
   Motion: an entrance never hides content). They count up from 0 over 900ms
   only if the ledger is already on screen at load (useCountOnLoad); a "$"
   prefix stays put. The website price is the pricing token. */
const CELLS = [
  { pre: '$', n: FIGURES.website, label: 'Website, flat, up to six pages' },
  { pre: '', n: 4, label: 'Business days to build' },
  { pre: '', n: 30, label: 'Days of maintenance after launch' },
  { pre: '', n: 1, label: 'Invoice, one team' },
];

export default function FactLedger() {
  const ref = useRef(null);
  useCountOnLoad(ref, '.fl2__n');
  return (
    <dl className="fl2" ref={ref} data-artifact="FactLedger" data-device="ledger">
      {CELLS.map(({ pre, n, label }) => (
        <div className="fl2__cell" key={label}>
          <dt className="fl2__label">{label}</dt>
          <dd className="fl2__fig">
            {pre}
            <span className="fl2__n" data-to={n}>
              {n}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

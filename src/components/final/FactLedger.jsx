import React, { useRef } from 'react';
import { useOnce } from '../site/useOnce.js';
import { FIGURES } from '../../content/pricing.js';
import './factledger.css';

/* WHO WE ARE, THE FACT LEDGER (the final pass, 2026-10-03). It replaced the
   lilac, mint, coral and yellow tiles. Four cells on the cream panel, one
   row from 768 and two by two below, a hairline between cells and no fills:
   the figure in Clash Display at 64px in asphalt (15.75:1 on cream), the
   label under it in mono 13px steel (7.2:1).

   Each figure counts up from 0 over 900ms when the ledger enters the view,
   once (useOnce); a "$" prefix stays put. Reduced motion: the figures stand
   at their values. The website price is the pricing token. */
const CELLS = [
  { pre: '$', n: FIGURES.website, label: 'Website, flat, up to six pages' },
  { pre: '', n: 4, label: 'Business days to build' },
  { pre: '', n: 30, label: 'Days of maintenance after launch' },
  { pre: '', n: 1, label: 'Invoice, one team' },
];

export default function FactLedger() {
  const ref = useRef(null);
  const armed = useOnce(ref, (gsap, el, done) => {
    const nums = [...el.querySelectorAll('.fl2__n')];
    nums.forEach((node, i) => {
      const to = CELLS[i].n;
      const o = { v: 0 };
      gsap.to(o, {
        v: to,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => {
          /* The text node React made, so its next render finds it. */
          node.firstChild.nodeValue = String(Math.round(o.v));
        },
        onComplete: i === nums.length - 1 ? done : undefined,
      });
    });
  });
  return (
    <dl className="fl2" ref={ref}>
      {CELLS.map(({ pre, n, label }) => (
        <div className="fl2__cell" key={label}>
          <dt className="fl2__label">{label}</dt>
          <dd className="fl2__fig">
            {pre}
            <span className="fl2__n">{armed ? 0 : n}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

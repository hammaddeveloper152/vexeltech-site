import React, { useRef } from 'react';
import { useCountOnLoad } from '../site/useCountOnLoad.js';
import BrowserFrame from './BrowserFrame.jsx';
import './proof.css';

/* SERVICES, THE MARKETING BAND (final pass 2, 2026-10-03): the figures
   lead, the capture is the receipt.

     the period   mono 11px over the row, in the yellow text accent (9.46:1
                  on the dark ground). The brief named deep amber, which is
                  for light grounds and fails 4.5:1 here.
     the figures  three, in Clash Display at 96px in bone (64 below 768),
                  each with its label under it in mono 11px steel-lift. They
                  are the capture's own: 680 clicks, 234 conversions (234.00
                  in the capture), $30.11 per conversion. Painted at their
                  values from the first frame; they count up over 900ms only
                  if the band is on screen at load (useCountOnLoad).
     the receipt  the capture in the plain browser frame with its two yellow
                  callouts, at 60% of the content width and right-aligned
                  from 768 (the full width below: at 60% of a phone the
                  figures in it are too small to read), then the caption in
                  mono 11px steel-lift.

   Nothing starts hidden. No other figure is written. */
const FIGS = [
  { pre: '', to: 680, dp: 0, label: 'Clicks' },
  { pre: '', to: 234, dp: 0, label: 'Conversions' },
  { pre: '$', to: 30.11, dp: 2, label: 'Cost per conversion' },
];

/* The callouts, in the capture's 1175 x 310 pixels: "234.00" and "$30.11". */
const MARKS = [
  { id: 'conv', x: 176, y: 69, w: 87, h: 34 },
  { id: 'cpc', x: 445, y: 66, w: 83, h: 37 },
];

export default function AdsBand() {
  const ref = useRef(null);
  useCountOnLoad(ref, '.ab__n');
  return (
    <figure className="ab" ref={ref}>
      <p className="ab__period">Google Ads, one client account, Jan 1 to Feb 25, 2026</p>
      <dl className="ab__figs">
        {FIGS.map(({ pre, to, dp, label }) => (
          <div className="ab__fig" key={label}>
            <dt className="ab__label">{label}</dt>
            <dd className="ab__val">
              {pre}
              <span className="ab__n" data-to={to} data-dp={dp}>
                {to.toFixed(dp)}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <div className="ab__receipt">
        <BrowserFrame
          title="Google Ads. Jan 1 to Feb 25, 2026"
          src="/proof/ads-jan-feb-2026.png"
          alt="Google Ads performance summary, January 1 to February 25, 2026: 680 clicks, 234.00 conversions, $10.36 average cost per click, $30.11 cost per conversion."
          width={1175}
          height={310}
          marks={MARKS}
        />
        <figcaption className="ab__cap">Conversions as reported by Google Ads. Client name withheld.</figcaption>
      </div>
    </figure>
  );
}

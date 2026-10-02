import React, { useRef } from 'react';
import { useSeen } from '../site/useOnce.js';
import './benchmark.css';

/* SERVICES, MARKETING: AGAINST THE BENCHMARK (2026-10-03, the founder). It
   replaced the figures and the Google Ads capture (the capture is deleted).

   Two comparison rows on the dark band: the label at the left in mono 11px
   steel-lift, then one bar per series, 12px tall, its figure at the bar's
   end in the display face at 32px in bone, and the series name after it in
   mono 11px steel-lift. Our bars are yellow and the average's steel
   (decoration, not text). Each bar's width is its value over the row's
   largest value. The bars draw from 0 to their width over 900ms when their
   row comes into view (a line may draw in, BUILD-LAW Motion); every figure
   is painted from the first frame.

   THE FIGURES. Ours are the founder's two Google Ads captures: $30.11 and
   $34.69 per conversion are as reported; the conversion rates are the
   captures' conversions over clicks, 234 / 680 = 34.4% and 122 / 418 =
   29.2%. The average is WordStream's Google Ads Benchmarks 2025 (the
   founder's source; its all-industry cost per lead $70.11 and conversion
   rate 7.52%). */
const ROWS = [
  {
    label: 'Cost per conversion',
    bars: [
      { v: 70.11, fig: '$70.11', who: 'US average', ours: false },
      { v: 30.11, fig: '$30.11', who: 'Ours, Jan to Feb 2026', ours: true },
      { v: 34.69, fig: '$34.69', who: 'Ours, Nov 2025', ours: true },
    ],
  },
  {
    label: 'Conversion rate',
    bars: [
      { v: 7.52, fig: '7.52%', who: 'US average', ours: false },
      { v: 34.4, fig: '34.4%', who: 'Ours, Jan to Feb 2026', ours: true },
      { v: 29.2, fig: '29.2%', who: 'Ours, Nov 2025', ours: true },
    ],
  },
];

function Row({ label, bars }) {
  const ref = useRef(null);
  const armed = useSeen(ref, null, 0.3);
  const max = Math.max(...bars.map((b) => b.v));
  return (
    <div className="bm__row" ref={ref} data-armed={armed ? 'true' : 'false'}>
      <p className="bm__label">{label}</p>
      <ul className="bm__bars">
        {bars.map((b) => (
          <li className="bm__line" key={b.who}>
            <span className="bm__track" style={{ '--f': b.v / max }}>
              <span className={`bm__bar${b.ours ? ' bm__bar--ours' : ''}`} aria-hidden="true" />
            </span>
            <span className="bm__fig">{b.fig}</span>
            <span className="bm__who">{b.who}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BenchmarkBand() {
  return (
    <figure className="bm">
      <p className="bm__head">Cost per lead. Our last two reported campaigns against the US search average.</p>
      {ROWS.map((r) => (
        <Row key={r.label} {...r} />
      ))}
      <figcaption className="bm__src">
        <span>Ours: one client Google Ads account, conversions as reported by Google Ads. Client name withheld.</span>
        <span>Average: WordStream, Google Ads Benchmarks 2025, 16,446 US search campaigns, April 2024 to March 2025.</span>
      </figcaption>
    </figure>
  );
}

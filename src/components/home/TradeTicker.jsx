import React, { useLayoutEffect, useRef } from 'react';
import {
  IconTradeContracting,
  IconTradeCleaning,
  IconTradeDental,
  IconTradeElectrical,
  IconTradeHvac,
  IconTradeLandscaping,
  IconTradePlumbing,
  IconTradeRoofing,
} from '../site/Icons.jsx';
import './TradeTicker.css';

/* THE TRADE TICKER, 2026-09-25 (the founder's life pass), under What it
   costs you on home. One row of pills, 40px tall, 8px radius, each a trade's
   mark and its name in the mono label, the colours cycling yellow, arc blue,
   coral, mint, lilac, asphalt text (white on blue). The trades are the
   founder's eight.

   It scrolls left at 40px a second: the row is the set twice, it moves by
   one set's width on a loop, and the loop's duration is that width over 40,
   measured, so the speed is the same whatever the fonts make the width.
   It pauses on hover. Reduced motion: it does not move, and the one set
   wraps. The second set is aria-hidden: a screen reader hears the eight once. */
const TRADES = [
  ['Plumbing', IconTradePlumbing],
  ['HVAC', IconTradeHvac],
  ['Electrical', IconTradeElectrical],
  ['Roofing', IconTradeRoofing],
  ['Dental', IconTradeDental],
  ['Cleaning', IconTradeCleaning],
  ['Contracting', IconTradeContracting],
  ['Landscaping', IconTradeLandscaping],
];
const TONES = ['yellow', 'blue', 'coral', 'mint', 'lilac'];
const SPEED = 40; // px per second

function Set({ hidden = false }) {
  return (
    <ul className="trades__set" aria-hidden={hidden || undefined}>
      {TRADES.map(([label, Mark], i) => (
        <li className={`trades__pill trades__pill--${TONES[i % TONES.length]}`} key={label}>
          <Mark className="i i--sm trades__mark" />
          <span className="trades__label">{label}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TradeTicker() {
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const set = () => {
      const first = track.firstElementChild;
      if (!first) return;
      /* One set plus the gap after it: the distance the loop travels. */
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const w = first.getBoundingClientRect().width + gap;
      track.style.setProperty('--trades-shift', `${-w}px`);
      track.style.setProperty('--trades-dur', `${(w / SPEED).toFixed(2)}s`);
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(track.firstElementChild);
    if (document.fonts) document.fonts.ready.then(set);
    return () => ro.disconnect();
  }, []);

  return (
    <section className="vt trades" aria-label="Trades we work with">
      <div className="trades__track" ref={trackRef}>
        <Set />
        <Set hidden />
      </div>
    </section>
  );
}

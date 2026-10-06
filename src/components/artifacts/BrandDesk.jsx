import React, { useEffect, useRef, useState } from 'react';
import { useLoop, step, leaving } from './loop.js';
import Monogram from './Monogram.jsx';
import Crossfade from './Crossfade.jsx';
import { SETS, useBrandSet, setBrandSet, setVars } from '../../content/brandSets.js';
import { FIGURES, money } from '../../content/pricing.js';
import './artifacts.css';
import './brand-desk.css';

/* SERVICES, BRANDING: ONE IDENTITY, ON EVERYTHING YOUR CUSTOMERS SEE
   (final17, 2026-10-06, the founder). It replaced the before/after slider,
   which is deleted with its drift.

   NO TRADE (final18, 2026-10-06, the founder): the desk carries no trade,
   profession or industry. The client is whatever name is typed in the
   field above the stage ("Harbor & Vale" while it is empty), and every
   surface re-letters live. The mark is built from that name
   (Monogram.jsx). The estimate is a "Quote", the listing says "Local
   business", and no tile names a trade.

   One desk on bone paper, 1180 x 520 at 1280, one light from the top left,
   so every object casts 0 10px 30px rgb(20 24 40 / 18%) down and right:

     1  the fascia sign, 520 x 120, top left, 40px past the stage's left
        edge, on a wall 6% darker than the paper
     2  the quote, 300 x 380, centre, -2deg
     3  the listing card, 300 x 330, over the quote's right edge by 24
     4  the social grid, 3 x 3 tiles of 60, under the quote's lower left
     5  the appointment card, 170 x 100, bottom left, 4deg
     6  the uniform badge, a 120 circle, bottom right

   and a 28px swatch strip along the foot. Below 1024 the desk is two
   columns (sign, listing and quote, grid and card; no badge); below 600
   one.

   THE FIELD AND THE SELECTOR, above the stage: the name, and the set. The
   selector picks one of the five sets (brandSets.js), and every object and
   the strip follow it in a 300ms crossfade (Crossfade.jsx, opacity only).
   The Marketing stage reads the same set.

   THE PLAY (loop.js, once): the finished desk on first paint, off screen
   and under reduced motion. At half in view, a 400ms crossfade to the
   first frame, then each object lifts from 8px low and opacity 0 to rest,
   400ms, 70ms apart, sign first, badge last. It plays once. The desk is a
   picture, aria-hidden; the field and the caption are the content. */
const LIFT = 400;
const GAP = 70;
const TOTAL = LIFT + 5 * GAP;
const DEMO = 'Harbor & Vale';
const MAX = 24;

/* The tiles; `name` is the typed name. */
const TILES = [
  { k: 'p', t: 'Open Saturdays' },
  { k: 'b', mark: true },
  { k: 'a', t: 'New customers welcome' },
  { k: 'b', t: 'Mon to Fri 8 to 5' },
  { k: 'a', mark: true },
  { k: 'p', t: 'Book online' },
  { k: 'a', t: 'Family run' },
  { k: 'p', mark: true },
  { k: 'b', name: true },
];

/* The sign's lettering: Clash 500, uppercase, tracking .02em, at most
   `max`, fitted into the sign's free width and never under 11px. */
let ctx = null;
function fit(text, avail, max) {
  if (!text || typeof document === 'undefined') return max;
  ctx = ctx || document.createElement('canvas').getContext('2d');
  ctx.font = `500 ${max}px 'Clash Display', 'Helvetica Neue', Arial, sans-serif`;
  const w = ctx.measureText(text.toUpperCase()).width + 0.02 * max * [...text].length;
  return Math.max(11, Math.min(max, Math.floor((max * avail) / w)));
}

function Desk({ set, t, name, signFs }) {
  /* Object n's lift: 0 at its start, 1 at rest. `translate`, not
     `transform`, so it composes with each object's own rotation. */
  const lift = (n) => {
    const p = step(t, n * GAP, LIFT);
    return p >= 1 ? undefined : { translate: `0 ${((1 - p) * 8).toFixed(2)}px`, opacity: p };
  };
  return (
    <div className="bd__desk" style={setVars(set)}>
      <div className="bd__wall" />
      <div className="bd__o bd__sign" style={lift(0)}>
        <Monogram name={name} size={56} />
        <span className="bd__sign-w" style={{ fontSize: signFs }}>
          {name}
        </span>
      </div>

      <div className="bd__o bd__est-slot" style={lift(1)}>
        <div className="bd__est">
          <p className="bd__est-h">
            <Monogram name={name} size={18} />
            <span className="bd__est-n">{name}</span>
          </p>
          <p className="bd__est-k">Quote</p>
          <ul className="bd__est-rows">
            <li>
              <span>Site visit</span>
              <span>$95</span>
            </li>
            <li>
              <span>Service</span>
              <span>$140</span>
            </li>
            <li>
              <span>Materials</span>
              <span>$220</span>
            </li>
          </ul>
          <p className="bd__est-total">
            <span>Total</span>
            <span>$455</span>
          </p>
          <p className="bd__est-f">Reply within one business day · (555) 010 2200</p>
        </div>
      </div>

      <div className="bd__o bd__gbp" style={lift(2)}>
        <div className="bd__gbp-cover">
          <Monogram name={name} size={44} />
        </div>
        <div className="bd__gbp-body">
          <div className="bd__gbp-id">
            <span className="bd__gbp-av">
              <Monogram name={name} size={18} />
            </span>
            <span className="bd__gbp-n">{name}</span>
          </div>
          <p className="bd__gbp-r">
            4.9 <span className="bd__stars">★★★★★</span> (212)
          </p>
          <p className="bd__gbp-l">Local business · Open · Closes 5 PM</p>
          <p className="bd__pills">
            <span className="bd__pill bd__pill--fill">Call</span>
            <span className="bd__pill">Directions</span>
          </p>
        </div>
      </div>

      <ul className="bd__o bd__grid" style={lift(3)}>
        {TILES.map((x, n) => (
          // eslint-disable-next-line react/no-array-index-key
          <li className={`bd__tile bd__tile--${x.k}`} key={n}>
            {x.mark ? <Monogram name={name} size={24} /> : x.name ? name : x.t}
          </li>
        ))}
      </ul>

      <div className="bd__o bd__appt" style={lift(4)}>
        <Monogram name={name} size={16} />
        <p className="bd__appt-k">Your next visit</p>
        <p className="bd__appt-d">Tue 14 Oct · 10:30</p>
      </div>

      <div className="bd__o bd__badge" style={lift(5)}>
        <span className="bd__stitch" />
        <Monogram name={name} size={36} />
      </div>

      <div className="bd__strip">
        <ul className="bd__sw">
          {['primary', 'deep', 'accent', 'paper', 'ink'].map((k) => (
            <li key={k}>
              <span className="bd__chip" style={{ background: set[k] }} />
              <span className="bd__hex">{set[k]}</span>
            </li>
          ))}
        </ul>
        <span className="bd__faces">Display: Clash Display · Text: Satoshi</span>
      </div>
    </div>
  );
}

export default function BrandDesk() {
  const ref = useRef(null);
  const [t, , , leave] = useLoop(ref, TOTAL, { once: true });
  const [i] = useBrandSet();
  const [value, setValue] = useState('');
  const [wide, setWide] = useState(() => typeof window === 'undefined' || window.innerWidth >= 1024);
  const [, setFonts] = useState(0);
  useEffect(() => {
    const on = () => setWide(window.innerWidth >= 1024);
    window.addEventListener('resize', on);
    if (document.fonts) document.fonts.ready.then(() => setFonts((n) => n + 1));
    return () => window.removeEventListener('resize', on);
  }, []);

  const name = value.trim() || DEMO;
  /* The sign's free width: from 1024, 520 less its padding (72 and 32),
     the mark and the 20 gap, and the 60 the quote's corner covers; below,
     the sign is the column's width. */
  const signFs = wide ? fit(name, 520 - 72 - 32 - 76 - 60, 34) : fit(name, Math.max(140, window.innerWidth - 170), 26);

  return (
    <figure className="bd" data-artifact="BrandDesk" data-device="desk">
      <div className="bd__controls">
        <div className="bd__field">
          <label className="bd__label" htmlFor="bd-name">
            Your business name
          </label>
          <input
            id="bd-name"
            className="bd__input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, MAX))}
            maxLength={MAX}
            placeholder="Type your business name"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="bd__sets" role="radiogroup" aria-label="Colour set">
          <span className="bd__sets-k" aria-hidden="true">
            Colour set
          </span>
          {SETS.map((s, n) => (
            <button
              type="button"
              role="radio"
              aria-checked={n === i}
              aria-label={s.name}
              className="bd__set"
              key={s.id}
              onClick={() => setBrandSet(n)}
              onKeyDown={(e) => {
                const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
                if (!d) return;
                e.preventDefault();
                const next = (n + d + SETS.length) % SETS.length;
                setBrandSet(next);
                e.currentTarget.parentElement.querySelectorAll('.bd__set')[next].focus();
              }}
              tabIndex={n === i ? 0 : -1}
            >
              <span className="bd__set-a" style={{ background: s.primary }} />
              <span className="bd__set-b" style={{ background: s.accent }} />
            </button>
          ))}
        </div>
      </div>
      <div className="bd__stage" ref={ref} aria-hidden="true" {...leaving(leave)}>
        <Crossfade value={i} render={(n) => <Desk set={SETS[n]} t={t} name={name} signFs={signFs} />} />
      </div>
      <figcaption className="bd__cap">
        <span>One identity, on everything your customers see.</span>
        <span>Branding from {money(FIGURES.brandingBasic)}</span>
      </figcaption>
    </figure>
  );
}

import React, { useRef } from 'react';
import { useLoop, step, leaving } from './loop.js';
import Monogram from './Monogram.jsx';
import Crossfade from './Crossfade.jsx';
import { SETS, useBrandSet, setVars } from '../../content/brandSets.js';
import './artifacts.css';
import './search-sheet.css';

/* SERVICES, MARKETING: FIRST WHERE THEY SEARCH. THEN THE PHONE RINGS
   (final17, 2026-10-06, the founder). It replaced the before/after slider,
   which is deleted with its drift. The client is Harbor Dental, a demo,
   in the colour set the Branding selector holds (brandSets.js).

     the sheet    a results page, 720 wide at 1280 from x = 120, white, a
                  1px #E6E6E6 border, 12px radius: the search bar, a
                  Sponsored ad, Places with a drawn map and three place
                  rows, one organic result. No logo; the only platform words
                  are Sponsored, Places, Call and Directions (BUILD-LAW Real
                  over drawn)
     the receipt  300 x 400, over the sheet's right edge by 60, 2deg, a
                  zigzag foot, mono 12px, "Illustrative figures"

   THE LOOP (loop.js): first paint, off screen and reduced motion show the
   sheet with Harbor Dental's Call pill pressed, no call strip, 41 calls
   and 19 patients. At half in view, and every 10s after (a 4s play and the
   6s hold), the two changing figures and the pill crossfade 400ms to the
   first frame; the pill presses (scale .97, 150ms); the call strip slides
   up over the sheet's foot and holds 2.5s while the figures tick to 42 and
   20; it slides out. The ticks stay until the next play reverts them. The
   stage is a picture, aria-hidden; the caption is the content. */
const TOTAL = 4000;
const T = { press: 300, up: 450, tick: 900, out: 3250 };
const SLIDE = 300;

const PLACES = [
  { n: 'Harbor Dental', r: '4.9', s: '★★★★★', c: '(212)', o: 'Open · Closes 5 PM', you: true },
  { n: 'Riverside Dental', r: '4.3', s: '★★★★☆', c: '(58)', o: 'Open' },
  { n: 'Main Street Dental Care', r: '4.6', s: '★★★★★', c: '(91)', o: 'Closed · Opens 9 AM' },
];

function Sheet({ set, t }) {
  const rest = t < 0;
  const pressed = rest || t >= T.press;
  const pressP = rest ? 1 : step(t, T.press, 150);
  const ticked = !rest && t >= T.tick;
  /* The strip: 0 below the sheet's foot, 1 in place. */
  const strip = rest ? 0 : t < T.out ? step(t, T.up, SLIDE) : 1 - step(t, T.out, SLIDE);
  return (
    <div className="ss2" style={setVars(set)}>
      <div className="ss2__sheet">
        <div className="ss2__bar">
          <span className="ss2__lens" />
          dentist near me
        </div>

        <div className="ss2__ad">
          <p className="ss2__sp">Sponsored</p>
          <p className="ss2__meta">Harbor Dental · harbordental.com</p>
          <p className="ss2__h">Harbor Dental | New patients welcome | Book this week</p>
          <p className="ss2__d">Family dentistry, Saturday hours, same-week appointments.</p>
          <p className="ss2__links">
            <span>Book online</span>
            <span>Our fees</span>
          </p>
        </div>

        <p className="ss2__places">Places</p>
        <div className="ss2__map">
          <span className="ss2__road ss2__road--h" />
          <span className="ss2__road ss2__road--v" />
          <span className="ss2__dot" style={{ left: '22%', top: '62%' }} />
          <span className="ss2__dot" style={{ left: '71%', top: '30%' }} />
          <span className="ss2__pin">
            <Monogram size={18} />
          </span>
        </div>
        <ul className="ss2__rows">
          {PLACES.map((p) => (
            <li className={`ss2__row${p.you ? ' ss2__row--you' : ''}`} key={p.n}>
              <span className="ss2__row-id">
                <span className="ss2__row-n">{p.n}</span>
                <span className="ss2__row-r">
                  {p.r} <span className="ss2__stars">{p.s}</span> {p.c} · Dentist
                </span>
                <span className={`ss2__row-o${p.o.startsWith('Open') ? ' ss2__row-o--open' : ''}`}>{p.o}</span>
              </span>
              <span className="ss2__pills">
                <span
                  className={`ss2__pill ss2__pill--call${p.you && pressed ? ' is-pressed' : ''}`}
                  style={p.you && !rest && pressP < 1 ? { transform: `scale(${(1 - 0.03 * pressP).toFixed(3)})` } : undefined}
                >
                  Call
                </span>
                <span className="ss2__pill ss2__pill--dir">Directions</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="ss2__org">
          <p className="ss2__meta">harbordental.com</p>
          <p className="ss2__h">Harbor Dental, family dentist</p>
          <p className="ss2__d">Examinations, hygiene, fillings, whitening. Book online or call.</p>
        </div>

        {strip > 0 ? (
          <div className="ss2__call" style={{ transform: `translateY(${((1 - strip) * 88).toFixed(1)}px)` }}>
            <span className="ss2__handset">
              <span />
            </span>
            <span className="ss2__call-t">
              <span className="ss2__call-k">Incoming call</span>
              <span className="ss2__call-l">Harbor Dental listing · Places</span>
            </span>
          </div>
        ) : null}
      </div>

      <div className="ss2__receipt">
        <div className="ss2__paper">
          <p className="ss2__rh">
            <Monogram size={20} />
            <span>This month</span>
          </p>
          <p className="ss2__rk">Illustrative figures</p>
          <ul className="ss2__lines">
            <li>
              <span>Ad spend</span>
              <span>$2,400</span>
            </li>
            <li>
              <span>Calls from the listing</span>
              <span className="ss2__tick">{ticked ? '42' : '41'}</span>
            </li>
            <li>
              <span>Form enquiries</span>
              <span>22</span>
            </li>
            <li>
              <span>Cost per enquiry</span>
              <span>$38</span>
            </li>
            <li>
              <span>New Google reviews</span>
              <span>14</span>
            </li>
            <li>
              <span>Rating</span>
              <span>4.9</span>
            </li>
          </ul>
          <p className="ss2__total">
            <span>New patients booked</span>
            <span className="ss2__tick">{ticked ? '20' : '19'}</span>
          </p>
          <p className="ss2__rf">Same identity on the ad, the listing and the site.</p>
        </div>
      </div>
    </div>
  );
}

export default function SearchSheet() {
  const ref = useRef(null);
  const [t, , , leave] = useLoop(ref, TOTAL, { start: -1, rest: () => -1 });
  const [i] = useBrandSet();
  return (
    <figure className="ssf" data-artifact="SearchSheet" data-device="results sheet">
      <div className="ssf__stage" ref={ref} aria-hidden="true" {...leaving(leave)}>
        <Crossfade value={i} render={(n) => <Sheet set={SETS[n]} t={t} />} />
      </div>
      <figcaption className="ssf__cap">
        <span>First where they search. Then the phone rings.</span>
        <span>Marketing priced on the call</span>
      </figcaption>
    </figure>
  );
}

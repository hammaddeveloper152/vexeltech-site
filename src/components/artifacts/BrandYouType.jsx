import React, { useEffect, useRef, useState } from 'react';
import PhoneShell from './PhoneShell.jsx';
import BeforeAfter from './BeforeAfter.jsx';
import { FIGURES, money } from '../../content/pricing.js';
import './artifacts.css';
import './brand-slider.css';

/* SERVICES, BRANDING: THE BRAND YOU TYPE (2026-10-03, the founder, final7).
   No client name, capture or logo is in it.

   THE BEFORE/AFTER SLIDER, 2026-10-06 (the founder's approved frame A,
   final15). It replaced the presentation board of the quality pass, which
   is deleted. The name field stays left of the stage from 1280 (above it
   below), on the cream panel; the stage is 16:9 at 1280 (BeforeAfter.jsx
   carries the drag, the keys and the drift).

   Both layers hold the same three objects at the same places, as the frame
   draws them: a sign band in perspective top left, a business card turned
   -4deg bottom left, and a phone (PhoneShell, BUILD-LAW rule 0's container)
   with a Google Business listing on the right.

     before   a grey gradient sign with the name in a plain sans, a white
              card with the name in a serif, a listing with an empty grey
              avatar and no cover; the whole layer desaturated
     after    the sign in the brand's A with the mark and the name in the
              display face, the card in A with the mark and the spaced
              name, the listing with the mark as its avatar and a cover in
              A carrying the mark

   The rating and review count are the same on both sides (the brief: only
   the mark changes). From 1024 each layer sets the scene twice, one per
   half, so at 50% the stage is the frame: a whole "before" left of the
   divider and a whole "after" right of it. Below 1024 a layer is one
   scene across the stage.

   THE NAME is the one typed in the field, the demo's ("Harbor Dental")
   while the field is empty. THE COLOURS are picked from the name, one of
   the five sets by a hash, as built: the demo's is navy and sand.
   Measured, every set: B on A 5.23 to 10.79, B on A at 86% 5.49 to 11.54,
   A on cream 9.68 to 13.18. */
const DEMO = 'Harbor Dental';
const MAX = 24;
const SETS = [
  { a: '#1F2A44', b: '#EADFC8' },
  { a: '#1E3D2F', b: '#CFE8D5' },
  { a: '#5A1F24', b: '#F1D9D2' },
  { a: '#232323', b: '#F26B4F' },
  { a: '#2E3A4A', b: '#CFE3F2' },
];
/* The listing's figures, the same on both sides, from the approved frame. */
const RATING = '4.9';
const REVIEWS = '(212)';

function setFor(name) {
  let h = 0;
  for (const ch of name.trim().toLowerCase()) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return SETS[h % SETS.length];
}

function initialsOf(name) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => [...w][0])
    .join('')
    .toUpperCase();
}

/* The font size that fits `text`, uppercase, into `avail` px, at most
   `max` and never under the 11px floor. */
let ctx = null;
function fit(text, avail, max, font, track) {
  if (!text || avail <= 0 || typeof document === 'undefined') return max;
  ctx = ctx || document.createElement('canvas').getContext('2d');
  ctx.font = font.replace('{px}', `${max}px`);
  const w = ctx.measureText(text.toUpperCase()).width + track * max * [...text].length;
  return Math.max(11, Math.min(max, Math.floor((max * avail) / w)));
}
const F_BEFORE = "400 {px} Arial, 'Helvetica Neue', sans-serif";
const F_AFTER = "500 {px} 'Clash Display', 'Helvetica Neue', Arial, sans-serif";

/* The sign's width in a scene `w` wide: the scene less 48, at most 460. */
const signOf = (w) => Math.max(160, Math.min(460, w - 48));

function Listing({ name, ini, after }) {
  return (
    <div className="bs-gbp">
      <span className="bs-gbp__src">Google</span>
      <span className="bs-gbp__row">
        <span className={`bs-gbp__av${after ? ' bs-gbp__av--mark' : ''}`}>{after ? ini : null}</span>
        <span className="bs-gbp__id">
          <span className="bs-gbp__n">{name}</span>
          <span className="bs-gbp__r">
            {RATING} <span className="bs-gbp__stars">★★★★★</span> {REVIEWS}
          </span>
        </span>
      </span>
      <span className="bs-gbp__l">{name === DEMO ? 'Dentist · Open · Closes 5 PM' : 'Open · Closes 5 PM'}</span>
      <span className={`bs-gbp__cover${after ? ' bs-gbp__cover--mark' : ''}`}>{after ? ini : null}</span>
    </div>
  );
}

function Scene({ name, ini, after, w }) {
  const signW = signOf(w);
  const fs = after
    ? fit(name, signW - 40 - 40 - 14, 28, F_AFTER, 0.04)
    : fit(name, signW - 40, 28, F_BEFORE, 0);
  return (
    <div className={`bs ${after ? 'bs--after' : 'bs--before'}`}>
      <div className="bs-sign" style={{ width: signW }}>
        {after ? <span className="bs-mark bs-mark--sign">{ini}</span> : null}
        <span className="bs-sign__w" style={{ fontSize: fs }}>
          {name}
        </span>
      </div>
      <div className="bs-card">
        {after ? (
          <>
            <span className="bs-mark bs-mark--card">{ini}</span>
            <span className="bs-card__nm">{name}</span>
          </>
        ) : (
          <span className="bs-card__serif">{name}</span>
        )}
      </div>
      <div className="bs-phone">
        <PhoneShell width={w >= 400 ? 168 : 152} screen="#ffffff" ratio="390 / 600">
          <Listing name={name} ini={ini} after={after} />
        </PhoneShell>
      </div>
    </div>
  );
}

export default function BrandYouType() {
  const boxRef = useRef(null);
  const [value, setValue] = useState('');
  const [w, setW] = useState(420);
  const [, setFonts] = useState(0);

  /* The scene's own width: half the stage from 1024, else all of it. */
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const measure = () => {
      const s = el.querySelector('.ba__stage');
      if (!s) return;
      const sw = s.clientWidth;
      setW(window.innerWidth >= 1024 ? sw / 2 : sw);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    if (document.fonts) document.fonts.ready.then(() => setFonts((n) => n + 1));
    return () => ro.disconnect();
  }, []);

  const name = value.trim() || DEMO;
  const { a, b } = setFor(name);
  const ini = initialsOf(name);
  const layer = (after) => (
    <div className="bs-row">
      <Scene name={name} ini={ini} after={after} w={w} />
      <Scene name={name} ini={ini} after={after} w={w} />
    </div>
  );

  return (
    <div className="by by--slider" data-artifact="BrandYouType">
      <div className="by__panel" style={{ '--a': a, '--b': b }}>
        <div className="by__field">
          <label className="by__label" htmlFor="by-name">
            Your name here
          </label>
          <input
            id="by-name"
            className="by__input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, MAX))}
            maxLength={MAX}
            placeholder="Type your business name"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="by__slider" ref={boxRef}>
          <BeforeAfter
            tone="cream"
            name="Before and after divider"
            before={layer(false)}
            after={layer(true)}
            cap="Same business. Drag to see the difference a mark makes."
            end={`Branding from ${money(FIGURES.brandingBasic)}`}
          />
        </div>
      </div>
    </div>
  );
}

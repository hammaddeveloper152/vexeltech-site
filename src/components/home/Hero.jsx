import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { videoAllowed } from './Video.jsx';
import { FIGURES, money } from '../../content/pricing.js';
import { NARROW_QUERY } from './heroSpot.js';
import { SPOT } from './heroFiles.js';
import './Hero.css';

/* THE HERO: THE FILM BEHIND ONE STATIC HEADLINE.

   COPY V4.1, 2026-10-06 (the founder's final audit). The rotating headline
   and its clock are deleted, with the eyebrow and the swash on "Yet.". The
   h1 is one static line, "Website design and marketing for small
   businesses.", with a 20px line under it; the offer line, the calls and
   the promise line are unchanged. The film still plays behind the copy.

   ---- Two modes, decided once at mount ---------------------------------------

     spot     the film plays, muted, inline, looping (2026-09-30)
     still    REDUCED MOTION, SAVE-DATA, A SLOW CONNECTION, OR NO PLAYABLE
              VIDEO. The film's first-second frame (`first`, the same image the
              video element shows as its poster), with nothing animating.
              Never the last frame.

   THE HERO SHOWS THE FILM OR A FRAME OF THE FILM, NOTHING ELSE, EVER
   (2026-10-05, the founder's pre-launch pass, BUILD-LAW Real over drawn).

   The gates are `videoAllowed()`, shared with the work grid so they cannot
   drift. The copy is present from the first paint and never moves. */

function pickMode() {
  if (typeof window === 'undefined') return 'still';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'still';
  if (!videoAllowed()) return 'still';
  const probe = document.createElement('video');
  const plays =
    probe.canPlayType('video/webm; codecs="vp9"') ||
    probe.canPlayType('video/mp4; codecs="avc1.640028"');
  return plays ? 'spot' : 'still';
}

export default function Hero() {
  const [mode, setMode] = useState(pickMode);
  /* Below 1024 the mobile cut, from 1024 the desktop encode. Decided at
     mount (see NARROW_QUERY). Both autoplay and loop. */
  const [narrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(NARROW_QUERY).matches
  );
  const videoRef = useRef(null);

  /* A reader who turns reduced motion on mid-film gets the still. */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      if (mq.matches) setMode('still');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (mode !== 'spot') return undefined;
    const v = videoRef.current;
    if (!v) return undefined;

    /* React does not reflect `muted` to the attribute on first render, and an
       unmuted element is the one autoplay is refused for. */
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;

    /* Error events from <source> children do not bubble, so this listens in
       the capture phase. The film is only abandoned once every source has
       failed. */
    const onError = () => {
      if (v.error || v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) setMode('still');
    };

    /* Play only while the page is being looked at. */
    const sync = () => {
      if (document.visibilityState !== 'visible') {
        v.pause();
        return;
      }
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch((e) => {
          /* AUTOPLAY REFUSED: the poster, the film's first-second frame,
             stays. */
          if (e && e.name === 'NotSupportedError') setMode('still');
        });
      }
    };

    v.addEventListener('error', onError, true);
    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      v.removeEventListener('error', onError, true);
      document.removeEventListener('visibilitychange', sync);
      v.pause();
    };
  }, [mode]);

  const src = narrow ? SPOT.mobile : SPOT.wide;

  return (
    <section className="vt hero" aria-labelledby="hero-h" data-mode={mode}>
      {/* THE FRAME the film stands in: the hero's own box, never moved. */}
      <div className="hero__frame">
        {mode === 'spot' ? (
          <video
            ref={videoRef}
            className="hero__spot"
            poster={src.first}
            muted
            playsInline
            autoPlay
            loop
            preload={narrow ? 'metadata' : 'auto'}
            /* Decoration under the copy, not content: the h1 carries what
               the page is. */
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
          >
            {/* VP9 first, so a browser that decodes it never fetches the h.264. */}
            <source src={src.webm} type="video/webm" />
            <source src={src.mp4} type="video/mp4" />
          </video>
        ) : null}

        {/* The still follows the width. It is the film's FIRST-SECOND frame,
            never the last (2026-10-05). */}
        {mode === 'still' ? (
          <picture>
            <source media={NARROW_QUERY} srcSet={SPOT.mobile.first} type="image/jpeg" />
            <img className="hero__spot" src={SPOT.wide.first} alt="" decoding="async" />
          </picture>
        ) : null}
      </div>

      <div className="hero__body">
        <h1 className="hero__headline hero__h1" id="hero-h">
          Website design and marketing for small businesses.
        </h1>
        <p className="hero__sub">One team builds the site, runs the ads and answers the enquiry.</p>

        <div className="hero__support">
          <div className="hero__actions">
            <Link className="hero__cta" to="/contact-us">
              Get a custom quote
            </Link>
            <Link className="hero__cta hero__cta--line" to="/contact-us">
              Ask a question
            </Link>
          </div>

          {/* THE PRICE LINE, 2026-09-24, verbatim, under the buttons. The
              figures come from content/pricing.js. */}
          <p className="hero__price">
            Websites {money(FIGURES.website)} flat. Branding from {money(FIGURES.brandingBasic)}.
            Live in four business days.
          </p>

          {/* THE PROMISE LINE, COPY V3, 2026-10-01. */}
          <p className="hero__promise">A written number within one business day.</p>
        </div>
      </div>
    </section>
  );
}

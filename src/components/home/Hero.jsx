import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSurface from './HeroSurface.jsx';
import { videoAllowed } from './Video.jsx';
import { FIGURES, money } from '../../content/pricing.js';
import { CUTS, EXIT_MS, LINES, NARROW_QUERY, SPOT } from './heroSpot.js';
import './Hero.css';
import Brush from '../site/Brush.jsx';

/* THE HERO IS A SPOT NOW, AND THE CLIP IS THE CLOCK.

   A 12-second film under the copy, four shots, one line per shot. The hero ran
   on one clock before — a phase handed from the entrance to the ambient wall —
   and it still does. The clock is the video's own `currentTime`: a line starts
   on its cut because the frame on screen is the cut, not because a timer set to
   1875ms agreed with it. A stalled download, a backgrounded tab or a slow
   decoder moves every line with the picture, and a timer would move none.

   ---- Three modes, decided once at mount -------------------------------------

     spot     the film plays, muted, inline, looping (2026-09-30). Line 1 is
              there from the first paint (2026-10-01); each later line fades
              up on its cut and fades out 200ms before the next.

     still    REDUCED MOTION. The poster, which is the film's last frame, and
              line 1, with nothing animating. An autoplay the browser refuses
              does not land here (2026-09-24): the film's own first-second
              poster stays, with line 1.

     surface  SAVE-DATA, A SLOW CONNECTION, OR NO PLAYABLE VIDEO. The lit shader
              and line 1. No bytes of film or poster are requested, which is
              what Save-Data asks for.

   UNTIL 2026-10-01 the still, the surface and a refused autoplay showed the
   final line instead; the founder's perf pass put line 1 in every first
   paint.

   The gates are `videoAllowed()`, shared with the work grid so they cannot
   drift. One of its four does not apply here and it is worth saying which:
   `preload="none"` exists so that nothing is fetched until a plate is on
   screen, and the hero is on screen at load. The film is the hero; holding it
   back would be holding back the section.

   ---- What does not move -----------------------------------------------------

   The sub, both calls and the note are present from the first paint and never
   change position. The headline box is two lines tall at every width whatever
   line is in it, because every line is two lines or fewer by construction —
   see the size derivation in Hero.css — so a one-line shot does not pull the
   stack up and a two-line shot does not push it down.

   ---- No strike ----------------------------------------------------------------

   The spot's lines once arrived along a drawn line at 51.93 degrees, words
   slamming in on it, at every cut. The user removed it on 2026-09-14: no drawn
   line at any cut. A line is one run of text now, not a mask per word, because
   the masks only existed to carry the slam. DESIGN.md records the removal. */

function pickMode() {
  if (typeof window === 'undefined') return 'surface';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'still';
  if (!videoAllowed()) return 'surface';
  const probe = document.createElement('video');
  const plays =
    probe.canPlayType('video/webm; codecs="vp9"') ||
    probe.canPlayType('video/mp4; codecs="avc1.640028"');
  return plays ? 'spot' : 'surface';
}

/* Which shot a time is in, and whether its line has started leaving.

   LINE 1 HOLDS ACROSS CUT 1 ON THE FIRST PASS, 2026-10-01 (the founder's
   bundle split). The rotation's first cut must not fire before 2.5s, so line
   1 is the largest paint in the LCP window. Cut 1 is at 1.875s of the film,
   which on a warm load is well inside 2.5s of the page, and a line moved off
   its cut would no longer change with the picture. So on the film's first
   pass the first shot's line stays through the second shot and the rotation
   starts at cut 2 (6.042s), with line 3. Line 2 first shows on the second
   pass, on its own cut, and every pass after the first runs as cut. */
function shotAt(t, firstPass) {
  let i = 0;
  while (i + 1 < CUTS.length && t >= CUTS[i + 1]) i += 1;
  const next = CUTS[i + 1];
  const leaving = next !== undefined && t >= next - EXIT_MS / 1000;
  if (firstPass && i === 0) return { shot: 0, leaving: false };
  if (firstPass && i === 1) return { shot: 0, leaving };
  return { shot: i, leaving };
}

/* One line of copy. Keyed by shot at the call site, so every cut mounts a
   fresh line and its fade-up in Hero.css runs again. */
/* THE HIGHLIGHTER, 2026-09-24 (the founder): home's one highlighted word is
   "Yet." in the second shot's line, asphalt on the swash since 2026-09-25
   (Brush.jsx; it was a machine yellow box, `.hl`). Split on the word rather than hard-coding the line, so
   the copy in heroSpot.js stays the only place the line is written. */
const HIGHLIGHT = 'Yet.';

/* `enter`: the line fades up as it mounts. The FIRST line of a visit does
   not: it is in the first paint, unanimated (2026-10-01). */
function Line({ text, leaving, enter }) {
  const at = text.lastIndexOf(HIGHLIGHT);
  return (
    <span
      className="hero__line"
      data-leaving={leaving ? 'true' : 'false'}
      data-enter={enter ? 'true' : 'false'}
    >
      {at < 0 ? (
        text
      ) : (
        <>
          {text.slice(0, at)}
          {/* THE SWASH, 2026-09-25 (the Genesis pass): the highlight is the
              brush stroke now, not the box (Brush.jsx). */}
          <Brush className="brush--hl" thickness="fit" angle={-2} at="52%">{HIGHLIGHT}</Brush>
          {text.slice(at + HIGHLIGHT.length)}
        </>
      )}
    </span>
  );
}

/* THE REVEAL IS DELETED, 2026-09-30 (the founder). From the Genesis pass
   (2026-09-25) the film stood in a frame 60% of the measure wide under the
   copy, and a ScrollTrigger pinned the hero for 100vh while the frame grew to
   the viewport; from earlier the same day, 1024 and up only. The film is the
   hero at every width now: full bleed behind the copy, fixed in place, no
   pin, no scale, nothing tied to scroll (Hero.css, THE FILM BEHIND THE COPY).
   ScrollTrigger is still registered by smoothScroll.js for the sections that
   use it; the hero makes no trigger. Its record is in DESIGN.md. */
const NARROW = NARROW_QUERY;

export default function Hero() {
  const [mode, setMode] = useState(pickMode);
  /* Below 1024 the mobile cut, from 1024 the desktop encode. Decided at
     mount (see NARROW_QUERY). Both autoplay and loop. */
  const [narrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(NARROW).matches
  );
  /* null until the first frame is actually playing, so no line enters over a
     frame that has not decoded yet. */
  const [state, setState] = useState({ shot: null, leaving: false });
  const videoRef = useRef(null);

  /* A reader who turns reduced motion on mid-spot gets the still, not the rest
     of the film. */
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

    /* It loops at every width (2026-09-30). The desktop spot played once and
       held its last frame until the film became the hero everywhere. */
    v.loop = true;

    let raf = 0;
    /* The first pass ends when the loop wraps the clock back. */
    let firstPass = true;
    let last = 0;
    const read = () => {
      const t = v.currentTime;
      if (t + 1 < last) firstPass = false;
      last = t;
      const next = shotAt(t, firstPass);
      setState((s) => (s.shot === next.shot && s.leaving === next.leaving ? s : next));
    };
    const tick = () => {
      read();
      raf = !v.paused && !v.ended ? requestAnimationFrame(tick) : 0;
    };
    const onPlaying = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onEnded = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      setState({ shot: CUTS.length - 1, leaving: false });
    };
    /* A seek while paused moves the picture without a frame loop running, so
       the line is read once for it. This is what lets a capture hold any
       instant of the spot exactly. */
    const onSeeked = () => {
      if (v.paused) read();
    };
    /* Error events from <source> children do not bubble, so this listens in
       the capture phase. The film is only abandoned once every source has
       failed, which is when the element reports it has none left. */
    const onError = () => {
      if (v.error || v.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) setMode('surface');
    };

    /* PLAY ONLY AFTER CANPLAYTHROUGH, 2026-09-24 (the founder's energy
       pass): the poster (a frame from the first second) holds until the
       browser says the clip can run to the end without stalling, so the
       lines never wait on a buffering film. */
    /* It does not wait for canplaythrough any more, at any width: the element
       autoplays (2026-09-30), and a phone may never report canplaythrough
       before playback starts. The energy pass's wait is superseded. */
    let ready = true;
    const onReady = () => {
      ready = true;
      sync();
    };

    /* Play only while the page is being looked at. The spot runs once, and a
       spot that plays out in a background tab has been spent on nobody. */
    const sync = () => {
      if (v.ended || !ready) return;
      if (document.visibilityState !== 'visible') {
        v.pause();
        return;
      }
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch((e) => {
          /* AUTOPLAY REFUSED: THE POSTER STAYS (2026-09-24), and the
             headline keeps line 1, which it has shown since the first paint
             (2026-10-01; it switched to the final line until then). */
          if (e && e.name === 'NotSupportedError') setMode('surface');
        });
      }
    };

    v.addEventListener('canplaythrough', onReady);
    v.addEventListener('playing', onPlaying);
    v.addEventListener('ended', onEnded);
    v.addEventListener('seeked', onSeeked);
    v.addEventListener('error', onError, true);
    document.addEventListener('visibilitychange', sync);
    /* The element autoplays (2026-09-30), so it can be playing before these
       listeners exist, and its one `playing` event is then gone: no frame
       loop, and no headline line would ever mount. Start it by hand. */
    if (!v.paused) onPlaying();
    sync();

    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener('canplaythrough', onReady);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('seeked', onSeeked);
      v.removeEventListener('error', onError, true);
      document.removeEventListener('visibilitychange', sync);
      v.pause();
    };
  }, [mode]);

  const src = narrow ? SPOT.mobile : SPOT.wide;

  /* THE HEADLINE PAINTS FIRST, 2026-10-01 (the founder). Line 1 is on
     screen from the first render, before the film has loaded or played, in
     every mode: the film's frames may advance the rotation and never gate
     the first line. It was measured as the home LCP element with 2.45s of
     render delay, because it mounted only once the film was playing and the
     copy then waited for the fonts before fading in. The copy's entrance is
     now a 12px rise that starts at once, with no opacity (Hero.css). */
  const advanced = useRef(false);
  if (state.shot !== null && state.shot !== 0) advanced.current = true;

  /* THE NOTE. It stood in the frame's lower-left corner from 2026-09-25; with
     the film behind the copy nothing else is painted over the film
     (2026-09-30), so it is out of the frame. Only the surface mode, which
     has no film, keeps it in the stack. */
  const note = (
    <p className="hero__note">
      You'll see the work before you owe us anything. Ten seconds to decide, not ten meetings.
    </p>
  );
  /* Line 1 until the film says otherwise; the still and the surface modes
     show line 1 too (2026-10-01; they showed the final line). */
  const shot = mode === 'spot' ? (state.shot ?? 0) : 0;

  return (
    <section
      className="vt hero"
      aria-labelledby="hero-h"
      data-mode={mode}
    >
      {/* THE FRAME the film stands in: the hero's own box, never moved. */}
      {mode !== 'surface' ? (
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
              /* Metadata only on the mobile cut: autoplay fetches what it
                 plays, and nothing more is asked for up front. */
              preload={narrow ? 'metadata' : 'auto'}
              /* Decoration under the copy, not content: the lines carry what the
                 film says, and the h1 carries the lines. */
              aria-hidden="true"
              tabIndex={-1}
              disablePictureInPicture
            >
              {/* VP9 first, so a browser that decodes it never fetches the h.264. */}
              <source src={src.webm} type="video/webm" />
              <source src={src.mp4} type="video/mp4" />
            </video>
          ) : null}

          {/* The still follows the width, unlike the film: nothing is playing, so
              a rotated phone can take the other crop without restarting anything. */}
          {mode === 'still' ? (
            <picture>
              <source media={NARROW_QUERY} srcSet={SPOT.mobile.poster} type="image/webp" />
              <img className="hero__spot" src={SPOT.wide.poster} alt="" decoding="async" />
            </picture>
          ) : null}
        </div>
      ) : null}

      {mode === 'surface' ? <HeroSurface /> : null}

      {/* Grain over the film, below the content: the site's one noise
          (`--grain`, tokens.css) at 3%, 2026-09-24. */}
      <span className="hero__grain" aria-hidden="true" />

      <div className="hero__body">
        {/* ONE ACCESSIBLE NAME, AND IT IS THE HEADLINE THAT STAYS. Four lines
            announced as they cut would be a screen reader talking over a film
            it cannot see. (The name is the visible line since 2026-09-25,
            below.) */}
        {/* THE EYEBROW, COPY V3.1, 2026-10-01: 12px mono uppercase in
            steel-lift, above the headline, from 1024 only (Hero.css). */}
        <p className="hero__eyebrow lbl">
          Websites, branding, marketing and automation for small business
        </p>
        <h1 className="hero__headline" id="hero-h">
          {/* THE NAME IS THE VISIBLE LINE, 2026-09-25 (the founder's content
              audit): the h1 reads what it shows. It was the final line in a
              clipped span, with the shown line aria-hidden, so the name and
              the headline differed for three of the four shots, and a
              crawler read the two run together. */}
          <Line
            key={shot}
            text={LINES[shot]}
            leaving={mode === 'spot' && state.leaving}
            enter={advanced.current}
          />
        </h1>

        {/* The support stack, in one box so its shade zone has one to stand
            in: the copy zone runs from the headline's bottom edge to the copy
            block's bottom, and falls to nothing at 62% of the width. See
            `.hero__support::before`. Nothing about the stack's layout changes. */}
        <div className="hero__support">
          {/* The sub is gone, 2026-10-01: V3 gives the hero none; the
              eyebrow above the headline replaces it. */}

          {/* Sentence case in the SOURCE, not a text-transform. Case is copy. */}
          <div className="hero__actions">
            <Link className="hero__cta" to="/contact-us">
              Get a custom quote
            </Link>
            <Link className="hero__cta hero__cta--line" to="/contact-us">
              Ask a question
            </Link>
          </div>

          {/* THE PRICE LINE, 2026-09-24 (the founder's energy pass, CRO for
              paid traffic), verbatim, under the buttons. The figures come
              from content/pricing.js so a price change cannot leave the
              hero behind. */}
          <p className="hero__price">
            Websites {money(FIGURES.website)} flat. Branding from {money(FIGURES.brandingBasic)}.
            Live in four business days.
          </p>

          {/* THE PROMISE LINE, COPY V3, 2026-10-01: under the calls, 12px
              mono in steel-lift, at every width. */}
          <p className="hero__promise">A written number within one business day.</p>

          {/* Only the surface mode, which has no film, keeps the note (see
              `note` above). */}
          {mode === 'surface' ? note : null}
        </div>
      </div>
    </section>
  );
}

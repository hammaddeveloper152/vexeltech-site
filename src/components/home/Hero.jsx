import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import HeroSurface from './HeroSurface.jsx';
import { videoAllowed } from './Video.jsx';
import { FIGURES, money } from '../../content/pricing.js';
import { CUTS, EXIT_MS, FINAL_LINE, LINES, SPOT, TALL_QUERY } from './heroSpot.js';
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

     spot     the film plays once, muted, inline, no loop. Each line fades up
              on its cut and fades out 200ms before the next. On end the last
              frame holds, and so does the last line.

     still    REDUCED MOTION. The poster, which is the film's last frame, and
              the final line, with nothing animating. An autoplay the
              browser refuses no longer lands here (2026-09-24): the film's
              own first-second poster stays, with the final line.

     surface  SAVE-DATA, A SLOW CONNECTION, OR NO PLAYABLE VIDEO. The lit shader
              and the final line, fading up once. No bytes of film or poster
              are requested, which is what Save-Data asks for.

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

/* Which shot a time is in, and whether its line has started leaving. */
function shotAt(t) {
  let i = 0;
  while (i + 1 < CUTS.length && t >= CUTS[i + 1]) i += 1;
  const next = CUTS[i + 1];
  return { shot: i, leaving: next !== undefined && t >= next - EXIT_MS / 1000 };
}

/* One line of copy. Keyed by shot at the call site, so every cut mounts a
   fresh line and its fade-up in Hero.css runs again. */
/* THE HIGHLIGHTER, 2026-09-24 (the founder): home's one highlighted word is
   "Yet." in the second shot's line, asphalt on the swash since 2026-09-25
   (Brush.jsx; it was a machine yellow box, `.hl`). Split on the word rather than hard-coding the line, so
   the copy in heroSpot.js stays the only place the line is written. */
const HIGHLIGHT = 'Yet.';

function Line({ text, leaving }) {
  const at = text.lastIndexOf(HIGHLIGHT);
  return (
    <span className="hero__line" data-leaving={leaving ? 'true' : 'false'} aria-hidden="true">
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

gsap.registerPlugin(ScrollTrigger);

/* THE REVEAL, 2026-09-25 (the founder's Genesis pass). On load the copy
   stands on the dark ground with no film behind it; the film is below it in
   a frame, 60% of the measure wide, centred, its corners at 24px, its first
   poster showing and then playing. The hero is pinned for 100vh of scroll,
   and over it the frame grows to the whole viewport and loses its corners,
   moving up behind the headline. The zoned shades that keep the copy legible
   over the film fade in as it arrives (full by 30% of the way), so the copy
   keeps its contrast at every step; measured in DESIGN.md.

   Transform for the size and place (the frame is the hero's own size, scaled
   down); `clip-path` for the corners (BUILD-LAW Motion names it for masked
   reveals); opacity for the shades. Below 768 there is no pin: the frame
   stands under the copy at the measure's width. Reduced motion (the still
   mode) holds the first state, with no pin and no scrub. The surface mode has
   no film and no frame. */
const FRAME_SHARE = 0.6;
const FRAME_GAP = 40;

export default function Hero() {
  const sectionRef = useRef(null);
  const bodyRef = useRef(null);
  const frameRef = useRef(null);
  const [mode, setMode] = useState(pickMode);
  /* The cut is chosen with the mode and kept: see TALL_QUERY. */
  const [tall] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(TALL_QUERY).matches
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

    let raf = 0;
    const read = () => {
      const next = shotAt(v.currentTime);
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
    let ready = v.readyState >= 4;
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
          /* AUTOPLAY REFUSED: THE POSTER STAYS (2026-09-24). The element
             keeps its first-second poster and the headline takes its final
             line, the one the page is about. It used to switch to the still
             (the last frame). */
          if (e && e.name === 'NotAllowedError' && v.currentTime === 0) {
            setState({ shot: LINES.length - 1, leaving: false });
          }
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

  /* The reveal (see above). */
  useLayoutEffect(() => {
    const sec = sectionRef.current;
    const body = bodyRef.current;
    const frame = frameRef.current;
    if (!sec || !body || !frame) return undefined;
    const small = () => {
      const s = sec.getBoundingClientRect();
      const b = body.getBoundingClientRect();
      const inset = parseFloat(getComputedStyle(sec).getPropertyValue('--hero-inset')) || 0;
      const w = (s.width - 2 * inset) * FRAME_SHARE;
      const sc = w / s.width;
      return { x: (s.width - w) / 2, y: b.bottom - s.top + FRAME_GAP, sc, r: 24 / sc };
    };
    const mm = gsap.matchMedia();
    mm.add(
      { wide: '(min-width: 768px)', reduce: '(prefers-reduced-motion: reduce)' },
      (ctx) => {
        const { wide, reduce } = ctx.conditions;
        if (!wide) return undefined;
        sec.style.setProperty('--shade-in', '0');
        if (reduce || mode !== 'spot') {
          const k = small();
          gsap.set(frame, { x: k.x, y: k.y, scale: k.sc, '--frame-r': `${k.r}px`, '--note-k': 1 / k.sc });
          return () => {
            gsap.set(frame, { clearProps: 'all' });
            sec.style.removeProperty('--shade-in');
          };
        }
        gsap.fromTo(
          frame,
          {
            x: () => small().x,
            y: () => small().y,
            scale: () => small().sc,
            '--frame-r': () => `${small().r}px`,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            '--frame-r': '0px',
            ease: 'none',
            scrollTrigger: {
              trigger: sec,
              start: 'top top',
              end: '+=100%',
              pin: true,
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                sec.style.setProperty('--shade-in', String(Math.min(1, self.progress / 0.3)));
                frame.style.setProperty('--note-k', String(1 / gsap.getProperty(frame, 'scale')));
              },
              onRefresh: () => frame.style.setProperty('--note-k', String(1 / gsap.getProperty(frame, 'scale'))),
            },
          }
        );
        return () => {
          gsap.set(frame, { clearProps: 'all' });
          sec.style.removeProperty('--shade-in');
        };
      }
    );
    return () => mm.revert();
  }, [mode]);

  const src = tall ? SPOT.tall : SPOT.wide;

  /* THE NOTE, 2026-09-25 (the founder): out of the copy stack and into the
     frame's lower-left corner, 14px, over the poster and then the film, so
     the stack is short enough for the frame to show at rest. The frame is
     scaled down at rest, so the note is scaled back up by the inverse
     (`--note-k`, set by the reveal) and stays 14px and 24px in. */
  const note = (
    <p className="hero__note">
      You'll see the work before you owe us anything. Ten seconds to decide, not ten meetings.
    </p>
  );
  const shot = mode === 'spot' ? state.shot : LINES.length - 1;

  return (
    <section className="vt hero" aria-labelledby="hero-h" data-mode={mode} ref={sectionRef}>
      {/* THE FRAME the film stands in (the reveal, above). */}
      {mode !== 'surface' ? (
        <div className="hero__frame" ref={frameRef}>
          {mode === 'spot' ? (
            <video
              ref={videoRef}
              className="hero__spot"
              poster={src.first}
              muted
              playsInline
              preload="auto"
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
              <source media={TALL_QUERY} srcSet={SPOT.tall.poster} type="image/webp" />
              <img className="hero__spot" src={SPOT.wide.poster} alt="" decoding="async" />
            </picture>
          ) : null}
          <span className="hero__frame-shade" aria-hidden="true" />
          {note}
        </div>
      ) : null}

      {mode === 'surface' ? <HeroSurface /> : null}

      {/* Grain over the film, below the content: the site's one noise
          (`--grain`, tokens.css) at 3%, 2026-09-24. */}
      <span className="hero__grain" aria-hidden="true" />

      <div className="hero__body" ref={bodyRef}>
        {/* ONE ACCESSIBLE NAME, AND IT IS THE HEADLINE THAT STAYS. Four lines
            announced as they cut would be a screen reader talking over a film
            it cannot see; the final line is the sentence the page is about.
            Every visible line is aria-hidden. */}
        <h1 className="hero__headline" id="hero-h">
          <span className="hero__a11y">{FINAL_LINE}</span>
          {shot !== null ? (
            <Line key={shot} text={LINES[shot]} leaving={mode === 'spot' && state.leaving} />
          ) : null}
        </h1>

        {/* The support stack, in one box so its shade zone has one to stand
            in: the copy zone runs from the headline's bottom edge to the copy
            block's bottom, and falls to nothing at 62% of the width. See
            `.hero__support::before`. Nothing about the stack's layout changes. */}
        <div className="hero__support">
          <p className="hero__sub">
            One team for branding, websites, marketing and automation. Not four agencies
            who don't talk to each other.
          </p>

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

          {/* The note stands in the frame's lower left since 2026-09-25 (see
              `note` above); only the surface mode, which has no frame, keeps
              it in the stack. */}
          {mode === 'surface' ? note : null}
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from '../home/hooks.js';
import './PageTransition.css';

/* THE PAGE TRANSITION — the mark, at page scale.

   A full-frame machine-yellow plane, cut along the mark's own outer chevron,
   whose two halves travel apart to reveal the destination. The shapes, the
   angles and why the mark rather than a device are in PageTransition.css;
   this file owns the trigger.

   ---- Three were built. This is the one that was taken --------------------

   `?wipe=a|b|c` rendered a sweep, this split, and a strike. The switch and
   the other two are GONE from the tree rather than left behind a parameter,
   and `DESIGN.md` under "The page transition" carries what each one was, what
   it measured, and why it was not taken — a sweep cannot cover a frame wider
   than the V's arms span without a smear that puts the two arm edges on
   opposite sides of the object, and a strike held the destination 247ms to
   cover 14% of the frame. The frames are under `.measure/out/wipe/`.

   Kept as a record and not as code, because a variant nobody can reach is a
   file the next pass reads as current. That is what `Pillars.jsx` was.

   ---- Nothing is held, and that is the whole architecture -----------------

   "It must not delay the destination's entrance or its LCP."

   There are two ways to build a covering transition: hold the outgoing page
   until the cover completes and then swap, which delays the destination by
   the length of the cover; or swap immediately and let the overlay play over
   the top, which delays nothing.

   THIS TAKES THE SECOND AND STARTS ALREADY COVERING. The overlay's first
   painted frame is a full yellow plane, the destination mounts underneath it
   on that same commit, and the whole animation is the plane LEAVING. There is
   no timer between the click and the route change and no held location — the
   `<Routes>` read the router directly, as they always did. Measured: the
   destination's h1 is in the document 17 to 19ms after the click, which is
   React's own render.

   The strike needed a held location and this does not, so the machinery for
   holding one came out with it. If a future version needs to hold again, it
   is `<Routes location={...}>` and a state that lags the router — but do not
   leave it here unused in the meantime.

   ---- Why `location.pathname` and not `location` --------------------------

   A hash link inside a page — `/services#branding`, where the four discipline
   anchors and the JSON-LD offer URLs point — is a location change. Running a
   full-frame transition because a reader clicked an anchor on the page they
   are already reading would be absurd. The trigger is the path.

   ---- Why no document is fetched -----------------------------------------

   Every internal link is a `<Link>`. BUILD-LAW records what it cost to
   establish that: while they were plain `<a href>` a click asked the browser
   for a document at a URL it had a cached entry for, and the browser answered
   with a page the build could no longer produce. A router navigation requests
   no document, so this transition never waits on the network and there is
   nothing to fail slowly behind it. */

/* 380ms end to end, and the overlay is unmounted at the end of it rather than
   left in the tree at zero opacity. A 60ms hold before the halves part is the
   only pause: it is what makes the seam a seam rather than a wipe that
   happened to start in two pieces. */
const TOTAL = 380;

/* ---- The shapes ---------------------------------------------------------

   Derived from the mark by `.measure/markgeom.mjs`. Do not hand-edit: change
   the mark and re-run it.

   The outer chevron — the short arm's outer edge into the vertex, out along
   the long arm's outer edge — extended to x -300 and x 400 so the cut crosses
   the frame at every aspect ratio the site is built for. Both halves carry the
   identical cut, so the seam is exact and invisible when they are together.

   The viewBox is 91 units tall, which is the mark's own height, so `slice`
   puts the V at exactly the frame height at every viewport. */
const LOWER = 'M-300 -358.91 L7 33 L54 93 L94 2 L400 -694.15 L400 600 L-300 600 Z';
const UPPER = 'M-300 -358.91 L7 33 L54 93 L94 2 L400 -694.15 L400 -900 L-300 -900 Z';
const VIEWBOX = '-249.5 2 600 91';

export default function PageTransition({ children }) {
  const location = useLocation();
  const reduced = useReducedMotion();

  /* A run counter rather than a boolean. Two route changes inside one
     animation would otherwise re-use the same DOM node, and CSS does not
     restart a keyframe on an element that already has it — the second
     navigation would play no transition at all. Keying on the count forces a
     fresh element every time. */
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);

  const first = useRef(true);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    /* The first render is an arrival, not a transition. A page that wipes
       itself in on load is a loading screen, which this is not, and on `/` it
       would land straight on top of the hero's own entrance. */
    if (first.current) {
      first.current = false;
      prevPath.current = location.pathname;
      return undefined;
    }

    /* A hash change is not a route change. See the note above. */
    if (location.pathname === prevPath.current) return undefined;
    prevPath.current = location.pathname;

    if (reduced) return undefined;

    setRun((n) => n + 1);
    setPlaying(true);
    const end = setTimeout(() => setPlaying(false), TOTAL);
    return () => clearTimeout(end);
  }, [location, reduced]);

  return (
    <>
      {children}

      {/* Under reduced motion the overlay is never rendered, so there is no
          element to animate and nothing to wait for. The stylesheet's own
          `display: none` covers the reader who changes the preference
          mid-visit, after this component has already decided. */}
      {!reduced && playing ? (
        <div
          key={run}
          className="pt"
          /* Decoration over a route change. Not a status, not a live region.
             The router has already moved a screen reader; announcing a yellow
             rectangle on top of that is noise. */
          aria-hidden="true"
        >
          <svg
            className="pt__svg"
            viewBox={VIEWBOX}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            focusable="false"
          >
            <path className="pt__fill pt__upper" d={UPPER} />
            <path className="pt__fill pt__lower" d={LOWER} />
          </svg>
        </div>
      ) : null}
    </>
  );
}

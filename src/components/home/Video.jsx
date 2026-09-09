import React, { useEffect, useRef } from 'react';

/* The video capability — the MECHANISM, and one definition of it.
   ==========================================================================

   Built for the hero's tile wall. The wall is gone and this is mounted on the
   work grid now, which is where it belonged: six plates, six clips, each one a
   fixed-ratio box that a moving image drops into with no layout change. The
   wall's own slot map and file names stay in `videoTiles.js` beside the
   dormant `TileWall`; what is shared is everything that decides WHETHER a clip
   plays and HOW, and it is shared rather than copied because four gates
   written twice are four gates that drift.

   Nothing here requires a single clip to exist. Until a clip and its poster
   are both present the caller renders its own empty state, so the page is
   complete and correct with zero video files in the tree. Drop files in and
   the plates light up; take them out and they revert.

   ---- What the move changed, and it is the good direction -----------------

   `DESIGN.md` funds video out of the image budget and subordinates the 900 KB
   clip budget to a harder rule: the hero's total transfer must not rise. That
   rule was written when the clips were IN the hero, competing with 2.6 MB of
   tile photographs for a largest paint that already ran to 6.27s on a
   throttled phone.

   They are not in the hero now. The work grid is below the fold, it reveals on
   scroll, and no clip is requested until a plate is on screen — so video no
   longer competes for the largest paint at all rather than merely being gated
   away from it. The 900 KB total stands, and it is still funded rather than
   added: the six clips ARE the six work plates' images, not a layer over them.
   ========================================================================== */

/* Whether this visit gets video at all.

   Four independent reasons to refuse, and any one of them is enough. The
   answer is computed once per mount rather than watched, because a connection
   that changes mid-visit should not start six downloads under someone.

   1. REDUCED MOTION. Poster only, no autoplay, per DESIGN.md.
   2. SAVE-DATA. An explicit request from the reader not to spend their
      bandwidth on decoration. This is decoration.
   3. A SLOW EFFECTIVE CONNECTION. 2g, slow-2g and 3g never.
   4. SAVE-DATA VIA connection.saveData, which some browsers expose there
      rather than as a header hint.

   navigator.connection is not universal. Where it is absent the answer is
   yes — the alternative is refusing video to every Safari reader on a fibre
   line, and the IntersectionObserver gate below still means nothing loads
   until a plate is actually on screen. */
export function videoAllowed() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!c) return true;
  if (c.saveData) return false;
  if (typeof c.effectiveType === 'string' && /^(slow-2g|2g|3g)$/.test(c.effectiveType)) {
    return false;
  }
  return true;
}

/* A surface that moves.

   preload="none" is the whole contract: NOTHING is fetched until play() is
   called, and play() is only ever called by the observer below, on an element
   that is actually on screen, after its section has revealed. The poster is an
   ordinary image and loads with the rest of the section, so the slot is
   complete and correct before a single video byte is requested.

   ---- Why the observer is not enough on its own --------------------------

   IntersectionObserver callbacks are throttled, and in a backgrounded tab may
   not run at all. An element that was on screen when the tab was hidden
   therefore stays "intersecting" as far as this component knows, and would go
   on decoding video into a tab nobody is looking at. So intersection is stored
   rather than acted on directly, and PLAY REQUIRES BOTH: intersecting AND the
   document visible. visibilitychange is what re-evaluates on return, because
   the observer may never fire again by itself.

   Verify this with the window focused. A headless or backgrounded check will
   report it paused and call it correct for the wrong reason. */
export function VideoTile({ clip, live, className, threshold = 0.25 }) {
  const ref = useRef(null);
  const seen = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !live) return undefined;

    const sync = () => {
      if (seen.current && document.visibilityState === 'visible') {
        /* play() rejects when autoplay is refused, which is not an error
           here: the poster is already the correct still, so a refusal simply
           leaves the element as it was. */
        const p = el.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } else if (!el.paused) {
        el.pause();
      }
    };

    let io;
    if (typeof IntersectionObserver === 'undefined') {
      /* No observer means no way to know whether this is on screen. Poster
         only: something that cannot be gated must not autoplay. */
      seen.current = false;
    } else {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) seen.current = e.isIntersecting;
          sync();
        },
        /* A quarter of the box, so a plate half off the bottom edge is not
           started and stopped on every pixel of a scroll. */
        { threshold }
      );
      io.observe(el);
    }

    document.addEventListener('visibilitychange', sync);
    return () => {
      if (io) io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      el.pause();
    };
  }, [live, threshold]);

  return (
    <video
      ref={ref}
      className={className}
      poster={clip.poster}
      preload="none"
      muted
      loop
      playsInline
      /* Not a control and not content. On the work grid the whole plate is one
         link whose accessible name is the project title beside it, so the
         moving surface is decoration and says nothing. */
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
    >
      {/* The modern codec first, so a browser that can decode it never
          downloads the h.264. Anything that can play neither keeps the poster,
          which is a still from this clip, so the plate is right either way. */}
      {clip.alt ? <source src={clip.alt} type="video/webm" /> : null}
      {clip.mp4 ? <source src={clip.mp4} type="video/mp4" /> : null}
    </video>
  );
}

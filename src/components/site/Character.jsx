import React, { useEffect, useState } from 'react';
import '../../styles/character.css';

/* THE CHARACTER SLOT, 2026-09-21, from the storyboard.

   Five poses of the one character. P1 is `character.webp`; P2 to P5 are
   `character-2.webp` to `character-5.webp` in /public/assets/objects, cut to
   alpha from the generated PNGs by `.measure/objcut.mjs` when they land.

   THE SLOT IS EMPTY UNTIL THE FILE IS THERE. The image is probed off-screen
   and only mounted once it has decoded, so a missing pose renders nothing and
   takes no space: no frame, no reservation, no broken image. An unknown path
   on this single-page app answers `index.html`, which fails to decode as an
   image, so a 200 is not mistaken for a pose.

   Decorative (`alt=""`): the words beside it say what the section says. It
   floats on `.float` (6px, 4s), still under reduced motion. A rendered brand
   object, exempt from the carrier count like the wordmark. */
export default function Character({ pose, className = '' }) {
  const src = pose === 1 ? '/assets/objects/character.webp' : `/assets/objects/character-${pose}.webp`;
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let live = true;
    const probe = new Image();
    probe.onload = () => {
      if (live) setOk(true);
    };
    probe.onerror = () => {
      if (live) setOk(false);
    };
    probe.src = src;
    return () => {
      live = false;
    };
  }, [src]);

  if (!ok) return null;

  return (
    <div className={`char ${className}`.trim()} data-pose={pose}>
      <img className="char__img float" src={src} alt="" decoding="async" />
    </div>
  );
}

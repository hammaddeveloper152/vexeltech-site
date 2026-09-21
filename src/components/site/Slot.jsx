import React, { useEffect, useState } from 'react';
import '../../styles/slot.css';

/* AN IMAGE SLOT THAT IS EMPTY UNTIL ITS FILE EXISTS (2026-09-22, the
   founder's restructure). BUILD-LAW 0: the founder supplies, nothing is
   reused, nothing is substituted, no placeholder. So a slot probes its file
   off-screen and mounts the image only once it has decoded: a missing file
   renders NOTHING and takes no space. An unknown path on this single-page app
   answers `index.html`, which fails to decode as an image, so a 200 is never
   mistaken for a file.

   `src`      the file under /public, e.g. '/assets/cost-1.webp'
   `float`    the 6px float (`.float`, 4s, still under reduced motion)
   `cover`    the image covers its box (banners); otherwise it keeps its ratio
   `alt`      empty by default: every slot so far is decorative, and the words
              beside it say what the section says. */
export default function Slot({ src, className = '', float = false, cover = false, alt = '' }) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let live = true;
    const probe = new Image();
    probe.onload = () => live && setOk(true);
    probe.onerror = () => live && setOk(false);
    probe.src = src;
    return () => {
      live = false;
    };
  }, [src]);

  if (!ok) return null;

  return (
    <div className={`slot ${cover ? 'slot--cover' : ''} ${className}`.replace(/\s+/g, ' ').trim()}>
      <img className={`slot__img${float ? ' float' : ''}`} src={src} alt={alt} decoding="async" />
    </div>
  );
}

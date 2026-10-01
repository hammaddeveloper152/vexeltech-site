import React from 'react';
import './story.css';

/* THE EVIDENCE BAND on /services (the founder's five fixes, 2026-10-02).
   Under a discipline's promise, full content width: a real image at 16:10 in
   the same 8px hairline frame as the Recent work plates. It renders only
   when the discipline has an `image` in content/services.js; otherwise
   nothing, and the section is list-only (BUILD-LAW, Real over drawn).

   `image`: { src, src720, alt }. The 720 file for phones, the full one from
   768. The image is the material, so it carries an alt. It replaced the
   phone frame (ServiceImage), which is deleted. */
export default function EvidenceBand({ image }) {
  if (!image) return null;
  return (
    <figure className="eb">
      <img
        src={image.src720 || image.src}
        srcSet={image.src720 ? `${image.src720} 720w, ${image.src} 1440w` : undefined}
        sizes="(min-width: 1280px) 1200px, calc(100vw - 32px)"
        alt={image.alt}
        width="1440"
        height="900"
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

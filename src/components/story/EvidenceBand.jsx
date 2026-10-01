import React from 'react';
import './story.css';

/* THE EVIDENCE BAND on /services (the founder's five fixes, 2026-10-02).
   Under a discipline's promise, full content width: a real image at 16:10 in
   the same 8px hairline frame as the Recent work plates. It renders only
   when the discipline has an `image` in content/services.js; otherwise
   nothing, and the section is list-only (BUILD-LAW, Real over drawn).

   `image`: { src, src720, alt } for one 16:10 image (the 720 file for
   phones, the full one from 768), or { phones: [{ src, alt }] } for phone
   captures side by side. The image is the material, so it carries an alt.
   It replaced the phone frame (ServiceImage), which is deleted. */
export default function EvidenceBand({ image }) {
  if (!image) return null;
  /* PHONES (the two fixes, 2026-10-02): phone captures side by side, each
     390 x 844 at 2x in the hairline frame with a 12px radius, 24px apart,
     centred across the content width; below 768 a sideways swipe with the
     second peeking. */
  if (image.phones) {
    return (
      <ul className="eb-phones">
        {image.phones.map((p) => (
          <li className="eb-phone" key={p.src}>
            <img src={p.src} alt={p.alt} width="780" height="1688" loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
    );
  }
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

import React from 'react';
import './story.css';

/* THE DISCIPLINE'S REAL MATERIAL ON /services (the founder, 2026-10-02:
   real over drawn). It replaced the four drawn frames. Each discipline has
   an `image` slot in content/services.js; this renders it, and renders
   nothing for an empty slot.

     device: true   a phone screenshot in a plain device frame: 12px radius,
                    a 2px hairline, no notch, nothing drawn (Websites:
                    baseline-books.com at 390 x 844, .measure/work-shots.mjs)
     device: false  a photograph or document image as it is, in an 8px
                    frame with a hairline (for the real mark on an object,
                    the real report, the real text thread, when they come)

   The alt names what is shown; the image is the material, not decoration. */
export default function ServiceImage({ image }) {
  if (!image) return null;
  return (
    <figure className={`si${image.device ? ' si--device' : ''}`}>
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

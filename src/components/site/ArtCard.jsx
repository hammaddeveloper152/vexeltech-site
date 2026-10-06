import React from 'react';
import './ArtCard.css';

/* THE SITE'S ONE CARD, v2 (QUIET), 2026-09-24 (the founder): lit-near,
   24px, a 1px border at 10% white, no shadow.

   THE BARE CARD ONLY, since final26 (2026-10-07): home's What we do is
   paper cards (components/home/WhatWeDo.jsx), and the named card, its
   colour variant, its number badge (Badge.jsx) and its artifact still had
   no other user, so they are deleted. A render fills a 3:4 card edge to
   edge. The 404 page's mark stands in one, so no object on the site stands
   on the page ground. */
export default function ArtCard({ image, style }) {
  return (
    <div className="art art--bare" style={style}>
      {/* Decorative: the page's heading says what happened. */}
      <img className="art__img" src={image} alt="" loading="lazy" decoding="async" />
    </div>
  );
}

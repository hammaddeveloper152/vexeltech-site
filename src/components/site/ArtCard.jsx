import React from 'react';
import { Link } from 'react-router-dom';
import './ArtCard.css';

/* THE SITE'S ONE CARD, v2 (QUIET), 2026-09-24 (the founder).

   Lit-near, 24px, a 1px border at 10% white, no shadow, no light, content
   height, 32px of padding. THE ANATOMY SINCE THE ILLUSTRATION PASS,
   2026-09-24: the number (01) to (04) in the mono label top left, a 140px
   isometric illustration top right (Illustrations.jsx), then the name in
   Clash at 27px and one line at 14px whose first sentence is bold. The
   top row is the illustration's height, so the name always starts under
   it. The chip and its glyph are gone. The hover keeps the 4px lift, which
   carries the illustration up with it, and the border going to 22% white.

   Used by home's What we do (links to /services) and About's What we build
   it around (not links). DESIGN.md "THE CARD v2 (quiet)" is the record.

   ONE CARD, TWO VARIANTS, 2026-09-24 (the founder's energy pass):
   `variant="dark"` (the default) is the translucent card above;
   `variant="cream"` is cream, no border, asphalt ink, 32px, the 4px lift and
   a soft shadow on hover. The four discipline cards (home's What we do,
   About's What we build it around) are cream: the one place a cream card
   stands on a dark ground, recorded in DESIGN.md as the exception to "cream
   is a band, never a card".

   THE BARE CARD is the one other use: with no `name`, a render fills a 3:4
   card edge to edge. The 404 page's mark stands in one, so no object on the
   site stands on the page ground. */

function splitLine(text) {
  const at = text.indexOf('. ');
  return at < 0 ? [text, ''] : [text.slice(0, at + 1), text.slice(at + 2)];
}

export default function ArtCard({
  image = null,
  num = null,
  Art = null,
  name = null,
  line = '',
  href = null,
  as: Heading = 'h3',
  variant = 'dark',
  style,
}) {
  const v = variant === 'cream' ? ' art--cream' : '';
  if (!name) {
    return (
      <div className="art art--bare" style={style}>
        {/* Decorative: the page's heading says what happened. */}
        <img className="art__img" src={image} alt="" loading="lazy" decoding="async" />
      </div>
    );
  }

  const [lead, rest] = splitLine(line);
  const body = (
    <>
      {num || Art ? (
        <span className="art__top">
          {/* The number is the card's place in its set; decorative, as the
              list is ordered. */}
          {num ? (
            <span className="art__num lbl" aria-hidden="true">
              {num}
            </span>
          ) : null}
          {Art ? <Art className="art__ill" /> : null}
        </span>
      ) : null}
      <Heading className="art__name">{name}</Heading>
      <span className="art__line">
        <span className="art__lead">{lead}</span>
        {rest ? ` ${rest}` : null}
      </span>
    </>
  );

  return href ? (
    <Link className={`art art--link${v}`} to={href} style={style}>
      {body}
    </Link>
  ) : (
    <div className={`art${v}`} style={style}>
      {body}
    </div>
  );
}

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

   ONE CARD, TWO VARIANTS: `variant="dark"` (the default) is the translucent
   card above; the discipline cards are the colour variant below. The cream
   variant they had from 2026-09-24 is gone.

   THE COLOUR VARIANT, 2026-09-25 (the founder's life pass), replaces the
   cream one on the four discipline cards: `variant="colour"` with a `tone`
   (branding yellow, websites arc blue, marketing coral, automation mint),
   a `tilt` of -2 or +2 degrees at rest that straightens on the linked
   card's hover, the illustration in a white keyline, and a STICKER: a 72px
   copy of the card's own object in its full colours, a 6px white outline
   round it, over the card's top right corner, rotated 12 degrees. The
   sticker is two copies of the same drawing stacked: the lower one only a
   white stroke, the outline; the upper one the drawing. Hidden below 768.

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
  tone = null,
  tilt = 0,
  style,
}) {
  const colour = variant === 'colour' && tone;
  const v = colour ? ` art--colour art--${tone}` : '';
  const s = colour ? { ...style, '--tilt': `${tilt}deg` } : style;
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
      {colour && Art ? (
        <span className="art__sticker" aria-hidden="true">
          <Art className="art__sticker-edge" />
          <Art className="art__sticker-art" />
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
    <Link className={`art art--link${v}`} to={href} style={s}>
      {body}
    </Link>
  ) : (
    <div className={`art${v}`} style={s}>
      {body}
    </div>
  );
}

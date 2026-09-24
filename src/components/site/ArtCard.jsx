import React from 'react';
import { Link } from 'react-router-dom';
import Badge from './Badge.jsx';
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

   Used by home's What we do (links to /services). About's cards came off
   with the About rebuild (2026-09-25). DESIGN.md is the record.

   ONE CARD, TWO VARIANTS: `variant="dark"` (the default) is the translucent
   card above; `variant="cream"` is the discipline cards' since the
   three-colour pass (2026-09-25): cream, asphalt ink, the light-palette
   illustration, a `tilt` of -2 or +2 degrees at rest that straightens on
   the linked card's hover, and the NUMBER BADGE (Badge.jsx): 01 to 04 on a
   white die-cut disc over the card's top right corner by 20px, rotated 12
   degrees, hidden below 768, in place of the card's small index text. The
   colour variant (yellow, arc blue, coral, mint) went with those colours.

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
  tilt = 0,
  style,
}) {
  /* The cream variant (since the three-colour pass, 2026-09-25) carries the
     tilt and the number badge; `tone` went with the colour cards. */
  const colour = variant === 'cream';
  const v = colour ? ' art--cream' : '';
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
              list is ordered. A colour card shows it as its badge instead. */}
          {num && !colour ? (
            <span className="art__num lbl" aria-hidden="true">
              {num}
            </span>
          ) : null}
          {Art ? <Art className="art__ill" /> : null}
        </span>
      ) : null}
      {colour && num ? <Badge n={num} className="art__badge" /> : null}
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

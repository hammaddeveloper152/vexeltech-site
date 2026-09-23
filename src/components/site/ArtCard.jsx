import React from 'react';
import { Link } from 'react-router-dom';
import './ArtCard.css';

/* THE SITE'S ONE CARD, v2 (QUIET), 2026-09-24 (the founder).

   Lit-near, 24px, a 1px border at 10% white, no shadow, no light, and
   CONTENT HEIGHT: a 48px icon chip, the name in Clash at 27px, one line at
   14px whose first sentence is bold, 32px of padding. The drawn SVG
   artwork, its glow and the 3:4 portrait of v1 are gone. The hover keeps
   the 4px lift and the border going to 22% white.

   Used by home's What we do (links to /services) and About's What we build
   it around (not links). DESIGN.md "THE CARD v2 (quiet)" is the record.

   THE BARE CARD is the one other use: with no `name`, a render fills a 3:4
   card edge to edge. The 404 page's mark stands in one, so no object on the
   site stands on the page ground. */

function splitLine(text) {
  const at = text.indexOf('. ');
  return at < 0 ? [text, ''] : [text.slice(0, at + 1), text.slice(at + 2)];
}

export default function ArtCard({
  image = null,
  Icon = null,
  name = null,
  line = '',
  href = null,
  as: Heading = 'h3',
  style,
}) {
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
      {Icon ? (
        <span className="art__chip" aria-hidden="true">
          <Icon className="art__icon" />
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
    <Link className="art art--link" to={href} style={style}>
      {body}
    </Link>
  ) : (
    <div className="art" style={style}>
      {body}
    </div>
  );
}

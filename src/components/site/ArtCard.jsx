import React from 'react';
import { Link } from 'react-router-dom';
import './ArtCard.css';

/* THE SITE'S ONE CARD, 2026-09-24 (the founder, on the Cloaked pattern).

   A 3:4 portrait on lit-near, 24px, a 1px border at 10% white, no shadow and
   no light. Behind the text, clipped to the card, one SVG drawn here in code
   covers the top 65%, stroked in bone at 1.5px with no fill, at 32% (48% on
   hover), and a gradient from transparent at 45% to lit-near at 80% fades it
   out before the text.
   The content is pinned to the bottom: an icon chip, the name, and one line
   whose first sentence is bone and whose rest is steel-lift.

   Used by home's What we do (links to /services), home's What it costs you
   (the cost objects as the artwork, not links) and About's What the phones
   taught us (not links). DESIGN.md "THE CARD" is the record; BUILD-LAW 0 is
   amended there for the artworks, which appear on both.

   THE ARTWORK IS IN A 300 x 260 BOX, which is the top 65% of a 3:4 card
   (300 wide, 400 tall), and it is placed with `slice` so it covers whatever
   the card's width. Every stroke is `non-scaling-stroke`, so 1.5px is 1.5px
   at every size. */

/* THE SECOND PASS, 2026-09-24 (the founder): the artwork read as texture, not
   artwork. It is fewer, larger elements now - legible as a pattern at a 320px
   card - in a 300 x 260 box, the top 65% of a 3:4 card. */
const W = 300;
const H = 260;

/* Branding: seven concentric rounded squares, centred off the top right,
   each gap wider than the one inside it. */
function Branding() {
  const cx = 232;
  const cy = 52;
  const squares = Array.from({ length: 7 }, (_, i) => {
    const half = 16 + 16 * i + 3 * i * i;
    return (
      <rect
        key={i}
        x={cx - half}
        y={cy - half}
        width={half * 2}
        height={half * 2}
        rx={half * 0.22}
      />
    );
  });
  return <g>{squares}</g>;
}

/* Websites: an 8 x 10 grid, three cells filled like a wireframe's placed
   blocks. The fill is bone at 10% of the card: the SVG sits at 32%, so the
   cells carry 0.3125 of their own. */
function Websites() {
  const cols = 8;
  const rows = 10;
  const cw = W / cols;
  const rh = H / rows;
  const lines = [];
  for (let c = 0; c <= cols; c += 1) lines.push(<line key={`v${c}`} x1={c * cw} y1={0} x2={c * cw} y2={H} />);
  for (let r = 0; r <= rows; r += 1) lines.push(<line key={`h${r}`} x1={0} y1={r * rh} x2={W} y2={r * rh} />);
  const filled = [
    [1, 1],
    [5, 2],
    [3, 5],
  ].map(([c, r]) => (
    <rect key={`f${c}-${r}`} className="art__fill" x={c * cw} y={r * rh} width={cw} height={rh} />
  ));
  return (
    <g>
      {filled}
      {lines}
    </g>
  );
}

/* Marketing: 14 rays from a point outside the bottom-left corner. The angle
   between neighbours widens toward the top right. */
function Marketing() {
  const ox = -40;
  const oy = H + 40;
  const rays = Array.from({ length: 14 }, (_, i) => {
    const t = i / 13;
    const deg = 6 + 76 * t ** 1.6; /* 6 to 82 degrees above the horizontal */
    const a = (deg * Math.PI) / 180;
    const len = 700;
    return <line key={i} x1={ox} y1={oy} x2={ox + Math.cos(a) * len} y2={oy - Math.sin(a) * len} />;
  });
  return <g>{rays}</g>;
}

/* Automation: a dotted circuit of two runs, each with one bend - a short
   vertical - and a 6px node at each end of it. */
function Automation() {
  const runs = [
    { y: 70, bx: 120, dy: 44 },
    { y: 170, bx: 196, dy: -40 },
  ];
  return (
    <g>
      {runs.map(({ y, bx, dy }) => (
        <g key={y}>
          <path className="art__dash" d={`M0 ${y} H${bx} V${y + dy} H${W}`} />
          <circle className="art__node" cx={bx} cy={y} r={3} />
          <circle className="art__node" cx={bx} cy={y + dy} r={3} />
        </g>
      ))}
    </g>
  );
}

const ART = { branding: Branding, websites: Websites, marketing: Marketing, automation: Automation };

function splitLine(text) {
  const at = text.indexOf('. ');
  return at < 0 ? [text, ''] : [text.slice(0, at + 1), text.slice(at + 2)];
}

/* `art` draws one of the four; `image` puts a transparent object in the same
   top 65% instead, fitted by height (180px, or `imageHeight`) and standing on
   the zone's bottom line, over a lit-raised wash (What it costs you,
   2026-09-24). `Icon` is optional: the image cards carry none. With no
   `name` the card is BARE - the object alone, filling the card - which is
   how the 404 page holds its mark. */
export default function ArtCard({
  art = null,
  image = null,
  imageHeight = null,
  Icon = null,
  name = null,
  line = '',
  href = null,
  as: Heading = 'h3',
  style,
}) {
  const Art = art ? ART[art] : null;
  const [lead, rest] = splitLine(line);
  const bare = !name;
  const body = (
    <>
      {/* The glow behind the artwork, 2026-09-24: bone, centred at 35% of
          the height. Decorative. */}
      {Art ? <span className="art__glow" aria-hidden="true" /> : null}
      {Art ? (
        /* Decorative: the name and the line are the card's content. The
           `data-art` anchor decides which edges the 130% artwork bleeds off. */
        <svg
          className="art__svg"
          data-art={art}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          focusable="false"
        >
          <Art />
        </svg>
      ) : null}
      {image ? (
        <span
          className="art__obj"
          aria-hidden="true"
          style={imageHeight ? { '--obj-h': `${imageHeight}px` } : undefined}
        >
          {/* Decorative: the title says what it shows. */}
          <img className="art__img" src={image} alt="" loading="lazy" decoding="async" />
        </span>
      ) : null}
      {bare ? null : <span className="art__fade" aria-hidden="true" />}
      {bare ? null : (
      <span className="art__body">
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
      </span>
      )}
    </>
  );

  return href ? (
    <Link className="art art--link" to={href} style={style}>
      {body}
    </Link>
  ) : (
    <div className={`art${image ? ' art--image' : ''}${bare ? ' art--bare' : ''}`} style={style}>
      {body}
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import './ArtCard.css';

/* THE SITE'S ONE CARD, 2026-09-24 (the founder, on the Cloaked pattern).

   A 3:4 portrait on lit-near, 24px, a 1px border at 10% white, no shadow and
   no light. Behind the text, clipped to the card, one SVG drawn here in code
   covers the top 70%, stroked in bone at 1.5px with no fill, and a gradient
   from transparent at 30% to lit-near at 75% fades it out before the text.
   The content is pinned to the bottom: an icon chip, the name, and one line
   whose first sentence is bone and whose rest is steel-lift.

   Used by home's What we do (links to /services) and About's What the phones
   taught us (not links). DESIGN.md "THE CARD" is the record; BUILD-LAW 0 is
   amended there for the artworks, which appear on both.

   THE ARTWORK IS IN A 300 x 280 BOX, which is the top 70% of a 3:4 card
   (300 wide, 400 tall), and it is placed with `slice` so it covers whatever
   the card's width. Every stroke is `non-scaling-stroke`, so 1.5px is 1.5px
   at every size. */

const W = 300;
const H = 280;

/* Branding: eleven concentric rounded squares, centred off the top right,
   each gap wider than the one inside it. */
function Branding() {
  const cx = 236;
  const cy = 44;
  const squares = Array.from({ length: 11 }, (_, i) => {
    const half = 10 + 9 * i + 1.1 * i * i;
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

/* Websites: a 12 x 16 grid of fine lines, three cells filled like a
   wireframe's placed blocks. The fill is bone at 10% of the card: the SVG
   sits at 14% opacity, so the cells carry 0.714 of their own. */
function Websites() {
  const cols = 12;
  const rows = 16;
  const cw = W / cols;
  const rh = H / rows;
  const lines = [];
  for (let c = 0; c <= cols; c += 1) lines.push(<line key={`v${c}`} x1={c * cw} y1={0} x2={c * cw} y2={H} />);
  for (let r = 0; r <= rows; r += 1) lines.push(<line key={`h${r}`} x1={0} y1={r * rh} x2={W} y2={r * rh} />);
  const filled = [
    [2, 2],
    [7, 4],
    [4, 8],
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

/* Marketing: 24 rays from a point outside the bottom-left corner. The angle
   between neighbours widens toward the top right, so the fan is dense along
   the bottom and opens as it climbs. */
function Marketing() {
  const ox = -40;
  const oy = H + 40;
  const rays = Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    const deg = 4 + 78 * t ** 1.6; /* 4 to 82 degrees above the horizontal */
    const a = (deg * Math.PI) / 180;
    const len = 700;
    return <line key={i} x1={ox} y1={oy} x2={ox + Math.cos(a) * len} y2={oy - Math.sin(a) * len} />;
  });
  return <g>{rays}</g>;
}

/* Automation: a dotted circuit. Three horizontal runs, each with one bend - a
   short vertical - and a 6px node at each end of the bend. */
function Automation() {
  const runs = [
    { y: 60, bx: 110, dy: 28 },
    { y: 128, bx: 196, dy: -24 },
    { y: 196, bx: 74, dy: 30 },
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

export default function ArtCard({ art, Icon, name, line, href = null, as: Heading = 'h3', style }) {
  const Art = ART[art];
  const [lead, rest] = splitLine(line);
  const body = (
    <>
      {/* Decorative: the name and the line are the card's content. */}
      <svg
        className="art__svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <Art />
      </svg>
      <span className="art__fade" aria-hidden="true" />
      <span className="art__body">
        <span className="art__chip" aria-hidden="true">
          <Icon className="art__icon" />
        </span>
        <Heading className="art__name">{name}</Heading>
        <span className="art__line">
          <span className="art__lead">{lead}</span>
          {rest ? ` ${rest}` : null}
        </span>
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

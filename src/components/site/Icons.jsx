import React from 'react';
import './Icons.css';

/* THE SITE'S ONE ICON SET, 2026-09-24 (the founder), drawn here in code. It
   replaced Phosphor everywhere; the dependency is gone.

   THE SPEC: a 20px box, a 1.75px stroke that stays 1.75px at any display
   size (`vector-effect: non-scaling-stroke`, Icons.css), round caps and
   round joins, sharp corners - no rounded rectangles, after the V mark -
   and `currentColor`, so an icon is always its text's colour. Size comes
   from the station classes in Icons.css, never from a call site.

   Every icon is decorative wherever it is mounted: the words beside it, or
   the control's own label, say what it is. So each renders aria-hidden.

   THE SET: check, cross, plus, minus, arrow-up-right, chevron-down, send
   (a paper plane, two triangles), menu (two lines), close (two crossed
   lines), four discipline marks (flat 20px versions of the card
   illustrations: the V in a square, a browser frame with one bar, a
   megaphone, three linked nodes), and three social marks for the footer's
   circles, drawn at 16px in the same stroke.

   The select chevron is this set's chevron-down drawn as a CSS data URI
   (`--field-chevron`, tokens.css), because a select's arrow cannot be a
   React child. */

function Icon({ className = 'i', size = 20, children }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const IconCheck = ({ className }) => (
  <Icon className={className}>
    <path d="M4 10.5l4 4 8-9" />
  </Icon>
);

export const IconCross = ({ className }) => (
  <Icon className={className}>
    <path d="M5 5l10 10M15 5L5 15" />
  </Icon>
);

export const IconPlus = ({ className }) => (
  <Icon className={className}>
    <path d="M10 4v12M4 10h12" />
  </Icon>
);

export const IconMinus = ({ className }) => (
  <Icon className={className}>
    <path d="M4 10h12" />
  </Icon>
);

export const IconArrowUpRight = ({ className }) => (
  <Icon className={className}>
    <path d="M6 14L14 6M7 6h7v7" />
  </Icon>
);

export const IconChevronDown = ({ className }) => (
  <Icon className={className}>
    <path d="M5 8l5 5 5-5" />
  </Icon>
);

/* A paper plane as two triangles: the wing and its folded underside. */
export const IconSend = ({ className }) => (
  <Icon className={className}>
    <path d="M3 9.5L17 3l-5.5 14-2.5-5.5z" />
    <path d="M9 11.5L17 3" />
  </Icon>
);

export const IconMenu = ({ className }) => (
  <Icon className={className}>
    <path d="M3 7h14M3 13h14" />
  </Icon>
);

export const IconClose = ({ className }) => (
  <Icon className={className}>
    <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" />
  </Icon>
);

/* ---- The four discipline marks: the card illustrations, flat at 20px ---- */

export const IconMarkBranding = ({ className }) => (
  <Icon className={className}>
    <path d="M3 3h14v14H3z" />
    <path d="M6.5 6.5L10 13.5l3.5-7" />
  </Icon>
);

export const IconMarkWebsites = ({ className }) => (
  <Icon className={className}>
    <path d="M2.5 4h15v12h-15z" />
    <path d="M2.5 7.5h15M5.5 11h6" />
  </Icon>
);

/* A megaphone in profile: a small back, a widening horn, an open mouth, the
   handle under it. */
export const IconMarkMarketing = ({ className }) => (
  <Icon className={className}>
    <path d="M3 8.5h3l8-4.5v12l-8-4.5H3z" />
    <path d="M6 12v4h2.5v-3" />
    <path d="M17 7.5v5" />
  </Icon>
);

export const IconMarkAutomation = ({ className }) => (
  <Icon className={className}>
    <path d="M5.5 10h2.5M12 10h2.5" />
    <circle cx="3.5" cy="10" r="2" />
    <circle cx="10" cy="10" r="2" />
    <circle cx="16.5" cy="10" r="2" fill="currentColor" />
  </Icon>
);

/* ---- The three social marks, 16px, for the footer's yellow circles ------ */

export const IconLinkedIn = ({ className }) => (
  <Icon className={className} size={16}>
    <path d="M4 7v5.5M8 12.5V7M8 9.5a2.5 2.5 0 0 1 5 0v3" />
    <circle cx="4" cy="3.75" r="0.6" fill="currentColor" />
  </Icon>
);

export const IconInstagram = ({ className }) => (
  <Icon className={className} size={16}>
    <path d="M2.5 2.5h11v11h-11z" />
    <circle cx="8" cy="8" r="2.6" />
    <circle cx="11.4" cy="4.6" r="0.35" fill="currentColor" />
  </Icon>
);

export const IconFacebook = ({ className }) => (
  <Icon className={className} size={16}>
    <path d="M9.5 14V8.5h2l.5-2.25H9.5V5c0-.7.3-1 1-1H12V2.2A12 12 0 0 0 10.2 2C8.4 2 7.25 3.1 7.25 5v1.25h-2V8.5h2V14" />
  </Icon>
);

/* ---- The eight trade marks, 2026-09-25 (the life pass), for the trade
   ticker's pills: the trades the founder named. Same spec as the set. ---- */

/* A tap: its spout, its stem and handle, one drop. */
export const IconTradePlumbing = ({ className }) => (
  <Icon className={className}>
    <path d="M3.5 9h8a3 3 0 0 1 3 3v1" />
    <path d="M8 9V5.5M5.5 5.5h5M3.5 7v4" />
    <path d="M14.5 16.4a1.2 1.2 0 0 1-2.4 0c0-.9 1.2-2.1 1.2-2.1s1.2 1.2 1.2 2.1z" />
  </Icon>
);

/* A snowflake: three axes and a notch at each end of the upright. */
export const IconTradeHvac = ({ className }) => (
  <Icon className={className}>
    <path d="M10 3v14M3.9 6.5l12.2 7M3.9 13.5l12.2-7" />
    <path d="M8 4.5l2 1.5 2-1.5M8 15.5l2-1.5 2 1.5" />
  </Icon>
);

/* A bolt. */
export const IconTradeElectrical = ({ className }) => (
  <Icon className={className}>
    <path d="M11 2.5L5 11h5l-1 6.5L15 9h-5z" />
  </Icon>
);

/* A roof: its ridge and a course of shingle under it. */
export const IconTradeRoofing = ({ className }) => (
  <Icon className={className}>
    <path d="M2.5 11L10 4.5l7.5 6.5" />
    <path d="M5 13.5l5-4.3 5 4.3" />
    <path d="M7.5 16.5h5" />
  </Icon>
);

/* A molar. */
export const IconTradeDental = ({ className }) => (
  <Icon className={className}>
    <path d="M6.5 3.5c-2 0-3 1.6-3 3.6 0 2.2 1 3.5 1.5 5.4.5 2 .8 4 2 4 1.3 0 1.2-3.5 3-3.5s1.7 3.5 3 3.5c1.2 0 1.5-2 2-4 .5-1.9 1.5-3.2 1.5-5.4 0-2-1-3.6-3-3.6-1.5 0-2.3.8-3.5.8S8 3.5 6.5 3.5z" />
  </Icon>
);

/* A sparkle and a small one beside it. */
export const IconTradeCleaning = ({ className }) => (
  <Icon className={className}>
    <path d="M9 3c.6 3.6 1.4 4.4 5 5-3.6.6-4.4 1.4-5 5-.6-3.6-1.4-4.4-5-5 3.6-.6 4.4-1.4 5-5z" />
    <path d="M15.5 13v4M13.5 15h4" />
  </Icon>
);

/* A hard hat: its brim, its dome and its ridge. */
export const IconTradeContracting = ({ className }) => (
  <Icon className={className}>
    <path d="M2.5 14.5h15" />
    <path d="M4.5 14.5v-2a5.5 5.5 0 0 1 11 0v2" />
    <path d="M8.5 7.4V5.5h3v1.9" />
  </Icon>
);

/* A leaf and its vein. */
export const IconTradeLandscaping = ({ className }) => (
  <Icon className={className}>
    <path d="M4 16c0-7 4-12 12-12 0 8-5 12-12 12z" />
    <path d="M4 16l7-7" />
  </Icon>
);

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

   THE SET: check, cross, plus, minus, arrow-up-right, arrow-right (the send
   button's, since 2026-09-25; the paper plane it replaced is gone),
   chevron-down, menu (two lines), close (two crossed
   lines), four discipline marks (flat 20px versions of the card
   illustrations: the V in a square, a browser frame with one bar, a
   megaphone, three linked nodes), and three social marks for the footer's
   circles, drawn at 16px in the same stroke.

   arrow-down-right (2026-09-25, the contact hero's line) points from the
   heading into the form below it. */

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

export const IconArrowDownRight = ({ className }) => (
  <Icon className={className}>
    <path d="M6 6l8 8M14 7v7H7" />
  </Icon>
);

export const IconChevronDown = ({ className }) => (
  <Icon className={className}>
    <path d="M5 8l5 5 5-5" />
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

/* One mark: the send button's arrow, 2026-09-25 (life pass 2). */
export const IconArrowRight = ({ className }) => (
  <Icon className={className}>
    <path d="M4 10h12M11 5l5 5-5 5" />
  </Icon>
);

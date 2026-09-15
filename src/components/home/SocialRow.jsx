import React from 'react';

/* THE SOCIAL ROW, 2026-09-16. Six rendered tile faces, one anchor each, in the
   footer's meta row at 48px on every page, and under the form at 56px on
   Contact (where the footer's own row is not repeated), 16px apart.

   ---- The user's decisions, recorded in DESIGN.md and BUILD-LAW.md ---------

   - PLACEHOLDER URLS UNTIL THE REAL ONES ARRIVE. The footer used to record
     social icons as not built because no account was given. The user chose to
     ship the row now: each anchor points at the platform's own home page, and
     the six are replaced here, in one list, when the accounts are supplied.
   - RENDERED TILES, AN EXCEPTION TO ICONOGRAPHY. Not Phosphor and not inline
     SVG: `social.png`'s tiles, cut to alpha at 240px. Artwork standing in for a
     link, so each anchor carries its platform's name as its accessible label
     and the image is decorative.
   - THEIR COLOURS ARE EXEMPT, as generated artwork, like the Services tiles. */

export const SOCIALS = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/' },
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { id: 'x', label: 'X', href: 'https://x.com/' },
  { id: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/' },
  { id: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/' },
];

export default function SocialRow({ size = 'sm', className = '' }) {
  return (
    <ul className={`social social--${size} ${className}`.trim()}>
      {SOCIALS.map(({ id, label, href }) => (
        <li key={id}>
          <a className="social__a" href={href} aria-label={label}>
            <img
              className="social__img"
              src={`/assets/objects/social-${id}.webp`}
              alt=""
              width="240"
              height="240"
              loading="lazy"
              decoding="async"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

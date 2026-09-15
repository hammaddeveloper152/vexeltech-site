import React from 'react';
import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  TiktokLogo,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react';

/* THE SOCIAL GLYPHS, 2026-09-16. Phosphor's platform logos, at the medium
   station (24px, the user's choice over a 20px fourth station), steel-lift,
   machine yellow on hover, in one row at the right of the footer's pages row.

   ONLY A PLATFORM WITH A REAL URL RENDERS. No account has been supplied, so
   every `href` is null and the row renders nothing. This replaces the rendered
   tiles with placeholder URLs: an icon linking to a platform's home page is a
   link to nowhere of ours, and BUILD-LAW's pre-flight exception for it is gone.
   Fill a URL in here and that platform appears.

   `VITE_SOCIAL_PREVIEW=1` fills every row with the platform's home page, for a
   check build only, so the glyphs can be measured before an account exists. It
   is off in every shipped build, the same way `VITE_SHOW_RESERVED` is. */

const PREVIEW = import.meta.env.VITE_SOCIAL_PREVIEW === '1';

export const SOCIALS = [
  { id: 'instagram', label: 'Instagram', href: null, preview: 'https://www.instagram.com/', Icon: InstagramLogo },
  { id: 'facebook', label: 'Facebook', href: null, preview: 'https://www.facebook.com/', Icon: FacebookLogo },
  { id: 'linkedin', label: 'LinkedIn', href: null, preview: 'https://www.linkedin.com/', Icon: LinkedinLogo },
  { id: 'x', label: 'X', href: null, preview: 'https://x.com/', Icon: XLogo },
  { id: 'tiktok', label: 'TikTok', href: null, preview: 'https://www.tiktok.com/', Icon: TiktokLogo },
  { id: 'youtube', label: 'YouTube', href: null, preview: 'https://www.youtube.com/', Icon: YoutubeLogo },
];

export default function SocialRow() {
  const live = SOCIALS.map((s) => ({ ...s, url: s.href || (PREVIEW ? s.preview : null) })).filter((s) => s.url);
  if (!live.length) return null;
  return (
    <ul className="social" aria-label="Social">
      {live.map(({ id, label, url, Icon }) => (
        <li key={id}>
          <a className="social__a" href={url} aria-label={label}>
            <Icon className="i i--md" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

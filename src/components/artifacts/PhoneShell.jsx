import React from 'react';
import './phone-shell.css';

/* THE PHONE SILHOUETTE AS A CONTAINER (the founder's quality pass,
   2026-10-06, BUILD-LAW rule 0): like the browser frame, it may appear
   wherever a screen is shown. The same silhouette as the Websites phones
   (DevicePhones.jsx): black, 44px outer radius at 300 wide, a 10px bezel,
   the screen's radius 34px, no notch, no buttons. Its radii scale with its
   width so a 200px phone reads as the same object.

   `width` in px; `screen` is the screen's ground (a token or a colour);
   the children are the screen. `shadow` false drops the drop shadow for a
   phone that casts its own (an artifact animating its landing). The
   silhouette is decoration around a screen, so it carries no role; the
   artifact around it decides what is read.

   `ratio` (final15, 2026-10-06): the screen's width over its height, 390 /
   844 by default. The two /services sliders draw shorter screens, as the
   approved frames do (390 / 600 on Branding, 390 / 726 on Marketing); the
   bezel and the radii are the silhouette's own. */
export default function PhoneShell({ width = 320, screen = 'var(--c-cream)', shadow = true, ratio = null, className = '', children, ...rest }) {
  return (
    <div
      className={`phs${shadow ? ' phs--shadow' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--phs-w': `${width}px`, '--phs-k': width / 300, '--phs-screen': screen, ...(ratio ? { '--phs-ratio': ratio } : null) }}
      data-device="phone silhouette"
      {...rest}
    >
      <div className="phs__screen">{children}</div>
    </div>
  );
}

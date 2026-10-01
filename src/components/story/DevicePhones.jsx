import React from 'react';
import './story.css';

/* THE WEBSITES BAND'S PHONES (the founder's six fixes, 2026-10-02). Each
   capture stands in a device: a black silhouette, outer radius 44px, a 10px
   bezel, the screen's radius 34px, no notch, no buttons, nothing drawn on
   the screen. The screen shows the capture at full width from the top, and
   the frame clips it cleanly, so all three are one height with nothing cut
   at the foot.

     from 1024   three in a row, 300px each, 32px apart, centred; the middle
                 one 32px higher than the outer two
     below 1024  a sideways scroller that snaps, each phone 72vw, the next
                 peeking

   ON HOVER (a mouse) the screen scrolls up 160px over 1.2s and back when the
   pointer leaves, so the capture reads as a live page. The captures are
   1180 tall at 390 wide (.measure/work-shots.mjs), so there is page under
   the first screen to scroll to. Transform only; reduced motion holds it.

   `phones`: [{ src, alt }]. The images are the material, so each has an
   alt. They are the three phone captures and appear nowhere else (BUILD-LAW
   rule 0). */
export default function DevicePhones({ phones }) {
  if (!phones || !phones.length) return null;
  return (
    <ul className="dp">
      {phones.map((p) => (
        <li className="dp__phone" key={p.src}>
          <span className="dp__screen">
            <img src={p.src} alt={p.alt} width="780" height="2360" loading="lazy" decoding="async" />
          </span>
        </li>
      ))}
    </ul>
  );
}

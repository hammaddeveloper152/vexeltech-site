import React, { useEffect, useRef, useState } from 'react';
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
   rule 0). WebP at 600 wide since 2026-10-06 (final14): the 780-wide
   JPEGs came to 583 KB and, once the collapsed /services text brought the
   band inside Chrome's lazy-load distance on a phone, they were fetched at
   load and cost /services 0.3s of LCP. The same captures, 189 KB. */
/* THE CAPTURES LOAD NEAR THE BAND (2026-10-06, final14). `loading="lazy"`
   leaves the distance to Chrome, which on a phone fetched all three at
   load once the band moved up the page, ahead of /services' LCP. The src
   is set when the band is within 800px of the viewport, well before a
   reader reaches it; with no IntersectionObserver it is set at once. */
export default function DevicePhones({ phones }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  /* Below 1024 the row is a sideways scroller, and only there does it take
     focus (the launch gate, 2026-10-07). */
  const [scroller, setScroller] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const on = () => setScroller(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '800px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (!phones || !phones.length) return null;
  return (
    /* A sideways scroller below 1024, so it takes focus and a name (the
       launch gate, axe scrollable-region-focusable): a keyboard can scroll
       it with the arrow keys. */
    <ul
      className="dp"
      ref={ref}
      data-artifact="DevicePhones"
      data-device="phone silhouette"
      {...(scroller ? { tabIndex: 0, 'aria-label': 'Three websites on phones. Scroll sideways for the next.' } : {})}
    >
      {phones.map((p) => (
        <li className="dp__phone" key={p.src}>
          <span className="dp__screen">
            <img src={near ? p.src : undefined} alt={p.alt} width="600" height="1816" decoding="async" />
          </span>
        </li>
      ))}
    </ul>
  );
}

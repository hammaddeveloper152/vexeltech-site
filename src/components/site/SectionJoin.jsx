import React, { useEffect, useRef, useState } from 'react';
import './section-join.css';

/* THE SECTION JOIN (final30, 2026-10-07, the founder): home's only join
   between sections. A 3px #F2B01E rule, the first thing in each section's
   container after the hero, left aligned and 120px long at rest, in the
   prerendered HTML too. Once, when its section is 30% in view (30% of the
   section, or 30% of the screen for a section taller than the screen can
   show 30% of), it draws out to the container's full width over 700ms with
   an ease-out, and stays. Under reduced motion it is full width from the
   start (section-join.css). The draw is a clip-path, BUILD-LAW Motion's
   masked reveal; the founder's ruling also allows this rule a width
   animation, and no other element. Decoration: hidden from assistive
   technology. On the yellow field the rule is the field's ink. */
export default function SectionJoin({ tone }) {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const section = el && el.closest('section');
    if (!section || typeof IntersectionObserver === 'undefined') {
      setDrawn(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (es) => {
        const e = es[es.length - 1];
        const vh = e.rootBounds ? e.rootBounds.height : window.innerHeight;
        const need = Math.min(e.boundingClientRect.height, vh) * 0.3;
        if (e.isIntersecting && e.intersectionRect.height >= need - 1) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);
  return (
    <span
      className={`join${tone ? ` join--${tone}` : ''}`}
      ref={ref}
      data-drawn={drawn ? 'true' : 'false'}
      aria-hidden="true"
    />
  );
}

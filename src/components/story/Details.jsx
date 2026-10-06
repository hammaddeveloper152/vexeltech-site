import React, { useLayoutEffect, useRef, useState } from 'react';
import { prefersReduced } from '../site/useOnce.js';
import './details.css';

/* "DETAILS", A CLOSED DISCLOSURE (the founder, final24, 2026-10-07). A
   13px button with a chevron, closed by default; inside, whatever the band
   passes (on /services, the spec sheet and how it goes, as they are).

   The panel's content is always in the document, so it is in the
   prerendered HTML and in the page's text; closed, the region is
   `inert` and has no height, so it is out of the tab order and the
   accessibility tree. It opens and closes with a 250ms height transition:
   the one place on the site where height animates, recorded in BUILD-LAW
   Motion as the founder's exception. The height runs from 0 to the
   content's measured height and is released to `auto` once open, so a
   resize never clips it. Under reduced motion it opens and closes at
   once. The chevron turns by transform. */
const MS = 250;

export default function Details({ id, label = 'Details', children }) {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    const el = panel.current;
    if (!el) return undefined;
    if (first.current) {
      first.current = false;
      return undefined;
    }
    const full = el.scrollHeight;
    if (prefersReduced()) {
      el.style.height = open ? 'auto' : '0px';
      return undefined;
    }
    let t = 0;
    if (open) {
      el.style.height = '0px';
      void el.offsetHeight;
      el.style.height = `${full}px`;
      t = setTimeout(() => {
        el.style.height = 'auto';
      }, MS);
    } else {
      el.style.height = `${full}px`;
      void el.offsetHeight;
      el.style.height = '0px';
    }
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div className="dt" data-open={open ? 'true' : 'false'}>
      <button type="button" className="dt__btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {label}
        <span className="dt__chev" aria-hidden="true" />
      </button>
      <div className="dt__panel" id={id} ref={panel} inert={!open} style={{ height: 0 }}>
        <div className="dt__in">{children}</div>
      </div>
    </div>
  );
}

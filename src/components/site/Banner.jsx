import React from 'react';
import Slot from './Slot.jsx';
import '../../styles/banner.css';

/* A FULL-WIDTH BANNER, 2026-09-22 (the founder's restructure): a 16:9 image
   cover-fit into a band 420px tall at 1280, edge to edge. Pricing's
   `pricing-banner.webp` above the ladder and About's `about-banner.webp`
   after the cream hero; one file each, BUILD-LAW 0.

   It renders NOTHING, and takes no space, until its file exists: the section
   hides itself while the slot inside it is empty.

   THE SCRIM IS NOT SET YET. It is walked against the picture (BUILD-LAW: a
   floor set by hand is not a measurement), which needs the file. Nothing is
   set on a banner today, so no text pair binds it; `--scrim` stays 0 until
   the file lands and is walked. */
export default function Banner({ src, label }) {
  return (
    <section className="vt banner" aria-label={label}>
      <Slot src={src} cover className="banner__img" />
    </section>
  );
}

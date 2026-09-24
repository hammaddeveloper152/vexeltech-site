import React, { useLayoutEffect, useRef, useState } from 'react';
import Shell from './Shell.jsx';
import FooterForm from '../../components/home/FooterForm.jsx';
import LeadForm from '../../components/site/LeadForm.jsx';
import { IconArrowDownRight, IconPause, IconPlay } from '../../components/site/Icons.jsx';
import { FACTS } from '../../content/facts.js';
import './contact.css';

/* THE CONTACT PAGE, 2026-09-25 (the founder's contact pass, after
   brightscout.com/contact). Four things, top to bottom:

   1. THE MARQUEE HEADLINE. "Let's make the phone ring." in Clash Display
      Medium, 150px bone (72 below 768), one line, repeating, moving left at
      60px a second: the duration is set from the measured width of one run,
      so the speed holds at every width. Transform only (BUILD-LAW Motion).
      It pauses under the pointer and stands still under reduced motion. The
      h1 is the sentence once, for a screen reader; the moving copies are
      aria-hidden. Under it, 32px down, the arrow and the founder's line.
   2. THE FORM: LeadForm with the pills. Row 1 name, phone, email; 04 What
      do you need? (multi); 05 Budget (single, not required); 06 the
      message. One column below 768.
   3. THE WHO WE ARE TILES, as trust facts: the same four facts as home,
      read from content/facts.js.
   4. THE FOOTER BLOCK, with no second form above it.

   NO CALL BAND ON THIS PAGE, as before: every other page's call points
   here. */

const HEADLINE = 'Let’s make the phone ring.';
const SPEED = 60; // px a second, the founder's

function Marquee() {
  const track = useRef(null);
  /* THE PAUSE CONTROL, 2026-09-25 (the founder): at the band's right end, a
     32px face in a 48px target, bone pause and play glyphs. It is the way to
     stop the motion without a pointer (WCAG 2.2.2). Hidden under reduced
     motion, where nothing moves. */
  const [paused, setPaused] = useState(false);

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    const run = el.firstElementChild;
    const fit = () => {
      el.style.setProperty('--mq-dur', `${run.getBoundingClientRect().width / SPEED}s`);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(run);
    return () => ro.disconnect();
  }, []);

  /* Two identical runs; the track moves by one run and starts again, so the
     seam never shows. A run is two copies, wider than any screen. */
  const runOf = (k) => (
    <span className="ct-mq__run" key={k}>
      <span className="ct-mq__copy">{HEADLINE}</span>
      <span className="ct-mq__copy">{HEADLINE}</span>
    </span>
  );

  return (
    <div className="ct-mq" data-paused={paused ? 'true' : 'false'}>
      <div className="ct-mq__track" ref={track} aria-hidden="true">
        {runOf('a')}
        {runOf('b')}
      </div>
      <button
        type="button"
        className="ct-mq__ctl"
        onClick={() => setPaused((v) => !v)}
        aria-label={paused ? 'Play the headline' : 'Pause the headline'}
      >
        <span className="ct-mq__face">
          {paused ? <IconPlay className="i i--sm" /> : <IconPause className="i i--sm" />}
        </span>
      </button>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Shell
      title="Contact | VexelTech"
      description="Tell us what you do and what you are losing. Fifteen minutes on the phone."
      meta={false}
    >
      <section className="vt ct-hero" aria-labelledby="ct-h">
        <h1 className="ct-hero__h" id="ct-h">
          {HEADLINE}
        </h1>
        <Marquee />
        <p className="ct-hero__line">
          <IconArrowDownRight className="i ct-hero__arrow" />
          <span>Tell us about the business. A person replies within one business day.</span>
        </p>
      </section>

      <section className="vt ct-form" aria-label="Contact form">
        <div className="ct-form__in">
          <LeadForm idPrefix="ct" needs labelledBy="ct-h" />
        </div>
      </section>

      <section className="vt ct-facts" aria-labelledby="ct-facts-h">
        <h2 className="ct-facts__h" id="ct-facts-h">
          Who we are
        </h2>
        <dl className="ct-facts__row">
          {FACTS.map(([k, v]) => (
            <div className="ct-facts__tile" key={k}>
              <dt className="ct-facts__k lbl">{k}</dt>
              <dd className="ct-facts__v">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <FooterForm form={false} />
    </Shell>
  );
}

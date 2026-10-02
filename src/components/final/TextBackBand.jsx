import React, { useEffect, useRef, useState } from 'react';
import { prefersReduced } from '../site/useOnce.js';
import { THREAD } from '../../content/automation.js';
import './proof.css';

/* SERVICES, THE AUTOMATION BAND (the final pass, 2026-10-03; final pass 2
   the same day). The missed-call text-back as a thread of messages in a
   plain 360px column on the cream band, centred, between a 1px steel rule
   above and below so it reads as a placed object: no device (the founder's
   ruling, so BUILD-LAW rule 0 holds with the Websites band's phones), a grey
   header line carrying the number in mono, then the bubbles. The words are
   content/automation.js's and are written nowhere else.

   THE WHOLE THREAD IS PAINTED FROM THE FIRST FRAME (BUILD-LAW Motion: an
   entrance never hides content). The typing loop runs only while the band
   is on screen and motion is allowed: it clears the bubbles and plays them
   back from the visible thread (the system line; 1.2s later the first sent
   bubble; 2.5s later the reply; 1.5s later the second sent bubble; each
   after a three-dot typing indicator in its own place, arriving over
   400ms), holds 6s, and plays again. Off screen, the loop stops and the
   full thread stands. With no IntersectionObserver, or on any error, the
   full thread stays. Every message keeps its place throughout, so nothing
   around the thread moves.

   The drawn thread is a founder-ruled exception to BUILD-LAW "Real over
   drawn" until a real capture of the text-back replaces it. */
const GAPS = [0, 1200, 2500, 1500];
const TYPING = 800;
const HOLD = 6000;
const ALL = THREAD.lines.length;

export default function TextBackBand() {
  const ref = useRef(null);
  const [shown, setShown] = useState(ALL);
  const [typing, setTyping] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced() || typeof IntersectionObserver === 'undefined') return undefined;
    let timers = [];
    const stop = () => {
      timers.forEach(clearTimeout);
      timers = [];
      setTyping(-1);
      setShown(ALL);
    };
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const play = () => {
      try {
        setShown(0);
        setTyping(-1);
        let t = 400;
        THREAD.lines.forEach((line, i) => {
          t += GAPS[i];
          if (line.kind !== 'system') at(t - TYPING, () => setTyping(i));
          at(t, () => {
            setTyping(-1);
            setShown(i + 1);
          });
        });
        at(t + HOLD, play);
      } catch {
        stop();
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        const on = entries.some((e) => e.isIntersecting);
        if (on && !timers.length) play();
        else if (!on && timers.length) stop();
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <figure className="tb" ref={ref}>
      <div className="tb__col">
        <p className="tb__head">{THREAD.number}</p>
        <ol className="tb__thread">
          {THREAD.lines.map((line, i) => (
            <li
              key={i}
              className={`tb__msg tb__msg--${line.kind}`}
              data-shown={i < shown ? 'true' : 'false'}
              data-typing={i === typing ? 'true' : 'false'}
            >
              <span className="tb__text">{line.text}</span>
              {line.kind === 'system' ? null : (
                <span className="tb__typing" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="tb__cap">{THREAD.caption}</figcaption>
    </figure>
  );
}

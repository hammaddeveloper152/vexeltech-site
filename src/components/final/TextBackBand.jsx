import React, { useEffect, useRef, useState } from 'react';
import { useSeen, prefersReduced } from '../site/useOnce.js';
import { THREAD } from '../../content/automation.js';
import './proof.css';

/* SERVICES, THE AUTOMATION BAND (the final pass, 2026-10-03). The
   missed-call text-back as a thread of messages in a plain 360px column on
   the cream band, centred: no device (the founder's ruling, so BUILD-LAW
   rule 0 holds with the Websites band's phones on the same page), a grey
   header line carrying the number in mono, then the bubbles. The words are
   content/automation.js's and are written nowhere else.

   THE SEQUENCE, when the band enters the view: the system line "Missed
   call"; 1.2s later the first sent bubble (yellow, asphalt words); 2.5s
   later the reply (light grey); 1.5s later the second sent bubble. Each
   bubble is preceded by a three-dot typing indicator in its own place and
   arrives over 400ms (opacity and a 6px rise). Then a 6s pause, the thread
   clears, and it plays again. Every message has its place from the start,
   so nothing around the thread moves (BUILD-LAW Motion: no height).

   Reduced motion: the whole thread stands, nothing plays.

   The drawn thread is a founder-ruled exception to BUILD-LAW "Real over
   drawn" until a real capture of the text-back replaces it. */
const GAPS = [0, 1200, 2500, 1500];
const TYPING = 800;
const HOLD = 6000;

export default function TextBackBand() {
  const ref = useRef(null);
  const still = prefersReduced();
  const [go, setGo] = useState(false);
  const [shown, setShown] = useState(still ? THREAD.lines.length : 0);
  const [typing, setTyping] = useState(-1);
  useSeen(ref, () => setGo(true), 0.3);

  useEffect(() => {
    if (!go) return undefined;
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const play = () => {
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
    };
    play();
    return () => timers.forEach(clearTimeout);
  }, [go]);

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

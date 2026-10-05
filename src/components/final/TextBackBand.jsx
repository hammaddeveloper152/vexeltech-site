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

   THE SYSTEM LOG, 2026-10-05 (the founder's final9). Beside the thread
   from 1024 (under it below), a 1px steel-ruled column in mono 12px: what
   happens around the three bubbles, each line arriving with its bubble and
   the rest 300ms apart after the last. The time is in the discipline's ink
   (mint ink, 5.03:1 on cream: mint itself is 2.77) and the event asphalt
   (the brief's bone is 1.1:1 on the cream band). The rest is 5s now; it
   was 6. The caption sits under both columns.

   The drawn thread is a founder-ruled exception to BUILD-LAW "Real over
   drawn" until a real capture of the text-back replaces it. */
const GAPS = [0, 1200, 2500, 1500];
const TYPING = 800;
const HOLD = 5000;
const STEP = 300;
const ALL = THREAD.lines.length;
const LOGS = THREAD.log.length;

export default function TextBackBand() {
  const ref = useRef(null);
  const [shown, setShown] = useState(ALL);
  const [typing, setTyping] = useState(-1);
  const [logged, setLogged] = useState(LOGS);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced() || typeof IntersectionObserver === 'undefined') return undefined;
    let timers = [];
    const stop = () => {
      timers.forEach(clearTimeout);
      timers = [];
      setTyping(-1);
      setShown(ALL);
      setLogged(LOGS);
    };
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const play = () => {
      try {
        setShown(0);
        setTyping(-1);
        setLogged(0);
        let t = 400;
        const lineAt = [];
        THREAD.lines.forEach((line, i) => {
          t += GAPS[i];
          lineAt.push(t);
          if (line.kind !== 'system') at(t - TYPING, () => setTyping(i));
          at(t, () => {
            setTyping(-1);
            setShown(i + 1);
          });
        });
        /* The log: in step with its bubble, then 300ms apart. */
        let l = 0;
        THREAD.log.forEach((entry, i) => {
          l = entry.with !== undefined ? lineAt[entry.with] : l + STEP;
          at(l, () => setLogged(i + 1));
        });
        at(Math.max(t, l) + HOLD, play);
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
    <figure className="tb" ref={ref} data-artifact="TextBackBand">
      <div className="tb__cols">
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
        <ol className="tb__log">
          {THREAD.log.map(({ time, event }, i) => (
            <li className="tb__log-l" key={`${time} ${event}`} data-shown={i < logged ? 'true' : 'false'}>
              <span className="tb__log-t">{time}</span>
              <span className="tb__log-e">{event}</span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="tb__cap">{THREAD.caption}</figcaption>
    </figure>
  );
}

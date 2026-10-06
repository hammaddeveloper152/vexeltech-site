import React from 'react';
import { useLoop, step, lin, leaving } from './loop.js';
import PhoneShell from './PhoneShell.jsx';
import './artifacts.css';
import './search-call.css';

/* SERVICES, MARKETING: FROM SEARCH TO CALL, AROUND A PHONE AND A LEDGER
   (2026-10-06, the founder's quality pass). It replaced the four frames of
   final9 (search, social, landing, call in 2 x 2), which replaced the three
   of final7. No client name or capture: the business is "Your business".

     left    one phone silhouette (PhoneShell, BUILD-LAW rule 0's container),
             320 wide, its screen cream, playing the visit as real screens:
               search    the bar types "plumber near me"; the results
                         draw: a Sponsored result (a 16px favicon disc in
                         the discipline colour, the URL in Google's green
                         #1A7F37, 4.50:1 on cream, the title in ASPHALT,
                         not the brief's bone, which is 1.1:1 on cream, two
                         lines of steel copy and five yellow stars cut by
                         clip-path), then two organic rows with their
                         titles in Google's link blue #1A0DAB (11.02:1)
               tap       a ripple on the Sponsored result
               landing   as built: "Your business", "Open now. Serving
                         your area.", the yellow "Call now" and its ring,
                         then a ripple on the button
               call      the full-screen call: "Your business", "Incoming
                         call", a red Decline disc and a green Accept disc
                         (4.74 and 5.68:1 against the cream screen); Accept
                         is pressed, and the timer counts to 0:14
     right   the feed card (the social frame as built: the avatar in the
             discipline colour, the image area in it at 20%), its button in
             Meta's brand blue #0866FF with a white label (4.82:1; the
             brief's #1877F2 is 4.23:1 with white and fails), above a lead
             ledger: a white sheet whose mono rows land as the phone gets to
             each step, the last "Cost per lead $31" with the figure in the
             coral ink (5.71:1 on white), and "Illustrative figure." under
             it. That is the one invented figure on the page, and it says so.

   Screens change by crossfade, never a snap. Each step starts about 300ms
   after the one before; the play is 9.2s, then the finished state (the
   call answered at 0:14, the ledger full) holds (loop.js). First paint and
   reduced motion: the finished state. The stage is a picture, aria-hidden;
   the line under it is the content. Platform colours are real-world
   colours, allowed here by the founder (2026-10-06).

   ONE READING (the founder's clarity pass, 2026-10-06). The ledger is the
   narrator: its five rows are always on the sheet, unlit in steel, and
   each lights (asphalt, the newest tinted in the discipline colour) at the
   moment the phone reaches its beat (the step strip that ran beside it
   came off in final14, 2026-10-06): Search when the query is typed, Click on the tap on the
   Sponsored result, Page when the landing screen arrives, Call when Accept
   is pressed, Cost when the timer stops at 0:14. "Illustrative figure."
   sits on the sheet directly under the Cost row. The feed card is 240
   wide above the ledger, labelled "The same ad on Facebook". */
const QUERY = 'plumber near me';
const TOTAL = 9200;

/* The timeline, in ms. */
const T = {
  type: 200, // the query types over 1000
  results: 1400, // the result rows draw, 150 apart
  tap: 2300, // the ripple on the Sponsored result
  landing: 2900, // crossfade to the landing screen
  ring: 3700, // the ring draws round Call now
  tapCall: 4400, // the ripple on Call now
  call: 5000, // crossfade to the call screen
  accept: 5900, // Accept is pressed
  timer: 6300, // the timer counts to 0:14 over 1400
  feedTap: 1700, // the feed card's button is pressed
};
/* THE BEATS: one time each, read by the phone's own steps and the ledger,
   so the two cannot drift apart. */
const BEATS = {
  search: T.type + 1000, // the query is typed
  click: T.tap, // the tap on the Sponsored result
  page: T.landing + 150, // the landing screen arrives
  call: T.accept, // Accept is pressed
  cost: T.timer + 1400, // the timer stops at 0:14
};
/* The ledger's rows, one per beat. */
const LEDGER = [
  { k: 'Search', v: 'plumber near me', at: BEATS.search },
  { k: 'Click', v: 'Sponsored, position 1', at: BEATS.click },
  { k: 'Landing', v: '0:04 on page', at: BEATS.page },
  { k: 'Call', v: '0:14, answered', at: BEATS.call },
  { k: 'Cost per lead', v: '$31', at: BEATS.cost, figure: true },
];

const wipe = (k) => ({ clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` });
/* A screen's opacity: it fades in at `from` and out at `to`, 300ms each. */
const screen = (t, from, to) =>
  Math.min(from === null ? 1 : step(t, from, 300), to === null ? 1 : 1 - step(t, to, 300));
/* A tap: a ripple that grows and fades, 450ms. */
const ripple = (t, at) => {
  const k = lin(t, at, 450);
  return {
    transform: `scale(${0.2 + k * 0.9})`,
    opacity: k > 0 && k < 1 ? 0.2 * (1 - k) : 0,
  };
};

function Stars() {
  return (
    <span className="stc__stars" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span className="stc__star" key={i} />
      ))}
    </span>
  );
}

export default function SearchToCall() {
  const ref = React.useRef(null);
  const [t, , , leave] = useLoop(ref, TOTAL);
  const typed = QUERY.slice(0, Math.round(lin(t, T.type, 1000) * QUERY.length));
  const secs = Math.round(lin(t, T.timer, 1400) * 14);
  /* "Incoming call" gives way to the timer over 300ms once Accept is
     pressed; the feed button's press is a tint that rises and falls. */
  const pOut = step(t, T.accept + 150, 150);
  const pIn = step(t, T.accept + 300, 150);
  /* A screen or a line at opacity 0 is not rendered at all, so nothing
     hidden sits in the page at rest (BUILD-LAW Motion). */
  const oSearch = screen(t, null, T.landing);
  const oLand = screen(t, T.landing, T.call);
  const oCall = screen(t, T.call, null);
  const pFeedTap = Math.sin(Math.PI * lin(t, T.feedTap, 360));
  /* How many beats have happened. At rest (the finished frame, which is
     also the first paint and reduced motion) all five have. */
  const done = LEDGER.filter((r) => t >= r.at).length;
  const playing = t < TOTAL;

  return (
    <figure className="sc stc" ref={ref} data-artifact="SearchToCall" {...leaving(leave)}>
      <div className="stc__stage" aria-hidden="true">
        <div className="stc__phone">
          <PhoneShell width={320} screen="var(--c-cream)">
            <div className="stc__fade stc__screens">
              {/* SEARCH */}
              {oSearch > 0 ? (
                <div className="stc__scr stc__scr--search" style={{ opacity: oSearch }}>
                  <span className="stc__status">9:41</span>
                  <p className="stc__bar">
                    <span className="stc__q">{typed}</span>
                    <span className="cs-caret stc__caret" />
                  </p>
                  <ol className="stc__res">
                    <li className="stc__ad" style={wipe(step(t, T.results, 400))}>
                      <span className="stc__ad-k">Sponsored</span>
                      <span className="stc__site">
                        <span className="stc__fav" />
                        <span className="stc__url">yourbusiness.com</span>
                      </span>
                      <span className="stc__title">Your business</span>
                      <span className="stc__copy">The one line that makes them call. Open now, serving your area.</span>
                      <span className="stc__rate">
                        <Stars />
                        <span className="stc__rate-n">4.8</span>
                      </span>
                      <span className="stc__ripple" style={ripple(t, T.tap)} />
                    </li>
                    {[0, 1].map((i) => (
                      <li className="stc__org" key={i} style={wipe(step(t, T.results + 150 * (i + 1), 400))}>
                        <span className="stc__url">someoneelse.com</span>
                        <span className="stc__title stc__title--org">Someone else.</span>
                        <span className="stc__copy">4.8 stars. Open now.</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {/* LANDING */}
              {oLand > 0 ? (
                <div className="stc__scr stc__scr--land" style={{ opacity: oLand }}>
                  <span className="stc__status">9:41</span>
                  {/* The browser's address bar, and the page's first panel in
                    the discipline colour at 18%: the landing page's chrome,
                    no claim in it. */}
                  <span className="stc__addr">
                    <span className="stc__fav" />
                    <span className="stc__addr-u">yourbusiness.com</span>
                  </span>
                  <span className="stc__panel">
                    <span className="stc__panel-wm">Your business</span>
                  </span>
                  <span className="stc__wm">Your business</span>
                  <span className="stc__open">Open now. Serving your area.</span>
                  <span className="stc__btn">
                    Call now
                    <svg className="stc__ring" focusable="false">
                      <rect
                        rx="9"
                        pathLength="100"
                        style={{
                          strokeDashoffset: 100 * (1 - step(t, T.ring, 600)),
                        }}
                      />
                    </svg>
                    <span className="stc__ripple" style={ripple(t, T.tapCall)} />
                  </span>
                </div>
              ) : null}

              {/* CALL */}
              {oCall > 0 ? (
                <div className="stc__scr stc__scr--call" style={{ opacity: oCall }}>
                  <span className="stc__status">9:41</span>
                  {/* The caller's disc, initials in the discipline's ink. */}
                  <span className="stc__avatar">YB</span>
                  <span className="stc__call-n">Your business</span>
                  <span className="stc__call-s">
                    {pOut < 1 ? (
                      <span className="stc__call-k" style={{ opacity: 1 - pOut }}>
                        Incoming call
                      </span>
                    ) : null}
                    {pIn > 0 ? (
                      <span className="stc__call-t" style={{ opacity: pIn }}>
                        0:{String(secs).padStart(2, '0')}
                      </span>
                    ) : null}
                  </span>
                  <span className="stc__keys">
                    <span className="stc__key">
                      <span className="stc__disc stc__disc--no" />
                      <span className="stc__key-l">Decline</span>
                    </span>
                    <span className="stc__key">
                      <span
                        className="stc__disc stc__disc--yes"
                        style={{
                          transform: `scale(${1 - 0.12 * Math.sin(Math.PI * lin(t, T.accept, 240))})`,
                        }}
                      />
                      <span className="stc__key-l">Accept</span>
                      <span className="stc__ripple stc__ripple--disc" style={ripple(t, T.accept)} />
                    </span>
                  </span>
                </div>
              ) : null}
            </div>
          </PhoneShell>
        </div>

        <div className="stc__side">
          <div className="stc__feed-w">
            <span className="stc__feed-k">The same ad on Facebook</span>
            <div className="stc__fade stc__feed">
              <span className="stc__feed-h">
                <span className="stc__feed-av" />
                <span className="stc__feed-n">Your business</span>
                <span className="stc__feed-sp">Sponsored</span>
              </span>
              <span className="stc__feed-img">
                <span className="stc__feed-wm">Your business</span>
              </span>
              <span className="stc__feed-l">The one line that makes them message.</span>
              <span className="stc__feed-go">
                Send message
                <span className="stc__feed-press" style={{ opacity: pFeedTap }} />
              </span>
            </div>
          </div>

          <div className="stc__sheet">
            <ol className="stc__ledger">
              {LEDGER.map(({ k, v, at, figure }, i) => {
                const lit = t >= at;
                /* The newest lit row carries a tint while the play is on. */
                const now = lit && playing && i === done - 1;
                return (
                  <li className="stc__row" key={k} data-lit={lit ? 'true' : 'false'} data-now={now ? 'true' : 'false'}>
                    <span className="stc__row-k">{k}</span>
                    <span className={`stc__row-v${figure ? ' stc__row-v--fig' : ''}`}>{v}</span>
                  </li>
                );
              })}
            </ol>
            <span className="stc__note">Illustrative figure.</span>
          </div>
        </div>
      </div>
      <figcaption className="sc__cap">
        On our last reported account, a lead cost $30.11 against a $70.11 US search average (WordStream, Google Ads
        Benchmarks 2025).
      </figcaption>
    </figure>
  );
}

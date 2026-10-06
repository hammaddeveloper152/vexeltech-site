import React from 'react';
import PhoneShell from './PhoneShell.jsx';
import BeforeAfter from './BeforeAfter.jsx';
import './artifacts.css';
import './search-slider.css';

/* SERVICES, MARKETING: THE BEFORE/AFTER SLIDER (2026-10-06, the founder's
   approved frame B, final15). It replaced the phone-and-ledger play of the
   quality pass and its feed card, which are deleted. No client name or
   capture: the business is "Your business".

   The same slider as Branding (BeforeAfter.jsx) on the dark band. Each
   side: a phone silhouette (PhoneShell, BUILD-LAW rule 0's container), 260
   wide, with a search screen, and a white ledger card 260 wide to its
   right with one line under it.

     before   the results for "plumber near me": three "Someone else."
              rows (favicon discs in Google's blue, red and green, the URLs
              in Google's green, a star row each), an ellipsis row and a
              greyed "Your business, page 2". Ledger: This month, Ad spend
              $2,400, Calls from ads ?, Cost per lead ? in red
     after    the same search with a Sponsored "Your business" row on top
              (its disc in the discipline coral, its title in the coral
              ink, 5.07:1 on white), one "Someone else." row, and a call
              screen over the lower half of the phone: "Incoming call", a
              coral caller disc "KM", "from your ad", a red and a green
              disc. Ledger: $2,400, 77, $31 in the yellow ink

   From 1024 each layer sets its side twice, one per half, so at 50% the
   stage is the frame. Below 1024 a layer is one side across the stage.

   THE FIGURES ARE INVENTED and the stage says so: "Illustrative figures"
   at the caption's right end (BUILD-LAW Truth, Real over drawn, as the
   founder's final15 brief names them). The stage is aria-hidden; the
   caption is the content. Platform colours are real-world colours inside
   a mockup of that platform. */
const QUERY = 'plumber near me';

const OTHERS = [
  { fav: '#4285F4', d: 'Open now · 4.8 ★★★★★ (310)' },
  { fav: '#EA4335', d: 'Open now · 4.7 ★★★★★ (188)' },
  { fav: '#34A853', d: 'Open now · 4.6 ★★★★☆ (94)' },
];

function Other({ fav, d }) {
  return (
    <li className="ss-res">
      <span className="ss-res__t">
        <i className="ss-fav" style={{ background: fav }} />
        Someone else.
      </span>
      <span className="ss-res__u">someoneelse.com</span>
      <span className="ss-res__d">{d}</span>
    </li>
  );
}

function Ledger({ after }) {
  return (
    <div className="ss-ledger">
      <span className="ss-ledger__k">This month</span>
      <span className="ss-ledger__l">
        <span>Ad spend</span>
        <span>$2,400</span>
      </span>
      <span className="ss-ledger__l">
        <span>Calls from ads</span>
        <span>{after ? '77' : '?'}</span>
      </span>
      <span className="ss-ledger__l ss-ledger__l--big">
        <span>Cost per lead</span>
        <span className={after ? 'ss-yl' : 'ss-red'}>{after ? '$31' : '?'}</span>
      </span>
    </div>
  );
}

function Side({ after }) {
  return (
    <div className={`ss ${after ? 'ss--after' : 'ss--before'}`}>
      <div className="ss-phone">
        <PhoneShell width={260} screen="#ffffff" ratio="390 / 726">
          <div className="ss-screen">
            <span className="ss-bar">{QUERY}</span>
            <ol className="ss-results">
              {after ? (
                <>
                  <li className="ss-res ss-res--you">
                    <span className="ss-sp">Sponsored</span>
                    <span className="ss-res__t">
                      <i className="ss-fav ss-fav--you" />
                      Your business
                    </span>
                    <span className="ss-res__u">yourbusiness.com</span>
                    <span className="ss-res__d">Open now · Call today, booked this week</span>
                  </li>
                  <Other {...OTHERS[0]} />
                </>
              ) : (
                <>
                  {OTHERS.map((o) => (
                    <Other key={o.fav} {...o} />
                  ))}
                  <li className="ss-res ss-res--more">…</li>
                  <li className="ss-res ss-res--grey">
                    <span className="ss-res__t">Your business</span>
                    <span className="ss-res__u">page 2</span>
                  </li>
                </>
              )}
            </ol>
            {after ? (
              <div className="ss-call">
                <span className="ss-call__k">Incoming call</span>
                <span className="ss-call__who">KM</span>
                <span className="ss-call__from">from your ad</span>
                <span className="ss-call__btns">
                  <i className="ss-call__no" />
                  <i className="ss-call__yes" />
                </span>
              </div>
            ) : null}
          </div>
        </PhoneShell>
      </div>
      <div className="ss-right">
        <Ledger after={after} />
        <p className="ss-quiet">
          {after ? 'Same spend. Every call traced. A number you can plan with.' : 'Money out. Phone quiet. Nobody can say why.'}
        </p>
      </div>
    </div>
  );
}

export default function SearchToCall() {
  const layer = (after) => (
    <div className="ss-row">
      <Side after={after} />
      <Side after={after} />
    </div>
  );
  return (
    <BeforeAfter
      tone="dark"
      className="ba--ads"
      data-artifact="SearchToCall"
      name="Before and after divider"
      before={layer(false)}
      after={layer(true)}
      cap="Same search, same budget. Drag to see what changes."
      end="Illustrative figures"
    />
  );
}

import React, { useRef } from 'react';
import { useLoop, leaving } from './loop.js';
import './marketing-mosaic.css';

/* SERVICES, MARKETING: "YOUR NAME, EVERYWHERE THEY LOOK." (final30,
   2026-10-07, the founder's frame M2, reference/final-frames/
   frame_M2_marketing). It replaced three places and one inbox (InboxStage,
   deleted with its styles).

     left   340 at 1280: the eyebrow, "Your name, everywhere they look."
            (not a heading: the band's h2 is below the stage), one
            paragraph, six channel rows, and the tally "6 of 6"
     right  six white tiles, 3 by 2 at 1280 (2 by 3 below 1024, one column
            below 600), each under a 26px ink bar: the channel and the day
            and time

   THE BUSINESS is "Your Business", with a navy YB chip wherever a logo
   would sit. Every figure, rating, time and competitor is an example, and
   the line under the mosaic says so (BUILD-LAW Truth). Google is depicted
   generically (BUILD-LAW): no logo or wordmark, and inside the results
   mockup the only platform word is "Sponsored". The one platform colour is
   Meta's #1877F2 on the Facebook tile's "Learn more" outline.

   THE PLAY (BUILD-LAW Motion, artifacts rest full; loop.js). At rest all
   six tiles are lit and the tally reads 6 of 6, on the first paint, off
   screen and under reduced motion. At half in view: the 400ms crossfade,
   then all six at 35%, relit Monday to Saturday 500ms apart (each over
   300ms), each bar's day and time typing in as its tile lights, the tally
   counting with them; then lit for good. It plays once (final39, the
   founder: rest full, start soft, play once). Opacity and text only. */

const DAYS = ['Mon 08:12', 'Tue 12:40', 'Wed 19:05', 'Thu 21:30', 'Fri 07:50', 'Sat 10:15'];
const CHANNELS = [
  ['Google search', 'Ads · SEO'],
  ['Maps and listings', 'Local SEO · GBP'],
  ['Instagram', 'Content · calendar'],
  ['Facebook', 'Meta ads'],
  ['AI answers', 'GEO'],
  ['Directories and reviews', 'Listings · reputation'],
];
const FIRST_LIGHT = 800;
const APART = 500;
const LIGHT = 300;
const PER_CHAR = 35;
const TOTAL = 5600;

const clamp = (x) => Math.max(0, Math.min(1, x));
const startOf = (k) => FIRST_LIGHT + k * APART;

function Chip() {
  return (
    <span className="mm__yb" aria-hidden="true">
      YB
    </span>
  );
}

function Stars({ n = 5 }) {
  return (
    <span className="mm__stars" aria-hidden="true">
      {'★'.repeat(n)}
    </span>
  );
}

const TILES = [
  {
    id: 'search',
    tag: 'Google search',
    body: (
      <>
        <p className="mm__q">electrician near me</p>
        <p className="mm__sp">Sponsored</p>
        <p className="mm__h">
          <Chip />
          Your Business | Same-day call-outs
        </p>
        <p className="mm__d">Fixed price quoted before any work starts.</p>
        <div className="mm__org">
          <p className="mm__h mm__h--sm">Your Business, electricians</p>
          <p className="mm__d">yourbusiness.com · also first organically</p>
        </div>
      </>
    ),
  },
  {
    id: 'maps',
    tag: 'Maps',
    body: (
      <>
        <div className="mm__map" aria-hidden="true">
          <span className="mm__pin" />
        </div>
        <p className="mm__r">
          <Chip />
          <b>Your Business</b> · 4.9 <Stars /> (212)
        </p>
        <p className="mm__ok">First in the map pack</p>
      </>
    ),
  },
  {
    id: 'instagram',
    tag: 'Instagram',
    body: (
      <>
        <p className="mm__post">Three signs your fuse board is older than it should be.</p>
        <p className="mm__cap">
          <b>yourbusiness</b> Tip 3 of 12 this month. Book a free check in the link.
        </p>
        <p className="mm__meta">From your content calendar · posted for you</p>
      </>
    ),
  },
  {
    id: 'facebook',
    tag: 'Facebook',
    body: (
      <>
        <div className="mm__fbh">
          <span className="mm__av" aria-hidden="true">
            YB
          </span>
          <span>
            Your Business
            <small>Sponsored</small>
          </span>
        </div>
        <p className="mm__copy">Booked up this week? Neither were our customers until they found us.</p>
        <p className="mm__panel">Same-week appointments. Book online.</p>
        <p className="mm__cta">
          <span>yourbusiness.com</span>
          <span className="mm__more">Learn more</span>
        </p>
      </>
    ),
  },
  {
    id: 'ai',
    tag: 'AI answer',
    body: (
      <>
        <p className="mm__qq">&ldquo;Who is a reliable electrician near me that can come today?&rdquo;</p>
        <p className="mm__aa">
          <b>Your Business</b> is the highest rated option nearby (4.9 from 212 reviews), offers same-day call-outs and
          quotes a fixed price before starting.
        </p>
        <p className="mm__meta">Cited: yourbusiness.com · Google reviews · local directory</p>
      </>
    ),
  },
  {
    id: 'directory',
    tag: 'Directory',
    body: (
      <>
        <p className="mm__row mm__row--us">
          <span>
            <Chip />
            Your Business
          </span>
          <span>
            <span className="mm__star" aria-hidden="true">
              ★
            </span>{' '}
            4.9
          </span>
        </p>
        <p className="mm__row">
          <span>Riverside Electrical</span>
          <span>★ 4.3</span>
        </p>
        <p className="mm__row">
          <span>Main Street Electric</span>
          <span>★ 4.6</span>
        </p>
        <p className="mm__ok">Listed, verified, first. 14 new reviews this month.</p>
      </>
    ),
  },
];

export default function MarketingMosaic() {
  const ref = useRef(null);
  const [t, , , leave] = useLoop(ref, TOTAL);
  const lit = TILES.map((_, k) => clamp((t - startOf(k)) / LIGHT));
  const count = lit.filter((x) => x > 0).length;

  return (
    <figure className="mm" data-artifact="MarketingMosaic" data-device="mosaic">
      <div className="mm__stage" ref={ref} {...leaving(leave)}>
        <div className="mm__side">
          <p className="mm__eyebrow">One business · one week · six places</p>
          <p className="mm__head">
            Your name, <em>everywhere</em> they look.
          </p>
          <p className="mm__p">
            Marketing is getting your business in front of people, over and over, in the places they already are, and
            above the competitor every time.
          </p>
          <ul className="mm__list">
            {CHANNELS.map(([name, what]) => (
              <li key={name}>
                <span>{name}</span>
                <span>{what}</span>
              </li>
            ))}
          </ul>
          <p className="mm__tally">
            <span className="mm__n">{count} of 6</span>
            <span className="mm__l">places your customer looked this week. You were in all of them.</span>
          </p>
        </div>

        <ul className="mm__mosaic" aria-hidden="true">
          {TILES.map((tile, k) => {
            const typed = Math.max(0, Math.min(DAYS[k].length, Math.floor((t - startOf(k)) / PER_CHAR)));
            return (
              <li className={`mm__tile mm__tile--${tile.id}`} key={tile.id} style={{ opacity: 0.35 + 0.65 * lit[k] }}>
                <p className="mm__tag">
                  <span>{tile.tag}</span>
                  <b>
                    {DAYS[k].slice(0, typed)}
                    <span className="mm__rest">{DAYS[k].slice(typed)}</span>
                  </b>
                </p>
                <div className="mm__body">{tile.body}</div>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mm__note">Illustration. Ratings, times and competitors are examples.</p>
      <figcaption className="mm__cap2">
        <span>Search, maps, social, AI answers, directories. One name in all of them, above the competitor.</span>
        <span>Marketing priced on the call</span>
      </figcaption>
    </figure>
  );
}

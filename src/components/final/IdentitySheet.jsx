import React, { useRef } from 'react';
import { useSeen } from '../site/useOnce.js';
import './identity.css';

/* SERVICES, BRANDING: THE IDENTITY SHEET (2026-10-03, the founder). It
   replaced the three brand-guide plates. A cream band at the content width,
   two parts side by side from 1024 and stacked below:

     the sheet (58%)    white, 4px radius, the Terms sheet's shadow, four rows
       1 the mark       Christal Clear's main mark, 200px wide, centred in a
                        320px area (the founder's ruling: the brief's 280 could
                        not hold the outer clear-space rect), inside its
                        clear-space grid: 1px steel rects at the mark's bounds
                        and at the bounds plus 24px, an "x" in mono 11px in
                        each gap (11, not the brief's 9: BUILD-LAW Type floor,
                        the founder's ruling). The lines draw in once, 600ms,
                        by stroke-dashoffset, when the sheet comes into view.
       2 the palette    five swatches 56px tall, 4px apart, the hex under each
                        in mono 11px steel. They rise 16px into place, 70ms
                        apart (BUILD-LAW's stagger; the brief said 60).
       3 the type       four columns: the name in mono 11px over "Aa" at 40px.
                        Sora and Great Vibes are the client's open-licence
                        faces, self-hosted (public/fonts/client, OFL) and
                        fetched only where they are used, which is here. Beaufort
                        Pro and Eurostile Extended are commercial: their "Aa"
                        is the site's display face at 50%, the name in full,
                        and "licensed to the client" under the row.
       4 the foot       the caption, mono 11px steel
     the signage (42%)  the mark on the building, cover-fit to the sheet's full
                        height, 4px radius, its caption under it

   Nothing starts hidden (BUILD-LAW Motion): the lines draw, the swatches
   rise at full opacity. Reduced motion: still, and drawn. */
const SWATCHES = ['#2E3242', '#232735', '#1BA1A8', '#9BF9FE', '#F0F0F0'];
const FACES = [
  { name: 'Sora', cls: 'id__aa--sora' },
  { name: 'Great Vibes', cls: 'id__aa--vibes' },
  { name: 'Beaufort Pro', cls: 'id__aa--stand' },
  { name: 'Eurostile Extended', cls: 'id__aa--stand' },
];

/* The clear-space grid, in px: the mark is 200 x 247 (408.54 x 504.38). */
const MW = 200;
const MH = 247;
const G = 24;
const W = MW + 2 * G;
const H = MH + 2 * G;

export default function IdentitySheet() {
  const ref = useRef(null);
  const armed = useSeen(ref);
  return (
    <figure className="id" ref={ref} data-armed={armed ? 'true' : 'false'}>
      <div className="id__sheet">
        <div className="id__row id__mark">
          <div className="id__grid" style={{ width: W + 2, height: H + 2 }}>
            <svg className="id__lines" viewBox={`0 0 ${W + 2} ${H + 2}`} aria-hidden="true" focusable="false">
              <rect className="id__line" x="1" y="1" width={W} height={H} pathLength="100" />
              <rect className="id__line" x={G + 1} y={G + 1} width={MW} height={MH} pathLength="100" />
            </svg>
            <img
              className="id__logo"
              src="/brand/ccp-main.svg"
              alt="The Christal Clear Properties mark"
              width={MW}
              height={MH}
              loading="lazy"
              decoding="async"
              style={{ left: G + 1, top: G + 1 }}
            />
            <span className="id__x" aria-hidden="true" style={{ left: '50%', top: G / 2 + 1 }}>
              x
            </span>
            <span className="id__x" aria-hidden="true" style={{ left: '50%', top: H - G / 2 + 1 }}>
              x
            </span>
            <span className="id__x" aria-hidden="true" style={{ left: G / 2 + 1, top: '50%' }}>
              x
            </span>
            <span className="id__x" aria-hidden="true" style={{ left: W - G / 2 + 1, top: '50%' }}>
              x
            </span>
          </div>
        </div>

        <ul className="id__row id__palette" aria-label="Palette">
          {SWATCHES.map((hex, i) => (
            <li className="id__swatch" key={hex} style={{ '--i': i }}>
              <span className="id__chip" style={{ background: hex }} />
              <span className="id__hex">{hex}</span>
            </li>
          ))}
        </ul>

        <div className="id__row">
          <ul className="id__type">
            {FACES.map(({ name, cls }) => (
              <li className="id__face" key={name}>
                <span className="id__name">{name}</span>
                <span className={`id__aa ${cls}`} aria-hidden="true">
                  Aa
                </span>
              </li>
            ))}
          </ul>
          <p className="id__lic">licensed to the client</p>
        </div>

        <p className="id__row id__foot">Christal Clear Properties. Identity, stationery, signage. Real estate, St. Simons Island GA.</p>
      </div>

      <div className="id__side">
        <span className="id__sign">
          <img
            src="/brand/ccp-signage-800.jpg"
            srcSet="/brand/ccp-signage-800.jpg 800w, /brand/ccp-signage.jpg 1600w"
            sizes="(min-width: 1024px) 42vw, 100vw"
            alt="Christal Clear Properties signage on a building front, beside the Brokered by eXp Realty mark"
            width="1600"
            height="1845"
            loading="lazy"
            decoding="async"
          />
        </span>
        <p className="id__cap">The mark on the building.</p>
      </div>
    </figure>
  );
}

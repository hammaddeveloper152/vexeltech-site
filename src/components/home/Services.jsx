import React from 'react';
import { DISCIPLINES as CARDS } from '../../content/disciplines.js';
import DisciplinePlate from '../site/DisciplinePlate.jsx';
import usePlateArrival from './usePlateArrival.js';
import '../../styles/plates.css';
import './Services.css';

/* Section 5. The four disciplines, as plates.

   ---- What this replaced, and why none of it comes back ------------------

   A machine yellow section ground, a pinned horizontal scroller, an 870px card
   and a rail. All four are gone together because they were one decision: the
   rail needed a card wider than the viewport, the card needed the section to
   hold still, and holding a section still needed a pin. Take any one away and
   the other three stop making sense.

   THE PIN WAS THE EXPENSIVE PART. A pinned section changes document height,
   owns the reader's scroll for its length, and puts three of four cards off
   screen at any moment — so the section that names what the agency does could
   only ever be read one card at a time, in an order the page chose. A 2x2 grid
   shows all four at once and costs nothing to read.

   THE YELLOW GROUND WENT WITH IT. It was the page's one full-bleed field of
   the accent, and it forced two rules that only existed to survive it: the
   discipline names went bone rather than yellow because they would otherwise
   have been the same colour as the field behind their own card, and the
   section was listed in DESIGN.md's carrier table as a ground that IS the
   carrier. Neither is needed now. The section is asphalt under the two lights,
   like Failures above it, and the accent is spent on the bars.

   ---- Sub-services, written 2026-09-08, unchanged ------------------------

   All twelve are the user's, from the content answers and the pricing sheet.
   Nothing here is a capability this agency has not stated.

   | Discipline | Source |
   |---|---|
   | Branding   | 2.1 and 1.1, plus the pricing sheet's branding tiers |
   | Websites   | 1.1 development services, 2.2, the website tiers |
   | Marketing  | 1.1 marketing services, and the sheet's own three headings: SEO, Meta Ads, Google PPC |
   | Automation | 1.1 automations, verbatim: workflow automations, AI agents, chat bots |

   Two lines compress two sourced items into one phrase because the slot holds
   three and the source lists more: "Stationery and social kit" is 2.1's
   stationery plus its social media kit, and "Web apps and ecommerce" is two
   entries from 1.1's development list. Both halves of each are the user's.

   THE ICON CARDS, the storyboard's spec (restored 2026-09-22 after the
   word tiles were put back by mistake; the tiles are on the storyboard's
   "what comes off the site" list): lit-near with the two lights, a Phosphor
   icon at 24px top left in white, the name in Moldie, the three items, the
   yellow fill on hover, the strike ticker directly beneath. The tile files
   are deleted from the build. See `plates.css`. */


export default function Services() {
  const [plateRef] = usePlateArrival(CARDS.length);

  return (
    <section className="vt services" aria-labelledby="services-h">
      <div className="services__in">
        <div className="services__head">
          <h2 className="services__h" id="services-h">
            What we do
          </h2>
          {/* The /services page's own lead, verbatim. */}
          <p className="services__lead">
            Four disciplines and one team. Not four agencies who don&apos;t talk to each
            other, and not four invoices.
          </p>
        </div>

        <div className="services__grid">
          {CARDS.map(({ id, Icon, discipline, subs }, i) => (
            <DisciplinePlate
              key={id}
              id={id}
              Icon={Icon}
              name={discipline}
              items={subs.map((t) => ({ t }))}
              side={i % 2 === 0 ? 'left' : 'right'}
              as="h3"
              plateRef={plateRef(i)}
              href={`/services#${id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

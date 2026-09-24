import {
  IsoAutomation,
  IsoBranding,
  IsoMarketing,
  IsoWebsites,
} from '../components/site/Illustrations.jsx';

/* THE FOUR DISCIPLINES AS CARDS, home's What we do. Each card's artwork is
   its isometric illustration since 2026-09-24 (components/site/
   Illustrations.jsx, the founder); the chip glyphs before them, and
   Phosphor's icons before those, are gone.

   THE LINES ARE THE FOUNDER'S, 2026-09-24 (the Cloaked card brief),
   verbatim. They replace the three sub-services each plate listed; the card
   sets the first sentence in bone and the rest in steel-lift. */
export const DISCIPLINES = [
  {
    id: 'branding',
    Art: IsoBranding,
    discipline: 'Branding',
    line: 'A name people remember. Logo, guidelines, stationery and a social kit.',
  },
  {
    id: 'websites',
    Art: IsoWebsites,
    discipline: 'Websites',
    line: 'A site that sells while you sleep. Custom, four business days, thirty days of care.',
  },
  {
    id: 'marketing',
    Art: IsoMarketing,
    discipline: 'Marketing',
    line: 'Ads pointed at the phone. Google and Meta ads, lead generation.',
  },
  {
    id: 'automation',
    Art: IsoAutomation,
    discipline: 'Automation',
    line: "The week's small jobs, done without you. Quotes, follow-ups, invoices, bookings.",
  },
];

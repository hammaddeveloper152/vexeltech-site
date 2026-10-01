import {
  IsoAutomation,
  IsoBranding,
  IsoMarketing,
  IsoWebsites,
} from '../components/site/Illustrations.jsx';
import { FIGURES, money } from './pricing.js';

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
    /* COPY V2, 2026-10-01: the four lines (VEXELTECH-COPY.md, Home, What
       we do). The $299 is the token's. */
    line: `A mark people remember. Logo, brand guideline, stationery and social kit, from ${money(FIGURES.brandingBasic)}.`,
  },
  {
    id: 'websites',
    Art: IsoWebsites,
    discipline: 'Websites',
    line: `Up to six pages, designed and coded for your business. ${money(FIGURES.website)}, live in four business days.`,
  },
  {
    id: 'marketing',
    Art: IsoMarketing,
    discipline: 'Marketing',
    line: 'Google and Meta ads pointed at your phone, with the landing page fixed first.',
  },
  {
    id: 'automation',
    Art: IsoAutomation,
    discipline: 'Automation',
    line: "Quotes, follow-ups, invoices and bookings that run while you're on a job.",
  },
];

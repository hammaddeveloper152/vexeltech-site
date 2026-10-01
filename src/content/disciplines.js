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
    /* COPY V3, 2026-10-01: the four noun stacks (VEXELTECH-COPY.md, Home,
       What we do). The $299 and $700 are the tokens'. */
    line: `Logo design, brand guidelines, stationery, social kit. From ${money(FIGURES.brandingBasic)}.`,
  },
  {
    id: 'websites',
    Art: IsoWebsites,
    discipline: 'Websites',
    line: `Six-page conversion-focused site, mobile-first, Core Web Vitals green, on your domain. ${money(FIGURES.website)}.`,
  },
  {
    id: 'marketing',
    Art: IsoMarketing,
    discipline: 'Marketing',
    line: 'Google Business Profile, Local Service Ads, Google Ads, Meta ads, local SEO and AI search.',
  },
  {
    id: 'automation',
    Art: IsoAutomation,
    discipline: 'Automation',
    line: 'Missed-call text-back, quote follow-up, invoice reminders, online booking, AI agents.',
  },
];

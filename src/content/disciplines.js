import { FIGURES, money } from './pricing.js';

/* THE FOUR DISCIPLINES AS CARDS, home's What we do. Since final25
   (2026-10-07, the founder) each card shows a still of its discipline's
   /services artifact at rest (`still`, public/stills/<id>.webp, made by
   .measure/artifact-stills.mjs from the same component with motion off).
   The isometric illustrations of 2026-09-24 and Illustrations.jsx are
   deleted; no icon stands in a card.

   THE LINES ARE THE FOUNDER'S, 2026-09-24 (the Cloaked card brief),
   verbatim. They replace the three sub-services each plate listed; the card
   sets the first sentence in bone and the rest in steel-lift. */
export const DISCIPLINES = [
  {
    id: 'branding',
    still: '/stills/branding.webp',
    discipline: 'Branding',
    /* COPY V3, 2026-10-01: the four noun stacks (VEXELTECH-COPY.md, Home,
       What we do). The $299 and $700 are the tokens'. */
    line: `Logo design, brand guidelines, stationery, social kit. From ${money(FIGURES.brandingBasic)}.`,
  },
  {
    id: 'websites',
    still: '/stills/websites.webp',
    discipline: 'Websites',
    line: `Six-page conversion-focused site, mobile-first, Core Web Vitals green, on your domain. ${money(FIGURES.website)}.`,
  },
  {
    id: 'marketing',
    still: '/stills/marketing.webp',
    discipline: 'Marketing',
    line: 'Google Business Profile, Local Service Ads, Google Ads, Meta ads, local SEO and AI search.',
  },
  {
    id: 'automation',
    still: '/stills/automation.webp',
    discipline: 'Automation',
    line: 'Missed-call text-back, quote follow-up, invoice reminders, online booking, AI agents.',
  },
];

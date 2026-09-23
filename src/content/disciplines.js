import { AppWindow, Lightning, PaintBrush, Target } from '@phosphor-icons/react';

/* THE FOUR DISCIPLINES AS CARDS, home's What we do only. The icons are
   PaintBrush, AppWindow, Target and Lightning since 2026-09-22, by BUILD-LAW
   0: PenNib, Browser, Megaphone and Robot were also on the /services cards.

   THE LINES ARE THE FOUNDER'S, 2026-09-24 (the Cloaked card brief),
   verbatim. They replace the three sub-services each plate listed; the card
   sets the first sentence in bone and the rest in steel-lift. */
export const DISCIPLINES = [
  {
    id: 'branding',
    Icon: PaintBrush,
    discipline: 'Branding',
    line: 'A name people remember. Logo, guidelines, stationery and a social kit.',
  },
  {
    id: 'websites',
    Icon: AppWindow,
    discipline: 'Websites',
    line: 'A site that sells while you sleep. Custom, four business days, thirty days of care.',
  },
  {
    id: 'marketing',
    Icon: Target,
    discipline: 'Marketing',
    line: 'Ads pointed at the phone. Search, Google and Meta, lead generation.',
  },
  {
    id: 'automation',
    Icon: Lightning,
    discipline: 'Automation',
    line: "The week's small jobs, done without you. Quotes, follow-ups, invoices, bookings.",
  },
];

import {
  GlyphAutomation,
  GlyphBranding,
  GlyphMarketing,
  GlyphWebsites,
} from '../components/site/Glyphs.jsx';

/* THE FOUR DISCIPLINES AS CARDS, home's What we do. The chip icons are the
   site's own glyphs since 2026-09-24 (components/site/Glyphs.jsx, the
   founder); they replaced Phosphor's PaintBrush, AppWindow, Target and
   Lightning.

   THE LINES ARE THE FOUNDER'S, 2026-09-24 (the Cloaked card brief),
   verbatim. They replace the three sub-services each plate listed; the card
   sets the first sentence in bone and the rest in steel-lift. */
export const DISCIPLINES = [
  {
    id: 'branding',
    Icon: GlyphBranding,
    discipline: 'Branding',
    line: 'A name people remember. Logo, guidelines, stationery and a social kit.',
  },
  {
    id: 'websites',
    Icon: GlyphWebsites,
    discipline: 'Websites',
    line: 'A site that sells while you sleep. Custom, four business days, thirty days of care.',
  },
  {
    id: 'marketing',
    Icon: GlyphMarketing,
    discipline: 'Marketing',
    line: 'Ads pointed at the phone. Search, Google and Meta, lead generation.',
  },
  {
    id: 'automation',
    Icon: GlyphAutomation,
    discipline: 'Automation',
    line: "The week's small jobs, done without you. Quotes, follow-ups, invoices, bookings.",
  },
];

import { AppWindow, Lightning, PaintBrush, Target } from '@phosphor-icons/react';

/* THE FOUR DISCIPLINES AS PLATES: icon, name, three items. The icons are
   PaintBrush, AppWindow, Target and Lightning since 2026-09-22, by BUILD-LAW
   0: PenNib, Browser, Megaphone and Robot were also on the /services cards.
   Home's What we do only. The sourcing of the twelve items is recorded in
   `components/home/Services.jsx`. */

export const DISCIPLINES = [
  {
    id: 'branding',
    Icon: PaintBrush,
    discipline: 'Branding',
    subs: ['Custom logo design', 'Brand guidelines', 'Stationery and social kit'],
  },
  {
    id: 'websites',
    Icon: AppWindow,
    discipline: 'Websites',
    subs: ['Custom websites', 'Web apps and ecommerce', 'UI and UX design'],
  },
  {
    id: 'marketing',
    Icon: Target,
    discipline: 'Marketing',
    subs: ['SEO and search ranking', 'Google and Meta ads', 'Lead generation and CRO'],
  },
  {
    id: 'automation',
    Icon: Lightning,
    discipline: 'Automation',
    subs: ['Workflow automation', 'AI agents', 'Chatbots'],
  },
];

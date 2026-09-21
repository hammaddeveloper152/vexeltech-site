import { Browser, Megaphone, PenNib, Robot } from '@phosphor-icons/react';

/* THE FOUR DISCIPLINES AS PLATES: icon, name, three items. Shared by home
   Services and the About page's "Four disciplines, one team" row, so the two
   mounts cannot drift. The sourcing of the twelve items is recorded in
   `components/home/Services.jsx`. */

export const DISCIPLINES = [
  {
    id: 'branding',
    Icon: PenNib,
    discipline: 'Branding',
    subs: ['Custom logo design', 'Brand guidelines', 'Stationery and social kit'],
  },
  {
    id: 'websites',
    Icon: Browser,
    discipline: 'Websites',
    subs: ['Custom websites', 'Web apps and ecommerce', 'UI and UX design'],
  },
  {
    id: 'marketing',
    Icon: Megaphone,
    discipline: 'Marketing',
    subs: ['SEO and search ranking', 'Google and Meta ads', 'Lead generation and CRO'],
  },
  {
    id: 'automation',
    Icon: Robot,
    discipline: 'Automation',
    subs: ['Workflow automation', 'AI agents', 'Chatbots'],
  },
];

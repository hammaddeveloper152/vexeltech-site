import { FIGURES, money } from './pricing.js';

/* THE WHO WE ARE TILES, the founder's words, verbatim: TEAM, BUILD and
   AFTER from the launch batch, PRICE from life pass 3 (2026-09-25). Home's
   About section and the contact page (the contact pass, 2026-09-25, as
   trust facts under the form) both read them from here, so the words live
   once. */
/* COPY V3, 2026-10-01 (VEXELTECH-COPY.md, Home, Who we are, Facts block):
   the four tiles take V3's facts, label then value. Same tile component. The
   $700 is the token. */
export const FACTS = [
  ['Website', `${money(FIGURES.website)} flat, up to six pages`],
  ['Build', 'Four business days from content'],
  ['After launch', 'Thirty days of maintenance included'],
  ['Ownership', 'Domain, hosting and code in your name'],
];

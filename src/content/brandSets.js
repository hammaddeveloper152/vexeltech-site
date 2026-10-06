import { useSyncExternalStore } from 'react';

/* THE FIVE COLOUR SETS OF THE BRANDING DESK (final17, 2026-10-06, the
   founder).
   The five sets of the brand you type (final7), named and widened to the
   five swatches the Branding strip shows: `primary` (the set's A, the
   fills), `deep` (A at 70% over black, the sign's foot and shadows' ink),
   `accent` (the set's B, the accent line), `paper` (bone, #F4EFE6, the
   same in every set) and `ink` (asphalt). The client is whatever name is
   typed (final18); nothing here is a client's palette.

   The active set is one value for the page: the Branding selector sets it
   and the desk reads it. The Marketing report of final18 carries no set
   colour, so only the desk follows it now. */
export const PAPER = '#F4EFE6';
export const INK = '#17181A';
export const SETS = [
  { id: 'navy', name: 'Navy and sand', primary: '#1F2A44', deep: '#161D30', accent: '#EADFC8' },
  { id: 'green', name: 'Pine and mint', primary: '#1E3D2F', deep: '#152B21', accent: '#CFE8D5' },
  { id: 'wine', name: 'Wine and rose', primary: '#5A1F24', deep: '#3F1619', accent: '#F1D9D2' },
  { id: 'coal', name: 'Charcoal and coral', primary: '#232323', deep: '#191919', accent: '#F26B4F' },
  { id: 'slate', name: 'Slate and ice', primary: '#2E3A4A', deep: '#202934', accent: '#CFE3F2' },
].map((s) => ({ ...s, paper: PAPER, ink: INK }));

let current = 0;
const subs = new Set();
export function setBrandSet(i) {
  current = i;
  subs.forEach((f) => f());
}
const subscribe = (f) => {
  subs.add(f);
  return () => subs.delete(f);
};
export function useBrandSet() {
  const i = useSyncExternalStore(subscribe, () => current, () => 0);
  return [i, SETS[i]];
}

/* The set as CSS variables, for a stage's root. */
export const setVars = (s) => ({
  '--hd-primary': s.primary,
  '--hd-deep': s.deep,
  '--hd-accent': s.accent,
  '--hd-paper': s.paper,
  '--hd-ink': s.ink,
});

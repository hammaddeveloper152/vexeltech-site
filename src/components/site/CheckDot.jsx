import React from 'react';
import { IconCheck } from './Icons.jsx';

/* THE CHECK DOT, 2026-09-25 (the founder's life pass 3): every What you get
   list's tick, site-wide (/services, the /pricing columns). A 20px machine
   yellow disc with the set's check inside at 12px in asphalt (the
   three-colour pass; it was the discipline's colour). Decorative: the item
   says the thing. */
export default function CheckDot() {
  return (
    <span className="cdot" aria-hidden="true">
      <IconCheck className="i cdot__i" />
    </span>
  );
}

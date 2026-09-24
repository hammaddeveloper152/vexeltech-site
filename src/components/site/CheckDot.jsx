import React from 'react';
import { IconCheck } from './Icons.jsx';

/* THE CHECK DOT, 2026-09-25 (the founder's life pass 3): every What you get
   list's tick, site-wide (/services, the /pricing columns). A 20px disc in
   the discipline's colour with the set's check inside at 12px, white on
   coral and mint, asphalt on yellow and lilac. The list's container sets
   the colour and the ink (`--disc`, `--disc-ink`). Decorative: the item
   says the thing. */
export default function CheckDot() {
  return (
    <span className="cdot" aria-hidden="true">
      <IconCheck className="i cdot__i" />
    </span>
  );
}

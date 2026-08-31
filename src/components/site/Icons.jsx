import React from 'react';
import { IconContext } from '@phosphor-icons/react';
import './Icons.css';

/* The icon system. DESIGN.md Iconography owns the rules; this file is the one
   place they are applied.

   WEIGHT is set here and nowhere else. Phosphor takes weight as a prop, so
   every call site is an opportunity for it to drift, and a set that is bold in
   eight sections and regular in the ninth is not a system. Passing it through
   context means a component cannot choose.

   Bold rather than regular, and not as a matter of taste. Phosphor draws on a
   256 unit grid: regular is a 16 unit stroke, 6.25% of the box, which at the
   16px small station renders exactly 1.00px. DESIGN.md Shapes reserves 1px for
   the hairline, the edge whose whole job is to separate two things without
   being looked at. An icon is the thing being looked at. Bold is 24 units,
   9.38%, which lands at 1.50px small and 2.25px medium: above the divider,
   below the 3px drawn stroke that belongs to the process route.

   fill and duotone are out. A filled icon is a plane and competes with the
   mark; duotone puts two tones inside one object, which is the gradient
   argument wearing a different hat.

   SIZE is not set here. It comes from the station classes in Icons.css, so an
   icon can never carry a literal pixel size at a call site, the same way a
   component can never carry a literal hex.

   COLOUR is not set here either. Phosphor defaults to currentColor, which is
   the whole point: an icon takes the text token of whatever it sits in and is
   therefore correct on both grounds without a dark and a light variant. */
const ICON_DEFAULTS = { weight: 'bold' };

export default function IconProvider({ children }) {
  return <IconContext.Provider value={ICON_DEFAULTS}>{children}</IconContext.Provider>;
}

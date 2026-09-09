import React, { useState } from 'react';

/* THE TWO SITUATIONS, as plates that straighten.

   Content answer 1.2 gives two situations rather than two audiences, and each
   one already carried a detail line explaining it. On the old page both sat at
   the end of the people list, which made a situation a peer of "Startups" —
   one is who you are and the other is what is happening to you.

   ---- Three lines, and only one of them is conditional -------------------

   The TITLE names the situation. The DETAIL says what it feels like from the
   inside, and it is on the plate at rest — a plate that says nothing until it
   is touched is a plate a reader has no reason to touch. The REVEAL is the
   answer, and it is the only line that waits: "First thing we fix", then the
   thing. That ordering is the argument. A reader who never presses anything
   still reads two true sentences about their own situation.

   ---- The mechanic --------------------------------------------------------

   Transform and opacity only. At rest the plate is tilted 1.5 degrees; open,
   it rotates to zero AND lifts 4px, both on one transform over 250ms on the
   reveal curve. The reveal line is ALWAYS in the flow — reserved, not
   revealed — so nothing below it moves, and the two plates are equal height
   whether either is open or not.

   `open` is state, set by pointer enter and leave and toggled by click, so a
   tap does what a hover does and a second tap undoes it. That is the shape
   BUILD-LAW's hover gating asks for: the affordance is gated to real pointers
   in CSS, and the STATE is available to both, so a touch cannot leave a
   hover stuck on. */

function Plate({ title, detail, fix, side }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      className="plate"
      data-side={side}
      data-open={open ? 'true' : 'false'}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
    >
      {/* The marker is the plate's left EDGE now, drawn in CSS — see
          `.plate::after`. A square before the first word was a bullet, and a
          bullet in front of a two-line title is a list marker on something
          that is not a list. */}
      <span className="plate__title">{title}</span>
      <span className="plate__detail">{detail}</span>
      <span className="plate__reveal">
        <span className="plate__reveal-lead">First thing we fix: </span>
        {fix}
      </span>
    </button>
  );
}

export default function AboutPlates() {
  return (
    <div className="plates">
      <Plate
        side="left"
        title="Spending on marketing and not getting the leads"
        detail="The budget goes out every month and the work does not come back"
        fix="the ad spend goes to a page that converts before another dollar goes to ads."
      />
      <Plate
        side="right"
        title="No online presence at all"
        detail="Nothing for the search that should have found you to find."
        fix="a finished site on your own domain within the week, then search."
      />
    </div>
  );
}

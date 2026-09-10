import { useCallback } from 'react';

/* THE SECOND HOVER DEVICE: light follows the pointer, the object rises to meet
   it.

   The first is the About plate's straighten-on-press. This one is not a state
   change — nothing opens, nothing is revealed, and there is nothing to undo.
   It is the object acknowledging where the reader is, which is what a lit
   surface would actually do if the light were in the room.

   ---- What this sets, and why the units are what they are ----------------

   `--mx` and `--my` are the pointer's position as PERCENTAGES of the plate,
   which is how the mechanic reads and how the tilt is derived. `--pw` and
   `--ph` are the plate's size in px, and they exist because the light cannot
   be positioned from the percentages alone.

   A CSS `background-position` percentage does not mean "this far across the
   box". It aligns the image's own p% with the container's p%, so for a fixed
   400px gradient layer the centre only lands under the cursor at 50% and
   drifts everywhere else. Percentages cannot track a pointer. The stylesheet
   therefore computes `--mx / 100 * --pw` and offsets by half the layer, which
   does land the centre exactly under the cursor — and `--mx` stays the
   percentage the device is described in.

   ---- Gating ------------------------------------------------------------

   `pointerType === 'mouse'`. The CSS is gated as well, behind
   `(hover: hover) and (pointer: fine)`, and both are needed: the media query
   stops a touch device painting the hover state, and this stops a stylus or a
   touch-emulating pointer writing coordinates that no query would then clear.

   On touch nothing here runs. The lights stay at their stations, the object
   does not rise, and the tap navigates. */
export default function usePointerLight() {
  const onPointerMove = useCallback((e) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    el.style.setProperty('--mx', String(Math.round(((e.clientX - r.left) / r.width) * 1000) / 10));
    el.style.setProperty('--my', String(Math.round(((e.clientY - r.top) / r.height) * 1000) / 10));
    el.style.setProperty('--pw', `${Math.round(r.width)}px`);
    el.style.setProperty('--ph', `${Math.round(r.height)}px`);
    el.dataset.lit = 'true';
  }, []);

  const onPointerLeave = useCallback((e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    /* `data-lit` goes and the custom properties stay. Clearing them here would
       snap the light to the corner and then transition it back out on the same
       frame; leaving them lets the CSS return both lights to their stations
       over 400ms from wherever they actually were. */
    delete e.currentTarget.dataset.lit;
  }, []);

  return { onPointerMove, onPointerLeave };
}

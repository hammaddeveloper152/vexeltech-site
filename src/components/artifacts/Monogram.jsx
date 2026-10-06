import React from 'react';

/* THE CLIENT'S MARK, BUILT FROM ITS NAME (final18, 2026-10-06, the
   founder). The first letters of the name's first two words, both in the
   display face at 0.9em, the second overlapping the first by 20% of its
   width, in no container, with one 2px rule beneath. It replaced the drawn
   H and D of final17, which is deleted.

   A "word" here starts with a letter or a digit, so "Harbor & Vale" gives
   H and V, not H and &. A one-word name gives one letter.

   `size` is the mark's font size in px. The rule is the set's primary
   (--mg-rule, default --hd-primary); a surface filled with the primary
   sets it to the accent, where a primary rule would not show. The letters
   take `currentColor`. Decorative: the surface it sits on carries the
   name. */
export function lettersOf(name) {
  return (name || '')
    .trim()
    .split(/\s+/)
    .filter((w) => /^[\p{L}\p{N}]/u.test(w))
    .slice(0, 2)
    .map((w) => [...w][0].toUpperCase());
}

export default function Monogram({ name, size = 40, className = '', style }) {
  const [a, b] = lettersOf(name);
  return (
    <span className={`mg${className ? ` ${className}` : ''}`} style={{ fontSize: size, ...style }} aria-hidden="true">
      <span className="mg__l">{a}</span>
      {b ? <span className="mg__l mg__l--2">{b}</span> : null}
    </span>
  );
}

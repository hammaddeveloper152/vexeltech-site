import React, { useEffect, useRef, useState } from 'react';

/* A 300ms CROSSFADE BETWEEN TWO RENDERS (final17, 2026-10-06): when `value`
   changes, the old render lies over the new one and fades out by opacity
   alone, then leaves the tree. Colour never animates. The fading copy is
   aria-hidden and takes no pointer. `render(value)` must draw the same box
   at any value. */
export const FADE = 300;
export default function Crossfade({ value, render, className = '' }) {
  const [prev, setPrev] = useState(null);
  const last = useRef(value);
  useEffect(() => {
    if (last.current === value) return undefined;
    setPrev({ v: last.current, k: Date.now() });
    last.current = value;
    const id = setTimeout(() => setPrev(null), FADE);
    return () => clearTimeout(id);
  }, [value]);
  return (
    <div className={`xf${className ? ` ${className}` : ''}`}>
      {render(value)}
      {prev ? (
        <div className="xf__old" key={prev.k} aria-hidden="true">
          {render(prev.v)}
        </div>
      ) : null}
    </div>
  );
}

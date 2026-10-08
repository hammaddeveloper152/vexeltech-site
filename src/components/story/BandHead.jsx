import React from 'react';
import './band-head.css';

/* THE BAND'S HEADER ROW (FINAL41, part 3, 2026-10-08, the founder): the
   Branding and Websites bands on /services carry the Marketing band's side
   in its type and spacing: an eyebrow, a statement with one word in
   yellow, a paragraph and three mono lines. Over the full-width desk and
   phones (the founder's answer, since neither fits beside a 340px column)
   it is a header row from 1024: the eyebrow and the statement in
   Marketing's 340px column, the paragraph (62ch at most) and the mono lines
   in a second column at Marketing's 40px gap. Below 1024 it stacks as
   Marketing's side does. The artifact stands under it, unchanged. On the
   cream band the yellow word takes the yellow ink (5.09:1; yellow itself
   is 1.66:1 on cream). */
export default function BandHead({ eyebrow, before, word, after, paragraph, lines }) {
  return (
    <div className="bh">
      <div className="bh__l">
        <p className="bh__eyebrow">{eyebrow}</p>
        <p className="bh__head">
          {before}
          <em>{word}</em>
          {after}
        </p>
      </div>
      <div className="bh__r">
        <p className="bh__p">{paragraph}</p>
        <p className="bh__lines">
          {lines.map((l, i) => (
            <React.Fragment key={l}>
              {i ? <br /> : null}
              {l}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}

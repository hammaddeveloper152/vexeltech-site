import React from "react";
import "./story.css";

/* WHERE WE COME FROM, AS TYPE (the founder's six fixes, 2026-10-02). The
   isometric scenes, their tiles and their generator are deleted. One
   measured column, at most 760px, on the content column's left edge: three
   paragraphs in the display face at 26px / 1.35 in asphalt, each under its
   own mono 11px label in deep amber (4.82:1 on cream), 40px apart, a 1px
   rule above the first and below the last.

   The words are VEXELTECH-COPY.md V3.1's, About, Where we come from.

   THE FINAL ARTIFACTS PASS (2026-10-03, the founder): the three stories
   are joined into one paragraph at 22px, at most 560px, every sentence
   kept in order; the labels (01 The ads, 02 The build, 03 The whole thing)
   came off with the list.

   FINAL7 (2026-10-03, the founder): no image. The November capture and the
   browser frame are deleted. The paragraph is 26px in the display face, at
   most 640px, under one mono 11px line in deep amber, "2023, 2025, 2026"
   (4.82:1 on cream). The years are the founder's.

   FINAL PASS 2 (2026-10-03): the year rail is deleted. The paragraphs stand
   in a left column at most 560px wide; the right column holds the first
   thing we ran, the November 2025 Google Ads capture, in the plain browser
   frame (BUILD-LAW rule 0, as amended), with the founder's caption in mono
   11px steel (7.2:1 on cream). Below 1024 the frame sits under the
   paragraphs. The capture appears on this page only. */
/* FOUR BEATS, final28 (2026-10-07, the founder). The paragraph of COPY V4
   is replaced by four beats in the founder's words: a pull line in the
   display face at 32px (26 below 600), then one or two sentences at 17px,
   32px apart, a 1px rule at 14% between them. Behind each pull line its
   numeral, 01 to 04, in the display face at 160px (96 below 600) at 6%,
   on the left and clipped to the beat's box. A real sequence, so the
   numerals carry order.

   ON CREAM, NOT ON DARK. The section is About's cream band; the brief's
   bone (about 1.1:1 here) is the dark ground's ink, so the pull lines, the
   rule and the numerals take asphalt, its cream counterpart (15.75:1), and
   the bodies the brief's steel (7.20:1).

   AT REST. The brief's entrance, the pull lines rising 8px and fading in
   at half in view, is raised and not built: BUILD-LAW Motion, "an entrance
   never hides content", allows no opacity start below 1. */
const BEATS = [
  ['We started in paid media.', 'Google and Meta campaigns for small businesses, month after month.'],
  ['Good ads, lost on bad pages.', 'People clicked and left. Calls rang out while the owner was on a job.'],
  ['So we built the pages.', 'Then the whole site. Then the follow-up that runs after the call.'],
  [
    'By 2026 that had become VexelTech.',
    "Branding, websites, marketing and automation from one team, at flat prices, for businesses that can't carry four vendors and shouldn't have to.",
  ],
];

export default function OriginStory() {
  return (
    <section className="vt st-sec st--light os" aria-labelledby="os-h">
      <div className="st-in">
        <h2 className="st-h" id="os-h">
          Why we exist
        </h2>
        <ol className="os__beats">
          {BEATS.map(([pull, body], i) => (
            /* The numeral is the beat's ::before (story.css): a picture,
               not text, so nothing reads or measures it as copy. */
            <li className="os__beat" key={pull} data-n={String(i + 1).padStart(2, '0')}>
              <p className="os__pull">{pull}</p>
              <p className="os__body">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

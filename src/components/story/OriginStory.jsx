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
const STORY =
  "We started as a paid media team running Google and Meta campaigns for small businesses. Most of the spend died on the page after the click. So we built the pages, then the whole site, then the follow-up that runs after the call. VexelTech, 2026. Branding, website, marketing and automation from one team at flat prices, for businesses that can't carry four vendors.";

export default function OriginStory() {
  return (
    <section className="vt st-sec st--light os" aria-labelledby="os-h">
      <div className="st-in">
        <h2 className="st-h" id="os-h">
          Where we come from
        </h2>
        <p className="os__k">2023, 2025, 2026</p>
        <p className="os__p">{STORY}</p>
      </div>
    </section>
  );
}

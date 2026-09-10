# .measure — the measurement harness

Not part of the build. **Tracked in git**, deliberately, and the reason is a
rule in `BUILD-LAW.md`: *tooling we wrote is committed; only third-party clones
are ignored.* The test that rule sets is **could someone re-derive this from
the document alone?** For the impeccable detector, yes — the clone command is
in the document. For a script implementing a threshold, a window and a freeze
that the documents describe only in prose, no.

That test is why the split below is where it is:

| | Tracked | Why |
|---|---|---|
| `*.mjs`, this README | **yes** | we wrote them, and recorded numbers cite them |
| `evidence/` | **yes** | frames of shapes whose code no longer exists, so no re-run brings them back |
| `out/`, and every other `*.png` and `*.json` | **no** | 41 MB that a committed script regenerates on demand, and a stale sweep from three builds ago must never be mistaken for a current measurement |

`.measure/.gitignore` holds those rules and is the only place they live. The
repository root deliberately says nothing about this directory: two ignore
rules in two files is how they drift.

**Half of this directory was tracked and half was not, which is worse than
neither.** Sixteen files were committed in two earlier passes and twenty-two
were not, so `git ls-files .measure` looked healthy while the scripts behind
the most recent numbers sat outside it. BUILD-LAW records gitignored tooling
disappearing as a repeated failure here — the detector vanished from the build
machine once and step 9 reported nothing rather than reporting a failure, and
the site repo went a whole build with no ignore rule at all — and a directory
that is half tracked is the same hazard with a smaller symptom. A harness that
produced recorded numbers is part of the record: if it is gone, the numbers
cannot be reproduced and the rules they support cannot be checked.

## Dependencies — one command, and it must be one command

Puppeteer and pngjs are installed **unsaved**, so `npm install` removes them
and nothing says so. Reinstall both in a single command; two `--no-save`
installs run separately will uninstall each other:

    npm install --no-save --no-audit --no-fund puppeteer@25.9.0 pngjs

## Serving

Two entries, two ports, and they are not interchangeable.

**The section harness**, for anything about the home page's sections. `vite
build` alone only builds `index.html`, which is the site; this builds
`hero-preview.html`, which renders the section tree directly with no router in
front of it:

    npx vite build --config .measure/vite.measure.config.js
    npx vite preview --config .measure/vite.measure.config.js --port 4178 --strictPort

**The site itself**, for anything about routes, transitions or page weight:

    npx vite build
    npx vite preview --port 4179 --strictPort

Run every script from the repo root.

## What each script proves

Grouped by the claim it supports, because a script's value here is the recorded
statement it backs rather than the file it writes.

### The identity's geometry

| Script | What it proves |
|---|---|
| `markgeom.mjs` | **Every angle in the mark, from the shipped path.** This is the script that found `DESIGN.md` naming the wrong arm: the record said "the mark's angle, 52.8 degrees, the long arm's 44 across and 58 up", and the long arm is 66.27° outer and 62.59° inner while 52.8 is the SHORT arm's outer edge at 51.93. It also derives the transition's cut and the hero line's `47/60` travel constant, so the shapes cannot drift from the logo. **DESIGN.md's angle table cites this file; if it goes, the correction cannot be re-derived.** |
| `wordmark.mjs` | the lockup's painted area against the frame, which is what the wordmark's exemption from the accent count rests on |

### The accent, and the two rules about where it is measured

| Script | What it proves |
|---|---|
| `lib.mjs` | the threshold itself: the anti-alias solve at `a >= 0.5`, residual 32, the four grounds, the eleven frames and their carriers. Everything below imports it |
| `window.mjs <W> <H>` | every carrier's painted area in the settled window |
| `sweep.mjs <W> <H>` | painted accent per section at every 100px of scroll (`STEP=` to change) |
| `report.mjs <W>` | reads a sweep and prints seams and areas |
| `seams.mjs <W> <H>` | **one accent per frame is per VIEWPORT, not per section** — the carrier bands and the seam arithmetic behind that rule |
| `refine.mjs <W> <H> '[["A","B",lo,hi]]' <step>` | the exact seam range and worst frame, with a screenshot |
| `ink.mjs` | painted ink of a carrier against the others at the same step |
| `pageaccent.mjs` | the same walk across all eight pages rather than the home page alone |
| `final.mjs` | **run this after any change to where the accent lands.** Walks every element on the page and lists the ones computing to `#F0B323`, plus reduced motion and dead overrides |

### The two page-wide devices

| Script | What it proves |
|---|---|
| `entrance.mjs` | **the hero entrance, frozen frame by frame.** Asserts the composite travel is 51.93° before it writes a frame, so the words cannot arrive on a path the line does not describe. Carries two traps it fell into: `getAnimations()` drops a finished `backwards`-fill animation, so a pause installed after load reaches nothing; and at document-start there is no `documentElement` to inject into yet |
| `wipe.mjs` | **the page transition.** Frames, the share of the frame that is machine yellow at the instant the route swaps, the delay the destination waits, and first-load LCP with the component in the bundle. Also carries the false-positive write-up: a stale DOM node held across a navigation reproduces the exact signature of BUILD-LAW's cached-document defect |

### Layout, type and the container budget

| Script | What it proves |
|---|---|
| `barbudget.mjs` | the header's content box against its four fixed costs — the test that found the call sitting 23px past its own edge for the whole build |
| `barframes.mjs`, `barsteps.mjs` | the bar at each width, and each candidate type step in it |
| `phrase.mjs`, `phrase2.mjs` | the rotating phrase's measured em widths, which is what the display clamp is solved against |
| `herov.mjs` | the hero's vertical budget: call and note above the fold at every width |
| `plates.mjs` | the work plates' painted boxes at every breakpoint — the source for the video asset spec |
| `workgrid.mjs` | the grid's three plate states, and that each fills its box |
| `quotes.mjs` | the testimonial slot against its longest quote |
| `slots.mjs` | every empty asset slot and its reserved ratio |
| `heroink.mjs` | the hero's text against the lit surface, off painted pixels, over ten frames — the DOM cannot see a sibling canvas, so every pair on a surface is measured this way |
| `surface.mjs` | the surface's own distribution at a named mount (`surface.mjs hero`, `surface.mjs about`): peak luminance, the share under 3%, **the share resting in the olive band**, and where the brightest decile sits on the ramp. The band figure is the one that matters — DESIGN.md bans it as a resting value, and this is what proves the transfer curve's knee skips it |
| `about.mjs` | the About page: the heading block's two values against the surface at both widths, then a full-page capture with one plate held open |
| `warm.mjs` | **the warm surfaces, and every text value that lands on one.** Where surface-warm and warm-raised actually paint, what sits on them and at what ratio, and whether steel-dark is on a surface anywhere — it is the ground's secondary value, 4.57:1 on surface-warm and 4.13:1 on warm-raised, and banned above the ground. Opens every plate and the lead card first, because a hover state does not exist in a resting DOM |
| `carrier.mjs` | **machine yellow as a share of the frame, off painted pixels.** The DOM walk in `pageaccent.mjs` cannot see a pseudo-element, a gradient stop or a canvas, and the plate's left bar, the corner glow and the work numerals are all three. Reports two numbers per frame — the share of the frame and the share of the objects' own surface — and intersects each object box with its clipping ancestors, which is what stopped the services rail reading 10.7% carrier from ground the card does not paint |
| `warmshots.mjs` | the three frames the warm surfaces changed, captured at 1280 |
| `rig.mjs [width]` | **is the lighting rig actually anchored to the viewport?** There is no WebKit here, so it proves the rig does not DEPEND on `background-attachment: fixed` — the property iOS Safari ignores or mis-sizes: absent from the built CSS, identical readings at every scroll depth, and identical again with every attachment on the page forced to `scroll`. It hides all content first, because the first version sampled five points of which four were the sticky bar or the hero canvas and reported the rig as moving when the canvas was |
| `grounds2.mjs` | **every section on the site and what it paints.** The audit that has to come before a lighting rig: what colour each section lays down, how many gradient layers it carries, whether it draws an edge. It found 41 of 41 sections painting a ground and 18 carrying their own copy of the same two blooms — including three pages covering their own rig with their own sections |
| `seams2.mjs [width]` | **a labelled contact sheet of every section seam.** Each join cropped as a 220px strip, named with the two sections and the document Y, ticked on the seam itself, plus the value 12px either side printed — because "the same" is a number, not an impression. The sheet is composed in the browser rather than blitted here: there is no text rasteriser in this harness, and the first version produced nine anonymous strips with the names stranded in the console |
| `procshot.mjs` | the process route drawn to step 02 at both widths. It scans for the scroll where exactly two steps are lit, starting **above** the section's own top — the route's trigger fires at `top 70%` of the step list, so a scan that starts at the section top finds three lit and never two |
| `hovershot.mjs` | the hover device: a still with the cursor on a plate, and a **5 second webm** of the pointer crossing one. The webm is recorded IN THE PAGE — `page.screencast()` shells out to `ffmpeg`, which is not installed here, so Chrome records itself with `getDisplayMedia({preferCurrentTab:true})` under `--auto-accept-this-tab-capture` and MediaRecorder encodes VP9. No install, and the frames are the browser's own composited output rather than stills stitched together |
| `seamwalk.mjs [width]` | **the accent frame by frame across a run of sections.** The carrier rule is per FRAME, and two sections that each pass on their own can put a solid call and a full-bleed field in one viewport at the seam between them. Reports the yellow share, the largest CONTIGUOUS region, and the element that owns it — a field is a shape, not a share, and the blob is attributed rather than thresholded, because the first version separated a call from a field by area alone and reported the hero's own call as a field |
| `lights.mjs` | **the two-light model at all four corners of every object.** Two corners say how strong each light is and nothing about whether the object reads as lit from one direction — the off-axis corners are the control, and a light that has reached them is a wash. Reports chroma AND luminance, because the two lights spend different currencies: warm white carries 51 points of red over blue against arc's 176 of blue over red, so comparing their chroma understates the key by 3.5x whatever the alpha |
| `svcshots.mjs` | the Services page at both widths, with plate 02 **frozen at half its rotation** — the straighten is a CSS transition, `getAnimations()` returns it as a `CSSTransition`, and the seek finds the half-tilt frame by bisecting the timeline rather than assuming it is the halfway point. On `--ease-reveal` it is not: 125ms of 250ms is already 0.19 of 1.5 degrees. It freezes that one animation and nothing else, for the reason BUILD-LAW records twice |
| `dead.mjs` | **did a deleted rule ever match anything?** Loads every route at both widths, opens every conditional surface first so a state-only rule cannot hide, and counts elements carrying the class. A deletion can only change a painted pixel if something matched the selector, so this is the proof that stands in for a before-and-after screenshot when the removed code was dead. Written for the `.tier*` removal; the selector at the top is the thing to edit for the next one |

### Pages, routes and weight

| Script | What it proves |
|---|---|
| `routes.mjs` | every route resolves, and the count of document responses a click produces — the measurement that settled the cached-document defect |
| `reachable.mjs` | nothing is orphaned: every destination is reachable from the bar or the footer |
| `pageshots.mjs`, `pagesv2.mjs`, `shots.mjs` | page and section captures at the recorded widths |
| `pageweight.mjs` | bytes per route, and **that the rebuilt routes make zero third-party requests** |
| `transfer.mjs` | page transfer and largest paint, five runs, from Resource Timing |
| `legacyaudit.mjs` | what each legacy page actually published — the audit that took ten of them off the router |
| `scope-legacy.mjs` | the PostCSS pass that rewrote 1,500 legacy selectors to require `.lg`, zero dropped |

### Copy and access

| Script | What it proves |
|---|---|
| `contrast.mjs [url]` | **every PAINTED text pair on a page, not every declared one.** Reads each text element's computed colour, walks UP for the first ancestor that actually paints a background, composites the alphas, and measures against 4.5:1 or 3:1 by size. This is the gap the impeccable detector cannot see: it reads declared CSS pairs, and a ground set on a section three levels above the text is not a declared pair with it. Written for the agency register, where five grounds replaced one and every inherited colour had to be re-checked; it found a 128px figure painting machine yellow on machine yellow at 1:1 |
| `a11y.mjs <W> <H>` | landmark, skip link, tab order, process titles, the strip's pause control |
| `checkcopy.mjs` | no em or en dashes and no exclamation marks in shipped output |
| `rules.mjs` | painted separators per page — the count that went 160 to 82 |

## The traps, in one place

Every one of these produced a passing measurement that was wrong. They are
written up where they bit, and listed here so a new script can be checked
against them before it is trusted.

1. **`getAnimations()` drops finished `backwards`-fill animations.** Pause at
   document-start, never after load. `entrance.mjs`.
2. **At document-start `document.documentElement` may not exist.** An injected
   script that assumes it throws where nothing surfaces it. `entrance.mjs`.
3. **Freezing animations does not freeze the wall clock.** React timers and
   `setInterval` keep running, so a "frozen" frame can show state from
   hundreds of milliseconds later. `wipe.mjs` drops timers over 200ms;
   `entrance.mjs` pins the ticker.
4. **Seeking every animation to the same time settles nothing.** Seek the
   thing under test; push everything else to its end, or the page under the
   overlay is in a state no reader would see. `wipe.mjs`.
5. **A DOM node held across a navigation is detached, and a click on it
   reaches no React handler** — so the browser follows the `href` and the
   trace reads exactly like a cached-document bug. Re-query, or reload.
   `wipe.mjs`, and `BUILD-LAW.md` next to the real defect.
6. **`overflow: hidden` is not reliable across a compositing boundary.** Use
   `clip-path: inset(0)` and screenshot anything that masks moving content; a
   correct box measurement is not evidence the pixels are right.
7. **Measure with greyscale antialiasing, never subpixel**, or a colour
   classifier counts red and blue glyph fringes and you are measuring the
   renderer rather than the page.

## evidence/

Frames of four shapes that were built, measured, rejected, and whose code has
since been deleted. They are tracked because they are the only thing that
cannot be regenerated — every other picture under `out/` comes back by running
a committed script, and these do not.

| File | What it shows |
|---|---|
| `rejected-wipe-sweep-1280.png` | the page transition as a single V driving across. A chevron cannot cover a frame wider than its arms span, so full cover needed a 340-unit horizontal smear, and the smear puts the two arm edges on opposite sides of the object: what crosses the frame is the mark's corner, not the chevron |
| `rejected-wipe-strike-1280.png` | the transition as a V drawn from its vertex and held. The most legible of the three as the mark, and rejected on two measured costs: a 247ms hold on every route change, buying 14.0% cover at 1280 |
| `rejected-entrance-punch-1280.png` | the hero entrance punching each word up through its own line box. Masked, so the visible travel is one line-height whatever the amplitude says |
| `rejected-entrance-sweep-1280.png` | the same, in sequence along the diagonal at an 18ms stagger |

`DESIGN.md` carries what each one measured and why it was not taken.

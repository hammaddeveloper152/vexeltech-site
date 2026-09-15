---
name: vexel-register
description: Build or change any section of the VexelTech site inside its recorded system — the loud register, the three faces and their jobs, the scale derived from the hero, asphalt and one machine-yellow accent per frame, the motion identity, the anti-defaults, and the measurement discipline. Use before building, restyling or auditing any section, component or page on this project. It is the WHAT; DESIGN.md and BUILD-LAW.md remain the WHY and outrank this file wherever they differ.
user-invocable: true
argument-hint: "[section or component] [build|restyle|audit]"
---

# The VexelTech register

This skill exists so a new section is built in the system without re-reading
three documents. It is a compression, not a replacement: **`BUILD-LAW.md`
outranks `DESIGN.md`, and both outrank this file.** When this file and a
recorded document disagree, the document is right and this file is stale —
say so and fix this file.

Nothing about VexelTech may be invented. Copy, figures, names, prices, contact
details: if it is not given, it is a placeholder that says it is a placeholder.

## 1. Three faces, three jobs — never two on one element

| Face | Token | Job | Weight | Case |
|---|---|---|---|---|
| **Monigue** | `--font-loud` | **shouts**: the hero, every section heading, every statement, every figure and numeral | 400, static | uppercase, always |
| **Clash Display** | `--font-brand` | **controls, only controls**: calls, buttons, the questions a reader presses | 600 | sentence case from the copy, never a transform |
| **Satoshi** | `--font-offer` | **reading**: body, sub, quotes, the first-person statement, labels | 400 body, 500 label | labels uppercase at 0.12em |

Clash is not a statement face and not a heading face any more. A quote is
read, so it is Satoshi. A statement shouts, so it is Monigue.

Monigue's hhea and typo metrics disagree by 6%: **every use sets
`line-height` explicitly** (`--t-loud-line`, 0.9; the hero uses 0.88).
Never `normal`.

## 2. The scale, derived from the hero

Every loud size is the hero's own measure — `(100vw - 2 * var(--inset))` —
divided by a fixed number. The page scales as one thing.

| Step | Token | Derivation | Floor / ceiling | 1280 |
|---|---|---|---|---|
| Display | in `Hero.css` | measure / 6.227 (the spot's widest two-line half, 6.102em, over 0.98) | none | 185px |
| Figure | `--t-loud-fig` | measure / 9 | 64 / 128 | 128px |
| Heading | `--t-loud-h` | measure / 12.12 | 48 / 96 | 95px |
| Statement | `--t-loud-s` | measure / 20 | 40 / 58 | 58px |
| Small loud | `--t-loud-small` | measure / 32 | 27 / 36 | 36px |
| Quote | `--t-quote-size(-lg)` | fixed | | 40 / 58px, Satoshi |
| Control | `--t-h2` / `--t-h3` / body | fixed | | 40 / 27 / 18px, Clash |
| Body / small / label | `--t-body` / `--t-small` / `--t-label` | fixed | | 18 / 14 / 12px |

`--inset` is 16 / 40 / 64px at 390 / 768 / 1024 and is the only value the
hero and the scale share. **The hero is the only fluid thing with no floor
and no ceiling.** Do not add a size. If a step is missing, it is missing on
purpose: three things of nearly equal size is a composition that has not
decided.

Calls step with the frame: body on a phone, h3 from 768, h2 from 1280 —
because a call at h2 painted 18% of a phone frame with its label wrapped.

**The bar's call is 18px (body), decided 2026-09-08, and it is a COMPOSITION
decision, not a width one.** Every step from 12 to 40 fits its budget now
that the navigation carries real labels (call budget 296.98px at 1024, call
118.25px, 178.73px of slack). It was judged on frames holding the bar and the
hero's call together: at 12px it lost to the uppercase nav links beside it,
at 27px it read as a peer of the hero's call (29% of its area at 1024). Type
step only — still button-secondary, transparent, square, sentence case.

## 3. Ground and the one accent

- **Asphalt everywhere.** `--c-asphalt` is the ground of every section. No
  light sections: on a loud page a light section out-shouts the accent.
  Relief comes from a panel inverting (the FAQ's open row), never a section.
- **Machine yellow is the only accent, and it is five variables, not one:**
  `--c-accent-text-dark` (type on asphalt, 9.46:1), `--c-accent-text-light`
  (deep amber, type on light), `--c-accent-ground` (**a fill: the one primary
  call per frame, nothing else**), `--c-accent-draw-dark` / `-light`
  (strokes). Never reference `--c-machine-yellow` from a component.
- **One yellow per frame, at scale, under 5% of the surface it sits on,
  measured on painted colour.** Name the carrier in the section's CSS, let it
  carry at scale, and take every other yellow in that frame out. A 3px
  stroke is hairline, not a carrier. The sticky bar's wordmark (chevron and
  dot) is the identity's yellow, not a carrier, and is exempt from the count
  by definition; the bar's own call is white for that reason.
- **A frame is a VIEWPORT, not a section, and this is APPLIED.** Two
  neighbouring sections each holding a carrier put two yellows on one screen
  for the whole seam between them, and one gives its colour up. Five seams
  were found and all five are resolved: **zero frames on the page hold two
  carriers**, walked at 390 and 1280 by painted pixel.
  **Five carriers survive on eleven frames** — the hero's call, the services
  discipline names, the counter row's lead figure, the FAQ heading, the
  footer's submit. **Six frames spend nothing**: failures, the strip, work grid,
  about, testimonials, process. The strip is the strike ticker since
  2026-09-15: its 3px yellow strikes are exempt from the count as a ticker. One per frame is a ceiling, not a quota.
  **That six is more than half the page and it is a live question**, not a
  settled state: nobody chose to halve the accent, it fell out of a pairwise
  rule. See DESIGN.md.
  When a carrier is added, moved or resized, walk every seam again. The
  arithmetic is `max(topA,topB) - min(bottomA,bottomB) < H`; a pinned or
  progressively lit section has no fixed band so it is walked by pixel.
- **The measurement window is settled: the carrying section's area INSIDE
  ONE VIEWPORT, at the position where the section is fully populated.** Not
  the whole viewport (a 82px strip would carry any amount of yellow), not the
  section's full height (area that scrolled off never reached the eye). A
  section shorter than the viewport is measured against its own area, which
  is why every short-section number stands; a taller one against a full
  screen of itself. Take the worst qualifying position, and go to it rather
  than sweeping — a section six pixels shorter than the viewport is fully in
  view for six pixels of scroll and a grid walks over it.
- **The anti-alias threshold: count a pixel at coverage a >= 0.5**, solved by
  projecting it onto the ground-to-accent segment, and reject anything more
  than 32 off that line in 0-255 RGB. Greyscale antialiasing, never subpixel,
  or the harness measures the renderer. One consequence: the disabled footer
  submit at `opacity: 0.4` falls below the threshold and is not counted.
- Text pairs that are already certified on asphalt: white 17.77:1, steel-dark
  5.12:1, yellow 9.46:1, asphalt-on-yellow 9.46:1. On white: asphalt 17.77:1,
  steel 8.12:1, deep amber 5.43:1. Do not put yellow type on white (1.88:1).

## 4. Motion identity — do not touch the tokens outside the hero

- **Transform and opacity only.** `clip-path` and `stroke-dashoffset` are the
  two named exceptions. Nothing animates height, width, top, padding, filter.
- **Curves by role:** reveals `--ease-reveal` `(.23,1,.32,1)`; on-screen
  movement `--ease-move` `(.77,0,.175,1)`; drawers `--ease-drawer`
  `(.32,.72,0,1)`. Never ease-in for UI. Springs only for gestures, bounce
  0.1–0.3, never functional.
- **Durations:** press **160ms, pinned by law** — every pressable element
  gets `:active { transform: scale(.97) }` at 160ms; `--d-drop` 250ms;
  `--d-panel` 400ms; ambient 64 / 88 / 104s; rotation dwell 2.4s a phrase.
- **Two staggers:** `--stagger` 70ms separates things read one at a time;
  `--stagger-sweep` 16ms gives direction to one object made of parts. Pick
  by what the eye does, not by taste.
- **Masks over transformed content use `clip-path: inset(0)`**, with
  `overflow: hidden` kept as the fallback. Overflow alone fails silently
  across a compositing boundary and every measurement will pass while the
  pixels are wrong. Screenshot anything that masks moving content.
- **`animation-fill-mode: backwards`, never `forwards`** on anything inside
  a mask: `forwards` pins a transform and promotes the element for the life
  of the page.
- Hover gated behind `@media (hover: hover) and (pointer: fine)`. Reduced
  motion honoured everywhere: keep opacity, drop transform; ambient motion
  and grain switch off, held at the start of their loop.
- The hero runs on one clock (`data-phase` load → ambient) and its motion is
  scoped. **Superseded 2026-09-14:** the hero is a spot and its clock is the
  film's own `currentTime` — a line per shot, fading up on its cut and out
  200ms before the next; the phase, the strike and the slam tokens are gone.
  The record of what was: the machine variant's `--d-strike` / `--ease-strike` /
  `--stagger-strike` are defined on the hero and exist nowhere else.
- **THE MARK HAS NO SINGLE ANGLE. Never write "the mark's angle" — name the
  edge.** Measured off the shipped path: long arm outer **66.27°**, long arm
  inner 62.59°, short arm inner 59.04°, **short arm outer 51.93°**, tips 19.98°
  and 14.04°. `DESIGN.md` recorded "52.8, the long arm's 44 across and 58 up"
  until 2026-09-09; that figure is the SHORT arm's outer edge to within 0.87°
  and is 14° off the long arm. Derive from `.measure/markgeom.mjs`, never from
  memory.
- **The angle appears in TWO places: the page transition, and the strike
  ticker's line, whose two ends are cut at 51.93°** (added 2026-09-15, briefed
  as "the mark's angle, 52.8"; the user chose the measured edge). The ticker's
  line runs flat through each phrase, because at 51.93° a line cannot cross a
  900px phrase; the angle is in the cut. The hero
  entrance line was the second, and it was **removed on 2026-09-14** with the
  slam it carried: the hero spot's lines fade up 8px over 250ms on the reveal
  curve, and no line is drawn at any cut. Do not add one back without a
  record. Its angle was **51.93°**, the short arm's outer edge, chosen because a
  66° line crosses 323px of a 1280 frame against 575px, and because the words'
  horizontal travel factor is **47/60 = 0.78333** off that edge against 0.4394
  off the long arm's. And the page transition, which cuts along the whole outer
  chevron and so carries both arms at once. Do not add a third.
- **The page transition is the mark at page scale**, and it is the one device
  that repeats. A full-frame yellow plane cut along the outer chevron, halves
  parting, 380ms on `cubic-bezier(.25,.5,.85,.85)`. It holds nothing: the
  destination mounts on the click's own commit, measured at 15ms, and the
  overlay is not in the DOM on first load. A sweep and a strike were built and
  rejected; `DESIGN.md` has both and their numbers. **`?wipe` is gone — there
  is one implementation.**

## 5. Layout

- **No layout family twice on one page.** Families in use: full-bleed type
  hero (a film under it since 2026-09-14), icon columns (Failures, which was
  the hanging-rail ledger), pinned horizontal scroller, horizontal strip,
  asymmetric grid, edge-bleed feature, four-across figure row, single-slot
  rotator, zigzag route, disclosure stack, form column, alternating stack (the
  /services discipline sections, 2026-09-15). A new section takes a
  new family or does not get built. **Icon-and-text columns and a row of
  figures are different families** — the user's amendment to BUILD-LAW,
  2026-09-14; each column of one is read on its own and led by an object, and
  the other is one comparison.
- **A colour band is allowed when objects stand on it; an empty saturated
  field is still banned** (2026-09-14). Two on home: Failures on machine
  yellow (`--c-accent-field`) with four icons, and About on cream (`--c-cream`)
  with the mascot. The pricing tabs and ladder stand on a yellow panel. **A
  ground is not a carrier, and a rendered brand object is not one either**
  (the mascot, the handset, the icons), like the wordmark. Every text value on
  a band is restated for it — asphalt on both, and the focus ring asphalt too.
- Spacing ramp 4 / 8 / 16 / 24 / 40 / 64 / 96 — 32 and 48 are absent on
  purpose. 4px baseline; every fixed line height is a multiple of 4.
- Radius 0 by default, 4 on controls, 8 on containers; calls are square.
  **No shadows, no gradients, no depth in CSS**, ever.
- **SECTIONS ARE SEPARATED BY SPACE, NOT BY STROKES.** A hairline is used
  only where two things would otherwise read as one. The removal test: delete
  the line and look; if nothing merges, it was not doing anything. Applied
  2026-09-08 across all eight pages, **160 painted separators down to 82**.
  What still earns a line: a **surface step** (surface-1 is only 1.07:1
  against asphalt, so the step alone is NOT an edge — this is the one place a
  ground change does not remove the need for a rule), a **transparent
  control**, a **disclosure row**, an **empty slot's frame**, and the
  **sticky bar's own edge**. Drawn marks at `--stroke-drawn` 3px are
  untouched; the process route and failures rail keep theirs. See DESIGN.md,
  "Separation on an all-asphalt page".
- Touch targets 48px minimum, padding counts. Hero fits one screen
  **including the sticky bar** (`100svh` minus the bar's height, derived
  from its tokens).
- Max three eyebrows on a page; card metadata inside a repeating component
  does not count.
- **Internal links are `<Link>`, never `<a href>`.** A plain anchor asks the
  browser for a DOCUMENT, and a URL whose meaning has changed may still have
  a cache entry the browser is entitled to serve — which is how the wordmark
  came to land on the old hero long after the legacy home left the router.
  The measurement that settles it is the count of document responses on a
  click: one means the router handled it, two means a document was fetched.
  `hero-preview.html` supplies its own `BrowserRouter` for this reason.

## 6. Voice — three sentences, not an adjective list

**The reference is three things the founder said**, given 2026-09-09. Full
rule in DESIGN.md **Voice**.

> "A dedicated team on your project, so there's no nuisance when it comes to
> changes, which other agencies are very strict about."

> "When it's live and approved it transfers to your hosting, with all the
> credentials and ownership under your name. You own everything you paid for."

> "We know how hard it is to spend your earnings and get nothing. We build
> long-term partnerships rather than treating a client as an invoice to be
> paid."

**It replaced content answers 12.1 to 12.3 — original, human, expert, easy to
understand, premium — because that list produced copy that satisfied every
adjective and sounded like nobody.** Every string passed and every string
stated a deliverable. An adjective is a property of a sentence; a voice is a
person talking, and a list of properties can be met completely by prose with
no speaker in it.

**The four mechanics all three sentences share, and the actual test:**

1. **"You", about the reader's money.** Your earnings, your hosting, your
   name, your project. Never "the client", never "businesses".
2. **Name the fear out loud.** Spending your earnings and getting nothing.
   Being told a change is out of scope. Being an invoice.
3. **Concrete where the industry is abstract.** Not "you own it" but whose
   hosting and whose credentials. Not "unlimited revisions" but there is no
   nuisance when you ask.
4. **Contrast, and name the other side.** "which other agencies are very
   strict about". The argument is not that we are good; it is that this is
   what usually happens to you and it will not happen here.

**Contractions are in** — there's, it's, don't, isn't. The single largest
difference between prose and a person, and the site had none before this pass.
**Warm, never jokey.** No exclamation, banned anyway.

**Surviving tests:** expertise is specificity, never vocabulary; never argue
on price; the AI tells are structural (three-item lists, "unlock", "elevate",
"seamless", "It's not just X, it's Y", a heading restated by the sentence
under it, the em dash); an unsourced claim is what "scam" sounds like.

**The register is loud; the voice is not.** The shout is the typography's job.

The house line is the user's and is **recorded, not placed**: "Design it,
Build it, Market it, Automate it." (12.4.)

## 7. Anti-defaults — banned by name

Inter, Roboto, Open Sans, system stacks *as the typography* (the `@font-face`
fallbacks are a failure mode, not a choice, and are exempt). Space Grotesk.
Purple / violet gradients, indigo on white, the `#6366F1` family. Uniform
`rounded-2xl` with a soft drop shadow. Evenly distributed palettes. A centred
hero with a three-across icon grid in tinted rounded squares. Scattered
micro-interactions in place of one orchestrated moment. Cream-and-terracotta
serif; broadsheet hairlines; near-black-plus-one-neon *as a template* — this
palette was derived, not picked. The test before any build: what is the one
thing someone will remember? If there is no answer, it has not started.

## 8. How things get decided here — measurement, not taste

- **Derive, then verify.** A size comes from the string against the measure;
  a scrim from the wall's mean luminance; a slide from the ink's slack in its
  mask. Record the number and the method beside the rule.
- **A budget is a limit, not a target.** The value that sits at a ceiling is
  not the right value because it fits.
- **The container-budget test:** content box minus every fixed cost, compared
  to what has to fit. Run it at the narrowest width where the row is fully
  populated. A self-sized container has a budget of zero. The absence of a
  scrollbar proves nothing.
- **Image sets take their ladder from the measured element width at every
  breakpoint, never the viewport.** A tile is widest on a phone. Crop with
  entropy, not centre. AVIF + WebP, no JPEG.
- **Performance is measured on a production build, gzipped, cold cache,
  median of at least four runs.** Single runs are noise; a 450ms difference
  was once variance. Dev-server numbers are meaningless (17 MB of icon
  library unbundled).
- **Screenshots at 390 / 600 / 768 / 1024 / 1280 via `viewport-frames.html`**,
  one row at a time. A `100svh` hero cannot be captured by growing the
  viewport; stitch real frames.
- **Run the detector** (`node impeccable/.qoder/skills/impeccable/scripts/detector/detect-antipatterns.mjs <url> --viewport WxH`).
  It is gitignored and does not survive a clone. Its deliberate overrides
  are recorded in BUILD-LAW; `oversized-h1` at 1280 is one of them. It cannot
  see: type over art, hover states (it is always in the touch state), clip
  failures across compositing layers, or a control past its container's
  budget.
- **Eight audit and critique skills sit beside this file** (`critique-*`,
  `design-token-audit`, `design-qa-checklist`, `readable-measure`). They are copies of the shelf in
  `vexel-tech-site/skills-library/`; the record of what is promoted, the
  edits each copy carries and the in-step check are in that repo's
  `CLAUDE.md`. They critique against generic thresholds — read their
  findings against this file and the two documents, not the other way round.
- **The measurement harness is committed at `.measure/`, not gitignored.**
  Only third-party clones are ignored. It holds the seam walk, the 5% window
  and the anti-alias threshold as running code, and the prose in BUILD-LAW is
  not enough to re-derive them. Puppeteer and pngjs install unsaved, so
  `npm install` removes them silently; the README has the one command that
  reinstalls both.
- **Read a font's `name` table before trialling it.** Licence text at ID 13
  binds regardless of where the file was bought. Conthic was closed on
  exactly this.

## 9. Empty states and content gaps

An empty slot is styled to look decided — hairline frame, ratio label, or a
CSS-counter index — never an icon standing in for a picture and never
invented copy. Every placeholder string says it is a placeholder. The form is
disabled with a visible line until it has an endpoint; a success message is
a claim.

Asset slots: services artefacts **filled** (four generated 1:1 tiles, 1600px
webp, empty alt because they are illustrations and not client work). **A slot
bleed is for objects; a scene is the card** (2026-09-15): on home each tile is
the whole 1:1 card with the copy on a shade that holds under it then fades; on
/services each discipline is a full section with its tile at 45% beside the
name, sides alternating, 4:3, above the name below 1024. The 404 carries the
mark render, `vmark.webp`, 1200px shown at 480. About (third version): all six sections, no images; the hero is the
site's SECOND display use (the home hero's clamp), and the pricing band's
$700 figure at 200px is its object. A route drawn in code and a typographic
figure both count as a band's object. A mascot
band, a framed exhibit and a plain image-beside-text split are three different
families by amendment; wall tiles 16:10 (unmounted). Social (2026-09-16): six rendered platform
tile FACES (no reflection), an Iconography exception, 48px in the footer and
56px under Contact's form, 16px apart, 3x2 on a phone. Colours are exempt as
artwork, and the URLs are placeholders (each platform's home page) until the
accounts are supplied. The footer
carries the founder's five pages; the phone and legal lines are hidden until
supplied. **The client slots
are deleted**: the strip is the strike ticker.

**The work plates take video and their spec is MEASURED, not quoted.** Their
ratios change per breakpoint, and the six-plate lists in DESIGN.md and
CLAUDE.md both carry ratio labels that contradict their own pixel numbers. The
live contract is `src/assets/video/README.md`: supply dimensions and a safe
area per plate, per-plate weight ceilings out of the 900 KB, 4 seconds, AV1
webm with an h.264 High mp4, and a WebP poster that is a still from its own
clip. Never re-derive it from a document.

## 10. What is settled, what is open

**Settled:** the loud hero and its derivation; Monigue on every heading;
Clash for controls only; asphalt everywhere; the carrier per frame and the
window it is measured in; the anti-alias threshold; a frame is a viewport;
the tile ladder and its rule; the video capability and its four gates; the
sourcing rule (no faces in photographs, mascots allowed; no legible words in
texture, but text inside generated artwork is its content and allowed, the
Services tiles first; no repeats; no single genre); the
form is not live; four headline devices failed and the line carries none;
the page has one `<main>`, a skip link ahead of the bar's six links, and the
strike ticker keeps the strip's pause control (WCAG 2.2.2); the bar is solid asphalt on every route
EXCEPT over a film or surface hero (home; About was one until its 2026-09-15
rebuilds, and keeps the solid bar), where since 2026-09-15 it is
a gradient (asphalt 85% at its top to 0, walked up from the brief's 55) until 80px of scroll, then the solid
bar with its hairline, 250ms each way, and the hero runs up under it; the video capability is mounted on the work grid, six
plates and six clips, four gates intact.

**THE ROUTE SWAP IS DONE, 2026-09-08.** `/` serves the rebuild.
`src/styles.css` is scoped to `src/styles.legacy.css` by
`.measure/scope-legacy.mjs` — 1,500 selectors, zero dropped, every one
requiring `.lg` — and it is imported by `legacy/LegacyShell.jsx` alone.
Legacy routes are `lazy()`, so the 118 KB legacy stylesheet is its own chunk
and never loads on the rebuild. Measured on a production build: **rebuilt
routes make zero third-party requests; legacy routes make three.** The
webfonts, the `g-wait` class and the three cdnjs scripts came out of
`index.html` and into the legacy tree. `hero-preview.html` is KEPT: the
measurement scripts point at it, and a client-routed page would put the
router in front of every measurement.

**Eight pages exist**, the destinations from 10.1. Home as built; Services,
Pricing and Contact are full pages; About us, Resources, Portfolio and Case
studies are one-screen pages. Everything that is not the homepage is built
from `pages/site/Shell.jsx` and `pages/site/parts.jsx`, and **`vt` goes on
each SECTION, never on a page wrapper** — a shared component moved out of a
`vt` ancestor loses its ground silently and every measurement still passes.

**One carrier per page, and it is the page's single call.** The tier cards on
`/pricing` take button-secondary for exactly this reason: twelve yellow
grounds down one page was one-accent-per-frame broken twelve times.

**Every price is a token in `src/content/pricing.js` and they are all
`null`.** No figure renders anywhere on the site until the conflict is
settled; the slot draws a hairline frame reading FIGURE PENDING at the
figure's own height, so nothing moves when the numbers land.

**Open:** the global motion register (the strike is gone with the hero spot,
2026-09-14); whether the machine variant ships; the figure role's wording;
**whether six silent frames on eleven is too quiet**; the six clips and posters,
and whether the 900 KB clip budget rises so the loops can run 6s rather than 4s.
**The work grid's Branding tags share every work frame with the plates' yellow
numerals** — counted as carriers by the user's decision, reported 2026-09-14,
decision open. **The hero spot fell back to the shader once at 390** under the
measurement harness and never reproduced; `.measure/spotwalk.mjs` logs every
media event so a repeat names its cause.

**Settled 2026-09-14:** the hero is a spot (film, four lines fading up on their
cuts, the final line staying, the copy plate's scrim walked to 70%); a colour
band with objects on it is allowed (yellow Failures with four icons, cream
About with the mascot, a yellow panel under the pricing ladder); grounds and
rendered brand objects are not carriers; the mascot is `character.png`.

**THE PRICE IS SETTLED, 2026-09-08: $700 for a website, ONE tier**, carrying
the custom feature list. Branding $299 / $449, bundle **$999** for a $150
saving against $1,149 of parts. **No FIGURE PENDING slot remains on the
site.** A derived figure does not go stale, it goes wrong: the sheet's
$1,299 bundle would have been dearer than buying separately once the website
moved to $700, so the saving, the parts and their total are all computed by
`bundleSaving()` and none of the four is ever typed. Every figure is a token in `src/content/pricing.js`; the
budget bands derive from them. **The turnaround is four business days** and
"within weeks" is used nowhere. **The email is info@vexeltechsolutions.com.**
All four decisions are recorded in DESIGN.md under "Settled by the user".

**A URL is kept only while what it says is true.** Ten legacy pages are off
the router on that rule: five superseded duplicates, the four sub-service
pages (each carried a price contradicting the sheet) and `/industries`
(unsourced percentages). Sub-service URLs redirect to `/services` and its
discipline blocks; `/industries` 404s.

**Copy landed 2026-09-08**, from the content answers and the pricing sheet:
the twelve sub-services, the four process steps, three of the four FAQ
answers, two of the four failure consequences, the header's four navigation
labels and its call ("Let's Talk", 10.3), and the footer's eight-page site
map. The header's four are a **proposal** and reversible.

**Still placeholder, because the source is blank there:** the numbers (§4),
the work (§5), the testimonials (§6), and contact and footer (§8), plus the
Failures and CounterRow section headings, two failure consequence lines, the
marquee's client names, the About statement, and the fourth FAQ item. The
form's phone field with an IP country code (9.1) is specified and not built;
its cost is reported and the decision is open.

**Withdrawn:** the five-tier scale collapse and the weight ramp. Do not
resurrect them; their surviving findings are already answered by the scale
above.

When any of this changes, change DESIGN.md or BUILD-LAW.md first, then this
file, in the same pass.

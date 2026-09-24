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

## 00. BUILD-LAW 0: the founder supplies, nothing is reused (2026-09-21)

No icon, image, object, texture or visual device appears twice on the site.
Two places that need a visual need two different visuals. When one does not
exist, STOP and ask the founder for it (subject, size, format, background):
never substitute an existing asset, never generate, never leave a
placeholder. Reuse is a defect, not a saving. Check every new glyph against
every route before it ships.

## 0000. THE QUIET PASS (2026-09-24) outranks everything below

DESIGN.md "THE QUIET PASS" is the record. Where anything in this file says
otherwise, this section is right and the rest is history.

- **Monigue: two things only**, the home hero headline and the About
  statement. **Every other heading: Clash Display Medium (500), sentence
  case, normal tracking, bone, `--t-head` (44px at 1280, 32px at 390).**
  Card-level headings: the same face at the h3 step, 27px.
- **Moldie: prices and the route numerals only.**
- **Label: 13px Satoshi, sentence case, steel-lift** (`--t-label-q`); steel on
  cream. No uppercase tracked labels anywhere, the nav included.
- **Body: 16px Satoshi, steel-lift. Headings: bone. Nothing pure white** but
  the home hero headline (and the About statement, as its page's hero).
- **No full-bleed colour.** Cream surfaces are `.panel`: 20px, inside the
  1200 measure, on the dark base, no border, no light. Sections holding one
  are `.panel-sec`; two in a row sit 96px apart. Photographic call bands are
  imagery and stay.
- **Yellow in exactly four places**: the primary button; one highlighted word
  per page (`.hl`: "Yet." home, "phones" About, "need" pricing, "do"
  services); the Plan Builder progress line; the route line. They may share a
  frame (BUILD-LAW, amended). Everything else is bone. The focus ring is bone
  on dark (`--c-focus`), asphalt on cream. The wordmark and the page
  transition keep theirs.
- **Cards: 20px** (`--r-card`). A dark card is flat lit-near, no border,
  nothing else. Cream and white-on-cream cards: no hairline, no light.
- **Section padding `--s-section`: 128px at 1280, 80px at 390.**
- **Motion unchanged.**
- **Buttons (2026-09-24, pricing rebuild): every button is Clash Display
  Medium 14px, 6px radius** (`--t-btn`, `--t-weight-btn`, `--r-btn`), at
  every width. No call steps up with the frame.
- **Later 2026-09-24: Moldie is the home route numerals and the home $700
  only.** Every other price is Clash 400 (56px on /services and the /pricing
  grid). **Every panel and card is 24px** (`--r-card`); buttons and chips 6px.
- **Flesh and Bones pass, 2026-09-24, supersedes the footer and call below**:
  the footer is a full-bleed cream band (city, five pages in Clash 20px
  uppercase, two yellow social circles, the legal line); the closing call is
  one yellow Clash 32px uppercase underlined line on the base, and it is the
  link; home sections carry vertical mono margin labels from 1024.
- **Monolog pass, 2026-09-24**: eyebrows, section labels, table headers and
  form labels are `.lbl` - JetBrains Mono 12px uppercase 0.08em in CSS-drawn
  parentheses. The ticker is a VEXELTECH wordmark band (it starts Lenis on
  home). The footer is two columns: pages in Clash 32px left, (CONTACT) and
  (SOCIALS) right, a 13px base row. `--grain` at 3% on the hero film and
  every cream panel.
- **Contact copy, 2026-09-25**: 05 Budget pills (radios, not required, the
  founder's four bands), message 06, placeholder "Tell us about your
  business and what you need *". The marquee has a pause control (32px face,
  48px target, IconPause/IconPlay). The Who we are tiles are text on colour,
  not a device (BUILD-LAW rule 0), and may stand on home and contact.
- **Contact pass, 2026-09-25**: every field is a LINE FIELD (`LeadForm.jsx`,
  and the Plan Builder's): transparent, 1px line (`--field-line-dark` /
  `--field-line-cream`, 30%), 22px Satoshi, placeholder as label ("Your name
  *"), hidden real label, 12px mono index above (steel-lift on dark, steel on
  cream), focus 2px yellow (plus 1px asphalt under it on cream), error 2px
  red and the message. No boxes, no visible label rows. Submit: yellow pill,
  40% until valid, `aria-disabled`. Contact: marquee h1 150/72 at 60px/s,
  pills (80px radius, yellow when picked, 48px label target), tiles from
  `content/facts.js`.
- **Vertical rhythm, 2026-09-25**: sections pad TOP only (128 dark, 96 in a
  cream sheet), never bottom; last before the footer takes 128 below; grounded
  blocks keep a 96 foot. No gap over 160. Closing call: Clash Medium 56/40
  uppercase yellow + scaled Scribble, subline 18 bone 85% at 24, button at 32,
  128 either side. Lists: hairline rows, 12px padding, 6px `--disc` dot
  (`.lmark`); no check discs. Hero note in the frame's lower-left, 180px peek.
- **Card accents restored, 2026-09-25, supersedes the three-colour pass**:
  black, cream, yellow + coral, mint, lilac ONLY in the discipline cards
  (Branding yellow, Websites lilac, Marketing coral, Automation mint, asphalt
  text), the Who we are tiles, the check dots, the comparison chips/edges and
  the Plan Builder dots. No arc blue anywhere; neutral ground.
- **Three-colour pass, 2026-09-25, supersedes every accent note below**:
  black, cream, machine yellow; white and the steels for text only. NO arc
  blue, coral, mint or lilac anywhere. Ground drift base/#101012/base.
  Discipline cards cream (badges, tilt), tiles cream + one yellow, check
  dots, chips, price bar and Plan Builder dots yellow. About is the light
  page (Shell `light`, light.css): cream ground, black What we do block,
  black footer block.
- **About rebuild, 2026-09-25**: /about-us is text only, four blocks
  (statement with the swash on "phone"; What we do as a cream sheet list;
  the definition; clients and partners) and the footer block with no form
  (Shell `footerForm={false}`). No cards, FAQ, facts or call there.
- **Genesis pass, 2026-09-25**: the highlight is the SWASH (Brush.jsx,
  thickness 'fit', -2deg, the word asphalt once the stroke is drawn), not the
  box; no `.hl`. Loose swashes under What it costs you's intro and off the
  footer block's corner. The footer is an inset cream block ("Let's talk.",
  pulsing yellow dot). Home's hero pins 100vh and grows its framed film to
  the viewport. "Most picked" and the trade chips are yellow.
- **Life pass 3, 2026-09-25**: What you get lists use CheckDot (20px disc in
  the discipline colour, 12px check, white or asphalt on yellow); the $700s
  carry the Brush stroke; no badges on /services heads; What it costs you is
  a 35% head plus a 2 x 2; four Who we are tiles; About has no How we work.
- **Life pass 2, 2026-09-25, supersedes the life pass**: premium, not
  rainbow. Outside the four discipline cards and the Who we are tiles, the
  accents are MARKS AND EDGES only (ticks, crosses, 4px bars and edges,
  dots, chips), never a fill larger than a chip. Number badges (white 56px
  die-cut disc, Clash 20px) replace the stickers and the card index. No
  trade ticker. Send buttons read "Send message" with a sliding arrow.
- **Life pass, 2026-09-25, supersedes below where they differ**: accents
  are yellow, arc blue, coral #F26B3A, mint #2FA37A, lilac #C9A6F5, ONLY on
  the discipline cards and stickers, the trade ticker pills, the Who we are
  tiles, the Plan Builder dots, the "Most picked" chip and the scribble;
  never a ground, body text or a non-primary button. Cards: yellow / blue /
  coral / mint, asphalt text except white on blue, tilt -2/+2, sticker top
  right. The closing call's underline is a drawn scribble.
- **Launch batch, 2026-09-25: the final design pass, only defects after
  it.** One drift on `html` (base, arc-black, base), no section paints a
  ground. Cream bands are sheets (40px top corners, -40px over the section
  before, upward shadow). Marginalia.jsx builds static gutter labels on
  every page from 1024: steel-lift on dark, deep amber on cream, never
  yellow; How it works keeps its own route line. Cards:
  art centred, objects inside 112 x 112 by the binding side, feet on one
  baseline, equal yellow and blue. No mascot.
- **Energy and consistency pass, 2026-09-24, supersedes below where they
  differ**: body on dark is bone 85% (`--c-body-dark`), steel-lift only for
  captions under 14px and disabled; arc blue #0D47BD only in illustrations
  and Plan Builder dots; hairlines on dark 14%; labels have NO brackets. The
  four discipline cards are the cream variant (the one cream-card exception).
  One field / card / button, two grounds: fields dark 4% + 22% edge, cream
  white + 15% edge, focus yellow (plus a 1px asphalt ring on cream). Primary
  is always yellow, "Get a custom quote"; secondary "Ask a question". Dark
  sections 128, cream bands 96. Pixel is a no-op without VITE_META_PIXEL_ID.
- **Icon and card system, 2026-09-24, supersedes anything below that names
  Phosphor or a card fill**: every icon comes from `components/site/Icons.jsx`
  (20px box, 1.75px stroke, round caps and joins, currentColor); Phosphor is
  uninstalled. No glyph in the set means no icon. THE CARD is white 4% fill,
  a 10% border, 6% and 18% on hover by overlay fade; not on cream. The
  illustrations float with no plate, 124 of 140px. Three footer socials.
- **THE CARD v2 (quiet), 2026-09-24, supersedes the card bullets below**:
  no artwork, content height, 48px chip, 27px title, 14px line with a bold
  lead, 32px padding, four across from 1024. What it costs you is one cream
  panel of four numbered rows. The cost objects are out of the build.
- **Live walk (2026-09-24)**: card artwork 130% wide, bleeding, 2px at
  36% over a bone glow; cream panels 32px radius (`--r-panel`) with
  `--p-panel` padding; pricing columns lift onto a white plane with the
  site's one shadow (the founder's); chips 8px. Cost objects 180px tall.
- **Card, second pass (2026-09-24)**: artwork 32% / 48% hover, top 65%,
  fewer larger elements; fade 45% to 80%; chip 48 / icon 22; title 30;
  padding 28; linked cards rise 4px. `image` mode puts a cost object in the
  top 65% (in flow; the card may grow past 3:4). What it costs you is four
  of them. No object stands on the page ground.
- **Plan Builder is one cream panel** with the ticket as its right column
  behind a 1px asphalt-15% hairline; the pricing grid's columns lift 2px on
  hover. Colour changes on hover are overlays that fade in, never animated
  colour.
- **THE ONE CARD (2026-09-24)**: `components/site/ArtCard.jsx`. 3:4, 24px,
  lit-near, 1px white 10%, a drawn SVG artwork per discipline fading out by
  75%, chip + Clash 400 28px name + a 16px line (first sentence bone 500).
  Hover on linked cards only, opacity-only. No yellow. Home's What we do and
  About's lessons (both four across at 1280, on the base) use it; build any new card from it (DESIGN.md "THE CARD").
- **/pricing** (DESIGN.md "THE PRICING PAGE, REBUILT ON THE MELIUS
  PATTERN"): headline Clash 400 at 56px, grid names Clash 400 at 32px, grid
  prices Clash 400 at 56px (not Moldie, on this grid only). The grid's
  recommended column (Websites) adds a **fifth yellow place**: its 2px top
  edge and "Most picked" chip.

## 000. The founder's restructure (2026-09-22) outranks what follows

Asphalt is retired as a GROUND: the base is #0B0B0D (`--c-base`) and the
drift runs base to arc-black; asphalt stays as ink on yellow and cream.

**THE ARTWORK IS CLOSED, later the same day. `cost-1` to `cost-4.webp` and
the mascot are the ONLY artwork on the site, and there are no other image
slots.** Every slot that was standing empty is deleted with its reserved
layout, because a reservation for a file that is not coming is not a
reservation, it is a hole: `route-1` to `route-5.webp` off the route,
`promise.webp` and `promise-about.webp` off the two bands, `plan-1` to
`plan-5.webp` off the Plan Builder, and `pricing-banner.webp` and
`about-banner.webp` with the `Banner` component itself. **NO BANNERS
ANYWHERE**; `Banner.jsx` and `banner.css` are deleted, not left unimported.
`Slot.jsx` stays, and its rule is unchanged for the slots that remain.

**THE MASCOT HAS THREE PLACEMENTS AND ALL THREE ARE ON HOME:** P1 on the
cream Who we are band (`character.webp`, as built); `character-desk.webp` at
route stop 03, **mounted**, 320px, floating 6px, right of the stop and
opposite the drawn line; and P2 at the left of the footer form
(`character-2.webp`, empty until its file exists). It supersedes the
two-appearances-site-wide placement of 2026-09-21: the footer form is on
every route, so P2 still appears on every route, and the two home placements
are new.

**THE DESK POSE IS CUT BY A MODEL, NOT BY A THRESHOLD** (`.measure/deskcut.py`,
committed). `objcut.mjs` floods in from the edge through pixels that are light
and nearly neutral, and DESIGN.md records it failing on exactly this render:
the white sneakers touch the white ground with no darker edge, so the flood
walks into the shoes and they come out transparent, reading as black shoes on
the base. **A threshold cannot separate a white object from a white ground**,
because there is nothing in the values to separate. rembg's
`isnet-general-use` with alpha matting decides by what the thing is. Two
steps follow it and both are needed on a white ground: **un-premultiply**
(`F = (C - (1-a)*255)/a`, which takes out the pale halo every partly
transparent pixel still carries), then **smooth the alpha contour alone** (a
1.1px blur on the channel, then a smoothstep back through 0.5 — blurring the
composite would soften the object; this only moves where the edge falls).
Checked on the base at the real 320px mount: sneakers and laptop edge both
intact, no halo. 640px webp, 62.8 KB, 2x for the 320px mount and no more.

**Home.** `cost-1` to `cost-4.webp` beside What it costs you. What we do
stays the storyboard's four icon cards (the word tiles are on the "what comes
off the site" list). The route's five stops carry their **Moldie numeral at
96px in MACHINE YELLOW**, flat at every width, beside the title: the numeral
is the stop's object now the image slots are gone, and it no longer lifts
from steel to white on arrival, because it is the accent already. The line
still draws on scroll and a reached dot still lights. **The promise band's
object is the $700 in Monigue at 240px**, up from 200; the 30vw cap still
binds first on a phone.

**Pricing.** The head ("What do you need?") runs straight into THE PLAN
BUILDER; the banner between them is gone. The SECTION still has no ground of
its own (the drift lands on arc-black #0E1220 at the builder's top and holds;
arc #0D47BD is the rim light only; no pin), then the burst call. **THE
BUILDER HAS A BODY:** one lit-near panel (#1E1F22, hairline, 12px, the two
lights, 48px of inner padding at 1280 and 24px at 390) standing on that
drift, with the answer cards lit-raised (#2B2D31) and their own hairline.
**Nothing in it is translucent and no surface is under opacity 1** — the
cards' 6% white veil and 45% white border are solid values now, and the
hairlines carry `--lit-edge` as painted (#303134 on the panel, #3C3E41 on a
card). The progress line runs along the panel's top inner edge. The 720px
minimum height is withdrawn: the section is its content plus 96px. Step 3's
card grid is `align-items: start`. **The cream ticket mounts from STEP 1 in
its empty state** — WORK ORDER, one line "Your plan starts here." in steel
(7.20:1 on cream), and no total strip until a priced line exists — so the
panel has something opposite it on every step instead of 40% of bare ground
until the first answer. The trade line is Moldie and would otherwise render
as an empty paragraph holding its own height, which is a reservation rather
than a state. The 390 sticky bar still waits for the first answer: a 64px bar
across the bottom of a phone saying nothing is a cost the desktop column does
not pay. On a lit surface **steel-dark is banned**
(it is the ground's value), so the progress hairline and the disabled Next
take steel-lift, 6.33:1. THE PLAN BUILDER EXCEPTION is unchanged: its yellow
is the progress line, the selected card's border, the total and the one
primary button ("Send this plan to us"); nothing else on /pricing is yellow
except the burst call's own button. Next is a white outline and the helper is
bone (both chosen on the old arc ground and kept); on the cream ticket the
stage line is steel. Its glyphs are used nowhere else on the site; its Check
may repeat inside it. It posts the Netlify form "plan" declared in
index.html.

**About.** The page opens on its **statement in Monigue at the DISPLAY step**
— the same derived step, measure / 6.227, 185px at 1280, not a second size —
with a **48px machine yellow rule** under it at the drawn 3px weight, then
the paragraph, then What we do. **The cream hero is gone**, and it went for
the rule: yellow on cream is 1.66:1, which DESIGN.md calls a rumour of a
line, so the user took the ground off rather than the colour off the rule.
The hero stands on the base at 10.47:1. The "How we work" call came off with
it. Cream still appears once on the site, on home's Who we are band. CaretDown
on the standards and the spotlight call stay.

## 0000. The founder's six fixes (2026-09-22) outrank section 000 above

1. **What it costs you is four ALTERNATING two-column bands**: the object at
   280px one side, the statement and its line the other, left / right / left /
   right. They were 96px, which is an icon station, and that is what made the
   artwork read as icons. Files re-encoded at 560px (`costprep.mjs 560`);
   screen blend stays.
2. **What we do is four CREAM cards**: #F4F1EA, asphalt ink, 12px, Phosphor
   icon 32px asphalt, Moldie name 40px, items Satoshi in steel (7.20:1).
   **No rim light on cream** - the key alone, the ticket's own rule: two
   lights are a DARK-surface model. Hover fills yellow with asphalt ink, as
   before. 32px is a literal, off the 16 / 24 / 64 icon ramp.
3. **THE MASCOT IS OFF THE ROUTE. The route is numerals and the line only.**
   At 320px it was 504px tall against ~100px of copy and left a ~380px hole
   between stops 03 and 04. **Two placements, both home: Who we are, and Get
   in touch** - right of the form, 360px, BOTTOM-ALIGNED so the desk legs land
   on the row's bottom edge, which is his floor. `Character.jsx` and
   `character.css` are deleted; P1 is a plain `<img>` and P2 is gone.
4. **The Plan Builder panel is CREAM.** Asphalt ink, hairline, 12px. Chips and
   cards **bone** with an asphalt hairline; selected is **asphalt-filled,
   cream text, yellow border**; progress hairline steel-dark, fill yellow;
   **Next asphalt-filled with a cream label**, disabled the same control as an
   asphalt outline. **The ticket inverts to asphalt-faced with cream ink**,
   total strip **yellow with asphalt numerals**; the phone bar and sheet take
   the ticket's face. Still nothing translucent, no surface under opacity 1.
   - **The helper is STEEL, not steel-dark**: 3.08:1 on cream is under the
     4.5 floor and BUILD-LAW is the floor. The user ruled on this exact pair
     once already (the stage line). steel-dark stays on the progress
     hairline, a mark, where the bar is 3:1.
   - **The ticket's edge is steel-dark, not asphalt**: asphalt on arc-black is
     1.17:1, so a border the colour of the face was no border and the card
     dissolved into the drift. An edge is not a text pair; a pair walk will
     not find this.
   - **The focus ring follows its ground**: asphalt on the cream panel (yellow
     is 1.66:1 there), yellow on the asphalt ticket, bar and sheet.
5. **About's "How a project runs" is four counted blocks in one row** (stacked
   below 768): Moldie numeral 01 to 04 at 96px yellow, the clause under it in
   bone. **No drawn line** - the route is home's device and appears once. The
   numerals are `aria-hidden` inside an `<ol>`.
6. **THE FORMS ARE LIVE.** `LIVE = true`, the not-wired line and its style
   gone, Send is the yellow primary at full opacity with **no disabled
   state** (the sending guard stops a double submit). Success copy is
   VEXELTECH-COPY.md's. Footer pages in **two columns** (`grid-auto-flow:
   column`, three rows, so the order reads DOWN). The social row is built and
   **renders nothing** until a real URL is set - pre-flight 5 stands.
   **The wiring was written in this pass**: only "plan" was declared and
   `onSubmit` posted to nothing, so enabling the button alone would have
   shipped a form that reports success and drops every enquiry. A hidden
   static "contact" twin is in `index.html` and the submit POSTs url-encoded
   to "/". **Forms must be enabled on the Netlify side; that cannot be checked
   from here.**

**Measured:** contrast clean on home, /pricing, /about-us and /services at
1280 and 390, **zero failing pairs anywhere** (the disabled Send was the
standing exception and there is no disabled Send). `planpairs.mjs` 110 and 80,
none failing, over four grounds. `carrier.mjs` unchanged row for row: the
route 1.63% / 3.32% against 5%, the cream cards 0.00% at rest.

## 0. The storyboard decides sections, order and placement (2026-09-21)

`VEXELTECH-STORYBOARD.md` in the design repo is the founder's sheet and the
source of every page's sections, their order, their grounds and where every
asset stands. It outranks this file and any earlier record where they differ;
a change goes on the sheet first. DESIGN.md records it and the amendments
made the same day. In short: one card (12px), one route (five stops, yellow
line on dark, asphalt on cream, drawn on scroll), one button pair (yellow
primary, outline secondary), Phosphor icons, and no object but the
character: two appearances, P1 on home's cream band and P2 beside the footer
form on every route (`character-2.webp`, empty until it exists). Since the
same day's corrections: the route is HOME'S DEVICE, once on the site,
vertical (Moldie numerals, lit when reached, the line drawn on scroll and
kept); NO ROUTE HAS A FLAT GROUND: every page drifts (home: lit-near,
asphalt, arc-black #0E1220 through the route, asphalt through the FAQ and
form, arc-black from the footer's pages row; the drift has two colours;
/services arc-black from Automation; About from How it goes; every other page by its footer), the
drift is the second material, glass and the spotlight are retired, and the
footer has no band, overlay or hairline; home's disciplines
are plain columns under a hairline, not cards; the pricing panel wraps its
ladder exactly. Yellow lives in buttons, the route line, the hovered
card and the yellow band only. Where the sections below describe the work
grid, the testimonials, Process, the rendered icons, the handset or the
index rail, that is history.

## 1. Three faces, three jobs — never two on one element

| Face | Token | Job | Weight | Case |
|---|---|---|---|---|
| **Monigue** | `--font-loud` | **the home hero headline and the About statement, nothing else** (quiet pass, 2026-09-24) | 400, static | uppercase, always |
| **Clash Display** | `--font-brand` / `--font-quiet` | **every other heading** at 500, sentence case, bone, `--t-head`; and controls at 600 | 500 headings, 600 controls | sentence case from the copy, never a transform |
| **Satoshi** | `--font-offer` | **reading**: body (16px, steel-lift), sub, quotes, labels (13px, sentence case) | 400 body, 500 label | never uppercase |
| **Moldie** | `--font-name` | **prices and the route numerals only** | 400 | as set |

SUPERSEDED 2026-09-24: Clash is the heading face again, at Medium. The
table above is current; the loud-register reasoning below is history.

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
| Heading (quiet) | `--t-head` | 32px at 390 to 44px at 1280, linear | 32 / 44 | 44px, Clash 500 |
| Body / small / label | `--t-body` / `--t-small` / `--t-label-q` | fixed | | 16 / 14 / 13px |

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

Asset slots: services artefacts **withdrawn 2026-09-21** (the four
generated tiles are deleted; the plates carry icons). **A slot
bleed is for objects; a scene is the card** (2026-09-15): on home each tile is
the whole 1:1 card with the copy on a shade that holds under it then fades; on
/services each discipline is a full section with its tile at 45% beside the
name, sides alternating, 4:3, above the name below 1024. The 404 carries the
mark render, `vmark.webp`, 1200px shown at 480. About (third version): the hero is the cream band again since
2026-09-21, the statement at the heading step left and the mascot right, so
the home hero is the one display use; a "Four disciplines, one team" row of
the home icon plates follows section 2; the pricing band's $700 figure at
200px is its object. The home Services cards are icon plates since
2026-09-21 (64px Phosphor icon, Moldie name, three items) and the four
tiles are deleted. A route drawn in code and a typographic
figure both count as a band's object. A mascot
band, a framed exhibit and a plain image-beside-text split are three different
families by amendment; wall tiles 16:10 (unmounted). The footer (rebuilt
2026-09-16; the form on EVERY route since 2026-09-21): "Get in touch" in
Monigue at the heading step, the form (name, email, company, budget, message,
Send; still offline, `LIVE = false`, and there is NO Netlify Forms wiring on
the rebuilt form), then the email "info@vexeltechsolutions.com" as a bone
Satoshi link with its bone line; a hairline; the five pages in
Satoshi 14px left and Phosphor social logos right at the 24px station
(steel-lift, yellow on hover, and ONLY a platform with a real URL renders;
none do); a hairline; the base at 11px label register ("mono" in a brief means
this) in steel-lift, with the wordmark small left, the address centre, and the
legal line with the year right. The phone and legal lines are hidden until
supplied. Everything stacks on a phone. The stroked V in the footer corner and
the social tiles are gone. **The client slots
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
cuts, the final line staying). **The film is never dimmed edge to edge;
contrast is bought under the copy, not over the picture**: the film covers the
section with no fade, two ZONED shades carry the copy, never a full-frame
plate. The headline zone ramps from 768 up and holds then fades below; the copy
zone holds across the copy then fades over 64px, with its fade-in above the
block. Soft shadows stay. Left edges are walked per width by
`.measure/spotshade.mjs zones`: 55% and 65% on a phone, 85% and 75% from 768
(1280 walked before the bar stood over the hero; 768 to 1023 not walked, both
open). The 70% copy plate is withdrawn; a colour
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

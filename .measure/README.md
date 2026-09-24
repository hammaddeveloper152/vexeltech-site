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

One entry: the site itself, built and served as production.

    npx vite build
    npx vite preview --port 4173 --strictPort

Pass the base URL to scripts that take one; the older ones default to 4179.
`hero-preview.html`, the section harness on 4178, and its build config were
deleted on 2026-09-25 (the founder's repo cleanup).

Run every script from the repo root.

## What each script proves

**Cut to fourteen on 2026-09-25** (the founder's repo cleanup): the scripts
the release audit or a build step runs, the one they import, the two the
build law names as the current method for a live feature, the two the
register skill names for the hero's shade, and the two that record how a
live figure or file was made. The eighty-three others measured features that
are gone or passes that are over; git history holds them, and DESIGN.md
holds what they found.

| Script | What it proves |
|---|---|
| `contrast.mjs [url]` | **every PAINTED text pair on a page, not every declared one**, at 1280 and 390 |
| `fstates.mjs [width]` | every form field state (rest, focus, filled, error, pills, submit) on the contact form, the footer form and the Plan Builder, off painted pixels |
| `release-crawl.mjs` | sideways scroll, every internal link and hash target, every asset response, and each page's head (title, description, canonical, Open Graph, robots) |
| `release-forms.mjs` | both forms end to end: the fields each POST sends against the hidden Netlify declarations in the BUILT `dist/index.html`, UTM tags included |
| `fullpage.mjs [base] [width]` | one full-page frame per route, walked first so every reveal has fired |
| `critical-classes.mjs [base]` | the classes that paint above the fold on home; writes `src/critical-classes.json`, **a build input** (vite.config.js) |
| `brand-assets.mjs` | draws the favicon set and `og.jpg` into `public/` from the mark's path and the wordmark |
| `dead.mjs` | **did a deleted rule ever match anything?** Every route at both widths, every conditional surface opened first |
| `wipe.mjs` | **the page transition**: the share of the frame that is machine yellow at the instant the route changes |
| `spotshade.mjs` | the hero copy's shade zones, walked per width |
| `spotwalk.mjs` | the hero's copy against the film, frame by frame |
| `markgeom.mjs` | **every angle in the mark, from the shipped path** |
| `scope-legacy.mjs` | the PostCSS pass that rewrote 1,500 legacy selectors to require `.lg`, zero dropped |
| `lib.mjs` | the accent threshold (`isAccent`) that `wipe.mjs` and `spotwalk.mjs` import |

## The traps, in one place

Every one of these produced a passing measurement that was wrong. They are
written up where they bit, and listed here so a new script can be checked
against them before it is trusted. (Some scripts named below are deleted; the traps
stand.)

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
| `retired-hero-strike-1280.png` | the shipped hero entrance at 300ms, captured 2026-09-09 while the line was machine yellow: the strike drawn across the frame at 51.93° and the words slamming in along it. It ran at every cut of the hero spot, in white, for a few hours of 2026-09-14 and was removed outright; the spot's lines fade up |

`DESIGN.md` carries what each one measured and why it was not taken.

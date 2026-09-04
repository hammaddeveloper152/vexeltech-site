# .measure — the accent measurement harness

Not part of the build. It is the tooling behind two rules recorded in
`BUILD-LAW.md` (`vexel-tech-site/BUILD-LAW.md`), and it is here so the next
pass does not rebuild it:

- **One accent per frame is per VIEWPORT, not per section** — the seam walk.
- **The window the 5% ceiling is measured in**, with the anti-alias threshold.

Puppeteer and pngjs are installed **unsaved**, so `npm install` removes them
and nothing says so. Reinstall both in one command; two `--no-save` installs
run separately will uninstall each other:

    npm install --no-save --no-audit --no-fund puppeteer@25.9.0 pngjs

Build the rebuilt page as its own entry and serve it. `vite build` alone only
builds `index.html`, which is the legacy tree:

    npx vite build --config .measure/vite.measure.config.js
    npx vite preview --config .measure/vite.measure.config.js --port 4178 --strictPort

Then, from the repo root:

| Script | What it does |
|---|---|
| `lib.mjs` | the threshold, the ground set, the eleven frames and their carriers |
| `window.mjs <W> <H>` | every carrier's painted area in the settled window |
| `sweep.mjs <W> <H>` | painted accent per section at every 100px of scroll (`STEP=` to change) |
| `report.mjs <W>` | reads a sweep and prints seams and areas |
| `seams.mjs <W> <H>` | carrier bands and the seam arithmetic |
| `refine.mjs <W> <H> '[["A","B",lo,hi]]' <step>` | exact seam range and worst frame, with a screenshot |
| `a11y.mjs <W> <H>` | landmark, skip link, tab order, process titles, the strip's pause control |
| `ink.mjs` | painted ink of a carrier against the others at the same step |
| `plates.mjs` | the work plates' painted boxes at every breakpoint — the source for the video asset spec |
| `transfer.mjs` | page transfer and largest paint, five runs, from Resource Timing |
| `workgrid.mjs` | the work grid's three plate states, and that each fills its box |
| `final.mjs` | reduced motion, dead overrides, and every element on the page painting machine yellow |

`final.mjs` is the one to run after any change to where the accent lands: it
walks every element on the page and lists the ones computing to `#F0B323`. The
answer should be the wordmark plus exactly the carriers `DESIGN.md` names, and
nothing else.

Measured cold (`setCacheEnabled(false)`) on a production build, after
`document.fonts.ready` plus the fonts-ready ScrollTrigger refresh, with
`--disable-lcd-text` so antialiasing is greyscale rather than subpixel.

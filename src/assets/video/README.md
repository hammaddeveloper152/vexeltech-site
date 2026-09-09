# Work grid video clips

Six plates, six clips. The capability is built and dormant: it lights up when
files appear here and reverts the moment they are removed, with no code change
either way.

It was built for the hero's tile wall. The wall is gone; this is where it
belonged. `Video.jsx` holds the mechanism, `workVideo.js` holds these file
names, `WorkGrid.jsx` mounts them.

## The contract

For each plate, numbered **1 to 6 in grid order**:

| File | Required | What it is |
|---|---|---|
| `work-0N.webp` | **yes** | The poster. A still **from that clip**. |
| `work-0N.webm` | yes, in practice | AV1 (VP9 acceptable). Served first, so the mp4 is never downloaded by a browser that can decode this. |
| `work-0N.mp4` | **yes** | h.264 **High** profile, level 4.0. The universal fallback. |

**The poster is the load-bearing file.** A plate with a poster and no clip
shows the poster, which is a finished state, not a broken one. A plate with a
clip and no poster is **not** video: it would paint bare asphalt until the
video decoded, so it falls back to the hairline empty state as if neither file
were there. A plate with neither keeps the hairline and its index.

**The poster must be a frame of its own clip.** It is what the plate shows
before any video byte is requested, what a refused autoplay leaves on screen,
and what a reduced-motion or Save-Data reader sees instead of the video. If it
were a different picture the grid would show different work depending on
whether the reader got motion.

**WebP, not JPEG and not AVIF.** A `poster` attribute is one URL with no
`<picture>` fallback, so the format has to be one every target decodes
unaided. AVIF is not that yet; WebP is, and the tile ladder rule already names
it as the fallback tier. The same file is the `<img src>` in the poster-only
state, so a plate is one still whichever path it takes. (The dormant wall's
`clip-0N` contract still says `.jpg`. It predates the ladder rule and is not
the live one.)

**No audio track at all.** The element is muted and an audio track is weight
that can never be played.

**The loop is seamless.** The clip loops with no crossfade.

**The sourcing rule applies** (`BUILD-LAW.md`): no human faces, no legible
words. These plates are the work, so a screen or a poster inside the shot is
the likely way text gets in.

## Dimensions

**Measured off the rendered plates, not quoted from a document.** Both
`DESIGN.md` and `CLAUDE.md` carry a plate list whose ratio labels and pixel
numbers contradict each other, so neither was usable. These are the painted
boxes at every breakpoint the grid has:

| Plate | 390 | 768 | 1024 | 1280 | 1600+ |
|---|---|---|---|---|---|
| 1 | 358×269 `4:3` | 688×430 `16:10` | 589×368 `16:10` | 760×475 | 792×495 |
| 2 | 358×224 `16:10` | 332×332 `1:1` | 283×283 `1:1` | 368×368 | 384×384 |
| 3 | 358×224 `16:10` | 332×332 `1:1` | 436×327 `4:3` | 564×423 | 588×441 |
| 4 | 358×224 `16:10` | 332×332 `1:1` | 436×327 `4:3` | 564×423 | 588×441 |
| 5 | 358×224 `16:10` | 332×332 `1:1` | 283×283 `1:1` | 368×368 | 384×384 |
| 6 | 358×153 `21:9` | 688×295 `21:9` | 589×253 `21:9` | 760×326 | 792×339 |

The container caps at 1200px, so 1600 is the widest a plate ever paints and
the grid stops growing above about 1288.

**A plate changes ratio between breakpoints and a clip is one file at one
ratio**, so every plate but the sixth is cover-cropped somewhere. The supplied
ratio is the geometric mean of the extremes, which is the ratio that crops
equally at both ends instead of badly at one:

### Supply exactly these

| Plate | Supply | Ratio | Safe area, centred |
|---|---|---|---|
| 1 | **792 × 542** | 1.461 | **91%** of width and height |
| 2 | **486 × 386** | 1.259 | **79%** |
| 3 | **588 × 466** | 1.262 | **79%** |
| 4 | **588 × 466** | 1.262 | **79%** |
| 5 | **486 × 386** | 1.259 | **79%** |
| 6 | **792 × 340** | 2.329 | **100%** |

**Safe area is the promise.** Anything outside the centred percentage above is
cropped away at one breakpoint or another. Plates 2 to 5 run from a 1:1 box on
a tablet to a 16:10 box on a phone, which is the widest ratio swing on the
page, and 21% is what that costs on each axis. Frame the subject inside it.

Even numbers throughout: h.264 and VP9 both need even dimensions for chroma
subsampling.

**1x, not 2x.** The dormant wall spec said 2x, and it could afford it because
a wall tile paints about 200px wide. A work plate paints up to 792px, and 2x
there is four times the pixels against a budget that is already tight. A clip
upscaled on a high-density screen is acceptable for slow, low-contrast
footage; it would not be for anything with an edge in it, which is another
reason the sourcing rule's ban on legible words matters here.

## Weight, and the honest arithmetic

**900 KB for all six clips together**, per `DESIGN.md`. Allocated by painted
area at 1280 rather than split six ways, because plate 1 paints 2.7 times what
plate 2 does and needs the bits:

| Plate | Share | Clip ceiling | Poster ceiling |
|---|---|---|---|
| 1 | 26.6% | **240 KB** | 60 KB |
| 2 | 10.0% | **90 KB** | 28 KB |
| 3 | 17.6% | **158 KB** | 40 KB |
| 4 | 17.6% | **158 KB** | 40 KB |
| 5 | 10.0% | **90 KB** | 28 KB |
| 6 | 18.3% | **164 KB** | 40 KB |
| | | **900 KB** | **236 KB** |

The `.webm` and the `.mp4` are alternates, not additions: a reader downloads
one of the two, so the ceiling is per file and not per pair. Both must clear
it.

### Duration: 4 seconds, and here is why it is not 6

The clip ceilings above, divided across a duration, give a bitrate. At the
supplied dimensions:

| Plate | Pixels | At 4s | Bits per pixel per second |
|---|---|---|---|
| 1 | 429k | 492 kbit/s | 1.15 |
| 2, 5 | 188k | 184 kbit/s | 0.98 |
| 3, 4 | 274k | 324 kbit/s | 1.18 |
| 6 | 269k | 336 kbit/s | 1.25 |

**About 1 bit per pixel per second.** Ordinary web video runs 2 to 4. One is
workable only for genuinely slow footage: a locked-off camera, a slow pan, a
surface moving gently. It is not enough for a hand-held shot, a cut, or
anything with fast detail, and AV1 rather than VP9 is what makes it hold at
all.

**Six seconds at the same quality needs about 1.35 MB, not 900 KB.** That is a
budget decision, not an encoding one, and it is the user's. Four seconds is
what the recorded budget actually buys.

## Where the budget came from, and why it is easier now

`DESIGN.md` subordinates the 900 KB to a harder rule: the hero's total
transfer must not rise. That was written when the clips were in the hero,
competing with 2.6 MB of tile photographs for a largest paint that ran to
6.27s on a throttled phone.

The hero carries no photography now, and the clips are not in it. The work
grid is below the fold, reveals on scroll, and requests nothing until a plate
is on screen. So video no longer competes for the largest paint at all, rather
than being gated away from it.

**Measured, production build, cold cache, 1280, median of five runs:** the
page transfers **229 KB** and its largest paint is **680 ms**. Of that, 126 KB
is script, 94 KB is the three webfonts and 8 KB is CSS. **Zero bytes of
image.** The figure `DESIGN.md` recorded before the wall came out was 2,872 KB
with a largest paint of 6.27s at 390 on Slow 4G.

So the headroom is about **2.64 MB**, and 900 KB of clips plus 236 KB of
posters spends 1.14 MB of it. Funded out of the image budget with room, which
is what the rule asks, rather than argued down to fit.

Re-measure on a production build with a cold cache once files land, median of
at least five runs. Single runs are noise on this page: an earlier 450 ms
"difference" on this build turned out to be variance.

## The four gates, unchanged

They are in `Video.jsx` and they are why six clips on one screen is
affordable:

1. **`preload="none"`** — nothing is fetched until `play()` is called.
2. **IntersectionObserver at 0.25** — only a plate actually on screen asks.
3. **The section's reveal** — nothing asks until the work grid has entered.
   This replaces the hero's ambient phase, which was the gate on the wall.
4. **Refusal outright** under reduced motion, Save-Data, `saveData`, or an
   effective connection of 3g or worse.

Play requires **intersecting AND the document visible**. Observer callbacks
are throttled and may not run at all in a backgrounded tab, so a plate that
was on screen when the tab was hidden would otherwise go on decoding into a
tab nobody is looking at. **Verify this with the window focused**: a headless
or backgrounded check reports a plate paused and calls it correct for the
wrong reason.

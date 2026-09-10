/* bandgap.mjs — the space either side of every band, measured object to edge.

   THE RULE IS NOT ABOUT PADDING, IT IS ABOUT OBJECTS. "96px at 1280, 64px at
   390" is the distance from the last thing the previous section actually PAINTS
   to the band's top edge, and from the band's bottom edge to the first thing
   the next section paints. A section's padding is one contributor to that and
   an empty wrapper, a collapsed margin or a reveal that has not fired are
   others, so declared values cannot answer it.

   So the neighbours' last and first painted descendants are found by geometry:
   the deepest element with a real box whose bottom is furthest down (or whose
   top is furthest up), skipping anything with no size and anything positioned
   out of flow, which is how a decorative pseudo-holder would otherwise be
   mistaken for the last object.
*/
import puppeteer from 'puppeteer';

const TARGET = { 1280: 96, 390: 64 };

const b = await puppeteer.launch({ headless: 'new',
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb'] });

const ROUTES = ['/', '/services', '/pricing', '/about-us'];
let bad = 0;

for (const [W, H] of [[1280, 900], [390, 844]]) {
  console.log(`\n=== ${W}, target ${TARGET[W]}px ===`);
  console.log('  route        band            above                    gap      below                    gap');
  for (const route of ROUTES) {
    const p = await b.newPage();
    await p.setViewport({ width: W, height: H });
    await p.goto('http://localhost:4179' + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 2200));
    /* every reveal fired, and every band marked near so nothing is mid-arrival */
    await p.evaluate(() => document.querySelectorAll('[class*="band-"], .scratched')
      .forEach((e) => { e.dataset.near = 'true'; }));
    const tot = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < tot; y += 400) {
      await p.evaluate((v) => window.scrollTo(0, v), y);
      await new Promise((r) => setTimeout(r, 80));
    }
    await p.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 300));

    const rows = await p.evaluate(() => {
      const Y = (el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + scrollY, bottom: r.bottom + scrollY, w: r.width, h: r.height };
      };
      /* the last / first descendant that actually occupies space in flow */
      const edge = (root, which) => {
        if (!root) return null;
        let best = null;
        for (const el of root.querySelectorAll('*')) {
          const c = getComputedStyle(el);
          if (c.display === 'none' || c.visibility === 'hidden') continue;
          if (+c.opacity < 0.02) continue;

          /* OUT OF FLOW IS NOT OUT OF SIGHT. Skipping every positioned element
             was meant to keep decorative holders out of the answer, and it took
             the hero's WebGL canvas with them — a full-bleed surface that runs
             to the section's own edge. The walk then called the hero's LAST
             OBJECT its body copy, 58px higher up, and reported the seam below
             it as 154px when what a reader sees ends at the section edge.

             A canvas, an image or a video is a painted surface wherever it is
             positioned. Everything else out of flow still comes out. */
          const rootW = root.getBoundingClientRect().width;
          /* AND IT HAS TO BE THE SECTION'S OWN SURFACE, NOT AN ICON.

             Counting every painted element brought the hero's canvas back and a
             24px quote glyph with it: an `<svg>` overhanging its section by
             24px was read as the next section's first object and the seam below
             the marble band reported 72px.

             A painted surface defines a section's edge when it IS the section's
             ground — full bleed, or near enough. Four fifths of the width is
             the line: the hero's canvas is all of it, an icon is a fortieth. */
          const painted = /^(canvas|img|video|svg)$/.test(el.tagName.toLowerCase())
            && el.getBoundingClientRect().width >= rootW * 0.8;
          if (!painted && (c.position === 'absolute' || c.position === 'fixed')) continue;
          if (!painted && /^(svg)$/.test(el.tagName.toLowerCase())) continue;

          /* NOT EVERY BOX IS A PAINTED EDGE, and the first version of this walk
             took three of them at face value.

             INSIDE AN SVG the rect of a `<path>` is its geometry bounding box,
             which has nothing to do with where the icon paints: the quote mark
             on the home page reported a box 11px above its own `<svg>`, inside
             a parent with `overflow: hidden` that was clipping it.

             AN INLINE BOX is the font's ascent-to-descent, not the line box.
             A link at the end of a paragraph reported 14px below the section
             that contains it, because the type is set tighter than 1.

             AND A CLIPPED ELEMENT'S LAYOUT BOX IS NOT ITS SURFACE - already in
             BUILD-LAW, from a services card that reported paint 144px left of
             where it painted. The box is intersected with every clipping
             ancestor before it counts. */
          if (el.parentElement.closest('svg')) continue;
          if (c.display === 'inline') continue;
          let r = Y(el);
          for (let a2 = el.parentElement; a2 && a2 !== root.parentElement; a2 = a2.parentElement) {
            const ac = getComputedStyle(a2);
            if (!/hidden|clip|auto|scroll/.test(ac.overflowY)) continue;
            const ar = Y(a2);
            r = { top: Math.max(r.top, ar.top), bottom: Math.min(r.bottom, ar.bottom), w: r.w, h: r.h };
          }

          /* AN ELEMENT THAT PAINTS NO GROUND CANNOT EXTEND PAST ITS PARENT.

             Two seams were being decided by boxes with nothing in them. The
             services plate list carries `margin-bottom: -4px`, so the LIST's box
             ends four pixels below its own last plate — a layout box, painting
             nothing, four pixels past the last thing a reader can see. And a
             pricing link is an `inline-block` at 18px inside a paragraph set at
             a 28px line: its box hangs 14px below the paragraph, which is the
             font's metrics, not its glyphs.

             So an element with no background, no border and no shadow is
             clamped to its parent's box. Its paint is its text or its children,
             and both are inside. */
          const bare = (getComputedStyle(el).backgroundColor === 'rgba(0, 0, 0, 0)'
            || getComputedStyle(el).backgroundColor === 'transparent')
            && getComputedStyle(el).backgroundImage === 'none'
            && parseFloat(c.borderBottomWidth) === 0 && parseFloat(c.borderTopWidth) === 0
            && c.boxShadow === 'none';
          if (bare && el.parentElement && el.parentElement !== root.parentElement) {
            const pr = Y(el.parentElement);
            r = { top: Math.max(r.top, pr.top), bottom: Math.min(r.bottom, pr.bottom), w: r.w, h: r.h };
          }
          if (r.bottom <= r.top) continue;
          if (r.w < 2 || r.h < 2) continue;
          if (!best) { best = { el, r }; continue; }
          if (which === 'last' ? r.bottom > best.r.bottom : r.top < best.r.top) best = { el, r };
        }
        if (!best) return null;
        const rootR = Y(root);
        return {
          /* An SVG's `className` is an SVGAnimatedString, not a string, so the
             first version printed "[object" for every one of them. */
          cls: (best.el.getAttribute('class') || '').split(' ').filter(Boolean)[0]
               || best.el.tagName.toLowerCase(),
          top: Math.round(best.r.top), bottom: Math.round(best.r.bottom),
          /* how far the object sits inside its own section's box - the part of
             the gap the band's margin cannot see */
          inset: which === 'last'
            ? Math.round(rootR.bottom - best.r.bottom)
            : Math.round(best.r.top - rootR.top),
        };
      };

      const out = [];
      for (const band of document.querySelectorAll('.band, .band-rays')) {
        const r = Y(band);
        const prev = band.previousElementSibling;
        const next = band.nextElementSibling;
        out.push({
          band: (band.className || '').toString().split(' ').find((c) => c.startsWith('band-')) || 'band',
          top: Math.round(r.top), bottom: Math.round(r.bottom),
          above: edge(prev, 'last'),
          below: edge(next, 'first'),
        });
      }
      return out;
    });

    for (const r of rows) {
      const gapA = r.above ? r.top - r.above.bottom : null;
      const gapB = r.below ? r.below.top - r.bottom : null;
      const mark = (g) => (g === null ? '   —' : (Math.abs(g - TARGET[W]) <= 2 ? String(g).padStart(4) : String(g).padStart(4) + ' X'));
      if (gapA !== null && Math.abs(gapA - TARGET[W]) > 2) bad++;
      if (gapB !== null && Math.abs(gapB - TARGET[W]) > 2) bad++;
      const nm = (e) => e ? `${e.cls}${e.inset ? ` (+${e.inset})` : ''}` : 'nothing';
      console.log(
        `  ${route.padEnd(12)} ${r.band.padEnd(15)} ` +
        `${nm(r.above).padEnd(26)} ${mark(gapA).padEnd(8)} ` +
        `${nm(r.below).padEnd(26)} ${mark(gapB)}`
      );
    }
    await p.close();
  }
}
console.log(bad === 0 ? '\nEvery band seam is on the rule.' : `\n${bad} seam(s) off the rule.`);
await b.close();

import puppeteer from 'puppeteer';

export const URL_ = 'http://localhost:4178/hero-preview.html';
export const ACCENT = [240, 179, 35]; // #F0B323 machine yellow

/* Candidate grounds the accent is ever painted over on this page. A pixel is
   classified against whichever of these it lies nearest the line to. */
export const GROUNDS = [
  [23, 24, 26],    // asphalt
  [29, 30, 32],    // surface-1
  [34, 35, 38],    // surface-2
  [255, 255, 255], // shop white (the FAQ open row)
];

/* The anti-alias threshold.

   A glyph edge is a run of pixels part covered by ink. Solve the composite
   p = a*ACCENT + (1-a)*GROUND for the coverage a, against whichever ground
   the pixel is nearest the line to, and count the pixel when a >= 0.5. Half
   covered counts, less than half does not, which is symmetric on a straight
   edge and so neither inflates nor deflates a measured area.

   RESIDUAL is the perpendicular distance from that line, and it is what keeps
   an unrelated colour out: a warm photograph pixel under the hero's scrim can
   sit at a high a on the asphalt-to-yellow line only if it is also ON that
   line, and 32 in 0-255 RGB is tight enough that it is not. */
export const ALPHA = 0.5;
export const RESIDUAL = 32;

export function isAccent(r, g, b) {
  let best = Infinity;
  let bestA = 0;
  for (const G of GROUNDS) {
    const dx = ACCENT[0] - G[0], dy = ACCENT[1] - G[1], dz = ACCENT[2] - G[2];
    const px = r - G[0], py = g - G[1], pz = b - G[2];
    const len2 = dx * dx + dy * dy + dz * dz;
    let a = (px * dx + py * dy + pz * dz) / len2;
    a = Math.max(0, Math.min(1, a));
    const rx = px - a * dx, ry = py - a * dy, rz = pz - a * dz;
    const res = Math.sqrt(rx * rx + ry * ry + rz * rz);
    if (res < best) { best = res; bestA = a; }
  }
  return best <= RESIDUAL && bestA >= ALPHA;
}

/* Count accent pixels in a raw RGBA buffer, optionally clipped to a band of
   rows [y0, y1) — the part of the frame the carrying section occupies. */
export function countAccent(rgba, w, h, y0 = 0, y1 = h) {
  let n = 0;
  const a = Math.max(0, Math.floor(y0));
  const b = Math.min(h, Math.ceil(y1));
  for (let y = a; y < b; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = (y * w + x) * 4;
      if (isAccent(rgba[i], rgba[i + 1], rgba[i + 2])) n += 1;
    }
  }
  return n;
}

export async function open(width, height, { reduced = false } = {}) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--force-device-scale-factor=1',
      '--hide-scrollbars',
      '--font-render-hinting=none',
      /* Greyscale antialiasing, not subpixel. Subpixel AA puts red and blue
         fringes on every white glyph edge, and a classifier that reads colour
         would count some of them. The page asks for greyscale anyway via
         -webkit-font-smoothing; this makes the harness agree. */
      '--disable-lcd-text',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.setCacheEnabled(false); // cold, per BUILD-LAW
  if (reduced) {
    await page.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ]);
  }
  await page.goto(URL_, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1400)); // the fonts-ready refresh
  return { browser, page };
}

export async function scrollTo(page, y) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await new Promise((r) => setTimeout(r, 220));
}

/* The home sections in storyboard order (2026-09-21) and the one element each
   spends its accent on at rest. The work grid, the testimonials and Process
   came off; the counter row is off until its figures exist; the FAQ heading
   went white. A hovered card is the frame's carrier only while the pointer is
   on it, so the rest walk lists Services with no carrier. */
export const FRAMES = [
  { name: 'Hero',         section: '.hero',             carrier: '.hero__cta:not(.hero__cta--line)' },
  { name: 'Failures',     section: '.fail',             carrier: null },
  { name: 'About',        section: '.about',            carrier: null },
  { name: 'Services',     section: '.services',         carrier: null },
  { name: 'Ticker',       section: '.ticker',           carrier: null },
  { name: 'Route',        section: '.route-band',       carrier: '.route' },
  { name: 'Promise',      section: '.promise',          carrier: null },
  { name: 'FAQ',          section: '.faq',              carrier: null },
  { name: 'Footer',       section: '.foot',             carrier: '.foot__submit' },
];

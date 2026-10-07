# Launch gate, local part, 2026-10-07

The founder's pre-launch gate, run on this machine against the production build. Each item is **PASS**, **FAIL** or **NEEDS-FOUNDER**.

**Summary:** 17 pass, 1 fails, 3 need the founder.

| # | Item | Result |
|---|---|---|
| 1 | Terms stamp ink; About's close as the yellow field | PASS |
| 2 | Home costs line | PASS |
| 3 | Reference frames committed; both pushes | PASS |
| 4 | Real 404s, no app.html, client 404 with noindex | PASS (local); live check after upload |
| 5 | One URL per page, one-hop redirects | PASS (local); live check after upload |
| 6 | /thanks and 404 noindex, out of the sitemap | PASS |
| 7 | Security headers, CSP report-only, zero violations | PASS (local); live check after upload |
| 8 | `color-scheme` meta | PASS |
| 9 | Hero pause control | PASS |
| 10 | Film attributes, poster, caught play() | PASS |
| 11 | Skip link, focus, Esc on the menu | PASS |
| 12 | Form labels, errors, autocomplete, honeypot, tel: links | PASS |
| 13 | axe and WAVE on nine routes | axe PASS; **WAVE NEEDS-FOUNDER** |
| 14 | Text spacing, 200% zoom, 320px | PASS (after fixes) |
| 15 | Caching and compression | PASS (local); live check after upload |
| 16 | Mobile LCP and CLS | **FAIL** (LCP); CLS passes |
| 17 | Privacy policy | **NEEDS-FOUNDER** (placeholders, legal review) |
| 18 | Footer and terms entity; pricing currency and tax | PASS as built; the placeholders are item 17's list |
| 19 | The line under the submit | PASS |
| 20 | Content grep, years, prices | PASS |
| 21 | Plausible behind a flag | PASS (one gap, below) |

## How it was tested

- **No Apache on this machine.** `.measure/serve-dist.mjs` serves `dist` by reading `htaccess-append.txt` itself:
  - every RewriteCond and RewriteRule, in order, with their flags and back-references
  - `ErrorDocument 404`, `DirectoryIndex` and `DirectorySlash Off`
  - every `Header always set` line
  - the caching blocks
  - brotli, then gzip, for the listed types only

  So the curl tests run against the real file. **The scheme and host are simulated**: a request counts as HTTPS unless it sends `X-Forwarded-Proto: http`, and the host is the `Host` header.
- **Hostinger's own server** (LiteSpeed or Apache, with the rules already in its `.htaccess`) can only be tested after upload. That is the live run of the smoke script below, and it is marked as a live check in the table.
- **The scripts, all in the site repo:**
  - `.measure/audit/smoke.sh` (curl)
  - `.measure/launch-gate.mjs` (browser: CSP, keyboard, axe, text spacing, reflow, the 404 view, the menu, the pause control)
  - `.measure/prices.mjs`, `.measure/anchors.mjs` and `.measure/copytext.mjs`
  - `.measure/lcp-trace.mjs`
- **Outputs:** `.measure/out/launch-gate/`.

## The items

### 1. PASS
- **The stamp:** the Terms stamp's ring, ring text and mark are the Branding ink, `--c-yellow-ink` #865f08, at 85%.
- **About's close** is home's yellow field: heading, line and button. `AboutClose.jsx` and its sheet are deleted, with the pricing link, the promise line and the three facts.
- **The anchor check** (`anchors.mjs`, 390): PASS on /, /services, /pricing and /about-us. About failed before this pass.

### 2. PASS
The line under the cost row reads "Industry figures."

### 3. PASS
- **Committed:** `reference/final-frames/` in the design repo (703547d), the D, D2, D3 and M frames. M had appeared since the last pass.
- **Pushed:** both repos, final28 included. The 500s of the last pass did not recur.

### 4. PASS locally; live check after upload
- **No fallback:** `app.html` is no longer built, and the prerender deletes any leftover.
- **The .htaccess:** the SPA fallback rule is gone. `ErrorDocument 404 /404.html` serves the prerendered not-found page with status 404.
- **Local results:**
  - /nope, /services/nope, /app.html and an unknown .html all answer 404.
  - The body is the not-found page with `<meta name="robots" content="noindex">`.
- **Client-side:** navigating to a bad route in the app renders "That page isn't here." with the noindex meta (`launch-gate.mjs`).

### 5. PASS locally (147 checks); live check after upload
- **The canonical form:** no trailing slash, as the canonicals and the sitemap already were.
- **One hop:** every redirect in `htaccess-append.txt` goes straight to `https://vexeltechsolutions.com` plus the final path. http, www, a trailing slash, `/index.html`, `/<route>/index.html` and the old aliases each resolve in one 301, in any combination.
- **No loop:** the `index.html` rule reads the request line, so the internal rewrite to `/<route>/index.html` cannot loop.
- **The app agrees:** aliases (/about, /contact, /packages, /thanks.html, /privacy.html, /terms.html) are redirects in the router too, and `<Canonical />` strips a trailing slash or `/index.html`, so the app never renders a page under a second URL.
- **Smoke test, every one PASS:**
  - 8 pages × their variants × {http, https} × {www, bare}
  - 16 aliases, each from https-bare and from http-www
  - each answering one 301 whose target answers 200
- **NOTE FOR UPLOAD:** if the live `.htaccess` already has a rule forcing HTTPS or stripping www *above* this block, remove it. Otherwise http://www.…/services/ becomes two hops: theirs, then ours.

### 6. PASS
- **Noindex:** /thanks and 404.html carry `noindex` in the prerendered HTML. The privacy policy and terms carry it too, as before.
- **The sitemap** lists /, /services, /pricing, /about-us and /contact-us only.

### 7. PASS locally; live check after upload
- **The headers**, in `htaccess-append.txt`, verified by curl on the local server:
  - `Strict-Transport-Security: max-age=31536000`, on HTTPS only, with no includeSubDomains and no preload
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - the `Content-Security-Policy-Report-Only` exactly as briefed
- **Two inline scripts had to go**, and did:
  - the stylesheet's `onload="this.media='all'"` attribute
  - the route-preload `<script>`

  Both are now one hashed external file, `/assets/boot-<hash>.js`, loaded async.
- **Zero CSP violations:** every route browsed with motion on and scrolled through, and the form submitted on /contact-us. The console and `securitypolicyviolation` events were both read. The Formspree POST was answered by the test script, so nothing was really sent.
- **NEEDS-FOUNDER when analytics go on:**
  - Plausible: add `https://plausible.io` to script-src and connect-src.
  - The Meta Pixel: add `https://connect.facebook.net` to script-src, and `https://www.facebook.com` to img-src and connect-src.

  The comment in the .htaccess block says so.

### 8. PASS
`<meta name="color-scheme" content="light">` is in every page's HTML.

### 9. PASS
- **The control:** a Pause/Play button at the bottom right of the hero, 44 × 44, a bone glyph on a dark pill, with the site's focus ring.
- **Its name:** the aria-label is "Pause the background film" or "Play the background film".
- **Tested:**
  - focus, then Enter pauses the film and the label changes
  - Space plays it again
- **Reduced motion:** no video element, no button, and the poster (the film's first-second frame) shows.

### 10. PASS
- **The film:** `muted`, `playsinline`, `autoplay`, `loop`, and the poster is the first-second frame.
- **The poster in the HTML:**
  - The prerendered home page carries it as `<img fetchpriority="high">`.
  - Two `<link rel="preload" as="image" fetchpriority="high">` sit in the head, one per width: the 12.6 KB JPEG below 1024, the 27 KB WebP above.
- **A refused play()** (Low Power Mode) is caught. The poster stays, the button offers Play, and nothing is thrown.

### 11. PASS
- **The skip link** works with Lenis: focus moves to `<main>`, and Lenis or the browser scrolls to it.
- **The bar never covers focus:** `scroll-padding-top: 80px` keeps any focused or targeted element clear of the 64px bar.
- **Every Tab stop on 8 routes at 1280 and 390** (20 to 42 stops each) has a visible focus indicator. Outlines are 3:1 or better against their ground, and no stop sits under the sticky bar.
- **The line fields** (`lf__input`, `bd__input`) show focus as their 2px line in the focus colour.
- **Esc** closes the phone menu and returns focus to the menu button.

### 12. PASS
- **Labels:** every field has a real `<label>` reading "Name (required)" and so on. It is visually hidden; the visible placeholder carries the asterisk.
- **Errors:** in text, linked by `aria-describedby`, in a `role="alert"` region that already exists.
- **Autocomplete:** name, tel and email.
- **The honeypot:** `tabindex="-1"`, `autocomplete="off"`, `aria-hidden="true"`, and its container is aria-hidden too.
- **Phone links:** every one is `tel:+13852843265`.
- **Note:** the visible label is still the placeholder, the line field the founder chose in the contact pass. The accessible name is complete.

### 13. axe PASS; WAVE NEEDS-FOUNDER
- **axe-core 4.14** on all nine routes at 1280 and 390 (18 runs), every rule: **zero violations of any impact**.
- **Two found on the way and fixed:**
  - the phone row on /services was a scroller with no keyboard access (`scrollable-region-focusable`); below 1024 it now takes focus and a name
  - the line field note in item 11
- **WAVE** is a browser extension and a paid API, and neither is on this machine. Run the WAVE extension on the nine live URLs after upload; anything it reports comes back as a fix.

### 14. PASS, after four fixes
- **Text spacing** (WCAG 1.4.12's line height, letter, word and paragraph spacing), on every route at 1280 and 390: nothing clipped. Fixed on the way:
  - **What we do's cards:** a fixed 460px height cut the answers; now a 460px minimum.
  - **The footer band:** it clipped its links; the clip came off, since the corner swash it cut is gone.
  - **About's week rail on a phone:** its fixed 72px rows squeezed "Live."; rows are now at least 72.
  - **The 320px scroll:** /services scrolled 16px sideways at 320 (the Automation phone's grid track); it now takes the column's width.
- **Reflow:** 1280 at 200% (640 CSS px) and 320 wide, on all nine routes. No horizontal scroll, and no content past the edge outside a scroller.

### 15. PASS locally; live check after upload
- **Caching:** HTML `no-cache`; `/assets/*` `public, max-age=31536000, immutable`.
- **Compression:** brotli on HTML, CSS and JS; none on woff2, mp4 or webp.

The smoke script checks all of this live as well.

### 16. FAIL: LCP; CLS passes
- **Mobile lab, Lighthouse 13.5.0, five runs each, on the local server:**

  | Route | LCP runs (s) | Median LCP | Median CLS |
  |---|---|---|---|
  | / | 4.28, 4.30, 4.28, 4.30, 4.41 | **4.30** | 0.000 |
  | /pricing | 2.65, 2.66, 2.94, 2.67, 2.65 | **2.66** | 0.000 |

  The gate is 2.5s. Both fail.
- **The prescribed fixes are in, and they are not where the time goes.**
  - **The poster:** preloaded at high priority, WebP and JPEG under 30 KB, in the HTML. Removing the preloads changed nothing (4.3s).
  - **The fonts:** the font preload was already the two above-the-fold faces, Clash and Satoshi.
  - **The animation:** with the hero's animation off, it is still 4.4s.
- **The cause, measured** (`.measure/lcp-trace.mjs`, a phone at 4x CPU, the DevTools LCP timeline):

  | | Home LCP | /pricing LCP |
  |---|---|---|
  | JavaScript off (the prerendered page alone) | **668 ms** | **506 ms** |
  | JavaScript on | 1995 ms | 1340 ms |

  The prerendered h1 paints early. Then `createRoot` in `main.jsx` throws the prerendered markup away and renders new nodes, and the new h1's paint is the one Lighthouse counts. Its simulated throttling turns that into 4.3s on home, where the app's script is heaviest.
- **The fix, not made at this gate:** hydrate instead of replace (`hydrateRoot`).
  - **What it needs:** every component's first render must match the prerender exactly. Several decide their first render from the window, which differs between the prerender (1280, reduced motion) and a phone: the hero's film mode, the cost row's swipe, the phone scroller, the bar.
  - **Why not today:** a mismatch makes React silently fall back to today's behaviour, with console errors. It is a contained refactor: make those first renders deterministic, then switch to `hydrateRoot`, and add a hydration-error check to the gate. It is too risky to make the day before launch without the founder's go-ahead.

### 17. NEEDS-FOUNDER
- **What the policy now covers:** the privacy policy (`src/pages/site/legalContent.js`) is rewritten to what the site actually does:
  - controller name and contact
  - data collected: the form fields, campaign tags and server logs
  - no cookies
  - purposes and lawful basis
  - recipients named (Formspree, Hostinger)
  - international transfers
  - retention
  - the rights, by region
  - the right to complain (ICO, EEA authorities, OAIC, CPPA)
  - the effective date
- **What it no longer claims:** the old text described a newsletter, analytics cookies, Netlify, Google Analytics and CRMs the site does not use.
- **Kept from the founder's text:** the retention periods (24 months, project plus 36 months, 7 years), the 30-day response, the CCPA and GDPR rights and the children's clause.

**Placeholders for the founder.** They are in one file, `src/content/entity.js`, except where marked:

| Placeholder | Where it shows | Before this pass |
|---|---|---|
| `[LEGAL ENTITY NAME]` | footer, privacy, terms, legal entity block | "Vexel Scales LLC" |
| `[STATE OF FORMATION]` | privacy, terms, legal entity block | "Texas" |
| `[FILE NUMBER]` | privacy, terms, legal entity block | none |
| `[GEOGRAPHIC ADDRESS]` | footer, privacy, terms, legal entity block | "Richmond, TX 77406" |
| `[EFFECTIVE DATE]` | privacy (in `legalContent.js`) | "August 22, 2026" |
| `[HOSTING REGION]` | privacy, section 5 (in `legalContent.js`) | none |
| `[TRANSFER SAFEGUARD]` | privacy, section 5 (in `legalContent.js`) | none |
| `[LOG RETENTION PERIOD]` | privacy, section 6 (in `legalContent.js`) | none |
| `[ANALYTICS: ...]` | privacy, section 2c (in `legalContent.js`) | none. Describe Plausible or the Pixel if either is turned on, or delete the sentence |

**Also for the founder:**
- **The JSON-LD address:** `index.html` still asserts 6619 Elks Trce, Richmond, TX 77406 in its JSON-LD. Confirm it, or replace it to match the placeholder you fill.
- **Governing law:** the Terms and the legal pages' notice still name Texas law and Fort Bend County arbitration. Confirm they match the state of formation.
- **Legal review:** the policy is written from the facts on this page. A lawyer should read it before launch.
- **A Formspree fact:** it states that Formspree processes submissions in the United States. Check that against Formspree's terms.

### 18. PASS as built; the placeholders are item 17's
- **The footer's bottom row** has an entity line on every page: "[LEGAL ENTITY NAME], trading as VexelTech Solutions · [GEOGRAPHIC ADDRESS] · info@vexeltechsolutions.com".
- **The terms page:** its opening clause, legal contact and entity block carry the same.
- **Pricing** says "All prices are in US dollars and exclude tax where applicable." under the grid.
- **Note:** this puts an address back on public pages, which TABLET PADDING AND NO LOCATION (2026-09-30) had removed. It is the founder's instruction, so it supersedes that one.

### 19. PASS
Under every form's submit: "We reply within one business day. Your details are used only to answer you." with a "Privacy policy" link. The copy check lists it as a repeat across pages, which it is by design.

### 20. PASS
- **lorem, ipsum, TODO, TBD, example.com:** zero in dist and in src, outside comments.
- **"placeholder"** appears only as code: the `placeholder` attribute on the fields and the CSS `::placeholder`.
- **Fixed on the way:** the parked counter row shipped four "Placeholder label" strings and synthetic figures in home's script. They are emptied, and the row still renders nothing.
- **Deliberate, and NEEDS-FOUNDER:**
  - `YOUR_FORMSPREE_ID`, the form endpoint's default while `VITE_FORMSPREE_ID` is unset. Until it is set, every real submission fails into the error state, with the mailto line under it.
  - The bracketed legal placeholders (item 17).
- **Years:** 2026 in the copyright, "Taking bookings for October 2026." (`content/company.js`, update it monthly), "By 2026" in Why we exist, the stamp and the Terms dates. 2025 once, in the November 2025 campaign line on /services. All intentional.
- **Prices** (`.measure/prices.mjs`): every figure in every page's JSON-LD is a published price. **Fixed:** home's `priceRange` read "$299 to $700" while /pricing sells the $999 bundle. It is now built from the price tokens: "$299 to $999".

### 21. PASS, with one gap for the founder
- **Off by default:** Plausible sits behind `VITE_PLAUSIBLE_DOMAIN`. With it unset, the build has no analytics script and makes no third-party request.
- **Events** (`src/components/site/analytics.js`, wired in `Tracking.jsx`):
  - "Lead" once on /thanks
  - "Click Phone" on any `tel:` link
  - "Click Email" on any `mailto:` link
- **To turn it on:**
  1. Add the site in Plausible, and add the goals "Lead", "Click Phone" and "Click Email".
  2. Put `VITE_PLAUSIBLE_DOMAIN=vexeltechsolutions.com` in the site repo's `.env`.
  3. Add `https://plausible.io` to script-src and connect-src in the CSP line of the live `.htaccess`.
  4. Update the privacy policy's analytics sentence.
  5. `npm run build`, then upload `dist`.
- **The gap:** the forms confirm in place and do not go to /thanks, so a visitor only reaches it directly, and "Lead" on /thanks will almost never fire. Firing "Lead" on the form's in-page success, as the Meta Pixel already does, is a one-line change. It is the founder's call.

## The smoke script

`.measure/audit/smoke.sh`, the final URL set.

- **After upload, from any machine with bash and curl:**

  ```bash
  bash .measure/audit/smoke.sh live
  ```

  It prints PASS or FAIL per check, and exits with the number of failures.
- **Locally** (`node .measure/serve-dist.mjs` first): `bash .measure/audit/smoke.sh local`. On Git Bash for Windows, prefix it with `MSYS_NO_PATHCONV=1`.
- **What it checks:**
  1. **The eight pages answer 200:** /, /services, /pricing, /about-us, /contact-us, /privacy-policy, /terms-of-service, /thanks.
  2. **Real 404s:** /nope, /services/nope, /app.html and /blog-post-that-never-was.html answer 404, with the not-found page and noindex.
  3. **One 301, then 200:** every page's variants (`/route/`, `/route/index.html`, `/index.html`) over http and https, www and bare, and 16 old aliases, each go in one 301 to the canonical https URL, which answers 200.
  4. **The security headers**, and HSTS on HTTPS only.
  5. **Caching:** HTML no-cache, and `/assets/` immutable for a year.
  6. **Compression:** brotli or gzip on HTML, CSS and JS, and none on woff2, video or images.
- **Last local run:** 147 PASS, 0 FAIL (`.measure/out/launch-gate/smoke-local.txt`).

## Rollback

1. **Before uploading, take a backup:**
   - in hPanel, download `public_html` (or make a backup in Files, Backups)
   - save the live `.htaccess` as `.htaccess.before-launch`
2. **Keep the last build that was live:** `vexeltech-hostinger-final28.zip` sits beside `vexeltech-hostinger.zip` in `vexeltech2-src`. It is the final28 build, before this gate.
3. **To roll back the site:** empty `public_html`, except `.htaccess`, then extract the previous zip or the backup into it.
4. **To roll back the server rules:** restore `.htaccess.before-launch`. If only the CSP or a header misbehaves, delete that one `Header always set` line. The CSP is report-only, so it cannot break a page.
5. **To roll back in code:** the gate is one commit in the site repo (the launch-gate commit). `git revert <commit>`, then `npm run build`, and upload `dist`. The commit before it is c2e18c9 (final28).
6. **After any rollback,** run `bash .measure/audit/smoke.sh live` to confirm the state.

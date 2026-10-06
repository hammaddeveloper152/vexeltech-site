# Final audit before upload, 2026-10-06 (final22)

The founder's brief, sections A to G. Each check has a **PASS** or **FAIL**
and what changed. The site repo is `vexeltech2-main`; the design repo is
`vexel-tech-site`, whose `DESIGN.md` "FINAL22" records the same pass.

**Measured on `dist`** (prerendered, `npm run build`), served by
`.measure/serve-dist.mjs`, which mirrors the `.htaccess` below.

**Scripts:**

| Script | What it does |
|---|---|
| `.measure/seo-heads.mjs` | Heads and headings per route |
| `.measure/final22-checks.mjs` | Links, focus, hover and active, reduced motion, JSON-LD, media (output in `checks.json`) |
| `.measure/formtest.mjs` | The form against its endpoint |
| `.measure/lh-full.mjs` | Lighthouse, all categories, mobile and desktop |
| `.measure/final22.mjs` | Full-page captures |
| `.measure/copytext.mjs` | The copy checks |

---

## A. Hero copy: PASS

| Check | Result | What changed |
|---|---|---|
| The rotating headline and its logic are removed | PASS | `Hero.jsx` has no line clock, shot state or `Line`. `heroSpot.js` keeps only the film's cut data for the shade scripts. The "Yet." swash went with it, so BUILD-LAW's swash count is now two. |
| A static H1 | PASS | "Website design and marketing for small businesses." in Clash 500, `clamp(24px, 4.7vw, 60px)`. Measured at two lines, 60px at 1280 and 24px at 390 (BUILD-LAW: a headline is two lines at most). |
| The 20px line under it | PASS | "One team builds the site, runs the ads and answers the enquiry." It drops to 18px below 600. |
| The offer line, calls and promise line are unchanged | PASS | Nothing changed. |
| The eyebrow is removed | PASS | Deleted. |
| The copy file | PASS | Rule 6 is struck through as RETIRED. The hero section records V4.1 with these lines; the eyebrow and the rotating lines are struck. |

## B. Footer: PASS

| Check | Result | What changed |
|---|---|---|
| The Sources row and the outbound links are deleted | PASS | The `.foot__sources` markup and CSS, and the `SOURCES` export in `content/costs.js`, are deleted. The 24 dead CSS rules for `.foot__legal`, `.foot__sources` and `.foot__src` are deleted, and so are 2 in `light.css`. |
| The source names stay only in the cost cells, as plain text | PASS | The four 11px lines are unchanged and are not links. |
| The bottom row is one line, in three parts | PASS | `FooterBase` in `FooterMeta.jsx`: the wordmark on the left; "Services · Pricing · About us · Get a custom quote" in the middle; "© 2026 VexelTech Solutions · Privacy · Terms" on the right. A 1px bone rule at 14% above, 24px padding, 12px mono, every link a 48px target. |
| Nothing else in the row | PASS | — |
| The row shows on every page | PASS (after a fix) | The skills pass found the cream band's −112px foot covering the new row from 768 up. The band's negative foot moved to the row. |
| The row works below 1024 | PASS (after a fix) | It stacks with no dot separators, so no wrapped line starts with "·". |
| The row's contrast on About's light ground | PASS (after a fix) | Lighthouse found bone on cream at 1.06:1. On the light ground the row now uses asphalt and steel. |

## C. Skills pass: PASS (run by a subagent; findings acted on)

**Inventory:**

- `~/.claude/skills`: no skills of its own (only the synced plugin folder).
- Design repo `.claude/skills`: 1 (`design-md-planner`, the `DESIGN.md` lint).
- Site repo `.claude/skills`: 9 (`vexel-register`, `critique-color`, `critique-typography`, `critique-visual-hierarchy`, `critique-composition`, `critique-affordance`, `design-token-audit`, `design-qa-checklist`, `readable-measure`).
- Installed plugins: 58 skills across 9 plugins, including `frontend-design` and brightdata's `seo-audit`.
- Synced plugins: 59 skills across 5 plugins, including marketing's `seo-audit` and `brand-review`.
- The parked `skills-library/` (254) is not loaded.

**Run:**

| Skill | Category | Ran? |
|---|---|---|
| critique-visual-hierarchy | design | ran |
| critique-composition | design | ran |
| critique-typography | design | ran |
| critique-color | design, accessibility | ran |
| critique-affordance | accessibility | ran |
| design-token-audit | design | ran (on this pass's diff) |
| design-qa-checklist | design, accessibility | ran |
| readable-measure | design | ran, nothing found |
| marketing:seo-audit | SEO | ran the on-page and technical checks on `dist` |
| marketing:brand-review | copy, brand | ran |
| vexel-register | brand | used as the record of what is decided |
| frontend-design | design | skipped: build guidance, not a review |
| brightdata seo-audit, design-mirror, brand-listening | SEO, brand | skipped: they need a live URL, an API key and the Bright Data CLI |

**Findings, and what was done:**

1. **Fixed:** the new H1 was outranked by two older `.hero[data-mode] .hero__headline` rules (a fixed two-line box at 56 and 115.6px) and overlapped the copy under it. The new rule now has three classes and `height: auto`.
2. **Fixed:** the footer band covered the new bottom row (see B).
3. **Fixed:** the bottom row's nav wrapped at 390 onto a leading "·" (see B).
4. **Fixed:** the /thanks meta description ("We will review your request and get back to you shortly.") now reads "Received. A written reply within one business day."
5. **Fixed:** /contact-us had a weak title. It is now "Get a custom quote for your website | VexelTech".
6. **Notes, left as they are:**
   - The new hero and footer use raw sizes and bone alphas rather than tokens.
   - The JSON-LD Organization node carries no `telephone`. The home ProfessionalService does (+1 385 284 3265, the footer's number since copy V2).
   - The /services demo's "(555) 010 2200" and its "4.9 (212)" are recorded demo content.
   - The "Vexel Scales LLC" lines in the legal pages are recorded and open with legal.

## D. Content audit: PASS, with copy decisions listed for the founder

Read by a subagent from the rendered text of /, /services, /pricing, /about-us, /contact-us and the 404, against copy rules 1 to 10 and the banned list.

**Banned list:** PASS. No dashes, exclamation marks, "template", "cheap", "affordable", "Map Pack", "dominate", "skyrocket" or "Harbor Dental". There is no build-method language; AI appears only as a service. `.measure/copytext.mjs` also reports `dashes`, `banned` and `bangs` empty on every route, and no figure outside the founder's set.

**Promise line:** PASS. "A written number within one business day." appears exactly once on each of /, /services, /pricing, /about-us, /contact-us and the 404 (`seo-heads.mjs`: 1, 1, 1, 1, 1, 1). It is placed beside the primary call by one component, `PromiseLine`. Before this pass it was on home only.

**Fixed in this pass:**

| Route | Rule | String | File | Change |
|---|---|---|---|---|
| /about-us | 8, no years | "2023, 2025, 2026" (a label) | `components/story/OriginStory.jsx` | Cut, with its style |
| / | consistency | "You get a written number the same day." (How it works, 01) | `pages/site/Home.jsx` | Cut, because it contradicted the one-business-day promise |
| /pricing, /about-us | headings | h2 "Questions" | `components/home/Faq.jsx` (`heading` prop) | Now "Questions about website pricing" and "Questions about working with us" |
| /contact-us | consistency | "what’s" (curly apostrophe) | `pages/site/ContactPage.jsx` | Made straight, like the rest of the site |

**Not changed: these are the founder's own copy, so they are listed rather than rewritten** (BUILD-LAW Truth):

| Route | Rule | String | File |
|---|---|---|---|
| /about-us | 8, borderline | "By 2026 that had become VexelTech" (year in the origin paragraph) | `components/story/OriginStory.jsx` |
| /about-us | 8, borderline | "Most of our clients are in the US." | `components/story/FitColumns.jsx:69`, `pages/site/AboutPage.jsx:45` |
| /about-us | geography, borderline | "Do you work outside the US?" (the answer is yes, to the UK, Europe and Australia) | `pages/site/AboutPage.jsx:44` |
| /services | 8, borderline | "One campaign we ran, November 2025 … Client name withheld." (no industry or city) | `components/artifacts/InboxStage.jsx` |
| several | banned list, borderline | "code" as an owned asset ("files and code in your name") | `Home.jsx`, `PromiseBand.jsx`, `services.js`, `substance.js`, `PricingPage.jsx`, `TermsCard.jsx` |
| / | 4, borderline | "It's on this site." (an exception recorded in V2.1); "Flat prices, and three things we don't do." | `components/site/PromiseBand.jsx` |
| /services | 4, borderline | "Four disciplines, built to work as one system." | `pages/site/ServicesPage.jsx` |
| several | 1, length | Sentences over 14 words on About (origin, One team, FAQ), Services (the call note, the Marketing fit line), and in a closed answer on Pricing | as listed in the subagent's table |
| /pricing | 3, borderline | "$150 less than separately." (the bundle's recorded saving) | `content/pricing.js` |
| /services | e, borderline | "Replies in under sixty seconds, every time." and "for ten years" | `content/automation.js`, `content/substance.js` |

**Headings: PASS on structure.** One H1 per page, and no skipped levels on any route (`seo-heads.mjs`: 0 skips). Label-only h2s remain:

- /services: "Branding", "Websites", "Marketing", "Automation"
- home: "Who we are", "What we do", "What it costs you"

The subagent suggests sentence headings that carry rule 9's cluster phrases, for example "Small business website design" for Websites. They are not applied: they rename the four disciplines, which is the founder's call.

## E. SEO and indexing

### E1. Titles and descriptions: PASS

| Route | Title (characters) | Description (characters) |
|---|---|---|
| / | Website design for small business, $700 flat \| VexelTech (56) | 125 |
| /services | Small business website design and local SEO \| VexelTech (55, new) | 143 |
| /pricing | Website design pricing: $700 flat rate \| VexelTech (50, new) | 149 (trimmed from 157) |
| /about-us | About VexelTech \| Small business marketing agency (49, new) | 143 (rewritten from 226) |
| /contact-us | Get a custom quote for your website \| VexelTech (47, new) | 70 |

Each title carries its page's rule 9 cluster phrase: "website design for small business", "small business website design" and "local SEO", "website design pricing" and "flat rate", "small business marketing agency".

### E2. One H1 per page with the cluster phrase; levels in order: PASS, with notes

- One H1 on every route, and no skipped heading levels.
- **The H1s:**
  - Home: "Website design and marketing for small businesses."
  - Services: "Website design, local SEO, ads and automation for small business"
  - Pricing: "Flat-rate website design …"
  - About: "A web design and marketing agency built for small businesses."
- **Note:** rule 9 asks for each page's exact cluster phrase in the H1 or an H2. Home's and Services' H1s carry the words but not the exact phrases. The founder supplied home's H1 in this brief, and the others are V4 copy, so they are left as they are.

### E3. Canonical, Open Graph, Twitter, share image: PASS

- **Canonical:** absolute, `https://vexeltechsolutions.com/<route>`, with no trailing slash. Home is the origin's `/`.
- **Open Graph and Twitter tags on every route:**
  - og: title, description, url, image
  - twitter: card, title, description, image
- **The share image:** `/og/vexeltech.jpg`, 1200 x 630, the V mark and the wordmark on the dark ground. It is drawn in code by `.measure/brand-assets.mjs`; `/og.jpg` is deleted.
- **Legal pages, /thanks and the 404** are noindex, with no canonical.

### E4. JSON-LD: PASS

- **Site-wide** (`index.html`): Organization, with a logo, and WebSite.
- **Home:** ProfessionalService.
  - name, url, `logo` `/og/logo.png`, image, email, telephone
  - `areaServed`: US, GB, AU and the 27 EU member states
  - `priceRange` "$299 to $700"
  - `sameAs` is added only when a social URL is set; none is set today.
- **/services:** four Service entries (name, description, url, areaServed, provider), BreadcrumbList and FAQPage.
- **/pricing and /about-us:** BreadcrumbList and the existing FAQPage.
- **/contact-us:** BreadcrumbList.
- **Validation** (`final22-checks.mjs`): every block parses and has `@context` and `@type`, plus each type's required fields:
  - ProfessionalService and Organization: name, url
  - Service: name, provider
  - FAQPage: every question's name and answer text
  - BreadcrumbList: position, name, item
- **Result:** all "ok" on every route.
- **Not run:** Google's Rich Results test needs the live URL, so run it after upload.

### E5. Prerendered HTML: PASS

- **How it is built:** `npm run build` is now `vite build && node scripts/prerender.mjs`.
  - Every route renders once in Chrome, with reduced motion so every artifact is at rest.
  - Each finished document is written to `dist/<route>/index.html`: home to `dist/index.html`, the not-found page to `dist/404.html`.
  - The untouched shell is kept as `dist/app.html`.
  - puppeteer is now a devDependency.
- **Checked by curl and grep:** each route's H1 is in its HTML with no JavaScript (`curl --compressed localhost:4190/<route>`):

  | Route | H1 in the HTML |
  |---|---|
  | / | "Website design and marketing for small businesses." |
  | /services | "Website design, local SEO, ads and automation for…" |
  | /pricing | "Flat-rate…" |
  | /about-us | "A web design and marketing agency built…" |
  | /contact-us | "Tell us what's going wrong." |
  | 404.html | "That page isn't here." |

### E6. sitemap.xml, robots.txt, 404.html: PASS

All three are in `dist`. robots.txt references the sitemap, and the sitemap lists the five pages without trailing slashes.

### E7. .htaccess: block written, PASS; to be appended by hand

There was no `.htaccess` in the repo. The block below is in `.measure/audit/htaccess-append.txt`; append it to the live file.

**Routing:**

- Prerendered folders are served with `DirectorySlash Off`, so there is no trailing-slash redirect, and `/x/` sends a 301 to `/x`.
- The routes removed in netlify.toml send a 301 home.
- Aliases send a 301 to their canonical: /about, /contact, /packages, the old .html pages, and /branding and the like to /services#….
- Unknown paths fall back to `/app.html`, the SPA shell. The brief said `index.html`, but `index.html` is now the prerendered home page, and serving it would flash home's content before the app rendered the right route.
- `ErrorDocument 404 /404.html`.

**Headers and compression:**

- MIME types for webm, mp4, woff2, webmanifest and svg.
- Caching: `/assets/` is `immutable` for a year; HTML is `no-cache`.
- Compression: Brotli, falling back to gzip.

```apache
# ==== VexelTech additions, final22 (2026-10-06). APPEND to the live .htaccess;
# ==== keep everything already in it. Every block is guarded, so a module the
# ==== host lacks is skipped rather than breaking the site.
Options -MultiViews
DirectorySlash Off
DirectoryIndex index.html

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^(blog|resources|portfolio|case-studies)(/.*)?$ / [R=301,L]
RewriteRule ^portfolio\.html$ / [R=301,L]
RewriteRule ^legacy/contact/?$ / [R=301,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^work(/.*)?$ / [R=301,L]
RewriteRule ^about/?$ /about-us [R=301,L]
RewriteRule ^contact/?$ /contact-us [R=301,L]
RewriteRule ^packages/?$ /pricing [R=301,L]
RewriteRule ^thanks\.html$ /thanks [R=301,L]
RewriteRule ^privacy\.html$ /privacy-policy [R=301,L]
RewriteRule ^terms\.html$ /terms-of-service [R=301,L]
RewriteRule ^(services/)?(branding)/?$ /services#branding [NE,R=301,L]
RewriteRule ^(services/)?(websites|web-development)/?$ /services#websites [NE,R=301,L]
RewriteRule ^websites\.html$ /services#websites [NE,R=301,L]
RewriteRule ^(services/)?(marketing)/?$ /services#marketing [NE,R=301,L]
RewriteRule ^(services/)?(automation)/?$ /services#automation [NE,R=301,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.+)/$ /$1 [R=301,L]
RewriteCond %{REQUEST_FILENAME} -d
RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule ^(.+)$ /$1/index.html [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /app.html [L]
</IfModule>

ErrorDocument 404 /404.html

<IfModule mod_mime.c>
AddType video/webm .webm
AddType video/mp4 .mp4
AddType font/woff2 .woff2
AddType application/manifest+json .webmanifest
AddType image/svg+xml .svg
</IfModule>

<IfModule mod_headers.c>
<FilesMatch "\.html$">
Header set Cache-Control "no-cache"
</FilesMatch>
<If "%{REQUEST_URI} =~ m#^/assets/#">
Header set Cache-Control "public, max-age=31536000, immutable"
</If>
</IfModule>

<IfModule mod_brotli.c>
AddOutputFilterByType BROTLI_COMPRESS text/html text/css text/plain text/xml text/javascript application/javascript application/json application/xml application/manifest+json image/svg+xml
</IfModule>
<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml text/javascript application/javascript application/json application/xml application/manifest+json image/svg+xml
</IfModule>
```

The commented copy of this block, in `htaccess-append.txt`, explains each line.

### E8. Media, lang, favicon, manifest: PASS

- **Images:** every `<img>` has alt. Decorative images have empty alt; the Websites phones and the Recent work captures have descriptive alt.
- **The hero film:** `aria-hidden` (the H1 carries the meaning), with the first-second frame as its poster. Its still is an `<img alt="">`.
- **The page:** `<html lang="en">` on every route.
- **Icons:** favicon.ico, icon.svg and apple-touch-icon are present. `site.webmanifest` is new, with 192 and 512 icons, and is linked from every page. `theme-color` is #0b0b0d (it was #FFC400).

### E9. Lighthouse 13.5.0: SEO PASS, Best Practices PASS, Accessibility PASS, Performance below 100 on mobile

One run per route and form factor, on `serve-dist.mjs` (gzip, the `.htaccess` caching).

| Form | Route | Performance | Accessibility | Best Practices | SEO | LCP |
|---|---|---|---|---|---|---|
| Mobile | / | 92 | 100 | 100 | 100 | 3.0 s |
| Mobile | /services | 90 | 100 | 100 | 100 | 3.0 s |
| Mobile | /pricing | 96 | 100 | 100 | 100 | 2.6 s |
| Mobile | /about-us | 95 | 100 † | 100 | 100 | 2.6 s |
| Desktop | / | 99 | 100 | 100 | 100 | 0.9 s |
| Desktop | /services | 100 | 100 | 100 | 100 | 0.7 s |
| Desktop | /pricing | 100 | 100 | 100 | 100 | 0.6 s |
| Desktop | /about-us | 100 | 100 † | 100 | 100 | 0.6 s |

† /about-us first measured **95** for Accessibility on both form factors: the new footer row was bone on About's cream ground. It was fixed (see B), and a re-run of mobile Accessibility gave **100**.

Mobile performance is held back by first contentful paint, LCP and, on home and /services, total blocking time: the hero film, the webfonts and the app's script on a throttled phone. LCP is in the 2.6 to 3.0s range recorded before this pass.

Lighthouse 13 also scores an "agentic browsing" category (`llms-txt`, `ard-schema`). It was not in the brief and is not addressed.

## F. The form: PASS

- **Handler:**
  - `content/form.js`: the form posts JSON to `https://formspree.io/f/${VITE_FORMSPREE_ID}`, with `Accept: application/json`.
  - **The placeholder ID is `YOUR_FORMSPREE_ID`.** To go live, create the form at formspree.io and put `VITE_FORMSPREE_ID=<id>` in a `.env` file at the site repo root. Then `npm run build` and upload `dist`.
  - Formspree sends to the account's email; set it to info@vexeltechsolutions.com.
- **Netlify behind a flag:**
  - With `VITE_FORM_TARGET=netlify`, the form posts the old Netlify form "contact" url-encoded to "/".
  - The build keeps the hidden twin in `index.html` only under that flag. The `vt-netlify-form-twin` plugin in `vite.config.js` strips it otherwise; the twin is 0 times in `dist/index.html`.
- **Honeypot:** a hidden text field out of the tab order, `_gotcha` (Formspree) or `bot-field` (Netlify). A filled honeypot sends nothing and shows success.
- **Unchanged:** the success state ("Received. A written reply within one business day."), validation and the 40% submit rule.
- **Mailto fallback:** "Or email info@vexeltechsolutions.com" under every form, with a 48px target.
- **Test** (`.measure/formtest.mjs`, /contact-us):
  - **Placeholder:** one POST to `https://formspree.io/f/YOUR_FORMSPREE_ID`, carrying the fields name, phone, email, need, budget, message, the four UTM tags and `_subject`. The response is 404, and the form shows "That did not send. Try again in a moment.", with the mailto line under it. It reads cleanly; captured in `out/final22/form-error.png`.
  - **Honeypot filled:** no request, and the success line shows.

## G. Links and states: PASS

| Check | Result | Detail |
|---|---|---|
| Internal links | PASS | All 20 internal hrefs and anchors across every route resolve to a rendered page, and their #fragments exist. The one "fail" is the 404 page's own skip link, which lands on the 404 by design. |
| Keyboard | PASS | Tab order runs top to bottom on every route, with no jump back up the page (22 to 39 stops). Every stop has a visible focus. The line fields show focus as their 2px yellow line (a border), which the script reads as no outline; their focus state is recorded in `LeadForm.css` and visible. |
| Hover and press | PASS (after fixes) | Every interactive element now has a hover rule (gated to a fine pointer) and an `:active` press. Added: the footer wordmark, the desk's colour-set buttons, Recent work's links, the mailto line and /thanks' phone link. |
| Reduced motion | PASS | With `prefers-reduced-motion: reduce`, no CSS animation is running after load on any route. The hero shows its still; the artifacts rest; the cost row's sweep is paused; the inbox has no loop. |

**Captures** are in `.measure/out/final22`: every route, full page, at 1280 and 390 (home, services, pricing, about, contact, privacy, terms, thanks, 404), plus hero, footer and form-error frames.

---

## What could not be fixed here, and why

1. **The Formspree ID** is a placeholder (`YOUR_FORMSPREE_ID`). Only the founder can create the Formspree form and supply its ID; until then every submission fails into the error state, with the mailto fallback beside it.
2. **The live `.htaccess`** is edited by hand on Hostinger. The block above has to be appended there; it cannot be tested from here against Hostinger's actual modules (LiteSpeed or Apache, Brotli availability).
3. **Mobile performance is not 100** (90 to 96, LCP 2.6 to 3.0 s). The remaining cost is the hero film, the webfonts and the app's script on a throttled phone. That is recorded since PERF AND TIDY and is not changed without a decision on the film.
4. **Copy decisions left to the founder** (D): the year in the origin paragraph, "Most of our clients are in the US", the US question on About, the November line without industry or city, "code" as an owned asset, the rule 1 length breaches and the label-only h2s. Rewriting them would put words in the founder's mouth (BUILD-LAW Truth).
5. **Rich Results and indexing tests** (Google's Rich Results test, Search Console) need the live URL. Run them after upload.
6. **The agentic-browsing category** in Lighthouse 13 (`llms.txt`, `ard-schema`) was not in the brief and is not addressed.

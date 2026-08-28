# VexelTech Website Audit

Audit date: 2026-08-22  
Scope: route coverage, page ownership, content consistency, runtime behavior, responsive behavior, accessibility, forms, SEO, and production build.

## Executive Summary

The site builds successfully and all primary declared routes render in the local runtime. The main risk is not compilation; it is conversion and production behavior.

### Highest-priority findings

1. **Homepage callback form submits to a missing `/thanks.html` destination.** A successful submission can land on the generic not-found page. See [home-body.html](src/legacy/home-body.html#L644) and [App.jsx](src/App.jsx#L54).
2. **Homepage mobile header has horizontal overflow.** At 390px, the document width is 402px and the booking CTA extends beyond the viewport. The primary nav is hidden without a replacement menu. See [styles.css](src/styles.css#L87) and [styles.css](src/styles.css#L303).
3. **Primary navigation is not keyboard/mobile complete.** The React service dropdown opens through mouse enter/leave only. The legacy homepage has no dropdown, while secondary pages do. See [SiteHeader.jsx](src/components/SiteHeader.jsx#L21).
4. **Portfolio project cards are mouse-only interactive articles.** They have no keyboard interaction, button/link semantics, dialog role, focus trap, Escape handling, or focus restoration. See [Portfolio.jsx](src/pages/Portfolio.jsx#L141) and [Portfolio.jsx](src/pages/Portfolio.jsx#L347).
5. **The not-found route displays terms content.** Any unknown URL gets `SimplePage` with a “Page not found” heading but the terms description and terms sections. See [App.jsx](src/App.jsx#L54) and [SimplePage.jsx](src/pages/SimplePage.jsx#L5).

## Validation Performed

- `npm run build`: passed with Vite 8.2.2; 46 modules transformed, no build errors.
- Local route sweep: all primary routes rendered an `h1`, title, and main region.
- Responsive browser check: homepage tested at 390px wide; horizontal overflow confirmed.
- Runtime interaction check: pricing tab switching works; portfolio cards open their detail behavior by mouse.
- External images load from Unsplash URLs during the local check.
- Browser console produced a Three.js warning: `MeshLambertMaterial: 'flatShading' is not a property of this material.` See [home-scripts.js](src/legacy/home-scripts.js#L436).

## Route and Page Map

| URL | Component | Purpose | Status |
|---|---|---|---|
| `/` | `HomePage` | Legacy-style conversion homepage with animated service sections and callback form | Renders; mobile overflow and form destination issues |
| `/services` | `Services` | Four-discipline service overview | Renders; links work |
| `/services/websites` | `WebDevelopment` via `ServicePage` | Website development detail | Renders |
| `/services/web-development` | `WebDevelopment` via `ServicePage` | Alias for website detail | Renders |
| `/web-development`, `/web-development/` | `WebDevelopment` | Legacy aliases | Renders |
| `/websites.html` | `WebDevelopment` | Legacy homepage alias | Renders |
| `/services/branding` | `Branding` via `ServicePage` | Branding detail | Renders |
| `/branding`, `/branding/` | `Branding` | Legacy aliases | Renders |
| `/services/marketing` | `Marketing` via `ServicePage` | Marketing detail | Renders |
| `/services/automation` | `Automation` via `ServicePage` | Automation detail | Renders |
| `/portfolio` | `Portfolio` | Portfolio grouped by four disciplines | Renders; accessibility issues |
| `/about-us`, `/about/` | `About` | Company story, values, process | Renders |
| `/packages`, `/pricing`, `/pricing/` | `Packages` | Service tabs, pricing tiers, comparison, FAQ | Renders; hover-only card behavior |
| `/contact-us`, `/contact`, `/contact-us/` | `Contact` | Contact CTA and Netlify callback form | Renders; deployment/form discovery needs verification |
| `/blog` | `Blog` | Resource cards and field notes | Renders; cards are “Coming soon” only |
| `/industries` | `Industries` | Industry positioning cards | Renders; every card links to the same general portfolio |
| `/privacy-policy`, `/privacy.html` | `SimplePage` | Privacy summary | Renders; abbreviated policy |
| `/terms-of-service`, `/terms.html` | `SimplePage` | Terms summary | Renders; abbreviated terms |
| unknown URL | `SimplePage` | Intended 404 | Incorrect content: terms page body |

## Detailed Findings

### P0 / Launch-blocking

#### Homepage form has a broken success destination

The homepage form is a static legacy form with `action="/thanks.html"`, but there is no `thanks.html` file and no `/thanks.html` route. Netlify SPA fallback sends that URL to the React app, which renders the generic not-found component. This creates a broken post-submit experience and makes successful conversion tracking ambiguous.

Evidence: [home-body.html](src/legacy/home-body.html#L644), [App.jsx](src/App.jsx#L54), [netlify.toml](netlify.toml#L5).

Recommended fix: use a real thank-you route/page, or handle the form with a confirmed Netlify success flow. Test a deployed submission, not only local rendering.

#### Mobile header overflows and removes the main navigation

At 390px the measured document width is 402px. The booking CTA extends beyond the viewport. At the same breakpoint the `.nav` is `display:none`, but there is no menu button or alternate navigation. Mobile visitors can reach the sticky booking CTA, but cannot directly reach Services, Portfolio, About, Pricing, or Contact from the header.

Evidence: [styles.css](src/styles.css#L87), [styles.css](src/styles.css#L303). Runtime measurement: `scrollWidth=402`, `innerWidth=390`.

Recommended fix: add a real accessible mobile menu and constrain the masthead CTA with responsive sizing or wrapping. Re-test at 320px, 360px, and 390px.

### P1 / High

#### Service dropdown is mouse-only

The React header dropdown depends on `onMouseEnter` and `onMouseLeave`. It has no focus handling, button semantics, `aria-expanded`, or mobile interaction. Keyboard users cannot reliably open the service list. The homepage uses a separate legacy header without the same dropdown, so navigation behavior differs by page family.

Evidence: [SiteHeader.jsx](src/components/SiteHeader.jsx#L21).

Recommended fix: use a button for the dropdown trigger, support focus/click/Escape, and use one shared header implementation across homepage and secondary pages.

#### Portfolio modal is not an accessible dialog

Portfolio cards are `<article>` elements with `onClick`. They are not focusable or keyboard-operable. The modal backdrop and panel have no `role="dialog"`, `aria-modal`, accessible title association, focus trap, Escape close, or focus restoration. The close control is an unlabeled typographic `×` button.

Evidence: [Portfolio.jsx](src/pages/Portfolio.jsx#L141), [Portfolio.jsx](src/pages/Portfolio.jsx#L347).

Recommended fix: make each card a button or link, add dialog semantics and a labeled close button, and manage focus when opening/closing.

#### SPA fallback incorrectly renders terms for unknown routes

The wildcard route passes `title="Page not found"` into `SimplePage`. Because `SimplePage` treats every non-privacy title as terms, an invalid URL shows the terms description, terms heading, and terms sections under a not-found heading.

Evidence: [App.jsx](src/App.jsx#L54), [SimplePage.jsx](src/pages/SimplePage.jsx#L5).

Recommended fix: create a distinct `NotFound` page with a useful return-home/services action and correct metadata.

#### Netlify form behavior is unverified and inconsistent

The Contact page renders a React form with `data-netlify="true"` and no explicit `action`. The homepage form is injected from raw HTML and has a redirect to the missing path. Netlify form detection and field capture should be verified against a deployed preview because runtime-injected markup can be missed by static form processing depending on the deployment setup.

Evidence: [Contact.jsx](src/pages/Contact.jsx#L93), [HomePage.jsx](src/pages/HomePage.jsx#L14), [home-body.html](src/legacy/home-body.html#L644).

Recommended fix: provide deploy-time form markup or a documented Netlify-compatible form strategy, then test both forms end to end.

### P2 / Medium

#### Homepage has a separate legacy architecture and unsafe execution pattern

`HomePage` injects raw HTML using `innerHTML` and executes a large script using `new Function`. The effect attempts to clean GSAP/ScrollTrigger state, but the readiness polling interval in `runWhenReady` is not returned or cleared on unmount. This can leave delayed work running after route changes. The page also owns a separate header and footer, increasing content and behavior drift.

Evidence: [HomePage.jsx](src/pages/HomePage.jsx#L6), [HomePage.jsx](src/pages/HomePage.jsx#L14), [home-scripts.js](src/legacy/home-scripts.js#L34).

Recommended fix: migrate the homepage markup into React incrementally, return/clear readiness timers, and centralize shared site chrome.

#### Pricing and About interactions rely on hover state

Pricing cards and About value blocks change state on mouse enter/leave. The cards contain usable links in pricing, but the visual interaction is unavailable to keyboard and touch users and the pricing card itself is marked with a pointer cursor despite not being a control.

Evidence: [Packages.jsx](src/pages/Packages.jsx#L299), [About.jsx](src/pages/About.jsx#L187).

Recommended fix: make interactive states either purely decorative or expose them through focus/selection semantics.

#### CTA prop is ignored in the shared component

`ServicePage` passes `buttonText={data.ctaText}` to `CTA`, but `CTA` only accepts `title` and `text`. The service CTA title changes, but the primary button remains “Get a Custom Quote.” This may be intentional, but it does not match the apparent API.

Evidence: [ServicePage.jsx](src/pages/ServicePage.jsx#L177), [Blocks.jsx](src/components/Blocks.jsx#L4).

Recommended fix: either remove the unused prop or implement it explicitly.

#### Three.js warning indicates stale renderer configuration

The homepage creates `MeshLambertMaterial({ flatShading: true })`; the current Three.js runtime warns that `flatShading` is not a property of that material. The animation still renders, but the intended shading setting is not being applied.

Evidence: [home-scripts.js](src/legacy/home-scripts.js#L436).

Recommended fix: use the supported material/geometry configuration for the pinned Three.js version and verify the console is clean.

#### Service route aliases are inconsistent

Website and branding have legacy aliases, while `/marketing` and `/automation` resolve to the not-found page even though those names are used throughout the homepage and footer. `/services/marketing` and `/services/automation` do work.

Evidence: [App.jsx](src/App.jsx#L19).

Recommended fix: either add the short aliases or ensure all legacy/external references consistently use `/services/...` URLs.

#### Portfolio proof contains unverified-looking performance claims

The portfolio includes claims such as “99/100 Google Lighthouse,” “doubled organic lead inquiry submissions,” “100% data audit precision,” and “boosted 5-star review acquisition by 340%.” No supporting artifacts, dates, methodology, or client links are shown. This is a credibility and compliance risk for a site whose positioning emphasizes proof.

Evidence: [Portfolio.jsx](src/pages/Portfolio.jsx#L47), [Portfolio.jsx](src/pages/Portfolio.jsx#L162).

Recommended fix: add source context and dates, link to verifiable artifacts where possible, or soften unsupported claims.

### P3 / Low but important

#### Blog is not yet a functional content area

All three post cards are marked “Coming soon” and have no article links or detail routes. The page works as a resource placeholder, but the navigation label “Blog” implies published content.

Evidence: [Blog.jsx](src/pages/Blog.jsx#L12).

#### Legal pages are summaries, not full policies

Privacy and terms each contain only three short expandable sections. They do not identify a controller/contact framework in detail, cookie/analytics specifics, jurisdiction, limitations, dispute terms, accessibility, or effective/update dates. They may be insufficient for the business's actual legal requirements.

Evidence: [SimplePage.jsx](src/pages/SimplePage.jsx#L5).

#### External image dependency and no local assets

Portfolio, About, and service visuals use Unsplash URLs. The local image directory contains no actual assets. External image failure, privacy policy, licensing, and performance should be considered before production.

Evidence: [Portfolio.jsx](src/pages/Portfolio.jsx#L13), [About.jsx](src/pages/About.jsx#L160), [assets/images/README.md](src/assets/images/README.md).

#### Typography setup does not load the declared display fonts

CSS declares `Barlow Condensed`, `Barlow`, and `Archivo`, but the current [index.html](index.html#L1) does not import those fonts and no local font files are present. The browser therefore depends on fallback behavior, so the displayed typography may not match the intended design.

#### Reproducibility is weak

All runtime dependencies in [package.json](package.json#L1) use `latest`. A future install can change Vite, React, or React Router behavior without a source change.

Recommended fix: pin versions or use a controlled update process.

#### Metadata and sharing assets are incomplete

The document has a description and structured data, but no canonical link, Open Graph/Twitter metadata, favicon, robots policy, or sitemap is visible in [index.html](index.html#L1). Secondary page metadata is changed client-side, which is weaker for crawlers and social previews than server-rendered route metadata.

## Page-by-Page Audit

### Home `/`

Strongest conversion-focused page and visually distinct legacy experience. It has the richest proof and motion layer, but also the highest technical complexity. Main concerns: mobile header overflow, no mobile navigation, raw HTML/script injection, stale Three.js warning, form redirect to missing `/thanks.html`, and likely architecture drift from secondary pages.

### Services `/services`

Clear four-module overview. All cards route correctly to the four service detail pages. It shares the secondary layout and renders cleanly. The page uses a different design system namespace (`vxl-*`) layered over the global stylesheet, so future style changes need regression checks.

### Service details

`/services/websites`, `/services/branding`, `/services/marketing`, and `/services/automation` are generated by one reusable `ServicePage` template. This is a good consistency point. Each page has included deliverables, process, pricing snapshot, portfolio proof, FAQ, and CTA. Main concerns are the ignored `buttonText` prop, external imagery, and the mismatch between some advertised technologies and the actual current project implementation.

### Portfolio `/portfolio`

Richest case-study content and category grouping. Cards and modal work with pointer input, but not keyboard or assistive technology. Claims need evidence context. All image content is externally hosted.

### About `/about-us`

Good narrative structure: founder story, values, differentiation, process, CTA. Hover-only value-card animation is nonessential but should not imply an interaction that has no keyboard equivalent. The team image and founder claims should be checked for authenticity and usage rights.

### Packages `/packages`

Pricing is visible and segmented by service, which supports conversion. Tab switching works in runtime. Card hover state is pointer-specific. “No surprises” and “fixed pricing” claims should be reconciled with the terms page's scope-change language and any real contract terms.

### Contact `/contact-us`

Clear CTA, direct phone/email, and a labeled form with required name/email fields. The form is Netlify-marked but has no explicit success state or redirect, so deployment behavior must be tested. Inline styles make this page harder to maintain consistently with the rest of the site.

### Blog `/blog`

Readable resource landing page with useful field notes, but no published articles. Treat as a “Resources” page until article content and routes exist, or publish at least one complete article before promoting it as a blog.

### Industries `/industries`

The six industry cards communicate positioning, but every “See relevant work” link goes to the same portfolio page. There are no industry-specific case studies, filters, or anchors, so the link promise is broader than the destination.

### Privacy and Terms

Both pages are concise summaries and use the same conditional component. They are easy to scan but should be reviewed against the actual analytics, forms, hosting, Calendly, external image, and business/legal requirements.

## Recommended Remediation Order

1. Fix the form success flow and test both forms on a deployed Netlify preview.
2. Fix mobile header overflow and add an accessible mobile navigation menu.
3. Convert the service dropdown and portfolio modal/cards to keyboard-accessible controls.
4. Create a true not-found page and decide whether `/marketing` and `/automation` aliases are supported.
5. Remove the Three.js warning and clean up homepage readiness timer/listener teardown.
6. Load and pin the intended fonts; add favicon, canonical, social metadata, robots, and sitemap.
7. Reconcile homepage/secondary-page audience copy and validate every proof claim.
8. Replace “Coming soon” blog placeholders and improve industry-specific destinations.
9. Expand legal documents with professional review.

## Overall Assessment

**Build health:** Good.  
**Route rendering:** Good for declared routes.  
**Conversion readiness:** At risk until form success and mobile navigation are fixed.  
**Accessibility:** Needs substantial interaction work, especially portfolio and navigation.  
**Content consistency:** Mixed; homepage speaks mainly to local service businesses while secondary pages speak to startups, SMBs, founders, and enterprise buyers.  
**Production readiness:** Not ready for confident launch without deployed form testing, mobile fixes, and accessibility remediation.

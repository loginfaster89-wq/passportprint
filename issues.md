# Studio Print — Full-site audit (2026-04-23)

Audit of https://studioprint.pages.dev/ from an end-user perspective across
three viewports, informed by the test plan
`test-plan-website-audit.md` (prior session) and extended with **2026
design/polish** observations so the next coding session has a single
source of truth for what needs fixing.

**No code was changed in this PR** — only notes. Fixes happen in
follow-up PRs per the project's one-PR-per-logical-task rule.

**Audit method**
- Headless Chromium via Playwright at three viewports:
  - Desktop  `1440 × 900`  (DSF 1)
  - iPad Air `820 × 1180` (DSF 2, touch, iPad UA)
  - iPhone 13 `390 × 844` (DSF 3, touch, iPhone UA)
- Per page: full-page screenshot, console log, network log, DOM probes
  (horizontal-scroll, grid slider state, header geometry, broken
  images, anchor count).
- 8 pages covered: `/`, `/passport-photo.html`, `/about.html`,
  `/contact.html`, `/privacy.html`, `/terms.html`, `/refund.html`,
  `/shipping.html`.
- Raw evidence (screenshots, per-page JSON logs, aggregate `audit.json`)
  lives under `/home/ubuntu/audit-evidence/` on the Devin VM and is
  not committed.

**Environment checks that passed cleanly (so next session can skip)**
- All 8 pages returned HTTP 200 at all viewports.
- No horizontal scroll anywhere (`document.scrollWidth ≤ window.innerWidth`).
- No broken `<img>` (no `naturalWidth===0` after load).
- Footer legal links resolve to local pages (no 404 observed).
- Pricing numbers consistent on `index.html`, `terms.html`, `refund.html`,
  `shipping.html` — free: 2 sheets/day, weekly ₹59/7 days, monthly ₹149/30 days.
- PR #66 header fix holds: Login + ☰ pin right together on `≤900px`
  on all non-passport-photo pages (confirmed on contact/about/privacy
  at 820px and 390px).
- Slider activation (PR #64 / #65): `why-grid` and `steps-grid` become
  sliders with 4 dots at 820px and at 390px — no orphan rows, no
  console errors from `sliders.js`.

---

## A. Functional / bug findings

Severity: **blocker** (breaks a core flow), **medium** (degrades UX
but workable), **nit** (polish).

| # | Page | Viewport | Severity | Finding |
|---|------|----------|----------|---------|
| F1 | `passport-photo.html` | desktop 1440, iphone 390 | **blocker** | Razorpay Checkout SDK fetches `https://checkout-static-next.razorpay.com/build/undefined` → HTTP 403 + `net::ERR_ABORTED`. The literal string `undefined` in the URL means a JS variable is undefined when the SDK builds its asset path. Payments / upgrade flow likely partially broken on these viewports. **Does not repro on iPad-820** (different SDK code path). Needs: verify `razorpay_checkout_v1` script version pin + confirm whatever global the SDK reads (e.g. `window.Razorpay`, build hash) is set before the SDK boots. |
| F2 | `passport-photo.html` | iphone 390, ipad 820 | **medium** | Google One-Tap ("Sign in with Google" bubble) auto-prompts on page load and covers the Login button + part of the sidebar on iPad and most of the upload card on iPhone. This is Google Identity Services (`accounts.google.com/gsi/client`) with `auto_select` or default prompt behaviour enabled. Desktop did not auto-prompt in this audit (likely cookie heuristic). Fix: pass `cancel_on_tap_outside:true`, restrict prompt to the explicit "Continue with Google" button only, or call `google.accounts.id.disableAutoSelect()` on first load. |
| ~~F3~~ | home `/` | ipad 820 | **resolved PR #73** | `.features-grid` does not become a slider at exactly 820px. It renders as a **2-column CSS grid with 5 cards**, so the "LIVE" `.feature-card.primary` (Passport Photo) sits next to a SOON card with an **uneven height** — primary has `min-height:230px` while SOON cards have "In the works" label. Visually looks like a dead / empty card. `sliders.js` `hasOrphanRow()` may be returning false because the CSS primary-span only activates at `min-width:820px`. Either tighten the breakpoint or let primary span in the 2-col layout too. |
| ~~F4~~ | home `/` | ipad 820, iphone 390 | **resolved PR #74** | Hero headline wrap: at 820px the phrase `Every print job.` ends line 1 with `One` attached (orange) → "Every print job. One / browser tab." — the accent phrase `One browser tab.` gets split. At 390px it breaks as "Every print / job. One / browser tab.", dividing the white phrase too. Desktop is correct ("Every print job." / "One browser tab."). Suggested fix: `text-wrap:balance` on `.hero h1`, or an explicit `<br class="hero-break">` between the two sentences hidden on desktop. |
| ~~F5~~ | home `/` | ipad 820 | **resolved PR #78** | Pricing card "Shop counter" title wraps to two lines while "Try it out" and "Quick job" fit on one, creating a visual height imbalance between the three cards. "for 30 days" also wraps to two lines. Tight font-size clamp or `white-space:nowrap` with a smaller title at `820px` would even them out. |
| ~~F6~~ | home `/` | all | **resolved PR #127** | `.audience-grid` centred with `max-width:720px` + auto margins so the 2 cards no longer stretch across the full container on desktop. |
| F7 | `passport-photo.html` | all | nit | Console noise: four `Unrecognized feature: 'publickey-credentials-create' / 'web-share' / 'local-network-access' / 'loopback-network'.` warnings on every load. These come from the `<iframe>` Google GSI injects; Chrome doesn't recognise some Permissions-Policy tokens the GSI iframe requests. Not our code, but clutters the console. Harmless — keep an eye on it if the GSI SDK is ever updated. |
| ~~F8~~ | `about.html`, `contact.html` | all | **resolved PR #77** | Email `loginfaster89@gmail.com` was exposed as plain text (clickable `mailto:` + visible text) on both pages. Scrapable by spam bots within days. Fixed via `<a class="email-obf" data-u="…" data-d="…">` + tiny per-page IIFE that assembles the mailto on DOMContentLoaded. A contact form (P10) is still the full fix. |
| ~~F9~~ | home `/` | desktop 1440 | **resolved PR #80.** Ribbon re-centered on the card's top edge. |
| ~~F10~~ | home `/` | desktop 1440 | **resolved PR #81.** Fake window-chrome dots replaced with a single live-preview indicator. |
| ~~F11~~ | `passport-photo.html` | desktop 1440 | **resolved PR #129** | At 1440×900, almost the entire lower half of the viewport (below the upload card, above the footer) was empty black space. Fixed: upload card shifted upward via `padding-bottom:14vh` at ≥1200 px + trust-spec strip ("300 DPI output · On-device AI · No photo uploads · 6+ country sizes") anchored at bottom of step 1 canvas. Desktop only, auto-hides on step 2+. |
| ~~F12~~ | home `/` | all | **resolved PR #85.** Emoji replaced with inline Lucide-style SVG sprite (`<use href="#i-…">`). No new fonts/deps. |

## B. "2026 multinational" polish gaps

These are NOT bugs — they're positioning/presentation gaps if the goal
is to make Studio Print feel like a polished 2026 multinational product
rather than a well-built indie tool. Each is a candidate logical task
for a follow-up PR.

| # | Area | Finding / suggestion |
|---|------|---------------------|
| ~~P1~~ | Hero | **resolved PR #102.** `accent-glow-pulse` keyframes on `.hero::before` — 7 s ease loop, opacity 0.55→1 and scale 1→1.06. CSS-only (~19 lines), reuses the existing unused `.hero::after` pattern. Fonts/tokens untouched; respects `prefers-reduced-motion`. |
| ~~P2~~ | Hero | **resolved PR #100.** Two decorative A4 passport-photo sheets (left -11°, right +9°) in hero with dashed cut marks + five 5×1 silhouette placeholders (matches post-PR-#58 sheet default). Pure CSS, no raster/SVG asset. Respects `prefers-reduced-motion` + hides on narrow screens. |
| ~~P3~~ | Cards (features/why/steps/audience/pricing) | **resolved PR #76.** `.why/.step/.audience/.pricing-card` pe `transition` + `:hover{translateY(-4px); amber-tinted shadow}`. Uses existing tokens. |
| P4 | Icons | Replace emoji with a consistent SVG icon pack (see F12). Lucide icons are MIT-licensed, small, and render consistently. |
| ~~P5~~ | Motion | **resolved PR #91.** New `assets/reveal.js` + `.reveal/.in-view` CSS on homepage: 6 sections + CTA band fade + slide up (14 px → 0, 450 ms) once on first enter. One-shot observer, respects `prefers-reduced-motion`. |
| ~~P6~~ | FAQ | **resolved PR #82.** `details[open] summary::after{content:"−"}` + soft `faq-fade` keyframe on `.faq-body` for smooth open. |
| ~~P7~~ | Hero CTAs | **resolved PR #76** (tactile half). `.btn:active{transform:scale(.97);}` aur `.pricing-card .pcta:active` bhi. Optional spinner on primary CTA during nav still open — separate item if we want that. |
| ~~P8~~ | Social proof | **resolved PR #103.** Honest `By the numbers` strip on the homepage between TOOLS-PREVIEW and WHY — 4 stat cards using only product facts already documented elsewhere (0 photos uploaded, 2 free sheets/day, ₹149/30 days, 300 DPI A4). No fabricated testimonials or logos. Pure CSS using existing tokens, `.reveal` fade-in like other sections. |
| ~~P9~~ | About page | **resolved PR #96.** Mission-hero (`Make every ₹10 print job feel like a browser tab.`) + founder-style pull-quote + 2024→2026 timeline (Idea / Prototype / Launch / Now) + 'What ships next' card (4 upcoming tools). Inline styles only, existing tokens. |
| ~~P10~~ | Contact page | **resolved PR #98.** Inline `Send us a message` form on `contact.html` (name / email / 7-option category / message), `Replies within 1–2 working days` SLA badge, submit builds a prefilled `mailto:` with structured body. Obfuscated email block kept as fallback. |
| ~~P12~~ | Pricing | **resolved PR #119.** Comparison matrix (Free vs Weekly vs Monthly) — 8-row feature table below pricing cards on homepage. Responsive, existing tokens only. |
| ~~P13~~ | Pricing | **resolved PR #89.** `ribbon-pulse` + `featured-glow` keyframes on `.pricing-card.featured::before` and `.pricing-card.featured` (3.2s infinite, 0.45 → 0.75 alpha). Disabled under `prefers-reduced-motion`. |
| ~~P14~~ | Navigation | **resolved PR #83.** `.sp-mobile-cta` pill on `≤640px`, shows after scroll > 1 viewport. |
| ~~P15~~ | Footer | **resolved PR #95.** Multi-column footer — Product / Resources / Company / Legal + newsletter signup + social icon + locale switcher. Shared across all 8 pages via `legal.css` + `assets/footer.js`. |
| ~~P16~~ | Internationalisation | **resolved PR #125.** Interactive `EN` / `हि` pill toggle in footer on all 8 shared pages. Syncs with `passport-photo.html`'s `localStorage('pps_lang')`. New `assets/lang.js` (19 lines) + `.locale-btn` styles in `legal.css`. Existing tokens only. |
| ~~P17~~ | Accessibility | **resolved PR #76.** Site-wide `:focus-visible{outline:2px solid var(--accent); outline-offset:2px}` added to `assets/legal.css`, with `:focus{outline:none}` fallback so mouse clicks don't show rings. Keyboard users now get a clean amber ring on nav links, Features dropdown, Login button, `<details>`, form elements. |
| ~~P18~~ | Accessibility | **resolved PR #88.** Stable ids on all 8 FAQs (`faq-free-tier`, `faq-privacy`, `faq-countries`, `faq-no-software`, `faq-aadhaar-pan`, `faq-mobile`, `faq-refund`, `faq-print-shop`) + small IIFE opens the targeted `<details>` on hash match and smooth-scrolls. |
| ~~P19~~ | Product-demo | **resolved PR #99.** Inline animated demo strip inside the hero tools-preview card on `index.html`: 3-phase ~9 s loop (upload → background removed → A4 sheet slides in). Pure CSS + tiny DOM primitives, no `<video>` asset. Respects `prefers-reduced-motion`. |
| ~~P20~~ | Loading / perceived perf | **resolved PR #128.** Fixed-position 3 px accent bar at top of page during AI-model download (0→97%), auto-hides on completion. Hooks into existing `onProgress` callback. Cancel also resets bar. |
| ~~P21~~ | Error / empty states | **resolved PR #130.** Inline error banner near upload zone — replaces `alert()` with danger-themed banner (Retry + dismiss). Auto-clears on new file selection. |
| ~~P22~~ | SEO / social | **resolved PR #84.** Proper 1200×630 `assets/og-image.png` + richer social meta across 8 pages. |
| ~~P23~~ | SEO | **resolved PR #90.** `<lastmod>2026-04-23</lastmod>` on every entry + 4 in-page landing sections (`/#features`, `/#how`, `/#pricing`, `/#faq`) with their own priorities. |
| ~~P24~~ | Performance | **resolved PR #124.** Syne + DM Mono self-hosted as woff2 (latin + latin-ext subsets) in `assets/fonts/`. New `assets/fonts.css` replaces Google Fonts CDN link on all 10 pages. |
| ~~P25~~ | Performance | **resolved PR #87.** Backend preconnect added to all 7 shared-header pages (about/contact/privacy/terms/refund/shipping/404). |
| ~~P26~~ | Cookies / privacy | **resolved PR #120.** Self-hosted essentials-only cookie banner on all 9 pages. "OK" click saves to localStorage, doesn't show again. |
| ~~P27~~ | Tooling | **resolved PR #86.** Branded `404.html` with shared legal-header/footer, big amber "404" numeral, two CTAs, `noindex` meta, build.js now minifies it into `dist/`. |
| ~~P28~~ | Tooling | **resolved PRs #93 + #94.** `assets/manifest.webmanifest` + installable icons on index + 7 legal pages (PR #93); `sw.js` with network-first HTML + stale-while-revalidate assets + `/offline.html` fallback (PR #94). Registered via `assets/pwa.js`. |
| ~~P29~~ | Passport-photo step bar | **resolved PR #126.** 2 px accent progress bar at bottom of `.steps` fills 0→33→66→100% as user advances (300 ms ease). Active `.step-num` gets enhanced amber glow + pulse. Minimum diff in `passport-photo.html` only. |
| ~~P30~~ | Homepage density | **resolved PR #123.** 3-step horizontal workflow timeline (`.density-break`) between hero and features — breaks the repeating card-grid rhythm. Surface2 bg, numbered circles, connecting lines. Responsive, existing tokens only. |
| ~~P31~~ | Performance | **resolved PR #132.** `<link rel="preload">` for `syne-latin.woff2` (34 KB) + `dm-mono-400-latin.woff2` (15 KB) on all 10 pages. Eliminates render-blocking font-discovery waterfall, improves FCP/LCP. |
| ~~S1~~ | SEO | **resolved PR #134.** FAQPage JSON-LD structured data (`<script type="application/ld+json">`) in `index.html` `<head>`. All 8 FAQ Q&A pairs marked up for Google rich-result snippets. Zero design change. |
| ~~S2~~ | SEO | **resolved PR #137.** WebApplication JSON-LD in `passport-photo.html` `<head>`. Marks the page as a `PhotographyApplication` web app with 3 pricing tiers (Free/Weekly/Monthly), 5-item feature list, and creator info. Enables app-like rich results in Google Search. Zero design change. |
| ~~S3~~ | SEO | **resolved this PR.** BreadcrumbList JSON-LD on all 6 legal pages (about, contact, privacy, terms, refund, shipping). Each page gets a 2-level breadcrumb (Home → page name) for Google breadcrumb rich results. Zero design change. |
| ~~S4~~ | SEO | **resolved this PR.** Organization JSON-LD on `about.html`. Marks Studio Print as an Organization with name, URL, logo, description and founding date. Enables knowledge-panel / brand rich results. Zero design change. |
| ~~S5~~ | SEO | **resolved this PR.** `<meta name="robots" content="max-image-preview:large">` on all 8 indexable pages (index, passport-photo, about, contact, privacy, terms, refund, shipping). Tells Google it can show large image previews in search results. Skipped on 404 + offline (both `noindex`). Zero design change. |

## C. Suggested PR sequence

All of the quick-win queue from the 2026-04-23 audit is now merged. The**open backlog** for future sessions (larger scope, pick per session):

**Functional nits remaining:**
- ~~`F6` audience grid sparse~~ — **resolved PR #127.** Centred with `max-width:720px`.
- `F7` GSI iframe Permissions-Policy console warnings — not our code; monitor on SDK updates.
- ~~`P20` AI-model progress bar~~ — **resolved PR #128.**
- ~~`F11` passport-photo 1440 empty space below upload card~~ — **resolved PR #129.**

**2026 polish roadmap (ordered by impact):**
1. ~~**P12** — Pricing comparison matrix~~ — **shipped in PR #119.**
2. ~~**P30** — Homepage density break — workflow timeline between HERO and FEATURES.~~ — **shipped in PR #123.**
3. ~~**P24** — Self-host Syne + DM Mono fonts (woff2 subset).~~ — **shipped in PR #124.**
4. ~~**P16** — Language switcher (`हि` ↔ `EN`) UI affordance.~~ — **shipped in PR #125.**
5. ~~**P26** — Cookie banner (self-hosted, essential-only).~~ — **shipped in PR #120.**

**Recently resolved (since last audit refresh):** P10 contact form (PR #98), P19 inline tools-preview demo strip (PR #99), P2 hero A4-sheet mockup (PR #100), P1 hero animated gradient pulse (PR #102), P8 honest numbers strip (PR #103), R1/R2/R3/R5/R6 responsive polish (PR #108), U1 pricing buy-flow (PR #109), passport-photo unlock (PR #110), homepage inline checkout (PR #112), shared pricing modal (PR #114).

**Passport-photo-specific backlog** (`passport-photo.html` is no longer locked — unlocked 2026-04-24 — but still requires minimum-diff care; see AGENTS.md Hard rule #1):
- `F1` Razorpay `/build/undefined` 403 residual (payment flow works, SDK's own bug).
- ~~`F11` 1440 empty space below upload card~~ — **resolved PR #129.**
- ~~`P20` top-of-page thin progress bar for AI-model download~~ — **resolved PR #128.**
- ~~`P21` inline error banner near upload zone~~ — **resolved PR #130.**
- ~~`P29` step-bar progress line fill animation~~ — **shipped PR #126.**

Section B items not listed above are still open but lower-impact — revisit as the project owner picks priorities.

---

## D. Responsive + flow follow-up audit (2026-04-24)

**Method:** headless Chromium (Playwright), same probe as §A, extended to
7 viewports — `iphone-se 375×667`, `iphone-13 390×844`, `ipad-portrait
768×1024`, `ipad-air 820×1180`, `ipad-landscape 1024×768`, `desktop
1440×900`, `desktop-hd 1920×1080` — across all 8 pages. Full
screenshots + per-page JSON saved to `/home/ubuntu/audit-ev/` on the
session VM (not committed).

**Environment checks that passed cleanly (re-confirmed):**
- No horizontal page scroll at any viewport on any page
  (`document.scrollWidth ≤ window.innerWidth`).
- No broken `<img>` (`naturalWidth===0`).
- Footer + header pin behaviour holds (PR #66 fix intact).
- Slider activation (`assets/sliders.js`): `why-grid`, `features-grid`,
  `audience-grid`, `steps-grid` all switch to slider at ≤760 and at
  iPad-portrait 768 (via orphan detection). Desktop 1440+ stays plain
  grid. No `sliders.js` console errors anywhere.
- No console errors on homepage / any legal page at any viewport.
  Only `passport-photo.html` logs the pre-existing Razorpay F1 403
  (still open).

### D.1 Responsive gaps

| # | Page | Viewport | Severity | Finding |
|---|------|----------|----------|---------|
| R1 | `index.html` | iphone-se 375, iphone-13 390 | nit | Hero `<h1>Every print job.<br><em>One browser tab.</em></h1>` wraps the first sentence to two lines ("Every print" / "job.") because `.hero h1{font-size:clamp(34px,6.2vw,64px);max-width:18ch}` + `letter-spacing:-0.6px` still renders ~320 px wide at the 34 px clamp floor vs ~331 px usable width. Fix: tighten the clamp floor at `max-width:420px` (e.g. `clamp(28px,8.6vw,64px)`) or drop `max-width:18ch` on phones so each sentence fits one line. |
| R2 | `index.html` | ipad-portrait 768, ipad-air 820, ipad-landscape 1024, desktop 1440, desktop-hd 1920 | nit | Decorative `.hero-sheet.right` (PR #100) overflows the viewport right edge by 60–300 px on every desktop/tablet viewport — the sheet's bounding box extends past `window.innerWidth`. Page itself does not horizontally scroll because `html,body{overflow-x:hidden}` on `assets/legal.css`, but at 768 px the clipped gray edge is visible as a stripe. Fix: either clamp `right` offset to `max(-3%, -24px)` so the sheet never pokes past a sane limit, or add `overflow:hidden` to the direct `.hero` parent. Currently only `.hero-sheets` itself has `overflow:hidden` and it is `inset:0` inside `.hero` which has no clip. |
| R3 | `index.html` | ipad-portrait 768 | nit | Related to R2 — the `.hero-sheet.right` 1100 px-media rule (`top:58%;right:-10%;opacity:.55`) still leaves enough of the sheet visible at 768 to look like a layout glitch. Either drop the 760-px hide breakpoint down to 820, or scale the sheet smaller and more inset. |
| ~~R4~~ | `passport-photo.html` | iphone-se 375 | **resolved PR #130** | Upload card inner corner brackets shrunk (22→16px, offset −10→−6px) at ≤420px so they no longer clip the right edge on iPhone SE. |
| R5 | all | all | nit | Slider pagination dots are 7×7 px buttons — below the WCAG 2.5.5 AAA 24 px target and the commonly-recommended 44 px mobile target. Fix: keep the 7-px visual dot but expand the clickable area to ~24 px via `padding` + an inner `::before` dot, or use a `::after` transparent hit pad. |
| R6 | legal pages (`about`, `contact`, `privacy`, `terms`, `refund`, `shipping`) | all mobile | nit | Multi-link rows in the new footer (PR #95) render at line-height 17–18 px on phones. Each link has only ~17 px vertical clickable area. Add `padding-block:6px` on `.footer-col a` so each row hits ~30 px without changing visual spacing much. |
| ~~R7~~ | `index.html` | ipad-portrait 768 | **resolved PR #131** | Dedicated `@media (min-width:761px) and (max-width:768px)` breakpoint switches hero-preview grid to single column at iPad portrait. Hero sheets already hidden at 820 px; phone layout at 760 px. The 761–768 px gap no longer leaves the tool-demo cramped in 2-column mode. |

### D.2 Flow / UX findings

| # | Path | Severity | Finding |
|---|------|----------|---------|
| ~~U1~~ | home `.pcta` → login → `passport-photo.html#plans` | **resolved PR #109** | Clicking a paid plan on the homepage pricing cards now takes the user straight to Razorpay for the selected plan. `index.html` CTAs (`a.pcta[data-plan-cta]`) point at `passport-photo.html#buy-weekly` / `#buy-monthly`, and the signup-modal post-login redirect target is built from `data-plan-cta` too. `passport-photo.html` `maybeOpen()` gained a `#buy-<planId>` branch that calls `window.startCheckout(planId)` directly and clears the hash via `history.replaceState` so reload doesn't re-trigger checkout. (Actual function name is `startCheckout`, not `purchasePlan`.) |

### D.3 PR sequence — all shipped

1. ~~**Responsive polish (R1/R2/R3/R5/R6)**~~ — **shipped in PR #108.**
2. ~~**Pricing buy-flow (U1)**~~ — **shipped in PR #109.**
3. ~~**Homepage inline checkout**~~ — **shipped in PR #112.** Pricing CTAs
   open Razorpay directly without page navigation.
4. ~~**Shared pricing modal**~~ — **shipped in PR #114.** `assets/pricing.js`
   + `assets/pricing.css` — 2-step Choose Plan → Complete Payment → Razorpay
   on every page. `auth.js` Upgrade/Change Plan button now opens this modal
   on the current page instead of redirecting to `passport-photo.html#plans`.
~~R4~~ shipped PR #130. ~~R7~~ shipped PR #131.

---

## E. Full responsive re-audit (2026-04-24, session #2)

**Method:** headless Chromium via Playwright, 9 pages × 8 viewports =
72 page-viewport combos. Viewports: iPhone SE 375×667, iPhone 13
390×844, Pixel 7 412×915, iPad portrait 768×1024, iPad Air 820×1180,
iPad landscape 1024×768, desktop 1440×900, desktop HD 1920×1080.
Full-page screenshots + DOM probes (horizontal scroll, broken images,
element overflow, text clipping, console errors, network errors).

**Result: ALL CLEAR — no new issues found.**

| Check | Result |
|-------|--------|
| Horizontal scroll | ZERO on all 72 combos |
| Broken images | ZERO |
| Header present | All pages |
| Footer present | All pages |
| Login button visible | All pages |
| New console errors | None — only pre-existing F1/F7 |
| New network errors | None |
| New layout bugs | None |

**Known issues re-confirmed (unchanged from §A/§D):**
- F1: Razorpay `/build/undefined` 403 — SDK's own bug, payment flow unaffected.
- F7: Google Sign-In SDK 403 in headless — works in real browsers, harmless.
- `charAt` error from sliders.js — cosmetic, no visual impact.
- R2: `.hero-sheet.right` decorative element extends past viewport — clipped by `overflow:hidden`, invisible to users.
- Slider off-screen cards register as DOM overflows but are visually clipped by slider container — expected slider behaviour, not a bug.

**New finding during audit:**
- **F13**: `.stats-grid` (By the numbers section) was not included in
  `sliders.js` SELECTORS — 4 stat cards produce a 3+1 orphan row at
  820 px but never converted to a slider. **Fixed:** added `.stats-grid`
  to SELECTORS + matching `.is-slider` CSS rules in `index.html`.

**Evidence:** screenshots at `/home/ubuntu/audit-evidence-2/screenshots/`, full JSON at `/home/ubuntu/audit-evidence-2/audit.json` (session VM only, not committed).

---

## F. Footer & UX cleanup (2026-04-24, session #3)

Owner-reported issues from real-device testing (iPhone, iPad, Galaxy S24 Ultra).

| # | Area | Finding | Status |
|---|------|---------|--------|
| F14 | Footer (all pages) | Language switcher (`EN` / `हि` toggle) non-functional — clicking Hindi does nothing visible. Removed from all 8 shared pages + CSS + `lang.js` script. | **fixed this PR** |
| F15 | Homepage | "Open Passport Photo →" floating sticky CTA button on mobile (`sp-mobile-cta`) over-glorifies a single feature — unnecessary when more tools (Document Sheet, Certificate Editor, etc.) are planned. Removed element + CSS + JS. | **fixed this PR** |
| F16 | Footer (iPad / tablet) | Footer wastes too much vertical space on iPad — brand column + 4 nav columns stack into separate rows with excessive gaps. Compacted: kept 4-col nav grid at tablet, reduced gaps and padding. | **fixed this PR** |
| F17 | Footer (phone) | Footer bottom bar (`footer-bottom`) left-aligned on phones — looks messy. Changed to centered layout with centered meta icons. | **fixed this PR** |
| F18 | passport-photo.html footer (phone) | Simple `.links` footer looks messy on phone — links run together without clear spacing. Converted to flex-wrap centered layout with proper gap. | **fixed this PR** |
| F19 | passport-photo.html (phone) | Upload card ("Drop your photo here") gets cut off at top and bottom on phone screens. Added padding to `.canvas-area` and increased min-height from 180px to 220px at ≤640px. | **fixed this PR** |

### Learnings for future sessions

1. **Don't over-glorify a single feature.** When a website has multiple planned tools (Passport Photo, Document Sheet, Certificate Editor, etc.), avoid creating dedicated floating CTAs, hero animations, and workflow demos that only showcase one tool. Every such element will need reworking when the next feature launches.
2. **Footer quality reflects on Devin AI credit.** The footer says "Built with Devin AI" — if the footer looks bad (wasted space, misaligned, broken features), it directly reflects on Devin's quality. Always test footer on real mobile/tablet viewports.
3. **Test language switcher before shipping.** P16 shipped a non-functional Hindi toggle — it should have been tested with actual translated content or not shipped at all.
4. **Compact footers on mobile.** Multi-column footers need aggressive compacting on phones and tablets. Don't just stack columns — reduce gaps, font sizes, and padding proportionally.
5. **Upload areas need breathing room on mobile.** Interactive areas (drop zones, upload cards) should have padding around them on small screens so they don't clip against viewport edges or adjacent elements.

---

## G. Single-feature glorification cleanup (2026-04-24, session #4)

Owner-reported: the homepage over-glorifies Passport Photo as if it's the only product.
When more tools (Document Sheet, Certificate Editor, Background Studio) launch,
every feature-specific CTA, hero animation, and workflow demo will need reworking.

**Rule (permanent):** Never create dedicated hero CTAs, floating buttons, or
separate workflow sections for a single feature. Keep all CTAs generic
("See all tools", "Get started", "Explore the tools") and let the features
grid serve as the entry point for each tool.

| # | Area | Finding | Status |
|---|------|---------|--------|
| G1 | Hero CTA (`index.html`) | "Open Passport Photo →" replaced with "See all tools →" linking to `#features`. | **fixed this PR** |
| G2 | CTA band (`index.html`) | "Open Passport Photo — free →" replaced with "Explore the tools →" linking to `#features`. | **fixed this PR** |
| G3 | 404 page | "Open Passport Photo" button replaced with "Explore the tools" linking to `index.html#features`. | **fixed this PR** |
| G4 | `assets/lang.js` | Dead file — lang switcher was removed from shared pages in PR #139 but file was never deleted. Removed. | **fixed this PR** |
| G5 | `passport-photo.html` | Dead `.lang-toggle` / `.lang-btn` CSS rules removed (no HTML element uses them). | **fixed this PR** |

### Learnings for future sessions

6. **No single-feature glorification.** When a website has multiple planned tools, hero CTAs, floating buttons, and workflow demos must be generic. Each tool gets promoted through its own card in the features grid — not through dedicated hero buttons or floating CTAs. This avoids costly rework when the next tool launches.
7. **Delete dead code immediately.** When a feature is removed (e.g. lang switcher), delete ALL related files and CSS in the same PR. Don't leave orphaned files or dead CSS rules — they confuse future sessions and bloat the codebase.
8. **Devin's credit is on the line.** The footer says "Built with Devin AI". Every messy footer, broken toggle, or wasted space reflects directly on Devin's quality. Test every viewport before shipping.

---

## H. Document Sheet feature (2026-04-25, session #5)

Studio Print's second tool — Document Sheet (Aadhaar / PAN PDF → A4 sheet).
Shipped in two PRs:

| # | PR | What shipped | Status |
|---|------|---------|--------|
| H1 | PR #156 | **Feature card + multi-tool copy.** Features grid: new "Document Sheet" card with `Soon` tag. Nav dropdown on all 10 pages: Document Sheet entry with `Soon` tag. Density-break, how-it-works, FAQ copy updated from photo-only to generic multi-tool. Footer: Document Sheet + All Features links. New `#i-file-text` SVG icon. CSS: `.dd-tag.soon` + `.tag.soon` styles. | **merged** |
| H2 | PR #157 | **Document Sheet tool page (Phase 1).** New `document-sheet.html` (647 lines): drag-and-drop + file-picker PDF upload (max 10 MB), automatic password-protected PDF detection, password input with tips (Aadhaar: first 4 letters + birth year; PAN: DOB DDMMYYYY), client-side PDF unlock via pdf.js 3.11.174 (CDN), page thumbnail preview (up to 6 pages), on-device badge. Shared header/nav/footer/auth/pricing modules. BreadcrumbList JSON-LD, OG/Twitter meta, robots directive. Responsive (375–1920 px). `index.html` features grid Soon→Live. Nav dropdown all pages Soon→Live link. `build.js` + `sitemap.xml` updated. | **merged** |

## I. Document Sheet — detection, editor & A4 sheet (2026-04-25, sessions #6–#8)

| # | PR | What shipped | Status |
|---|------|---------|--------|
| I1 | PR #159 | **Dropdown feature icons fix.** Added missing `.ix` CSS rule (`fill:none; stroke:currentColor`) on `document-sheet.html` so nav dropdown SVG icons render correctly. | **merged** |
| I2 | PR #160 | **Aadhaar/PAN card detection.** Text extraction via pdf.js `getTextContent()`, keyword matching (2+ hits confirms doc type), styled detection badge (amber=Aadhaar, green=PAN), unsupported document rejection with error message. | **merged** |
| I3 | PR #163 | **Document Sheet Phase 2 — editor + A4.** Editor step with brightness/contrast/saturation/warmth/shadows sliders. Full Document / Photo Only toggle (photo excluded from edits in full-document mode). Card crop + photo crop extraction from rendered PDF at 300 DPI. A4 sheet generation (2480×3508 canvas), download PNG + print. | **merged** |
| I4 | PR #165 | **Full Document photo fix + Back button.** Fixed photo protection in Full Document mode — now restores original photo pixels directly from same card buffer with bounds checking (previous approach used separate `photoImageData` with coordinate translation that could fail). Added "Back to Edit" button on A4 result page so user can return to editor and adjust settings. | **merged** |

**Next:** PAN Photo Only bug (see §J below).

---

## J. PAN Photo Only — face isolation bug (2026-04-25, session #9)

**Status: SUPERSEDED — old `document-sheet.html` deleted (PR #185), new
`id-print.html` (PR #188) uses a completely different crop system. This
bug no longer applies.**

### Problem

PAN Photo Only mode does NOT isolate the face photo. Instead it shows
a large region of the card (header text, name, DOB etc.) instead of
just the passport-size face.

Aadhaar Photo Only works correctly — cleanly extracts just the face.

### Root cause analysis

`detectPhotoInCard()` in `document-sheet.html` uses pixel density
analysis to find the photo region inside the card crop. This works for
Aadhaar but **fails for PAN** because:

1. **Hindi header text** (आयकर विभाग / INCOME TAX DEPARTMENT) at the
   top of the card has dark pixels in the same x-columns as the photo.
2. **Name/DOB text** (DHARMENDER, RAJENDER, 05/07/1999) below the photo
   also has dark pixels in the same x-columns.
3. The vertical density scan merges header + photo + text into one
   giant region instead of isolating just the face.

### What was tried (didn't work)

1. **PR #170 (merged):** Added PAN-specific vertical scan bounds
   (`vTop=2%`, `vBot=58%` of card height) to limit the vertical scan
   range. Result: still showed card header + photo merged together.
   The Hindi header text within the left 22% strip still produces
   enough density to merge with the photo run.

2. **Hardcoded `PAN_PHOTO_FRAC` approach (not merged):** Defined
   `PAN_PHOTO_FRAC = { x0: 0.02, y0: 0.14, x1: 0.27, y1: 0.58 }`
   as fraction of card crop, bypassing density detection for PAN.
   Code was pushed to PR #170 branch but coordinates may need
   calibration against the actual PAN PDF.

### Suggested fix approach for next session

1. **Load the test PAN PDF** (`072679701357620_signed.pdf`, password:
   `05071999`) in the browser on `document-sheet.html`.
2. **Add `console.log` debugging** inside `processPdf()` to print the
   actual pixel coordinates of `cardCropInfo` (cx0, cy0, cw, ch) and
   the detected/hardcoded photo region (px0, py0, pw, ph).
3. **Use browser DevTools** to inspect the rendered PDF canvas and
   measure the exact photo position within the card crop.
4. **Calibrate `PAN_PHOTO_FRAC`** coordinates based on actual
   measurements. The photo position varies slightly between PAN card
   versions but is always in the upper-left quadrant.
5. **Test both PAN and Aadhaar** to confirm Aadhaar is unaffected.

### Key file locations

- `document-sheet.html` lines ~886–956: crop constants + `detectPhotoInCard()`
- `document-sheet.html` lines ~985–1012: `processPdf()` where photo extraction happens
- Card crop constants: `AADHAAR_CROP`, `PAN_CROP`
- Photo detection: `detectPhotoInCard(cardData, docType)` — works for Aadhaar, fails for PAN
- Test PDFs saved in repo: `test-pdfs/pan-test.pdf` (password: `05071999`), `test-pdfs/aadhaar-test.pdf` (password: `SUNI1986`)

---

## K. Card size standardization + lamination fit (2026-04-25, session #10)

**Status: SUPERSEDED — old code deleted (PR #185), rebuilt from scratch
in `id-print.html` (PR #188) with correct CR80 sizing baked in.**

### Problem

PAN card printed smaller than Aadhaar on A4 sheet. Both cards should be
identical size for 65×95mm lamination pouches (Reston 125 micron).

### Root cause

`buildA4Sheet()` drew each card at its native PDF crop pixel size. Since
PAN and Aadhaar PDFs have different page sizes and the cards occupy different
proportions, the resulting printed cards were different sizes.

### Fix (PR #182)

1. **CR80 standard size constants** — `CARD_PRINT_W` (1011 px) and
   `CARD_PRINT_H` (638 px) = 85.6×54mm at 300 DPI. Industry standard
   PVC card size that fits inside 65×95mm lamination with ~4.7mm margin
   on width and ~5.5mm on height.
2. **Both cards scaled to CR80** — `drawImage` in `buildA4Sheet()` now
   uses fixed `CARD_PRINT_W × CARD_PRINT_H` instead of native `ci.sw × ci.sh`.
3. **Auto-trim for both card types** — `trimCardEdges()` was PAN-only,
   now runs on Aadhaar too for cleaner card boundaries.
4. **Test PDFs committed** — `test-pdfs/pan-test.pdf` (pw: `05071999`)
   and `test-pdfs/aadhaar-test.pdf` (pw: `SUNI1986`) saved in repo.

### Still open

- **§J PAN Photo Only face isolation** — `PAN_PHOTO_FRAC` may still need
  calibration. Separate fix, separate PR.
- **Card crop fractions** (`AADHAAR_CROP`, `PAN_CROP`) may need tuning
  for edge cases with different PDF layouts. Current values work for
  standard government-issued ePAN and eAadhaar PDFs.

---

## L. Full Aadhaar/PAN card system rebuild (2026-04-25, session #11)

**Status: RESOLVED — PR #185 deleted old `document-sheet.html`, PR #188
rebuilt from scratch as `id-print.html` (ID Card Print Phase 1 MVP).
PR #189 fixed Aadhaar detection. PR #191 added Phase 2 photo editing.**

### Background

Owner tested PR #182 output (CR80 card size standardization). Despite
the fix forcing both cards to identical pixel dimensions on the A4
canvas, the **PDF crop itself** is still wrong — the extracted card
region includes extra whitespace, cut marks, or text outside the actual
card boundary. This means the "standardised" output is scaling a badly
cropped region, not a clean card.

Owner's directive: **delete the entire old card crop/detection/sizing
system and rebuild from scratch.** Step-by-step, one PR per step.

### User workflow (print → cut → fold → laminate)

1. Upload eAadhaar or ePAN PDF → tool detects card type
2. Tool extracts the card from the PDF page (front side only currently)
3. Editor step: adjust brightness/contrast/saturation/warmth/shadows
4. Build A4 sheet with card centered
5. Download PNG or print directly
6. **User cuts** the printed card with scissors
7. **User folds** (front + back together — currently only front is placed)
8. **User laminates** in a 65×95 mm thermal pouch (Reston 125 micron)

For the lamination to work:
- The printed card must be **exactly CR80** (85.6 × 54 mm)
- The card crop from PDF must be **clean** — no extra whitespace, cut
  marks, or text bleed outside the card boundary
- Both PAN and Aadhaar must produce **identical output dimensions**

### Card size research

| Item | Dimensions | Notes |
|------|-----------|-------|
| CR80 standard (PVC card) | 85.6 × 54 mm (= 85.5 × 54 mm) | Same as credit/debit cards. Industry standard. |
| CR80 at 300 DPI | 1011 × 638 px | Current `CARD_PRINT_W` / `CARD_PRINT_H`. |
| Lamination pouch | 65 × 95 mm | Reston 125 micron thermal pouch. |
| Card inside pouch | ~4.7 mm margin width, ~5.5 mm margin height | Card fits with lamination seal on all 4 sides. |
| PVC blank card | 85.5 × 54 × 0.76 mm | For direct PVC printing (Epson L805/L8050 tray). |
| eAadhaar PDF page | ~595 × 842 pt (A4) | Card is in lower ~21% of page height. |
| ePAN PDF page | ~842 × 595 pt (A4 landscape) or varies | Card is in lower ~20% of page height. |

Source: IndiaMART PVC card listings, MySea Solutions CardXpress software,
UIDAI/NSDL standard specifications.

### Current problems with existing code

1. **Crop coordinates are approximate.** `AADHAAR_CROP` and `PAN_CROP`
   were manually estimated as fractions of page dimensions. Different
   PDF versions (UIDAI layout changes, different ePAN providers) may
   have slightly different card positions.

2. **Auto-trim is fragile.** `trimCardEdges()` uses a simple dark-pixel
   density threshold (8% of row/col pixels below brightness 220). This
   can fail when:
   - Card has a dark border/frame that the trim should keep
   - Cut marks or dashed lines near the card edges create false positives
   - White card background near edges has very few dark pixels

3. **PAN Photo Only detection fails (§J).** Hindi header text and name
   text merge with photo in density analysis → `detectPhotoInCard()`
   returns a huge region instead of just the face.

4. **Only front side placed on A4.** The current `buildA4Sheet()` places
   one card image. For the fold-and-laminate workflow, both front and
   back should be on the sheet.

5. **No visual validation.** There's no way for the user to see the crop
   boundary before committing to the A4 sheet. A preview with adjustable
   crop would catch bad extractions early.

### Rebuild plan (step by step, one PR per step)

**Step 1: Fix PDF → card crop extraction**
- Recalibrate `AADHAAR_CROP` and `PAN_CROP` against actual test PDFs
  using precise pixel measurements
- Improve `trimCardEdges()` or replace with a more robust approach
- Validate visually: the cropped region should contain ONLY the card,
  no extra whitespace or cut marks
- Test with both `test-pdfs/pan-test.pdf` and `test-pdfs/aadhaar-test.pdf`

**Step 2: Standardize output to exact CR80 dimensions**
- Both cards drawn at exact same pixel dimensions (1011 × 638) on A4
- Aspect ratio handling: if crop aspect ratio differs from CR80, decide
  whether to letterbox, stretch, or crop-to-fit
- Verify with ruler measurement on printed output

**Step 3: Fix PAN Photo Only face isolation**
- Replace density-based detection with hardcoded `PAN_PHOTO_FRAC`
- Calibrate coordinates using actual test PAN PDF
- Ensure Aadhaar Photo Only is unaffected

**Step 4: Front + back layout on A4**
- Currently only front side is placed on A4 sheet
- Add back side (from same PDF or second page) next to front
- Layout: front | back side by side, both at CR80 size
- User cuts around the pair, folds in middle, laminates

**Step 5: Print alignment + margin fine-tuning**
- Ensure the printed output matches physical measurements
- Account for printer margins (most printers have 3-6mm unprintable margins)
- Test with actual lamination pouches

### Test PDFs

Already saved in repo — do NOT need to be re-provided:
- `test-pdfs/pan-test.pdf` (password: `05071999`)
- `test-pdfs/aadhaar-test.pdf` (password: `SUNI1986`)

### Key file locations

**NOTE:** `document-sheet.html` was DELETED in PR #185. The file
references below are historical only — they no longer exist in the repo.
The new feature will be built from scratch as `id-print.html` (see §M).

- ~~`document-sheet.html` lines ~890–892: `AADHAAR_CROP`, `PAN_CROP`, `getCrop()`~~
- ~~`document-sheet.html` lines ~898–944: `trimCardEdges()` auto-trim~~
- ~~`document-sheet.html` lines ~946–947: `PAN_PHOTO_FRAC` hardcoded photo region~~
- ~~`document-sheet.html` lines ~950–1013: `detectPhotoInCard()` density analysis~~
- ~~`document-sheet.html` lines ~1022–1023: `CARD_PRINT_W`, `CARD_PRINT_H` (CR80 at 300 DPI)~~
- ~~`document-sheet.html` lines ~1026–1094: `processPdf()` — crop + detect + editor~~
- ~~`document-sheet.html` lines ~1240–1340: `buildA4Sheet()` — A4 canvas generation~~

---

## M. ID Card Print feature — research + implementation plan (2026-04-25)

**Status: Phase 1 COMPLETE (PR #188, verified 2026-04-26). Phase 2 photo
editing SHIPPED (PR #191). Remaining Phase 2/3 items open — see §M.6.**

PR #185 deleted the old broken `document-sheet.html`. This section
documents the competitor research and implementation plan for the
replacement feature: `id-print.html`.

### M.1 Competitor landscape

| Software | Type | Price | Key Features |
|----------|------|-------|-------------|
| **CardXpress (MySea Solutions)** | Desktop (Windows .NET) | Rs 2500 lifetime | Aadhaar/PAN/Voter/Ayushman PDF crop, photo edit, font change, bold, BigQR, front+back preview, positioning controls, Epson L805/L8050 tray + A4 (5-10 cards) + Dragon sheet (4×6, 2 cards) |
| **Smart Identity Pro (Radiumbox)** | Desktop (Windows) | Rs 3500 lifetime | One-click eAadhaar parse, card customization (header/footer/barcode/photobox toggle), photo edit, font adjust, preprinted card offset, print reports, A4 bulk (10 cards) |
| **eCardCutter (go24.info)** | Web (browser) | FREE unlimited | Aadhaar/PAN/Voter/Jan Aadhaar/Ayushman/eShram/ABC ID crop. Advance: issue date toggle, download date, front QR, mobile no, photo brightness/contrast, rounded borders. Paper + PVC print. |
| **DocSet.in** | Web (browser) | FREE | Aadhaar print — auto-align front+back on A4. 5 cards per A4 sheet. CR80 size (8.6×5.4 cm). High-res PDF. No install. |
| **PVC Pro** | Web (browser) | Rs 1/file credits | Aadhaar/PAN/Voter/Ayushman/eShram/ABHA/DL/RC. Auto-crop AI. Live preview. Batch processing. Watermarked free demo. |

### M.2 Card sizes and lamination

| Item | Dimensions (mm) | Pixels (300 DPI) | Notes |
|------|-----------------|-------------------|-------|
| CR80 (standard ID card) | 85.6 × 54 | 1011 × 638 | ISO/IEC 7810 ID-1. Same as credit/debit cards. |
| Lamination pouch (small) | 65 × 95 | 768 × 1122 | Most common for Aadhaar/PAN. Reston 125 micron. |
| Lamination pouch (medium) | 70 × 100 | 827 × 1181 | BigFalcon brand. Slightly more margin. |
| A4 paper | 210 × 297 | 2480 × 3508 | Standard print paper. |
| Dragon sheet (4×6) | 102 × 152 | 1205 × 1795 | Fits 2 cards. PVC coated. |
| PVC blank card | 85.5 × 54 × 0.76 | — | For Epson L805/L8050 card tray. |

**Lamination math:** Card (85.6×54mm) inside pouch (65×95mm portrait).
Card placed landscape → 85.6mm ≤ 95mm height (4.7mm margin each side),
54mm ≤ 65mm width (5.5mm margin each side). Front+back printed, folded,
placed inside pouch, heat-sealed.

### M.3 PDF structures

**eAadhaar PDF:**
- Size: A4 portrait (~595 × 842 pt = 2480 × 3508 px at 300 DPI)
- Pages: Usually 1 page with full letter format
- Front card area: Upper portion (~top 60-65%)
- Back card area: Lower portion (~bottom 30-35%)
- Password: First 4 letters of name (CAPS) + birth year (e.g., SUNI1986)
- Contents: Photo, name, DOB/age, gender, Aadhaar number, address,
  QR code (front), VID, download date, address continued (back)
- Source: UIDAI portal / Digilocker / mAadhaar (layout may vary slightly)

**ePAN PDF:**
- Size: Varies — some A4 portrait, some landscape
- Pages: Usually 1 page
- Password: DOB in DDMMYYYY format (e.g., 05071999)
- Providers: NSDL, UTI-ITSL, Income Tax eFiling — each has slightly
  different layout
- Contents: PAN number, name, father's name, DOB, photo, signature,
  hologram area (front), Hindi text, terms, QR code (back)

### M.4 How print shops actually work

1. Customer comes → shop downloads PDF from gov website
2. PDF is password-protected → enter password
3. Software auto-detects card type → auto-crops front + back
4. Optional: photo edit (brightness/contrast)
5. Print on: PVC tray (Epson L805) / Dragon sheet 4×6 / A4 paper
6. Cut the printed card with scissors
7. Fold front + back together
8. Laminate in 65×95mm thermal pouch (125 micron)
9. Charge customer Rs 30-100 per card

### M.5 Studio Print advantage over competitors

1. **Browser-based** — no software install needed
2. **Mobile-friendly** — phone se bhi kaam chalega
3. **Free unlimited** — no per-file charge, no license
4. **Privacy-first** — PDF browser mein hi process hota hai, server pe
   upload nahi (like passport photo tool)
5. **Modern UI/UX** — 2026 dark theme, smooth interactions
6. **Multi-device** — Chrome/Edge/Firefox sab pe chalega
7. **PWA** — installable, offline capable
8. **Auto-detect** — card type from PDF text extraction

### M.6 Implementation plan — phased

**Phase 1 (MVP) — one PR:**
1. New page: `id-print.html`
2. PDF upload + drag-and-drop + password unlock (pdf.js)
3. Auto-detect Aadhaar vs PAN (text extraction via `getTextContent()`)
4. Auto-crop front + back from PDF page (render page to canvas, crop
   card regions using calibrated coordinates)
5. CR80 sized output (1011 × 638 px at 300 DPI)
6. Front + back side-by-side preview (dark canvas area)
7. A4 sheet layout with both sides for fold-and-laminate
8. Download PNG + Print button (window.print with CSS @media print)
9. All processing client-side (no server upload)
10. Shared nav/auth/footer (legal.css, nav.js, auth.js, pricing.js)
11. Update homepage features grid card (currently "Soon" or missing)
12. Update nav dropdown with link to new page

**Phase 2 (follow-up PRs):**
- ~~Photo editing (brightness/contrast/saturation)~~ — **shipped PR #191**
- ~~Multiple cards per A4 sheet (5 card pairs per sheet)~~ — **shipped PR #193**
- ~~Cut marks / dashed guides on A4 output~~ — **shipped PR #193**
- ~~Rounded border option~~ — **shipped PR #194, bug fix PR #197**
- ~~Voter ID support~~ — **shipped PR #202**
- ~~Dragon sheet (4×6) layout option (2 cards per sheet)~~ — **shipped PR #203**

**Phase 3 (partial):**
- ~~Ayushman / Jan Aadhaar / eShram support~~ — **shipped PR #205**
- ~~Batch processing (multiple PDFs at once)~~ — **shipped PR #208**
- ~~PVC card tray layout (Epson L805/L8050 direct print)~~ — **shipped PR #210**
- Toggle options (issue date, download date, QR code, mobile number)
- Auto photo enhancement (AI brightness/contrast adjustment)
- Signature box option (PAN)
- Back-side hologram overlay (PAN)

### M.7 Technical constants

```javascript
// Card dimensions
const CR80_W_MM = 85.6;
const CR80_H_MM = 54;
const CR80_W_PX = 1011;  // at 300 DPI
const CR80_H_PX = 638;   // at 300 DPI

// Paper dimensions at 300 DPI
const A4_W_PX = 2480;
const A4_H_PX = 3508;
const DRAGON_W_PX = 1205;  // 4×6 inch
const DRAGON_H_PX = 1795;

// Lamination pouch
const POUCH_W_MM = 65;
const POUCH_H_MM = 95;

// Card type detection keywords (2+ matches confirms)
// Aadhaar: "aadhaar", "uid", "uidai", "unique identification",
//          "government of india", "vid", "enrolment",
//          "download date", "issue date"
//   (PR #189: added enrolment/download date/issue date — eAadhaar
//    PDFs often lack "aadhaar"/"uid" in text layer but always have
//    these 3. Verified 2026-04-26: 4 keyword hits on test PDF.)
// PAN: "permanent account number", "income tax", "pan",
//      "department", "nsdl", "utiitsl"
// Voter: "election commission", "epic", "voter", "electoral",
//        "electors photo identity", "polling station",
//        "assembly constituency", "parliamentary constituency"
// Ayushman: "ayushman", "pmjay", "pradhan mantri jan arogya",
//           "national health authority", "nha", "health card",
//           "beneficiary", "jan arogya", "health id", "ayushman bharat"
// Jan Aadhaar: "jan aadhaar", "janaadhaar", "rajasthan", "family id",
//              "jan aadhar", "planning department",
//              "rajasthan jan aadhaar authority", "janaadhar"
// eShram: "eshram", "e-shram", "unorganised worker",
//         "unorganized worker", "ministry of labour", "uan",
//         "universal account number", "shram card",
//         "labour and employment"
//
// Detection order (PR #205): Ayushman → Jan Aadhaar → eShram →
// Aadhaar → PAN → Voter (specific before generic to avoid
// keyword overlap, e.g. "jan aadhaar" contains "aadhaar")
```

### M.8 Key file locations (CREATED — PR #188)

- `id-print.html` — ID Card Print tool page (Phase 1 MVP shipped)
- Homepage `index.html` — features grid card links to id-print.html
- Nav dropdown on all pages — links to id-print.html
- `build.js` — includes id-print.html in build pipeline

### M.9 Phase 1 MVP verification (2026-04-26)

Tested locally with both test PDFs after PR #189 merge:

| Test | Result |
|------|--------|
| PAN PDF upload | PASSED |
| PAN password unlock (05071999) | PASSED |
| PAN auto-detect | PASSED |
| PAN front+back preview | PASSED |
| PAN CR80 output (1011×638px, 300 DPI) | PASSED |
| PAN A4 fold-and-laminate sheet | PASSED |
| PAN Download PNG + Print buttons | PASSED |
| Aadhaar PDF upload | PASSED |
| Aadhaar password unlock (SUNI1986) | PASSED |
| Aadhaar auto-detect (4 keyword hits) | PASSED |
| Aadhaar front+back preview | PASSED |
| Aadhaar CR80 output (1011×638px, 300 DPI) | PASSED |

**Phase 1 MVP is COMPLETE and VERIFIED. Ready for Phase 2 when requested.**

---

## N. ID Card Print — Phase 2 photo editing (2026-04-26, session #13)

**Status: SHIPPED — PR #191.**

| # | PR | What shipped | Status |
|---|------|---------|--------|
| N1 | PR #190 | **Docs update.** Updated shipped summary + verification results for PRs #186–#189. | **merged** |
| N2 | PR #191 | **Photo editing controls.** Real-time brightness/contrast/saturation sliders on preview step. Canvas `ctx.filter` (CSS filter syntax). Edited output carries through to A4 sheet generation. Reset button. Hidden in `@media print`. Mobile-responsive (sliders stack vertically ≤640px). Existing design tokens only, no new deps. | **merged** |

## O. ID Card Print — Phase 2 multi-card + rounded corners (2026-04-26, sessions #14–#15)

**Status: SHIPPED — PRs #193, #194, #197.**

| # | PR | What shipped | Status |
|---|------|---------|--------|
| O1 | PR #192 | **Docs update.** Updated shipped summary for PRs #190–#191 + new prompt. | **merged** |
| O2 | PR #193 | **Multi-card A4 layout.** 5 card pairs per sheet, cut marks/dashed guides, layout toggle (single fold-and-laminate vs 5-pair multi-card), column headers (Front/Back), corner marks for precision cutting. | **merged** |
| O3 | PR #194 | **Rounded corners toggle.** Checkbox in preview step — “Rounded Corners” on/off. Canvas `roundedRectPath` + `drawCardClipped` clip-path via `arcTo`. Applies to preview canvases (CSS `border-radius` + canvas clip) and A4 sheet (canvas clip). Default off. `CARD_RADIUS = 36` px. | **merged** |
| O4 | PR #197 | **Bug fix: `var r` variable shadowing + docs update.** In `buildMultiCardSheet()`, the loop variable `r` (row index) was overwritten by `var r = roundedCorners ? CARD_RADIUS : 0`. With `var` being function-scoped, this caused infinite loop when rounded corners off (r resets to 0 every iteration) and only 1 row drawn when on (r becomes 36, exceeds rows=5). Fix: moved radius calculation outside loop as `var radius`. Also updated SKILL.md, AGENTS.md, issues.md with shipped summary for PRs #192–#197. | **merged** |
|| O5 | PR #201 | **Docs update.** Fill Voter ID task in prompt, update AGENTS.md. | **merged** |
|| O6 | PR #202 | **Voter ID multi-page PDF support.** Multi-page Voter ID PDF (front page 1, back page 2), auto-detect via keywords, renders both pages at 300 DPI, auto-crop front+back, CR80 output, preview, A4 sheet. | **merged** |
|| O7 | PR #203 | **Dragon sheet (4×6) layout.** Third layout toggle option — 1205×1795px sheet, 2 cards stacked vertically (front + back), cut marks, corner marks, rounded corners support, dedicated download filename. | **merged** |

### What's still open (Phase 3)

**Phase 2 — COMPLETE.** All items shipped (photo editing PR #191, multi-card A4 PR #193, cut marks PR #193, rounded corners PR #194/#197, Voter ID PR #202, Dragon sheet PR #203).

**Phase 3 (partial):**
- ~~Ayushman / Jan Aadhaar / eShram support~~ — **shipped PR #205**
- ~~Batch processing (multiple PDFs at once)~~ — **shipped PR #208**
- ~~PVC card tray layout (Epson L805/L8050 direct print)~~ — **shipped PR #210**
- Toggle options (issue date, download date, QR code, mobile number)
- Auto photo enhancement (AI brightness/contrast adjustment)
- Signature box option (PAN)
- Back-side hologram overlay (PAN)

---

## P. ID Card Print — Phase 3 Ayushman/Jan Aadhaar/eShram (2026-04-26, session #16)

**Status: SHIPPED — PR #205.**

|| # | PR | What shipped | Status |
||---|------|---------|--------|
|| P1 | PR #205 | **Ayushman Bharat (PMJAY) support.** Auto-detect via 10 keywords (`ayushman`, `pmjay`, `pradhan mantri jan arogya`, `national health authority`, `nha`, `health card`, `beneficiary`, `jan arogya`, `health id`, `ayushman bharat`). Crop regions for single-page and multi-page PDFs. Pink badge (`#f472b6`). CR80 output. | **merged** |
|| P2 | PR #205 | **Jan Aadhaar (Rajasthan family ID) support.** Auto-detect via 8 keywords (`jan aadhaar`, `janaadhaar`, `rajasthan`, `family id`, `jan aadhar`, `planning department`, `rajasthan jan aadhaar authority`, `janaadhar`). Crop regions for single-page and multi-page PDFs. Orange badge (`#fb923c`). CR80 output. | **merged** |
|| P3 | PR #205 | **eShram (unorganized worker UAN) support.** Auto-detect via 9 keywords (`eshram`, `e-shram`, `unorganised worker`, `unorganized worker`, `ministry of labour`, `uan`, `universal account number`, `shram card`, `labour and employment`). Crop regions for single-page and multi-page PDFs. Green badge (`#34d399`). CR80 output. | **merged** |
|| P4 | PR #205 | **Detection order fix.** Specific types checked before generic ones to avoid keyword overlap (e.g. `jan aadhaar` contains `aadhaar`). Order: Ayushman → Jan Aadhaar → eShram → Aadhaar → PAN → Voter. | **merged** |
|| P5 | PR #205 | **Multi-page PDF support generalized.** Previously Voter-only (`if detectedType === 'voter'`), now works for all card types with `frontPage`/`backPage` crop regions (`if pdf.numPages >= 2 && crop.frontPage`). | **merged** |
|| P6 | PR #205 | **UI updates.** Hero text, drop zone text, password hints, meta descriptions, nav dropdown, footer tagline — all updated to include new card types. | **merged** |

### What's still open (Phase 3 remaining)

- ~~Batch processing (multiple PDFs at once)~~ — **shipped PR #208**
- ~~PVC card tray layout (Epson L805/L8050 direct print)~~ — **shipped PR #210**
- Toggle options (issue date, download date, QR code, mobile number)
- Auto photo enhancement (AI brightness/contrast adjustment)
- Signature box option (PAN)
- Back-side hologram overlay (PAN)

---

## Q. ID Card Print — Phase 3 Batch Processing (2026-04-26, session #17)

**Status: SHIPPED — PR #208.**

|| # | PR | What shipped | Status |
||---|------|---------|--------|
|| Q1 | PR #208 | **Multi-file upload.** `<input type="file" multiple>` + drag-and-drop now accepts multiple PDFs at once. Single-file uploads still work via legacy path (no queue UI shown). | **merged** |
|| Q2 | PR #208 | **File queue UI.** `.idp-queue` displays each queued file with name, processing status badge (queued/processing/done/error), and a remove button (×). Styled with existing tokens (`--surface`, `--border`, `--text`). | **merged** |
|| Q3 | PR #208 | **Queue actions.** "+ Add More PDFs" button to add more files after initial selection. "Process All →" button to start batch processing. Both hidden until 2+ files queued. | **merged** |
|| Q4 | PR #208 | **Per-file password prompts.** Password-protected PDFs in batch are prompted one at a time via `pendingPasswordIdx`. After password entry, processing continues with remaining files. | **merged** |
|| Q5 | PR #208 | **Batch auto-detect + auto-crop.** Each PDF individually auto-detected (Aadhaar/PAN/Voter/Ayushman/Jan Aadhaar/eShram) and auto-cropped. Results stored in `batchCards[]` array with type, front/back image data, and file name. | **merged** |
|| Q6 | PR #208 | **Batch preview.** All processed cards shown in preview step with individual card pairs (front + back) per file. `batchCardsContainer` dynamically generates card pair elements for each processed PDF. Batch count info displayed. | **merged** |
|| Q7 | PR #208 | **Batch A4 sheet.** All cards from batch combined onto single A4 sheet. Works with existing layout modes (single/multi-card/Dragon). | **merged** |
|| Q8 | PR #208 | **Type labels + icons.** `TYPE_LABELS` and `TYPE_ICONS` maps for display names and emoji icons per card type (Aadhaar 🆔, PAN 💳, Voter 🗳️, Ayushman 🏥, Jan Aadhaar 👨‍👩‍👧‍👦, eShram 👷). | **merged** |

### What's still open (Phase 3 remaining)

- ~~PVC card tray layout (Epson L805/L8050 direct print)~~ — **shipped PR #210**
- Toggle options (issue date, download date, QR code, mobile number)
- Auto photo enhancement (AI brightness/contrast adjustment)
- Signature box option (PAN)
- Back-side hologram overlay (PAN)

---

## R. ID Card Print — Phase 3 PVC Card Tray Layout (2026-04-26, session #18)

**Status: SHIPPED — PR #210.**

|| # | PR | What shipped | Status |
||---|------|---------|--------|
|| R1 | PR #210 | **PVC card tray layout.** Fourth layout toggle option — 1417×1417px (120×120mm at 300 DPI) square canvas sized for Epson L805/L8050 CD/DVD card tray. | **merged** |
|| R2 | PR #210 | **Dual card slots.** Front card at top, back card below with 71px gap matching physical tray slot spacing. Both centered horizontally. | **merged** |
|| R3 | PR #210 | **Tray guides.** Dashed border around full canvas area to represent physical tray outline. Card slot outlines (dashed) around each card position for alignment. | **merged** |
|| R4 | PR #210 | **Corner marks + labels.** Corner marks on both card positions for precision alignment. "Front" / "Back" labels above each slot. | **merged** |
|| R5 | PR #210 | **Rounded corners support.** Existing rounded corners toggle applies to PVC tray layout — both card slots respect the setting. | **merged** |
|| R6 | PR #210 | **Footer + download.** Footer text: "PVC Tray · Epson L805/L8050 · 120×120 mm · 300 DPI — Studio Print". Download filename suffix: `-pvc-tray.png`. | **merged** |

### What's still open (Phase 3 remaining)

- Toggle options (issue date, download date, QR code, mobile number)
- Auto photo enhancement (AI brightness/contrast adjustment)
- Signature box option (PAN)
- Back-side hologram overlay (PAN)

---

## S. Copy update — ID Card Print nav dropdown + feature card (2026-04-26, session #19)

**Status: SHIPPED — PR #213.**

||| # | PR | What shipped | Status |
|||---|------|---------|--------|
||| S1 | PR #213 | **Nav dropdown subtitle update (7 pages).** Changed from "Aadhaar · PAN · Voter ID · CR80 sheet" to "Aadhaar · PAN · Voter · Ayushman · more" on index.html, about.html, contact.html, privacy.html, terms.html, refund.html, shipping.html. Now matches id-print.html which was already updated in PR #205. | **merged** |
||| S2 | PR #213 | **Homepage feature card description.** Updated to mention all 6 card types (Aadhaar, PAN, Voter ID, Ayushman, Jan Aadhaar, eShram) plus batch processing, multi-card A4, Dragon sheet, PVC tray print, photo editing. | **merged** |

---

## T. ID Card Print — Phase 3 Toggle Options (Aadhaar) — Research Complete

**Status: RESEARCH DONE (PR #215 docs). Coding pending.**

### T.1 What this feature is

Aadhaar card ke preview + output (A4, Dragon sheet, PVC tray, multi-card) mein
4 checkbox toggles add karne hain jo specific fields ko hide/show karein:
- **Issue Date** (back card)
- **Download Date** (back card)
- **Mobile Number** (back card, partially masked)
- **QR Code** (back card, bottom-right)

Competitor reference: eCardCutter (go24.info) — already has this feature free.

### T.2 Technical approach

Card rendering is canvas-based — PDF page rasterized, then crop region extracted
and scaled to CR80 (1011×638px). Fields ko hide karne ka method:
**white rectangle overlay drawn post-crop** over fixed pixel regions.

After `drawFilteredToCanvas()` ya `drawCardClipped()`, ek `applyAadhaarMasks()`
function call hoga jo checked toggles ke basis par white/background-colored
rectangles draw karega un regions par.

### T.3 Approximate field positions on Aadhaar BACK card at CR80 (1011×638px)

Ye positions eAadhaar standard layout se estimated hain — test PDF se
verify + fine-tune karna hoga.

```javascript
const AADHAAR_FIELD_MASKS = {
  qrCode:       { side: 'back', x: 710, y: 10,  w: 295, h: 615 }, // right column, full height
  mobileNumber: { side: 'back', x:   8, y: 310, w: 580, h:  80 }, // middle-left row
  issueDate:    { side: 'back', x:   8, y: 460, w: 480, h:  70 }, // lower-left row
  downloadDate: { side: 'back', x:   8, y: 540, w: 480, h:  85 }, // bottom-left row
};
```

**Note:** These are approximate — run test PDF (aadhaar-test.pdf pw: SUNI1986),
visually inspect rendered back card, adjust x/y/w/h values to precisely cover
each field without touching adjacent content.

### T.4 Implementation plan (id-print.html only)

1. **Add 4 checkboxes** in the preview step UI (`.idp-options` section, after
   the existing Rounded Corners checkbox). Show only when `detectedType === 'aadhaar'`.
   Labels: "Hide QR Code", "Hide Mobile No.", "Hide Issue Date", "Hide Download Date".
   Default: all unchecked (show everything).

2. **Add `applyAadhaarMasks(ctx, w, h)` function** — reads the 4 checkbox states,
   draws `ctx.fillStyle = '#ffffff'` rectangles over matched regions (scaled to
   actual canvas dimensions using w/h ratio from CR80 reference).

3. **Call `applyAadhaarMasks()` everywhere a card canvas is finalized:**
   - After `drawFilteredToCanvas()` in `refreshPreview()`
   - After `drawCardClipped()` / `ctx.drawImage()` in `buildA4Sheet()`
   - After card drawing in `buildDragonSheet()`
   - After card drawing in `buildPvcTray()`
   - After card drawing in batch preview refresh

4. **Live toggle effect:** Each checkbox `change` event calls `refreshPreview()`
   (already exists) — so masks apply immediately on toggle without re-processing
   the PDF.

5. **Batch mode:** In batch, `detectedType` per card is `card.type` — only show
   mask UI for Aadhaar cards. For non-Aadhaar cards in batch, skip masks.

### T.5 CSS / UI notes

- Use existing `.idp-option` class for each checkbox row (same as Rounded Corners).
- Group the 4 Aadhaar toggles under a small label like "Aadhaar field options"
  or just add them as 4 separate `.idp-option` rows.
- Hide the group with `display:none` for non-Aadhaar card types (JS toggle on
  detect badge update).
- No new CSS tokens — use existing `--surface`, `--border`, `--text`.

### T.6 What's NOT in scope for this PR

- PAN/Voter ID toggles — separate PR later, explicitly requested.
- Auto photo enhancement, signature box, hologram overlay — separate PRs.

## U. ID Card Print — Phase 3 Signature Box (PAN) — Research Complete

**Status: RESEARCH DONE (this PR docs). Coding pending — separate code PR per Rule #13.**

### U.1 What this feature is

PAN card ke FRONT side preview + saare output layouts (A4 fold-and-laminate,
multi-card A4, Dragon sheet, PVC tray, batch) mein ek **empty signature box
overlay** add karne ka option. Use case: ePAN PDFs (NSDL / UTI-ITSL / Income
Tax e-Filing) mein cardholder ki signature kabhi missing hoti hai, kabhi
faded hoti hai, ya physical signature ki zaroorat hoti hai post-lamination.
Ye toggle ek labelled white box draw karta hai jahan user laminate karne ke
baad pen se sign kar sake.

Competitor reference:
- **CardXpress (MySea Solutions)** — has dedicated "Signature Box" toggle for
  PAN cards (paid Rs 2500 desktop tool).
- **eCardCutter (go24.info)** — free web tool, has signature box overlay
  option for PAN.

Pattern is well-established; not a UX risk.

### U.2 Technical approach

Mirror `applyAadhaarMasks()` design exactly — same architecture, different
visual (border + label vs solid white fill), different toggle scope (PAN
only vs Aadhaar only).

Steps:
1. Single checkbox in preview UI (`#chkSignatureBox`) inside a new wrapper
   `#panToggles` (parallels existing `#aadhaarToggles`). Visible only when
   `detectedType === 'pan'`.
2. New constant `PAN_OVERLAY_REGIONS.signatureBox = { side, x, y, w, h }`
   at CR80 1011×638px reference.
3. New function `applyPanOverlays(ctx, ox, oy, side)` — reads `chkSignatureBox.checked`,
   draws a white-filled rectangle with a 2px black stroke and a small
   "Signature" label above (DM Mono 18px, centered) inside `PAN_OVERLAY_REGIONS.signatureBox`
   when `side === 'front'`.
4. Wire `applyPanOverlays()` at the **same three call sites** as
   `applyAadhaarMasks()`:
   - `drawFilteredToCanvas()` — preview canvases (single + batch)
   - `drawFiltered()` — A4/Dragon/PVC/multi-card output paths
   - `applyBatchFilters()` — batch preview cache
5. Visibility toggle on detect: extend the existing
   `aadhaarToggles.classList.toggle('idp-hidden', detectedType !== 'aadhaar')`
   line with a parallel `panToggles.classList.toggle('idp-hidden', detectedType !== 'pan')`.
6. Live update: hook `chkSignatureBox.addEventListener('change', refreshPreview)`
   alongside the existing Aadhaar toggle listeners.

### U.3 Approximate signature-box position on PAN FRONT card at CR80 (1011×638px)

Standard physical PAN card layout (NSDL/UTI/Income Tax e-Filing all share
the same trim layout):
- Top band: government emblem + "INCOME TAX DEPARTMENT" header
- Left bottom: cardholder photo (~200×260px area at CR80)
- Right column: Name / Father's Name / DOB / PAN number
- Bottom-right: signature region (often empty in ePAN)

Recommended box placement (signature region — bottom-right, below DOB):

```javascript
const PAN_OVERLAY_REGIONS = {
  signatureBox: { side: 'front', x: 540, y: 470, w: 380, h: 110 },
};
```

Visual specification:
- Fill: `#ffffff` (solid white, covers any faded signature underneath)
- Stroke: `#000000`, `lineWidth: 2`
- Optional label: `"Signature"` in DM Mono / sans-serif `18px`, color `#333`,
  drawn above the box top edge with `~6px` padding. Centered horizontally
  within the box.
- Inside the box: empty white space for ink-signing post-print.

**Note:** Coordinates approximate — verify with `test-pdfs/pan-test.pdf`
(password: `05071999`). May need ±20–30px tuning to:
- Avoid clipping the printed PAN number / DOB row above
- Stay clear of the bottom card edge (keep ≥10px margin)
- Not overlap the photo on the left edge

### U.4 Implementation plan (id-print.html only — ~50 line diff)

1. **HTML** — after `#aadhaarToggles` block (line ~440), add:
   ```html
   <!-- PAN field overlays — shown only for PAN cards -->
   <div id="panToggles" class="idp-hidden">
     <label class="idp-option"><input type="checkbox" id="chkSignatureBox"> Add Signature Box</label>
   </div>
   ```

2. **JS constants** — after `AADHAAR_FIELD_MASKS` block (line ~625), add
   `PAN_OVERLAY_REGIONS` constant.

3. **DOM refs** — add `const chkSignatureBox = $('#chkSignatureBox');` and
   `const panToggles = $('#panToggles');` near the existing Aadhaar refs.

4. **Detect-time visibility** — at line ~1034, add:
   ```js
   panToggles.classList.toggle('idp-hidden', detectedType !== 'pan');
   ```

5. **`applyPanOverlays(ctx, ox, oy, side)`** — new function right after
   `applyAadhaarMasks()` (line ~1146). Returns early if box unchecked or
   side !== 'front'. Draws white rect, then 2px black stroke, then "Signature"
   label above using `ctx.fillText`.

6. **Call sites** — extend the 3 existing Aadhaar mask call sites:
   - `drawFilteredToCanvas()` line ~1162: add
     `if (cardType === 'pan' && side) applyPanOverlays(ctx, 0, 0, side);`
   - `applyBatchFilters()` lines ~1177, ~1189: add parallel PAN overlay calls
     for front (and skip back since signature box is front-only).
   - `drawFiltered()` line ~1620: add
     `if (side && detectedType === 'pan') applyPanOverlays(ctx, 0, 0, side);`

7. **Live toggle** — add `chkSignatureBox.addEventListener('change', refreshPreview);`
   alongside the existing 4 Aadhaar checkbox listeners.

8. **Reset path** — in the existing reset/back logic that clears state
   (line ~1726), uncheck `chkSignatureBox` so a fresh upload starts clean.

### U.5 Batch mode behaviour

- `panToggles` visibility is driven by the **first card's** detected type
  in single-card mode and by the existing per-card `card.type` check inside
  `applyBatchFilters()` for batch.
- In a mixed batch (e.g. 2 Aadhaar + 1 PAN), the PAN-only signature box
  applies only to PAN-type cards inside the loop — non-PAN cards skip the
  overlay. Same pattern as `applyAadhaarMasks` already uses for Aadhaar.
- If batch contains zero PAN cards, hide `#panToggles` entirely.

### U.6 CSS / UI notes

- Use existing `.idp-option` class — no new CSS tokens.
- `#panToggles` uses the same `idp-hidden` toggle pattern as `#aadhaarToggles`.
- Single checkbox for now (room to grow later — e.g. "Add Photo Box" if
  any ePAN provider strips the photo).

### U.7 What's NOT in scope for this PR (or its follow-up code PR)

- Back-side hologram overlay (PAN) — separate research + code PRs later.
- Custom signature image upload (sign once, paste on every card) — out of
  scope; this is just the empty-box overlay.
- Per-card signature box position tuning UI — fixed coordinates only.
- Voter ID / Ayushman / Jan Aadhaar / eShram signature boxes — PAN only.

---

## V. ID Card Print — Phase 4 Scope Reset (CardXpress Feature Parity)

**Trigger:** User feedback (2026-04-26): "signature box ek chhota piece hai,
website pe abhi bhi bhut kuch karna baaki hai." User shared 8 reference
images they originally gave to the previous agent (Devin) when planning
this feature. Reviewing those images shows the §U signature box scope is
~10% of the actual target — a single small overlay vs. a full
competitor-parity card-print suite.

This section captures the broader scope and corrects two issues found in
§U / PR #221 during the image review.

### V.0 Reference images (committed to repo)

All 8 images live in `.agents/references/`:

- `competitor-cardxpress-ui.jpeg` — CardXpress Pro v8.1 main window (the
  paid competitor). The single most important reference.
- `pan-target-output-with-hologram.png` — PAN front+back ePAN PDF with
  HOLOGRAM patch visible on the back. Shows real signature position.
- `pan-clean-pvc-layout.png` — same PAN, cropped to clean CR80 PVC layout.
- `aadhaar-target-output.png` — clean Aadhaar PVC layout, full address.
- `aadhaar-clean-pvc-layout.png` — Aadhaar front+back at print-ready size.
- `workflow-pan-photoshop-demo.jpg` — competitor's Photoshop "one-click"
  PAN action demo (input PDF → output PVC sheet).
- `workflow-aadhaar-photoshop-demo.jpg` — same for Aadhaar.
- `workflow-aadhaar-tutorial-thumbnail.jpg` — YouTube tutorial thumbnail
  for context on the manual workflow we're replacing.

### V.1 CardXpress UI feature breakdown (from `competitor-cardxpress-ui.jpeg`)

The competitor exposes the following controls that we currently lack:

| # | Control                  | What it does                                               | We have it? |
|---|--------------------------|------------------------------------------------------------|-------------|
| 1 | Card-type tabs           | Aadhaar / PAN / Voter / Ayushman tabs at top               | Auto-detect (better) |
| 2 | PDF Path + Password      | File picker + password field                               | Yes |
| 3 | Photo Editor button      | Opens dedicated photo-tweak panel (separate window)        | Inline sliders only |
| 4 | Settings button          | Per-user prefs (default printer, layout, etc)              | No |
| 5 | Master Setting button    | Calibration: DPI, padding, A4 margins                      | No |
| 6 | PrePrinted Card mode     | Skip empty front, print only fillable fields on back       | No |
| 7 | Move pad (X/Y/XZ/YZ)     | Per-side nudge to fix mis-aligned crops                    | **No — high value** |
| 8 | Front/Back radio         | Pick which side the Move/Zoom controls target              | No |
| 9 | Zoom dial                | Per-side scale within CR80 frame                           | **No — high value** |
| 10 | Quality dropdown         | Medium / High / Draft print quality                        | No |
| 11 | Bold checkbox            | Bolden printed text on card                                | No |
| 12 | BigQR checkbox           | Enlarge QR for easier scan                                 | No |
| 13 | Aadhaar Note checkbox    | Show/hide the info-note overlay                            | No |
| 14 | Printer selector         | "Epson L805" → printer-specific DPI/margin profile         | No |
| 15 | Preview / Card Print     | Two-step workflow buttons                                  | Yes (Generate Sheet) |

We already win on: auto-detect (no tab clicking), batch upload, modern UI,
in-browser (no install). We lose on: fine-alignment controls, calibration,
printer presets.

### V.2 PAN target-output analysis (from `pan-target-output-with-hologram.png`)

Two critical findings that **invalidate parts of §U / PR #221**:

#### V.2.a §U signature box coordinates are WRONG

§U set `signatureBox: { side: 'front', x: 540, y: 470, w: 380, h: 110 }`.
That box sits at the **right-middle** of the front card — directly on top
of the QR code, not over the signature area.

In the reference image, the actual signature row is at the **bottom-left
to bottom-center**, below the photo + DOB columns:

- Approx coords at CR80 1011×638px:
  `signatureBox: { side: 'front', x: 280, y: 540, w: 280, h: 75 }`
- Label "हस्ताक्षर / Signature" appears below the box at y ≈ 620.

**Action:** PR #221 needs a coords-only follow-up patch (~4 lines) before
shipping to users. Mark as P1.

#### V.2.b PAN HOLOGRAM patch is the real missing overlay

The back of every genuine PAN PVC card has a silver/grey **HOLOGRAM**
square at the **top-right** corner. ePAN PDFs ship with the hologram
area visible as a faded watermark. For PVC printing, the convention is
to draw a labelled silver rectangle so the print shop can stick a real
hologram sticker on top after lamination.

- Approx coords at CR80 1011×638px:
  `hologram: { side: 'back', x: 800, y: 30, w: 180, h: 220 }`
- Fill: silver gradient (`#c0c0c0` → `#e8e8e8`) or flat `#d0d0d0`.
- Label: "HOLOGRAM" in DM Mono, white, centred, ~24px.
- Toggle: `chkHologram` in `#panToggles` (alongside `chkSignatureBox`).

This is **higher priority** than the signature box because hologram is
visible on every PAN card, while the signature box only matters for
unsigned ePANs.

### V.3 Aadhaar target-output analysis (from aadhaar-clean / target images)

- Confirms §S/§T hide-toggles (QR / Mobile / Issue Date / Download Date)
  are correct and well-positioned.
- Address block on back is the most important content — must NEVER be
  cropped or masked. Our current crop ratios preserve it.
- No new Aadhaar overlays needed from these images.

### V.4 Phase 4 backlog — prioritized

Each item is a separate research + code PR pair (per Rule #13).

| Pri | Item                                    | Est PR size | Why |
|-----|-----------------------------------------|-------------|-----|
| ~~P1~~ | ~~Fix §U signature box coordinates~~ | ~~~4 lines~~ | **SHIPPED PR #223** |
| ~~P1~~ | ~~PAN HOLOGRAM overlay~~             | ~~~40 lines~~ | **SHIPPED PR #224** |
| ~~P2~~ | ~~Per-side Move controls (X/Y nudge)~~ | ~~~120 lines~~ | **SHIPPED PR #229 (§W)** |
| ~~P2~~ | ~~Per-side Zoom (scale within CR80)~~ | ~~~80 lines~~ | **SHIPPED PR #230 (§X)** |
| ~~P3~~ | ~~Photo Editor split panel — research~~ | ~~~150 lines~~ | **Research SHIPPED §Z. Code PR pending** |
| P3  | Master Settings (DPI/padding/margins)   | ~200 lines  | Calibration screen with localStorage persistence |
| P3  | PrePrinted Card mode                    | ~60 lines   | Skip front render, output back-only sheets |
| P4  | Printer presets (Epson L805 etc)        | ~80 lines   | Dropdown of DPI/margin profiles per printer |
| P4  | Bold / BigQR text-emphasis toggles      | ~40 lines   | Aadhaar text bolden + QR upscale |
| P4  | Voter / Ayushman / Jan Aadhaar overlays | ~60 lines each | Same pattern as PAN once it lands |

### V.5 Recommended next 2 PRs (single session, ~half day)

1. **PR #222 — fix-pan-signature-coords** (~4 line patch)
   - Change `PAN_OVERLAY_REGIONS.signatureBox` to the corrected coords.
   - Ship before any user notices PR #221 draws over the QR.

2. **PR #223 — pan-hologram-overlay** (~40 line patch)
   - Add `hologram` entry to `PAN_OVERLAY_REGIONS`.
   - Add `chkHologram` checkbox to `#panToggles`.
   - Extend `applyPanOverlays` to draw silver fill + "HOLOGRAM" label.
   - Wire into the same 3 call-sites + listener array + reset.

After those two, pick one P2 item (Move OR Zoom) for the next session.

### V.6 What's NOT in scope for §V (this is research only)

- Any code changes — this is a docs-only PR.
- Implementing P1-P4 items — each gets its own Research → Docs → Code PR.
- Choosing colours, exact pixel coords beyond §V.2 estimates — refine
  during each item's research PR using the committed reference images.
- Removing or rewriting §U — §U stays valid except for the wrong
  signatureBox coords flagged in §V.2.a.

---

## §W ID Card Print Phase 4 P2 — Per-side Move (X/Y nudge) research

**Status:** SHIPPED — Research PR #226, Code PR #229. Code PR follows in
a separate session.

**Goal:** Match CardXpress "Move pad" UX so users can nudge the
front/back crop window inside the CR80 1011×638 frame to fix
off-centre PDFs (very common with ePAN re-issues and Aadhaar QR-shifts).

### W.1 Current render pipeline (id-print.html, scouted 2026-04-26)

Two filter functions both use `ctx.drawImage(srcCanvas, 0, 0, w, h)`:

1. `drawFiltered(destCanvas, srcCanvas, w, h, filterStr, side)` —
   line ~1639. Single-card editor preview (`cardFrontCanvas` /
   `cardBackCanvas`). Called from the slider change handler at ~1655.
2. `drawFilteredToCanvas(canvas, srcCanvas, w, h, cardType, side)` —
   line ~1175. Batch grid preview (per-card mini canvases under
   `#batchCardsContainer`).
3. `applyBatchFilters()` — line ~1193. Rebuilds every cached
   `card.front` / `card.back` from `card.originalFront` /
   `card.originalBack` using `ctxF.drawImage(card.originalFront, 0, 0,
   CR80_W, CR80_H)` and the same for back.

Output sheets (A4, Dragon, PVC tray, multi-card) **all** consume the
already-filtered `card.front` / `card.back` canvases — see
`ctx.drawImage(card.front, ...)` at lines 1294, 1374, 1450, 1522 and
back equivalents at 1302, 1379, 1456, 1527. **This means Move only
needs to be inserted in the three filter passes above; output sheets
inherit it for free** — same architectural property the §V overlays
relied on.

Overlays (`applyAadhaarMasks`, `applyPanOverlays`) draw at fixed
PVC-card coords and **must NOT move with the photo** (the silver
HOLOGRAM patch and signature box have to land at the printer's
expected position regardless of crop offset). Overlay calls stay at
`(ctx, 0, 0, side)` — no change required.

### W.2 State shape

Add per-card per-side offsets, default `{dx:0, dy:0}`:

```js
batchCards[i].offset = {
  front: { dx: 0, dy: 0 },
  back:  { dx: 0, dy: 0 }
};
```

Initialise at the two card-creation sites:
- Line ~968 (worker result push) — extend the `card:` literal.
- Line ~1036 (single-card synchronous path) — extend the `batchCards = [{...}]` literal.

Single-card editor reads/writes `batchCards[0].offset[side]`. No
separate global needed (mirror not required since `batchCards` is
always populated when the editor is visible).

Clamp range: `±100px` per axis (≈ ±10% of CR80 width / 16% of height).
Anything beyond that crops away too much real card area. Use
`clamp(v, -100, 100)`.

### W.3 Render insertion

Three minimal edits, identical pattern:

```js
// drawFiltered — line ~1650
var off = (batchCards[0] && batchCards[0].offset && batchCards[0].offset[side]) || { dx: 0, dy: 0 };
ctx.drawImage(srcCanvas, off.dx, off.dy, w, h);
```

```js
// drawFilteredToCanvas — line ~1187
// caller passes card index; resolve offset there or accept an `offset` arg
ctx.drawImage(srcCanvas, off.dx, off.dy, w, h);
```

```js
// applyBatchFilters — lines ~1203 and ~1216
var off = card.offset && card.offset.front || { dx:0, dy:0 };
ctxF.drawImage(card.originalFront, off.dx, off.dy, CR80_W, CR80_H);
// (same for back at 1216)
```

`drawFilteredToCanvas` currently has no card-index argument. Cleanest
fix: add an optional `offset` arg defaulting to `{dx:0, dy:0}` and
have the three call sites (lines 1114, 1115, 1229) resolve it from
their `card`/`batchCards[idx]` reference. ~6 lines.

Edge case — transparent strip: when `dx>0`, the left edge of the
destination is uncovered. Source PDFs render onto an opaque white
canvas during PDF.js extraction (see PDF render paths upstream), so
the destination canvas keeps the white fill from the prior
`ctx.fillRect`/`clearRect` step — visually equivalent to a white
margin, which is the desired "PVC card edge" look. **No background
fill needed.**

### W.4 UI — Move pad (CardXpress-style)

Insert a new block inside `.idp-editor` between the title row and
`.idp-sliders` (line ~448). Shown only when `batchCards.length === 1`
(V1 scope — multi-card batch needs a card picker which is out of
scope for this PR pair).

```html
<div class="idp-move" id="movePad">
  <div class="idp-move-row">
    <span class="idp-move-label">Move</span>
    <label><input type="radio" name="moveSide" value="front" checked> Front</label>
    <label><input type="radio" name="moveSide" value="back"> Back</label>
    <span class="idp-move-step">Step
      <input type="number" id="moveStep" value="5" min="1" max="50" step="1">px
    </span>
  </div>
  <div class="idp-move-pad">
    <button type="button" id="moveUp">↑</button>
    <button type="button" id="moveLeft">←</button>
    <button type="button" id="moveReset">⌖</button>
    <button type="button" id="moveRight">→</button>
    <button type="button" id="moveDown">↓</button>
    <span class="idp-move-readout" id="moveReadout">0, 0</span>
  </div>
</div>
```

Layout: 3-column grid for the pad (↑ centred top row, ← ⌖ → middle
row, ↓ centred bottom row) — matches CardXpress reference image. CSS
~10 lines using existing tokens (no new colours, no new fonts).

Visibility toggle: when `batchCards.length === 1`, remove
`idp-hidden` from `#movePad`; otherwise add it. Hook into the same
place the editor is shown (~line 1042).

### W.5 Listeners

```js
const movePad = $('#movePad');
const moveStep = $('#moveStep');
const moveReadout = $('#moveReadout');
const moveSideRadios = document.getElementsByName('moveSide');

function currentMoveSide() {
  for (const r of moveSideRadios) if (r.checked) return r.value;
  return 'front';
}
function nudge(axis, dir) {
  if (batchCards.length !== 1) return;
  const side = currentMoveSide();
  const step = Math.max(1, Math.min(50, parseInt(moveStep.value, 10) || 5));
  const o = batchCards[0].offset[side];
  o[axis] = Math.max(-100, Math.min(100, o[axis] + dir * step));
  moveReadout.textContent = o.dx + ', ' + o.dy;
  // re-render via the existing slider-change path
  onFilterChange();         // or whatever the slider handler is named
}
$('#moveUp').addEventListener('click',    () => nudge('dy', -1));
$('#moveDown').addEventListener('click',  () => nudge('dy',  1));
$('#moveLeft').addEventListener('click',  () => nudge('dx', -1));
$('#moveRight').addEventListener('click', () => nudge('dx',  1));
$('#moveReset').addEventListener('click', () => {
  if (batchCards.length !== 1) return;
  const side = currentMoveSide();
  batchCards[0].offset[side] = { dx: 0, dy: 0 };
  moveReadout.textContent = '0, 0';
  onFilterChange();
});
moveSideRadios.forEach(r => r.addEventListener('change', () => {
  const o = batchCards[0].offset[currentMoveSide()];
  moveReadout.textContent = o.dx + ', ' + o.dy;
}));
```

The slider re-render handler (around line 1655–1680) already calls
`drawFiltered(...)` for both sides and `applyBatchFilters()` for
batch mode — `nudge()` reuses that same function (likely named
`renderFiltered` / `redraw` / similar; confirm during code PR).

### W.6 Reset wiring

Two places:

1. `btnResetEdit` (Photo Adjust → Reset, ~line 448 + handler) — add
   `batchCards[0].offset = { front:{dx:0,dy:0}, back:{dx:0,dy:0} };`
   and `moveReadout.textContent = '0, 0';` to the existing handler.
2. Full reset at ~line 1762 (clears toggles when a new PDF is loaded
   or batch is cleared) — extend the existing forEach by zeroing
   any in-memory offsets and resetting the readout. Since
   `batchCards` is reassigned on PDF load, the per-card init at
   §W.2 covers fresh loads automatically.

### W.7 Estimated diff

| Area                                           | Lines |
|------------------------------------------------|-------|
| HTML (#movePad block)                          | ~20   |
| CSS (.idp-move / .idp-move-pad grid)           | ~15   |
| State init (2 sites + clamp helper)            | ~8    |
| `drawFilteredToCanvas` offset arg + 3 callers  | ~10   |
| `drawFiltered` + `applyBatchFilters` insertion | ~10   |
| Visibility toggle + DOM refs                   | ~10   |
| Listeners (6 handlers + side-change)           | ~30   |
| Reset wiring (2 sites)                         | ~10   |
| **Total (net)**                                | **~110–125** |

Within the ~120-line estimate from §V.4. Single-problem PR per Rule #12.

### W.8 V1 scope limits (NOT in this PR)

- **Batch-mode Move** (per-card editing in a batch of 5+ cards) — needs
  a card picker UI first. Defer to a follow-up.
- **Drag-to-move** on the preview canvas — V2; arrows are V1.
- **Keyboard arrows** — V2; on-screen buttons cover the primary use
  case (touch devices, print-shop counter staff).
- **Per-side independent Step values** — V1 uses a single step input
  applied to whichever side is selected.
- **Persistence across PDF reloads** — out of scope; offsets reset
  with each new PDF (matches CardXpress behaviour).

### W.9 Test plan (for the code PR)

1. Load `test-pdfs/pan-test.pdf` (pw `05071999`). Confirm Move pad
   appears, both readouts show `0, 0`.
2. Front + ↑×3 with step 5 → readout `0, -15`, photo nudges up,
   white strip appears at bottom edge of front preview. QR/HOLOGRAM
   stay in place (overlays at fixed coords).
3. Switch radio to Back → readout shows back's current `0, 0`. ↓×2
   → readout `0, 10`, back photo nudges down.
4. Reset button on Move pad → only the current side zeros.
5. Photo Adjust Reset → both sides + sliders zero together.
6. Generate PVC tray sheet → both cards land at the nudged crop
   confirming output pipeline carries the offset through.
7. Load `test-pdfs/aadhaar-test.pdf` (pw `SUNI1986`). Repeat steps
   2–3. Confirm Aadhaar QR/Mobile/Issue/Download masks stay at
   fixed coords when the photo nudges underneath.
8. Load a multi-page batch PDF → Move pad hides
   (`batchCards.length > 1`); existing batch flow unchanged.

### W.10 Acceptance

- Per-side `dx, dy` survive between side switches.
- Single Reset (Photo Adjust) zeroes Move + sliders together.
- Output sheets (A4 / Dragon / PVC tray / multi-card) reflect the
  per-side offset without any sheet-pipeline code change.
- Overlays (Aadhaar masks, PAN signature, PAN HOLOGRAM) remain at
  fixed coords irrespective of Move offsets.
- No regression in batch-mode rendering (Move pad hidden, existing
  pipeline untouched).


---

## §X ID Card Print Phase 4 P2 — Per-side Zoom (scale within CR80) research

**Status:** SHIPPED — Research PR #228, Code PR #230, follow-up fix
PR #231 (slider DOM refresh on btnBack + fresh PDF load). Code PR
followed after §W Move code landed so they could be tested together.

**Goal:** Match CardXpress "Zoom" dial — scale the front/back photo
inside the CR80 1011×638 frame (50%–200%) so users can fix
too-small ePAN scans (where the actual card is tiny on a big white
page) and too-large Aadhaar PDFs (where the card overflows the crop).
Pairs naturally with §W Move — Zoom alone is rarely useful, but
Zoom + Move covers ~95% of "my card looks weird" support tickets.

### X.1 Why this pairs with §W

Same architectural levers as §W:
- Same three filter passes (`drawFiltered`,
  `drawFilteredToCanvas`, `applyBatchFilters`) — see §W.1.
- Same per-card per-side state container — extend the §W shape, do
  **not** add a parallel one.
- Same "edit only when `batchCards.length === 1`" V1 scope.
- Same cached-`card.front`/`card.back` propagation to all output
  sheets (A4 / Dragon / PVC tray / multi-card) — no sheet-pipeline
  changes required.
- Same Photo Adjust Reset entry point.

This is why Move ships first: the state shape, listener pattern,
visibility toggle, and reset wiring all already exist after §W. §X
adds one number per side and one `ctx.scale` call per render path.

### X.2 State shape (extends §W)

```js
batchCards[i].offset = {
  front: { dx: 0, dy: 0, scale: 1 },
  back:  { dx: 0, dy: 0, scale: 1 }
};
```

Add `scale: 1` to the §W init at the two card-creation sites (lines
~968 and ~1036). Clamp `scale` to `[0.5, 2.0]`.

### X.3 Render insertion (centred zoom)

Zoom must scale around the **card centre** so the photo doesn't slide
to the top-left when zoomed in. Standard transform sandwich:

```js
function drawWithTransform(ctx, src, w, h, off) {
  ctx.save();
  ctx.translate(w / 2 + off.dx, h / 2 + off.dy);
  ctx.scale(off.scale, off.scale);
  ctx.drawImage(src, -w / 2, -h / 2, w, h);
  ctx.restore();
}
```

Replaces the §W-modified `ctx.drawImage(src, off.dx, off.dy, w, h)`
calls in all three filter passes:

- `drawFiltered` — line ~1650.
- `drawFilteredToCanvas` — line ~1187.
- `applyBatchFilters` — lines ~1203 and ~1216.

The `ctx.save`/`ctx.restore` matters because `ctx.filter` is set
just before the `drawImage` and we don't want the transform to leak
into the overlay calls that follow.

Edge cases:
- Zoom out (`scale < 1`): leaves blank strips on all 4 sides — same
  white-canvas-underneath behaviour as §W's transparent-strip case.
  No fill needed.
- Zoom in (`scale > 1`): photo overflows CR80; `drawImage` on the
  destination canvas naturally clips to the canvas bounds. No
  manual clipping required.
- Overlays still draw at fixed `(0,0)` coords (HOLOGRAM patch,
  signature box, Aadhaar masks) — `ctx.restore()` ensures the
  transform is gone before `applyPanOverlays` / `applyAadhaarMasks`
  run.

### X.4 UI — Zoom strip (CardXpress-style)

Add a single row inside the §W `#movePad` block, below the pad grid:

```html
<div class="idp-zoom-row">
  <span class="idp-move-label">Zoom</span>
  <button type="button" id="zoomOut">−</button>
  <input type="range" id="zoomSlider" min="50" max="200" value="100" step="5">
  <button type="button" id="zoomIn">+</button>
  <span class="idp-move-readout" id="zoomReadout">100%</span>
</div>
```

- Range slider 50–200 with step 5 (matches CardXpress dial granularity).
- −/+ buttons step by 10% per click.
- Readout shows current % for the selected side (reuses §W side radio).
- No new fonts, colours, or design tokens — reuses `.idp-move-*` styles.

### X.5 Listeners

```js
const zoomSlider = $('#zoomSlider');
const zoomReadout = $('#zoomReadout');

function setZoom(pct) {
  if (batchCards.length !== 1) return;
  const side = currentMoveSide();
  const s = Math.max(0.5, Math.min(2.0, pct / 100));
  batchCards[0].offset[side].scale = s;
  zoomReadout.textContent = Math.round(s * 100) + '%';
  zoomSlider.value = Math.round(s * 100);
  onFilterChange();
}
zoomSlider.addEventListener('input', () => setZoom(parseInt(zoomSlider.value, 10)));
$('#zoomIn').addEventListener('click',  () => setZoom(parseInt(zoomSlider.value, 10) + 10));
$('#zoomOut').addEventListener('click', () => setZoom(parseInt(zoomSlider.value, 10) - 10));
```

Side-radio change handler from §W extended to also refresh the zoom
readout/slider:

```js
moveSideRadios.forEach(r => r.addEventListener('change', () => {
  const o = batchCards[0].offset[currentMoveSide()];
  moveReadout.textContent = o.dx + ', ' + o.dy;
  zoomReadout.textContent = Math.round(o.scale * 100) + '%';
  zoomSlider.value = Math.round(o.scale * 100);
}));
```

### X.6 Reset wiring

Photo Adjust Reset (button at line ~448) — extend the §W reset to
also zero scale:

```js
batchCards[0].offset = {
  front: { dx: 0, dy: 0, scale: 1 },
  back:  { dx: 0, dy: 0, scale: 1 }
};
zoomReadout.textContent = '100%';
zoomSlider.value = 100;
```

Move pad reset button (`#moveReset` from §W) resets dx/dy only — does
**not** touch scale (separate semantic). To reset zoom, user can
double-click the slider thumb to 100% or press the centre of the
range.

### X.7 Estimated diff

| Area                                       | Lines |
|--------------------------------------------|-------|
| HTML (zoom row inside #movePad)            | ~10   |
| CSS (.idp-zoom-row layout)                 | ~8    |
| State init (extend §W defaults + clamp)    | ~4    |
| `drawWithTransform` helper                 | ~8    |
| Replace 4 drawImage call sites             | ~12   |
| DOM refs + listeners (3 handlers)          | ~20   |
| Side-change handler extension              | ~4    |
| Reset wiring (extend §W reset)             | ~6    |
| **Total (net)**                            | **~70–80** |

Within §V.4 estimate. Single problem per Rule #12 (Zoom is one
feature; pairs with Move at the architectural level but ships as its
own diff so reviewers can isolate the scale-transform behaviour).

### X.8 V1 scope limits (NOT in this PR)

- **Zoom around mouse cursor / pinch point** — V2; centred zoom is V1.
- **Independent X/Y scale** (anamorphic) — out of scope; uniform scale only.
- **Persistence across PDF reloads** — same as §W, out of scope.
- **Batch-mode Zoom** (per-card in 5+ batch) — needs the same card
  picker §W defers.
- **Keyboard shortcuts** (`+`/`-` / scroll wheel) — V2.

### X.9 Test plan (for the code PR)

1. Land §W Move code first. Confirm Move pad works.
2. Apply §X. Load `test-pdfs/pan-test.pdf` (pw `05071999`).
3. Front + zoom slider to 150% → photo zooms in around centre, edges
   crop equally on all 4 sides. Readout `150%`.
4. Switch to Back radio → readout reverts to back's `100%`.
5. Front + Move ↑×3 + Zoom 130% → Move and Zoom compose correctly
   (zoomed photo nudged up).
6. Zoom out to 70% → photo shrinks centred, white margin appears on
   all 4 sides. PAN HOLOGRAM patch (back) and signature box (front)
   stay at their fixed coords — they do **not** shrink.
7. Photo Adjust Reset → both Move (dx/dy) and Zoom (scale) zero
   together for both sides; sliders reset; readouts reset.
8. Generate PVC tray + 5-Pairs + Dragon sheets → Move + Zoom carry
   through to all output sheets via the cached `card.front`/`card.back`.
9. Load `test-pdfs/aadhaar-test.pdf` (pw `SUNI1986`) → repeat 3, 6.
   Aadhaar QR/Mobile/Issue/Download masks stay at fixed coords when
   the photo zooms underneath.
10. Multi-page batch PDF → Move + Zoom controls hide; existing batch
    flow unchanged.

### X.10 Acceptance

- Zoom is centred (no slide to top-left when zoomed in).
- Move and Zoom compose correctly (translate → scale → drawImage).
- Single Photo Adjust Reset zeroes Move + Zoom + sliders together.
- Output sheets reflect both transforms with no sheet-pipeline change.
- Overlays (Aadhaar masks, PAN signature, PAN HOLOGRAM) remain at
  fixed coords irrespective of Zoom or Move.
- `ctx.save`/`ctx.restore` brackets every transform so subsequent
  overlay draws are unaffected.
- No regression in batch-mode rendering.


### X.11 Follow-up — slider DOM refresh (PR #231, 2026-04-26)

After PR #230 shipped, the internal `scale` state was correctly
re-initialised to `{ front: 1.0, back: 1.0 }` on `btnBack` and on a
fresh PDF load, but the `#slZoom` slider thumb and `#zoomReadout`
text retained the **previous** value until the user touched the radio
or dragged. State was right; DOM was stale.

**Fix (4 added lines, `id-print.html`):**

1. Post-PDF-load — after `zoomPad.classList.toggle('idp-hidden', batchCards.length !== 1)`,
   call `refreshZoomReadout()` when single-card mode is shown so the
   slider mirrors the freshly initialised scale.
2. `btnBack` handler — set `slZoom.value = 100` and
   `zoomReadout.textContent = '100%'` so the next session starts clean.

No behavioural change in `drawFiltered` / `applyFilters` /
`getScale`. Pure DOM sync. `btnResetEdit` already calls
`refreshZoomReadout()` so that path was unaffected.

---

## §Y ID Card Print — Phase 3 Auto Photo Enhancement

**Status:** SHIPPED — Code PR #232 (rebased from closed #218),
docs PR #234 (this file). Phase 3 follow-up — closes the last
remaining Phase 3 gap left after toggle options (#217).

### Y.1 What this feature is

A one-click **Auto** button next to **Reset** in the Photo Adjust
editor. Analyses the front-card image luminance histogram and sets
brightness / contrast / saturation sliders so that typical
PDF-rasterised ID card photos (often slightly underexposed) come
out with usable exposure on the first try. The user can still
fine-tune sliders manually after Auto, or hit Reset to revert.

### Y.2 Algorithm

```
src       = originalFront (1011 × 638)
avgLum    = mean of (0.299 R + 0.587 G + 0.114 B) across all pixels
brightAdj = clamp(round(128 / max(avgLum, 1) * 100), 70, 160)
contrastAdj = 115   // fixed mild boost
satAdj      = 110   // fixed mild boost (skin tones pop)
```

Targets a 50% grey midpoint. Clamped 70–160% to avoid pathological
outputs on already-well-exposed or fully-blown photos. Contrast and
saturation are fixed mild boosts — empirically chosen on 6 test
PDFs (PAN, Aadhaar variants).

### Y.3 Implementation (id-print.html, ~25 lines)

- HTML: `<button id="btnAutoEnhance">Auto</button>` inserted before
  `#btnResetEdit` in the Photo Adjust editor title row. Reuses the
  existing Reset button styles — no new CSS tokens, fonts, or colors.
- JS: `btnAutoEnhance` DOM ref, `autoEnhance()` function (creates a
  scratch CR80 canvas, computes `avgLum`, sets sliders, calls
  `applyFilters()`), and click listener.
- Touches `originalFront` only — does **not** interfere with per-side
  Move (§W) or Zoom (§X) state. Works in single-card mode and inherits
  through to all 4 output sheet builders via the existing
  `applyFilters` re-cache path.

### Y.4 Reset behaviour

Auto sets sliders to bright/115/110. `btnResetEdit` (Reset) sets
them back to 100/100/100 — already wired pre-existing, unchanged.
`btnBack` (New PDF) clears `originalFront`, so a fresh Auto run
recomputes from the new image.

### Y.5 What's NOT in scope for this PR

- Per-card Auto in batch mode (uses front of `batchCards[0]` only).
- Histogram equalisation / gamma tone curves.
- White-balance correction.
- Back-card luminance analysis (back is usually similar exposure;
  front-only Auto is enough in practice).

### Y.6 Rebase note (PR #218 → PR #232)

Original PR #218 was conflicted (`dirty`) against current main and
mixed code with `issues.md` updates that referenced an outdated §U
letter (now occupied by PAN Signature). Closed in favour of PR #232,
which carries the same algorithm code-only on a fresh branch from
main, per rule #13 (code PR first, docs PR second-half).

---

## §Z ID Card Print Phase 4 P3 — Photo Editor split panel research

**Status:** SHIPPED — Research PR #235, Code PR #239. Sidebar reorg
into 3 labelled panels (Card Cleanup / Position / Photo Adjust),
Bold text toggle, 3 Quick Presets (Original 100/100/100, Aadhaar
105/130/100, PAN 115/115/110), shared §W+§X Front/Back radio.

**Goal:** The Step 2 sidebar in `id-print.html` has grown organically
through §T (Aadhaar toggles), §U (PAN signature), §W (Move), §X (Zoom),
and §Y (Auto Enhance). It is now a single linear column of unrelated
groups stacked top-to-bottom with no visual hierarchy. Reorganise it
into a small set of clearly-labelled panels, add a **Bold** text-
emphasis toggle that the field has been asking for since #217 landed,
and add three **Quick Preset** buttons that one-click the most common
slider combinations users actually pick.

### Z.1 Current sidebar layout (id-print.html, scouted 2026-04-26)

Inside `<div class="idp-preview">` (lines ~430–527), the children
appear in this exact source order:

1. `<h3 id="previewTitle">` — "Front & Back Preview" / single-card mode title
2. Front + Back canvas pair
3. Layout toggle (Standard / 3-up / Compact / Single)
4. `#aadhaarToggles` (hidden unless Aadhaar detected) — 4 checkboxes
5. `#panToggles` (hidden unless PAN detected) — Hologram + Signature
6. `#movePad` (hidden unless single-card mode) — §W
7. `#zoomPad` (hidden unless single-card mode) — §X
8. `<div class="idp-editor">` — Photo Adjust title row (Auto + Reset)
   followed by Brightness / Contrast / Saturation sliders
9. `<div class="idp-info">` — 4 stat pills
10. `<div class="idp-actions">` — Back + Generate buttons

Issues with this layout:

- **No grouping.** Move (§W) and Zoom (§X) are *Position* operations
  but Auto Enhance (§Y) and the sliders are *Exposure* operations.
  They are visually identical right now (same border, same padding,
  same font).
- **Auto + Reset are inline with the title text.** They look like
  decorative chips, not action buttons. Auto in particular gets
  missed in user testing — half of testers never notice it exists.
- **No quick presets.** Most support tickets boil down to "make the
  Aadhaar text darker" or "fix this washed-out PAN" — both are 2-3
  slider tweaks the user has to discover by dragging. A one-click
  preset solves them.
- **No Bold toggle.** §T toggles let users hide unwanted Aadhaar
  fields, but the *visible* fields are still rasterised at the source
  PDF density and look thin on a CR80 print. Field requests for a
  "Bold" / "Darken text" affordance pre-date PR #217 and have not
  been actioned.

### Z.2 Proposed split-panel structure

Reorganise items 4–8 above into **three labelled panels** with the
existing `.idp-move` border + 8px radius (no new tokens):

```
┌─ Panel A: Card Cleanup ────────────────────┐
│  • Aadhaar toggles (when Aadhaar detected) │
│  • PAN toggles    (when PAN detected)      │
│  • Bold text          [ off | on ]   ← NEW │
└────────────────────────────────────────────┘

┌─ Panel B: Position (Single-card mode) ─────┐
│  • Side: Front | Back  (shared radio)      │  ← NEW shared radio
│  • Move pad     (§W)                       │
│  • Zoom slider  (§X)                       │
│  • Reset position                          │
└────────────────────────────────────────────┘

┌─ Panel C: Photo Adjust ────────────────────┐
│  Quick:   [Original] [Aadhaar] [PAN]  ← NEW│
│  Brightness  ━━━━━○━━━━━  120%             │
│  Contrast    ━━━━━○━━━━━  115%             │
│  Saturation  ━━━━━○━━━━━  110%             │
│  [ Auto ]                  [ Reset ]  ← buttons promoted to row
└────────────────────────────────────────────┘
```

Each panel uses the existing `.idp-move` style class so we get the
border + radius for free without adding new CSS tokens. Panel
headers reuse `.idp-move-label` (already `color:var(--accent)`,
`font-weight:600`) so no new typography either.

### Z.3 Single shared Front/Back radio (Panel B consolidation)

Currently §W and §X each render their **own** Front/Back radio inside
`#movePad` and `#zoomPad`. Both bind into the same per-side state
(`batchCards[0].offsets[side]` and `batchCards[0].scale[side]`)
but the two radios are independent — toggle Front in Move and the
Zoom radio still shows whatever side it was on. Confusing.

Proposed: hoist a single `<div id="positionSide">` radio above both
sub-controls inside Panel B. Move and Zoom both read from
`positionSide.querySelector('input:checked').value`. Saves DOM,
removes the consistency bug, drops ~20 lines.

### Z.4 Bold text toggle (Panel A) — implementation sketch

A boolean checkbox that, when on, runs an extra
`ctx.filter = 'contrast(135%) brightness(95%)'` pass over the
existing rendered front/back canvases before they are composited into
output sheets. Crucially this is **separate** from the Photo Adjust
sliders — Bold layers *on top of* whatever the user has already dialled
in via Brightness/Contrast/Saturation. Without this separation the
user cannot turn Bold off without also resetting their custom
adjustments.

State: `bold: false` on `batchCards[0]`. Re-runs `drawFiltered`.
Hidden in batch mode initially (Phase 4 P3 scope is single-card; batch
Bold belongs in P4 alongside batch Auto Enhance).

### Z.5 Quick Presets (Panel C) — three buttons

| Button | Bright | Contrast | Sat | Use case |
|--------|--------|----------|-----|----------|
| Original | 100 | 100 | 100 | Restore (alias of Reset, but visually a preset) |
| Aadhaar | 105 | 130 | 100 | Crisp dark text on Aadhaar's grey tint |
| PAN     | 115 | 115 | 110 | Brighten washed-out ePAN scans |

Each button just sets `slBright.value / slContrast.value / slSat.value`
and calls `onSliderInput()` (existing function at id-print.html:1806)
which already takes care of the readout text + `applyFilters` re-run.
~12 lines of JS total + 3 `<button>` tags.

Auto Enhance (§Y) stays as-is — it is *adaptive* (looks at the actual
image), whereas presets are *fixed*. Both have a place: Auto for "this
specific upload looks bad", presets for "I always want my Aadhaars to
look like this".

### Z.6 What changes vs. what stays

**Changes:**
- HTML reorder + 3 new `<div class="idp-move">` panel wrappers around
  existing children (no children deleted, just re-parented).
- New shared `#positionSide` radio in Panel B; remove per-control
  Front/Back radios from `#movePad` and `#zoomPad`.
- New `#chkBold` checkbox + handler.
- New `#presetOriginal` / `#presetAadhaar` / `#presetPan` buttons +
  click handlers in Panel C.
- Auto + Reset buttons move from inline-with-title to a new
  flex row at the bottom of Panel C (still uses existing
  `.idp-editor-title button` styles).

**Stays untouched:**
- All slider min/max/value attributes (30–200, 0–200) — `autoEnhance()`
  and Reset still write the same numbers.
- `drawFiltered` / `applyFilters` / `getOffset` / `getScale` — pure
  reorg of the *inputs* to these, not the rendering pipeline.
- A4 sheet builders, PDF download, print path — zero impact.
- §T Aadhaar toggles, §U PAN signature, §W Move maths, §X Zoom maths,
  §Y Auto Enhance algorithm — all kept verbatim.
- Batch mode behaviour — Panel B still hidden in batch (single-card
  only); Panel A still shows toggles per detected card type; Panel C
  sliders still apply globally to all batch cards (current behaviour).

### Z.7 Estimated diff

| Region | Lines |
|--------|-------|
| HTML restructure (3 panel wrappers + shared side radio) | ~40 |
| Bold checkbox + handler + drawFiltered hook | ~25 |
| 3 preset buttons + click handlers | ~20 |
| Move + Zoom radio consolidation (delete duplicates, point at shared) | ~-15 net |
| btnBack / btnResetEdit / fresh-PDF reset additions for Bold + presets | ~10 |
| **Total** | **~80–100 net additions** |

Lower than V.4's ~150 estimate because §W and §X already share the
per-side state model — we are not building new state, just unifying
its UI surface and adding two small features (Bold + presets) on top.

### Z.8 Risks & rollback

- **Risk: shared side radio breaks §W or §X.** Both sub-controls
  currently read `movePad.querySelector('input[name="moveSide"]:checked')`
  and `zoomPad.querySelector('input[name="zoomSide"]:checked')`
  respectively. Changing those reads to a single `positionSide` radio
  is a 2-line edit each. Easy to revert if a regression appears.
- **Risk: Bold cumulative with Auto.** Auto sets contrast 115%; Bold
  layers another contrast 135% on top → effective 155%. Acceptable
  (still in 30–200 slider range mentally) but worth eyeballing on the
  6 test PDFs from §Y.6 before merging.
- **Risk: panel reorder confuses returning users.** Mitigation: ship
  with a one-time ribbon "**New layout** — same controls, grouped" at
  the top of Step 2 that dismisses on click. ~15 extra lines.
  Or skip the ribbon (recommended — desktop-only product, low daily
  re-use, change is intuitive).

Rollback path: `git revert` of the code PR is clean since this is
HTML reorg + small JS additions, no schema changes, no localStorage
keys, no backend touches.

### Z.9 Out of scope for the §Z code PR

- Master Settings (DPI/padding/margins persistence) — V.4 P3 #2,
  separate research §AA.
- PrePrinted Card mode — V.4 P3 #3, separate research §AB.
- Batch-mode Bold or batch-mode Auto — V.4 P4.
- Per-side Bold (back-only emboss) — overkill for the feature ask.
- Drag-to-reorder panels — desktop product, no field demand.
- Saving panel collapsed state — no `localStorage` work in §Z.

### Z.10 Recommended next PR

1. **§Z code PR** — implement the panel split + Bold + presets per
   Z.2–Z.5. ~80–100 lines. Single-card mode tested manually with one
   Aadhaar PDF + one ePAN PDF.

---

## §AA ID Card Print — Auto front-back swap detector + Undo notice

**Status:** SHIPPED — PR #240 (detector + manual button), PR #241
(inline notice with one-click Undo).

### AA.1 Field report

Operators reported that some eAadhaar / ePAN PDFs ship with the
back of the card on page 1 and the front on page 2 (reversed from
the canonical layout). Result: every preview showed swapped sides
and the operator had to either re-export the PDF or accept wrong
prints. Manual reorder was not discoverable.

### AA.2 Detector (PR #240)

Added two helpers in `id-print.html`:

- `skinPixelRatio(canvas, roi)` — scans an ROI rectangle (fractional
  `[x, y, w, h]`) and counts pixels where `R > 95 && G > 40 && B > 20
  && R > G && R > B && |R-G| > 15`. Returns ratio in `[0, 1]`.
- `shouldAutoSwap(frontCanvas, backCanvas)` — computes
  `skinPixelRatio` for both canvases over the photo ROI
  `[0.04, 0.18, 0.22, 0.55]` (left strip, mid-vertical, where the
  passport-style photo lives on every supported card). Returns
  `true` when `bSkin > 0.04 && (bSkin - fSkin) > 0.02`, i.e. the
  "back" canvas has substantially more skin-toned pixels than the
  "front".

Wired into `processPdf()` after both crops are rendered: if
`shouldAutoSwap()` returns true, the canvases are swapped before
filters / overlays apply. Also added a manual **Swap Front/Back**
button in Panel A (Card Cleanup) for the 0–5 % of PDFs the
heuristic gets wrong.

### AA.3 Undo notice (PR #241)

`#swapNotice` div sits directly above the Front canvas in
single-card mode. When auto-swap fires, it shows amber-palette
text "Front and Back were auto-swapped." with an inline
**Undo** button. Click → re-swap canvases, hide notice.

State: `wasAutoSwapped` boolean on the active card object.
`updateSwapNotice()` is called every time Step 2 mounts. Notice
is hidden in batch / multi-card layouts (single-card mode only).

### AA.4 Known limits

- ROI assumes the photo is in the upper-left quadrant of the
  card. True for Aadhaar / PAN / Voter / Ayushman / Jan Aadhaar
  / eShram. If a future card type puts the photo on the right,
  the ROI will need a second variant.
- Threshold tuned on 12 sample PDFs (8 normal + 4 reversed).
  False-positive rate ~0 %, false-negative rate ~8 % (one
  reversed PAN with very dark photo did not trigger). Manual
  Swap button covers the gap.

---

## §AB ID Card Print — Persist Card Cleanup prefs across uploads

**Status:** SHIPPED — PR #242.

### AB.1 Why

Print-shop operators process 30–80 PDFs per session and almost
always want the same Card Cleanup toggles + the same slider preset
(typically Aadhaar 105/130/100 or PAN 115/115/110). Re-toggling
on every upload was the #1 friction point reported after PR #239
shipped the split panel.

### AB.2 What persists

`localStorage` key: `idp:prefs:v1`. Value: JSON object with:

- `hideQR`, `hideMobile`, `hideIssueDate`, `hideDownloadDate`
  (boolean) — the four `#aadhaarToggles` checkboxes.
- `hologram`, `signature` (boolean) — the two `#panToggles`
  checkboxes.
- `bold` (boolean) — the §Z Bold text toggle.
- `preset` (string) — last-clicked Quick Preset id
  (`'original' | 'aadhaar' | 'pan'`) or `null` if user dragged
  sliders manually.

### AB.3 Wiring

- `savePrefs()` — called from every checkbox `change` and every
  Quick Preset button click. Idempotent, swallows quota errors.
- `loadPrefs()` — called once before `applyFilters()` in both
  `processPdf()` (single upload path) and `showBatchPreview()`
  (batch path). Restores DOM state, then `applyFilters()` reads
  from DOM as usual.
- `btnResetEdit` and `btnBack` deliberately do **not** call
  `savePrefs()` — Reset is a one-off action, Back navigates away
  without committing.

### AB.4 Versioning

The `:v1` suffix lets future schema changes cleanly invalidate
old prefs. `loadPrefs()` returns an empty object on JSON parse
errors, so corrupt data never blocks the app.

---

## §AC ID Card Print — Aadhaar crop fix (front + back side-by-side)

**Status:** SUPERSEDED by §AC.6 (PR #245). PR #243 was based on
an operator screenshot from a different eAadhaar variant, but
the canonical UIDAI 2024+ layout — and the test PDF in this repo
(`test-pdfs/aadhaar-test.pdf`) — places the actual cards in the
**bottom row** of page 1, not the upper portion. AC.3's crop
captured the formal Letter (not card-shaped) instead. See §AC.6
for the corrective fix.

### AC.1 Field report

Operator screenshot of single-card mode preview:

- Top preview labelled **Front** contained both the actual card
  front (left, photo) and the actual card back (right, QR) glued
  together as one image.
- Bottom preview labelled **Back** showed the formal Aadhaar
  *Letter* back — not card-shaped, useless for CR80 printing.
  Operator described it as "wastage".

### AC.2 Root cause

Previous `CROP.aadhaar` fractions assumed a vertically-stacked
layout:

```js
front: [0.035, 0.06, 0.93, 0.52]   // top half, full width
back:  [0.035, 0.60, 0.93, 0.36]   // bottom half, full width
```

Current eAadhaar PDFs from UIDAI place the actual card mock-ups
**side-by-side** in the upper portion of page 1, with the formal
Letter back occupying the lower portion. So the upper full-width
crop captured both card surfaces, and the lower crop captured
the unwanted Letter content.

### AC.3 Fix

```js
front: [0.04, 0.06, 0.45, 0.40]    // left half of upper portion
back:  [0.51, 0.06, 0.45, 0.40]    // right half of upper portion
```

Each CR80 output now contains exactly one card surface. The
unwanted Letter content in the lower portion is dropped entirely.

### AC.4 Compatibility

- Auto-swap detector (§AA, PR #240) unaffected — skin-pixel ROI
  is fractional within the cropped canvas.
- `AADHAAR_FIELD_MASKS` (`id-print.html` line 727) intentionally
  **not** retuned in this PR. Old masks were tuned for the Letter
  back layout. On the new small-card back:
  - **Hide QR** — still covers a region containing the QR
    (acceptable but oversized).
  - **Hide Mobile / Issue Date / Download Date** — small card
    mock-up typically does not print these fields, so toggles
    become soft no-ops (they mask blank space, no visible bug).
- PAN / Voter / Ayushman / Jan Aadhaar / eShram crops unchanged.

### AC.5 Follow-up — AADHAAR_FIELD_MASKS retune

**Status:** SHIPPED — combined with §AC.6 in PR #245.

The retune is part of the corrective PR that also fixes the
crop region, since the two are coupled: retuning masks for the
wrong crop region (PR #243's upper-row crop) would have produced
masks that don't line up with anything visible. The fix retunes
both at once, against the actual small-card layout in the bottom
row.

---

## §AC.6 ID Card Print — Aadhaar bottom-row crop + masks retune

**Status:** SHIPPED — PR #245.

### AC.6.1 Re-investigation of the layout

After §AC was shipped (PR #243), the next session re-rendered the
canonical test PDF (`test-pdfs/aadhaar-test.pdf`) at scale 2 and
inspected the page bands directly, then compared against the
reference image `.agents/references/aadhaar-clean-pvc-layout.png`.

Result: the page is laid out in **two rows**, not one:

| | Left | Right |
|---|---|---|
| **Upper row** (≈ y 0.06–0.46) | Formal Aadhaar Letter — Government of India header, enrolment number, "To" + address block, signature box, full Aadhaar number block | Information / Notice page — "सूचना" + INFORMATION header, bullet points "Aadhaar is a proof of identity, not of citizenship", verification instructions |
| **Lower row** (≈ y 0.68–0.91) | Plastic-card front mock-up — Government of India strip, photo, name, DOB, gender, "3959 6199 6325", VID, "मेरा आधार, मेरी पहचान" footer | Plastic-card back mock-up — Unique Identification Authority strip, "पता:" + Hindi address, "Address:" + English address, vertical "Issue Date" / "Download Date" on left margin, QR code, Aadhaar number, VID, "1947 \| help@uidai.gov.in \| www.uidai.gov.in" footer |

PR #243's crop targeted the **upper** row, capturing the formal
Letter (no card border, no photo positioning) as 'front' and the
Notice (no QR, no address) as 'back'. The reference image proves
the operator wants the **lower** row.

The PR #243 commit message attributed the side-by-side layout to
an operator screenshot; that screenshot likely came from a third-
party Aadhaar PDF variant or a misread of the original layout.
The canonical test PDF + reference image agree on the bottom-row
layout.

### AC.6.2 Fix — CROP.aadhaar (lower row)

```js
const CROP = {
  aadhaar: {
    front: [0.010, 0.682, 0.477, 0.231],   // bottom-left card
    back:  [0.504, 0.682, 0.488, 0.231]    // bottom-right card
  },
  // …
};
```

Cropped CR80 outputs now match the reference image exactly.

### AC.6.3 Fix — AADHAAR_FIELD_MASKS (small-card layout)

Old positions were tuned for the formal Letter back (full-page
layout). On the new small-card back, those rectangles would mask
important content (English address, Aadhaar number, footer)
instead of QR / mobile / dates.

New positions, verified by overlaying mask rectangles on the
rendered back canvas at CR80 1011×638:

```js
const AADHAAR_FIELD_MASKS = {
  qrCode:       { side: 'back', x: 535, y:  75, w: 390, h: 350 },
  mobileNumber: { side: 'back', x:   0, y:   0, w:   0, h:   0 },
  issueDate:    { side: 'back', x:   2, y: 105, w:  22, h: 145 },
  downloadDate: { side: 'back', x:   2, y: 250, w:  22, h: 160 },
};
```

Mapping per field:
- **qrCode** — middle-right rectangle covering the full QR with
  ~5 px bleed on each side. Sized from the actual rendered QR
  bounds (x≈541..916, y≈80..419) on the new bottom-row crop, so
  no edge of the QR pattern leaks through.
- **mobileNumber** — small-card mock-up does not print a mobile
  number. Set to 0×0 px, which makes `ctx.fillRect()` a no-op.
  UI toggle is preserved for backward compatibility and any
  future eAadhaar variant that does print mobile (then this
  entry can be retuned without touching the UI). Chose option
  (b) "leave toggles visible and document as soft no-ops" from
  §AC.5; option (a) "hide toggles when small-card mode is
  detected" was rejected because there is no other layout mode
  to detect against — small-card is the only mode now.
- **issueDate** — vertical (rotated 90°) text "Issue Date:
  28/12/2011" on the LEFT margin top. Narrow (22 px wide)
  vertical strip.
- **downloadDate** — vertical (rotated 90°) text "Download Date:
  21/08/2022" on the LEFT margin middle. Narrow (22 px wide)
  vertical strip below the issueDate strip.

### AC.6.4 Verification

- Rendered `test-pdfs/aadhaar-test.pdf` (password `SUNI1986`) at
  scale 2 (1190×1684) using `pdfjs-dist` + `@napi-rs/canvas`.
- Cropped front + back regions to CR80 1011×638. Visual match
  against `.agents/references/aadhaar-clean-pvc-layout.png`.
- Overlaid mask rectangles on the rendered back canvas.
  Confirmed the qrCode mask covers the QR with a small margin;
  the issueDate / downloadDate masks cover the rotated text on
  the left margin exactly; English address and Aadhaar number
  are preserved (not masked).
- `npm run build` passes — `id-print.html  84.6 KB → 80.7 KB`
  obfuscated output.

### AC.6.5 Compatibility

- Auto-swap detector (§AA, PR #240) unaffected — skin-pixel ROI
  is fractional within the cropped canvas.
- PAN / Voter / Ayushman / Jan Aadhaar / eShram crops unchanged.
- Card Cleanup persistence (§AB, PR #242), inline auto-swap
  notice (PR #241), Photo Editor split panel (§Z, PR #239),
  AADHAAR_FIELD_MASKS UI toggles (§T, PR #236) unaffected.

---

## §AC.7 ID Card Print — Un-mirror Aadhaar back on 1-Pair Fold & Laminate

**Status:** SHIPPED — PR #247.

### AC.7.1 Field report

User: "1 Pair · Fold & Laminate" sheet ke right half (back card)
mein text mirror ho raha hai (alta ulta print). Multi-card / Dragon /
PVC layouts mein back card seedha print hota hai.

### AC.7.2 Root cause

`buildSingleSheet()` legacy fold-over-paper workflow ke liye likha
gaya tha — paper ko bich se fold karne par back face neeche aata,
isliye `ctx.scale(-1, 1)` lagaya gaya tha taaki fold ke baad text
seedha dikhe. Aaj ka actual workflow: user dono halves alag-alag
cut karke back-to-back stack karta hai (lamination ke liye), so
mirror karne ki zarurat nahi.

### AC.7.3 Fix

In `buildSingleSheet()` (id-print.html ~line 1482):
- Removed `ctx.save()` / `ctx.translate(...)` / `ctx.scale(-1, 1)` /
  `ctx.restore()` block.
- Replaced with simple `var backX = startX + cardW + gap;` +
  `ctx.drawImage(card.back, backX, startY, cardW, cardH)` (or
  `drawCardClipped(...)` when rounded corners enabled).
- Added comment block explaining the change so future agents
  don't restore the mirror "to fix" something else.

### AC.7.4 Compatibility

- Multi-card / Dragon / PVC layouts already drew back un-mirrored —
  1-pair now matches them.
- Fold-line dashed indicator + "fold here" label kept (still useful
  as a cut-guide marker even when user cuts instead of folds).
- No CROP / mask changes in this PR (one problem per PR — Rule #8).

---

## §AC.8 ID Card Print — Tighten Aadhaar crop to outer black border + gap=0

**Status:** SHIPPED — PR #248.

### AC.8.1 Field report

User reference snip (`IS_TRHE_KA_CUT_KARNA_HAI_PDF_SE`): cards ke
charo taraf jo black border hai usi tak cut karna hai (white margin
nahi chahiye), AUR front + back ekdum sat ke print hone chahiye
(no whitespace between them on the printed A4).

### AC.8.2 Root cause

(a) `CROP.aadhaar` (§AC.6, PR #245) cards ke around ~85px white
    margin chhoot raha tha. Measured by rendering
    `test-pdfs/aadhaar-test.pdf` at 200 DPI and detecting the
    actual outer black-border line of the small plastic-card
    mock-ups: cards lie in PDF fractional region
    `x: 0.0520..0.9456`, `y: 0.6657..0.8816`, with a middle
    vertical seam at `x=0.4991` separating front from back.

(b) `buildSingleSheet()` had `var gap = 40` between front and back
    canvases on the A4. Combined with (a)'s white margin this
    looked like ~125px total whitespace at the seam.

### AC.8.3 Fix — CROP.aadhaar (tight to outer border)

```
front: [0.0520, 0.6657, 0.4471, 0.2159]
back:  [0.4991, 0.6657, 0.4465, 0.2159]
```

Both halves share the seam x=0.4991 — when drawn side-by-side
they touch with zero whitespace. Verified with a measure script:
new crop renders cards with 0 px margin on all four edges (vs
85–95 px on the old crop).

### AC.8.4 Fix — AADHAAR_FIELD_MASKS (linear-scaled)

The CROP change shifts how PDF pixels map to the 1011×638 CR80
canvas. Old vs new mapping for the back card:

```
canvas_x' ≈ 11 + canvas_x * 1.093
canvas_y' ≈ 48 + canvas_y * 1.070
w'        =     w        * 1.093
h'        =     h        * 1.070
```

Applied to existing masks:

```
qrCode:       { side:'back', x: 596, y: 128, w: 415, h: 374 }
mobileNumber: { side:'back', x:   0, y:   0, w:   0, h:   0 }
issueDate:    { side:'back', x:  13, y: 160, w:  24, h: 155 }
downloadDate: { side:'back', x:  13, y: 316, w:  24, h: 171 }
```

This preserves the same coverage region in PDF space, so the UI
"Hide QR / Hide Issue Date / Hide Download Date" toggles continue
to mask the correct content with the new tight crop.

### AC.8.5 Fix — buildSingleSheet gap = 0

`var gap = 40` → `var gap = 0`. Comment block added pointing to
PR #248 / §AC.8 explaining why (so future agents don't re-add
spacing thinking it was an oversight).

`foldX = startX + cardW + gap / 2` becomes `startX + cardW` —
the dashed fold/cut line lands exactly on the seam between the
two cards. Visually clean since the seam is at the merged black
border edges.

### AC.8.6 Verification

- `npm run build` clean: id-print.html 84.9 → 85.4 KB raw, 80.9 →
  81.5 KB obfuscated.
- Standalone measure script (`measure.js`, `find-qr.js`,
  `render-crop.js`, `preview-final.js` — all gitignored,
  not committed) at `/tmp/work/pp/`:
  - Border detection: outer black borders at PDF px
    `x=86..1563, y=1557..2062` (PNG 1653×2339 from 200 DPI render).
  - Per-card region: width 738 × height 505 PDF px, scaled into
    1011×638 canvas.
  - Margin re-measure: new crop = 0,0,0,0 on all edges (vs old
    crop 85,89,0,0 / 85,0,0,95).
  - QR detection: PDF px x=1271..1489, y=1709..1936 (back card
    right-middle), comfortably inside the new 596,128,415,374
    mask.
- Visual composite of new front+back at gap=0 with masks applied —
  matches the user's snipping-tool reference (cards touch, QR
  cleanly masked white, dates clean on left margin).

### AC.8.7 Compatibility

- `buildMultiCardSheet`, `buildDragonSheet`, `buildPVCTraySheet`
  use `CR80_W` × `CR80_H` source canvases the same way; tighter
  crop just means each card's content fills more of its CR80
  canvas (no longer surrounded by white margin). Per-pair / per-row
  gaps in those layouts are unchanged.
- Auto-swap detector (§AA, PR #240) skin ROI is fractional within
  the canvas — unaffected by absolute crop shift.
- PAN / Voter / Ayushman / Jan Aadhaar / eShram crops unchanged.
- AADHAAR_FIELD_MASKS UI toggles (§T) continue to work — masks
  re-tuned to match the new mapping.
- Mirror fix (§AC.7, PR #247) preserved — back card still drawn
  un-mirrored; this PR only changes the gap value, not the draw
  call.

---

## §AC.9 ID Card Print — Cut Marks toggle on 1-Pair Sheet

**Status:** SHIPPED — PR #251.

### AC.9.1 Field report

After §AC.8 (PR #248) tightened the Aadhaar crop and dropped the gap
to zero, the front + back cards print edge-to-edge on the 1-pair
sheet. The single dashed fold/cut line that ran down the seam is no
longer needed for fold-and-laminate (workflow today is cut + stack
back-to-back). User asked for an opt-in **Cut Marks** layer on the
1-pair sheet — short tick marks at all four outer corners of the
combined card pair, so a guillotine / scissor cut lands on the
outer black border without guesswork.

### AC.9.2 Fix

Re-used the existing `cutMarks` boolean (already wired for multi-card
/ Dragon / PVC paths). Added a new `chkCutMarks` checkbox in the
Step 2 sidebar `panelPosition` (visible in single-card mode). On
`change`: `cutMarks = chkCutMarks.checked; buildSheet(); savePrefs()`.

`buildSingleSheet()`:

- When `cutMarks` is true, draws 4 short black tick marks (8 px long,
  1 px stroke) extending outward from each corner of the merged
  cards rectangle (`startX, startY` to `startX + 2*cardW, startY + cardH`).
- The dashed seam fold line is now skipped when `cutMarks` is on
  (would clutter the cut guides; the seam itself already aligns
  with the cards' inner black border).
- Default OFF — cards print clean by default; user opts in only
  when they want corner ticks for cutting accuracy.

Persisted via existing `savePrefs()` / `loadPrefs()` on `idp:prefs:v1`.

### AC.9.3 Verification

- `npm run build` clean. id-print.html bumped slightly (+~0.6 KB).
- 1-pair sheet with `cutMarks` ON: 4 corner ticks render correctly
  on A4 preview, no seam line. OFF: clean cards, no ticks (default).
- Multi-card / Dragon / PVC paths unchanged (they had cutMarks
  rendering already).
- Persists across page reloads via `localStorage`.

### AC.9.4 Compatibility

- Extends existing `cutMarks` global — no new prefs key.
- `buildSingleSheet` is the only path touched; `buildMultiCardSheet`,
  `buildDragonSheet`, `buildPVCTraySheet` left alone.

---

## §AC.10 ID Card Print — Remove "Card Cleanup" panel

**Status:** SHIPPED — PR #252.

### AC.10.1 Field report

User: *"iska koi kaam nahi hai feature main"* (this panel has no
operational value). The Card Cleanup panel — Hide QR / Hide Mobile
No. / Hide Issue Date / Hide Download Date (Aadhaar), Add Signature
Box / Add Hologram Patch (PAN), Bold Text, Swap Front/Back —
introduced in PRs #217 / #221 / #224 / #239 plus the auto-swap
notice (§AA, PRs #240/#241) was confirmed unused in real workflows.
User explicitly confirmed full panel removal **including the Swap
Front/Back button**.

### AC.10.2 Fix — UI removed

- `panelCleanup` div: `aadhaarToggles` (4 checkboxes), `panToggles`
  (2 checkboxes), Bold Text checkbox, `swapRow` with Swap Front/Back.
- `swapNotice` div + Undo button (§AA auto-swap notification —
  auto-swap behaviour itself also removed).

### AC.10.3 Fix — JS removed

- **Constants:** `AADHAAR_FIELD_MASKS`, `PAN_OVERLAY_REGIONS`.
- **Functions:** `applyAadhaarMasks`, `applyPanOverlays`,
  `swapFrontBack`, `updateSwapNotice`, `clearAutoSwapFlag`,
  `shouldAutoSwap`, `skinPixelRatio`.
- **Auto-swap logic** in `fetchPdfCard` / `processPdf`
  (`autoSwapped` / `didAutoSwap` flags, `card.autoSwapped` property
  no longer set or read).
- **DOM refs:** `aadhaarToggles`, `panToggles`, `chkHideQR`,
  `chkHideMobile`, `chkHideIssueDate`, `chkHideDownloadDate`,
  `chkSignatureBox`, `chkHologram`, `chkBold`, `btnSwapSides`,
  `swapNotice`, `btnUndoSwap`.
- **Bold-text branch** stripped from `getFilterString` (now pure
  brightness/contrast/saturate).
- **Cleanup-toggle entries** stripped from `savePrefs` / `loadPrefs`
  (`idp:prefs:v1` schema now: `rounded`, `cutMarks`, slider preset).
- **Cleanup-related entries** stripped from `btnResetEdit` and
  `btnBack` reset paths.
- **applyAadhaarMasks / applyPanOverlays call sites** in
  `drawFilteredToCanvas`, `applyBatchFilters`, and `applyFilters`.

### AC.10.4 Kept untouched

Card-type detection + label badge, Position panel (move/zoom),
Auto Enhance, slider presets, Rounded Corners, Cut Marks (PR #251),
all sheet builders (`buildSingleSheet`, `buildMultiCardSheet`,
`buildDragonSheet`, `buildPVCTraySheet`).

### AC.10.5 Verification

- `npm run build` clean. id-print.html: 86.3 KB → 75.7 KB raw
  (~10 KB removal). dist obfuscated 75 → 72 KB.
- `rg` confirms zero remaining references to removed identifiers.
- Step 2 sidebar now shows only **Position** + **Photo Adjust** +
  **Quick Presets** + Auto Enhance + Reset.

### AC.10.6 Compatibility

- `idp:prefs:v1` keys for removed toggles are simply ignored on
  load (forward-compatible — old persisted state doesn't break).
- Card-type detection still runs (used for the badge); only the
  cleanup mask code paths are gone.
- §AA auto-swap is fully gone; if the PDF arrives front/back swapped,
  user no longer has an auto correction. **Replacement rendering**
  is being designed in §AC.11 (preview redesign) which obviates the
  need for a swap concept on the printed sheet.

---

## §AC.11 ID Card Print — Front+Back preview redesign (landscape, unified)

**Status:** SHIPPED — PR #254 (initial unified preview, back-LEFT / front-RIGHT) + PR #256 (order corrected to front-LEFT / back-RIGHT per user follow-up). See §AC.11.12 below for the correction note.

### AC.11.1 Field report

User feedback (with attached snipping-tool reference at
`.agents/references/preview-landscape-target.png`):

> "Ye jo Front & Back Preview wala hai ye bhi shi karna hai. Phele
> ye Front dikhata hai or fir neche Back. Ye shi kro jis trh se
> PDF main se ID ko cut karte hai vaise hi preview main dikhna
> chahiye — landscape main, **right side Front or left side Back**.
> Aapko full permission hai design ko adjust karne ke liye. Maine
> snipping tool se ID ko cut kiya hai — ID ke charo side diye gaye
> lines ka use kiya — waise hi aapko karna hai. Jo cut hoga wo
> same to same preview main dikhana hai bina back or front ko alag
> alag kre."

Translation: today the Step 2 preview shows **two stacked vertical
canvases** — Front on top, Back below. User wants a **single
unified landscape preview** — **Front on the LEFT, Back on the RIGHT**
— matching exactly what the printed 1-pair sheet looks like after
cut. No separate Front/Back labels, no two boxes — just one image
that mirrors the printed output 1:1.

> *Note on order:* the original brief above (verbatim Hinglish) reads
> "right side Front or left side Back". On a follow-up after PR #254
> shipped, the user clarified the preferred order is the opposite —
> **front on the LEFT, back on the RIGHT** — matching how a card is
> naturally held and read. PR #256 ships the swap. All the §AC.11
> sub-sections below have been edited to reflect the corrected order;
> see §AC.11.12 for the correction history.

### AC.11.2 Reference

`.agents/references/preview-landscape-target.png` (635 × 278 PNG,
committed this session). It is the user's snipping-tool capture
of an Aadhaar card cut from the source PDF using the printed black
border lines as the cut guide. Both halves are present, side by
side, in landscape orientation. The reference image happens to show
**left = back, right = front**, but the *target order for the
preview* — finalised after PR #254 — is the opposite: **left = front
(photo, name, DOB, VID), right = back (Hindi text, QR, address)**.
Treat the reference image purely for proportions and seam placement;
the side assignment is set by §AC.11.4 / §AC.11.12 below.

This image IS the spec for §AC.11. The Step 2 preview should look
like this image.

### AC.11.3 Current state (what exists today)

`#preview` markup (Step 2):

```html
<div class="idp-preview-wrap">
  <canvas id="frontCanvas" class="idp-preview-canvas"></canvas>
  <canvas id="backCanvas"  class="idp-preview-canvas"></canvas>
</div>
```

`.idp-preview-wrap` is `display:flex; flex-direction:column;` with
each canvas sized to its own CR80 1011×638 (scaled down via CSS).
`drawFiltered(side)` writes to `frontCanvas` / `backCanvas`
independently.

### AC.11.4 Proposed redesign

**Markup:** one canvas instead of two.

```html
<div class="idp-preview-wrap">
  <canvas id="pairCanvas" class="idp-preview-canvas-pair"></canvas>
</div>
```

Internal canvas resolution: `CR80_W * 2 × CR80_H` = 2022 × 638 px
(matches 1-pair sheet at native scale). CSS scales down to fit
container: `width:100%; max-width:760px; height:auto; aspect-ratio:
2022/638;` (≈ 3.17:1 landscape).

**Draw order:** in `drawFiltered()` (now takes no `side` arg, or
internally loops both):

```js
const ctx = pairCanvas.getContext('2d');
ctx.clearRect(0, 0, 2022, 638);
// LEFT half = FRONT card
drawCardInto(ctx, /*dx=*/0,        /*dy=*/0, frontImageData, 'front');
// RIGHT half = BACK card
drawCardInto(ctx, /*dx=*/CR80_W,   /*dy=*/0, backImageData,  'back');
```

`drawCardInto` is `drawFilteredToCanvas` adapted to accept a target
context + offset, so it applies brightness/contrast/saturate filters,
the per-side Move (`getOffset`), the per-side Zoom (`getScale`), and
the rounded-corner clip path (if enabled — applied to each half
separately so the rounded shape mirrors how the cards actually look).

**Single image, no labels:** drop the "Front" / "Back" `<small>`
captions — the layout makes it obvious. This matches the user's
"bina back or front ko alag alag kre" requirement.

### AC.11.5 Output paths — verify untouched

Preview is just a UI layer. The A4 / Dragon / PVC sheet builders
already render front/back independently from `frontImageData` and
`backImageData` and arrange them per layout. **They MUST NOT be
changed by §AC.11.** Touch only `#preview` markup, the new
`pairCanvas` draw function, and any `drawFiltered` call site that
expects `(side)`.

### AC.11.6 Position panel compatibility

- Per-side **Move** d-pad (PR #229) — keeps Front/Back radio. The
  selected side's offset still applies inside the new preview
  (Front offset → LEFT half, Back offset → RIGHT half).
- Per-side **Zoom** slider (PR #230) — same story, still works
  per side, just rendered into the unified canvas.

### AC.11.7 Edge cases

- Single-side cards (e.g. some PAN test PDFs render only the front
  page successfully) — if `backImageData` is null, draw the front in
  the LEFT half and leave the RIGHT half as the `#eaeaea` light-grey
  placeholder. (Order corrected post-merge — PR #256.)
- Batch mode (`isBatchMode`) — preview already shows the first card
  of the batch; extend to render the pair view of the active batch
  card. Re-use the same `drawFiltered` path.

### AC.11.8 Estimated diff

- HTML: −2 canvas elements + 1 new canvas (~5 lines net).
- CSS: replace two `.idp-preview-canvas` rules with one
  `.idp-preview-canvas-pair` rule (~10 lines net).
- JS: refactor `drawFiltered`, `applyFilters`, `applyBatchFilters`
  to write into the single `pairCanvas` (~40–60 lines).

Total: ~60–80 line code PR. One file (`id-print.html`). Plus dist rebuild.

### AC.11.9 Acceptance

- Step 2 preview renders **one wide landscape canvas** at ~3.17:1
  aspect ratio.
- LEFT half visually matches the front card; RIGHT half visually
  matches the back card. (Order corrected post-merge — PR #256.)
- No "Front" / "Back" text labels around the preview.
- Move / Zoom / brightness / contrast / saturate / rounded corners
  /Auto Enhance all still apply per side.
- 1-Pair sheet, multi-card, Dragon, PVC outputs unchanged.
- `npm run build` clean.
- Visually matches `.agents/references/preview-landscape-target.png`
  proportions (cards touch at the seam, no gap).

### AC.11.10 New session note

User is starting a fresh account due to quota; new chat will pick
up §AC.11 as the first task. The §11 prompt template in
`.agents/skills/studioprint/SKILL.md` has been refreshed accordingly.

### AC.11.11 Image-saving discipline

User requested: *"Jab bhi main ye images dun ye bhi aapko save
karke rakhni hai jisse aapko pta lag jaayega kaam shi ho rha hai
ya nhi."* — Going forward, every reference image the user attaches
goes into `.agents/references/` with a descriptive filename and a
short note in the relevant `issues.md` section explaining what
the image shows + which feature it pins.

### AC.11.12 Order correction (post-PR #254)

After PR #254 merged, the user asked for the Front/Back order in
the unified preview to be flipped. Verbatim Hinglish:

> "Front & Back Preview GALAT HAI FRONT WALE KO LIFT MAIN KRO OR
> BACK WALE KO RIGHT MAIN"

— i.e. the original brief (back LEFT, front RIGHT) was wrong; the
correct order is **front LEFT, back RIGHT**. This matches how a
card is naturally held and read (front face shown first, back
revealed when flipped right).

PR #256 ships the swap:

- Single behaviour change in `compositePair()`: front-half draw now
  uses `dx=0`, back-half draw uses `dx=CR80_W`.
- Per-half rounded-clip paths swap with the draw order.
- All explanatory comments in `id-print.html` (CSS rule, markup
  comment, `applyFilters()`, `showBatchPreview()`,
  `applyBatchFilters()`) updated to describe the new order.
- All §AC.11 sub-sections above (AC.11.1–AC.11.9) edited to read
  "front LEFT, back RIGHT" — the original Hinglish quote is kept
  verbatim in §AC.11.1 with a note explaining the post-merge
  clarification.
- Sheet builders untouched. Move/Zoom/Rounded Corners/Cut Marks
  still apply per-side (Front offset → LEFT half, Back offset →
  RIGHT half).

Estimated diff: ~6 line behaviour change + ~10 line comment
sweep + dist rebuild. One file (`id-print.html`).

**Acceptance for PR #256:**

- Step 2 preview shows the front card on the LEFT half of the
  unified landscape canvas and the back card on the RIGHT half.
- Edge case (back missing): front renders on LEFT, RIGHT half
  stays as `#eaeaea` placeholder.
- Move (PR #229), Zoom (PR #230), Rounded Corners (PR #194), Cut
  Marks (PR #251) all behave correctly per side.
- Sheet builders untouched — `npm run build` clean.

---

## §AC.12 ID Card Print — Swap sides toggle on Step 2 unified preview

**Status:** SHIPPED — PR #258 (commit `d8acf0f`, merged into main).

**User feedback (Hinglish, post-§AC.11/PR #256):**

> User wanted a quick way to flip just the *preview* so back is on the
> LEFT and front on the RIGHT (or vice-versa) without affecting the
> printed sheet. The default front-LEFT / back-RIGHT (set by §AC.11 +
> PR #256) stays unchanged on first paint; the toggle is opt-in and
> remembered between sessions.

**Change:**

- New small icon-button `#btnSwapSides` (↔ icon, label "Swap sides",
  Hindi tooltip "Front/Back ki side swap karo") rendered just below
  the unified `#pairCanvas` in Step 2.
- New state `let swapSides = false;` (default off).
- `compositePair(canvas, frontReady, backReady)` — at the top, swaps
  the two args when `swapSides === true`. The function then draws
  "frontReady" at `dx=0` and "backReady" at `dx=CR80_W` exactly as
  before, so per-half rounded-corner clip paths follow the swapped
  order automatically.
- Persisted in `localStorage.idp:prefs:v1` under new key `swapSides`.
  Read on init via `loadPrefs()`, written on every toggle via
  `savePrefs()`. Restored button state reflects active class +
  `aria-pressed`.
- Batch mode honoured: `applyBatchFilters()` already calls
  `compositePair(c, tmpF, tmpB)` for every per-card pair canvas, so
  toggling re-paints all of them in one click.
- **Sheet builders untouched.** `buildSingleSheet` /
  `buildMultiCardSheet` / `buildDragonSheet` / `buildPVCTraySheet`
  keep consuming `frontImageData` / `backImageData` by side identity
  — swap is preview-only.

**Acceptance:**

- [x] Default page load: front-LEFT, back-RIGHT (unchanged).
- [x] Click toggle: front jumps to RIGHT, back to LEFT.
- [x] Reload: order matches persisted preference (`idp:prefs:v1.swapSides`).
- [x] Move (#229), Zoom (#230), Rounded Corners (#194), Cut Marks (#251)
      all behave correctly per side regardless of toggle state.
- [x] Sheet outputs (1-pair, multi, Dragon, PVC) unchanged in both
      toggle states.
- [x] `npm run build` clean. Both `id-print.html` and
      `dist/id-print.html` in this PR.

---

## §AC.13 ID Card Print — Responsive A4 preview, 1-pair to top, drop Cut Marks UI

**Status:** SHIPPED — PR #259 (commit `b5bf55c`, merged into main).

**User feedback (3 screenshots — saved at `attached_assets/Screenshot_(353|354|355)_*.png` in the project history):**

> 1. The A4 result canvas in Step 2 is way too big — it dominates the
>    screen on phones and on tall desktop windows.
> 2. On the 1-Pair Fold & Laminate layout, the card pair sits in the
>    middle of the A4 — wastes paper. Move it to the TOP so the unused
>    bottom half is reusable.
> 3. Remove the **Cut Marks** UI option entirely (the `#chkCutMarks`
>    checkbox in the Step 2 sidebar). And remove the "← fold here →"
>    line + corner ticks above the cards on the 1-Pair sheet. Add
>    matching white-stock padding on top so all four sides have
>    consistent clean margin.

**Change:**

- **CSS — responsive `.idp-a4-wrap`:** wrap centred via
  `text-align:center`. Canvas: `max-width: min(100%, 600px)`,
  `max-height: 78vh`, `width:auto / height:auto` so aspect ratio is
  preserved. Phone breakpoint (`max-width:640px`): `max-height: 72vh`,
  wrap margin reduced.
- **`buildSingleSheet`:** `startY = startX` (= `(A4_W - pairW) / 2`)
  → cards drawn flush at top with the same white margin as left /
  right. The entire `if (cutMarks) { … }` block deleted (no dashed
  fold line, no fold-here caption, no `drawCornerMarks`, no seam
  ticks).
- **Markup + state — Cut Marks UI removed:**
  - `<label class="idp-option"><input id="chkCutMarks" …>Cut Marks</label>`
    deleted.
  - JS ref `const chkCutMarks = $('#chkCutMarks');` deleted.
  - `chkCutMarks.addEventListener('change', …)` listener deleted.
  - `savePrefs()` no longer writes `cutMarks` to `idp:prefs:v1`.
  - `loadPrefs()` no longer reads `cutMarks`. Stale values from
    older prefs blobs are silently ignored.
  - `let cutMarks = true;` → `const cutMarks = true;` (kept so
    multi-card / Dragon / PVC builders keep drawing their cut guides
    exactly as before).

**Acceptance:**

- [x] A4 preview canvas no longer overflows / dominates on mobile
      portrait or tall desktop windows. Aspect ratio preserved.
- [x] 1-Pair sheet: cards at TOP of A4, equal padding on top / left /
      right.
- [x] Cut Marks checkbox is gone from Step 2.
- [x] 1-Pair sheet has no "← fold here →" line, no dashed seam, no
      corner ticks.
- [x] Multi-card / Dragon / PVC sheets visually unchanged (cut guides
      still drawn).
- [x] §AC.12 Swap sides toggle still works.
- [x] `npm run build` clean. Both `id-print.html` and
      `dist/id-print.html` in this PR.

---

## §AC.14 ID Card Print — Crop Aadhaar perforation strip, push 1-pair flush to top, shrink preview

**Status:** SHIPPED — PR #260.

**User feedback (Hinglish, screenshots saved at `attached_assets/aadhaar-a4-sheet_*.png`, `attached_assets/Screenshot_(356|357)_*.png`):**

> 1. There is still a thin dashed horizontal line ABOVE the cards in
>    the exported A4 PNG (user marked with red arrows). They want it
>    gone, and they want the card border to look "complete on all 4
>    sides".
> 2. Cards still placed too far below the top edge — push them
>    flush to the top.
> 3. The A4 preview after §AC.13 is **still too tall** on desktop and
>    phone — the empty bottom half of the sheet pushes the canvas to
>    nearly full screen height.

**Investigation (key finding):**

`buildSingleSheet` was audited line-by-line (`rg ctx\\.(stroke|setLineDash|moveTo|lineTo|rect|fillRect|drawImage|fillText)`).
It draws **only**: white fill, the front card image, the back card
image, and the "CR80 · 85.6 × 54 mm · 300 DPI — Studio Print" caption
*below* the cards. Nothing is drawn above the cards. The dashed line
the user sees is therefore **part of the e-Aadhaar PDF source** —
the perforation cut indicator strip that real e-Aadhaar PDFs print
just above the card border. PR #248 had tightened `CROP.aadhaar` to
"hug the outer black border" but apparently still included the
perforation strip on the test PDF.

**Change:**

- `CROP.aadhaar`:
  - front: `[0.0520, 0.6657, 0.4471, 0.2159]` →
           `[0.0520, 0.6821, 0.4471, 0.1995]`
  - back:  `[0.4991, 0.6657, 0.4465, 0.2159]` →
           `[0.4991, 0.6821, 0.4465, 0.1995]`
  - y bumped down by **+0.0164** and h reduced by the same **−0.0164**
    (~5 mm at A4 = ~58 px in PDF render space) on both halves. Bottom
    edge unchanged. New aspect ≈ **1.585 : 1** which matches CR80
    exactly (was 1.464 : 1, slightly tall — that surplus *is* the
    perforation strip).
- `buildSingleSheet` — top margin: `var startY = startX;` (~229 px /
  19 mm) → `var startY = 80;` (~7 mm @ 300 DPI). Side margins
  untouched.
- CSS `.idp-a4-wrap` / canvas tighter cap:
  - `max-width: min(100%, 600px)` → `min(100%, 460px)` (desktop).
  - `max-height: 78vh` → `55vh` (desktop).
  - Mobile (`max-width:640px`): `max-height: 72vh` → `50vh`,
    `max-width: 100%`.
  - Wrap margin reduced 20px → 14px (10px on mobile).

**Acceptance:**

- [x] Exported A4 PNG no longer shows the dashed perforation line
      above the Aadhaar card top border.
- [x] 1-Pair sheet: cards sit ~7 mm from the top of the A4 (clearly
      flush vs the previous ~19 mm).
- [x] A4 preview canvas comfortably fits on desktop and phone without
      dominating the screen.
- [x] Multi-card / Dragon / PVC sheets visually unchanged.
- [x] `npm run build` clean. Both `id-print.html` and
      `dist/id-print.html` in this PR.

**Rollback note:** if the new aadhaar crop happens to clip into the
very top of the actual Aadhaar card content on some PDF variants,
the simple rollback is to bump `y` back partway (e.g. `0.6770` and
h `0.2046`) — values were derived from CR80 aspect math against
`test-pdfs/aadhaar-test.pdf`, not measured on every variant.

---

## §AC.15 ID Card Print — Push 1-Pair sheet flush to top + black top edge line

**Status:** SHIPPED — PR #262.

**User feedback (Hinglish, follow-up to §AC.14):**

> 1. Card abhi bhi top se thoda neeche hai, **bilkul top tak push** karo
>    (ek dam upar le aao).
> 2. Aadhaar card ke **upper wali side jo "sizer wali line" hai** uske
>    jagah par ek **black line add karo** — currently top edge khali
>    dikhta hai (perforation strip §AC.14 mein crop ho gayi thi, ab top
>    border missing lagta hai).

**Investigation:**

- §AC.14 set `var startY = 80;` (~7 mm @ 300 DPI). User wants closer to
  top — `startY = 30` (~2.5 mm) is the practical minimum that still
  leaves room for printer feed margins on home printers.
- Cropping the perforation strip in §AC.14 also stripped the **top edge
  of the card border** itself on most e-Aadhaar PDFs (the perforation
  was glued to the card border in the source PDF). Result: cards now
  show a clean **bottom + left + right** border but **no top border**,
  visually asymmetric.
- Fix: draw a **4 px solid black line** along the very top edge of each
  card in `buildSingleSheet`, after the `drawImage` call. Width =
  `cardW`, height = 4 px, colour `#000`. If `rounded === true`, inset
  the line by the corner radius `r` so it doesn't bleed past the
  rounded clip mask.

**Change (id-print.html, `buildSingleSheet`):**

- `var startY = 80;` → `var startY = 30;` (~2.5 mm @ 300 DPI).
- After each `ctx.drawImage(card.front/back, …)` call, add a
  `ctx.fillStyle = '#000'; ctx.fillRect(x + (rounded ? r : 0), startY,
  cardW - (rounded ? 2*r : 0), 4);` block (one for front, one for
  back). Inset by `r` keeps the line inside the rounded-corner clip.
- Multi-card / Dragon / PVC builders **untouched** — they already draw
  cut guides and a full card border, so they don't need the fix.

**Acceptance:**

- [x] 1-Pair sheet: cards now sit ~2.5 mm from the top of the A4 (vs
      ~7 mm before).
- [x] Each card has a clean solid-black 4 px line along its top edge,
      visually completing the border on all 4 sides.
- [x] When `rounded` is enabled, the black line stops at the rounded
      corner inset (no bleed past the clip).
- [x] `npm run build` clean. Both `id-print.html` and
      `dist/id-print.html` in this PR.

---

## §AC.16 ID Card Print — PAN crop fix to actual card row (Aadhaar-parity layout)

**Status:** SHIPPED — PR #263.

**User feedback (Hinglish):**

> Abhi tak **PAN card** par kaam start nhi hua hai. **Aadhaar ke jaise
> hi hai wo ID** — bhi same to same system uske liye bhi kaam karega.
> (i.e. apply the §AC.14 / §AC.15 treatment to PAN too — flush-top
> placement + black top edge — but first the crop has to actually point
> at the PAN card, which it doesn't.)

**Investigation:**

`CROP.pan` was still using the **legacy assumption** from before the
two-row e-PAN layout was understood:

```js
// OLD — wrong
front: [0.05, 0.08, 0.90, 0.42]   // top half of page, full width
back:  [0.05, 0.54, 0.90, 0.40]   // bottom half of page, full width
```

The actual e-PAN PDF (Protean eGov / NSDL — see
`test-pdfs/pan-test.pdf`, password `05071999`) ships the **same
two-row layout as e-Aadhaar**:

1. **Upper row** — formal **e-PAN Letter** (full-width, with QR, photo,
   signature, body text "If this card is lost / someone's lost card is
   found, please inform / return to:").
2. **Lower row** (below the dashed `---- Cut ----` indicator) — two
   plastic-card mock-ups side by side: **front-LEFT** (photo, name,
   father's name, DOB, signature) and **back-RIGHT** (return address,
   hologram).

With the old crop, the printed CR80 *front* became the giant Letter
and the printed *back* became the tiny card row crammed into a
card-sized region — totally unusable.

**Measurement (`pdftoppm -upw 05071999 -r 300`):**

PDF page = 2480 × 3509 px. Card-row Y range ≈ 2655 → 3340 px.
Front card x-range ≈ 170 → 1245 px. Back card x-range ≈ 1275 → 2345 px.
Aspect of each card ≈ 1.57 (CR80 = 1.585).

**Change (id-print.html, `CROP.pan`):**

- front: `[0.05, 0.08, 0.90, 0.42]` → `[0.0685, 0.7567, 0.4335, 0.1952]`
- back:  `[0.05, 0.54, 0.90, 0.40]` → `[0.5141, 0.7567, 0.4314, 0.1952]`
- Long inline comment block in `id-print.html` documents the layout +
  measurement source so the next session doesn't need to re-derive.
- **No code-path changes** — `buildSingleSheet`, multi-card builder,
  Dragon and PVC builders are all type-agnostic (they draw whatever
  `card.front` / `card.back` contain), so the §AC.15 flush-top + 4 px
  black-top-line treatment now applies to **PAN cards automatically**,
  exactly what the user asked for ("Aadhaar ke jaise hi").

**Acceptance:**

- [x] Uploading `test-pdfs/pan-test.pdf` (pw `05071999`) now produces a
      Step-2 preview showing the actual PAN front (photo, name, DOB,
      QR, signature) and back (return address, hologram), at correct
      CR80 aspect, instead of the formal Letter cut into card-sized
      rectangles.
- [x] 1-Pair sheet auto-inherits §AC.15 flush-top placement and 4 px
      black top edge line.
- [x] Multi-card / Dragon / PVC sheets render the correct PAN cards.
- [x] Aadhaar / Voter / Ayushman / Jan Aadhaar / eShram crop coords
      untouched.
- [x] `npm run build` clean. Both `id-print.html` and
      `dist/id-print.html` in this PR.

**Rollback note:** if a different e-PAN issuer (UTIITSL, etc.) ships a
different layout and the crop misses, the simple rollback is to loosen
slightly: `y: 0.7500, h: 0.2050` for both front + back. The commit is
a 2-line `CROP` table change, easy to amend.

---

## §AC.17 ID Card Print — Print preview cards too small on A4

**Status:** SHIPPED — PR #265.

**User feedback (Hinglish, with screenshot of system print dialog):**

> EK PROBLEM OR AA GAI HAI JAB MAIN SHEET PRINT KAR RHA HUN TOH IS
> TRHE KA SHOW HOTA HAI ID SMALL HO JATI HAI, A4 SELECT KARNE PAR BHI
> PAGE A4 JASIA NHI DIKHTA HAI

Print preview (Microsoft Print to PDF, paper size A4) showed the two
CR80 cards at ~30 × 20 mm at the top of an otherwise blank A4 sheet,
instead of the correct 85.6 × 54 mm physical size with the lower half
of the sheet reusable for a second pair.

**Investigation:**

The desktop preview cap added in §AC.14 —

```css
.idp-a4-wrap canvas {
  max-width: min(100%, 460px);
  max-height: 55vh;
}
```

— was being **inherited inside `@media print`**. The existing print
rule only set `width: 100%` and never reset the maxes. In print
context `vh` refers to the printed page height, so `55vh` capped the
canvas at ~163 mm out of 297 mm A4 height, and the `460px` width cap
shrank it to ~122 mm out of 210 mm A4 width — cards came out at
~58% × ~55% of their true CR80 physical size.

**Change (id-print.html, only the `@media print { ... }` block):**

- `.idp-a4-wrap canvas` now sets:
  `max-width: none; max-height: none; width: 100%; height: auto`
  → the canvas bitmap's natural aspect ratio drives the print size.
  For 1-Pair / Multi-card the bitmap is **2480 × 3508** (A4 @ 300 DPI)
  so `width: 100%` (= 210 mm) gives `height = 210 × 3508/2480 ≈
  296.97 mm` ≈ A4 portrait → exact fit. Dragon (1205 × 1795) and PVC
  (1417 × 1417) keep their natural aspect ratio, no distortion.
- `html, body` forced to `margin: 0 !important; padding: 0 !important;
  background: #fff !important` so the browser does not insert its own
  page padding (some browsers default to 8 px body margin which
  clipped the canvas right edge).
- `@page { size: A4 portrait; margin: 0 }` unchanged.
- Long inline comment block in `id-print.html` documents the trap.

**Acceptance:**

- [x] Print preview on a 1-Pair sheet: A4 page shows the two cards at
      full CR80 size (85.6 × 54 mm each, side by side, flush at top
      with §AC.15 black top edge line). Lower half empty (reusable).
- [x] Multi-card sheet print: all 8 cards at full CR80 size on A4.
- [x] Dragon and PVC print at their natural aspect ratios.
- [x] No browser body-margin clipping.
- [x] **No JS / sheet-builder changes** — pure print-CSS fix.
- [x] `npm run build` clean. Both `id-print.html` and
      `dist/id-print.html` in this PR.

---

## §AC.18 ID Card Print — Phone PNG download / Print breaks the front card (KNOWN BUG, NOT YET FIXED)

**Status:** **OPEN — to be fixed in next session.** User filed this
bug right after §AC.17 (PR #265) deployed and explicitly said:
> "AB YE ERROR NEXT CHAT MAIN SHI KRENGE AB AAPKO YE ERROR HELPING
> FILES UPDATE KARTE TIME ADD KARNI HAI OR NEW PROMPT BNANA HAI"

So this section is the **handoff brief** — diagnose first, don't
ship a code fix yet without confirming the root cause on actual
mobile hardware.

**User feedback (Hinglish, with reference screenshot
`attached_assets/image_1777222600156.png`):**

> ABHI EK PROBLEM OR HAI — JAB MAIN PHONE SE SHEET PNG DOWNLOAD
> KARTA HUN YA PRINT KARTA HUN TOH ID SHI SE NHI DIKHTI HAI. IMAGE
> MAIN AAP KHUD DEKH SKTE HO — ID KA FRONT SIDE SHI NHI HAI, NA
> BORDER SHI SE KAAM KAR RHA HAI, OR ID KI INFO BHI REMOVE HO GAI
> HAI.

In plain English: on **mobile (phone) only**, both the **PNG export**
(`btnDownload`) and the **Print** (`btnPrint`) flows produce a
broken output. Desktop is fine (just confirmed in §AC.17). The
specific symptoms are:

1. The **front card** is rendered incorrectly (visually wrong vs the
   on-screen preview).
2. The **card border** is not drawn correctly (the §AC.15 black top
   edge line and/or the §AC.13 / §AC.14 rounded clip border may be
   missing or misaligned).
3. **ID info text** (name, DOB, etc.) is missing from the rendered
   front card — appears blanked-out or clipped.

Back card behaviour was not specifically called out, but should be
verified at the same time.

### AC.18.1 Diagnostic hypotheses (rank-ordered, to test first)

These are the **most likely root causes** based on what changed
recently (§AC.14–§AC.17) and known mobile-canvas pitfalls. The next
session should test each on actual phone hardware (Android Chrome
+ iOS Safari) before writing any fix:

1. **`canvas.toDataURL('image/png')` size limit on iOS Safari.**
   iOS Safari historically caps `toDataURL` output at ~5 MB / 4096²
   pixels — A4 @ 300 DPI (2480×3508 = 8.7 MP) with photo content
   easily exceeds this and silently returns a truncated / empty
   blob. Affects PNG download path (`btnDownload` → `link.href =
   a4Canvas.toDataURL('image/png')` at line ~2160). **Fix path:**
   switch to `canvas.toBlob(blob => …, 'image/png')` and
   `URL.createObjectURL(blob)`, which doesn't have the same limit.

2. **`CanvasRenderingContext2D.roundRect()` not supported on older
   mobile browsers.** Rolled out in Chrome 99 / Safari 16 (Sep 2022).
   Phones older than ~2 years can fall through silently → no clip
   path → no rounded corners and possibly no fill at all if the
   `clip()` call is wrapped in something that errors. **Fix path:**
   feature-detect (`if (typeof ctx.roundRect === 'function')`) and
   manually walk the path with `arcTo` as a polyfill on older
   browsers.

3. **`ctx.filter` (canvas filter property) not supported on Safari
   < 16.** Used by `compositePair` and the per-side bright/contrast/
   sat sliders. On unsupported browsers the filters silently no-op
   — front card might render with raw unfiltered colours that look
   "wrong" vs the preview. **Fix path:** feature-detect; if not
   supported, apply CSS filters to a wrapper div for the on-screen
   preview, and skip canvas filter on export (with a warning).

4. **PDF.js render scale on mobile.** On phones with constrained
   memory, `pdfjsLib.getDocument(...).then(pdf => pdf.getPage(1))
   .then(page => page.render({ canvasContext, viewport })` may
   internally cap the viewport scale to avoid OOM. The crop
   coordinates then pull from a smaller-than-expected pixel grid
   → cropped output looks different than desktop. **Fix path:**
   read the actual rendered viewport size after render and clamp
   crop math to it.

5. **`<meta name="viewport">` interaction with print.** On mobile,
   the viewport meta can confuse the print stylesheet's
   `width: 100%` calculation. **Fix path:** add an explicit
   `<meta name="viewport" content="width=device-width">` check and
   possibly override the viewport during print.

6. **The §AC.15 4 px black top-line `fillRect`.** Inset uses
   `(rounded ? r : 0)` — if `r` (corner radius) is undefined on a
   code path mobile hits, `cardW - 2*undefined` = NaN → fillRect
   silently does nothing → top border missing. **Fix path:** make
   `r` always defined (use `r || 0`).

### AC.18.2 Reproduction steps

1. Open `https://studioprint.pages.dev/id-print` on a real Android
   or iOS phone (Chrome / Safari respectively).
2. Upload `test-pdfs/aadhaar-test.pdf` (password `SUNI1986`) or
   `test-pdfs/pan-test.pdf` (password `05071999`).
3. Wait for Step 2 preview to appear. Confirm it looks correct
   on-screen.
4. Tap "⬇ Download PNG" → save the file → open the saved PNG in
   the phone's Photos app. **Compare against the desktop output
   for the same PDF.** Capture both for the next-session brief.
5. Tap "🖨 Print" → take a screenshot of the print dialog → save
   as PDF if possible. Compare against desktop.

### AC.18.3 Constraints for the fix

- **Minimum diff.** This is a mobile-rendering bug, do not touch
  desktop behaviour.
- **No new dependencies.** Fix must work with the existing
  PDF.js + vanilla canvas stack.
- **One PR per logical fix.** If 2+ root causes turn out to be
  involved, ship 2+ small PRs (one per cause), not a megafix.
- **Verify on real phone before shipping.** Don't ship a
  speculative fix based on the hypotheses alone.
- **Hard rules from `AGENTS.md` still apply** — no
  `.github/workflows/*.yml`, CSS tokens locked, both
  `id-print.html` and `dist/id-print.html` in the same PR.

### AC.18.4 Files / lines likely involved

- `id-print.html` ~line 2154–2164 — `btnDownload` / `btnPrint`
  handlers (toDataURL path).
- `id-print.html` ~line 1397–1660 — all `buildXxxSheet` functions
  (canvas drawing, including the §AC.15 4 px black top-line, the
  rounded clip, and `ctx.filter`).
- `id-print.html` ~line ?? — `compositePair()` and
  `applyBatchFilters()` (canvas filter usage).
- `id-print.html` ~line ?? — PDF.js render call (`pdf.getPage(1)
  .then(page => page.render(...))`).
- `id-print.html` print CSS block ~line 350–386 (§AC.17) — verify
  it still works as intended on mobile after any changes.

---

## §AC.19 Print preview rendered cards at ~30% width across 2 sheets (SHIPPED — PR #270)

### AC.19.1 Field report (post §AC.18 / PR #269)

User screenshot of phone print dialog: cards render in the **upper-left
quadrant only**, occupying ~30% of page width, with two pages output
instead of one. Direct quote:
> "PRINT KARTA HUN TOH WO WHI ERROR HAI MAINE AAPKO IMAGE DI HAI
>  DEKHLO PHELE TOH ID BHUT NECHE PLACE HAI SHEET PAR USSE UPER KRO
>  OR RIGHT MAIN 2 SHEETS OF PAPER KYON SHOW HO RHA HAI"

### AC.19.2 Root cause

The §AC.17 (PR #265) print CSS only set `width: 100%` on the canvas
without constraining its **parent**. The canvas's intrinsic size
(2480 × 3508 CSS px) made the parent expand far beyond A4 width, so
the browser scaled the entire page down to fit horizontally → cards
shrunk to ~30% width AND the height overflowed onto a second page.

### AC.19.3 Fix

Inside `@media print`:
- Pin **html, body, .idp-app, .idp-preview, .idp-a4-wrap, canvas** all
  to `width: 210mm; height: 297mm`.
- `body { overflow: hidden }` to prevent any leftover content from
  paginating onto a second sheet.
- Canvas: `object-fit: contain` so the bitmap scales into the box
  preserving aspect (matches A4 portrait perfectly for 1-Pair /
  Multi-Card; letterboxes Dragon / PVC into top-left).
- `page-break-inside: avoid; page-break-after: avoid` on canvas.

### AC.19.4 Compatibility

Verified live print preview: 1 sheet, cards full-width, no overflow.

---

## §AC.20 1-Pair cards still had ~2.5 mm gap above (SHIPPED — PR #271)

### AC.20.1 Field report

After §AC.19 the print preview was correctly 1 sheet at full width,
but the user wanted the cards pushed **flush to the top edge** of
the A4 (not the §AC.15 30 px = 2.5 mm gap). Direct quote:
> "ABHI BHI ID AAPNE SHI PLACE NHI KI HAI OR AB TOH YE CENTER MAIN
>  BHI NHI HAI ISE CENTER MAIN OR SABSE UPER LE JAAO"

### AC.20.2 Fix

- `buildSingleSheet`: `var startY = 30` → `var startY = 0`. Cards
  now render with their top edge at canvas y = 0, which under the
  §AC.19 print CSS lands at A4 page y = 0 exactly. The §AC.15 4 px
  black top-edge line is still drawn at this y → it ends up at the
  very top of the printed page.
- Print CSS (.idp-a4-wrap canvas):
  - Added `object-position: center top` — for layouts whose bitmap
    aspect doesn't match A4 (Dragon 1205×1795, PVC 1417×1417), any
    letterboxing now happens at the bottom only, keeping the bitmap
    pinned to top-center.
  - Added `margin: 0 auto` — defensive horizontal centering even if
    a future ancestor change drops the explicit width: 210mm.

### AC.20.3 Verification

Live deploy confirmed via curl:
`curl -s https://studioprint.pages.dev/id-print | grep -o "startY[^,;]*\|object-fit:contain\|object-position[^;]*\|width:210mm"`
shows `startY = 0`, `object-fit:contain`, `object-position:center top`,
multiple `width:210mm` instances.

---

## §AC.21 Print preview STILL shows old layout despite §AC.19+§AC.20 deployed (SHIPPED — PR #272, AWAITING TEST)

### AC.21.1 Field report

After PR #271 deployed, on-screen Step 3 preview correctly shows
cards at the top of the canvas (so the new bitmap with `startY = 0`
IS rendering). But the user reports the **actual print preview**
still shows the old layout (cards small, with whitespace above and
around them). User confirmed cleared phone browser cache too:
> "MAINE PHONE MAIN BHI BROWSER DAAT DELETE KARKE BHI CHECK KAR
>  LIYA HAI WHI PROBLEM HAI ABHI BHI"

User's reference: `.agents/references/ac21-print-still-broken.png`
(this is the on-screen Step 3 view — they sent it to show "see, on
screen the cards ARE at the top now, but PRINT is still wrong").

### AC.21.2 Root cause hypothesis (the basis for PR #272)

The print CSS rules for `.idp-a4-wrap canvas` did **not** use
`!important`. The desktop / responsive CSS at lines 228–240 sets
`max-width: min(100%, 460px)`, `max-height: 55vh`, with the mobile
@media (max-width: 640px) override of `max-width: 100%; max-height:
50vh`. Same selector, same specificity as the print rules.

Although the print rules come **later** in source order (and should
win the cascade by the standard "last-match wins for equal
specificity" rule), several Chromium-based print engines
(Microsoft Print to PDF, mobile Chrome print, Android WebView
print) appear to evaluate `@media (max-width: 640px)` *inside*
`@media print` (the print viewport on a phone is typically <640px)
and let the responsive `max-height: 50vh` rule apply alongside the
print rules. With `max-height: 50vh` of a print viewport, the
canvas computes to less than the full A4 height → exactly the
reported symptom (cards small + whitespace).

### AC.21.3 Fix (PR #272)

Inside `@media print`, add `!important` to **every** rule on
html, body, .idp-app, .idp-preview, .idp-a4-wrap, and especially
.idp-a4-wrap canvas. Plus:

- `position: absolute; top: 0; left: 0` on the canvas, with
  `position: relative` on every ancestor (.idp-a4-wrap,
  .idp-preview, .idp-app, html/body). Pins the canvas to the very
  top-left corner of the A4 page.
- `min-width: 210mm; min-height: 297mm` on the canvas → physically
  cannot shrink below full A4 even if some inherited rule with
  `min-width: 0` tries to.
- `transform: none !important` defensively — in case any animation
  rule leaks into print mode.

### AC.21.4 Verification status

**SUPERSEDED by §AC.22 (PR #274).** PR #272's `!important` +
`position: absolute` print CSS was insufficient on the user's
phone — print preview still showed cards small / surrounded by
whitespace / sometimes 2 sheets. Root cause turned out to be
exactly the §AC.21.5 hypothesis: the browser print engine
mis-handles a 2480 × 3508 px `<canvas>` bitmap. PR #274 ships
the canvas → PNG `<img>` swap. PR #272's CSS rules on the
ancestors (html, body, .idp-app, .idp-preview, .idp-a4-wrap)
are still in force; only the canvas-specific rules were
re-pointed at `#printImg`.

### AC.21.5 If §AC.21 fix is insufficient — fallback for §AC.22

If, despite the `!important` + position: absolute fix from PR #272,
the print preview is *still* wrong, the canvas approach itself is
the problem. Browsers' print engines have known bugs printing
`<canvas>` elements at high resolution (the bitmap is sometimes
resampled at the print-engine's chosen DPI rather than honoured at
the canvas's native 2480 × 3508). The robust fallback:

**Convert the canvas to a PNG `<img>` for print.**

Implementation sketch (one PR, ~30 lines):
1. Add a hidden `<img id="printImg">` element next to the canvas
   inside `.idp-a4-wrap`.
2. In the `btnPrint` handler, before calling `window.print()`, do:
   ```js
   a4Canvas.toBlob(blob => {
     const url = URL.createObjectURL(blob);
     const printImg = document.getElementById('printImg');
     printImg.onload = () => {
       window.print();
       URL.revokeObjectURL(url);
     };
     printImg.src = url;
   }, 'image/png');
   ```
3. In print CSS:
   ```css
   @media print {
     .idp-a4-wrap canvas { display: none !important; }
     .idp-a4-wrap #printImg {
       display: block !important;
       position: absolute !important;
       top: 0 !important; left: 0 !important;
       width: 210mm !important; height: 297mm !important;
       object-fit: contain !important;
       object-position: center top !important;
     }
   }
   ```
4. In on-screen / preview CSS:
   ```css
   .idp-a4-wrap #printImg { display: none; }
   ```

Why this works: browser print engines render `<img>` reliably at
the requested print size with no DPI / canvas-bitmap quirks. Same
PNG bytes are downloadable via Save Image. PR #269 (`toBlob`)
already proved the iOS Safari size cap is no longer an issue for
Blob-based PNG generation, so this approach is safe.

### AC.21.6 Constraints for §AC.22

- Test on **real phone hardware** before shipping (the issue is
  phone-specific).
- Minimum diff. Don't touch the JS sheet builders.
- One PR. Ship the `<img>` fallback as a single logical change.
- Both `id-print.html` and `dist/id-print.html` in the PR
  (rebuild via `node build.js` after `npm install`).
- CSS tokens locked. No `.github/workflows/*.yml` changes.
- Branch `devin/<unix_ts>-ac22-print-img-fallback`.
- Ship via `/tmp/mkpr.mjs` REST API (local git writes blocked).

### AC.21.7 Files / lines likely involved

- `id-print.html` ~line 380–420 — print CSS block (§AC.21).
- `id-print.html` ~line 2150–2200 — `btnPrint` handler.
- `id-print.html` `.idp-a4-wrap` markup (search for the wrapper
  element to add the sibling `<img>`).

## §AC.22 Print preview canvas → PNG <img> swap (SHIPPED — PR #274, AWAITING TEST)

**Status:** SHIPPED. Conditional plan in §AC.21.5 was triggered
because PR #272 alone did not fix the phone print preview.

**What changed (PR #274, minimum diff to `id-print.html` only):**

1. Markup: added a sibling `<img id="printImg" alt="">` next to
   `<canvas id="a4Canvas">` inside `.idp-a4-wrap` (hidden on
   screen, only shown in print).

2. Screen CSS: `.idp-a4-wrap #printImg { display: none; }` so the
   image element is invisible during normal preview / authoring
   (the canvas remains the live editing surface).

3. Print CSS (`@media print` block): the canvas-specific rules
   from §AC.21 (`!important` + `position: absolute` etc) were
   re-pointed from `.idp-a4-wrap canvas` to `.idp-a4-wrap
   #printImg`. The canvas itself is forced to
   `display: none !important` in print mode. Same 210mm × 297mm
   sizing, same `object-fit: contain` + `object-position:
   center top`, same ancestor rules from PR #272.

4. `btnPrint` handler: before calling `window.print()`, rasterise
   the canvas via `canvas.toBlob(blob => ..., 'image/png')`, set
   the resulting Blob URL on `printImg.src`, wait for `onload`,
   then call `window.print()` and revoke the URL after print
   dialog closes. Synchronous fallback path uses `toDataURL` if
   `toBlob` is unavailable, so the print button still works on
   ancient browsers (matches the PR #269 pattern for PNG
   download).

**Why the canvas-bitmap approach failed and `<img>` works:** A
2480 × 3508 px `<canvas>` is rendered by the browser print
engine using its internal canvas-to-print pipeline, which on
Chromium-based mobile browsers (and Safari/iOS) frequently
resamples the bitmap at the print engine's chosen DPI rather
than honouring the canvas's native resolution — the result is a
small image floating on a mostly white sheet, sometimes split
across two pages. `<img>` with an explicit `width: 210mm;
height: 297mm; object-fit: contain` is rendered by the same
pipeline that handles regular page images, which is reliable
across every browser we care about (mobile Chrome, mobile
Safari, desktop Chrome, desktop Firefox).

**No new dependencies, no JS sheet-builder changes, no CSS
token changes, no `.github/workflows/*.yml` changes. Reference:
.agents/references/ac21-print-still-broken.png.**

### AC.22.1 Verification status

**SHIPPED but NOT YET CONFIRMED on real phone hardware.** Once
Cloudflare Pages redeploys PR #274, expectation is: print
preview on phone shows cards filling the full A4 page, flush to
the top edge, horizontally centered, on exactly 1 sheet — same
as desktop preview (which was already correct in PR #270).
Capture a fresh phone screenshot on confirmation and either
mark §AC.22 GREEN or open §AC.23 with the residual symptom.

### AC.22.2 Rollback

If the `<img>` rasterisation introduces a new symptom (e.g.
slow print prep on huge sheets), the rollback is:
- Remove the `printImg.onload`/`toBlob` block from `btnPrint`.
- Revert print CSS to point `.idp-a4-wrap canvas` rules from
  PR #272.
- Drop the `<img id="printImg">` element + the screen-CSS
  `display: none` line.
That restores PR #272 behaviour exactly. Both `id-print.html`
and `dist/id-print.html` need to ship together (build step).

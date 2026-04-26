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
- ~~Multiple cards per A4 sheet (5 card pairs)~~ — **shipped PR #193**
- ~~Cut marks / dashed guides on A4 output~~ — **shipped PR #193**
- ~~Rounded border option~~ — **shipped PR #194 + bugfix PR #195**
- Voter ID support
- Dragon sheet (4×6) layout option (2 cards per sheet)

**Phase 3 (future):**
- Ayushman / Jan Aadhaar / eShram support
- Batch processing (multiple PDFs at once)
- PVC card tray layout (Epson L805/L8050 direct print)
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
// Voter: "election commission", "epic", "voter", "electoral"
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

### What's still open (Phase 2 remainder + Phase 3)

**Phase 2 (not yet implemented):**
- Voter ID support
- Dragon sheet (4×6) layout option (2 cards per sheet)

**Phase 2 (shipped):**
- ~~Photo editing (brightness/contrast/saturation)~~ — PR #191
- ~~Multiple cards per A4 sheet (5 pairs per sheet, cut marks, layout toggle)~~ — PR #193
- ~~Rounded border option (toggle in preview, applies to cards + A4 sheet)~~ — PR #194 + bugfix PR #195

**Phase 3 (future):**
- Ayushman / Jan Aadhaar / eShram support
- Batch processing (multiple PDFs at once)
- PVC card tray layout (Epson L805/L8050 direct print)
- Toggle options (issue date, download date, QR code, mobile number)
- Auto photo enhancement (AI brightness/contrast adjustment)
- Signature box option (PAN)
- Back-side hologram overlay (PAN)

---

## O. ID Card Print — Phase 2 multi-card + rounded corners (2026-04-26)

**Status: SHIPPED — PRs #193, #194, #195.**

| # | PR | What shipped | Status |
|---|------|---------|--------|
| O1 | PR #193 | **Multi-card A4 layout.** 5 card pairs per sheet, cut marks/dashed guides, layout toggle (single fold-and-laminate vs 5-pair multi-card). Column headers, corner marks, footer label. Default: multi-card. | **merged** |
| O2 | PR #194 | **Rounded corners toggle.** Checkbox in preview step — "Rounded Corners" on/off. Clips front+back cards and A4 sheet cards with `border-radius` (preview CSS) + canvas `arcTo` clip path (A4 output). Default off. `CARD_RADIUS = 36` (≈ 3.6% of CR80 width). Styled checkbox matches design tokens. Hidden in `@media print`. | **merged** |
| O3 | PR #195 | **Bugfix: multi-card infinite loop.** PR #194 introduced a variable name collision — `var r` for rounded radius shadowed the `for (var r …)` loop counter in `buildMultiCardSheet()`, causing an infinite loop (rounded off) or only 1 row drawn (rounded on). Fixed by hoisting radius to `var rad` before the loop. | **merged** |

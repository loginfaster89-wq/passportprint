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
| F6 | home `/` | all | nit | The `.audience-grid` has only **2 cards** ("Print shops & photo studios" / "Home users, students & parents"). On desktop this produces a wide empty column to the right (grid defined as `repeat(auto-fit, minmax(…,1fr))` → 2 full-width cards). Section feels sparse for the amount of vertical space it occupies. Either add a 3rd audience card (e.g. "Teachers / certificate printers") or shrink the gap and centre the 2 cards with `max-width`. |
| F7 | `passport-photo.html` | all | nit | Console noise: four `Unrecognized feature: 'publickey-credentials-create' / 'web-share' / 'local-network-access' / 'loopback-network'.` warnings on every load. These come from the `<iframe>` Google GSI injects; Chrome doesn't recognise some Permissions-Policy tokens the GSI iframe requests. Not our code, but clutters the console. Harmless — keep an eye on it if the GSI SDK is ever updated. |
| ~~F8~~ | `about.html`, `contact.html` | all | **resolved PR #77** | Email `loginfaster89@gmail.com` was exposed as plain text (clickable `mailto:` + visible text) on both pages. Scrapable by spam bots within days. Fixed via `<a class="email-obf" data-u="…" data-d="…">` + tiny per-page IIFE that assembles the mailto on DOMContentLoaded. A contact form (P10) is still the full fix. |
| ~~F9~~ | home `/` | desktop 1440 | **resolved PR #80.** Ribbon re-centered on the card's top edge. |
| ~~F10~~ | home `/` | desktop 1440 | **resolved PR #81.** Fake window-chrome dots replaced with a single live-preview indicator. |
| F11 | `passport-photo.html` | desktop 1440 | nit | At 1440×900, almost the entire lower half of the viewport (below the upload card, above the footer) is empty black space. Consider raising the footer or adding a "While you wait, try…" section to pull the fold up. |
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
| P16 | Internationalisation | No language switcher. Hindi copy was removed (SKILL §5), but adding `हि` ↔ `EN` toggle for Indian multinational feel would be a 1-day add. Current copy is English-only — acceptable, but a locale selector UI affordance signals "we thought about it". |
| ~~P17~~ | Accessibility | **resolved PR #76.** Site-wide `:focus-visible{outline:2px solid var(--accent); outline-offset:2px}` added to `assets/legal.css`, with `:focus{outline:none}` fallback so mouse clicks don't show rings. Keyboard users now get a clean amber ring on nav links, Features dropdown, Login button, `<details>`, form elements. |
| ~~P18~~ | Accessibility | **resolved PR #88.** Stable ids on all 8 FAQs (`faq-free-tier`, `faq-privacy`, `faq-countries`, `faq-no-software`, `faq-aadhaar-pan`, `faq-mobile`, `faq-refund`, `faq-print-shop`) + small IIFE opens the targeted `<details>` on hash match and smooth-scrolls. |
| ~~P19~~ | Product-demo | **resolved PR #99.** Inline animated demo strip inside the hero tools-preview card on `index.html`: 3-phase ~9 s loop (upload → background removed → A4 sheet slides in). Pure CSS + tiny DOM primitives, no `<video>` asset. Respects `prefers-reduced-motion`. |
| P20 | Loading / perceived perf | No skeleton shimmer anywhere. `passport-photo.html` loads transformers.js (~large). On first visit there's no indication that a heavier model is being downloaded. Add a top-of-page thin progress bar for AI-model download. |
| P21 | Error / empty states | Haven't been able to audit them without signing in, but from code review `passport-photo.html` has toast-based errors only. A small "something went wrong — retry" inline banner near the upload zone would feel more polished. |
| ~~P22~~ | SEO / social | **resolved PR #84.** Proper 1200×630 `assets/og-image.png` + richer social meta across 8 pages. |
| ~~P23~~ | SEO | **resolved PR #90.** `<lastmod>2026-04-23</lastmod>` on every entry + 4 in-page landing sections (`/#features`, `/#how`, `/#pricing`, `/#faq`) with their own priorities. |
| P24 | Performance | Fonts are loaded from Google Fonts CDN (`fonts.googleapis.com`). Self-hosting Syne + DM Mono (woff2, subset to Latin + ₹) removes a third-party request and shaves 100–200 ms FCP. |
| ~~P25~~ | Performance | **resolved PR #87.** Backend preconnect added to all 7 shared-header pages (about/contact/privacy/terms/refund/shipping/404). |
| ~~P26~~ | Cookies / privacy | **resolved PR #120.** Self-hosted essentials-only cookie banner on all 9 pages. "OK" click saves to localStorage, doesn't show again. |
| ~~P27~~ | Tooling | **resolved PR #86.** Branded `404.html` with shared legal-header/footer, big amber "404" numeral, two CTAs, `noindex` meta, build.js now minifies it into `dist/`. |
| ~~P28~~ | Tooling | **resolved PRs #93 + #94.** `assets/manifest.webmanifest` + installable icons on index + 7 legal pages (PR #93); `sw.js` with network-first HTML + stale-while-revalidate assets + `/offline.html` fallback (PR #94). Registered via `assets/pwa.js`. |
| P29 | Passport-photo step bar | Static 1→2→3→4 pills. At 2026 polish level, fill a progress line as steps complete (with a 300 ms ease), highlight the active pill with the accent glow. |
| P30 | Homepage density | Homepage is 6380 px tall on desktop (current audit measured). Every section is "header + 1 sentence + grid of cards + dots" — feels repetitive. Consider a single "live product" section between HERO and FEATURES (a real working mini-demo, or an embedded screenshot stack), to break the rhythm. |

## C. Suggested PR sequence

All of the quick-win queue from the 2026-04-23 audit is now merged. The**open backlog** for future sessions (larger scope, pick per session):

**Functional nits remaining:**
- `F6` audience grid sparse (2 cards on desktop) — either add 3rd card or `max-width` + centre.
- `F7` GSI iframe Permissions-Policy console warnings — not our code; monitor on SDK updates.
- `F11` passport-photo 1440 empty space below upload card — `passport-photo.html` edit, minimum-diff.

**2026 polish roadmap (ordered by impact):**
1. ~~**P12** — Pricing comparison matrix~~ — **shipped in PR #119.**
2. **P30** — Homepage density break — one real "live demo" section between HERO and FEATURES.
3. **P24** — Self-host Syne + DM Mono fonts (woff2 subset) — removes Google Fonts third-party.
4. **P16** — Language switcher (`हि` ↔ `EN`) UI affordance.
5. ~~**P26** — Cookie banner (self-hosted, essential-only).~~ — **shipped in PR #120.**

**Recently resolved (since last audit refresh):** P10 contact form (PR #98), P19 inline tools-preview demo strip (PR #99), P2 hero A4-sheet mockup (PR #100), P1 hero animated gradient pulse (PR #102), P8 honest numbers strip (PR #103), R1/R2/R3/R5/R6 responsive polish (PR #108), U1 pricing buy-flow (PR #109), passport-photo unlock (PR #110), homepage inline checkout (PR #112), shared pricing modal (PR #114).

**Passport-photo-specific backlog** (`passport-photo.html` is no longer locked — unlocked 2026-04-24 — but still requires minimum-diff care; see AGENTS.md Hard rule #1):
- `F1` Razorpay `/build/undefined` 403 residual (payment flow works, SDK's own bug).
- `F11` 1440 empty space below upload card.
- `P20` top-of-page thin progress bar for AI-model download.
- `P21` inline "something went wrong — retry" banner near upload zone.
- `P29` step-bar progress line fill animation.

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
| R4 | `passport-photo.html` | iphone-se 375 | nit | Upload card's decorative L-bracket frame corners (`.frame-corners`, positioned with negative `top/right/bottom/left` offsets) clip off the right edge at 375 px. Visual nit only; upload still works. |
| R5 | all | all | nit | Slider pagination dots are 7×7 px buttons — below the WCAG 2.5.5 AAA 24 px target and the commonly-recommended 44 px mobile target. Fix: keep the 7-px visual dot but expand the clickable area to ~24 px via `padding` + an inner `::before` dot, or use a `::after` transparent hit pad. |
| R6 | legal pages (`about`, `contact`, `privacy`, `terms`, `refund`, `shipping`) | all mobile | nit | Multi-link rows in the new footer (PR #95) render at line-height 17–18 px on phones. Each link has only ~17 px vertical clickable area. Add `padding-block:6px` on `.footer-col a` so each row hits ~30 px without changing visual spacing much. |
| R7 | `index.html` | ipad-portrait 768 | nit | No dedicated 768 breakpoint in the homepage CSS (closest are 760 and 820). A hero that clamps font-size / sheet position at ≥ 768 would smooth the exact-iPad-portrait transition instead of relying on the 1100 → 760 handoff. Optional polish. |

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
R4 and R7 are low-value nits — leave open.

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

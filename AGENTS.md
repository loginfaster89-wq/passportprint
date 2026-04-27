# AGENTS.md — Studio Print frontend

This file is read automatically by coding agents (Devin, Cursor, etc.) when
they open this repo. Keep it short; deep implementation notes go in
`CLOUDFLARE_DEPLOY.md` or in source comments where they belong.

Devin-specific condensed recipe (build commands, PR curl snippet, quick
hard-rules checklist) lives at `.agents/skills/studioprint/SKILL.md` —
read both files at the start of every session.

## What this repo is

Plain static HTML/CSS/JS frontend for [Studio Print](https://studioprint.pages.dev/) —
a browser-based passport photo, Aadhaar/PAN sheet and certificate print tool for
Indian print shops and home users. All customer photos are processed on-device
(AI background removal via `briaai/RMBG-1.4` through transformers.js); no photo
uploads to a server.

Backend is a separate repo: `loginfaster89-wq/PassportPrint-Studio` (Node.js +
Express on Render). Handles auth (email OTP + Google Sign-In), Razorpay
payments, and the `POST /api/google-login`, `POST /api/delete-account`, `GET
/api/me` endpoints. Backend URL is hardcoded in `passport-photo.html` and
`assets/auth.js` as `https://passportprint-studio.onrender.com`.

## Build & preview

```bash
npm install
npm run build               # outputs minified/obfuscated files to ./dist
npx http-server dist -p 8080
# or: python3 -m http.server 8080 --directory dist
```

There is no dev server — edit source files, run `npm run build`, then
preview `dist/`. `npm run clean` removes `dist/`.

## Deploy

- Primary: **Cloudflare Pages**, project name `studioprint` (not
  `passportprint`). Every push to `main` runs `.github/workflows/deploy.yml`
  which does `npm ci` → `npm run build` → `wrangler pages deploy dist
  --project-name=studioprint`. Secrets `CLOUDFLARE_API_TOKEN` and
  `CLOUDFLARE_ACCOUNT_ID` are already configured in repo settings.
- Fallback: **Netlify**, reads `netlify.toml`. Both hosts honour the
  `_headers` / `_redirects` convention.
- Cloudflare Pages GitHub statuses do **not** post back to PRs. To verify a
  deploy, `curl https://studioprint.pages.dev` or check the CF API. Cache
  propagation for production `*.pages.dev` URLs can take 10–60s; the
  per-deployment URL (`https://<hash>.studioprint.pages.dev`) is always
  immediately fresh.
- See `CLOUDFLARE_DEPLOY.md` for the manual `wrangler` fallback if the
  workflow ever fails.

## Design tokens — do not change without approval

Design language is fixed. Don't introduce new fonts, colors, or CSS tokens.

- Fonts: `Syne` (headings), `DM Mono` (body/monospace accents).
- Dark theme: `--bg: #0D0D0D`, accent: `--accent: #F0A500`.
- Use the existing CSS variables (`--bg`, `--surface`, `--surface2`,
  `--border`, `--muted`, `--muted2`, `--accent`, `--accent-dim`, `--text`,
  `--success`) — do not add new color/spacing tokens.

Structure, copy, layout and placement changes are fair game. Fonts, palette
and overall aesthetic are not.

## File layout

| Path                       | What lives there                                      |
| -------------------------- | ----------------------------------------------------- |
| `index.html`               | Homepage (hero, features, audience, why, how, pricing, FAQ, CTA) |
| `passport-photo.html`      | The live passport photo tool (5000+ lines, with its own inline copies of the nav / auth / Google Sign-In markup and a small hash-open script) |
| `id-print.html`            | ID Card Print tool — Aadhaar/PAN/Voter ID/Ayushman/Jan Aadhaar/eShram PDF upload, password unlock, auto-detect, auto-crop front+back, CR80 output, A4 fold-and-laminate sheet, photo editing (brightness/contrast/saturation), multi-card A4 layout (5 pairs per sheet, cut marks, layout toggle), Dragon sheet (4×6), PVC card tray layout (Epson L805/L8050, 120×120mm), rounded corners toggle, batch processing (multiple PDFs at once with file queue UI), download PNG + print. All client-side. Shared nav/auth/footer. |
| `about.html`, `contact.html`, `privacy.html`, `terms.html`, `refund.html`, `shipping.html` | Legal / info pages, share the header + footer with `index.html` |
| `assets/auth.js` + `auth.css` | Shared login / signup / OTP / Google Sign-In modal + account modal (plan info, upgrade, delete account). `position: fixed; z-index: 10000` overlay. Include on any page that has `.legal-header` with a `#hdrAuthBtn` button. |
| `assets/pricing.js` + `pricing.css` | Shared 2-step pricing modal (Choose Plan → Complete Payment → Razorpay). Included on every page except `passport-photo.html`. Exposes `window.openPlans` / `window.startCheckout`. Load AFTER `auth.js`. |
| `assets/nav.js`            | Shared hamburger + Features dropdown behaviour. Hamburger breakpoint is **900px**. |
| `assets/fonts.css`         | Self-hosted `@font-face` declarations for Syne + DM Mono (woff2). |
| `assets/fonts/*.woff2`     | Syne + DM Mono woff2 subsets (latin + latin-ext). |
| `assets/legal.css`         | Shared header/footer/typography for all legal pages. |
| `build.js`                 | Runs HTML minifier + JS obfuscator → `dist/`        |
| `.github/workflows/deploy.yml` | CI deploy to Cloudflare Pages on `main` push    |

### Header markup (shared pages)

Post-PR #54, the header puts `#hdrAuthBtn` **outside** `<nav>` so the Login
button is visible beside the ☰ hamburger on mobile and tapping it opens the
modal directly without expanding the nav:

```html
<header class="legal-header">
  <a href="index.html" class="logo">Studio <em>Print</em></a>
  <nav id="primaryNav">…links…</nav>
  <button type="button" class="nav-login" id="hdrAuthBtn">…Login…</button>
  <button class="nav-toggle" aria-controls="primaryNav">☰</button>
</header>
```

`passport-photo.html` keeps its own pre-PR-#54 inline copy of the header
(still `#hdrAuthBtn` inside `<nav>`). Any shared-module change elsewhere
must stay compatible with that inline copy — or update both sides in the
same PR.

Post-PR #66: inside the `@media (max-width:900px)` block in
`assets/legal.css`, `.nav-toggle` is explicitly `margin-left:0` so that
only `.nav-login` owns the auto-margin and the Login + ☰ pair pin right
together. Before the fix both had `margin-left:auto`, flex split the
free space between them, and the Login button parked mid-header on
iPad portrait / narrow tablets.

## Hard rules

1. **`passport-photo.html` edits are allowed, but tread carefully.** It is a
   5000+ line working feature with inline copies of the nav / auth / Google
   Sign-In markup and a small hash-open script (`#plans` → `openPlans()`,
   `#buy-<planId>` → `startCheckout(planId)`). Minimum diffs; re-run
   `npm run build` before committing; don't fork shared-module behaviour
   into this file. (Was previously a locked file requiring explicit user
   approval — lifted 2026-04-24 at the project owner's request.)
2. **Do not edit `.github/workflows/*.yml`** from a Devin session unless the
   user confirms the fine-grained PAT (`GITHUB_PAT_PASSPORTPRINT`) has the
   `Actions: Read and write` scope. Without that scope GitHub rejects
   workflow-file commits with `refusing to allow a Personal Access Token to
   create or update workflow ... without 'workflow' scope`.
3. **Pricing numbers** (free: 2 sheets/day; weekly: ₹59/7 days; monthly:
   ₹149/30 days) appear in `index.html`, `terms.html`, `refund.html` and
   `shipping.html`. If they change, update all four.
4. **Do not commit secrets.** `CLOUDFLARE_API_TOKEN`, `GITHUB_PAT_*`,
   Razorpay keys, Google OAuth secrets etc. live only in GitHub/Render
   settings. The frontend only ever references the public Google Client ID
   and the backend URL.
5. **Shared auth/nav changes** live in `assets/auth.js`, `assets/auth.css`,
   `assets/nav.js`, `assets/legal.css`. Do not fork the shared module into a
   per-page copy.
6. **Shared auth toast.** On login / signup-verify / Google Sign-In /
   logout / account-delete, `assets/auth.js` fires `notify(msg)`. On
   `passport-photo.html` it delegates to the inline `window.showToast`
   (so the page's existing `.toast` element is reused); everywhere else
   it injects a `.sp-toast` element styled in `assets/auth.css`. Keep the
   two visually in sync — both use `var(--surface)` bg +
   `var(--accent)` border + `z-index: 10001`.
7. **Design / fonts / animations / effects = case-by-case approval
   (2026-04-24).** The project owner wants the site to feel like a
   top-tier 2026 product — modern micro-interactions, motion, layout
   polish are welcome within the existing tokens. BUT any new font,
   new palette, new token, new animation / transition / hover effect,
   new decorative element, or major layout restructuring requires
   **explicit approval from the owner in the same thread, before the
   PR is opened**. Do not ship design-level changes speculatively. Minor
   CSS fixes (spacing tweaks, responsive nits listed in `issues.md`) do
   not need per-change approval. When in doubt, ask first.
8. **One problem at a time.** When fixing issues from `issues.md` or any
   backlog, solve them **one by one** — one issue per PR, one PR per
   commit cycle. Do not batch multiple unrelated fixes into a single PR.
   This keeps diffs small, reviews fast, and rollbacks safe.
9. **Research → docs → code (2026-04-26).** Kisi bhi naye feature par
   coding shuru karne se PEHLE, usi session mein Devin helping files
   (`SKILL.md`, `AGENTS.md`, `issues.md`) ko research findings ke saath
   update karo — ek alag "docs update PR" banao. Quota khatam hone ya
   session break hone par bhi research safe rahe. Rule: Research →
   Docs PR → Coding PR. Kabhi skip mat karo.

## Homepage grids → slider activation (post PR #64 / #65)

`assets/sliders.js` (plain JS, deliberately **not** obfuscated — PR #65
extracted it so the obfuscator can't silently break the IIFE) adds
`.is-slider` to `.why-grid`, `.features-grid`, `.audience-grid` and
`.steps-grid` when either:

- `matchMedia('(max-width: 760px)')` matches (phones), **or**
- `hasOrphanRow(grid)` is true (e.g. 3 cards row 1 + 1 orphan on iPad
  Air 820px).

If you edit that script, smoke-test at 820 / 1280 / 375px — 820 must
render one horizontal row + 4 dots, 1280 must stay a plain 4-up grid
with no dots, 375 must show the phone slider. No `charAt`/`undefined`
console errors at any viewport.

## Passport-photo defaults (post PR #58)

Current defaults — keep these intact unless the task explicitly changes them.

- **Default sheet layout:** 5 photos, 5 cols × 1 row (`sheetCols=5`,
  `sheetRows=1`, `sheetTotal=5`). Was previously 8 photos in 4 × 2.
- **Mobile step bar** (`.steps` with the 1 → 4 progress pills) is hidden
  on phones `≤640px` via the existing media block.
- **Mobile upload card** uses a 360px max-width with reduced padding /
  pill sizes so it sits centered in the canvas area on narrow screens.

## Working with the GitHub App / PAT

The Devin GitHub App is installed on both Studio Print repos, but a session's
GitHub user is often not the repo owner, so `git_pr` / `list_repos` can
return "Not Found". When that happens, fall back to the REST API using the
fine-grained PAT `GITHUB_PAT_PASSPORTPRINT`:

```bash
# Clone
git clone "https://x-access-token:${GITHUB_PAT_PASSPORTPRINT}@github.com/loginfaster89-wq/passportprint.git"

# Create PR
curl -sS -X POST \
  -H "Authorization: Bearer $GITHUB_PAT_PASSPORTPRINT" \
  -H "Accept: application/vnd.github+json" \
  -H "Content-Type: application/json" \
  -d @pr_body.json \
  https://api.github.com/repos/loginfaster89-wq/passportprint/pulls
```

PAT must have `Contents: Read and write` and `Pull requests: Read and write`
on this repo. Add `Actions: Read and write` only if editing workflow files.

## Known-issue backlog (2026-04-23 audit)

`issues.md` at the repo root is the source of truth. All quick-win queue
items from the original audit are now merged. Summary headlines for the
next session:

**Resolved (PRs #70-#114):** F1 Razorpay script, F2 One-Tap, F3 features
grid 820, F4 hero wrap, F5 pricing 820, F8 email obfuscation, F9 ribbon
centering, F10 preview chrome, F12/P4 SVG icons, P3+P7+P17 card/button/
focus polish, P5 scroll-reveal, P6 FAQ smooth open, P13 ribbon pulse,
P14 mobile sticky CTA, P18 FAQ deep-link IDs, P22 OG image, P23 sitemap
lastmod+anchors, P25 backend preconnect on legal pages, P27 branded 404,
P28 PWA manifest + offline SW (PRs #93/#94), P15 multi-column footer
(PR #95), P9 About page rework (PR #96), P10 contact form (PR #98),
P19 inline tools-preview demo strip (PR #99), P2 hero A4-sheet mockup
(PR #100), P1 hero animated accent-glow pulse (PR #102), P8 honest
`By the numbers` strip (PR #103), R1/R2/R3/R5/R6 responsive polish
(PR #108), U1 pricing buy-flow (PR #109), passport-photo unlock
(PR #110), homepage inline checkout (PR #112), shared pricing modal
(PR #114).

**Also resolved (PRs #118–#182):** PRs #118–#132 stats-grid slider,
self-host fonts, step-bar progress, audience grid, AI download bar,
empty space, error banner, frame-corners, 768px breakpoint, font
preload. PRs #134+#137 FAQPage + WebApplication JSON-LD. PR #139
footer/UX cleanup. PR #141 glorification cleanup. PR #142
BreadcrumbList + Organization JSON-LD. PR #143 pricing cards removed,
trust pills 2-row. PR #145 hero eyebrow pill. PR #147 terse-mode +
pricing polish. PRs #148–#150 pricing redesign (plan cards). PR #152
hero-preview hidden on phones. PR #153 'Soon' features removed from
nav + features grid. PR #154 fake feature tiles removed from
hero-preview section. PR #155 docs update. PR #156 Document Sheet
feature card + multi-tool copy. PR #157 Document Sheet tool page
(Phase 1: PDF upload + password unlock via pdf.js). PR #159 dropdown
feature icons fix. PR #160 Aadhaar/PAN card detection. PR #163
Document Sheet Phase 2 (editor step, A4 sheet generation, download +
print). PR #165 Full Document photo fix + Back to Edit button.
PR #166 Photo Only crop fallback + per-mode edit state auto-save +
back buttons. PR #168 docs update. PR #170 PAN Photo Only vertical
scan bounds (merged but did NOT fully fix). PR #171 docs update.
PR #182 PAN/Aadhaar CR80 card size standardization + auto-trim both
cards + test PDFs saved in `test-pdfs/`.

**Also resolved (PRs #183–#191):** PR #183 card system rebuild docs.
PR #184 front-card-only crop fix. PR #185 removed `document-sheet.html`
entirely — clean slate for new ID print feature. PR #186 ID Card Print
research + implementation plan (§M). PR #188 **ID Card Print Phase 1
MVP** — new `id-print.html` with PDF upload + password unlock,
auto-detect Aadhaar/PAN, auto-crop front+back, CR80 output
(1011×638px at 300 DPI), side-by-side preview, A4 fold-and-laminate
layout, download PNG + print. PR #189 fix Aadhaar PDF detection —
expanded keyword list (`enrolment`, `download date`, `issue date`).
PR #190 docs update for #186–#189. PR #191 **ID Card Print Phase 2
photo editing** — brightness/contrast/saturation sliders with live
preview, output carries through to A4 sheet, reset button, mobile-
responsive.

**Also resolved (PRs #192–#199):** PR #192 docs update for #190–#191.
PR #193 **ID Card Print Phase 2 multi-card A4** — 5 card pairs per
sheet, cut marks/dashed guides, layout toggle (single vs multi-card),
corner marks. PR #194 **ID Card Print Phase 2 rounded corners** —
toggle checkbox, canvas clip-path with arcTo, preview + A4 sheet.
PR #197 fix `var r` variable shadowing bug in multi-card sheet
generation + docs update. PR #198 docs — fix PR #195→#197
references (this PR also added a "half-half working" rule that was
later removed in PR #250). PR #199 docs — mark shipped Phase 2
items in issues.md §M.6 + update SKILL.md §11 prompt template.

**Also resolved (PRs #201–#208):** PR #201 docs — fill Voter ID task,
update AGENTS.md. PR #202 **ID Card Print Phase 2 Voter ID** —
multi-page PDF support, auto-detect via keywords, CR80 output.
PR #203 **ID Card Print Phase 2 Dragon sheet** — 4×6 layout, 2 cards
per sheet, cut marks, corner marks, rounded corners support.
PR #205 **ID Card Print Phase 3 Ayushman/Jan Aadhaar/eShram** —
auto-detect keywords, crop regions, CSS badges, multi-page PDF.
PR #206 docs — add §P section for Phase 3. PR #208 **ID Card Print
Phase 3 batch processing** — multiple PDFs at once, file queue UI
with status badges, “Add More” + “Process All” buttons, per-file
password prompts, auto-detect + auto-crop each PDF individually, all
cards combined on single A4 sheet, single-file fallback to legacy path.
PR #209 docs — mark batch shipped, add §Q, update prompt.
PR #210 **ID Card Print Phase 3 PVC card tray layout** — 120×120mm
(1417×1417px) canvas for Epson L805/L8050 CD/DVD tray, front+back
card slots with corner marks and tray guides, rounded corners support.
PR #212 docs — mark PVC tray shipped, add §R, update prompt.
PR #213 **copy update** — nav dropdown subtitle on 7 pages updated
to include Ayushman/eShram, homepage feature card description updated
to reflect all Phase 2/3 features.

**Verified (2026-04-26):** ID Card Print Phase 1 MVP fully tested with
both test PDFs — PAN and Aadhaar flows ALL PASSED (upload, password
unlock, auto-detect, front+back preview, CR80 output, A4 sheet).

**Open backlog:**
- **ID Card Print Phase 2 — COMPLETE.** All items shipped: photo
  editing (PR #191), multi-card A4 (PR #193), cut marks (PR #193),
  rounded corners (PR #194/#197), Voter ID (PR #202), Dragon sheet
  (PR #203).
- **ID Card Print Phase 3 — COMPLETE.** Ayushman/Jan Aadhaar/eShram
  shipped (PR #205), batch processing shipped (PR #208), PVC card
  tray shipped (PR #210), copy update shipped (PR #213), toggle research
  docs shipped (PR #215, #216), Aadhaar field toggles shipped (PR #217 —
  4 checkboxes: Hide QR Code / Mobile No. / Issue Date / Download Date,
  white-mask regions on back card, all output layouts), Auto Enhance
  shipped (PR #232, rebased from closed #218 — luminance histogram
  analysis, 1-click button),
  PAN signature box research docs shipped (PR #220 — §U), PAN
  signature box code shipped (PR #221), Phase 4 scope research shipped
  (PR #222 — §V).
- **ID Card Print Phase 4 P1 — SHIPPED.**
  - PR #223 fix-pan-signature-coords (1-line patch — corrects PR #221
    coords from {540,470,380,110} → {280,540,280,75} per §V.2.a; box
    now sits in bottom-left signature row, no longer overlaps QR).
  - PR #224 pan-hologram-overlay (~40 net lines — new `hologram` entry
    in PAN_OVERLAY_REGIONS at back x:800 y:30 w:180 h:220; new
    chkHologram checkbox in #panToggles; applyPanOverlays refactored
    to loop pattern mirroring applyAadhaarMasks; silver gradient fill
    + white DM Mono "HOLOGRAM" label, 24px centred; §V.2.b).
  - PR #225 docs (this PR) — marks PRs #223/#224
    shipped across SKILL.md, AGENTS.md, issues.md; refreshes §11 prompt
    template to point at Phase 4 P2 (Move/Zoom).
- **ID Card Print Phase 4 P2 — SHIPPED.**
  - PR #226 docs — §W Move research.
  - PR #227 fix — cut marks Sheet-only.
  - PR #228 docs — §X Zoom research (stacked on #226).
  - PR #229 feat — per-side Move controls (X/Y nudge, §W). Per-side
    offset state, 4-arrow d-pad, step size, Front/Back radio, reset.
  - PR #230 feat — per-side Zoom/scale control (§X). Range slider
    50%–150%, zoom around centre then offset, overlays unaffected.
  - PR #231 fix — refresh Zoom slider DOM on `btnBack` + fresh PDF
    load (§X follow-up, cosmetic-only, 4 lines).
- **ID Card Print Phase 3 follow-up — SHIPPED.**
  - PR #232 feat — Auto Enhance button (§Y), rebased from closed #218.
    One-click bright/contrast/sat via luminance histogram. ~25 lines.
  - PR #234 docs — marks PRs #231/#232
    shipped across SKILL.md §9/§11, AGENTS.md, issues.md §X/§Y.
- **ID Card Print Phase 4 P3 §Z — SHIPPED.**
  - PR #235 docs — §Z research, Photo Editor split panel.
  - PR #239 feat — Step 2 sidebar reorg into 3 labelled panels
    (Card Cleanup / Position / Photo Adjust), Bold text toggle,
    3 Quick Presets (Original 100/100/100, Aadhaar 105/130/100,
    PAN 115/115/110), shared §W+§X Front/Back radio.
- **ID Card Print field-driven fixes (post-§Z) — SHIPPED.**
  - PR #240 feat — auto-detect & swap reversed Front/Back for
    Aadhaar/PAN PDFs (§AA). `skinPixelRatio()` + `shouldAutoSwap()`
    over photo ROI `[0.04, 0.18, 0.22, 0.55]` with thresholds
    `bSkin > 0.04 && delta > 0.02`. Manual Swap button in Panel A.
  - PR #241 feat — inline `#swapNotice` (amber palette) above
    Front canvas with one-click Undo button. Single-card mode only.
  - PR #242 feat — persist Card Cleanup toggles + Quick Preset id
    in `localStorage` key `idp:prefs:v1` (§AB). `savePrefs()` on
    every change, `loadPrefs()` before `applyFilters()` in both
    `processPdf()` and `showBatchPreview()`.
  - PR #243 fix — `CROP.aadhaar` first retune (§AC), regressed to
    upper-row formal Letter + Notice. Superseded by PR #245.
  - PR #245 fix — `CROP.aadhaar` re-retuned for the BOTTOM-row
    plastic-card mock-ups (§AC.6). Front `[0.010, 0.682, 0.477,
    0.231]`, Back `[0.504, 0.682, 0.488, 0.231]`. Also retuned
    `AADHAAR_FIELD_MASKS` for the small-card layout: `qrCode
    {535,75,390,350}`, `mobileNumber {0,0,0,0}` (soft no-op),
    `issueDate {2,105,22,145}`, `downloadDate {2,250,22,160}`
    (narrow vertical strips on the left margin where rotated
    date text appears). Closes §AC.5 follow-up.
  - PR #246 fix — qrCode mask widened from `{535,75,390,350}` to
    `{596,128,415,374}` after user reported QR bleed on right
    edge (§AC.6 follow-up).
  - PR #247 fix — Un-mirror Aadhaar back card on "1 Pair · Fold
    & Laminate" sheet (§AC.7). Removed `ctx.scale(-1, 1)` block
    in `buildSingleSheet()` (legacy fold-over-paper artefact);
    now matches multi-card / dragon / PVC layouts which already
    drew back un-mirrored. Today's workflow: cut both halves apart
    and stack back-to-back for lamination, no fold needed.
  - PR #248 fix — Tight `CROP.aadhaar` + `gap=0` in 1-pair sheet
    (§AC.8). Crop measured against `test-pdfs/aadhaar-test.pdf`
    at 200 DPI: Front `[0.0520, 0.6657, 0.4471, 0.2159]`, Back
    `[0.4991, 0.6657, 0.4465, 0.2159]` (seam at x=0.4991). Old
    crop left 85–95 px white margin per card; new crop is
    edge-to-edge. `AADHAAR_FIELD_MASKS` linear-scaled
    (canvas_x' ≈ 11 + x*1.093, canvas_y' ≈ 48 + y*1.070):
    `qrCode {596,128,415,374}`, `issueDate {13,160,24,155}`,
    `downloadDate {13,316,24,171}`, `mobileNumber {0,0,0,0}`
    (still soft no-op). `buildSingleSheet` `var gap = 40` →
    `var gap = 0` so front+back touch on A4 — matches user's
    snipping-tool reference.
  - PR #251 feat — Cut Marks toggle on 1-Pair Sheet (§AC.9).
    chkCutMarks in Step 2 sidebar Position panel (single-card
    mode); 4 corner ticks around the merged card pair; default
    OFF; persisted in idp:prefs:v1.
  - PR #252 refactor — REMOVE entire "Card Cleanup" panel (§AC.10).
    User: "iska koi kaam nahi hai feature main." Drops Hide QR /
    Mobile / Issue Date / Download Date / Signature Box / Hologram /
    Bold / Swap Front+Back / Undo Swap UI; removes
    AADHAAR_FIELD_MASKS, PAN_OVERLAY_REGIONS, applyAadhaarMasks,
    applyPanOverlays, swapFrontBack, updateSwapNotice,
    clearAutoSwapFlag, shouldAutoSwap, skinPixelRatio, auto-swap
    flow in fetchPdfCard/processPdf, all related DOM refs +
    listeners + reset entries, bold-text branch from
    getFilterString. idp:prefs:v1 schema reduced to
    {rounded, cutMarks, slider preset}. ~10 KB raw shrink in
    id-print.html. §AA auto-swap fully gone.
  - PRs #254 + #256 feat — §AC.11 Front+Back unified landscape
    preview. Step 2 preview's two stacked canvases collapsed into
    one `#pairCanvas` (2022×638). PR #254 originally shipped
    back-LEFT / front-RIGHT; PR #256 swapped to front-LEFT /
    back-RIGHT per user correction "FRONT WALE KO LIFT MAIN KRO
    OR BACK WALE KO RIGHT MAIN". Per-half rounded clip path,
    per-side Move/Zoom/filters/Auto Enhance/Quick Presets/Reset
    all preserved inside the unified canvas. Sheet builders
    untouched.
  - PR #258 feat — §AC.12 Swap sides toggle. Small icon-button
    `#btnSwapSides` (↔) below the unified preview. New
    `swapSides` boolean (default false). `compositePair()` swaps
    its (frontReady, backReady) args at the top when true so the
    rounded-clip and draw order both follow. Persisted in
    `idp:prefs:v1.swapSides`. Works in batch mode via
    `applyBatchFilters`. Sheet builders untouched (preview-only).
  - PR #259 feat — §AC.13 Responsive A4 preview + 1-pair to top
    + Cut Marks UI removed. CSS `.idp-a4-wrap canvas`:
    `max-width: min(100%, 600px)` + `max-height: 78vh` (mobile
    72vh), `width:auto / height:auto` so aspect ratio holds.
    `buildSingleSheet`: `startY = startX` so cards moved from
    centred to top with equal padding left/right/top. Removed
    the entire `if (cutMarks){…}` block from buildSingleSheet
    (no fold-here line, no caption, no corner ticks, no seam
    ticks). UI: `#chkCutMarks` checkbox + label deleted, JS ref
    + change listener deleted, `cutMarks` field dropped from
    `savePrefs()` / `loadPrefs()` (stale values silently
    ignored), `let cutMarks = true;` → `const cutMarks = true;`
    so multi-card / Dragon / PVC builders keep their cut guides
    unchanged. `idp:prefs:v1` schema now
    `{rounded, swapSides, slider preset}`.
  - PR #260 feat — §AC.14 Crop Aadhaar perforation strip + flush
    top + shrink preview further. `CROP.aadhaar`: front+back
    `y` 0.6657 → 0.6821 and `h` 0.2159 → 0.1995 (bottom edge
    same; crops out the dashed perforation cut-indicator the
    e-Aadhaar PDF prints just above the card border; new aspect
    ≈ 1.585:1 matches CR80 exactly). `buildSingleSheet`:
    `var startY = startX;` → `var startY = 80;` (~7mm @ 300
    DPI, was ~19mm — cards now flush at top of A4). CSS cap
    tightened: desktop `max-width 600 → 460px`,
    `max-height 78vh → 55vh`; mobile `max-height 72vh → 50vh`,
    `max-width 100%`. Wrap margin 20→14px (10px on mobile).
    Verified the dashed line was *not* drawn by buildSingleSheet
    (full ctx-draw audit) — it really was the source PDF.
  - PR #262 feat — §AC.15 Push 1-Pair sheet flush to top + black
    top edge line. `buildSingleSheet`: `var startY = 80;` →
    `var startY = 30;` (~2.5mm @ 300 DPI, was ~7mm — cards now
    sit at the practical top edge of the A4). After each
    `ctx.drawImage(card.front/back, …)`, draw a 4 px solid
    `#000` `fillRect` along the top edge of each card
    (`x + (rounded ? r : 0), startY, cardW - (rounded ? 2*r : 0),
    4`) — replaces the perforation-strip top border that §AC.14
    cropped away, restoring visual symmetry on all 4 sides.
    Multi-card / Dragon / PVC builders untouched (they already
    draw cut guides + full borders).
  - PR #263 feat — §AC.16 PAN crop fix to actual card row
    (Aadhaar-parity layout). `CROP.pan`:
    `front: [0.05, 0.08, 0.90, 0.42]` →
    `[0.0685, 0.7567, 0.4335, 0.1952]` and
    `back: [0.05, 0.54, 0.90, 0.40]` →
    `[0.5141, 0.7567, 0.4314, 0.1952]`. Old crop assumed
    1-card-per-page (full-width upper half = front, lower half
    = back); actual e-PAN PDFs (Protean eGov / NSDL) ship the
    same two-row layout as e-Aadhaar (formal Letter on top,
    real plastic-card pair below the `---- Cut ----` indicator).
    Coords measured from `test-pdfs/pan-test.pdf` at 300 DPI
    (page 2480×3509 px). Aspect ≈ 1.57 (CR80 = 1.585). All
    sheet builders are type-agnostic, so PAN now auto-inherits
    §AC.15 flush-top + 4 px black-top-line treatment. Aadhaar
    / Voter / Ayushman / Jan Aadhaar / eShram crop coords
    untouched.
  - PR #265 fix — §AC.17 Print preview cards too small on A4.
    The desktop preview cap from §AC.14
    (`max-width: min(100%, 460px); max-height: 55vh`) was
    being inherited inside `@media print` because the print
    rule only set `width: 100%` and never reset the maxes.
    In print context `vh` = printed page height, so 55vh
    capped the canvas at ~163mm out of 297mm A4, and 460px
    width cap shrank it to ~122mm out of 210mm A4 — cards
    came out at ~58% × ~55% of true CR80 size. Fix: reset
    `max-width: none; max-height: none; width: 100%;
    height: auto` on the canvas inside `@media print`.
    Bitmap is 2480×3508 (A4 @ 300 DPI), so width:100%
    (210mm) gives height 296.97mm ≈ A4 portrait → exact
    fit. Also force `html, body { margin: 0; padding: 0;
    background: #fff }` so the browser doesn't add its own
    page padding. Pure print-CSS fix, no JS / sheet-builder
    changes. Dragon (1205×1795) and PVC (1417×1417) keep
    natural aspect ratio (no distortion).
- **§AC.18 SHIPPED (PR #269) — phone PNG download / Print fixed
  via `canvas.toBlob` + `URL.createObjectURL`** (replaces the
  iOS Safari `toDataURL` size cap that was blanking the front
  card). See `issues.md §AC.18`.
- **§AC.19 SHIPPED (PR #270) — print preview pinned to 210mm ×
  297mm, exactly 1 sheet** (`@media print` block locks the A4
  wrap dimensions, kills page padding). See `issues.md §AC.19`.
- **§AC.20 SHIPPED (PR #271) — 1-Pair cards flush to top of A4
  in print preview** (`object-position: center top` on the
  print canvas). See `issues.md §AC.20`.
- **§AC.21 SHIPPED (PR #272) — `!important` + `position:
  absolute` on every print rule** to defeat mobile `@media
  (max-width: 640px)` leaking `max-height: 50vh` into print
  mode on Chromium-based engines. Insufficient on real phone —
  superseded by §AC.22. See `issues.md §AC.21`.
- **§AC.22 SHIPPED (PR #274) — print path now rasterises the
  canvas to a PNG `<img>` and prints the image instead of the
  canvas.** Browser print engines reliably render `<img>` at
  the requested print size; high-res `<canvas>` bitmaps were
  being resampled by the print engine. Got cards to top of
  page on phone but they appeared right-shifted on Letter
  paper + the cookie banner was visible. See `issues.md §AC.22`.
- **§AC.23 SHIPPED (PR #276) — paper-agnostic 100% sizing +
  hide cookie banner in print.** Switched html / body /
  .idp-app / .idp-preview / .idp-a4-wrap / #printImg from fixed
  210mm × 297mm to width:100% / height:100% so the print works
  on any paper size (A4 / Letter / Legal). Also added
  `.sp-cookie` to the @media print display:none list. Cookie
  banner fix worked; the 100% sizing introduced §AC.24's
  blank-page bug on phone. See `issues.md §AC.23`.
- **§AC.24 SHIPPED (PR #277) — `#printImg` anchored to the
  page viewport via `position: fixed` + `100vw` / `100vh`.**
  §AC.23's `height: 100%` chain collapsed to 0 on mobile
  Chrome (mobile print engines don't always give `<html>` a
  definite height in print mode), causing a completely blank
  A4 page. `position: fixed` + viewport units bypass the
  ancestor chain entirely so the image always fills the
  page. AWAITING TEST on real phone hardware. See
  `issues.md §AC.24`.
- **NEXT — pick from candidates** (see SKILL.md §"TASK NEXT
  SESSION" for the full list; no current priority — wait for
  user to confirm §AC.24 on phone, then pick from below):
  A. Audit multi-card / Dragon / PVC layouts for the same
     perforation-strip artefact + flush-top treatment, now that
     PAN also rides on the same `buildSingleSheet` path.
  B. Phase 4 P3 Master Settings (DPI / padding per printer,
     persist in localStorage).
  C. Phase 4 P3 PrePrinted Card mode (back-only sheets).
  D. Phase 4 P4 Printer presets (Epson L805 etc), BigQR toggle,
     other-card overlays.
  E. "Print Tip" hint card on the 1-Pair preview noting the
     bottom half of the sheet is reusable.
  Pick whichever the user prioritises. Default to (A) if they
  notice the same dashed line on the multi-card / Dragon / PVC
  outputs after PR #260 deploys.
- **Image-saving discipline (project rule).** Every reference image
  the user attaches goes into `.agents/references/<descriptive-name>.png`
  AND gets cited in the relevant `issues.md` section so future
  agents can verify the work matches the user's spec.
- **ID Card Print Phase 4 P3+ — REMAINING.** Master Settings (DPI/
  padding/margins per printer, persist in localStorage), PrePrinted
  Card mode (back-only sheets), Printer presets, BigQR toggle,
  other-card overlays (Voter / Ayushman / Jan Aadhaar — same pattern
  as PAN; note: the PAN overlays themselves were deleted in PR #252,
  so re-introducing overlays is a fresh design from scratch if the
  user asks again). Full prioritized table in issues.md §V.4.
- **Card size reference:** CR80 = 85.6×54mm = 1011×638px at 300 DPI.
  Lamination pouch = 65×95mm (Reston 125 micron). Test PDFs in repo:
  `test-pdfs/pan-test.pdf` (pw: `05071999`), `test-pdfs/aadhaar-test.pdf`
  (pw: `SUNI1986`).
- F7 GSI iframe warnings (not our code, harmless — monitor only).

## Working style for human collaborators

The project owner is non-technical, prefers **simple Hinglish** explanations,
and actively watches quota usage. Default workflow:

1. Read the relevant files and summarise the change in a **short plan** —
   list exactly which files and sections will change. Wait for approval.
2. Make the minimum diff needed. One PR per logical task.
3. Use the existing CSS variables and module boundaries — do not add new
   frameworks, libraries, or global tokens without approval.
4. Before reporting done, run `npm run build` locally.
5. Keep explanations of backend/CI/CD internals brief unless asked.

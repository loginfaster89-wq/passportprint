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
| `id-print.html`            | ID Card Print tool — Aadhaar/PAN PDF upload, password unlock, auto-detect, auto-crop front+back, CR80 output, A4 fold-and-laminate sheet, photo editing (brightness/contrast/saturation), download PNG + print. All client-side. Shared nav/auth/footer. |
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
9. **Half-half working (2026-04-26).** Split every session into two
   halves. **First half:** actual coding / feature work — implement the
   task, test, create PR. **Second half:** update Devin helping files
   (`SKILL.md`, `AGENTS.md`, `issues.md`) with what shipped, update the
   ready-to-paste prompt in SKILL.md §11 with the new last-PR and
   shipped summary so the user can copy-paste it into the next session.
   Never skip the second half — the user needs updated docs and a fresh
   prompt to start the next session efficiently.

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
generation + docs update. PR #198 docs — add half-half working rule +
fix PR #195→#197 references. PR #199 docs — mark shipped Phase 2
items in issues.md §M.6 + update SKILL.md §11 prompt template.

**Verified (2026-04-26):** ID Card Print Phase 1 MVP fully tested with
both test PDFs — PAN and Aadhaar flows ALL PASSED (upload, password
unlock, auto-detect, front+back preview, CR80 output, A4 sheet).

**Open backlog:**
- **ID Card Print Phase 2 (remaining)** — Voter ID support, Dragon
  sheet layout. (Photo editing, multi-card A4, cut marks, rounded
  borders all shipped.)
- **ID Card Print Phase 3** — Ayushman/Jan Aadhaar/eShram, batch
  processing, PVC card tray (Epson L805/L8050), toggle options, auto
  photo enhancement.
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

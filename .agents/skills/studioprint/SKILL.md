# Studio Print — Devin skill (condensed recipe)

Short checklist for Devin sessions on `loginfaster89-wq/passportprint`.
Deeper context lives in `AGENTS.md` at the repo root — read that file too,
this is just the "what do I run, what do I avoid" cheat sheet.

## 0. Vision — DO NOT DELETE

**This section defines how Devin approaches every task on Studio Print.
Read it first, internalise it, and let it guide every decision.**

Studio Print ka goal hai ki jab bhi koi user is website par aaye, toh
wo **bhool na paaye**. Design, fonts, visuals, micro-interactions,
layout, spacing — **sab kuch next level** hona chahiye. Ye ek indie
tool nahi hai — ye ek **2026 ka top-tier product** hai aur aise dikhna
chahiye.

**Devin ka role:** Devin ne is website ko banane mein actively help ki
hai. Devin sirf code nahi likhta — wo **design quality ka co-owner** hai.
Har PR mein:
- Existing design tokens (`--accent`, `--surface`, `--border`, etc.) ko
  **maximum effect** ke liye use karo.
- Har element ka spacing, alignment, aur visual weight check karo.
- Responsive behaviour har viewport pe polished hona chahiye — phone se
  desktop tak.
- Micro-interactions (hover, focus, transitions) subtle aur consistent
  hone chahiye.
- Copy terse, confident, non-salesy honi chahiye.

**Bottom line:** Jab tak website "wow" na lage, kaam khatam nahi hua.
Ye section kabhi delete mat karo — ye Devin ka design compass hai.

## 1. Clone & build

```bash
# Clone (PAT is already a repo-scoped secret: GITHUB_PAT_PASSPORTPRINT)
git clone "https://x-access-token:${GITHUB_PAT_PASSPORTPRINT}@github.com/loginfaster89-wq/passportprint.git"
cd passportprint
npm install
npm run build              # minified + obfuscated → ./dist
npx http-server dist -p 8080
# or: python3 -m http.server 8080 --directory dist
```

No dev server — edit source, `npm run build`, preview from `dist/`.
`npm run clean` removes `dist/`.

## 2. Hard rules (do NOT break these)

1. **`passport-photo.html` is editable — but minimum-diff only.** 5000+
   line working feature with its own inline copies of nav / auth / header
   plus a hash-open script (`#plans`, `#buy-<planId>`). Shared-module
   changes elsewhere must stay compatible with those inline copies.
   (Previously locked, unlocked 2026-04-24 at the owner's request —
   PR #109 U1 buy-flow was the first approved edit.)
2. **Never edit `.github/workflows/*.yml`** unless user confirms the PAT
   has `Actions: Read and write` (default fine-grained PAT only has
   Contents + Pull requests).
3. **Fonts, palette, CSS tokens are locked.** `Syne` (headings), `DM Mono`
   (body), `--bg: #0D0D0D`, `--accent: #F0A500`, etc. Use the existing
   vars in `assets/legal.css`; don't add new colour/spacing tokens.
4. **One PR per logical task, minimum diff.** No drive-by refactors.
5. **No secrets in commits.** Razorpay keys, Google OAuth secrets,
   `CLOUDFLARE_API_TOKEN`, `GITHUB_PAT_*` all live only in GitHub /
   Render settings.
6. **Shared header/nav/auth** = `assets/legal.css`, `assets/nav.js`,
   `assets/auth.js`, `assets/auth.css`. Don't fork into per-page copies.
7. **Pricing numbers** (free: 2 sheets/day; weekly: ₹59/7 days; monthly:
   ₹149/30 days) appear in `index.html`, `terms.html`, `refund.html`,
   `shipping.html`. If one changes, update all four.
8. **Design / fonts / animations / effects = case-by-case approval
   (2026-04-24).** Project owner wants top-tier 2026 polish, but any new
   font, palette, token, animation, transition, hover effect, decorative
   element, or layout restructuring requires **explicit owner approval
   in-thread before the PR opens**. Modern motion / micro-interactions
   are welcome *within* the existing tokens — but ask first. Minor
   spacing / responsive fixes from `issues.md` do not need per-change
   approval.
9. **No single-feature glorification (2026-04-24).** Never create
   dedicated hero CTAs, floating buttons, or workflow sections that
   promote only one tool. Studio Print has multiple planned tools
   (Passport Photo, Document Sheet, Certificate Editor, Background
   Studio). Keep CTAs generic ("See all tools", "Explore the tools")
   and let the features-grid cards serve as entry points per tool.
   This avoids costly rework when the next feature launches.
10. **Delete dead code in the same PR.** When a feature is removed,
    delete ALL related files, CSS rules, and JS in the same PR. Don't
    leave orphaned files — they confuse future sessions.
11. **Devin's credit is on the line.** The footer says "Built with
    Devin AI". Every messy footer, broken toggle, or wasted space
    reflects directly on Devin's quality. Test every viewport.
12. **One problem at a time.** When fixing issues from `issues.md` or
    any backlog, solve them **one by one** — one issue per PR, one PR
    per commit cycle. Do not batch multiple unrelated fixes into a
    single PR. Keeps diffs small, reviews fast, rollbacks safe.
13. **Research → docs → code (2026-04-26).** Kisi bhi naye feature par
    coding shuru karne se PEHLE, usi session mein Devin helping files
    (`SKILL.md`, `AGENTS.md`, `issues.md`) ko research findings ke saath
    update karo — ek alag "docs update PR" banao. Ye ensure karta hai ki
    quota khatam hone ya session break hone par bhi research safe rahe
    aur agli session bina re-research ke directly coding shuru kar sake.
    Rule: Research → Docs PR → Coding PR. Kabhi skip mat karo.

## 3. Create a PR (fine-grained PAT flow)

`git_pr` / `list_repos` often return "Not Found" because the session's
GitHub user isn't the repo owner. Fall back to REST with the PAT:

```bash
# After commit + push
cat > /tmp/pr_body.json <<'JSON'
{
  "title": "Short, present-tense summary",
  "head": "devin/<timestamp>-<slug>",
  "base": "main",
  "body": "## What\n...\n\n## Why\n...\n\n## Change\n...\n\n## Scope\n..."
}
JSON

curl -sS -X POST \
  -H "Authorization: Bearer $GITHUB_PAT_PASSPORTPRINT" \
  -H "Accept: application/vnd.github+json" \
  -H "Content-Type: application/json" \
  -d @/tmp/pr_body.json \
  https://api.github.com/repos/loginfaster89-wq/passportprint/pulls
```

Branch convention: `devin/<unix-timestamp>-<short-slug>`.

## 4. Deploy

- **Primary:** Cloudflare Pages, project name `studioprint`.
  `.github/workflows/deploy.yml` on every `main` push:
  `npm ci` → `npm run build` → `wrangler pages deploy dist --project-name=studioprint`.
- **Fallback:** Netlify (`netlify.toml`).
- CF Pages statuses don't post back to PRs. To verify:
  `curl https://studioprint.pages.dev` — prod URL propagation 10–60s;
  per-deploy hash URL is instant.
- Manual `wrangler` fallback: see `CLOUDFLARE_DEPLOY.md`.

## 5. 2026 copy tone (post PR #61)

- Hero: **"Every print job. One browser tab."** (accent on second line)
- Eyebrow: `NO UPLOADS · PRINT-READY`
- CTA heading: "Your next print job — right in this tab."
- Passport-photo page title + plan tags refreshed to match.
- English only — Hindi copy was removed site-wide in PR #60.

Keep future copy in that same confident, terse, non-salesy register.

## 6. Homepage grid → slider behaviour (post PR #64 / #65)

`assets/sliders.js` (plain, not obfuscated) adds `.is-slider` to
`.why-grid`, `.features-grid`, `.audience-grid`, `.steps-grid` when:
- viewport ≤ 760px, **or**
- any row has an orphan (right edge trails widest row by > 10px).

If you touch that script, smoke-test at 820px (iPad Air), 1280px
(desktop), 375px (iPhone SE). 820px must show 1 row + 4 dots; 1280px
must show plain grid; 375px must show slider.

## 7. Shared header layout (post PR #54 / #66)

```html
<header class="legal-header">
  <a href="index.html" class="logo">Studio <em>Print</em></a>
  <nav id="primaryNav">…links…</nav>
  <button class="nav-login" id="hdrAuthBtn">Login</button>
  <button class="nav-toggle" aria-controls="primaryNav">☰</button>
</header>
```

`#hdrAuthBtn` sits **outside** `<nav>` so Login is visible beside the
☰ on mobile without expanding the drawer. At ≤900px `<nav>` becomes
`position:absolute` — only `.nav-login` gets `margin-left:auto`;
`.nav-toggle` is explicitly `margin-left:0` so both pin right together
(PR #66 fix — was previously splitting flex free space between them
and centering the Login button).

`passport-photo.html` has its own inline copy of this CSS — don't try
to dedupe it from here.

## 7b. Shared pricing module (post PR #114)

`assets/pricing.js` + `assets/pricing.css` — shared 2-step modal:
Choose Plan → Complete Payment → Razorpay. Included on every page
except `passport-photo.html` (which keeps its own inline copy).

- On load, if `passport-photo.html`'s `#plansModal` / `window.openPlans`
  already exist, pricing.js steps aside (no double-modal).
- Exposes `window.openPlans` and `window.startCheckout` globally.
- `assets/auth.js` Upgrade/Change Plan button calls `window.openPlans()`
  on the current page instead of redirecting to `passport-photo.html#plans`.
- If `window.Razorpay` SDK isn't loaded, falls back to navigating to
  `passport-photo.html#buy-<planId>`.
- Hash handling: `#pricing` / `#plans` opens plan picker; `#buy-<planId>`
  goes straight to checkout.

Include order on each page:
```html
<link rel="stylesheet" href="assets/pricing.css">
<script src="assets/pricing.js" defer></script>
<!-- AFTER auth.js so window.currentUser / window.openAuth are available -->
```

## 8. Communication style (quota-conscious)

- **Hinglish, zero jargon.** The project owner has explicitly said
  "muje coding ke baare main kuch nhi pta hai" — assume the reader does
  not know code, stack traces, network tooling, or CI/CD. Translate
  every technical finding into plain consequences: kya toota, kya kaam
  kar raha hai, kya decision chahiye.
- **Never paste** stack traces, CDP initiator dumps, Playwright logs,
  minified JS snippets, HTTP status codes, or internal symbol names in
  user messages. Keep that evidence in the PR body / commit message
  only.
- **Lead with the decision, not the investigation.** First line should
  tell the user what's fixed / what's broken / what choice they need to
  make. Details only if asked.
- **Short plan → get approval → implement.** One PR per logical task.
- **Concise updates only** — don't message after every tool call.
- Before reporting done: `npm run build` locally.
- Keep backend / CI / CD internals brief unless asked.
- **Quota-conscious:** the owner watches daily quota. If they flag it
  mid-task, drop to the most terse mode possible — fewer tool calls,
  no speculative exploration, no re-explaining already-agreed plans.

## 9. Shipped work & open backlog

Everything from PRs #70–#213 is shipped. See `issues.md` for the full
audit trail (§N photo editing, §O multi-card/rounded corners/Voter ID/
Dragon sheet, §P Ayushman/Jan Aadhaar/eShram, §Q batch processing,
§R PVC card tray layout, §S copy update).
Do NOT re-fix any of the following — they are all merged:

- PRs #70–#114: original audit quick-wins + responsive + flow fixes.
- PRs #118–#132: stats-grid slider, self-host fonts, step-bar progress,
  audience grid, AI download bar, empty space, error banner,
  frame-corners, 768px breakpoint, font preload.
- PRs #134+#137: FAQPage + WebApplication JSON-LD.
- PR #139: footer/UX cleanup (F14–F19).
- PR #141: single-feature glorification cleanup (G1–G5).
- PR #142: BreadcrumbList + Organization JSON-LD, max-image-preview.
- PR #143: pricing cards removed, buy buttons in comparison table,
  trust pills 2-row, footer email icon removed.
- PR #145: hero eyebrow pill shrunk, one-at-a-time rule added.
- PR #147: terse-mode prompt + pricing table polish.
- PRs #148+#149: pricing table text size increase.
- PR #150: pricing section full redesign — plan cards, bigger text,
  mobile-friendly stacked layout.
- PR #152: hero-preview hidden on phones, trust-pill row gap fix.
- PR #153: removed 'Soon' features from nav dropdown + features grid.
- PR #154: fake feature tiles removed from hero-preview section.
- PR #155: docs update (SKILL.md + AGENTS.md for #152-#154).
- PR #156: Document Sheet feature card "Soon" + multi-tool copy update
  (density-break, how-it-works, FAQ, footer, nav dropdown on all pages).
- PR #157: Document Sheet tool page (Phase 1) — `document-sheet.html`
  with PDF upload, password-protected PDF detection, client-side unlock
  via pdf.js, page thumbnail preview. Nav/features updated Soon→Live.
- PR #159: dropdown feature icons fix on document-sheet page — added
  missing `.ix` CSS (fill:none, stroke:currentColor).
- PR #160: Aadhaar/PAN card detection on document-sheet page — text
  extraction via pdf.js `getTextContent()`, keyword matching (2+ hits
  confirms), styled detection badge (amber=Aadhaar, green=PAN),
  unsupported doc rejection.
- PR #163: Document Sheet Phase 2 — editor step, card/photo crop,
  A4 sheet generation, download PNG + print.
- PR #165: Full Document photo protection fix + Back to Edit button.
- PR #166: Photo Only crop fallback + per-mode edit state auto-save.
- PR #168: docs update (SKILL.md, AGENTS.md, issues.md for #166-#168).
- PR #170: PAN Photo Only vertical scan bounds fix.
- PR #182: PAN/Aadhaar CR80 card size standardization + auto-trim +
  test PDFs saved in `test-pdfs/`.
- PR #183: card system rebuild docs.
- PR #184: front-card-only crop fix for Aadhaar & PAN + trim safety.
- PR #185: deleted old `document-sheet.html` — clean slate for new
  ID print feature.
- PR #186: docs — ID Card Print research + implementation plan (§M).
- PR #188: **ID Card Print Phase 1 MVP** — new `id-print.html` with
  PDF upload + password unlock, auto-detect Aadhaar/PAN, auto-crop
  front+back, CR80 output (1011×638px at 300 DPI), side-by-side
  preview, A4 fold-and-laminate layout, download PNG + print. All
  client-side. Shared nav/auth/footer.
- PR #189: fix Aadhaar PDF detection — expanded keyword list with
  `enrolment`, `download date`, `issue date` (4 hits now vs 1 before).
- PR #190: docs update for PRs #186–#189 verification results.
- PR #191: **ID Card Print Phase 2 photo editing** —
  brightness/contrast/saturation sliders with live preview via canvas
  `ctx.filter`. Output carries through to A4 sheet. Reset button.
  Mobile-responsive (≤640px stacks vertically). Existing tokens only.
- PR #192: docs update for PRs #190–#191.
- PR #193: **ID Card Print Phase 2 multi-card A4** — 5 card pairs per
  sheet, cut marks/dashed guides, layout toggle (single fold-and-laminate
  vs multi-card), corner marks for precision cutting.
- PR #194: **ID Card Print Phase 2 rounded corners** — toggle checkbox,
  canvas clip-path with `arcTo`, applies to preview + A4 sheet.
- PR #197: fix `var r` variable shadowing bug in `buildMultiCardSheet()`
  + docs update (loop variable `r` was overwritten by radius `r` —
  caused infinite loop when rounded corners off, only 1 row when on).
- PR #198: docs — fix PR #195→#197 references across all docs.
  (This PR also added a "half-half working" rule to SKILL.md §2 and
  AGENTS.md, which was later removed in PR #250.)
- PR #199: docs — mark shipped Phase 2 items in issues.md §M.6
  (multi-card PR #193, cut marks PR #193, rounded corners PR #194/
  #197), update §11 prompt template for next session.
- PR #201: docs — fill Voter ID task in prompt, update AGENTS.md.
- PR #202: **ID Card Print Phase 2 Voter ID** — multi-page PDF support,
  auto-detect via keywords, renders both pages at 300 DPI, CR80 output.
- PR #203: **ID Card Print Phase 2 Dragon sheet** — 4×6 layout
  (1205×1795px), 2 cards per sheet, cut marks, corner marks, rounded
  corners support, dedicated download filename.
- PR #205: **ID Card Print Phase 3** — Ayushman Bharat (PMJAY), Jan
  Aadhaar (Rajasthan family ID), eShram (unorganized worker UAN) support.
  Auto-detect keywords, crop regions, CSS badges, multi-page PDF support.
- PR #206: docs — add §P section for Phase 3 Ayushman/Jan Aadhaar/eShram.
- PR #208: **ID Card Print Phase 3 batch processing** — multiple PDFs
  at once. File queue UI, "Add More" + "Process All" buttons, per-file
  password prompts, auto-detect + auto-crop each PDF, all cards combined
  on single A4 sheet. Single-file fallback to legacy path.
- PR #209: docs — mark batch shipped, add §Q, update prompt.
- PR #210: **ID Card Print Phase 3 PVC card tray** — 120×120mm canvas
  for Epson L805/L8050 CD/DVD tray. Dual card slots, tray guides,
  corner marks, rounded corners support.
- PR #212: docs — mark PVC tray shipped (PR #210), add §R, update prompt.
- PR #213: **copy update** — nav dropdown subtitle on 7 pages updated
  to include Ayushman/eShram. Homepage feature card description updated
  to reflect Phase 2/3 features.
- PRs #214–#225: docs (gap-fill + research). #214 docs gaps. #215/#216
  toggle-options research (§T). #217 Aadhaar field toggles code.
  #218 closed (conflicted). #219 docs. #220 PAN signature box research
  (§U). #221 PAN signature box code. #222 §V Phase 4 scope reset.
  #223 fix PAN signature coords (§V.2.a). #224 PAN HOLOGRAM overlay
  (§V.2.b). #225 docs.
- PRs #226–#234: Phase 4 P2 + §Y. #226 §W Move research. #227 cut-marks
  Sheet-only fix. #228 §X Zoom research. #229 per-side Move (X/Y nudge).
  #230 per-side Zoom (50%–150%). #231 zoom slider DOM refresh fix.
  #232 Auto Enhance (§Y, rebased from closed #218). #234 docs.
- PRs #235 + #239: Phase 4 P3 §Z Photo Editor split panel.
  #235 research, #239 code (Step 2 sidebar reorg into Card Cleanup /
  Position / Photo Adjust + Bold toggle + 3 Quick Presets +
  shared §W+§X Front/Back radio).
- PRs #240–#248: §AA / §AB / §AC field-driven fixes.
  #240 auto-detect & swap reversed Front/Back (Aadhaar/PAN, §AA,
  `skinPixelRatio` over photo ROI). #241 inline `#swapNotice` (amber)
  + Undo button. #242 persist Card Cleanup toggles + Quick Preset id
  in localStorage `idp:prefs:v1` (§AB). #243 §AC.5 first crop retune
  (regressed, superseded). #245 §AC.6 final retune for the bottom-row
  plastic-card mock-ups. #246 §AC.6 follow-up — qrCode mask widened.
  #247 §AC.7 — un-mirror Aadhaar back card on 1-pair sheet (legacy
  fold artefact removed; cut + back-to-back stack workflow today).
  #248 §AC.8 — tight `CROP.aadhaar` + `gap=0` on 1-pair sheet (cards
  print edge-to-edge, matches user snipping-tool reference).
- PR #251: feat — **Cut Marks toggle on 1-Pair Sheet (§AC.9).** Re-uses
  the existing `cutMarks` boolean (already wired for multi-card /
  Dragon / PVC). New `chkCutMarks` checkbox in Step 2 sidebar Position
  panel (single-card mode). When ON, `buildSingleSheet` draws 4 short
  black corner ticks around the merged card pair and skips the dashed
  seam line. Default OFF. Persists in `idp:prefs:v1`.
- PR #252: refactor — **Remove "Card Cleanup" panel (§AC.10).** User:
  "iska koi kaam nahi hai feature main." Drops `panelCleanup` div +
  `swapNotice` (Hide QR / Mobile / Issue Date / Download Date /
  Signature Box / Hologram / Bold / Swap Front+Back / Undo Swap),
  `AADHAAR_FIELD_MASKS`, `PAN_OVERLAY_REGIONS`, `applyAadhaarMasks`,
  `applyPanOverlays`, `swapFrontBack` + `updateSwapNotice` +
  `clearAutoSwapFlag` + `shouldAutoSwap` + `skinPixelRatio`,
  auto-swap flags + flow in `fetchPdfCard`/`processPdf`, all related
  DOM refs + listeners + reset entries, bold-text branch from
  `getFilterString`. `idp:prefs:v1` schema reduced to
  `{rounded, cutMarks, slider preset}`. ~10 KB raw shrink in
  `id-print.html`. Position / Photo Adjust / Quick Presets / Auto
  Enhance / Reset / Rounded Corners / Cut Marks (#251) all preserved.
  §AA auto-swap fully gone — replaced by §AC.11 landscape preview
  redesign (next session).

**NEXT — §AC.11 Front+Back preview redesign.** User wants the Step 2
preview to match the printed 1-pair sheet exactly: ONE landscape
canvas (back on left, front on right), not two stacked vertical
canvases. Reference image at
`.agents/references/preview-landscape-target.png` (the user's
snipping-tool capture, IS the spec). Full design + acceptance
criteria in `issues.md` §AC.11. Estimated ~60–80 line code PR in
`id-print.html` only; sheet builders untouched.

**Phase 2 is now COMPLETE.**

**Verified (2026-04-26):** Both test PDFs fully working:
- PAN PDF: upload → password unlock (05071999) → auto-detect PAN →
  front+back preview → CR80 output → A4 fold-and-laminate sheet →
  download PNG + print. ALL PASSED.
- Aadhaar PDF: upload → password unlock (SUNI1986) → auto-detect
  Aadhaar (4 keyword hits: vid, enrolment, download date, issue date) →
  front+back preview → CR80 output. ALL PASSED.

**ID Card Print Phase 1 MVP is COMPLETE and VERIFIED.**

**Research completed (session 2026-04-25):** Full competitor analysis,
card sizes, lamination specs, and feature plan documented in
`issues.md` §M. Key findings below.

**Competitors researched:**
- CardXpress (MySea Solutions) — Rs 2500 desktop, Aadhaar/PAN/Voter,
  Epson L805 tray + A4 + Dragon sheet. Front+back preview, photo edit,
  font change, BigQR, positioning controls.
- eCardCutter (go24.info) — FREE browser tool, advance crop, toggles
  (issue date, QR, mobile no, download date), rounded borders.
- DocSet.in — FREE, 5 cards per A4, CR80 auto-alignment.
- PVC Pro — Rs 1/file, multi-card, batch, AI crop.

**Card size reference:**
- CR80 standard: 85.6 × 54 mm = 1011 × 638 px at 300 DPI
- Lamination pouch: 65 × 95 mm (Reston 125 micron)
- Card fits inside pouch with ~4.7mm width margin, ~5.5mm height margin
- A4 at 300 DPI: 2480 × 3508 px
- Dragon sheet 4×6: 1205 × 1795 px (fits 2 cards)
- Test PDFs: `test-pdfs/pan-test.pdf` (pw: `05071999`),
  `test-pdfs/aadhaar-test.pdf` (pw: `SUNI1986`)

**eAadhaar PDF structure:**
- A4 portrait (~595 × 842 pt). Front card area upper ~60-65%, back
  lower ~30-35%. Password: first 4 CAPS letters of name + birth year.

**ePAN PDF structure:**
- Varies (A4 portrait or landscape). Providers: NSDL, UTI-ITSL,
  Income Tax eFiling — each has slightly different layout. Password:
  DOB in DDMMYYYY.

**Phase 1 (MVP) — build `id-print.html`:**
1. PDF upload + password unlock (pdf.js — already a project dependency)
2. Auto-detect Aadhaar vs PAN (text extraction keyword matching)
3. Auto-crop front + back from PDF page
4. CR80 sized output (1011 × 638 px at 300 DPI)
5. Front + back side-by-side preview
6. A4 sheet layout with both sides (fold-and-laminate workflow)
7. Download PNG + Print button
8. All processing client-side (privacy-first)
9. Shared nav/auth/footer (legal.css, nav.js, auth.js, pricing.js)

**Phase 2 (follow-up PRs):**
- ~~Photo editing (brightness/contrast/saturation)~~ — **shipped PR #191**
- ~~Multiple cards per A4 (4-5 pairs per sheet)~~ — **shipped PR #193**
- ~~Cut marks/guides on A4 output~~ — **shipped PR #193**
- ~~Rounded border option~~ — **shipped PR #194, bug fix PR #197**
- ~~Voter ID support~~ — **shipped PR #202**
- ~~Dragon sheet (4×6) layout option~~ — **shipped PR #203**

**Phase 3:**
- ~~Ayushman/Jan Aadhaar/eShram support~~ — **shipped PR #205**
- ~~Batch processing (multiple PDFs)~~ — **shipped PR #208**
- ~~PVC card tray layout (Epson L805/L8050)~~ — **shipped PR #210**
- ~~Toggle options (issue date, QR, mobile no, download date)~~ — **shipped PR #217**
- ~~Auto photo enhancement~~ — **shipped PR #232 (rebased from closed #218)**
- Signature box option (PAN) — **code PR #221 + coord fix PR #223 (in flight)**
- Back-side hologram overlay (PAN) — **code PR #224 (in flight, ~40 lines, §V.2.b)**

**Phase 4 (CardXpress feature parity — see §V in issues.md, scoped 2026-04-26):**
- P1 Fix §U signature box coords — **PR #223 in flight (4-line patch, §V.2.a)**
- P1 PAN HOLOGRAM overlay — **PR #224 in flight (~40 lines, back top-right silver patch, §V.2.b)**
- ~~P2 Per-side Move controls (X/Y nudge)~~ — **shipped PR #229**
- ~~P2 Per-side Zoom (scale within CR80)~~ — **shipped PR #230**
- P3 Photo Editor split panel
- P3 Master Settings (DPI/padding/margins)
- P3 PrePrinted Card mode
- P4 Printer presets (Epson L805 etc), Bold/BigQR toggles, other-card overlays

**Pricing section design rule (post PR #150):** The pricing section uses
card-based layout (`.plan-grid` with `.plan-card` divs), NOT a `<table>`.
Text must stay large and readable — minimum 16px for feature text, 24px
for plan names, 42px+ for prices. On mobile (≤900px) cards stack
vertically. Never shrink text below these minimums. If adding features,
add them to all 3 cards consistently.

**Open:** `F7` GSI iframe warnings (not our code, harmless).
Phase 2 COMPLETE. Phase 3 Ayushman/Jan Aadhaar/eShram shipped (PR #205),
batch processing shipped (PR #208), PVC tray shipped (PR #210),
copy update shipped (PR #213). Remaining Phase 3 items — see list above.

## 10. Related repos

- Frontend (this repo): `loginfaster89-wq/passportprint`
- Backend: `loginfaster89-wq/PassportPrint-Studio` — Node/Express on
  Render. Handles auth (email OTP + Google), Razorpay, `/api/me`,
  `/api/google-login`, `/api/delete-account`. URL hardcoded as
  `https://passportprint-studio.onrender.com` in `passport-photo.html`
  and `assets/auth.js`.

## 11. Ready-to-paste prompt for a new Devin chat

Copy the block below into a fresh Devin session. It self-contains
repo / PAT / rules / concrete scope so a new session can start working
without re-auditing.

```
[TERSE MODE = ON] Minimum messages, zero re-explanation, sirf critical
updates aur decisions. Hinglish. Ye default hai — har session mein auto-on.
Quota reminder pe koi message mat do — silently kaam karte raho.

Sabse pehle PAT le lo mere se — GITHUB_PAT_PASSPORTPRINT (fine-grained,
repo-scoped — Contents + Pull requests: Read and write). Session-only
secret hoga. Bina PAT ke aage mat badho.

Studio Print frontend par kaam karo. Repo: loginfaster89-wq/passportprint
(private). Last main HEAD has PR #253 (docs) merged.

Clone ke baad pehle ye teen files padho:
.agents/skills/studioprint/SKILL.md — Devin recipe (this file)
AGENTS.md — full source of truth (rules, layout, hard constraints)
issues.md — full audit + ID Card Print arc
  (§M Phase 1 — §V Phase 4 scope — §W Move — §X Zoom — §Y Auto Enhance —
   §Z Photo Editor split — §AA auto-swap — §AB persist prefs —
   §AC crop / mirror / gap retunes —
   §AC.9 Cut Marks toggle (PR #251) —
   §AC.10 Card Cleanup removal (PR #252) —
   §AC.11 Front+Back unified landscape preview (PRs #254 + #256) —
   §AC.12 Swap sides toggle (PR #258) —
   §AC.13 Responsive A4 + 1-pair to top + drop Cut Marks UI (PR #259) —
   §AC.14 Crop Aadhaar perforation + flush top + shrink preview (PR #260) —
   §AC.15 1-pair fully flush top + black top-edge line (PR #262) —
   §AC.16 PAN crop fix to actual card row, Aadhaar parity (PR #263) —
   §AC.17 Print preview canvas full-A4 sizing fix (PR #265) —
   §AC.18 SHIPPED: phone PNG download via toBlob+Blob URL (PR #269) —
   §AC.19 SHIPPED: print preview pinned 210mm × 297mm, 1 sheet (PR #270) —
   §AC.20 SHIPPED: 1-Pair cards flush to top + center top object-position (PR #271) —
   §AC.21 SHIPPED: !important + position:absolute on print canvas (PR #272 — superseded by §AC.22) —
   §AC.22 SHIPPED, AWAITING TEST: render canvas → PNG <img> for print (PR #274))

Reference images in .agents/references/ and `attached_assets/` — open
the latest user-attached `aadhaar-a4-sheet_*.png`, the matching
`Screenshot_(*)_*.png` set, `ac18-phone-print-broken.png` (§AC.18
reference), and `ac21-print-still-broken.png` (§AC.21 reference)
before starting any new layout work.

Last shipped: PR #274 (fix: §AC.22 — print path now rasterises the
A4 canvas to a PNG via `canvas.toBlob`, swaps the bytes onto a
hidden `<img id="printImg">` sibling, and prints the image
instead of the canvas. Print CSS rules from §AC.21 carry over
verbatim, just re-pointed at `#printImg`. The canvas itself is
forced `display: none !important` in `@media print`. Reason:
browser print engines mis-handle 2480 × 3508 canvas bitmaps —
they render `<img>` reliably at the requested print size).

**§AC.22 STATUS: SHIPPED, AWAITING TEST.** No open §AC item.
After Cloudflare Pages redeploys PR #274, ask the user to re-test
print preview on phone. Expectation: cards fill A4, flush to top,
1 sheet — same as desktop. If the print is finally correct,
§AC.22 closes GREEN. If a new symptom appears, open §AC.23 with
a fresh phone screenshot. Otherwise pick from the standing
candidates list at the bottom of this file.

Shipped summary (don't redo) — see SKILL.md §9 for the full PR list.
Highlights:
- ID Card Print Phase 1 MVP COMPLETE + VERIFIED (PR #188).
- Phase 2 COMPLETE — photo edit, multi-card A4, cut marks, rounded
  corners, Voter ID, Dragon sheet.
- Phase 3 COMPLETE — Ayushman/Jan Aadhaar/eShram, batch processing,
  PVC card tray, copy update.
- Phase 4 P1 SHIPPED — PAN signature box + HOLOGRAM overlay.
- Phase 4 P2 SHIPPED — per-side Move (X/Y nudge) + per-side Zoom
  (50%–150%).
- Phase 4 P3 §Z SHIPPED — Photo Editor split panel (Card Cleanup /
  Position / Photo Adjust + Bold + Quick Presets + shared Front/Back
  radio).
- §AA SHIPPED — auto-detect & swap reversed Front/Back + manual
  Swap button + amber #swapNotice + Undo. **REMOVED in PR #252.**
- §AB SHIPPED — persist prefs in localStorage `idp:prefs:v1`.
  **Schema reduced in PR #252 to {rounded, cutMarks, slider preset}.**
- §AC.6/§AC.7/§AC.8 SHIPPED — Aadhaar crop retuned to bottom-row
  plastic-card mock-ups, back un-mirrored, gap=0 on 1-pair sheet.
- §AC.9 SHIPPED — PR #251 Cut Marks toggle on 1-Pair Sheet
  (chkCutMarks in Position panel; 4 corner ticks; default OFF;
  persisted in idp:prefs:v1).
- §AC.10 SHIPPED — PR #252 Removed entire "Card Cleanup" panel
  (Hide QR / Mobile / Issue Date / Download Date / Signature Box /
  Hologram / Bold / Swap Front+Back / Undo Swap), all support code
  (AADHAAR_FIELD_MASKS, PAN_OVERLAY_REGIONS, applyAadhaarMasks,
  applyPanOverlays, swapFrontBack, updateSwapNotice,
  clearAutoSwapFlag, shouldAutoSwap, skinPixelRatio, auto-swap flow).
  ~10 KB raw shrink in id-print.html. §AA auto-swap fully gone.
- §AC.11 SHIPPED — PRs #254 + #256 Front+Back Step 2 preview
  redesign. Two stacked canvases collapsed into ONE landscape
  `#pairCanvas` (2022×638). Order **front-LEFT / back-RIGHT** (PR
  #254 originally shipped back-LEFT; PR #256 swapped per user
  correction "FRONT WALE KO LIFT MAIN KRO OR BACK WALE KO RIGHT
  MAIN"). Per-half rounded clip, per-side Move/Zoom/filters/Auto
  Enhance/Quick Presets/Reset all preserved. Sheet builders untouched.
- §AC.12 SHIPPED — PR #258 Swap sides toggle. Small icon-button
  (`#btnSwapSides`, ↔) below `#pairCanvas`. New `swapSides` boolean
  (default false). `compositePair()` swaps args at top when true.
  Persisted in `idp:prefs:v1.swapSides`. Works in batch mode via
  `applyBatchFilters`. Sheet builders untouched (preview-only flip).
- §AC.13 SHIPPED — PR #259 Responsive A4 preview + 1-pair to top +
  Cut Marks UI removed. CSS `.idp-a4-wrap canvas`: `max-width: min(100%,600px)`
  + `max-height: 78vh` (mobile 72vh). `buildSingleSheet`:
  `startY = startX` (cards moved from centred to top, equal padding
  left/right/top). Removed `#chkCutMarks` markup + JS ref + listener;
  dropped `cutMarks` from savePrefs/loadPrefs (`idp:prefs:v1` schema
  now `{rounded, swapSides, slider preset}`); `let cutMarks = true;`
  → `const cutMarks = true;` (multi/Dragon/PVC builders unchanged).
  Removed the entire `if (cutMarks){…}` block from buildSingleSheet
  (no fold-here line, no caption, no corner ticks, no seam ticks).
- §AC.14 SHIPPED — PR #260 Crop Aadhaar perforation strip + flush
  top + shrink preview further. `CROP.aadhaar` retuned: front+back
  `y` 0.6657 → 0.6821 and `h` 0.2159 → 0.1995 (bottom edge same;
  crops out the dashed perforation cut-indicator strip the e-Aadhaar
  PDF prints just above the card border; new aspect ≈ 1.585:1
  matches CR80 exactly). `buildSingleSheet`: `startY = 80`
  (~7mm @ 300 DPI, was ~19mm). CSS cap tightened: desktop
  `max-width 600 → 460px`, `max-height 78vh → 55vh`; mobile
  `max-height 72vh → 50vh`, `max-width 100%`. Wrap margin reduced.
  Verified the dashed line was *not* drawn by buildSingleSheet
  (full ctx-draw audit) — it really was the source PDF's perforation.
- §AC.15 SHIPPED — PR #262 1-pair sheet fully flush to top + black
  top-edge line. `buildSingleSheet`: `startY = 80` → `startY = 30`
  (~2.5mm @ 300 DPI). After each `ctx.drawImage(card.front/back, …)`,
  draw a **4 px solid `#000` `fillRect`** along the top edge:
  `(x + (rounded ? r : 0), startY, cardW - (rounded ? 2*r : 0), 4)`
  — restores the top border that §AC.14's perforation crop stripped
  away, so the card looks complete on all 4 sides. Multi-card /
  Dragon / PVC builders untouched (they already draw cut guides).
- §AC.16 SHIPPED — PR #263 PAN crop fix to actual card row
  (Aadhaar-parity layout). `CROP.pan` retuned:
  `front: [0.05, 0.08, 0.90, 0.42]` → `[0.0685, 0.7567, 0.4335, 0.1952]`,
  `back: [0.05, 0.54, 0.90, 0.40]` → `[0.5141, 0.7567, 0.4314, 0.1952]`.
  Old crop assumed 1-card-per-page (full-width upper half = front,
  lower half = back); actual e-PAN PDFs (Protean eGov / NSDL) ship
  the same two-row layout as e-Aadhaar (formal Letter on top, real
  plastic-card pair below the `---- Cut ----` indicator: front-LEFT,
  back-RIGHT). Coords measured from `test-pdfs/pan-test.pdf` at
  300 DPI (page 2480×3509 px). Aspect ≈ 1.57 (CR80 = 1.585). All
  sheet builders are type-agnostic, so PAN now auto-inherits §AC.15
  flush-top + 4 px black-top-line treatment. Aadhaar / Voter /
  Ayushman / Jan Aadhaar / eShram crop coords untouched.
- §AC.17 SHIPPED — PR #265 Print preview cards too small on A4
  (pure print-CSS fix). The desktop preview cap from §AC.14
  (`max-width: min(100%, 460px); max-height: 55vh`) was being
  inherited inside `@media print` because the print rule only set
  `width: 100%` and never reset the maxes. In print context `vh` =
  printed page height, so 55vh capped the canvas at ~163mm out of
  297mm A4, and 460px width cap shrank it to ~122mm out of 210mm
  A4 — cards came out at ~58% × ~55% of true CR80 size on a blank
  A4 sheet. Fix: inside `@media print`, set canvas
  `max-width: none; max-height: none; width: 100%; height: auto`.
  Bitmap is 2480×3508 (A4 @ 300 DPI), so width:100% (210mm) gives
  height ≈ 296.97mm ≈ A4 portrait → exact full-A4 fit at true CR80
  sizing. Also force `html, body { margin:0; padding:0;
  background:#fff }` to prevent the browser's default body padding
  from clipping the canvas right edge. No JS / sheet-builder
  changes. Dragon (1205×1795) and PVC (1417×1417) keep their
  natural aspect ratio (no distortion).

Test PDFs repo mein saved hain:
test-pdfs/pan-test.pdf (password: 05071999)
test-pdfs/aadhaar-test.pdf (password: SUNI1986)

═══════════════════════════════════════════════════════════════
TASK (NEXT SESSION) — none open
═══════════════════════════════════════════════════════════════

§AC.11–§AC.22 are all SHIPPED (PRs #251–#274). §AC.22 (PR #274)
is the latest fix and is AWAITING TEST on real phone hardware.
**No new code work until the user confirms §AC.22 on phone.**

**On the next session, first do this:**
1. Ask the user to open `https://studioprint.pages.dev/id-print`
   on their phone (force-quit the browser first to bust the
   service-worker / Cloudflare cache), upload
   `test-pdfs/aadhaar-test.pdf` (pw `SUNI1986`), tap 🖨 Print,
   and screenshot the print preview dialog.
2. Save the screenshot under
   `.agents/references/ac22-phone-result-<YYYYMMDD>.png` and
   quote it in `issues.md §AC.22.1`.

**Then branch on the result:**
- **If print is correct (cards fill A4, flush to top, 1 sheet)
  → §AC.22 closes GREEN.** Update `issues.md §AC.22.1` to
  CONFIRMED, update this SKILL.md status block, and pick from
  the standing candidates list below.
- **If a NEW symptom appears** (e.g. image too slow to render,
  print fires twice, image quality degraded vs canvas) → open
  §AC.23 with the fresh phone screenshot, hypothesise root
  cause, and ship a minimum-diff fix.
- **If the OLD symptom persists** (cards still small / whitespace
  / 2 sheets even with the `<img>` swap) → very unlikely given
  the canvas-bitmap diagnosis, but if so, open §AC.23 and look
  at the page-level `@page { size: A4; margin: 0; }` rule plus
  the user's print-dialog "Scale" / "Fit to page" setting (some
  Chromium mobile dialogs default to ~94% scale).

**Standing candidates list (no priority — pick whichever the user wants):**

A. **Audit multi-card / Dragon / PVC layouts for the same
   perforation-strip artefact.** The crop changes in §AC.14
   (Aadhaar) and §AC.16 (PAN) are global (CROP entries are shared),
   so those layouts should already benefit. Verify visually and
   tighten the *top placement* of the first row in
   `buildMultiCardSheet` to match the §AC.13 / §AC.14 / §AC.15
   "flush at top, less waste, black top-line" treatment if the user
   wants symmetry across all four layouts.

B. **Phase 4 P3 Master Settings.** DPI / padding / margins per
   printer, persisted in localStorage (extend `idp:prefs:v1` or new
   `idp:printer:v1`).

C. **Phase 4 P3 PrePrinted Card mode** (back-only sheets — for users
   who buy pre-printed Aadhaar/PAN card stock and only need the
   back side printed).

D. **Phase 4 P4 Printer presets** (Epson L805 etc), BigQR toggle,
   other-card overlays (Voter / Ayushman / Jan Aadhaar — fresh
   design from scratch since the PAN overlays were deleted in
   PR #252).

E. **"Print Tip" hint card** on the 1-Pair preview saying
   "Bottom half is reusable — feed sheet again for second pair."
   (Suggested at the end of PR #260; user has not committed.)

═══════════════════════════════════════════════════════════════

Hard rules (do NOT skip — see AGENTS.md):
1. ONE PR per logical task (Rule #12).
2. Research → docs → code (Rule #13/#14). For small follow-ups
   like §AC.12–§AC.14 the docs entry can ride in the same PR
   description + issues.md update; for new features, write the
   issues.md section first.
3. Minimum diff. Don't refactor adjacent code "while you're there".
4. Use existing tokens / module boundaries.
5. PR via GitHub REST API only — destructive git ops blocked.
   Branch: `devin/<unix_ts>-<short-slug>`. Base: main. Use the
   reusable script `/tmp/mkpr.mjs` (reads PAT from
   `process.env.GITHUB_PAT_PASSPORTPRINT`, branch from
   `/tmp/branch_name.txt`).
6. Run `npm install && npm run build` before committing dist/.
   Both `id-print.html` and `dist/id-print.html` go in the same PR.
7. Image-saving discipline: every reference image the user attaches
   goes into `.agents/references/<descriptive-name>.png` (or, if not
   committed to repo, cited by its `attached_assets/` filename) AND
   gets quoted in the relevant `issues.md` section.

State of `idp:prefs:v1` schema (post-§AC.13):
  `{ rounded: boolean, swapSides: boolean,
     bright: int, contrast: int, sat: int }`
  — `cutMarks` was REMOVED; stale values from old blobs are ignored.

State of `CROP.aadhaar` (post-§AC.14):
  front: [0.0520, 0.6821, 0.4471, 0.1995]
  back:  [0.4991, 0.6821, 0.4465, 0.1995]
  Aspect ≈ 1.585:1 (matches CR80). Bottom edge same as PR #248.
  Rollback knob if too tight on a PDF variant: bump `y` back to
  ≈0.6770 and `h` to ≈0.2046.

State of `CROP.pan` (post-§AC.16):
  front: [0.0685, 0.7567, 0.4335, 0.1952]
  back:  [0.5141, 0.7567, 0.4314, 0.1952]
  Aspect ≈ 1.57 (close to CR80 1.585). Measured from
  `test-pdfs/pan-test.pdf` (Protean eGov / NSDL layout) at 300 DPI
  (page 2480×3509 px). Rollback if a UTIITSL or other variant
  misses: loosen to `y: 0.7500, h: 0.2050` for both front + back.

State of `buildSingleSheet` (post-§AC.15):
  `gap = 0`, `startX = (A4_W - pairW) / 2`, `startY = 30`
  (~2.5mm @ 300 DPI — fully flush at top of A4). After each
  `ctx.drawImage(card.front/back, …)`, draw a 4 px solid `#000`
  `fillRect` along the top edge: `(x + (rounded ? r : 0), startY,
  cardW - (rounded ? 2*r : 0), 4)` — replaces the perforation-strip
  top border that §AC.14's crop stripped away. NO cut-marks /
  fold-here / corner-ticks / seam-ticks branch. Caption `CR80 ·
  85.6 × 54 mm · 300 DPI — Studio Print` still drawn at
  `startY + cardH + 70`. Type-agnostic, so it applies to Aadhaar
  AND PAN (and any future ID type) uniformly.
```

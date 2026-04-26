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
13. **Half-half working (2026-04-26).** Split every session into two
    halves. **First half:** actual coding / feature work — implement
    the task, test, create PR. **Second half:** update Devin helping
    files (`SKILL.md`, `AGENTS.md`, `issues.md`) with what shipped,
    update the ready-to-paste prompt in §11 with the new last-PR and
    shipped summary so the user can copy-paste it into the next session.
    Never skip the second half — the user needs updated docs and a
    fresh prompt to start the next session efficiently. If quota is
    tight, prioritise the docs update over extra polish on the feature.

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
- PR #198: docs — add half-half working rule (SKILL.md §2 rule #13,
  AGENTS.md rule #9) + fix PR #195→#197 references across all docs.
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
- Toggle options (issue date, QR, mobile no, download date)
- Auto photo enhancement

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
updates aur decisions. Ye default hai — har session mein auto-on.
Quota reminder pe koi message mat do — silently kaam karte raho.

Sabse pehle PAT le lo mere se — GITHUB_PAT_PASSPORTPRINT (fine-grained,
repo-scoped — Contents + Pull requests: Read and write). Session-only
secret hoga. Bina PAT ke aage mat badho.

Studio Print frontend par kaam karo. Repo: loginfaster89-wq/passportprint
(private).

Clone ke baad pehle ye teen files padho:
.agents/skills/studioprint/SKILL.md — Devin recipe
AGENTS.md — full source of truth
issues.md — full audit + §M ID Card Print research + §O Phase 2 multi-card
  + §P Phase 3 Ayushman/Jan Aadhaar/eShram + §Q batch processing
  + §R PVC card tray

Last PR: PR #213 (copy: update ID Card Print nav dropdown + feature card)

Shipped summary (don't redo):
PRs #70–#213: all previous work shipped
- PRs #70–#189: original audit + Document Sheet + ID Card Print Phase 1
- PR #190: docs update
- PR #191: ID Card Print Phase 2 — photo editing (brightness/contrast/
  saturation sliders with live preview)
- PR #192: docs update
- PR #193: ID Card Print Phase 2 — multi-card A4 layout (5 pairs per
  sheet, cut marks, layout toggle)
- PR #194: ID Card Print Phase 2 — rounded corners toggle (canvas
  clip-path with arcTo, preview + A4 sheet)
- PR #197: fix rounded corners var shadowing bug in buildMultiCardSheet
- PR #198: docs — add half-half working rule
- PR #199: docs — mark shipped Phase 2 items + update prompt
- PR #201: docs — fill Voter ID task in prompt, update AGENTS.md
- PR #202: ID Card Print Phase 2 — Voter ID multi-page PDF support
- PR #203: ID Card Print Phase 2 — Dragon sheet (4×6) layout
- PR #205: ID Card Print Phase 3 — Ayushman/Jan Aadhaar/eShram support
- PR #206: docs — add §P section + update prompt
- PR #208: ID Card Print Phase 3 — batch processing (multiple PDFs)
- PR #209: docs — mark batch shipped, add §Q, update prompt
- PR #210: ID Card Print Phase 3 — PVC card tray layout (Epson L805/L8050)
- PR #212: docs — mark PVC tray shipped, add §R, update prompt
- PR #213: copy — update ID Card Print nav dropdown + feature card

ID Card Print current state:
- Phase 1 MVP COMPLETE + VERIFIED (PR #188)
- Phase 2 COMPLETE — all items shipped:
  photo editing (#191), multi-card A4 (#193), cut marks (#193),
  rounded corners (#194/#197), Voter ID (#202), Dragon sheet (#203)
- Phase 3 PARTIAL — Ayushman/Jan Aadhaar/eShram (#205) + batch (#208)
  + PVC tray (#210) shipped. Remaining: toggles, auto enhance

Test PDFs repo mein saved hain:
test-pdfs/pan-test.pdf (password: 05071999)
test-pdfs/aadhaar-test.pdf (password: SUNI1986)

TASK: <yahan task likho>

Remaining Phase 3 features listed in SKILL.md §9 — do NOT implement
unless explicitly asked.
```

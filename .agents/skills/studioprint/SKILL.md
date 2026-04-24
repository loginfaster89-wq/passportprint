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

Everything from PRs #70–#150 is shipped. See `issues.md` for the full
audit trail. Do NOT re-fix any of the following — they are all merged:

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
- PR #150: pricing section full redesign — comparison table replaced
  with 3 plan cards (Free / Weekly / Monthly). Bigger text (24px names,
  46px prices, 16px features), "Best value" badge on Monthly, accent
  border + glow on featured card. Mobile (≤900px) stacks cards
  vertically in single column, max-width 440px. Each card lists all
  6 features with ✓/— markers, tagline, and CTA button.

**Pricing section design rule (post PR #150):** The pricing section uses
card-based layout (`.plan-grid` with `.plan-card` divs), NOT a `<table>`.
Text must stay large and readable — minimum 16px for feature text, 24px
for plan names, 42px+ for prices. On mobile (≤900px) cards stack
vertically. Never shrink text below these minimums. If adding features,
add them to all 3 cards consistently.

**Open:** only `F7` GSI iframe warnings (not our code, harmless).
Backlog is empty — next session can propose new features or fresh audit.

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

Studio Print frontend par kaam karo. Repo: loginfaster89-wq/passportprint
(private) PAT: GITHUB_PAT_PASSPORTPRINT (fine-grained, repo-scoped —
Contents + Pull requests: Read and write on this repo). Agar saved
secret na mile to session-only provide karunga.

Clone ke baad pehle ye teen files padho:

.agents/skills/studioprint/SKILL.md — Devin recipe (build/preview,
hard rules, PAT curl snippet, Hinglish style, §9 merged/open backlog).
AGENTS.md — full source of truth.
issues.md — 2026-04-23 site audit + 2026-04-24 §D responsive / flow
follow-up + §E full re-audit + §F footer cleanup + §G single-feature
glorification cleanup.
last pr - PR #150 (pricing section full redesign — plan cards)

Shipped summary (don't redo):

PRs #70–#114: all original audit quick-wins + responsive + flow fixes.
PRs #118–#132: stats-grid slider, self-host fonts, lang switcher,
step-bar progress, audience grid, AI download bar, F11 empty space,
error banner, frame-corners, 768px breakpoint, font preload.
PRs #134+#137: FAQPage + WebApplication JSON-LD.
PR #139: footer/UX cleanup (F14–F19).
PR #141: single-feature glorification cleanup (G1–G5).
PR #142: BreadcrumbList + Organization JSON-LD, max-image-preview.
PR #143: pricing cards removed, buy buttons in comparison table,
trust pills 2-row, footer email icon removed.
PR #145: hero eyebrow pill shrunk + text changed to
"No uploads · Print-ready", one-at-a-time rule added.
PR #147: terse-mode prompt + pricing table polish.
PRs #148+#149: pricing table text size increase.
PR #150: pricing section full redesign — comparison table replaced
with plan cards, bigger text, mobile-friendly stacked layout.

<yahan apna task likho>
```

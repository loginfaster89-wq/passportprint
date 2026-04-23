# Studio Print frontend — Devin skill

Condensed working recipe for this repo. `AGENTS.md` at the repo root is still
the source of truth; this skill captures the most-used commands and rules so
a new Devin session can start quickly without re-reading everything.

## Repo shape

Plain static HTML/CSS/JS. No framework, no dev server. Deploys to
Cloudflare Pages (project `studioprint`) on push to `main` via
`.github/workflows/deploy.yml`. The deploy workflow does **not** run on PR
branches — there is no auto CF Pages preview per PR.

Key files:

- `index.html` — homepage (hero / features / audience / why / how / pricing / FAQ / CTA).
- `passport-photo.html` — the live passport-photo tool (5000+ lines, inline CSS/JS, inline nav + auth copies, hash-open `#plans` script). **Copy / meta / text-node edits only by default.** Structural / JS changes need explicit user approval.
- `about.html`, `contact.html`, `privacy.html`, `terms.html`, `refund.html`, `shipping.html` — legal / info pages sharing header + footer.
- `assets/auth.js` + `auth.css` — shared login / signup / OTP / Google modal + account modal.
- `assets/nav.js`, `assets/legal.css` — shared nav + legal page styles.
- `build.js` — minifies HTML and obfuscates inline JS into `dist/`.

## Build + preview

```bash
npm install
npm run build                                  # outputs dist/
npx http-server dist -p 8080                   # or:
python3 -m http.server 8080 --directory dist
```

For a quick shareable pre-merge preview, deploy `dist/` to Devin's frontend
host — CF Pages only builds on push to `main`.

## Hard rules (from AGENTS.md — do not break)

1. Do **not** edit `passport-photo.html` structure / JS / onclick / IDs / DOM. Copy-only edits (text nodes, `LANG.en.*` string literals, meta tags) are allowed; anything else needs explicit user approval.
2. Do **not** edit `.github/workflows/*.yml` unless the user confirms `GITHUB_PAT_PASSPORTPRINT` has the `Actions: Read and write` scope.
3. **Pricing numbers** — `free: 2 sheets/day`, `weekly: ₹59 / 7 days`, `monthly: ₹149 / 30 days` — appear in `index.html`, `terms.html`, `refund.html`, `shipping.html`. If they change, update all four.
4. Do **not** commit secrets. `CLOUDFLARE_API_TOKEN`, `GITHUB_PAT_*`, Razorpay / Google OAuth secrets live only in GitHub / Render settings.
5. Do **not** fork shared modules (`assets/auth.*`, `assets/nav.js`, `assets/legal.css`) into per-page copies. `passport-photo.html` has its own inline copies of the nav / auth markup — any shared-module change must stay compatible.
6. Fonts (`Syne`, `DM Mono`), palette (`--bg: #0D0D0D`, `--accent: #F0A500`) and the existing CSS variables (`--surface`, `--surface2`, `--border`, `--muted`, `--muted2`, `--accent-dim`, `--text`, `--success`) — **do not add new tokens or change values**. Structure, copy, and placement changes are fine.
7. Keep diffs minimal — one PR per logical task.

## PR workflow

The Devin GitHub App is installed on both Studio Print repos, but Devin's git
user is usually not the repo owner, so `git` / `git_pr` tools often return
`Not Found`. In that case fall back to the fine-grained PAT
`GITHUB_PAT_PASSPORTPRINT` (Contents + Pull requests: Read and write):

```bash
# Clone
git clone "https://x-access-token:${GITHUB_PAT_PASSPORTPRINT}@github.com/loginfaster89-wq/passportprint.git"

# Create PR via REST
curl -sS -X POST \
  -H "Authorization: Bearer $GITHUB_PAT_PASSPORTPRINT" \
  -H "Accept: application/vnd.github+json" \
  -H "Content-Type: application/json" \
  -d @pr_body.json \
  https://api.github.com/repos/loginfaster89-wq/passportprint/pulls

# Update PR (title / body) — PATCH
curl -sS -X PATCH \
  -H "Authorization: Bearer $GITHUB_PAT_PASSPORTPRINT" \
  -H "Accept: application/vnd.github+json" \
  -H "Content-Type: application/json" \
  -d @pr_patch.json \
  https://api.github.com/repos/loginfaster89-wq/passportprint/pulls/<number>

# List workflow runs for a branch
curl -sS -H "Authorization: Bearer $GITHUB_PAT_PASSPORTPRINT" \
  "https://api.github.com/repos/loginfaster89-wq/passportprint/actions/runs?branch=<branch>&per_page=5"
```

The deploy workflow only runs on `push: [main]`, so PR branches do **not**
trigger CI or a Cloudflare Pages deployment automatically. The quickest way
to show the user a pre-merge preview is to run `npm run build` locally and
deploy `dist/` to Devin's frontend preview.

## Copy / design tone

- Dark theme, Syne + DM Mono, amber `#F0A500` accent — feel should stay "modern print-shop tooling", not corporate SaaS.
- **Current (post-PR #61 2026 refresh) framing** — match this voice for any new copy:
  - Homepage hero eyebrow: `On-device AI · Built in India · New in 2026`
  - Homepage H1: `Every print job. One browser tab.`
  - CTA band closer: `Your next print job — right in this tab.`
  - About tagline: `The on-device AI print studio for 2026 — built for Indian print shops, students and home users.`
  - Passport-photo title: `Passport Photo Tool — AI, 300 DPI A4 Sheet, Browser-Based · Studio Print`

## Communication style

Project owner is non-technical, prefers **short Hinglish** replies, and
actively watches quota usage.

1. Read the relevant files first, then summarise the change in a **short
   Hinglish plan** — list exactly which files / sections will change.
2. Wait for approval before large edits; small copy tweaks can proceed
   once the user has given a blanket "full control / aapke pass hai"
   approval.
3. Keep explanations concise. Link the PR and a preview URL as soon as
   both exist.
4. Run `npm run build` locally before reporting done.
5. Prefer a single consolidated status message over many small ones — the
   user watches quota closely.

## End-of-session: refresh this skill + give user a new-chat prompt

At the **end of every session**, before reporting done, check whether
anything *notable* changed that a future Devin session would want to know:

- A new **hard rule** (what to touch / not touch).
- A **new shared module**, workflow, or CLI the next session should use.
- A **change in copy tone / branding** (new hero tagline, pricing copy,
  taglines quoted in the "Copy / design tone" section above).
- A new **PR / deploy / testing workflow** (e.g. a new preview host, a new
  CI stage, a new way to verify a change).
- A **new secret / PAT scope / credential** the next session will need.

If *any* of those changed, open a **small separate follow-up PR** that:

1. Updates the relevant section(s) of this `SKILL.md` (keep diff minimal —
   edit existing sections, do not duplicate).
2. If tone/branding changed, update the quoted examples in the
   "Copy / design tone" section to match the site today.
3. Is clearly titled `chore: refresh Devin skill after <short reason>` and
   body notes which prior PR(s) this reflects.

Then, in the final `message_user` of the session, **also include a
refreshed copy-paste "new-chat prompt"** that the project owner can paste
into their next Devin chat. The prompt should:

- Point to this repo and the `GITHUB_PAT_PASSPORTPRINT` secret.
- Tell the next Devin to read `.agents/skills/studioprint/SKILL.md` **and**
  `AGENTS.md` before starting.
- List the 2-3 most recent relevant PRs as context.
- Leave a placeholder line like `Mera aaj ka kaam: <YAHAN APNA NAYA TASK LIKHO>`
  for the owner to fill in.
- End with a reminder of default rules (passport-photo copy-only, no
  workflow edits, fonts/palette untouched, one PR per logical task, run
  `npm run build`, quota-conscious Hinglish replies).

If nothing notable changed in a given session, **skip both** the skill-refresh
PR and the new-chat prompt — don't create churn. Just report done normally.

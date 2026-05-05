# Studio Print Work Locks

Last updated: 2026-05-06 00:08 IST

## Global edit lock

**Status:** ACTIVE
**Owner:** ChatGPT Codex UI polish chat
**Scope:** Shared UI/cache polish: assets/legal.css, assets/auth.css/js if needed, assets/pricing.css, index.html, passport-photo.html, id-print.html, forms.html, _headers, sw.js, generated dist outputs, and .agents status docs.
**Started:** 2026-05-05 22:06 IST
**Notes:** Paused overnight at user request. Source WIP is local only, not deployed: cache freshness v64, shared auth/pricing polish, auto pill/card marquees, and responsive header/content spacing are partially implemented. Resume from the same local workspace, verify with build + mobile/desktop smoke tests, then deploy only after approval.

## Mandatory rule

Before any chat edits files, pushes commits, or starts a deploy, it must:

1. Run `git pull --ff-only origin main`.
2. Read `.agents/work-locks.md`, `.agents/live-status.md`, and `.agents/handoff.md`.
3. Run `.agents/check-work-lock.ps1`.
4. If the global edit lock is `ACTIVE`, stop and ask the user before touching files.
5. If the lock is `FREE`, declare owned scope in chat before editing.

## Taking the lock

For any work that will edit shared files, push to `main`, or deploy live:

1. Change `Status` to `ACTIVE`.
2. Set `Owner`, `Scope`, `Started`, and `Notes`.
3. Commit and push that lock-only change first.
4. Re-run `git pull --ff-only origin main`.
5. Do the actual work.

If another chat pushes a lock first, the second chat must stop.

## Releasing the lock

When the work is finished:

1. Set `Status` back to `FREE`.
2. Set `Owner`, `Scope`, and `Started` back to `none`.
3. Add a short completion note.
4. Commit and push the release with the finished work or as a small follow-up commit.

## Deploy lock

Deploying to Cloudflare Pages also requires the global edit lock. No other chat should push source changes while a production deploy is running.

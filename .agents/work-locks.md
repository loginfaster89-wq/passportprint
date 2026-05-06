# Studio Print Work Locks

Last updated: 2026-05-06 16:46 IST

## Global edit lock

**Status:** ACTIVE
**Owner:** Codex Research & Grow chat
**Scope:** SEO structured-data batch plus CSP report-only warning fix (`id-print.html`, `forms.html`, `_headers`, generated `dist/id-print.html`, generated `dist/forms.html`, generated `dist/_headers`, and `.agents` status notes)
**Started:** 2026-05-06 16:41 IST
**Notes:** Adding focused JSON-LD structured data to ID Print and Forms Hub after audit found both pages have metadata/canonicals but no structured data. Live QA also found `upgrade-insecure-requests` creates browser console errors when delivered inside CSP Report-Only, so this lock also removes that report-only-only warning. Do not touch Forms data/PDF assets, service worker/cache JS, tool UI behavior, or unrelated pages from this lock.

## Mandatory rule

Before any chat edits files, pushes commits, or starts a deploy, it must:

1. Run `git pull --ff-only origin main`.
2. Read `.agents/work-locks.md`, `.agents/live-status.md`, and `.agents/handoff.md`.
3. Run `.agents/check-work-lock.ps1`.
4. Declare owned file scope, user impact, main risk, success criteria, and verification plan.
5. If a live/deploy lock is `ACTIVE`, stop before editing, pushing, or deploying.
6. If a scoped work lock is `ACTIVE`, compare scopes:
   - If your files overlap the active scope, stop and ask the user.
   - If your files are disjoint, continue the assigned task without touching the locked files.
7. Stage and commit only your owned files.

## Taking the lock

Take the lock only for live/deploy work, broad shared app-shell/cache/config work,
or a task that is likely to overlap another chat's files.

For independent feature/page work with a clearly disjoint file scope, do not take
the global lock just to research or implement. Finish the assigned task, then
coordinate before committing/pushing if another chat is touching shared files.

1. Change `Status` to `ACTIVE`.
2. Set `Owner`, `Scope`, `Started`, and `Notes`.
3. Make the scope precise enough that another chat can tell whether its work overlaps.
4. Commit and push that lock-only change first.
5. Re-run `git pull --ff-only origin main`.
6. Do the actual work.

If another chat pushes a lock first, the second chat must stop only when its
owned scope overlaps the active scope or the active scope is deploy/live.
Otherwise it may continue with disjoint files and must stage only owned paths.

## Releasing the lock

When the work is finished:

1. Set `Status` back to `FREE`.
2. Set `Owner`, `Scope`, and `Started` back to `none`.
3. Add a short completion note.
4. Commit and push the release with the finished work or as a small follow-up commit.

## Deploy lock

Deploying to Cloudflare Pages also requires the global edit lock. No other chat should push source changes while a production deploy is running.

## Parallel work rule

Multiple chats are useful only when they keep moving on different scopes. A chat
should not stop just because another chat is working on unrelated files.

- Continue research, implementation, and local verification for your assigned
  task when your owned files are disjoint from the active lock.
- Stop immediately if you need the same file, `.agents` coordination files,
  shared cache/app-shell files (`sw.js`, `_headers`, root app-shell HTML/CSS/JS),
  generated `dist/**`, or live deployment ownership.
- Before final commit/push, run `git pull --ff-only origin main`, re-check
  `.agents/work-locks.md`, and stage only owned files.
- Before live deploy, always take the deploy lock and wait if anyone else is
  deploying or preparing a production release.

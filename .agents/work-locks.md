# Studio Print Work Locks

Last updated: 2026-05-06 15:52 IST

## Global edit lock

**Status:** FREE
**Owner:** none
**Scope:** none
**Started:** none
**Notes:** SEO/security indexability batch completed and deployed on 2026-05-06 15:49 IST. Latest deploy commit: `c3fb019` (`fix(seo): redirect html routes to canonicals`). Research & Grow oversight docs are in place; future chats should still declare owned scope and re-check locks before editing.

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

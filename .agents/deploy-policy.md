# Studio Print Deploy Policy

Last updated: 2026-05-05 IST

## Production deploy rule

Production deploys are manual only.

Parallel chats may work on separate source scopes, but no chat should trigger a live deploy by pushing an empty retry commit or repeatedly re-running deploys without coordination. One deploy owner must collect the ready changes, verify the build, and run the GitHub Actions workflow manually.

## Before deploying

1. Run `git pull --ff-only origin main`.
2. Read `.agents/work-locks.md`, `.agents/live-status.md`, and `.agents/handoff.md`.
3. Run `.agents/check-work-lock.ps1`.
4. Take the global edit lock in `.agents/work-locks.md` and push that lock before deploying.
5. Confirm no other chat is in the middle of a source push or deploy.
6. Run the project build and focused validation for the files being released.
7. Record the latest commit with `git rev-parse origin/main`.

## How to deploy

1. Open GitHub Actions.
2. Select `Deploy to Cloudflare Pages`.
3. Click `Run workflow`.
4. Use branch `main`.
5. Fill `reason` with a short release note.
6. Fill `expected_sha` with the latest `origin/main` SHA.
7. Wait for the workflow to finish.
8. Verify live pages before telling Search Console or users that the update is live.
9. Release the global edit lock after live verification.

## If deploy fails

- If GitHub says the hosted runner was not acquired, wait and use `Re-run jobs` from the failed run. Do not create empty commits just to retry.
- If Cloudflare returns an internal server error, use `Re-run jobs` once or twice. If it keeps failing, wait and retry later because the code may already be valid.
- If the build fails, fix the source issue in a normal scoped commit, then run one manual deploy after the fix is on `main`.

## Search Console verification

Google Search Console verification should be attempted only after live HTML contains the verification meta tag on `https://studioprint.pages.dev/`.

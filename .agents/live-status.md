# Studio Print Live Status

Last updated: 2026-05-03 IST

## Current task status

- Current owner: this chat owns Forms PDF expansion only.
- Active task: research and add high-value Rajasthan PDFs/forms valid for 2026 to the Forms page.
- Task result: 19 official Rajasthan form/document PDFs added locally; Forms page now has 35 total forms and 26 Rajasthan forms.
- Build result: `node build.js` completed successfully after adding forms and bumping `sw.js` to `studioprint-v33`.
- Local QA result: built `dist/forms.html` opened in headless Chrome via system Chrome; total count `35`, searches for `birth` and `contract labour` showed the expected new cards; no page errors.
- Live QA result: `https://studioprint.pages.dev/forms` returned new entries (`Labour Beneficiary`, `SSO ID Update`), `https://studioprint.pages.dev/sw.js` returned `studioprint-v33`, and sample PDF/preview assets returned HTTP 200.
- Owned file scope before source edits: `forms.html`, `assets/forms/manifest.json`, `assets/forms/*.pdf`, `assets/forms/previews/**`, `build.js` only if required, `sw.js` for cache-version bump only, and `.agents/live-status.md` / `.agents/handoff.md`.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, or `assets/legal.css` unless separately coordinated.
- Coordination files restored/created so parallel Codex chats can see the current repo state.
- Parallel chats must start from this repo path: `C:\Users\ajayt\Documents\Codex\2026-05-01\hu`
- Before doing any work, run:
  - `git pull --ff-only origin main`
  - `Get-Content .agents\live-status.md`
  - `Get-Content .agents\handoff.md`
- Local repo was reset back to `origin/main` after two local-only commits were found.
- Current branch: `main`
- Latest verified website source HEAD: `1761f922030f17cf117e0dac8ab2aee832c20135` (`fix(cache): stop long caching pwa registration`)
- Local state checked clean before this coordination-file update: `main...origin/main`
- GitHub remote access checked with `git ls-remote --heads origin main`.
- Push dry-run checked with `git push --dry-run origin main`: `Everything up-to-date`.
- Coordination docs are committed to `main`; use `git log --oneline -3` for the latest coordination commit SHA.

## Changed files in this status update

- `.agents/live-status.md`
- `.agents/handoff.md`
- `forms.html`
- `assets/forms/manifest.json`
- `assets/forms/*.pdf` new Rajasthan forms
- `assets/forms/previews/**` new optimized previews
- `sw.js`
- `dist/forms.html`
- `dist/sw.js`

## Shared files touched

- `sw.js` touched only for cache-version bump to `studioprint-v33`.
- `forms.html` touched for Forms page data only.
- Did not touch `index.html`, `id-print.html`, `passport-photo.html`, or `assets/legal.css`.

## Commit / deploy / QA

- Website source commit pushed in this status update: `9c3a4cb629b3d2a728df5812178bea33d32670f1` (`feat(forms): add Rajasthan 2026 form PDFs`).
- Coordination docs pushed in this status update: yes.
- Deploy triggered for website source in this status update: yes.
- Build run in this status update: yes, `node build.js` passed.
- Live QA run in this status update: passed.

## Pending work

- If ID Print work resumes, start from current `origin/main` instead of old scratch commits.
- Before any live push: run `node build.js` or the repo build command, bump `sw.js` cache version if HTML/assets change, then verify live after deploy.
- Keep diffs minimum and do not re-add scratch QA images or temporary crop-analysis files to `main`.
- Residual local dirty files not owned by this Forms task: generated/stale `dist/_headers`, `dist/about.html`, `dist/contact.html`, `dist/id-print.html`, `dist/privacy.html`, `dist/refund.html`, `dist/shipping.html`, and `dist/terms.html`; do not stage them without checking with the owner of that work.

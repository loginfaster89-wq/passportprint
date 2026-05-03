# Handoff For Parallel Codex Chats

Last updated: 2026-05-03 IST

Current repo path used in this chat: `C:\Users\ajayt\Documents\Codex\2026-05-01\hu`

## Required start commands

Every parallel chat should start in:

`C:\Users\ajayt\Documents\Codex\2026-05-01\hu`

Then run:

```powershell
git pull --ff-only origin main
Get-Content .agents\live-status.md
Get-Content .agents\handoff.md
```

## Summary

- Current owner: this chat owns Forms PDF expansion only.
- Active task: research and add high-value Rajasthan PDFs/forms valid for 2026 to the Forms page.
- Task result: 19 official Rajasthan form/document PDFs added locally; Forms page now has 35 total forms and 26 Rajasthan forms.
- Build result: `node build.js` completed successfully after adding forms and bumping `sw.js` to `studioprint-v33`.
- Local QA result: built `dist/forms.html` opened in headless Chrome via system Chrome; total count `35`, searches for `birth` and `contract labour` showed the expected new cards; no page errors.
- Live QA result: `https://studioprint.pages.dev/forms` returned new entries (`Labour Beneficiary`, `SSO ID Update`), `https://studioprint.pages.dev/sw.js` returned `studioprint-v33`, and sample PDF/preview assets returned HTTP 200.
- Website source commit pushed: `9c3a4cb629b3d2a728df5812178bea33d32670f1` (`feat(forms): add Rajasthan 2026 form PDFs`).
- Owned file scope before source edits: `forms.html`, `assets/forms/manifest.json`, `assets/forms/*.pdf`, `assets/forms/previews/**`, `build.js` only if required, `sw.js` for cache-version bump only, and `.agents/live-status.md` / `.agents/handoff.md`.
- Explicitly not owned: `id-print.html`, `passport-photo.html`, `index.html`, or `assets/legal.css` unless separately coordinated.
- User asked to clean GitHub/local state after `git status` showed `main` was ahead of `origin/main` by 2 commits.
- The two local-only commits contained many temporary QA/crop PNGs and scratch files, so they were not safe to push.
- User ran:
  - `git reset --hard origin/main`
  - `git clean -fd`
- Repo was brought back to `origin/main` before this docs-only coordination update.
- Latest verified website source HEAD: `1761f922030f17cf117e0dac8ab2aee832c20135` (`fix(cache): stop long caching pwa registration`)
- Coordination docs are now committed on top of that source commit; use `git log --oneline -3` for the latest docs commit SHA.
- GitHub remote was checked and push dry-run returned `Everything up-to-date`.

## Coordination note

- Website source files changed in this handoff update: `forms.html`, `assets/forms/manifest.json`, new `assets/forms` PDFs/previews, `sw.js`, plus built `dist/forms.html` and `dist/sw.js`.
- Do not stage or overwrite unrelated dirty `id-print.html` / ID Print screenshots from another chat.
- Residual local dirty files not owned by this Forms task: generated/stale `dist/_headers`, `dist/about.html`, `dist/contact.html`, `dist/id-print.html`, `dist/privacy.html`, `dist/refund.html`, `dist/shipping.html`, and `dist/terms.html`.
- If another chat is working on the live website, it can proceed from clean `origin/main` and should avoid reintroducing previous local scratch artifacts.

## Next suggested action

- For new ID Print fixes, first inspect current `id-print.html` from `origin/main`, run a local build, and verify upload behavior before changing crop logic.
- Use minimum diff and update this file again before/after pushing live.

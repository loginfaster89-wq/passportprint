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

- This chat worked only on Forms cleanup.
- User reported that some newly-added Rajasthan Forms PDFs were scanned, filled, signed, or dirty; those are not acceptable for the Forms Hub.
- Removed 7 bad entries/assets: Labour Beneficiary, Shop Act Form 3, Life Certificate, Family Pension Forms, Birth Application, Death Application, Self Declaration.
- Added 7 clean blank official Rajasthan Pension PDFs/assets: Pension Form 2, Pension Form 5, Pension Form 5A, Pension Form 6, Pension Form 14A, Pension Form 30, Medical Limit Form.
- Cache bumped to `studioprint-v34`.
- `node build.js` passed.
- Local QA passed: manifest assets/previews/page-previews all exist; headless Chrome search smoke test passed with no console/page errors.
- Live QA passed: `/forms` shows the replacement clean forms and removed dirty titles are absent; `/sw.js` has `studioprint-v34`; sample PDF and preview URLs returned HTTP 200.
- Source commit pushed to `main`: `f9196c82b38f0c5bbb0e19205f29a50e3669a4c7` (`fix(forms): replace dirty Rajasthan PDFs`).

## Coordination note

- Do not touch `id-print.html` from this Forms thread. Another chat owns ID Print work.
- Current owned Forms scope: `forms.html`, `assets/forms/manifest.json`, `assets/forms/*.pdf`, `assets/forms/previews/**`, `sw.js`, `dist/forms.html`, `dist/sw.js`, `.agents/live-status.md`, `.agents/handoff.md`.
- Legacy `Ration Card` preview still appears sideways/scan-like. It was left untouched in this commit because it predates the bad batch; handle it in a separate focused Forms pass if needed.
- Residual local dirty files not owned by this task: `dist/_headers`, `dist/about.html`, `dist/contact.html`, `dist/id-print.html`, `dist/privacy.html`, `dist/refund.html`, `dist/shipping.html`, `dist/terms.html`.

## Next suggested action

- If continuing Forms quality work, audit legacy Rajasthan entries one-by-one and replace only when a clean blank official source is found.
- If continuing ID Print work, first pull latest `main` and do not reuse old local `dist/id-print.html` changes.

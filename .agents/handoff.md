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

- This chat worked only on Forms cleanup. Do not mix this with ID Print work.
- User clarified a hard quality bar: Forms Hub must not contain filled, signed, pen-written, watermarked, old-date, dark/black, rotated, broken-text, or unclear-purpose PDFs.
- Full current Forms library was audited from manifest: 46 forms, 106 pages, 0 automated rotation/dark/page-count flags after cleanup.
- Visual contact sheet reviewed: `C:\tmp\forms-full-audit-20260503-resume\contact.jpg`.
- Replaced outdated PAN 49A / 49AA listing with official 2026 Income Tax PAN allotment forms:
  - PAN Form 93 - Individual Indian Applicant
  - PAN Form 94 - Non-Individual Indian Applicant
  - PAN Form 95 - Individual Foreign Applicant
  - PAN Form 96 - Non-Individual Foreign Applicant
- Added official Election Commission Voter Form 6A - Overseas Elector.
- Clarified existing form titles/descriptions by exact use case across Rajasthan Food/NFSA, Scholarship income declaration, Marriage, Character, Shop Act, Contract Labour, BOCW, Trade Union, Jan Aadhaar, Pension, SSO, Aadhaar, PAN, Voter, and EPFO.
- Ration-card PDF rotation metadata and previews regenerated upright.
- EPFO Composite Claim Non-Aadhaar official alternate found but not added because official EPFO PDF download timed out repeatedly in this environment. Keep pending; do not add third-party copies.
- Cache bumped to `studioprint-v37`.
- `node build.js` passed using bundled Node.
- Local QA passed in installed Chrome: total `46`, search smoke passed for Voter 6A / PAN 93 / PAN 96 / Shop Act Form 4 / Contract Labour Form IV / EPFO Form 11 / Ration; `Medical Limit` absent; Voter 6A preview modal opened; no page/console errors.
- Live QA passed after propagation: `/forms` shows Voter 6A, PAN 93, Shop Act purpose labels; no PAN 49A / Medical Limit; `/sw.js` has `studioprint-v37`; sample new PDF/preview URLs returned HTTP 200.
- Source commit pushed to `main`: `3ade9b3f7200ab45cf33c65b55381b477c88083f` (`fix(forms): audit form purposes and update 2026 PAN`).

## Coordination note

- Do not touch `id-print.html` from this Forms thread. Another chat owns ID Print work.
- Current owned Forms scope: `forms.html`, `assets/forms/manifest.json`, `assets/forms/*.pdf`, `assets/forms/previews/**`, `sw.js`, `dist/forms.html`, `dist/sw.js`, selected tracked `dist/assets/forms/previews/pages/*` cleanup, `.agents/live-status.md`, `.agents/handoff.md`.
- Residual local dirty files not owned by this task: `dist/_headers`, `dist/about.html`, `dist/contact.html`, `dist/privacy.html`, `dist/refund.html`, `dist/shipping.html`, `dist/terms.html`.

## Future Forms Rule

- Before adding any new form, research the official source and the real service workflow first.
- Confirm what the form is used for, how counters/users use it, whether separate versions exist for new/update/correction/caste/age/resident/NRI/foreign/non-individual cases, and whether the PDF is valid/current for the intended use case.
- Only list clean blank official PDFs. If only third-party scans are available, leave the form pending instead of listing low-quality material.
